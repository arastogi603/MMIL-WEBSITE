package com.mmil.backend.modules.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class CreateEventDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Type is required")
    private String type;
    
    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private String description;
    private String location;
    private Integer capacity;

    private Boolean isTeamEvent;
    private Integer teamSizeMin;
    private Integer teamSizeMax;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Boolean getIsTeamEvent() { return isTeamEvent; }
    public void setIsTeamEvent(Boolean isTeamEvent) { this.isTeamEvent = isTeamEvent; }

    public Integer getTeamSizeMin() { return teamSizeMin; }
    public void setTeamSizeMin(Integer teamSizeMin) { this.teamSizeMin = teamSizeMin; }

    public Integer getTeamSizeMax() { return teamSizeMax; }
    public void setTeamSizeMax(Integer teamSizeMax) { this.teamSizeMax = teamSizeMax; }
}
