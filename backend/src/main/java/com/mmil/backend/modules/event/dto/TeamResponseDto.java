package com.mmil.backend.modules.event.dto;

import java.util.List;
import java.util.UUID;

public class TeamResponseDto {
    private UUID id;
    private String name;
    private String joinCode;
    private Integer minSize;
    private Integer maxSize;
    private List<TeamMemberDto> members;
    private boolean isViewerLeader;
    private Boolean isLocked;
    private String pptLink;
    private String status;
    private Integer round1Score;
    private Integer round2Score;
    private Integer round3Score;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }

    public Integer getMinSize() { return minSize; }
    public void setMinSize(Integer minSize) { this.minSize = minSize; }

    public Integer getMaxSize() { return maxSize; }
    public void setMaxSize(Integer maxSize) { this.maxSize = maxSize; }

    public List<TeamMemberDto> getMembers() { return members; }
    public void setMembers(List<TeamMemberDto> members) { this.members = members; }

    public boolean getIsViewerLeader() { return isViewerLeader; }
    public void setIsViewerLeader(boolean viewerLeader) { isViewerLeader = viewerLeader; }

    public Boolean getIsLocked() { return isLocked; }
    public void setIsLocked(Boolean isLocked) { this.isLocked = isLocked; }

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
}
