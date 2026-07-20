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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @PreUpdate
    public void setLastUpdate() { this.updatedAt = LocalDateTime.now(); }
}
