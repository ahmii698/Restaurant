import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './admin/pages/Dashboard';
import Reservations from './admin/pages/Reservations';
import MenuManager from './admin/pages/MenuManager';
import GalleryManager from './admin/pages/GalleryManager';
import TestimonialsManager from './admin/pages/TestimonialsManager';
import HeroManager from './admin/pages/HeroManager';
import AboutManager from './admin/pages/AboutManager';
// Contacts import hata diya
import './Admin.css';

function AdminApp() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/admin/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAuthenticated(response.data.success);
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        setIsAuthenticated(false);
        navigate('/admin/login');
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const menuItems = [
        { path: '/admin/dashboard', name: 'Dashboard', icon: 'fa-tachometer-alt' },
        { path: '/admin/reservations', name: 'Reservations', icon: 'fa-calendar-check' },
        { path: '/admin/menu', name: 'Menu Items', icon: 'fa-utensils' },
        { path: '/admin/gallery', name: 'Gallery', icon: 'fa-images' },
        { path: '/admin/testimonials', name: 'Testimonials', icon: 'fa-star' },
        { path: '/admin/hero', name: 'Hero Section', icon: 'fa-home' },
        { path: '/admin/about', name: 'About Section', icon: 'fa-info-circle' },
        // Contacts hata diya
    ];

    return (
        <div className="admin-app">
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <h2 className="gradient-gold">Gourmet Bistro</h2>
                    <p className="text-gray-500 text-sm">Admin Panel</p>
                </div>
                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link key={item.path} to={item.path} className="sidebar-link">
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            
            <main className="admin-main">
                <header className="admin-header">
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <h1>Admin Dashboard</h1>
                    <div className="admin-user">
                        <i className="fas fa-user-circle"></i>
                        <span>Admin</span>
                    </div>
                </header>
                
                <div className="admin-content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/reservations" element={<Reservations />} />
                        <Route path="/menu" element={<MenuManager />} />
                        <Route path="/gallery" element={<GalleryManager />} />
                        <Route path="/testimonials" element={<TestimonialsManager />} />
                        <Route path="/hero" element={<HeroManager />} />
                        <Route path="/about" element={<AboutManager />} />
                        {/* Contacts route hata diya */}
                        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default AdminApp;