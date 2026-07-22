package com.mmil.backend.modules.resource;

import com.mmil.backend.modules.resource.dto.CreateResourceFolderDto;
import com.mmil.backend.modules.resource.dto.CreateResourceItemDto;
import com.mmil.backend.modules.user.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ResourceService {

    private final ResourceFolderRepository folderRepository;
    private final ResourceItemRepository itemRepository;

    public ResourceService(ResourceFolderRepository folderRepository, ResourceItemRepository itemRepository) {
        this.folderRepository = folderRepository;
        this.itemRepository = itemRepository;
    }

    public List<ResourceFolder> getAllFolders() {
        return folderRepository.findAll();
    }

    public ResourceFolder getFolderById(UUID id) {
        return folderRepository.findById(id).orElseThrow(() -> new RuntimeException("Folder not found"));
    }

    public List<ResourceItem> getItemsByFolder(UUID folderId) {
        return itemRepository.findByFolderId(folderId);
    }

    public ResourceFolder createFolder(CreateResourceFolderDto dto) {
        ResourceFolder folder = new ResourceFolder();
        folder.setName(dto.getName());
        folder.setDescription(dto.getDescription());
        return folderRepository.save(folder);
    }

    public void deleteFolder(UUID id) {
        folderRepository.deleteById(id);
    }

    public ResourceItem createItem(UUID folderId, CreateResourceItemDto dto, User publisher) {
        ResourceFolder folder = getFolderById(folderId);
        ResourceItem item = new ResourceItem();
        item.setFolder(folder);
        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setTechStack(dto.getTechStack());
        item.setUrl(dto.getUrl());
        item.setPublishedBy(publisher);
        return itemRepository.save(item);
    }

    public void deleteItem(UUID itemId) {
        itemRepository.deleteById(itemId);
    }
}
