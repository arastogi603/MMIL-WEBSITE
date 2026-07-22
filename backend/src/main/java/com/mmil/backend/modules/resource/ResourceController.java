package com.mmil.backend.modules.resource;

import com.mmil.backend.modules.resource.dto.CreateResourceFolderDto;
import com.mmil.backend.modules.resource.dto.CreateResourceItemDto;
import com.mmil.backend.modules.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping("/folders")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ResourceFolder>> getAllFolders() {
        return ResponseEntity.ok(resourceService.getAllFolders());
    }

    @GetMapping("/folders/{folderId}/items")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ResourceItem>> getItemsByFolder(@PathVariable UUID folderId) {
        return ResponseEntity.ok(resourceService.getItemsByFolder(folderId));
    }

    @PostMapping("/folders")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<ResourceFolder> createFolder(@Valid @RequestBody CreateResourceFolderDto dto) {
        return ResponseEntity.ok(resourceService.createFolder(dto));
    }

    @DeleteMapping("/folders/{folderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> deleteFolder(@PathVariable UUID folderId) {
        resourceService.deleteFolder(folderId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/folders/{folderId}/items")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<ResourceItem> createItem(
            @PathVariable UUID folderId,
            @Valid @RequestBody CreateResourceItemDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(resourceService.createItem(folderId, dto, user));
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> deleteItem(@PathVariable UUID itemId) {
        resourceService.deleteItem(itemId);
        return ResponseEntity.ok().build();
    }
}
