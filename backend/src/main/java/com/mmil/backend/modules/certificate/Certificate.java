package com.mmil.backend.modules.certificate;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "certificates")
public class Certificate {

    @Id
    private String id; // Typically an alphanumeric short ID for easy public verification (e.g. MMIL-2026-ABCD)

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "event_id", nullable = false)
    private UUID eventId;

    @Column(nullable = false)
    private String certificateType; // e.g., "Participation", "Winner", "Runner-Up", "Organizer"

    private String pdfUrl;

    private String issueDescription; // e.g. "For securing 1st place in Hackathon 2026"

    @Column(nullable = false, updatable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    
    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }
    
    public String getCertificateType() { return certificateType; }
    public void setCertificateType(String certificateType) { this.certificateType = certificateType; }
    
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    
    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }
    
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
}
