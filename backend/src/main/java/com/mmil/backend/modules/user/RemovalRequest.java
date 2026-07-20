package com.mmil.backend.modules.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "removal_requests")
public class RemovalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "target_user_id", nullable = false)
    private User targetUser;

    @ManyToOne(optional = false)
    @JoinColumn(name = "requested_by_id", nullable = false)
    private User requestedBy;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getTargetUser() { return targetUser; }
    public void setTargetUser(User targetUser) { this.targetUser = targetUser; }

    public User getRequestedBy() { return requestedBy; }
    public void setRequestedBy(User requestedBy) { this.requestedBy = requestedBy; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
