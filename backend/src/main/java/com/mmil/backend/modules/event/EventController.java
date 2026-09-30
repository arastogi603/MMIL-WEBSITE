package com.mmil.backend.modules.event;

import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.event.dto.CreateEventDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<Event>> getPublishedEvents() {
        return ResponseEntity.ok(eventService.getPublishedEvents());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Event> getEventBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.getEventBySlug(slug));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody CreateEventDto dto) {
        return ResponseEntity.ok(eventService.createEvent(dto));
    }

    @PutMapping("/{slug}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Event> updateEvent(@PathVariable String slug, @Valid @RequestBody CreateEventDto dto) {
        return ResponseEntity.ok(eventService.updateEvent(slug, dto));
    }

    @PostMapping("/{slug}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> publishEvent(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.publishEvent(slug));
    }

    @PostMapping("/{slug}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> unpublishEvent(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.unpublishEvent(slug));
    }

    
    public static class RegisterRequest {
        public String formAnswers;
    }

    @PostMapping("/{slug}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable String slug, @RequestBody(required = false) RegisterRequest req, @AuthenticationPrincipal User user) {
        UUID userId = user != null ? user.getId() : null;
        eventService.registerForEvent(slug, userId, req != null ? req.formAnswers : null);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{slug}/applications")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> getEventApplications(@PathVariable String slug) {
        Event event = eventService.getEventBySlug(slug);
        if (event == null) return ResponseEntity.notFound().build();
        List<EventRegistration> registrations = eventService.getRegistrationsForEvent(event.getId());
        
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (EventRegistration r : registrations) {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", r.getId());
            map.put("userId", r.getUser() != null ? r.getUser().getId() : null);
            map.put("userName", r.getUser() != null ? r.getUser().getName() : "Guest");
            map.put("userEmail", r.getUser() != null ? r.getUser().getEmail() : "Guest");
            map.put("formAnswers", r.getFormAnswers());
            map.put("registeredAt", r.getRegisteredAt());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }


    @GetMapping("/{slug}/registration-status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getRegistrationStatus(@PathVariable String slug, @AuthenticationPrincipal User user) {
        Event event = eventService.getEventBySlug(slug);
        if (event == null) return ResponseEntity.notFound().build();
        
        Optional<EventRegistration> reg = eventService.getRegistration(event.getId(), user.getId());
        if (reg.isPresent()) {
            EventRegistration r = reg.get();
            boolean isLeader = r.getTeam() != null && r.getTeam().getLeader().getId().equals(user.getId());
            return ResponseEntity.ok(Map.of(
                "isRegistered", true,
                "teamId", r.getTeam() != null ? r.getTeam().getId() : null,
                "isLeader", isLeader
            ));
        }
        return ResponseEntity.ok(Map.of("isRegistered", false));
    }

    @DeleteMapping("/{slug}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<?> deleteEvent(@PathVariable String slug) {
        eventService.deleteEvent(slug);
        return ResponseEntity.ok().build();
    }
}
