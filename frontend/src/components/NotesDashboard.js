import React, { useState, useEffect } from 'react';
import NoteService from '../services/NoteService';
import AuthService from '../services/AuthService';

const NoteDashboard = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '', color: 'yellow' });
    const user = AuthService.getCurrentUser();
    const [editingId, setEditingId] = useState(null);

    // --- Data Fetching ---
    const fetchNotes = () => {
        NoteService.getAllNotes()
            .then(response => {
                setNotes(response.data);
            })
            .catch(error => {
                console.error("Error fetching notes:", error);
                // Handle 401 Unauthorized (e.g., redirect to login)
            });
    };

    const handleUpdate = (e, noteId, updatedFields) => {
        e.preventDefault();

        // Find the full, current note object to ensure we send all fields (title, content, color, etc.)
        const currentNote = notes.find(n => n.id === noteId);

        // Merge current note data with updated fields
        const updatedNoteData = {
            ...currentNote,
            ...updatedFields
        };

        NoteService.updateNote(noteId, updatedNoteData)
            .then(() => {
                setEditingId(null); // Exit edit mode
                fetchNotes();       // Refresh the list to show changes
            })
            .catch(error => console.error("Error updating note:", error));
    };

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, []); // <--- Empty dependency array means fire ONLY on mount.
    // --- Create Logic ---
    const handleCreate = (e) => {
        e.preventDefault();
        NoteService.createNote(newNote)
            .then(() => {
                setNewNote({ title: '', content: '', color: 'yellow' }); // Clear form
                fetchNotes(); // Refresh the list
            })
            .catch(error => console.error("Error creating note:", error));
    };

    // --- Delete Logic ---
    const handleDelete = (id) => {
        NoteService.deleteNote(id)
            .then(() => {
                fetchNotes(); // Refresh the list
            })
            .catch(error => console.error("Error deleting note:", error));
    };

    if (!user) {
        return <h2 className="error-message">Access Denied. Please log in.</h2>;
    }

    return (
        <div className="dashboard">
            <h1>{user.username}'s Notes</h1>

            {/* Create Note Form */}
            <form onSubmit={handleCreate} className="note-creator">
                <input
                    type="text"
                    placeholder="Title (optional)"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <textarea
                    placeholder="Take a note..."
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    required
                />
                {/* Simple color picker can be added here */}
                <button type="submit">Add Note</button>
            </form>

            {/* Notes List */}
            <div className="notes-grid">
                {/* --- Display Message if No Notes Exist --- */}
                {notes.length === 0 ? (
                    <p>You don't have any notes yet. Use the form above to create one!</p>
                ) : (
                    // --- Map and Render Notes ---
                    notes.map(note => (
                        <div key={note.id} className={`note-card ${note.color}`}>
                            {editingId === note.id ? (
                                /* --- EDITING MODE --- */
                                <form onSubmit={(e) => handleUpdate(e, note.id, {
                                    title: e.target.title.value,
                                    content: e.target.content.value
                                })}>
                                    <input
                                        name="title"
                                        type="text"
                                        defaultValue={note.title}
                                        placeholder="Title"
                                    />
                                    <textarea
                                        name="content"
                                        defaultValue={note.content}
                                        placeholder="Content"
                                        required
                                    />
                                    <button type="submit">Save</button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                /* --- VIEW MODE --- */
                                <>
                                    <h3>{note.title}</h3>
                                    <p>{note.content}</p>

                                    <button
                                        className="edit-button"
                                        onClick={() => setEditingId(note.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDelete(note.id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NoteDashboard;