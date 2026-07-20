package com.mmil.backend.modules.auth.dto;

import com.mmil.backend.modules.user.User;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse(String token, User userEntity) {
        this.token = token;
        this.user = new UserDto(userEntity);
    }

    // Getters
    public String getToken() { return token; }
    public UserDto getUser() { return user; }

    // Inner DTO for User payload
    public static class UserDto {
        private String id;
        private String name;
        private String email;
        private String role;
        
        public UserDto(User user) {
            this.id = user.getId().toString();
            this.name = user.getName();
            this.email = user.getEmail();
            this.role = user.getRole();
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
