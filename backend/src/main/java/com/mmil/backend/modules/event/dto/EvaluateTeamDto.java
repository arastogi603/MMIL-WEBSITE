package com.mmil.backend.modules.event.dto;

public class EvaluateTeamDto {
    private String status; // ROUND_1, ROUND_2, ROUND_3, ELIMINATED, WINNER_1...
    private Integer round1Score;
    private Integer round2Score;
    private Integer round3Score;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRound1Score() { return round1Score; }
    public void setRound1Score(Integer round1Score) { this.round1Score = round1Score; }

    public Integer getRound2Score() { return round2Score; }
    public void setRound2Score(Integer round2Score) { this.round2Score = round2Score; }

    public Integer getRound3Score() { return round3Score; }
    public void setRound3Score(Integer round3Score) { this.round3Score = round3Score; }
}
