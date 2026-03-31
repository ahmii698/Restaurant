import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_reservations: 0,
        pending_reservations: 0,
        total_menu_items: 0,
        total_gallery: 0,
        total_testimonials: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminAPI.getDashboard();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Reservations', value: stats.total_reservations, icon: 'fa-calendar-check' },
        { label: 'Pending Reservations', value: stats.pending_reservations, icon: 'fa-clock' },
        { label: 'Menu Items', value: stats.total_menu_items, icon: 'fa-utensils' },
        { label: 'Gallery Images', value: stats.total_gallery, icon: 'fa-images' },
        { label: 'Testimonials', value: stats.total_testimonials, icon: 'fa-star' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 gradient-gold">Dashboard</h1>
            
            <div className="stats-grid">
                {statCards.map((card, index) => (
                    <div key={index} className="stat-card">
                        <i className={`fas ${card.icon} text-yellow-500 text-2xl mb-2 block`}></i>
                        <h3>{card.label}</h3>
                        <div className="stat-number">{loading ? '...' : card.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;