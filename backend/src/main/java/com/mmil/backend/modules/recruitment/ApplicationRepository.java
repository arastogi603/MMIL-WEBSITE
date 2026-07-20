package com.mmil.backend.modules.recruitment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {
    List<Application> findByRecruitmentCycleIdOrderByCreatedAtDesc(UUID recruitmentCycleId);
    List<Application> findAllByOrderByCreatedAtDesc();
    boolean existsByCandidateIdAndRecruitmentCycleId(UUID candidateId, UUID recruitmentCycleId);
}
