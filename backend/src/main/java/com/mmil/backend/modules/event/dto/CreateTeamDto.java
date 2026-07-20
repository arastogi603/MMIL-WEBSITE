package com.mmil.backend.modules.event.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateTeamDto {
    @NotBlank(message = "Team name is required")
    private String name;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "College name is required")
    private String collegeName;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "OTP is required")
    private String otp;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }
    
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
