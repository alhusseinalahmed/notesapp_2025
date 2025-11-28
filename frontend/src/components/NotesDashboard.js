import React, { useState, useEffect, useRef } from 'react';
import NoteService from '../services/NoteService';
import AuthService from '../services/AuthService';
import { MdPushPin, MdOutlinePushPin, MdDeleteOutline, MdOutlineArchive, MdOutlineUnarchive, MdEdit, MdPalette } from "react-icons/md";
import Masonry from 'react-masonry-css';

const NoteDashboard = () => {
    const [notes, setNotes] = useState([]);
    const [isExpanded, setExpanded] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', color: 'white' });
    const user = AuthService.getCurrentUser();
    const [editingId, setEditingId] = useState(null);
    const formRef = useRef(null);

    const colors = [
        { name: 'white', hex: '#ffffff' },
        { name: 'red', hex: '#f28b82' },
        { name: 'orange', hex: '#fbbc04' },
        { name: 'yellow', hex: '#fff475' },
        { name: 'green', hex: '#ccff90' },
        { name: 'teal', hex: '#a7ffeb' },
        { name: 'blue', hex: '#cbf0f8' },
        { name: 'darkblue', hex: '#aecbfa' },
        { name: 'purple', hex: '#d7aefb' },
        { name: 'pink', hex: '#fdcfe8' },
        { name: 'brown', hex: '#e6c9a8' },
        { name: 'gray', hex: '#e8eaed' }
    ];

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    const fetchNotes = () => {
        NoteService.getAllNotes()
            .then(response => {
                setNotes(response.data || []);
            })
            .catch(error => console.error("Error fetching notes:", error));
    };

    useEffect(() => {
        if (user) fetchNotes();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [formRef]);

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newNote.content && !newNote.title) return;
        NoteService.createNote(newNote).then(() => {
            setNewNote({ title: '', content: '', color: 'white' });
            fetchNotes();
            setExpanded(false);
        });
    };

    const handleUpdate = (id, updatedFields) => {
        const currentNote = notes.find(n => n.id === id);
        NoteService.updateNote(id, { ...currentNote, ...updatedFields })
            .then(() => {
                setEditingId(null);
                fetchNotes();
            });
    };

    const handleDelete = (id) => {
        NoteService.deleteNote(id).then(() => fetchNotes());
    };

    const activeNotes = notes.filter(n => !n.archived);

    const pinnedNotes = activeNotes.filter(n => n.pinned).sort((a, b) => b.id - a.id);
    const otherNotes = activeNotes.filter(n => !n.pinned).sort((a, b) => b.id - a.id);

    const renderNote = (note) => (
        <div key={note.id} className={`note-card ${note.color}`}>
            {editingId === note.id ? (
                <form
                    className="edit-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(note.id, {
                            title: e.target.title.value,
                            content: e.target.content.value
                        });
                    }}
                >
                    <input name="title" defaultValue={note.title} className="edit-title" />
                    <textarea name="content" defaultValue={note.content} className="edit-content" />
                    <div className="edit-actions">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            ) : (
                <div className="note-content-wrapper">
                    <div className="note-header">
                        {note.title && <h3>{note.title}</h3>}
                        <button
                            className={`icon-btn pin-btn ${note.pinned ? 'active' : ''}`}
                            onClick={() => handleUpdate(note.id, { pinned: !note.pinned })}
                        >
                            {note.pinned ? <MdPushPin /> : <MdOutlinePushPin />}
                        </button>
                    </div>

                    <p className="note-text">{note.content}</p>

                    <div className="note-footer">
                        <div className="note-tools">
                            <button className="icon-btn" onClick={() => handleUpdate(note.id, { archived: !note.archived })}>
                                <MdOutlineArchive />
                            </button>

                            <button className="icon-btn" onClick={() => handleDelete(note.id)}>
                                <MdDeleteOutline />
                            </button>

                            <button className="icon-btn" onClick={() => setEditingId(note.id)}>
                                <MdEdit />
                            </button>

                            <div className="color-picker-wrapper">
                                <button className="icon-btn"><MdPalette /></button>
                                <div className="color-popup">
                                    {colors.map(c => (
                                        <div
                                            key={c.name}
                                            className="color-circle"
                                            style={{ backgroundColor: c.hex }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUpdate(note.id, { color: c.name });
                                            }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (!user) return <div className="container">Please log in.</div>;

    return (
        <div className="dashboard-container">
            {/* Create Note Bar */}
            <div className={`create-note-container ${isExpanded ? 'expanded' : ''}`} ref={formRef}>
                <form className="create-note-form">
                    {isExpanded && (
                        <input
                            type="text"
                            placeholder="Title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            className="create-title"
                        />
                    )}
                    <textarea
                        placeholder="Take a note..."
                        value={newNote.content}
                        onClick={() => setExpanded(true)}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        className="create-content"
                        rows={isExpanded ? 3 : 1}
                    />
                    {isExpanded && (
                        <div className="create-actions">
                            <div className="color-palette">
                                {colors.slice(0, 5).map(c => (
                                    <span
                                        key={c.name}
                                        className="color-dot"
                                        style={{ backgroundColor: c.hex }}
                                        onClick={() => setNewNote({ ...newNote, color: c.name })}
                                    />
                                ))}
                            </div>
                            <button onClick={handleCreate} className="close-btn">Close</button>
                        </div>
                    )}
                </form>
            </div>

            {/* --- PINNED NOTES SECTION --- */}
            {pinnedNotes.length > 0 && (
                <>
                    <div className="section-title">PINNED</div>
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {pinnedNotes.map(note => renderNote(note))}
                    </Masonry>
                </>
            )}

            {/* --- OTHERS NOTES SECTION --- */}
            {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                <div className="section-title">OTHERS</div>
            )}

            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {otherNotes.map(note => renderNote(note))}
            </Masonry>

            {/* Empty State */}
            {activeNotes.length === 0 && (
                <div className="empty-state">
                    <MdPushPin style={{ fontSize: '5rem', color: '#e0e0e0' }} />
                    <p style={{ color: '#5f6368' }}>Your notes created appear here</p>
                </div>
            )}
        </div>
    );
};

export default NoteDashboard;