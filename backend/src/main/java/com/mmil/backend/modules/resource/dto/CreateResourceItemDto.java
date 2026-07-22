package com.mmil.backend.modules.resource.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

public class CreateResourceItemDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private List<String> techStack;

    @NotBlank(message = "URL is required")
    private String url;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<String> getTechStack() { return techStack; }
    public void setTechStack(List<String> techStack) { this.techStack = techStack; }
    
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
