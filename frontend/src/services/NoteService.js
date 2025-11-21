import axios from 'axios';
import AuthService from './AuthService'; // Need this to get the JWT token

const API_URL = "/api/notes";

// Function to attach the JWT header to requests
const authHeader = () => {
    const user = AuthService.getCurrentUser();
    // CRITICAL: user.token must exist and be in the format 'Bearer <token>'
    if (user && user.token) {
        return { Authorization: 'Bearer ' + user.token };
    } else {
        return {};
    }
};

const NoteService = {
    // 1. READ ALL
    getAllNotes: () => {
        return axios.get(API_URL, { headers: authHeader() });
    },

    // 2. CREATE
    createNote: (noteData) => {
        return axios.post(API_URL, noteData, { headers: authHeader() });
    },

    // 3. UPDATE
    updateNote: (id, noteData) => {
        return axios.put(`${API_URL}/${id}`, noteData, { headers: authHeader() });
    },

    // 4. DELETE
    deleteNote: (id) => {
        return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
    }
};

export default NoteService;