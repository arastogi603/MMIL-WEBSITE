package com.mmil.backend.modules.alumni;

import com.mmil.backend.modules.alumni.dto.CreateAlumniDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alumni")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @GetMapping
    public ResponseEntity<List<Alumni>> getAllAlumni() {
        return ResponseEntity.ok(alumniService.getAllAlumni());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alumni> getAlumniById(@PathVariable UUID id) {
        return ResponseEntity.ok(alumniService.getAlumniById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Alumni> createAlumni(@Valid @RequestBody CreateAlumniDto dto) {
        return ResponseEntity.ok(alumniService.createAlumni(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Alumni> updateAlumni(@PathVariable UUID id, @Valid @RequestBody CreateAlumniDto dto) {
        return ResponseEntity.ok(alumniService.updateAlumni(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> deleteAlumni(@PathVariable UUID id) {
        alumniService.deleteAlumni(id);
        return ResponseEntity.ok().build();
    }
}
