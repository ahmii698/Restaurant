import React, { useEffect, useRef, useState } from 'react';
import { testimonialAPI } from '../services/api';
import './Testimonials.css';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentDesktopIndex, setCurrentDesktopIndex] = useState(0);
    const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    // Create groups of 3 testimonials for desktop slider
    const getDesktopGroups = () => {
        const groups = [];
        for (let i = 0; i < testimonials.length; i += 3) {
            groups.push(testimonials.slice(i, i + 3));
        }
        return groups;
    };

    const desktopGroups = getDesktopGroups();

    useEffect(() => {
        fetchTestimonials();
        
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await testimonialAPI.getActive();
            setTestimonials(response.data);
        } catch (err) {
            console.error('Error fetching testimonials:', err);
            setError('Failed to load testimonials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Auto slide for desktop (3 cards at a time)
    useEffect(() => {
        if (isMobile || desktopGroups.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentDesktopIndex((prev) => (prev + 1) % desktopGroups.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [isMobile, desktopGroups.length]);

    // Auto slide for mobile (1 card at a time)
    useEffect(() => {
        if (!isMobile || testimonials.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentMobileIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isMobile, testimonials.length]);

    // Intersection Observer for section visibility
    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (headerRef.current) headerRef.current.classList.add('visible');
                    
                    if (!isMobile) {
                        const cards = document.querySelectorAll('.testimonial-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('visible');
                            }, index * 150);
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [isMobile, desktopGroups]);

    const goToDesktopGroup = (index) => {
        setCurrentDesktopIndex(index);
    };

    const nextDesktopGroup = () => {
        setCurrentDesktopIndex((prev) => (prev + 1) % desktopGroups.length);
    };

    const prevDesktopGroup = () => {
        setCurrentDesktopIndex((prev) => (prev - 1 + desktopGroups.length) % desktopGroups.length);
    };

    const goToMobileSlide = (index) => {
        setCurrentMobileIndex(index);
    };

    const nextMobileSlide = () => {
        setCurrentMobileIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevMobileSlide = () => {
        setCurrentMobileIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const renderStars = (count) => {
        return [...Array(count)].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
        ));
    };

    if (loading) {
        return (
            <section className="testimonials-section">
                <div className="container mx-auto px-6 text-center py-20">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading reviews...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="testimonials-section">
                <div className="container mx-auto px-6 text-center py-20">
                    <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <p className="text-red-400">{error}</p>
                </div>
            </section>
        );
    }

    // Current desktop group to display
    const currentGroup = desktopGroups[currentDesktopIndex] || [];

    return (
        <section id="testimonials" className="testimonials-section" ref={sectionRef}>
            <div className="testimonials-bg-1"></div>
            <div className="testimonials-bg-2"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="testimonials-header" ref={headerRef}>
                    <div className="testimonials-badge">
                        <span className="testimonials-badge-text">
                            <i className="fas fa-heart text-yellow-500 text-xs"></i>
                            Guest Love
                            <i className="fas fa-heart text-yellow-500 text-xs"></i>
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-gold">What Our Guests Say</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Don't just take our word for it - hear what our guests have to say
                    </p>
                </div>
                
                {/* ============ DESKTOP VIEW - 3 CARDS WITH CONTROLS BELOW ============ */}
                <div className="desktop-view">
                    {/* Desktop Grid - 3 Cards */}
                    <div className="desktop-grid">
                        {currentGroup.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div className="testimonial-stars">
                                    {renderStars(testimonial.stars)}
                                </div>
                                <p className="testimonial-quote">"{testimonial.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <div className="testimonial-author-name">{testimonial.name}</div>
                                        <div className="testimonial-author-title">{testimonial.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Desktop Controls - BELOW Cards */}
                    <div className="desktop-controls">
                        <button className="desktop-nav-btn prev" onClick={prevDesktopGroup}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <div className="desktop-dots">
                            {desktopGroups.map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`desktop-dot ${idx === currentDesktopIndex ? 'active' : ''}`}
                                    onClick={() => goToDesktopGroup(idx)}
                                ></button>
                            ))}
                        </div>
                        <button className="desktop-nav-btn next" onClick={nextDesktopGroup}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                
                {/* ============ MOBILE VIEW - 1 CARD WITH CONTROLS BELOW ============ */}
                <div className="mobile-view">
                    {/* Mobile Card */}
                    <div className="testimonials-slider">
                        <div className="slider-container">
                            {testimonials.map((testimonial, idx) => (
                                <div 
                                    key={testimonial.id} 
                                    className={`mobile-card ${idx === currentMobileIndex ? 'active' : ''}`}
                                    style={{ display: idx === currentMobileIndex ? 'block' : 'none' }}
                                >
                                    <div className="testimonial-stars">
                                        {renderStars(testimonial.stars)}
                                    </div>
                                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar">
                                            {testimonial.initials}
                                        </div>
                                        <div>
                                            <div className="testimonial-author-name">{testimonial.name}</div>
                                            <div className="testimonial-author-title">{testimonial.title}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Mobile Controls - BELOW Card */}
                        <div className="mobile-controls">
                            <button className="slider-nav prev" onClick={prevMobileSlide}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <div className="slider-dots">
                                {testimonials.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`dot ${idx === currentMobileIndex ? 'active' : ''}`}
                                        onClick={() => goToMobileSlide(idx)}
                                    ></button>
                                ))}
                            </div>
                            <button className="slider-nav next" onClick={nextMobileSlide}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;