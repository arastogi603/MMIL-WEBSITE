package com.mmil.backend.modules.event;

import com.mmil.backend.modules.user.User;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String joinCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", nullable = false)
    private com.mmil.backend.modules.user.User leader;

    private String collegeName;
    private String district;
    private String state;
    private String phone;
    private String email;

    @Column(nullable = false)
    @ColumnDefault("false")
    private Boolean isLocked = false;

    private String pptLink;

    @Column(nullable = false)
    @ColumnDefault("'REGISTERED'")
    private String status = "REGISTERED"; // REGISTERED, ROUND_1, ROUND_2, ROUND_3, ELIMINATED, WINNER_1, WINNER_2, WINNER_3

    private Integer round1Score = 0;
    private Integer round2Score = 0;
    private Integer round3Score = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public com.mmil.backend.modules.user.User getLeader() { return leader; }
    public void setLeader(com.mmil.backend.modules.user.User leader) { this.leader = leader; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Boolean getIsLocked() { return isLocked; }
    public void setIsLocked(Boolean locked) { isLocked = locked; }

    public String getPptLink() { return pptLink; }
    public void setPptLink(String pptLink) { this.pptLink = pptLink; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRound1Score() { return round1Score; }
    public void setRound1Score(Integer round1Score) { this.round1Score = round1Score; }

    public Integer getRound2Score() { return round2Score; }
    public void setRound2Score(Integer round2Score) { this.round2Score = round2Score; }

    public Integer getRound3Score() { return round3Score; }
    public void setRound3Score(Integer round3Score) { this.round3Score = round3Score; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
