import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [counters, setCounters] = useState({
        burgers: 0,
        years: 0,
        awards: 0
    });

    useEffect(() => {
        // Show content after 8 seconds or video loads
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 8000);

        // Animate counters when visible
        if (isVisible) {
            const animateCounter = (target, field, duration = 2000) => {
                const stepTime = 20;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;
                
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        setCounters(prev => ({ ...prev, [field]: target }));
                        clearInterval(interval);
                    } else {
                        setCounters(prev => ({ ...prev, [field]: Math.floor(current) }));
                    }
                }, stepTime);
                
                return interval;
            };
            
            animateCounter(85, 'burgers');
            animateCounter(15, 'years');
            animateCounter(25, 'awards');
        }
        
        return () => clearTimeout(timer);
    }, [isVisible]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleArrowClick = () => {
        scrollToSection('about');
    };

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
                    <source src="/video/burg_vid.mp4" type="video/mp4" />
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
                    <span className="hero-title-line gradient-gold gold-glow">Luxury Dining</span>
                    <span className="hero-title-line text-white">Reimagined</span>
                </div>
                
                <p className="hero-description">
                    Experience the pinnacle of gastronomy. Handcrafted burgers, premium ingredients, 
                    and an ambiance that defines elegance.
                </p>
                
                <div className="hero-buttons">
                    <button 
                        onClick={() => scrollToSection('menu')} 
                        className="btn-primary"
                    >
                        <i className="fas fa-utensils"></i> 
                        Explore Menu
                        <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                    <button 
                        onClick={() => window.toggleBooking && window.toggleBooking()} 
                        className="btn-outline"
                    >
                        <i className="fas fa-calendar-alt"></i> 
                        Reserve Now
                    </button>
                </div>
                
                {/* Stats with animated numbers */}
                <div className="hero-stats">
                    <div className="stat-item">
                        <div className="stat-number">{counters.burgers}</div>
                        <div className="stat-label">Gourmet Burgers</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{counters.years}</div>
                        <div className="stat-label">Years Excellence</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">{counters.awards}</div>
                        <div className="stat-label">Awards Won</div>
                    </div>
                </div>
            </div>
            
        
        </section>
    );
};

export default Hero;