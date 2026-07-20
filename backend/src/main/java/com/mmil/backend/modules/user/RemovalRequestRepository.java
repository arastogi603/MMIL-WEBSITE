package com.mmil.backend.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RemovalRequestRepository extends JpaRepository<RemovalRequest, UUID> {
    List<RemovalRequest> findByStatusOrderByCreatedAtDesc(String status);
    boolean existsByTargetUserIdAndStatus(UUID targetUserId, String status);
}
