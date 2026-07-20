package com.mmil.backend.modules.setting.dto;

public class DashboardStatsDto {
    private long pendingProjects;
    private long activeEvents;
    private long totalMembers;
    private String serverStatus;

    public DashboardStatsDto(long pendingProjects, long activeEvents, long totalMembers, String serverStatus) {
        this.pendingProjects = pendingProjects;
        this.activeEvents = activeEvents;
        this.totalMembers = totalMembers;
        this.serverStatus = serverStatus;
    }

    public long getPendingProjects() {
        return pendingProjects;
    }

    public void setPendingProjects(long pendingProjects) {
        this.pendingProjects = pendingProjects;
    }

    public long getActiveEvents() {
        return activeEvents;
    }

    public void setActiveEvents(long activeEvents) {
        this.activeEvents = activeEvents;
    }

    public long getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(long totalMembers) {
        this.totalMembers = totalMembers;
    }

    public String getServerStatus() {
        return serverStatus;
    }

    public void setServerStatus(String serverStatus) {
        this.serverStatus = serverStatus;
    }
}
