package com.mmil.backend.modules.recruitment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RecruitmentRepository extends JpaRepository<Recruitment, UUID> {
    Optional<Recruitment> findByCycleSlug(String cycleSlug);
    
    @Query("SELECT r FROM Recruitment r WHERE r.status = 'active' ORDER BY r.startDate DESC")
    List<Recruitment> findActiveCycles();
}
