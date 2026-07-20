package com.mmil.backend.modules.project.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateProjectDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String repositoryUrl;
    private String liveDemoUrl;
    private String thumbnailImage;
    private List<String> technologies;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRepositoryUrl() { return repositoryUrl; }
    public void setRepositoryUrl(String repositoryUrl) { this.repositoryUrl = repositoryUrl; }

    public String getLiveDemoUrl() { return liveDemoUrl; }
    public void setLiveDemoUrl(String liveDemoUrl) { this.liveDemoUrl = liveDemoUrl; }

    public String getThumbnailImage() { return thumbnailImage; }
    public void setThumbnailImage(String thumbnailImage) { this.thumbnailImage = thumbnailImage; }

    public List<String> getTechnologies() { return technologies; }
    public void setTechnologies(List<String> technologies) { this.technologies = technologies; }
}

