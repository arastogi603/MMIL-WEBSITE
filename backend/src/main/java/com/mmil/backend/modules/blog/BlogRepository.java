package com.mmil.backend.modules.blog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BlogRepository extends JpaRepository<Blog, UUID> {
    Optional<Blog> findBySlug(String slug);
    
    @Query("SELECT b FROM Blog b WHERE b.status = 'published' ORDER BY b.createdAt DESC")
    List<Blog> findPublishedBlogs();
    
    List<Blog> findByCategoryAndStatusOrderByCreatedAtDesc(String category, String status);
}
