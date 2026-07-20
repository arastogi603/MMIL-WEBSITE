package com.mmil.backend.modules.setting;

import com.mmil.backend.modules.event.EventRepository;
import com.mmil.backend.modules.project.ProjectRepository;
import com.mmil.backend.modules.user.UserRepository;
import com.mmil.backend.modules.setting.dto.DashboardStatsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
public class AdminDashboardController {

    private final ProjectRepository projectRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public AdminDashboardController(ProjectRepository projectRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long pendingProjects = projectRepository.countByStatus("pending");
        long activeEvents = eventRepository.countByStatus("published");
        long totalMembers = userRepository.count();
        
        DashboardStatsDto stats = new DashboardStatsDto(pendingProjects, activeEvents, totalMembers, "Online");
        return ResponseEntity.ok(stats);
    }
}
