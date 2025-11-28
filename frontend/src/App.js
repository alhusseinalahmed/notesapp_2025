import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import NotesDashboard from './components/NotesDashboard';
import AuthService from './services/AuthService';
import { MdLightbulbOutline, MdLogout, MdLogin, MdPersonAdd } from "react-icons/md";

const Navbar = () => {
    const user = AuthService.getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
        window.location.reload();
    };

    return (
        <header className="app-bar">
            <div className="app-bar-left">
                <Link to="/" className="app-logo">
                    <div className="logo-icon"><MdLightbulbOutline /></div>
                    <span className="logo-text">Keep Clone</span>
                </Link>
            </div>

            <div className="app-bar-right">
                {user ? (
                    <div className="user-menu">
                        <span className="welcome-text">Hello, {user.username}</span>
                        <button onClick={handleLogout} className="nav-btn" title="Logout">
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

    if (user) {
        return <Navigate to="/notes" replace />;
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Keep Clone</h1>
            <p>Login to start taking notes!</p>
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <Navbar />
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