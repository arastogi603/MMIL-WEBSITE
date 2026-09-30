package com.mmil.backend.config;

import com.mmil.backend.modules.resource.ResourceFolder;
import com.mmil.backend.modules.resource.ResourceFolderRepository;
import com.mmil.backend.modules.resource.ResourceItem;
import com.mmil.backend.modules.resource.ResourceItemRepository;
import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import com.mmil.backend.modules.event.Event;
import com.mmil.backend.modules.event.EventRepository;
import com.mmil.backend.modules.alumni.Alumni;
import com.mmil.backend.modules.alumni.AlumniRepository;
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
                        AlumniRepository alumniRepository,
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

                        // Seed Faculty
                        if (!userRepository.existsByEmail("lavkush.sharma@jssaten.ac.in")) {
                            User lavkush = new User();
                            lavkush.setName("Dr. Lavkush Sharma");
                            lavkush.setEmail("lavkush.sharma@jssaten.ac.in");
                            lavkush.setRole("faculty-coordinator");
                            lavkush.setPasswordHash(passwordEncoder.encode("mmil123"));
                            lavkush.setAvatarUrl("https://backoffice.jssuninoida.edu.in/assets/img/faculty/1774855281_69ca2471438c3.webp");
                            lavkush.setLinkedInUrl("https://www.linkedin.com/in/lavkushsharma");
                            userRepository.save(lavkush);
                        }
                        if (!userRepository.existsByEmail("charu.awasthi@jssaten.ac.in")) {
                            User charu = new User();
                            charu.setName("Dr. Charu Awasthi");
                            charu.setEmail("charu.awasthi@jssaten.ac.in");
                            charu.setRole("faculty-coordinator");
                            charu.setPasswordHash(passwordEncoder.encode("mmil123"));
                            charu.setAvatarUrl("https://backoffice.jssuninoida.edu.in/assets/img/faculty/1775556398_69d4d72ed79f9.webp");
                            charu.setLinkedInUrl("https://www.linkedin.com/in/dr-charu-awasthi-49264077/");
                            userRepository.save(charu);
                        }

                        System.out.println("Master Admin account verified/reset: admin@mmil.com / admin123");

                        // Seed / club Resource Folders & Items into database
                        seedResourceFoldersAndItems(admin, folderRepository, itemRepository);

                        // Seed events
                        seedEvents(eventRepository);
                        seedAlumni(alumniRepository);
                        seedTeam(userRepository);
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
                

                seedEventIfMissing(eventRepository, "Logocon", "logocon", "Zealicon flagship logic and coding contest.",
                                "event", "completed", false, 1, 1, "/images/events/Logocon.png");
                seedEventIfMissing(eventRepository, "Code-in-Pair", "code-in-pair",
                                "Two-member team coding relay contest.", "event", "completed", true, 2, 2,
                                "/images/events/CodeInPair.png");
                seedEventIfMissing(eventRepository, "Decode", "decode", "Cryptic hunt and algorithmic decoding event.",
                                "event", "completed", false, 1, 1, "/images/events/deencode.png");
                seedEventIfMissing(eventRepository, "Valorant Gaming Tournament", "valorant",
                                "Zealicon e-sports Valorant tournament.", "event", "completed", true, 5, 5,
                                "/images/events/valorant.png");
                seedEventIfMissing(eventRepository, "LinkedIn & Resume Building", "resume-workshop",
                                "Professional profile optimization session.", "workshop", "completed", false, 1, 1,
                                "/images/events/Linkdin.jpeg");
                seedEventIfMissing(eventRepository, "Generative AI & Python", "genai-workshop",
                                "Learn prompt engineering and Python.", "workshop", "completed", false, 1, 1,
                                "/images/events/GenAI.jpeg");
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
                } else if (posterUrl != null
                                && (existing.get().getPosterUrl() == null || existing.get().getPosterUrl().isEmpty())) {
                        Event e = existing.get();
                        e.setPosterUrl(posterUrl);
                        repo.save(e);
                }
        }

        private void seedAlumni(AlumniRepository repo) {
            seedAlumniIfMissing(repo, "Harsh Jajaniya", 2026, "AARFID Holdings LLC", "", "https://www.linkedin.com/in/harsh-jajaniya-293bb0247/", "/images/alumni/harsh-jajaniya.jpg");
            seedAlumniIfMissing(repo, "Ashita Maheshwari", 2026, "Haltdos", "", "https://www.linkedin.com/in/ashita-maheshwari/", "/images/alumni/ashita-maheshwari.jpg");
            seedAlumniIfMissing(repo, "Anusha Agarwal", 2026, "Blinkit", "", "https://www.linkedin.com/in/anusha-agarwal-068b70271/", "/images/alumni/anusha-agarwal.jpg");
            seedAlumniIfMissing(repo, "Parth Gupta", 2026, "Modgenics Technology Solutions", "", "https://www.linkedin.com/in/parth-gupta-3793ba273/", "/images/alumni/parth-gupta.jpg");
            seedAlumniIfMissing(repo, "Muskan Jaiswal", 2026, "Newgen", "", "https://www.linkedin.com/in/muskan-jais/", "/images/alumni/muskan-jaiswal.jpg");
            seedAlumniIfMissing(repo, "Garima Singh", 2026, "TCS", "", "https://www.linkedin.com/in/garimasingh10u/", "/images/alumni/garima-singh.jpg");
            seedAlumniIfMissing(repo, "Anushka Dubey", 2026, "Premier Energies", "", "https://www.linkedin.com/in/anushka-dubey-17ba77275/", "/images/alumni/anushka-dubey.jpg");
            seedAlumniIfMissing(repo, "Abhinav Yadav", 2026, "Attero", "", "https://www.linkedin.com/in/abhinav-yadav-70088a252/", "/images/alumni/abhinav-yadav.jpg");
            seedAlumniIfMissing(repo, "Utkarsh Sharma", 2026, "Binmile", "", "https://www.linkedin.com/in/utkarshdev2411/", "/images/alumni/utkarsh-sharma.jpg");
            seedAlumniIfMissing(repo, "Rounak Ali", 2026, "Masters at DRDO", "", "https://www.linkedin.com/in/rounak-ali-a58362260/", "/images/alumni/raunak.png");
            seedAlumniIfMissing(repo, "Manas Rai", 2025, "Astrotalk", "", "https://www.linkedin.com/in/manas-rai2003/", "/images/alumni/manas-rai.jpg");
            seedAlumniIfMissing(repo, "Ayush Pandey", 2024, "Amazon", "", "https://www.linkedin.com/in/ayush-pandey01/", "/images/alumni/ayush-pandey.jpg");
            seedAlumniIfMissing(repo, "Sakshi Tiwari", 2024, "Oracle", "", "https://www.linkedin.com/in/sakshi-tiwari-7a952b1b7/", "/images/alumni/sakshi-tiwari.jpg");
            seedAlumniIfMissing(repo, "Suyash Rastogi", 2024, "Clinikally (YC S22)", "", "https://www.linkedin.com/in/suyash-rastogi/", "/images/alumni/suyash-rastogi.jpg");
            seedAlumniIfMissing(repo, "Anuj Agarwal", 2024, "Pelocal Fintech Private Limited", "", "https://www.linkedin.com/in/anujagarwal900/", "/images/alumni/anuj-agarwal.jpg");
            seedAlumniIfMissing(repo, "Pushkar Singh", 2024, "Newgen Software", "", "https://www.linkedin.com/in/pushkar-singh-a052a1205/", "/images/alumni/pushkar-singh.jpg");
            seedAlumniIfMissing(repo, "Arnika Sharma", 2024, "Emerson", "", "https://www.linkedin.com/in/arnika-sharma-53496320b/", "/images/alumni/arnika-sharma.jpg");
            seedAlumniIfMissing(repo, "Ashwin Raj Vats", 2024, "Self Employed Graphic Designer", "", "https://www.linkedin.com/in/ashwin-raj-vats-5911a41b7/", "/images/alumni/ashwin-raj-vats.jpg");
            seedAlumniIfMissing(repo, "Nipun Khatri", 2025, "Vesper", "", "https://www.linkedin.com/in/nipun-khatri-80b168224/", "/images/alumni/nipun-khatri.jpg");
            seedAlumniIfMissing(repo, "Bhoomi Agrawal", 2025, "Infineon Technologies", "", "https://www.linkedin.com/in/bhoomi-agarwal-393846239/", "/images/alumni/bhoomi-agrawal.jpg");
            seedAlumniIfMissing(repo, "Yash Shekhar", 2025, "HCL Tech", "", "https://www.linkedin.com/in/yash-shekhar-srivastava-b0559922a/", "/images/alumni/yash-shekhar.jpg");
            seedAlumniIfMissing(repo, "Vibhuti Kapoor", 2025, "RedDoorz", "", "https://www.linkedin.com/in/vibhutikapoor/", "/images/alumni/vibhuti-kapoor.jpg");
            seedAlumniIfMissing(repo, "Dhanraj Singh", 2025, "Pursuing MTech at Kiel University", "", "https://www.linkedin.com/in/sdhanraj300/", "/images/alumni/dhanraj-singh.jpg");
            seedAlumniIfMissing(repo, "Parth Sharma", 2023, "BUSINESSNEXT", "", "https://www.linkedin.com/in/parthsharmat/", "/images/alumni/parth-sharma.jpg");
            seedAlumniIfMissing(repo, "Gautam Kushal", 2023, "AU Small Finance Bank", "", "https://www.linkedin.com/in/gautamkushal/", "/images/alumni/gautam-kushal.jpg");
            seedAlumniIfMissing(repo, "Neeraj Maurya", 2023, "Josh Technology Group", "", "https://www.linkedin.com/in/mauryaneeraj11/", "/images/alumni/neeraj-maurya.jpg");
            seedAlumniIfMissing(repo, "Anmol Puri", 2023, "Newgen Software", "", "https://www.linkedin.com/in/anmol-puri-401b441a4/", "/images/alumni/anmol-puri.jpg");
            seedAlumniIfMissing(repo, "Rudrakshi Soni", 2023, "Amazon", "", "https://www.linkedin.com/in/rudrakshi-soni/", "/images/alumni/rudrakshi-soni.jpg");
            seedAlumniIfMissing(repo, "Diksha Shukla", 2023, "Headset", "", "https://www.linkedin.com/in/diksha-shukla-98aa1a196/", "/images/alumni/diksha-shukla.jpg");
            seedAlumniIfMissing(repo, "Samyak Singh", 2023, "Playo", "", "https://www.linkedin.com/in/samyak-singh-007abc/", "/images/alumni/samyak-singh.jpg");
        }

        private void seedAlumniIfMissing(AlumniRepository repo, String name, int batch, String company, String role, String linkedIn, String imageUrl) {
            if (repo.findAll().stream().noneMatch(a -> a.getName().equals(name))) {
                Alumni a = new Alumni();
                a.setName(name);
                a.setBatchYear(batch);
                a.setCompany(company);
                a.setRole(role);
                a.setLinkedInUrl(linkedIn);
                a.setImageUrl(imageUrl);
                repo.save(a);
            }
        }


        private void seedTeam(UserRepository userRepo) {
            seedUserIfMissing(userRepo, "Kuldeep Pandit", "kuldeep.pandit@mmil.com", "president", "https://www.linkedin.com/in/kuldeepk-pandit/", "/images/members/kuldeep.jpeg");
            seedUserIfMissing(userRepo, "Vaishnavi Bhati", "vaishnavi.bhati@mmil.com", "vice-president", "https://www.linkedin.com/in/vaishnavi-bhati-15vb2004/", "/images/members/vaisnavi.png");
            seedUserIfMissing(userRepo, "Ayan Khan", "ayan.khan@mmil.com", "ctc", "https://www.linkedin.com/in/ayankhan28/", "/images/members/ayan.jpeg");
            seedUserIfMissing(userRepo, "Parth Chaturvedi", "parth.chaturvedi@mmil.com", "co-ctc", "https://www.linkedin.com/in/parth-chaturvedi-dev/", "/images/members/parth.jpg.jpeg");
            seedUserIfMissing(userRepo, "Sanya Pandey", "sanya.pandey@mmil.com", "general-secretary", "https://www.linkedin.com/in/sanya-pandey08/", "/images/members/sanya.jpeg");
            seedUserIfMissing(userRepo, "Anurag Maurya", "anurag.maurya@mmil.com", "management-head", "https://www.linkedin.com/in/anuragg28/", "/images/members/anurag.jpg.jpeg");
            seedUserIfMissing(userRepo, "Tanmay Kalra", "tanmay.kalra@mmil.com", "programming-lead", "https://www.linkedin.com/in/tanmay-kalra-09oct/", "/images/members/tanmay.jpeg");
            seedUserIfMissing(userRepo, "Akshat Rastogi", "akshat.rastogi@mmil.com", "programmer", "https://www.linkedin.com/in/-akshatrastogi/", "https://media.licdn.com/dms/image/v2/D5603AQGHyzr7S7o_XQ/profile-displayphoto-crop_800_800/B56ZkT.9D0HQAU-/0/1756976896081?e=1786579200&v=beta&t=_AY8oRu--oNUZBrkA_wWCYkRhfzOWERHEc-fH6gitOs");
            seedUserIfMissing(userRepo, "Vansh Bhaskar", "vansh.bhaskar@mmil.com", "programmer", "https://www.linkedin.com/in/vanshbhaskar/", "/images/members/vansh.jpg");
            seedUserIfMissing(userRepo, "Arunima Negi", "arunima.negi@mmil.com", "programmer", "https://www.linkedin.com/in/arunima-negi-90504429b/", "/images/members/Arunima.jpeg");
            seedUserIfMissing(userRepo, "K. Anushree", "k..anushree@mmil.com", "programmer", "https://www.linkedin.com/in/theanushree25/", "/images/members/Anushree.jpeg");
            seedUserIfMissing(userRepo, "Aditya Kumar Gupta", "aditya.kumar.gupta@mmil.com", "programmer", "https://www.linkedin.com/in/aditya-kumar-gupta-245515297/", "https://drive.google.com/uc?export=view&id=1WYkNYR7fAGegTi3I8mkPpNzPIIG9xdJ4");
            seedUserIfMissing(userRepo, "Sanskar Mittal", "sanskar.mittal@mmil.com", "programmer", "https://www.linkedin.com/in/sanskarmittal/", "/images/members/sanskar.jpg");
            seedUserIfMissing(userRepo, "Prashasti Jha", "prashasti.jha@mmil.com", "programmer", "https://www.linkedin.com/in/prashasti-jha-391109381/", "/images/members/Prashasthi.jpg");
            seedUserIfMissing(userRepo, "Aaryan Singh", "aaryan.singh@mmil.com", "programmer", "https://www.linkedin.com/in/aaryansingh31/", "https://drive.google.com/uc?export=view&id=1go3rBmnxA0Upp89TfmtxSliSE-qgD-8m");
            seedUserIfMissing(userRepo, "Disha Agrawal", "disha.agrawal@mmil.com", "web-dev-lead", "https://www.linkedin.com/in/disha-agrawal-0438062a5/", "/images/members/disha.jpeg");
            seedUserIfMissing(userRepo, "Abhishek Jaiswal", "abhishek.jaiswal@mmil.com", "web-developer", "https://www.linkedin.com/in/abhishek-jaiswal-110399338/", "https://media.licdn.com/dms/image/v2/D5603AQH9OH2jrPDlfg/profile-displayphoto-crop_800_800/B56ZyMGA0yJQAM-/0/1771876913422?e=1786579200&v=beta&t=iCUqJoUDAt58UMkScnakQJvqYQHjOHikvCvQhJ0rN4A");
            seedUserIfMissing(userRepo, "Thushar Rai", "thushar.rai@mmil.com", "web-developer", "https://www.linkedin.com/in/thushar-rai-a8aa9a375/", "/images/members/tushar.jpeg");
            seedUserIfMissing(userRepo, "Nandini Mishra", "nandini.mishra@mmil.com", "web-developer", "https://www.linkedin.com/in/nandini-mishra-4a5a3132a/", "/images/members/nandini.jpeg");
            seedUserIfMissing(userRepo, "Ayushi Tiwari", "ayushi.tiwari@mmil.com", "web-developer", "https://www.linkedin.com/in/ayushi-tiwari-408a61302/", "/images/members/Ayushi.png");
            seedUserIfMissing(userRepo, "Akhil Mishra", "akhil.mishra@mmil.com", "web-developer", "https://www.linkedin.com/in/akhil-mishra-95ba36312/", "https://media.licdn.com/dms/image/v2/D5603AQEFlb64aMvblA/profile-displayphoto-crop_800_800/B56Z9CxSqKGcAI-/0/1783531646775?e=1786579200&v=beta&t=tavhaGWLV5ZmDWi_zU4PJtEGm8KKL5-YTOpOy8MYVaQ");
            seedUserIfMissing(userRepo, "Vaishnav Gupta", "vaishnav.gupta@mmil.com", "technical-lead", "https://www.linkedin.com/in/vaishnavgupta/", "/images/members/VaishnavGupta.jpg.jpeg");
            seedUserIfMissing(userRepo, "Abhishek", "abhishek@mmil.com", "technical-member", "https://www.linkedin.com/in/abhishekk1811/", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSs9bBvurUnow2rc2cuJHs7GL1_7VA3Q_QeQBC_X08Xg&s=10");
            seedUserIfMissing(userRepo, "Shivanshu Kushwaha", "shivanshu.kushwaha@mmil.com", "technical-member", "https://www.linkedin.com/in/shivanshu-kushwaha-12572b345/", "/images/members/shivanshu.jpg");
            seedUserIfMissing(userRepo, "Rajat Kumar", "rajat.kumar@mmil.com", "technical-member", "https://www.linkedin.com/in/rajat281/", "/images/members/rajat.jpeg");
            seedUserIfMissing(userRepo, "Mahi Gupta", "mahi.gupta@mmil.com", "technical-member", "https://www.linkedin.com/in/mahi-gupta-8623b4364/", "/images/members/mahi.jpeg");
            seedUserIfMissing(userRepo, "Aarsh Upadhyay", "aarsh.upadhyay@mmil.com", "design-lead", "https://www.linkedin.com/in/aarsh-upadhyay-66010a359/", "/images/members/aarsh.jpg.jpeg");
            seedUserIfMissing(userRepo, "Arnav", "arnav@mmil.com", "designer", "https://www.linkedin.com/in/arnav2k5/", "/images/members/arnav.jpg");
            seedUserIfMissing(userRepo, "Akshat Srivastava", "akshat.srivastava@mmil.com", "designer", "https://www.linkedin.com/in/akshat-srivastava-522265407/", "https://drive.google.com/uc?export=view&id=1oDp5216NuGeljG1uet0hHaeBVpuOGlFo");
            seedUserIfMissing(userRepo, "Ankita Singh", "ankita.singh@mmil.com", "designer", "https://www.linkedin.com/in/ankita-singh-566007385/", "/images/members/ankita.jpg");
            seedUserIfMissing(userRepo, "Himanshi", "himanshi@mmil.com", "designer", "#", "/images/members/himanshi.jpeg");

        }

        private void seedUserIfMissing(UserRepository userRepo, String name, String email, String role, String linkedIn, String avatar) {
            if (userRepo.findByEmail(email).isEmpty()) {
                User u = new User();
                u.setName(name);
                u.setEmail(email);
                u.setPasswordHash("$2a$10$xyzDummyHashxyz"); // Not meant for login
                u.setRole(role);
                u.setLinkedInUrl(linkedIn);
                u.setAvatarUrl(avatar);
                userRepo.save(u);
            }
        }

}