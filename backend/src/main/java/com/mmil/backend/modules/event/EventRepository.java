package com.mmil.backend.modules.event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<Event> findBySlug(String slug);
    long countByStatus(String status);

    
    @Query("SELECT e FROM Event e WHERE e.status = 'published' ORDER BY e.startDate ASC")
    List<Event> findPublishedUpcoming();
}
