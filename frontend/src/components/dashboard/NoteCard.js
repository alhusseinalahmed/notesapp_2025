import React from 'react';
import { MdPushPin, MdOutlinePushPin, MdDeleteOutline, MdOutlineArchive, MdOutlineUnarchive, MdEdit } from "react-icons/md";

const NoteCard = ({ note, isEditing, onEditStart, onEditCancel, onUpdate, onDelete }) => {

    const handleSave = (e) => {
        e.preventDefault();
        const updatedTitle = e.target.title.value;
        const updatedContent = e.target.content.value;

        onUpdate(note.id, {
            title: updatedTitle,
            content: updatedContent
        });
        onEditCancel(); // Exit edit mode
    };

    return (
        <div className="note-card">
            {isEditing ? (
                // --- EDIT MODE ---
                <form className="edit-form" onSubmit={handleSave}>
                    <input
                        name="title"
                        defaultValue={note.title}
                        className="edit-title"
                        placeholder="Title"
                    />
                    <textarea
                        name="content"
                        defaultValue={note.content}
                        className="edit-content"
                        placeholder="Note"
                    />
                    <div className="edit-actions">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" onClick={onEditCancel} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            ) : (
                // --- VIEW MODE ---
                <div className="note-content-wrapper">
                    <div className="note-header">
                        {note.title && <h3>{note.title}</h3>}
                        <button
                            className={`icon-btn pin-btn ${note.pinned ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onUpdate(note.id, { pinned: !note.pinned });
                            }}
                        >
                            {note.pinned ? <MdPushPin /> : <MdOutlinePushPin />}
                        </button>
                    </div>

                    <p className="note-text">{note.content}</p>

                    <div className="note-footer">
                        <div className="note-tools">
                            <button
                                className="icon-btn"
                                onClick={() => onUpdate(note.id, { archived: !note.archived })}
                                title={note.archived ? "Unarchive" : "Archive"}
                            >
                                {note.archived ? <MdOutlineUnarchive /> : <MdOutlineArchive />}
                            </button>

                            <button
                                className="icon-btn"
                                onClick={() => onDelete(note.id)}
                                title="Delete"
                            >
                                <MdDeleteOutline />
                            </button>

                            <button
                                className="icon-btn"
                                onClick={() => onEditStart(note.id)}
                                title="Edit"
                            >
                                <MdEdit />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NoteCard;