package com.alhusseinalahmed.notesapp.repository;

import com.alhusseinalahmed.notesapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {
    // Custom query method: finds all notes where the 'user' field matches the given user ID
    List<Note> findByUserId(Long userId);
    
    // Check if a specific note ID belongs to a specific user ID
    boolean existsByIdAndUserId(Long id, Long userId);
}