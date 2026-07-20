package com.mmil.backend.modules.event;

import com.mmil.backend.modules.event.dto.EvaluateTeamDto;
import com.mmil.backend.modules.event.dto.TeamMemberDto;
import com.mmil.backend.modules.event.dto.TeamResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/events/{slug}/teams")
public class AdminTeamController {

    private final EventRepository eventRepository;
    private final TeamRepository teamRepository;
    private final EventRegistrationRepository registrationRepository;

    public AdminTeamController(EventRepository eventRepository, TeamRepository teamRepository, EventRegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.teamRepository = teamRepository;
        this.registrationRepository = registrationRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> getAllTeams(@PathVariable String slug) {
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Team> teams = teamRepository.findByEventId(event.getId());

        List<TeamResponseDto> dtos = teams.stream().map(team -> {
            TeamResponseDto response = new TeamResponseDto();
            response.setId(team.getId());
            response.setName(team.getName());
            response.setJoinCode(team.getJoinCode());
            response.setMinSize(event.getTeamSizeMin());
            response.setMaxSize(event.getTeamSizeMax());
            response.setIsViewerLeader(false);
            response.setIsLocked(team.getIsLocked());
            response.setPptLink(team.getPptLink());
            response.setStatus(team.getStatus());
            response.setRound1Score(team.getRound1Score());
            response.setRound2Score(team.getRound2Score());
            response.setRound3Score(team.getRound3Score());
            
            // Only add leader name for simple listing to save bandwidth, or load all. Let's load all for now.
            List<EventRegistration> members = registrationRepository.findByTeamId(team.getId());
            List<TeamMemberDto> memberDtos = members.stream().map(m -> {
                TeamMemberDto dto = new TeamMemberDto();
                dto.setRegistrationId(m.getId());
                dto.setName(m.getUser().getName());
                dto.setEmail(m.getUser().getEmail());
                dto.setCollegeName(m.getCollegeName());
                dto.setIsLeader(team.getLeader().getId().equals(m.getUser().getId()));
                return dto;
            }).collect(Collectors.toList());
            
            response.setMembers(memberDtos);
            return response;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{teamId}/evaluate")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> evaluateTeam(
            @PathVariable String slug,
            @PathVariable UUID teamId,
            @Valid @RequestBody EvaluateTeamDto dto) {
        
        Event event = eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getEvent().getId().equals(event.getId())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Team does not belong to this event"));
        }

        if (dto.getStatus() != null) team.setStatus(dto.getStatus());
        if (dto.getRound1Score() != null) team.setRound1Score(dto.getRound1Score());
        if (dto.getRound2Score() != null) team.setRound2Score(dto.getRound2Score());
        if (dto.getRound3Score() != null) team.setRound3Score(dto.getRound3Score());

        teamRepository.save(team);

        return ResponseEntity.ok(Map.of("message", "Team evaluated successfully"));
    }
}
