package com.mmil.backend.modules.certificate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class IssueCertificateDto {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Event ID is required")
    private UUID eventId;

    @NotBlank(message = "Certificate type is required")
    private String certificateType;

    private String issueDescription;

    // Getters and Setters
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getEventId() { return eventId; }
    public void setEventId(UUID eventId) { this.eventId = eventId; }

    public String getCertificateType() { return certificateType; }
    public void setCertificateType(String certificateType) { this.certificateType = certificateType; }

    public String getIssueDescription() { return issueDescription; }
    public void setIssueDescription(String issueDescription) { this.issueDescription = issueDescription; }
}
