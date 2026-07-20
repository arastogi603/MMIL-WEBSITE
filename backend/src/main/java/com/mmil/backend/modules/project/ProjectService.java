package com.mmil.backend.modules.project;

import com.mmil.backend.modules.project.dto.CreateProjectDto;
import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<Project> getPublicProjects() {
        return projectRepository.findPublicProjects();
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project submitProject(CreateProjectDto dto, UUID userId) {
        Project project = new Project();
        project.setTitle(dto.getTitle());
        project.setSlug(toSlug(dto.getTitle()) + "-" + UUID.randomUUID().toString().substring(0, 5));
        project.setDescription(dto.getDescription());
        project.setRepositoryUrl(dto.getRepositoryUrl());
        project.setLiveDemoUrl(dto.getLiveDemoUrl());
        project.setThumbnailImage(dto.getThumbnailImage());
        project.setTechnologies(dto.getTechnologies());
        project.setSubmittedByUserId(userId);

        // Resolve and store the submitter's display name
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            project.setSubmittedByName(user.getName());
        }

        project.setStatus("pending"); // Requires admin approval

        return projectRepository.save(project);
    }

    public Project updateStatus(String slug, String status) {
        Project project = getProjectBySlug(slug);
        project.setStatus(status);
        return projectRepository.save(project);
    }

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }
}

