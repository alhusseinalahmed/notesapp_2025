package com.alhusseinalahmed.notesapp.repository;

import com.alhusseinalahmed.notesapp.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    
}