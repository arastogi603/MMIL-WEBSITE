package com.mmil.backend.modules.event.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdatePptDto {
    @NotBlank
    private String pptLink;

    public String getPptLink() { return pptLink; }
    public void setPptLink(String pptLink) { this.pptLink = pptLink; }
}
