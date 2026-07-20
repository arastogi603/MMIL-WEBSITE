package com.mmil.backend.modules.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    Optional<Team> findByJoinCode(String joinCode);
    boolean existsByJoinCode(String joinCode);
    boolean existsByEventIdAndLeaderId(UUID eventId, UUID leaderId);
    java.util.List<Team> findByEventId(UUID eventId);
    void deleteByEventId(UUID eventId);
}
