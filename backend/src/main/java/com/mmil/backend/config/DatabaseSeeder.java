package com.mmil.backend.config;

import com.mmil.backend.modules.resource.ResourceFolder;
import com.mmil.backend.modules.resource.ResourceFolderRepository;
import com.mmil.backend.modules.resource.ResourceItem;
import com.mmil.backend.modules.resource.ResourceItemRepository;
import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import com.mmil.backend.modules.event.Event;
import com.mmil.backend.modules.event.EventRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.time.LocalDateTime;

@Configuration
public class DatabaseSeeder {

        @Bean
        public CommandLineRunner seedDatabase(
                        UserRepository userRepository,
                        ResourceFolderRepository folderRepository,
                        ResourceItemRepository itemRepository,
                        EventRepository eventRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // Always ensure the Master Admin exists and credentials are valid
                        User admin = userRepository.findByEmail("admin@mmil.com").orElse(new User());

                        admin.setName("System Admin");
                        admin.setEmail("admin@mmil.com");
                        // Force reset the password to admin123 so the user can definitely log in
                        admin.setPasswordHash(passwordEncoder.encode("admin123"));
                        admin.setRole("admin");

                        admin = userRepository.save(admin);
                        System.out.println("Master Admin account verified/reset: admin@mmil.com / admin123");

                        // Seed / club Resource Folders & Items into database
                        seedResourceFoldersAndItems(admin, folderRepository, itemRepository);

                        // Seed events
                        seedEvents(eventRepository);
                };
        }

        private void seedResourceFoldersAndItems(User admin, ResourceFolderRepository folderRepository,
                        ResourceItemRepository itemRepository) {
                // 1. Web Development & Frontend
                ResourceFolder webDev = folderRepository.findByName("Web Development & Frontend")
                                .orElseGet(() -> {
                                        ResourceFolder f = new ResourceFolder();
                                        f.setName("Web Development & Frontend");
                                        f.setDescription(
                                                        "Curated guides, roadmaps, and cheat sheets for modern Web Architecture, React, and Next.js.");
                                        return folderRepository.save(f);
                                });

                seedItemIfMissing(webDev, "Developer Roadmap - Frontend 2026",
                                "Step-by-step guide to becoming a modern frontend developer with recommended technologies.",
                                List.of("HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js"),
                                "https://roadmap.sh/frontend", admin, itemRepository);

                seedItemIfMissing(webDev, "React Official Documentation & Guides",
                                "Interactive learning platform and official guides for React 19 and Server Components.",
                                List.of("React", "JSX", "Hooks"),
                                "https://react.dev", admin, itemRepository);

                seedItemIfMissing(webDev, "Tailwind CSS & Design Systems",
                                "Utility-first CSS framework patterns, modern glassmorphism, and dynamic layout design.",
                                List.of("CSS", "TailwindCSS", "UI Design"),
                                "https://tailwindcss.com/docs", admin, itemRepository);

                // 2. Backend & Systems
                ResourceFolder backendDev = folderRepository.findByName("Backend & Systems")
                                .orElseGet(() -> {
                                        ResourceFolder f = new ResourceFolder();
                                        f.setName("Backend & Systems");
                                        f.setDescription(
                                                        "Deep dive into Spring Boot, Node.js, Microservices, Databases, and Docker containers.");
                                        return folderRepository.save(f);
                                });

                seedItemIfMissing(backendDev, "Spring Boot 3 Enterprise Guide",
                                "Production-ready Spring Boot backend architectural guide, Spring Security, and JPA.",
                                List.of("Java", "Spring Boot", "Spring Security", "PostgreSQL"),
                                "https://spring.io/guides", admin, itemRepository);

                seedItemIfMissing(backendDev, "Docker & Containerization Handbook",
                                "Learn containerization from basic Dockerfiles to Docker Compose and Kubernetes deployment.",
                                List.of("Docker", "DevOps", "Containers"),
                                "https://docs.docker.com/get-started/", admin, itemRepository);

                // 3. AI & Machine Learning
                ResourceFolder aiMl = folderRepository.findByName("AI & Machine Learning")
                                .orElseGet(() -> {
                                        ResourceFolder f = new ResourceFolder();
                                        f.setName("AI & Machine Learning");
                                        f.setDescription(
                                                        "Roadmaps, datasets, PyTorch guides, and prompt engineering resources for developers.");
                                        return folderRepository.save(f);
                                });

                seedItemIfMissing(aiMl, "Deep Learning Specialization & PyTorch",
                                "Complete hands-on reference for neural networks, transformers, and model optimization.",
                                List.of("Python", "PyTorch", "TensorFlow", "NumPy"),
                                "https://pytorch.org/tutorials/", admin, itemRepository);

                // 4. DSA & Interview Prep
                ResourceFolder cpDsa = folderRepository.findByName("DSA & Interview Prep")
                                .orElseGet(() -> {
                                        ResourceFolder f = new ResourceFolder();
                                        f.setName("DSA & Interview Prep");
                                        f.setDescription(
                                                        "Problem sets, algorithm visualizers, patterns, and technical interview roadmaps.");
                                        return folderRepository.save(f);
                                });

                seedItemIfMissing(cpDsa, "NeetCode 150 & Algorithm Patterns",
                                "Curated 150 Data Structures and Algorithms questions categorized by patterns.",
                                List.of("DSA", "C++", "Java", "Python"),
                                "https://neetcode.io", admin, itemRepository);

                seedItemIfMissing(cpDsa, "GeeksforGeeks Data Structures & Algorithms",
                                "Comprehensive tutorials and topic-wise practice problems for data structures and algorithms.",
                                List.of("DSA", "Algorithms", "Interview Prep"),
                                "https://www.geeksforgeeks.org/data-structures/", admin, itemRepository);

                // 5. Mobile App Development
                ResourceFolder mobileDev = folderRepository.findByName("Mobile App Development")
                                .orElseGet(() -> {
                                        ResourceFolder f = new ResourceFolder();
                                        f.setName("Mobile App Development");
                                        f.setDescription(
                                                        "Cross-platform and native mobile app development guides for Flutter, React Native, and Android.");
                                        return folderRepository.save(f);
                                });

                seedItemIfMissing(mobileDev, "Flutter & Dart Blueprint",
                                "Build beautiful cross-platform iOS and Android apps with declarative state management.",
                                List.of("Flutter", "Dart", "Mobile"),
                                "https://flutter.dev/docs", admin, itemRepository);

                // 6. Cybersecurity & DevOps
                ResourceFolder cyberSec = folderRepository.findByName("Cybersecurity & DevOps")
                                .orElseGet(() -> {
                                        ResourceFolder f = new ResourceFolder();
                                        f.setName("Cybersecurity & DevOps");
                                        f.setDescription(
                                                        "Security best practices, OWASP top 10, network security, and CI/CD automation pipelines.");
                                        return folderRepository.save(f);
                                });

                seedItemIfMissing(cyberSec, "OWASP Top 10 Web Vulnerabilities",
                                "Comprehensive overview of critical security risks to web applications and defense mechanisms.",
                                List.of("Security", "OWASP", "Penetration Testing"),
                                "https://owasp.org/www-project-top-ten/", admin, itemRepository);

                System.out.println("Resource folders and items successfully verified/seeded in real database.");
        }

        private void seedItemIfMissing(ResourceFolder folder, String title, String description, List<String> techStack,
                        String url, User admin, ResourceItemRepository itemRepository) {
                if (!itemRepository.existsByFolderIdAndTitle(folder.getId(), title)) {
                        ResourceItem item = new ResourceItem();
                        item.setFolder(folder);
                        item.setTitle(title);
                        item.setDescription(description);
                        item.setTechStack(techStack);
                        item.setUrl(url);
                        item.setPublishedBy(admin);
                        itemRepository.save(item);
                }
        }

        private void seedEvents(EventRepository eventRepository) {
                // Zealicon Events
                seedEventIfMissing(eventRepository, "Logocon", "logocon", "Zealicon flagship logic and coding contest.",
                                "event", "completed", false, 1, 1, "/images/events/Logocon.png");
                seedEventIfMissing(eventRepository, "Code-in-Pair", "code-in-pair",
                                "Two-member team coding relay contest.", "event", "completed", true, 2, 2, "/images/events/CodeInPair.png");
                seedEventIfMissing(eventRepository, "Decode", "decode", "Cryptic hunt and algorithmic decoding event.",
                                "event", "completed", false, 1, 1, "/images/events/deencode.png");
                seedEventIfMissing(eventRepository, "Valorant Gaming Tournament", "valorant",
                                "Zealicon e-sports Valorant tournament.", "event", "completed", true, 5, 5, "/images/events/valorant.png");

                // Society Flagship Events
                seedEventIfMissing(eventRepository, "Hack-o-Code", "hack-o-code", "Annual Coding Contest.", "event",
                                "completed", false, 1, 1, null);
                seedEventIfMissing(eventRepository, "GitHub & Version Control Workshop", "github-workshop",
                                "Learn Git basics and open-source contribution.", "workshop", "completed", false, 1, 1, null);
                seedEventIfMissing(eventRepository, "LinkedIn & Resume Building", "resume-workshop",
                                "Professional profile optimization session.", "workshop", "completed", false, 1, 1, null);
                seedEventIfMissing(eventRepository, "Generative AI & Python", "genai-workshop",
                                "Learn prompt engineering and Python.", "workshop", "completed", false, 1, 1, null);
                seedEventIfMissing(eventRepository, "Web Dev & Core Programming Bootcamp", "webdev-bootcamp",
                                "Comprehensive web development crash course.", "workshop", "completed", false, 1, 1, null);
        }

        private void seedEventIfMissing(EventRepository repo, String title, String slug, String desc, String type,
                        String status, boolean isTeam, int min, int max, String posterUrl) {
                var existing = repo.findBySlug(slug);
                if (existing.isEmpty()) {
                        Event e = new Event();
                        e.setTitle(title);
                        e.setSlug(slug);
                        e.setDescription(desc);
                        e.setType(type);
                        e.setStatus(status);
                        e.setIsTeamEvent(isTeam);
                        e.setTeamSizeMin(min);
                        e.setTeamSizeMax(max);
                        e.setPosterUrl(posterUrl);
                        e.setStartDate(LocalDateTime.now().minusDays(10));
                        e.setEndDate(LocalDateTime.now().minusDays(9));
                        repo.save(e);
                } else if (posterUrl != null && (existing.get().getPosterUrl() == null || existing.get().getPosterUrl().isEmpty())) {
                        Event e = existing.get();
                        e.setPosterUrl(posterUrl);
                        repo.save(e);
                }
        }
}
