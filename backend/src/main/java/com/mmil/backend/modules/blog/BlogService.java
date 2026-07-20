package com.mmil.backend.modules.blog;

import com.mmil.backend.modules.blog.dto.CreateBlogDto;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    public List<Blog> getPublishedBlogs() {
        return blogRepository.findPublishedBlogs();
    }

    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Blog post not found"));
    }

    public Blog createDraft(CreateBlogDto dto, UUID authorId) {
        Blog blog = new Blog();
        blog.setTitle(dto.getTitle());
        blog.setSlug(toSlug(dto.getTitle()) + "-" + UUID.randomUUID().toString().substring(0, 5));
        blog.setContent(dto.getContent());
        blog.setCoverImage(dto.getCoverImage());
        blog.setCategory(dto.getCategory());
        blog.setAuthorId(authorId);
        blog.setStatus("draft");

        return blogRepository.save(blog);
    }

    public Blog publishBlog(String slug) {
        Blog blog = getBlogBySlug(slug);
        blog.setStatus("published");
        return blogRepository.save(blog);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}
