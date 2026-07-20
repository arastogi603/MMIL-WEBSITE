package com.mmil.backend.modules.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/users")
public class UserController {

    private final UserRepository userRepository;
    private final RemovalRequestRepository removalRequestRepository;

    public UserController(UserRepository userRepository, RemovalRequestRepository removalRequestRepository) {
        this.userRepository = userRepository;
        this.removalRequestRepository = removalRequestRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> updateUserRole(@PathVariable UUID id, @RequestBody UpdateRoleRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Ensure you can't demote the master admin accidentally (safeguard)
        if (user.getEmail().equals("admin@mmil.com")) {
            throw new RuntimeException("Cannot change role of master admin");
        }

        user.setRole(request.getRole());
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(mapToDto(updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getEmail().equals("admin@mmil.com")) {
            throw new RuntimeException("Cannot delete master admin");
        }
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/removal-request")
    @PreAuthorize("hasRole('CORE-TEAM')")
    public ResponseEntity<?> createRemovalRequest(@PathVariable UUID id, Principal principal) {
        User targetUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!"student".equals(targetUser.getRole())) {
            throw new RuntimeException("Can only request removal for students");
        }
        
        if (removalRequestRepository.existsByTargetUserIdAndStatus(id, "PENDING")) {
            throw new RuntimeException("A pending request already exists for this user");
        }

        User requester = userRepository.findByEmail(principal.getName()).orElseThrow();

        RemovalRequest req = new RemovalRequest();
        req.setTargetUser(targetUser);
        req.setRequestedBy(requester);
        removalRequestRepository.save(req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/removal-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RemovalRequestDto>> getRemovalRequests() {
        List<RemovalRequestDto> list = removalRequestRepository.findByStatusOrderByCreatedAtDesc("PENDING")
                .stream().map(this::mapToRemovalRequestDto).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/removal-requests/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveRemovalRequest(@PathVariable UUID id) {
        RemovalRequest req = removalRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus("APPROVED");
        removalRequestRepository.save(req);
        userRepository.delete(req.getTargetUser());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/removal-requests/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectRemovalRequest(@PathVariable UUID id) {
        RemovalRequest req = removalRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus("REJECTED");
        removalRequestRepository.save(req);
        return ResponseEntity.ok().build();
    }

    private RemovalRequestDto mapToRemovalRequestDto(RemovalRequest req) {
        RemovalRequestDto dto = new RemovalRequestDto();
        dto.setId(req.getId());
        dto.setTargetUser(mapToDto(req.getTargetUser()));
        dto.setRequestedBy(mapToDto(req.getRequestedBy()));
        dto.setStatus(req.getStatus());
        dto.setCreatedAt(req.getCreatedAt());
        return dto;
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    // DTOs
    public static class UpdateRoleRequest {
        private String role;
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class UserDto {
        private UUID id;
        private String name;
        private String email;
        private String role;
        private java.time.LocalDateTime createdAt;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class RemovalRequestDto {
        private UUID id;
        private UserDto targetUser;
        private UserDto requestedBy;
        private String status;
        private java.time.LocalDateTime createdAt;

        public UUID getId() { return id; }
        public void setId(UUID id) { this.id = id; }
        public UserDto getTargetUser() { return targetUser; }
        public void setTargetUser(UserDto targetUser) { this.targetUser = targetUser; }
        public UserDto getRequestedBy() { return requestedBy; }
        public void setRequestedBy(UserDto requestedBy) { this.requestedBy = requestedBy; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
