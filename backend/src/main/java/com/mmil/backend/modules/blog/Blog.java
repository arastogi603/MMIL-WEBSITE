package com.mmil.backend.modules.blog;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "blogs")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String coverImage;

    private String category; // e.g., "Technology", "Events", "Tutorials"

    private String status = "draft"; // draft, in_review, published

    @Column(name = "author_id", nullable = false)
    private UUID authorId;

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
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public UUID getAuthorId() { return authorId; }
    public void setAuthorId(UUID authorId) { this.authorId = authorId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @PreUpdate
    public void setLastUpdate() { this.updatedAt = LocalDateTime.now(); }
}
