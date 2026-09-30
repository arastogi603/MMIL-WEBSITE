package com.mmil.backend.modules.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/public/team")
public class PublicTeamController {

    private final UserRepository userRepository;

    public PublicTeamController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getPublicTeam() {
        List<UserDto> users = userRepository.findAll()
                .stream()
                .filter(u -> !u.getRole().equalsIgnoreCase("student") && !u.getRole().equalsIgnoreCase("user"))
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setLinkedInUrl(user.getLinkedInUrl());
        return dto;
    }

    public static class UserDto {
        private java.util.UUID id;
        private String name;
        private String email;
        private String role;
        private String avatarUrl;
        private String linkedInUrl;

        public java.util.UUID getId() { return id; }
        public void setId(java.util.UUID id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public String getLinkedInUrl() { return linkedInUrl; }
        public void setLinkedInUrl(String linkedInUrl) { this.linkedInUrl = linkedInUrl; }
    }
}
