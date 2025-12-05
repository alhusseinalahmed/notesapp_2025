import React, { useState, useEffect } from 'react';
import NoteService from '../services/NoteService';
import AuthService from '../services/AuthService';
import Masonry from 'react-masonry-css';
import { MdPushPin } from "react-icons/md";

// Import our new modular components
import CreateNoteForm from './dashboard/CreateNoteForm';
import NoteCard from './dashboard/NoteCard';

const NoteDashboard = () => {
    const [notes, setNotes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const user = AuthService.getCurrentUser();

    // Masonry Layout Config
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    // --- API Calls ---
    const fetchNotes = () => {
        NoteService.getAllNotes()
            .then(response => setNotes(response.data || []))
            .catch(error => console.error("Error fetching notes:", error));
    };

    useEffect(() => {
        if (user) fetchNotes();
    }, []);

    const createNote = (newNoteData) => {
        NoteService.createNote(newNoteData).then(() => fetchNotes());
    };

    const updateNote = (id, updatedFields) => {
        const currentNote = notes.find(n => n.id === id);
        NoteService.updateNote(id, { ...currentNote, ...updatedFields })
            .then(() => fetchNotes());
    };

    const deleteNote = (id) => {
        NoteService.deleteNote(id).then(() => fetchNotes());
    };

    // --- Filtering & Sorting ---
    const activeNotes = notes.filter(n => !n.archived);
    const pinnedNotes = activeNotes.filter(n => n.pinned).sort((a, b) => b.id - a.id);
    const otherNotes = activeNotes.filter(n => !n.pinned).sort((a, b) => b.id - a.id);

    if (!user) return <div className="container">Please log in.</div>;

    return (
        <div className="dashboard-container">

            {/* 1. Create Note Section */}
            <CreateNoteForm onCreate={createNote} />

            {/* 2. Pinned Notes Section */}
            {pinnedNotes.length > 0 && (
                <>
                    <div className="section-title">PINNED</div>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {pinnedNotes.map(note => (
                            <NoteCard
                                key={note.id}
                                note={note}
                                isEditing={editingId === note.id}
                                onEditStart={setEditingId}
                                onEditCancel={() => setEditingId(null)}
                                onUpdate={updateNote}
                                onDelete={deleteNote}
                            />
                        ))}
                    </Masonry>
                </>
            )}

            {/* 3. Other Notes Section */}
            {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                <div className="section-title">OTHERS</div>
            )}

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {otherNotes.map(note => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        isEditing={editingId === note.id}
                        onEditStart={setEditingId}
                        onEditCancel={() => setEditingId(null)}
                        onUpdate={updateNote}
                        onDelete={deleteNote}
                    />
                ))}
            </Masonry>

            {/* 4. Empty State */}
            {activeNotes.length === 0 && (
                <div className="empty-state">
                    <MdPushPin style={{ fontSize: '5rem', color: 'var(--border-color)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Your notes created appear here</p>
                </div>
            )}
        </div>
    );
};

export default NoteDashboard;