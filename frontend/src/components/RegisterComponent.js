import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

const RegisterComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);

        // Frontend Validation
        if (!username || !password) {
            setMessage("Username and Password are required.");
            return;
        }
        
        // --- Call Backend Service ---
        AuthService.register(username, password).then(
            (response) => {
                // Success response from Spring Boot (status 200)
                setMessage(response.data.message || "Registration successful!");
                setSuccessful(true);
                // Optionally redirect to login after success
                setTimeout(() => navigate("/login"), 2000); 
            },
            (error) => {
                // Error response from Spring Boot (e.g., status 400 if username exists)
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    return (
        <div className="auth-form">
            <h2>Create Your NotesApp Account</h2>
            
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            
            {message && (
                <div className={successful ? "alert alert-success" : "alert alert-danger"}>
                    {message}
                </div>
            )}
            
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default RegisterComponent;