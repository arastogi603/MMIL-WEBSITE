package com.mmil.backend.modules.recruitment;

import com.mmil.backend.modules.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "recruitment_applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "candidate_id", nullable = false)
    private User candidate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "recruitment_cycle_id", nullable = false)
    private Recruitment recruitmentCycle;

    @Column(nullable = false)
    private String resumeUrl;

    @Column(nullable = false)
    private String yearOfStudy; // e.g., "1st Year", "2nd Year"

    @Column(nullable = false)
    private String branch; // e.g., "CSE", "IT", "ECE"

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getCandidate() { return candidate; }
    public void setCandidate(User candidate) { this.candidate = candidate; }

    public Recruitment getRecruitmentCycle() { return recruitmentCycle; }
    public void setRecruitmentCycle(Recruitment recruitmentCycle) { this.recruitmentCycle = recruitmentCycle; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(String yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
