package com.mmil.backend.modules.alumni;

import com.mmil.backend.modules.alumni.dto.CreateAlumniDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AlumniService {

    private final AlumniRepository alumniRepository;

    public AlumniService(AlumniRepository alumniRepository) {
        this.alumniRepository = alumniRepository;
    }

    public List<Alumni> getAllAlumni() {
        return alumniRepository.findAllByOrderByBatchYearDesc();
    }

    public Alumni getAlumniById(UUID id) {
        return alumniRepository.findById(id).orElseThrow(() -> new RuntimeException("Alumni not found"));
    }

    public Alumni createAlumni(CreateAlumniDto dto) {
        Alumni alumni = new Alumni();
        alumni.setName(dto.getName());
        alumni.setBatchYear(dto.getBatchYear());
        alumni.setCompany(dto.getCompany());
        alumni.setRole(dto.getRole());
        alumni.setLinkedInUrl(dto.getLinkedInUrl());
        alumni.setImageUrl(dto.getImageUrl());
        return alumniRepository.save(alumni);
    }

    public Alumni updateAlumni(UUID id, CreateAlumniDto dto) {
        Alumni alumni = getAlumniById(id);
        alumni.setName(dto.getName());
        alumni.setBatchYear(dto.getBatchYear());
        alumni.setCompany(dto.getCompany());
        alumni.setRole(dto.getRole());
        alumni.setLinkedInUrl(dto.getLinkedInUrl());
        if(dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
            alumni.setImageUrl(dto.getImageUrl());
        }
        return alumniRepository.save(alumni);
    }

    public void deleteAlumni(UUID id) {
        alumniRepository.deleteById(id);
    }
}
