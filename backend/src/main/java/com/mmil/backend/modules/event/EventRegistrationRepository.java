package com.mmil.backend.modules.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {
    boolean existsByEventIdAndUserId(UUID eventId, UUID userId);
    Optional<EventRegistration> findByEventIdAndUserId(UUID eventId, UUID userId);
    List<EventRegistration> findByTeamId(UUID teamId);
    void deleteByEventId(UUID eventId);
}
