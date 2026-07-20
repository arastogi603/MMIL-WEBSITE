package com.mmil.backend;

import com.mmil.backend.modules.recruitment.Recruitment;
import com.mmil.backend.modules.recruitment.RecruitmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class BackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    CommandLineRunner seedRecruitment(RecruitmentRepository recruitmentRepository) {
        return args -> {
            if (recruitmentRepository.findByCycleSlug("spring-2026").isEmpty()) {
                Recruitment r = new Recruitment();
                r.setName("Spring 2026 Core Team Recruitment");
                r.setCycleSlug("spring-2026");
                r.setDescription("Core team recruitment for Spring 2026.");
                r.setStatus("active");
                r.setStartDate(LocalDateTime.now().minusDays(1));
                r.setEndDate(LocalDateTime.now().plusDays(30));
                recruitmentRepository.save(r);
                System.out.println("Seeded spring-2026 recruitment cycle.");
            }
        };
    }
}
