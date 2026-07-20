package com.mmil.backend.modules.certificate;

import com.mmil.backend.modules.certificate.dto.IssueCertificateDto;
import com.mmil.backend.modules.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String certificateId) {
        return ResponseEntity.ok(certificateService.verifyCertificate(certificateId));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Certificate>> getMyCertificates(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(certificateService.getUserCertificates(user.getId()));
    }

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Certificate> issueCertificate(@Valid @RequestBody IssueCertificateDto dto) {
        return ResponseEntity.ok(certificateService.issueCertificate(dto));
    }
}
