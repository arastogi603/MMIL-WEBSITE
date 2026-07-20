package com.mmil.backend.modules.certificate;

import com.mmil.backend.modules.certificate.dto.IssueCertificateDto;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public CertificateService(CertificateRepository certificateRepository) {
        this.certificateRepository = certificateRepository;
    }

    public Certificate verifyCertificate(String certificateId) {
        return certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Invalid Certificate ID"));
    }

    public List<Certificate> getUserCertificates(UUID userId) {
        return certificateRepository.findByUserIdOrderByIssuedAtDesc(userId);
    }

    public Certificate issueCertificate(IssueCertificateDto dto) {
        if (certificateRepository.existsByUserIdAndEventId(dto.getUserId(), dto.getEventId())) {
            throw new RuntimeException("Certificate already issued for this user and event");
        }

        Certificate cert = new Certificate();
        cert.setId(generateCertificateId());
        cert.setUserId(dto.getUserId());
        cert.setEventId(dto.getEventId());
        cert.setCertificateType(dto.getCertificateType());
        cert.setIssueDescription(dto.getIssueDescription());
        // In a real scenario, this would trigger a background job to generate PDF & upload to S3/Cloudinary

        return certificateRepository.save(cert);
    }

    private String generateCertificateId() {
        String year = String.valueOf(Year.now().getValue());
        String randomStr = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "MMIL-" + year + "-" + randomStr;
    }
}
