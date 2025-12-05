import React, { useState, useRef, useEffect } from 'react';

const CreateNoteForm = ({ onCreate }) => {
    const [isExpanded, setExpanded] = useState(false);
    const [note, setNote] = useState({ title: '', content: '' });
    const formRef = useRef(null);

    // Handle clicking outside to collapse
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [formRef]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prevent empty notes
        if (!note.content && !note.title) return;

        onCreate(note);
        setNote({ title: '', content: '' }); // Reset form
        setExpanded(false); // Collapse
    };

    return (
        <div className={`create-note-container ${isExpanded ? 'expanded' : ''}`} ref={formRef}>
            <form className="create-note-form">
                {isExpanded && (
                    <input
                        type="text"
                        placeholder="Title"
                        value={note.title}
                        onChange={(e) => setNote({ ...note, title: e.target.value })}
                        className="create-title"
                    />
                )}
                <textarea
                    placeholder="Take a note..."
                    value={note.content}
                    onClick={() => setExpanded(true)}
                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                    className="create-content"
                    rows={isExpanded ? 3 : 1}
                />
                {isExpanded && (
                    <div className="create-actions">
                        <div style={{ flex: 1 }}></div>
                        <button onClick={handleSubmit} className="close-btn">Close</button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreateNoteForm;