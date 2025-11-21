import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/LoginComponent';
import NotesDashboard from './components/NotesDashboard'; 
import AuthService from './services/AuthService';
import RegisterComponent from './components/RegisterComponent';

const Home = () => <h1>Welcome to NotesApp!</h1>;

const App = () => {
    // Simple conditional logic to show different links
    const currentUser = AuthService.getCurrentUser();
    
    return (
        <Router>
            <nav className="navbar">
                <Link to="/">Home</Link>
                {currentUser ? (
                    <>
                        <Link to="/notes">Dashboard</Link>
                        <a href="/" onClick={AuthService.logout}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/register" element={<RegisterComponent />} />
                    <Route path="/notes" element={<NotesDashboard />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;