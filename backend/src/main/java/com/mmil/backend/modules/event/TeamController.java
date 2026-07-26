package com.mmil.backend.modules.event;

import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.event.dto.CreateTeamDto;
import com.mmil.backend.modules.event.dto.JoinTeamDto;
import com.mmil.backend.modules.event.dto.TeamResponseDto;
import com.mmil.backend.modules.event.dto.TeamMemberDto;
import com.mmil.backend.modules.event.dto.UpdatePptDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class TeamController {

    private final EmailOtpService otpService;
    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final EventRegistrationRepository registrationRepository;
    private final com.mmil.backend.modules.user.UserRepository userRepository;
    private final TeamJoinRequestRepository joinRequestRepository;

    public TeamController(EmailOtpService otpService, EventRepository eventRepository, TeamRepository teamRepository, EventRegistrationRepository registrationRepository, com.mmil.backend.modules.user.UserRepository userRepository, TeamJoinRequestRepository joinRequestRepository) {
        this.otpService = otpService;
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.joinRequestRepository = joinRequestRepository;
    }

    @PostMapping("/otp/send")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        otpService.sendOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP Sent to Email"));
    }

    @PostMapping("/events/{slug}/teams")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createTeam(
            @PathVariable String slug, 
            @Valid @RequestBody CreateTeamDto dto, 
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        // 1. Verify OTP
        if (!otpService.verifyOtp(dto.getEmail(), dto.getOtp())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        }

        // 2. Check Event
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!Boolean.TRUE.equals(event.getIsTeamEvent())) {
            return ResponseEntity.badRequest().body(Map.of("message", "This is not a team event"));
        }

        com.mmil.backend.modules.user.User user = userRepository.findById(authUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (teamRepository.existsByEventIdAndLeaderId(event.getId(), user.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "You already lead a team in this event"));
        }

        // 3. Create Team
        String joinCode = generateJoinCode();
        Team team = new Team();
        team.setName(dto.getName());
        team.setEvent(event);
        team.setLeader(user);
        team.setPhone(dto.getPhone());
        team.setEmail(dto.getEmail());
        team.setCollegeName(dto.getCollegeName());
        team.setDistrict(dto.getDistrict());
        team.setState(dto.getState());
        team.setJoinCode(joinCode);
        teamRepository.save(team);

        EventRegistration reg = new EventRegistration();
        reg.setEvent(event);
        reg.setUser(user);
        reg.setTeam(team);
        reg.setPhone(dto.getPhone());
        reg.setCollegeName(dto.getCollegeName());
        reg.setDistrict(dto.getDistrict());
        reg.setState(dto.getState());
        registrationRepository.save(reg);

        event.setSeatsTaken(event.getSeatsTaken() + 1);
        eventRepository.save(event);

        return ResponseEntity.ok(Map.of("message", "Team created", "joinCode", joinCode));
    }

    @PostMapping("/events/{slug}/teams/join")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> joinTeam(
            @PathVariable String slug, 
            @Valid @RequestBody JoinTeamDto dto, 
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        String joinCode = dto.getJoinCode();
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Team team = teamRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new RuntimeException("Invalid join code"));

        if (!team.getEvent().getId().equals(event.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Join code is for a different event"));
        }

        com.mmil.backend.modules.user.User user = userRepository.findById(authUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (registrationRepository.existsByEventIdAndUserId(event.getId(), user.getId())) {
             return ResponseEntity.badRequest().body(Map.of("message", "You are already registered for this event"));
        }

        if (joinRequestRepository.existsByTeamIdAndUserIdAndStatus(team.getId(), user.getId(), "PENDING")) {
             return ResponseEntity.badRequest().body(Map.of("message", "You already have a pending join request for this team"));
        }

        TeamJoinRequest request = new TeamJoinRequest();
        request.setEvent(event);
        request.setUser(user);
        request.setTeam(team);
        request.setPhone(dto.getPhone());
        request.setCollegeName(dto.getCollegeName());
        request.setDistrict(dto.getDistrict());
        request.setState(dto.getState());
        joinRequestRepository.save(request);

        return ResponseEntity.ok(Map.of("message", "Join request sent to team leader"));
    }

    @GetMapping("/events/{slug}/teams/requests")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getJoinRequests(
            @PathVariable String slug, 
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventRegistration myReg = registrationRepository.findByEventIdAndUserId(event.getId(), authUser.getId())
                .orElseThrow(() -> new RuntimeException("Not registered"));

        Team team = myReg.getTeam();
        if (team == null || !team.getLeader().getId().equals(authUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only team leader can view requests"));
        }

        List<TeamJoinRequest> requests = joinRequestRepository.findByTeamIdAndStatus(team.getId(), "PENDING");
        
        List<Map<String, Object>> response = requests.stream().map(r -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", r.getId());
            map.put("name", r.getUser().getName());
            map.put("email", r.getUser().getEmail());
            map.put("collegeName", r.getCollegeName());
            map.put("phone", r.getPhone());
            map.put("createdAt", r.getCreatedAt());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/events/{slug}/teams/requests/{requestId}/approve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> approveJoinRequest(
            @PathVariable String slug, 
            @PathVariable UUID requestId,
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        TeamJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getEvent().getId().equals(event.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid event for request"));
        }

        if (!request.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Request is already processed"));
        }

        Team team = request.getTeam();
        if (!team.getLeader().getId().equals(authUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only team leader can approve requests"));
        }

        if (team.getIsLocked()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Team is locked, no new members can be added"));
        }

        // Optional: Check Max Size
        if (event.getTeamSizeMax() != null) {
            long currentMembers = registrationRepository.findByTeamId(team.getId()).size();
            if (currentMembers >= event.getTeamSizeMax()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Team has reached maximum capacity"));
            }
        }

        request.setStatus("APPROVED");
        joinRequestRepository.save(request);

        EventRegistration reg = new EventRegistration();
        reg.setEvent(event);
        reg.setUser(request.getUser());
        reg.setTeam(team);
        reg.setPhone(request.getPhone());
        reg.setCollegeName(request.getCollegeName());
        reg.setDistrict(request.getDistrict());
        reg.setState(request.getState());
        registrationRepository.save(reg);

        event.setSeatsTaken(event.getSeatsTaken() + 1);
        eventRepository.save(event);

        return ResponseEntity.ok(Map.of("message", "Request approved"));
    }

    @PostMapping("/events/{slug}/teams/requests/{requestId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> rejectJoinRequest(
            @PathVariable String slug, 
            @PathVariable UUID requestId,
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        TeamJoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Team team = request.getTeam();
        if (!team.getLeader().getId().equals(authUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only team leader can reject requests"));
        }

        if (!request.getStatus().equals("PENDING")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Request is already processed"));
        }

        request.setStatus("REJECTED");
        joinRequestRepository.save(request);

        return ResponseEntity.ok(Map.of("message", "Request rejected"));
    }

    @GetMapping("/events/{slug}/teams/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyTeam(
            @PathVariable String slug, 
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventRegistration userReg = registrationRepository.findByEventIdAndUserId(event.getId(), authUser.getId())
                .orElse(null);

        if (userReg == null || userReg.getTeam() == null) {
            return ResponseEntity.notFound().build();
        }

        Team team = userReg.getTeam();
        List<EventRegistration> members = registrationRepository.findByTeamId(team.getId());

        TeamResponseDto response = new TeamResponseDto();
        response.setId(team.getId());
        response.setName(team.getName());
        response.setJoinCode(team.getJoinCode());
        response.setMinSize(event.getTeamSizeMin());
        response.setMaxSize(event.getTeamSizeMax());
        response.setIsViewerLeader(team.getLeader().getId().equals(authUser.getId()));
        response.setIsLocked(team.getIsLocked());
        response.setPptLink(team.getPptLink());
        response.setStatus(team.getStatus());
        response.setRound1Score(team.getRound1Score());
        response.setRound2Score(team.getRound2Score());
        response.setRound3Score(team.getRound3Score());

        List<TeamMemberDto> memberDtos = members.stream().map(m -> {
            TeamMemberDto dto = new TeamMemberDto();
            dto.setRegistrationId(m.getId());
            dto.setName(m.getUser().getName());
            dto.setEmail(m.getUser().getEmail());
            dto.setPhone(m.getPhone());
            dto.setCollegeName(m.getCollegeName());
            dto.setIsLeader(team.getLeader().getId().equals(m.getUser().getId()));
            return dto;
        }).collect(Collectors.toList());

        response.setMembers(memberDtos);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/events/{slug}/teams/members/{registrationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> removeMember(
            @PathVariable String slug, 
            @PathVariable UUID registrationId, 
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventRegistration memberReg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!memberReg.getEvent().getId().equals(event.getId()) || memberReg.getTeam() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid registration"));
        }

        Team team = memberReg.getTeam();

        if (!team.getLeader().getId().equals(authUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only the leader can remove members"));
        }

        if (memberReg.getUser().getId().equals(authUser.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Leader cannot remove themselves. Delete team instead."));
        }

        registrationRepository.delete(memberReg);
        event.setSeatsTaken(event.getSeatsTaken() - 1);
        eventRepository.save(event);

        return ResponseEntity.ok(Map.of("message", "Member removed successfully"));
    }

    @PostMapping("/events/{slug}/teams/my/lock")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> lockTeam(
            @PathVariable String slug, 
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventRegistration userReg = registrationRepository.findByEventIdAndUserId(event.getId(), authUser.getId())
                .orElse(null);

        if (userReg == null || userReg.getTeam() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "You are not in a team"));
        }

        Team team = userReg.getTeam();

        if (!team.getLeader().getId().equals(authUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only the leader can lock the team"));
        }

        List<EventRegistration> members = registrationRepository.findByTeamId(team.getId());
        if (event.getTeamSizeMin() != null && members.size() < event.getTeamSizeMin()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Minimum team size not met. (" + members.size() + "/" + event.getTeamSizeMin() + ")"));
        }

        team.setIsLocked(true);
        teamRepository.save(team);

        return ResponseEntity.ok(Map.of("message", "Team locked successfully"));
    }

    @PutMapping("/events/{slug}/teams/my/ppt")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePpt(
            @PathVariable String slug,
            @Valid @RequestBody UpdatePptDto dto,
            @AuthenticationPrincipal com.mmil.backend.modules.user.User authUser) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        EventRegistration userReg = registrationRepository.findByEventIdAndUserId(event.getId(), authUser.getId())
                .orElse(null);

        if (userReg == null || userReg.getTeam() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "You are not in a team"));
        }

        Team team = userReg.getTeam();

        if (!team.getLeader().getId().equals(authUser.getId())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only the leader can update the PPT"));
        }

        if (!Boolean.TRUE.equals(team.getIsLocked())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Team must be locked before submitting PPT"));
        }

        team.setPptLink(dto.getPptLink());
        teamRepository.save(team);

        return ResponseEntity.ok(Map.of("message", "PPT Link updated successfully"));
    }

    private String generateJoinCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder("MMIL-");
        Random rnd = new Random();
        for (int i = 0; i < 5; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
