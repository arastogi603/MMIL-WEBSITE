package com.mmil.backend.modules.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResourceItemRepository extends JpaRepository<ResourceItem, UUID> {
    List<ResourceItem> findByFolderId(UUID folderId);
}
