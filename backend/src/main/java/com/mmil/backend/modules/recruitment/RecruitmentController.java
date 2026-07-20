package com.mmil.backend.modules.recruitment;

import com.mmil.backend.modules.recruitment.dto.CreateRecruitmentDto;
import com.mmil.backend.modules.recruitment.dto.CreateApplicationDto;
import com.mmil.backend.modules.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recruitment")
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    public RecruitmentController(RecruitmentService recruitmentService) {
        this.recruitmentService = recruitmentService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<Recruitment>> getActiveCycles() {
        return ResponseEntity.ok(recruitmentService.getActiveCycles());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Recruitment>> getAllCycles() {
        return ResponseEntity.ok(recruitmentService.getAllCycles());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Recruitment> getCycleBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(recruitmentService.getCycleBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Recruitment> createCycle(@Valid @RequestBody CreateRecruitmentDto dto) {
        return ResponseEntity.ok(recruitmentService.createCycle(dto));
    }

    @PostMapping("/{slug}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Recruitment> activateCycle(@PathVariable String slug) {
        return ResponseEntity.ok(recruitmentService.activateCycle(slug));
    }

    @PostMapping("/{slug}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Recruitment> closeCycle(@PathVariable String slug) {
        return ResponseEntity.ok(recruitmentService.closeCycle(slug));
    }

    @PostMapping("/{slug}/apply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Application> submitApplication(
            @PathVariable String slug,
            @Valid @RequestBody CreateApplicationDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(recruitmentService.submitApplication(slug, dto, user.getId()));
    }

    @GetMapping("/applications")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(recruitmentService.getAllApplications());
    }

    @PutMapping("/applications/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(recruitmentService.updateApplicationStatus(id, status));
    }
}
