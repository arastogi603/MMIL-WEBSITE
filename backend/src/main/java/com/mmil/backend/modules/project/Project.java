package com.mmil.backend.modules.project;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String repositoryUrl;
    private String liveDemoUrl;
    private String thumbnailImage;

    private String status = "pending"; // pending, approved, rejected, featured

    @ElementCollection
    private List<String> technologies;

    @Column(name = "submitted_by_user_id", nullable = false)
    private UUID submittedByUserId;

    private String submittedByName;

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
    
    public String getRepositoryUrl() { return repositoryUrl; }
    public void setRepositoryUrl(String repositoryUrl) { this.repositoryUrl = repositoryUrl; }
    
    public String getLiveDemoUrl() { return liveDemoUrl; }
    public void setLiveDemoUrl(String liveDemoUrl) { this.liveDemoUrl = liveDemoUrl; }
    
    public String getThumbnailImage() { return thumbnailImage; }
    public void setThumbnailImage(String thumbnailImage) { this.thumbnailImage = thumbnailImage; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }
    
    public UUID getSubmittedByUserId() { return submittedByUserId; }
    public void setSubmittedByUserId(UUID submittedByUserId) { this.submittedByUserId = submittedByUserId; }
    
    public String getSubmittedByName() { return submittedByName; }
    public void setSubmittedByName(String submittedByName) { this.submittedByName = submittedByName; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @PreUpdate
    public void setLastUpdate() { this.updatedAt = LocalDateTime.now(); }
}
