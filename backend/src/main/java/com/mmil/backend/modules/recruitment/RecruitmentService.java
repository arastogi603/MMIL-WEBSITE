package com.mmil.backend.modules.recruitment;

import com.mmil.backend.modules.recruitment.dto.CreateRecruitmentDto;
import com.mmil.backend.modules.recruitment.dto.CreateApplicationDto;
import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RecruitmentService {

    private final RecruitmentRepository recruitmentRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public RecruitmentService(RecruitmentRepository recruitmentRepository, ApplicationRepository applicationRepository, UserRepository userRepository) {
        this.recruitmentRepository = recruitmentRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public List<Recruitment> getActiveCycles() {
        return recruitmentRepository.findActiveCycles();
    }

    public List<Recruitment> getAllCycles() {
        return recruitmentRepository.findAll();
    }

    public Recruitment getCycleBySlug(String slug) {
        return recruitmentRepository.findByCycleSlug(slug)
                .orElseThrow(() -> new RuntimeException("Recruitment cycle not found"));
    }

    public Recruitment createCycle(CreateRecruitmentDto dto) {
        if (recruitmentRepository.findByCycleSlug(dto.getCycleSlug()).isPresent()) {
            throw new RuntimeException("Cycle slug must be unique");
        }

        Recruitment cycle = new Recruitment();
        cycle.setName(dto.getName());
        cycle.setCycleSlug(dto.getCycleSlug());
        cycle.setDescription(dto.getDescription());
        cycle.setStartDate(dto.getStartDate());
        cycle.setEndDate(dto.getEndDate());
        cycle.setStatus("draft");

        return recruitmentRepository.save(cycle);
    }

    public Recruitment activateCycle(String slug) {
        Recruitment cycle = getCycleBySlug(slug);
        cycle.setStatus("active");
        return recruitmentRepository.save(cycle);
    }

    public Recruitment closeCycle(String slug) {
        Recruitment cycle = getCycleBySlug(slug);
        cycle.setStatus("closed");
        return recruitmentRepository.save(cycle);
    }

    public Application submitApplication(String slug, CreateApplicationDto dto, UUID userId) {
        Recruitment cycle = getCycleBySlug(slug);
        if (!"active".equals(cycle.getStatus())) {
            throw new RuntimeException("Recruitment cycle is not active");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (applicationRepository.existsByCandidateIdAndRecruitmentCycleId(userId, cycle.getId())) {
            throw new RuntimeException("You have already submitted an application for this recruitment cycle.");
        }

        Application app = new Application();
        app.setCandidate(user);
        app.setRecruitmentCycle(cycle);
        app.setResumeUrl(dto.getResumeUrl());
        app.setYearOfStudy(dto.getYearOfStudy());
        app.setBranch(dto.getBranch());
        app.setSkills(dto.getSkills());

        return applicationRepository.save(app);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAllByOrderByCreatedAtDesc();
    }

    public Application updateApplicationStatus(UUID id, String status) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status.toUpperCase());
        return applicationRepository.save(app);
    }
}
