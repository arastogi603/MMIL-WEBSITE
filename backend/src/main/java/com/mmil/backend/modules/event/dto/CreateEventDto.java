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
    private String posterUrl;

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

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    private LocalDateTime round1StartsAt;
    private LocalDateTime round1EndsAt;
    private String round2Type;
    private String round2Address;
    private LocalDateTime round2StartsAt;
    private LocalDateTime round2EndsAt;
    private LocalDateTime round3StartsAt;
    private LocalDateTime round3EndsAt;

    public LocalDateTime getRound1StartsAt() { return round1StartsAt; }
    public void setRound1StartsAt(LocalDateTime round1StartsAt) { this.round1StartsAt = round1StartsAt; }

    public LocalDateTime getRound1EndsAt() { return round1EndsAt; }
    public void setRound1EndsAt(LocalDateTime round1EndsAt) { this.round1EndsAt = round1EndsAt; }

    public String getRound2Type() { return round2Type; }
    public void setRound2Type(String round2Type) { this.round2Type = round2Type; }

    public String getRound2Address() { return round2Address; }
    public void setRound2Address(String round2Address) { this.round2Address = round2Address; }

    public LocalDateTime getRound2StartsAt() { return round2StartsAt; }
    public void setRound2StartsAt(LocalDateTime round2StartsAt) { this.round2StartsAt = round2StartsAt; }

    public LocalDateTime getRound2EndsAt() { return round2EndsAt; }
    public void setRound2EndsAt(LocalDateTime round2EndsAt) { this.round2EndsAt = round2EndsAt; }

    public LocalDateTime getRound3StartsAt() { return round3StartsAt; }
    public void setRound3StartsAt(LocalDateTime round3StartsAt) { this.round3StartsAt = round3StartsAt; }

    public LocalDateTime getRound3EndsAt() { return round3EndsAt; }
    public void setRound3EndsAt(LocalDateTime round3EndsAt) { this.round3EndsAt = round3EndsAt; }
}
