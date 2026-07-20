package com.mmil.backend.modules.event.dto;

import jakarta.validation.constraints.NotBlank;

public class JoinTeamDto {
    @NotBlank(message = "Join code is required")
    private String joinCode;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "College name is required")
    private String collegeName;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    // Getters and Setters
    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
}
