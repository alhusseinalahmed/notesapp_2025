import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import NotesDashboard from './components/NotesDashboard';
import AuthService from './services/AuthService';
import { MdLightbulbOutline, MdLogout, MdLogin, MdPersonAdd, MdDarkMode, MdLightMode } from "react-icons/md";

// --- NEW NAVBAR COMPONENT ---
const Navbar = ({ darkMode, toggleTheme }) => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
        window.location.reload();
    };

    // Get initials for avatar (e.g. "John Doe" -> "J")
    const getInitials = (name) => name ? name.charAt(0).toUpperCase() : 'U';

    return (
        <header className="app-bar">
            <div className="app-bar-left">
                <Link to="/" className="app-logo">
                    <div className="logo-icon"><MdLightbulbOutline /></div>
                    <span className="logo-text">Keep Clone</span>
                </Link>
            </div>

            <div className="app-bar-right">
                {/* Theme Toggle is always visible */}
                <button onClick={toggleTheme} className="nav-icon-btn" title={darkMode ? "Light Mode" : "Dark Mode"}>
                    {darkMode ? <MdLightMode /> : <MdDarkMode />}
                </button>

                {user ? (
                    <div className="user-profile">
                        {/* User Avatar */}
                        <div className="user-avatar" title={user.username}>
                            {getInitials(user.username)}
                        </div>
                        {/* Logout Button */}
                        <button onClick={handleLogout} className="nav-icon-btn" title="Logout">
                            <MdLogout />
                        </button>
                    </div>
                ) : (
                    <div className="auth-menu">
                        <Link to="/login" className="nav-link"><MdLogin /> Login</Link>
                        <Link to="/register" className="nav-link"><MdPersonAdd /> Register</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

const Home = () => {
    const user = AuthService.getCurrentUser();
    if (user) return <Navigate to="/notes" replace />;
    
    return (
        <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-primary)' }}>
            <MdLightbulbOutline style={{ fontSize: '4rem', color: '#fbbc04', marginBottom: '20px' }} />
            <h1>Welcome to Keep Clone</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Login to capture your ideas.</p>
        </div>
    );
};

const App = () => {
    // 1. Initialize State from LocalStorage
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    // 2. Apply Theme Class to Body
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <Router>
            <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginComponent />} />
                    <Route path="/register" element={<RegisterComponent />} />
                    <Route path="/notes" element={<NotesDashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;