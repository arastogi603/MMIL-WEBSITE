package com.mmil.backend.modules.event;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String type; // event, hackathon, workshop

    private String location;

    private String status = "draft"; // draft, published, cancelled, completed

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private LocalDateTime registrationOpensAt;
    private LocalDateTime registrationClosesAt;

    private Integer capacity;
    
    private Integer seatsTaken = 0;

    private Boolean isTeamEvent = false;

    private Integer teamSizeMin;
    private Integer teamSizeMax;

    private String domain; // Frontend, AI, Cloud, etc.
    
    @Column(name = "poster_url")
    private String posterUrl; // Optional URL for custom event poster

    private LocalDateTime round1StartsAt;
    private LocalDateTime round1EndsAt;
    private String round2Type; // ONLINE or OFFLINE
    private String round2Address;
    private LocalDateTime round2StartsAt;
    private LocalDateTime round2EndsAt;
    private LocalDateTime round3StartsAt;
    private LocalDateTime round3EndsAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    private Long version;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }
    
    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
    
    public LocalDateTime getRegistrationOpensAt() { return registrationOpensAt; }
    public void setRegistrationOpensAt(LocalDateTime registrationOpensAt) { this.registrationOpensAt = registrationOpensAt; }
    
    public LocalDateTime getRegistrationClosesAt() { return registrationClosesAt; }
    public void setRegistrationClosesAt(LocalDateTime registrationClosesAt) { this.registrationClosesAt = registrationClosesAt; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Integer getSeatsTaken() { return seatsTaken; }
    public void setSeatsTaken(Integer seatsTaken) { this.seatsTaken = seatsTaken; }
    
    public Boolean getIsTeamEvent() { return isTeamEvent; }
    public void setIsTeamEvent(Boolean teamEvent) { isTeamEvent = teamEvent; }
    
    public Integer getTeamSizeMin() { return teamSizeMin; }
    public void setTeamSizeMin(Integer teamSizeMin) { this.teamSizeMin = teamSizeMin; }
    
    public Integer getTeamSizeMax() { return teamSizeMax; }
    public void setTeamSizeMax(Integer teamSizeMax) { this.teamSizeMax = teamSizeMax; }
    
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    
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

    @PreUpdate
    public void setLastUpdate() { this.updatedAt = LocalDateTime.now(); }
}
