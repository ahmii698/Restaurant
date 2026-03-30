import React, { useState, useEffect, useRef } from 'react';
import { reservationAPI } from '../services/api';
import './Reservation.css';

const Reservation = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',  // Added email field
        date: '',
        time: '',
        guests: '',
        special_requests: '',
        vip: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const cardRef = useRef(null);
    const btnRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            console.log('Sending reservation data:', formData);
            
            const response = await reservationAPI.create(formData);
            
            console.log('API Response:', response.data);
            
            if (response.data) {
                setIsSubmitted(true);
                // Show success toast
                const toast = document.getElementById('toast');
                const message = document.getElementById('toast-message');
                if (toast && message) {
                    message.textContent = 'Reservation confirmed! 🎉';
                    toast.classList.remove('translate-y-20', 'opacity-0');
                    setTimeout(() => {
                        toast.classList.add('translate-y-20', 'opacity-0');
                    }, 3000);
                }
            }
        } catch (err) {
            console.error('Reservation error:', err);
            console.error('Error response:', err.response?.data);
            
            if (err.response?.data?.errors) {
                // Validation errors
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                setError(errorMessages);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Intersection Observer for section visibility
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    
                    if (headerRef.current) headerRef.current.classList.add('visible');
                    if (cardRef.current) cardRef.current.classList.add('visible');
                    
                    const formSections = document.querySelectorAll('.form-section');
                    formSections.forEach(section => {
                        section.classList.add('visible');
                    });
                    
                    const inputGroups = document.querySelectorAll('.input-group');
                    inputGroups.forEach(group => {
                        group.classList.add('visible');
                    });
                    
                    if (btnRef.current) btnRef.current.classList.add('visible');
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (isSubmitted) {
            setTimeout(() => {
                const successMsg = document.querySelector('.success-message');
                if (successMsg) successMsg.classList.add('visible');
            }, 100);
        }
    }, [isSubmitted]);

    const timeSlots = ['11:00 AM', '12:00 PM', '01:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'];
    const guestOptions = ['1 Person', '2 People', '3 People', '4 People', '5-8 People', '8+ People'];

    return (
        <section id="reservation" className="reservation-section" ref={sectionRef}>
            {/* Animated Background */}
            <div className="reservation-bg-1"></div>
            <div className="reservation-bg-2"></div>
            
            {/* Animated Blobs */}
            <div className="reservation-blob-1"></div>
            <div className="reservation-blob-2"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <div className="reservation-header" ref={headerRef}>
                        <div className="reservation-badge">
                            <span className="reservation-badge-text">
                                <i className="fas fa-calendar-check text-yellow-500 text-xs"></i>
                                Secure Your Table
                                <i className="fas fa-calendar-check text-yellow-500 text-xs"></i>
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 gradient-gold">Make a Reservation</h2>
                        <p className="text-gray-300 text-lg">Experience luxury dining - book your table now</p>
                    </div>
                    
                    {/* Reservation Card */}
                    <div className="reservation-card" ref={cardRef}>
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-xl text-sm">
                                        <i className="fas fa-exclamation-circle mr-2"></i>
                                        {error}
                                    </div>
                                )}
                                
                                {/* Personal Information Section */}
                                <div className="form-section">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="input-group">
                                            <label className="form-label">
                                                <i className="fas fa-user-circle mr-2"></i>
                                                Full Name *
                                            </label>
                                            <input 
                                                type="text" 
                                                name="name" 
                                                required 
                                                onChange={handleChange} 
                                                className="form-input" 
                                                placeholder="John Doe" 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="form-label">
                                                <i className="fas fa-phone-alt mr-2"></i>
                                                Phone Number *
                                            </label>
                                            <input 
                                                type="tel" 
                                                name="phone" 
                                                required 
                                                onChange={handleChange} 
                                                className="form-input" 
                                                placeholder="+1 (555) 000-0000" 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="form-label">
                                                <i className="fas fa-envelope mr-2"></i>
                                                Email (Optional)
                                            </label>
                                            <input 
                                                type="email" 
                                                name="email" 
                                                onChange={handleChange} 
                                                className="form-input" 
                                                placeholder="john@example.com" 
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Reservation Details Section */}
                                <div className="form-section">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="input-group">
                                            <label className="form-label">
                                                <i className="fas fa-calendar-day mr-2"></i>
                                                Date *
                                            </label>
                                            <input 
                                                type="date" 
                                                name="date" 
                                                required 
                                                onChange={handleChange} 
                                                className="form-input" 
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="form-label">
                                                <i className="fas fa-clock mr-2"></i>
                                                Time *
                                            </label>
                                            <select 
                                                name="time" 
                                                required 
                                                onChange={handleChange} 
                                                className="form-input"
                                            >
                                                <option value="">Select Time</option>
                                                {timeSlots.map(slot => (
                                                    <option key={slot} value={slot}>{slot}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-group">
                                            <label className="form-label">
                                                <i className="fas fa-users mr-2"></i>
                                                Guests *
                                            </label>
                                            <select 
                                                name="guests" 
                                                required 
                                                onChange={handleChange} 
                                                className="form-input"
                                            >
                                                <option value="">Number of Guests</option>
                                                {guestOptions.map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Special Requests Section */}
                                <div className="form-section">
                                    <div className="input-group">
                                        <label className="form-label">
                                            <i className="fas fa-comment-dots mr-2"></i>
                                            Special Requests
                                        </label>
                                        <textarea 
                                            name="special_requests" 
                                            rows="3" 
                                            onChange={handleChange} 
                                            className="form-input" 
                                            placeholder="Dietary restrictions, special occasions, seating preferences..."
                                        ></textarea>
                                    </div>
                                </div>
                                
                                {/* VIP Checkbox */}
                                <div className="form-section">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                                        <input 
                                            type="checkbox" 
                                            name="vip" 
                                            id="vip" 
                                            onChange={handleChange} 
                                            className="w-5 h-5 accent-yellow-500 rounded cursor-pointer" 
                                        />
                                        <label htmlFor="vip" className="text-sm cursor-pointer">
                                            ✨ VIP Experience (Private Booth + Complimentary Welcome Drink)
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="reservation-btn"
                                    ref={btnRef}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Reservation 
                                            <i className="fas fa-arrow-right"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="success-message">
                                <div className="success-icon">
                                    <i className="fas fa-check text-4xl text-white"></i>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 gradient-gold">
                                    Reservation Confirmed! 🎉
                                </h3>
                                <p className="text-gray-300 text-lg mb-4">
                                    Thank you for choosing Gourmet Bistro.
                                </p>
                                <p className="text-gray-400 text-sm">
                                    We've sent confirmation details to your phone. See you soon!
                                </p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="mt-6 px-6 py-2 rounded-full bg-white/10 hover:bg-yellow-500/20 text-white transition-all duration-300 border border-yellow-500/30"
                                >
                                    <i className="fas fa-redo-alt mr-2"></i>
                                    Make Another Reservation
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reservation;