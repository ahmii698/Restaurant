import React, { useEffect, useRef, useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const testimonials = [
        {
            id: 1,
            stars: 5,
            quote: "The best dining experience I've ever had! The Wagyu truffle burger is absolutely divine. Service is impeccable.",
            name: "Michael K.",
            title: "Food Critic",
            initials: "MK"
        },
        {
            id: 2,
            stars: 5,
            quote: "Outstanding ambiance and even better food. The craft beer selection is exceptional. Will definitely return!",
            name: "Sarah R.",
            title: "Regular Customer",
            initials: "SR"
        },
        {
            id: 3,
            stars: 5,
            quote: "Perfect for business dinners and special occasions. Professional service, elegant atmosphere, and consistently excellent.",
            name: "David C.",
            title: "Business Executive",
            initials: "DC"
        },
        {
            id: 4,
            stars: 5,
            quote: "The ambiance is incredible! Perfect for date nights. The staff is super friendly and the food is to die for.",
            name: "Emily W.",
            title: "Food Blogger",
            initials: "EW"
        },
        {
            id: 5,
            stars: 5,
            quote: "Best steak I've ever had! The truffle fries are a must-try. Will definitely be coming back.",
            name: "James L.",
            title: "Regular Customer",
            initials: "JL"
        }
    ];

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto slide for mobile - 5 seconds
    useEffect(() => {
        if (!isMobile) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
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
    }, [isMobile]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const renderStars = (count) => {
        return [...Array(count)].map((_, i) => (
            <i key={i} className="fas fa-star"></i>
        ));
    };

    return (
        <section id="testimonials" className="testimonials-section" ref={sectionRef}>
            {/* Animated Background Elements */}
            <div className="testimonials-bg-1"></div>
            <div className="testimonials-bg-2"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
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
                
                {/* Desktop View - 3 Cards Grid */}
                <div className="testimonials-grid desktop-view">
                    {testimonials.slice(0, 3).map((testimonial) => (
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
                
                {/* Mobile View - 1 Card Slider */}
                <div className="mobile-view">
                    <div className="testimonials-slider">
                        <button className="slider-nav prev" onClick={prevSlide}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        
                        <div className="slider-container">
                            {testimonials.map((testimonial, idx) => (
                                <div 
                                    key={testimonial.id} 
                                    className={`mobile-card ${idx === currentIndex ? 'active' : ''}`}
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
                        
                        <button className="slider-nav next" onClick={nextSlide}>
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    {/* Dots Indicator */}
                    <div className="slider-dots">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                onClick={() => goToSlide(idx)}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;