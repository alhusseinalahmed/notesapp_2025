package com.alhusseinalahmed.notesapp.model;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity // 1. Marks this class as a JPA entity
@Table(name = "notes") // Optional: specifies the table name
@Data

public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Use Long for primary keys

    private String title;

    @ManyToOne(fetch = FetchType.LAZY) // Many notes to one user
    @JoinColumn(name = "user_id", nullable = false) // The foreign key column in the notes table
    private User user;

    @Lob
    private String content;

    private String color;
    private boolean isPinned = false;
    private boolean isArchived = false;

    // private Long userId;

    private LocalDateTime createdAt = LocalDateTime.now();
}