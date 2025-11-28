package com.alhusseinalahmed.notesapp.controller;

import com.alhusseinalahmed.notesapp.model.Note;
import com.alhusseinalahmed.notesapp.model.User;
import com.alhusseinalahmed.notesapp.repository.NoteRepository;
import com.alhusseinalahmed.notesapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;

        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            username = (String) principal;
        } else {
            throw new IllegalStateException(
                    "Authentication principal is an unknown type: " + principal.getClass().getName());
        }

        return userRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("User not found in database: " + username));
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note noteDetails) {
        User currentUser = getCurrentUser();

        noteDetails.setUser(currentUser);

        Note savedNote = noteRepository.save(noteDetails);
        return new ResponseEntity<>(savedNote, HttpStatus.CREATED);
    }

    @GetMapping
    @Transactional
    public List<Note> getAllNotes() {
        Long userId = getCurrentUser().getId();
        return noteRepository.findByUserId(userId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        if (!noteRepository.existsByIdAndUserId(id, getCurrentUser().getId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Note note = noteRepository.findById(id).orElse(null);
        return ResponseEntity.ok(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        User currentUser = getCurrentUser();

        if (!noteRepository.existsByIdAndUserId(id, currentUser.getId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return noteRepository.findById(id).map(note -> {
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            note.setColor(noteDetails.getColor());

            note.setPinned(noteDetails.isPinned());
            note.setArchived(noteDetails.isArchived());

            Note updatedNote = noteRepository.save(note);
            return ResponseEntity.ok(updatedNote);
        }).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteNote(@PathVariable Long id) {
        if (!noteRepository.existsByIdAndUserId(id, getCurrentUser().getId())) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        noteRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}