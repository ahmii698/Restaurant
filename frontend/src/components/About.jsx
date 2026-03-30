import React, { useEffect, useRef } from 'react';
import './About.css';

const About = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Refs for animation
    const imageRef = useRef(null);
    const contentRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        // Intersection Observer for fade-up animation
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements
        if (imageRef.current) observer.observe(imageRef.current);
        if (contentRef.current) observer.observe(contentRef.current);
        
        // Observe feature items
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" className="about-section">
            {/* Animated Background Gradient */}
            <div className="about-bg-gradient"></div>
            
            {/* Animated Blobs */}
            <div className="about-blob-1"></div>
            <div className="about-blob-2"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Image Section with Multiple Animations */}
                    <div 
                        ref={imageRef}
                        className="relative fade-up transition-all duration-1000 ease-out"
                        style={{ transitionDelay: '0.2s' }}
                    >
                        {/* Animated Glow Effect */}
                        <div className="about-image-glow"></div>
                        
                        {/* Main Image Container */}
                        <div className="about-image-container group">
                            <img 
                                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800" 
                                alt="Restaurant Interior" 
                                className="about-image" 
                            />
                            
                            {/* Animated Overlay */}
                            <div className="about-image-overlay"></div>
                            
                            {/* Animated Badge */}
                            <div className="about-image-badge">
                                <div className="flex items-center gap-3">
                                    <div className="badge-line"></div>
                                    <div>
                                        <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider animate-fade-in">Est. 2010</p>
                                        <h3 className="text-2xl font-bold mt-1 text-white animate-slide-up">Where Flavor Meets Passion</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Floating Decorative Element */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-float"></div>
                    </div>
                    
                    {/* Content Section */}
                    <div 
                        ref={contentRef}
                        className="fade-up transition-all duration-1000 ease-out"
                        style={{ transitionDelay: '0.4s' }}
                    >
                        {/* Animated Badge */}
                        <div className="story-badge">
                            <span className="story-badge-content">
                                <span className="ping-dot"></span>
                                Our Story
                            </span>
                        </div>
                        
                        {/* Animated Title */}
                        <h2 className="text-5xl font-bold mb-6 gradient-gold animate-slide-up">
                            A Legacy of <br />Culinary Excellence
                        </h2>
                        
                        {/* Animated Text */}
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            The Gourmet Bistro was born from a vision to create extraordinary dining experiences. Every ingredient is carefully sourced from around the world, every dish crafted with artistic precision.
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            From Australian Wagyu to Italian truffles, our commitment to quality is uncompromising. Join us for a journey that celebrates flavor, passion, and perfection.
                        </p>
                        
                        {/* Features Grid with Staggered Animation */}
                        <div 
                            ref={featuresRef}
                            className="grid grid-cols-2 gap-5 mb-10"
                        >
                            <div className="feature-item feature-card">
                                <i className="fas fa-check-circle feature-icon"></i>
                                <span className="feature-text">Premium Wagyu Beef</span>
                            </div>
                            <div className="feature-item feature-card">
                                <i className="fas fa-check-circle feature-icon"></i>
                                <span className="feature-text">Fresh Daily Produce</span>
                            </div>
                            <div className="feature-item feature-card">
                                <i className="fas fa-check-circle feature-icon"></i>
                                <span className="feature-text">Artisanal Buns</span>
                            </div>
                            <div className="feature-item feature-card">
                                <i className="fas fa-check-circle feature-icon"></i>
                                <span className="feature-text">House-made Sauces</span>
                            </div>
                        </div>
                        
                        {/* Animated Button */}
                        <button 
                            onClick={() => scrollToSection('gallery')} 
                            className="animated-button"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Discover Our Space 
                                <i className="fas fa-arrow-right button-icon"></i>
                            </span>
                            <span className="animated-button-underline"></span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;