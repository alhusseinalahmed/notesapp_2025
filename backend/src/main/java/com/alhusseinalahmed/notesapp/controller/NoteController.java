package com.alhusseinalahmed.notesapp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:3000") // Crucial for development!
public class NoteController {
    // Inject the Repository or a Service layer here
    // Implement methods like @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
}