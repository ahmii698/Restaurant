import React, { useEffect, useRef, useState } from 'react';
import { galleryAPI } from '../services/api';
import './Gallery.css';

const Gallery = () => {
    const [galleryItems, setGalleryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    // Fetch gallery data from database
    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const response = await galleryAPI.getAll();
            console.log('Gallery data:', response.data);
            setGalleryItems(response.data);
        } catch (err) {
            console.error('Error fetching gallery:', err);
            setError('Failed to load gallery. Please try again.');
        } finally {
            setLoading(false);
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
                    // Add visible class to header
                    if (headerRef.current) headerRef.current.classList.add('visible');
                    
                    // Add visible class to all gallery items
                    const items = document.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [galleryItems]);

    const getSpanClass = (spanType) => {
        if (spanType === 'row-span-2 col-span-2') return 'gallery-item-row-span-2';
        if (spanType === 'col-span-2') return 'gallery-item-col-span-2';
        return '';
    };

    const getTextClass = (textSize) => {
        return textSize === 'large' ? 'gallery-overlay-text-large' : '';
    };

    if (loading) {
        return (
            <section id="gallery" className="gallery-section">
                <div className="container mx-auto px-6 text-center py-20">
                    <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading gallery...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="gallery" className="gallery-section">
                <div className="container mx-auto px-6 text-center py-20">
                    <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                    <p className="text-red-400">{error}</p>
                    <button 
                        onClick={fetchGallery}
                        className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section id="gallery" className="gallery-section" ref={sectionRef}>
            {/* Animated Background Elements */}
            <div className="gallery-bg-1"></div>
            <div className="gallery-bg-2"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="gallery-header" ref={headerRef}>
                    <div className="gallery-badge">
                        <span className="gallery-badge-text">
                            <i className="fas fa-camera text-yellow-500 text-xs"></i>
                            Visual Journey
                            <i className="fas fa-camera text-yellow-500 text-xs"></i>
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-gold">Our Ambiance</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Experience the luxury atmosphere of Gourmet Bistro
                    </p>
                </div>
                
                {/* Gallery Grid */}
                <div className="gallery-grid">
                    {galleryItems.map((item) => (
                        <div 
                            key={item.id}
                            className={`gallery-item ${getSpanClass(item.span_type)}`}
                        >
                            <img 
                                src={item.image_url} 
                                alt={item.title} 
                                className="gallery-img" 
                            />
                            <div className="gallery-overlay">
                                <span className={`gallery-overlay-text ${getTextClass(item.text_size)}`}>
                                    {item.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;