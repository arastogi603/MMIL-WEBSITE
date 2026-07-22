package com.mmil.backend.modules.resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ResourceFolderRepository extends JpaRepository<ResourceFolder, UUID> {
}
