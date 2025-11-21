import axios from 'axios';

// The proxy setting in package.json will redirect this to http://localhost:8080/api/auth
const API_URL = "/api/auth/"; 

const AuthService = {
    // --- 1. SIGNUP ---
    register: (username, password) => {
        return axios.post(API_URL + "signup", {
            username,
            password,
        });
    },

    // --- 2. LOGIN ---
    login: (username, password) => {
        return axios.post(API_URL + "login", {
            username,
            password,
        })
        .then(response => {
            // The Spring Boot API returns the token in the response data
            if (response.data.token) {
                // Store the JWT and username in local storage for persistence
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
    },

    // --- 3. LOGOUT ---
    logout: () => {
        // Remove user data (including JWT) from local storage
        localStorage.removeItem("user");
    },

    // --- 4. Get Current User ---
    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
};

export default AuthService;