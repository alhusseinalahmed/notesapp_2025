import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { MdLightbulbOutline } from "react-icons/md";

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

        if (!username || !password) {
            setMessage("Username and Password are required.");
            return;
        }
        
        AuthService.register(username, password).then(
            (response) => {
                setMessage(response.data.message || "Registration successful!");
                setSuccessful(true);
                setTimeout(() => navigate("/login"), 2000); 
            },
            (error) => {
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
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon"><MdLightbulbOutline /></div>
                    <h2 className="auth-title">Create Account</h2>
                    <p className="auth-subtitle">Continue to Keep Clone</p>
                </div>

                {message && (
                    <div className={`auth-alert ${successful ? 'success-alert' : ''}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleRegister} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn-primary">Sign Up</button>
                </form>

                <div className="auth-footer">
                    Already have an account? 
                    <Link to="/login" className="auth-link">Sign in instead</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterComponent;