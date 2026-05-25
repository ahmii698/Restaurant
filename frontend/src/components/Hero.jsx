import React, { useState, useEffect } from 'react';
import { heroAPI } from '../services/api';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
    const [heroData, setHeroData] = useState(null);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [counters, setCounters] = useState({});

    // Fetch hero data from database
    useEffect(() => {
        fetchHeroData();
        fetchHeroStats(); // ✅ Hero stats fetch karne ke liye
    }, []);

    const fetchHeroData = async () => {
        try {
            const response = await heroAPI.getContent();
            console.log('Hero data:', response.data);
            setHeroData(response.data.hero);
            setStats(response.data.stats);
            
            // Initialize counters
            const initialCounters = {};
            response.data.stats.forEach(stat => {
                initialCounters[stat.id] = 0;
            });
            setCounters(initialCounters);
        } catch (error) {
            console.error('Error fetching hero data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Naya function - Hero Stats fetch karne ke liye
    const fetchHeroStats = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/hero-stats');
            // Sirf active stats filter karo aur order ke hisab se sort karo
            const activeStats = response.data.filter(stat => stat.is_active).sort((a, b) => a.order - b.order);
            setStats(activeStats);
            
            // Initialize counters
            const initialCounters = {};
            activeStats.forEach(stat => {
                initialCounters[stat.id] = 0;
            });
            setCounters(initialCounters);
        } catch (error) {
            console.error('Error fetching hero stats:', error);
        }
    };

    useEffect(() => {
        // Show content after 8 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    // Animate counters when visible
    useEffect(() => {
        if (isVisible && stats.length > 0) {
            stats.forEach((stat) => {
                const target = stat.value;
                let current = 0;
                const increment = target / 50;
                
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        setCounters(prev => ({ ...prev, [stat.id]: target }));
                        clearInterval(interval);
                    } else {
                        setCounters(prev => ({ ...prev, [stat.id]: Math.floor(current) }));
                    }
                }, 20);
                
                return () => clearInterval(interval);
            });
        }
    }, [isVisible, stats]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleArrowClick = () => {
        scrollToSection('about');
    };

    if (loading) {
        return (
            <section id="home" className="hero-section">
                <div className="container mx-auto px-6 text-center py-40">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </section>
        );
    }

    return (
        <section id="home" className="hero-section">
            {/* Video Background */}
            <div className="hero-video-container">
                <div className="hero-video-overlay"></div>
                <video 
                    className="hero-video" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    onPlaying={() => setIsVideoLoading(false)}
                    onError={() => setIsVideoLoading(false)}
                >
                    <source src={heroData?.video_url || '/video/burg_vid.mp4'} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                {isVideoLoading && (
                    <div className="video-loading">
                        <div className="loading-spinner"></div>
                    </div>
                )}
            </div>
            
            {/* Main Content */}
            <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
                <div className="hero-title">
                    <span className="hero-title-line gradient-gold gold-glow">{heroData?.heading_1 || 'Luxury Dining'}</span>
                    <span className="hero-title-line text-white">{heroData?.heading_2 || 'Reimagined'}</span>
                </div>
                
                <p className="hero-description">
                    {heroData?.description || 'Experience the pinnacle of gastronomy. Handcrafted burgers, premium ingredients, and an ambiance that defines elegance.'}
                </p>
                
                <div className="hero-buttons">
                    <button 
                        onClick={() => scrollToSection('menu')} 
                        className="btn-primary"
                    >
                        <i className={`fas ${heroData?.btn_1_icon || 'fa-utensils'}`}></i> 
                        {heroData?.btn_1_text || 'Explore Menu'}
                        <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <button 
                        onClick={() => window.toggleBooking && window.toggleBooking()} 
                        className="btn-outline"
                    >
                        <i className={`fas ${heroData?.btn_2_icon || 'fa-calendar-alt'}`}></i> 
                        {heroData?.btn_2_text || 'Reserve Now'}
                    </button>
                </div>
                
                {/* ✅ Stats with animated numbers - Updated to show icon if available */}
                <div className="hero-stats">
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-item">
                            {/* ✅ Icon show karo agar hai */}
                            {stat.icon && <i className={`fas ${stat.icon} text-yellow-500 text-2xl mb-2 block`}></i>}
                            <div className="stat-number">{counters[stat.id] || 0}+</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;