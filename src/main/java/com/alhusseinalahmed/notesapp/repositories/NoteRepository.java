package com.alhusseinalahmed.notesapp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alhusseinalahmed.notesapp.model.Note;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    // You can add custom queries here, like:
    List<Note> findByIsArchivedFalseAndIsPinnedTrue();
}