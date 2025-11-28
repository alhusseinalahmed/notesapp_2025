import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { MdLightbulbOutline } from "react-icons/md";

const LoginComponent = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setMessage("");

        AuthService.login(username, password).then(
            () => {
                navigate("/notes");
                window.location.reload();
            },
            (error) => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage || "Login failed.");
            }
        );
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon"><MdLightbulbOutline /></div>
                    <h2 className="auth-title">Sign in</h2>
                    <p className="auth-subtitle">Use your Keep Clone Account</p>
                </div>

                {message && <div className="auth-alert">{message}</div>}

                <form onSubmit={handleLogin} className="auth-form">
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
                    <button type="submit" className="auth-btn-primary">Login</button>
                </form>

                <div className="auth-footer">
                    Not registered? 
                    <Link to="/register" className="auth-link">Create account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;