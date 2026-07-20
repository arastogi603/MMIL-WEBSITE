package com.mmil.backend.modules.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Optional<Project> findBySlug(String slug);
    long countByStatus(String status);

    
    @Query("SELECT p FROM Project p WHERE p.status = 'approved' OR p.status = 'featured' ORDER BY p.createdAt DESC")
    List<Project> findPublicProjects();
    
    List<Project> findBySubmittedByUserId(UUID userId);
}
