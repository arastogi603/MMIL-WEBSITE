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

    @PostMapping("/{slug}/publish")
    @PreAuthorize("hasAnyRole('ADMIN', 'CORE-TEAM')")
    public ResponseEntity<Event> publishEvent(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.publishEvent(slug));
    }

    @PostMapping("/{slug}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> unpublishEvent(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.unpublishEvent(slug));
    }

    @PostMapping("/{slug}/register")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> registerForEvent(@PathVariable String slug, @AuthenticationPrincipal User user) {
        eventService.registerForEvent(slug, user.getId());
        return ResponseEntity.ok().build();
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEvent(@PathVariable String slug) {
        eventService.deleteEvent(slug);
        return ResponseEntity.ok().build();
    }
}
