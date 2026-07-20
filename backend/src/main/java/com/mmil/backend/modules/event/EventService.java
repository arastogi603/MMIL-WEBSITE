package com.mmil.backend.modules.event;

import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import com.mmil.backend.modules.event.dto.CreateEventDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public EventService(EventRepository eventRepository, EventRegistrationRepository registrationRepository, UserRepository userRepository, TeamRepository teamRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
    }

    public List<Event> getPublishedEvents() {
        return eventRepository.findPublishedUpcoming();
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventBySlug(String slug) {
        return eventRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event createEvent(CreateEventDto dto) {
        if (eventRepository.findBySlug(dto.getSlug()).isPresent()) {
            throw new RuntimeException("Event slug must be unique");
        }

        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setSlug(dto.getSlug());
        event.setType(dto.getType());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setLocation(dto.getLocation());
        event.setDescription(dto.getDescription());
        event.setCapacity(dto.getCapacity());
        event.setIsTeamEvent(dto.getIsTeamEvent() != null ? dto.getIsTeamEvent() : false);
        event.setTeamSizeMin(dto.getTeamSizeMin());
        event.setTeamSizeMax(dto.getTeamSizeMax());
        event.setStatus("draft");

        return eventRepository.save(event);
    }

    public Event publishEvent(String slug) {
        Event event = getEventBySlug(slug);
        event.setStatus("published");
        return eventRepository.save(event);
    }

    @Transactional
    public Event unpublishEvent(String slug) {
        Event event = getEventBySlug(slug);
        
        // Delete all registrations and teams for this event
        registrationRepository.deleteByEventId(event.getId());
        teamRepository.deleteByEventId(event.getId());
        
        event.setStatus("draft");
        event.setSeatsTaken(0);
        
        return eventRepository.save(event);
    }

    public void registerForEvent(String slug, UUID userId) {
        Event event = getEventBySlug(slug);
        if (!"published".equals(event.getStatus())) {
            throw new RuntimeException("Event is not published or active");
        }

        if (event.getCapacity() != null && event.getSeatsTaken() >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }

        if (registrationRepository.existsByEventIdAndUserId(event.getId(), userId)) {
            throw new RuntimeException("You are already registered for this event");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        EventRegistration registration = new EventRegistration();
        registration.setEvent(event);
        registration.setUser(user);
        registrationRepository.save(registration);

        event.setSeatsTaken(event.getSeatsTaken() + 1);
        eventRepository.save(event);
    }

    public Optional<EventRegistration> getRegistration(UUID eventId, UUID userId) {
        return registrationRepository.findByEventIdAndUserId(eventId, userId);
    }

    @Transactional
    public void deleteEvent(String slug) {
        Event event = getEventBySlug(slug);
        
        // Delete all registrations and teams for this event
        registrationRepository.deleteByEventId(event.getId());
        teamRepository.deleteByEventId(event.getId());
        
        eventRepository.delete(event);
    }
}
