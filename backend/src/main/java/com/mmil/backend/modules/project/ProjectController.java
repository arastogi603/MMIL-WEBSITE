package com.mmil.backend.modules.project;

import com.mmil.backend.modules.project.dto.CreateProjectDto;
import com.mmil.backend.modules.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getPublicProjects() {
        return ResponseEntity.ok(projectService.getPublicProjects());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Project> getProjectBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(projectService.getProjectBySlug(slug));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Project> submitProject(
            @Valid @RequestBody CreateProjectDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectService.submitProject(dto, user.getId()));
    }

    @PostMapping("/{slug}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Project> updateStatus(
            @PathVariable String slug,
            @RequestParam String status) {
        return ResponseEntity.ok(projectService.updateStatus(slug, status));
    }
}
