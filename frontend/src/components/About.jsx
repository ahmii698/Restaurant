import React, { useEffect, useRef, useState } from 'react';
import { aboutAPI } from '../services/api';
import './About.css';

const About = () => {
    const [aboutData, setAboutData] = useState(null);
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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

    // Fetch about data from database
    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        setLoading(true);
        try {
            const response = await aboutAPI.getContent();
            console.log('About data:', response.data);
            setAboutData(response.data.about);
            setFeatures(response.data.features);
        } catch (err) {
            console.error('Error fetching about data:', err);
            setError('Failed to load about section. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
    }, [features]);

    if (loading) {
        return (
            <section id="about" className="about-section">
                <div className="container mx-auto px-6 text-center py-20">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading about us...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="about" className="about-section">
                <div className="container mx-auto px-6 text-center py-20">
                    <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <p className="text-red-400">{error}</p>
                    <button 
                        onClick={fetchAboutData}
                        className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

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
                                src={aboutData?.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'} 
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
                                        <p className="text-yellow-400 font-bold text-sm uppercase tracking-wider animate-fade-in">
                                            Est. {aboutData?.established_year || '2010'}
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1 text-white animate-slide-up">
                                            {aboutData?.image_badge_text || 'Where Flavor Meets Passion'}
                                        </h3>
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
                                {aboutData?.badge || 'Our Story'}
                            </span>
                        </div>
                        
                        {/* Animated Title */}
                        <h2 className="text-5xl font-bold mb-6 gradient-gold animate-slide-up">
                            {aboutData?.heading || 'A Legacy of Culinary Excellence'}
                        </h2>
                        
                        {/* Animated Text */}
                        <p className="text-gray-300 mb-6 text-lg leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            {aboutData?.paragraph_1 || 'The Gourmet Bistro was born from a vision to create extraordinary dining experiences. Every ingredient is carefully sourced from around the world, every dish crafted with artistic precision.'}
                        </p>
                        <p className="text-gray-400 mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            {aboutData?.paragraph_2 || 'From Australian Wagyu to Italian truffles, our commitment to quality is uncompromising. Join us for a journey that celebrates flavor, passion, and perfection.'}
                        </p>
                        
                        {/* Features Grid with Staggered Animation */}
                        <div 
                            ref={featuresRef}
                            className="grid grid-cols-2 gap-5 mb-10"
                        >
                            {features.map((feature, index) => (
                                <div key={feature.id} className="feature-item feature-card">
                                    <i className={`fas ${feature.icon || 'fa-check-circle'} feature-icon`}></i>
                                    <span className="feature-text">{feature.title}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Animated Button */}
                        <button 
                            onClick={() => scrollToSection('gallery')} 
                            className="animated-button"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {aboutData?.button_text || 'Discover Our Space'}
                                <i className={`fas ${aboutData?.button_icon || 'fa-arrow-right'} button-icon`}></i>
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