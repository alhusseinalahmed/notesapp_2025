package com.alhusseinalahmed.notesapp.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.Id;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Lob;
import lombok.Data;

@Entity
@Data // From Lombok: automatically generates getters, setters, toString, etc.
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    @Lob // Allows for large text fields
    private String content;
    
    private String color; // For the visual color of the note
    private boolean isPinned = false;
    private boolean isArchived = false;
    
    @CreationTimestamp // Automatically sets the creation time
    private LocalDateTime createdAt;
    
    // Add relationship fields here later (e.g., userId, Tags)
}