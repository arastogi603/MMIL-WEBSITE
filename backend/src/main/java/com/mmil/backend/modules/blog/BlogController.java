package com.mmil.backend.modules.blog;

import com.mmil.backend.modules.blog.dto.CreateBlogDto;
import com.mmil.backend.modules.user.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @GetMapping
    public ResponseEntity<List<Blog>> getPublishedBlogs() {
        return ResponseEntity.ok(blogService.getPublishedBlogs());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Blog> getBlogBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.getBlogBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('CORE-TEAM', 'ADMIN')")
    public ResponseEntity<Blog> createDraft(
            @Valid @RequestBody CreateBlogDto dto,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(blogService.createDraft(dto, user.getId()));
    }

    @PostMapping("/{slug}/publish")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Blog> publishBlog(@PathVariable String slug) {
        return ResponseEntity.ok(blogService.publishBlog(slug));
    }
}
