package com.mmil.backend.modules.alumni;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, UUID> {
    List<Alumni> findAllByOrderByBatchYearDesc();
}
