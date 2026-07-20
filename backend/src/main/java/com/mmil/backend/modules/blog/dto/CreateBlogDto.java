package com.mmil.backend.modules.blog.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateBlogDto {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String coverImage;
    private String category;

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
