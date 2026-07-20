package com.mmil.backend.modules.recruitment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateRecruitmentDto {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Cycle slug is required")
    private String cycleSlug;

    private String description;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCycleSlug() { return cycleSlug; }
    public void setCycleSlug(String cycleSlug) { this.cycleSlug = cycleSlug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
}
