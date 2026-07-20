package com.mmil.backend.modules.certificate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, String> {
    List<Certificate> findByUserIdOrderByIssuedAtDesc(UUID userId);
    List<Certificate> findByEventId(UUID eventId);
    boolean existsByUserIdAndEventId(UUID userId, UUID eventId);
}
