package com.mmil.backend.modules.event.dto;

import java.util.UUID;

public class TeamMemberDto {
    private UUID registrationId;
    private String name;
    private String email;
    private String collegeName;
    private boolean isLeader;

    // Getters and Setters
    public UUID getRegistrationId() { return registrationId; }
    public void setRegistrationId(UUID registrationId) { this.registrationId = registrationId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public boolean getIsLeader() { return isLeader; }
    public void setIsLeader(boolean isLeader) { this.isLeader = isLeader; }
}
