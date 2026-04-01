import React, { useEffect, useRef, useState } from 'react';
import { testimonialAPI } from '../services/api';
import axios from 'axios';
import './Testimonials.css';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentDesktopIndex, setCurrentDesktopIndex] = useState(0);
    const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        stars: 5,
        quote: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    
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

    const handleSubmitTestimonial = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        // Generate initials from name
        const nameParts = formData.name.trim().split(' ');
        let initials = '';
        for (let i = 0; i < nameParts.length && i < 2; i++) {
            initials += nameParts[i][0].toUpperCase();
        }
        if (initials === '') initials = 'GU';
        
        try {
            const response = await axios.post('http://localhost:8000/api/testimonials/user', {
                name: formData.name,
                title: formData.title,
                initials: initials,
                stars: parseInt(formData.stars),
                quote: formData.quote
            });
            
            if (response.data.success) {
                setSubmitSuccess(true);
                setFormData({ name: '', title: '', stars: 5, quote: '' });
                setTimeout(() => {
                    setShowForm(false);
                    setSubmitSuccess(false);
                }, 3000);
            } else {
                alert(response.data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error('Error submitting testimonial:', err);
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMsg = Object.values(errors).flat().join(', ');
                alert('Error: ' + errorMsg);
            } else if (err.response?.data?.message) {
                alert(err.response.data.message);
            } else {
                alert('Failed to submit. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Auto slide for desktop
    useEffect(() => {
        if (isMobile || desktopGroups.length === 0) return;
        const interval = setInterval(() => {
            setCurrentDesktopIndex((prev) => (prev + 1) % desktopGroups.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isMobile, desktopGroups.length]);

    // Auto slide for mobile
    useEffect(() => {
        if (!isMobile || testimonials.length === 0) return;
        const interval = setInterval(() => {
            setCurrentMobileIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isMobile, testimonials.length]);

    // Intersection Observer
    useEffect(() => {
        const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (headerRef.current) headerRef.current.classList.add('visible');
                    if (!isMobile) {
                        const cards = document.querySelectorAll('.testimonial-card');
                        cards.forEach((card, index) => {
                            setTimeout(() => card.classList.add('visible'), index * 150);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [isMobile, desktopGroups]);

    const goToDesktopGroup = (index) => setCurrentDesktopIndex(index);
    const nextDesktopGroup = () => setCurrentDesktopIndex((prev) => (prev + 1) % desktopGroups.length);
    const prevDesktopGroup = () => setCurrentDesktopIndex((prev) => (prev - 1 + desktopGroups.length) % desktopGroups.length);
    const goToMobileSlide = (index) => setCurrentMobileIndex(index);
    const nextMobileSlide = () => setCurrentMobileIndex((prev) => (prev + 1) % testimonials.length);
    const prevMobileSlide = () => setCurrentMobileIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    const renderStars = (count) => {
        return [...Array(count)].map((_, i) => <i key={i} className="fas fa-star"></i>);
    };

    const currentGroup = desktopGroups[currentDesktopIndex] || [];

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
                    
                    {!showForm && (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                        >
                            <i className="fas fa-pen-alt mr-2"></i>
                            Share Your Experience
                        </button>
                    )}
                </div>
                
                {showForm && (
                    <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-yellow-600">Share Your Experience</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500">✕</button>
                        </div>
                        
                        {submitSuccess ? (
                            <div className="text-center py-8">
                                <i className="fas fa-check-circle text-green-500 text-5xl mb-3"></i>
                                <p className="text-green-400">Thank you for your feedback!</p>
                                <p className="text-gray-400 text-sm mt-2">Your review will be published after admin approval.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Your Name *" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Your Title (e.g., Food Lover) *" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                />
                                <select 
                                    value={formData.stars}
                                    onChange={(e) => setFormData({...formData, stars: e.target.value})}
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                                >
                                    <option value="5">★★★★★ (5 Stars)</option>
                                    <option value="4">★★★★☆ (4 Stars)</option>
                                    <option value="3">★★★☆☆ (3 Stars)</option>
                                </select>
                                <textarea 
                                    placeholder="Your Review *" 
                                    rows="4"
                                    value={formData.quote}
                                    onChange={(e) => setFormData({...formData, quote: e.target.value})}
                                    required
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none"
                                />
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
                
                {/* Desktop View */}
                <div className="desktop-view">
                    <div className="desktop-grid">
                        {currentGroup.map((testimonial) => (
                            <div key={testimonial.id} className="testimonial-card">
                                <div className="testimonial-stars">{renderStars(testimonial.stars)}</div>
                                <p className="testimonial-quote">"{testimonial.quote}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{testimonial.initials}</div>
                                    <div>
                                        <div className="testimonial-author-name">{testimonial.name}</div>
                                        <div className="testimonial-author-title">{testimonial.title}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="desktop-controls">
                        <button className="desktop-nav-btn prev" onClick={prevDesktopGroup}><i className="fas fa-chevron-left"></i></button>
                        <div className="desktop-dots">
                            {desktopGroups.map((_, idx) => (
                                <button key={idx} className={`desktop-dot ${idx === currentDesktopIndex ? 'active' : ''}`} onClick={() => goToDesktopGroup(idx)}></button>
                            ))}
                        </div>
                        <button className="desktop-nav-btn next" onClick={nextDesktopGroup}><i className="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                
                {/* Mobile View */}
                <div className="mobile-view">
                    <div className="testimonials-slider">
                        <div className="slider-container">
                            {testimonials.map((testimonial, idx) => (
                                <div key={testimonial.id} className={`mobile-card ${idx === currentMobileIndex ? 'active' : ''}`} style={{ display: idx === currentMobileIndex ? 'block' : 'none' }}>
                                    <div className="testimonial-stars">{renderStars(testimonial.stars)}</div>
                                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                                    <div className="testimonial-author">
                                        <div className="testimonial-avatar">{testimonial.initials}</div>
                                        <div>
                                            <div className="testimonial-author-name">{testimonial.name}</div>
                                            <div className="testimonial-author-title">{testimonial.title}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mobile-controls">
                            <button className="slider-nav prev" onClick={prevMobileSlide}><i className="fas fa-chevron-left"></i></button>
                            <div className="slider-dots">
                                {testimonials.map((_, idx) => (
                                    <button key={idx} className={`dot ${idx === currentMobileIndex ? 'active' : ''}`} onClick={() => goToMobileSlide(idx)}></button>
                                ))}
                            </div>
                            <button className="slider-nav next" onClick={nextMobileSlide}><i className="fas fa-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;