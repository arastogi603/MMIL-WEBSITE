package com.mmil.backend.modules.event;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamJoinRequestRepository extends JpaRepository<TeamJoinRequest, UUID> {
    List<TeamJoinRequest> findByTeamIdAndStatus(UUID teamId, String status);
    boolean existsByTeamIdAndUserIdAndStatus(UUID teamId, UUID userId, String status);
    Optional<TeamJoinRequest> findByIdAndTeamId(UUID id, UUID teamId);
}
