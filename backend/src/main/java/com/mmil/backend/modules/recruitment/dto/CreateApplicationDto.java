package com.mmil.backend.modules.recruitment.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateApplicationDto {
    
    @NotBlank
    private String resumeUrl;
    
    @NotBlank
    private String yearOfStudy;
    
    @NotBlank
    private String branch;
    
    private String skills;

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }
}
