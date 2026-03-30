import React, { useEffect, useRef } from 'react';
import './Gallery.css';

const Gallery = () => {
    const sectionRef = useRef(null);
    const headerRef = useRef(null);

    const galleryItems = [
        {
            id: 1,
            img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            title: 'Main Dining Hall',
            span: 'row-span-2 col-span-2',
            textSize: 'large'
        },
        {
            id: 2,
            img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
            title: 'Signature Burger',
            span: '',
            textSize: 'normal'
        },
        {
            id: 3,
            img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
            title: 'Craft Cocktails',
            span: '',
            textSize: 'normal'
        },
        {
            id: 4,
            img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
            title: 'Open Kitchen Experience',
            span: 'col-span-2',
            textSize: 'large'
        },
        {
            id: 5,
            img: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400',
            title: 'Gourmet Creations',
            span: '',
            textSize: 'normal'
        },
        {
            id: 6,
            img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=400',
            title: 'VIP Lounge',
            span: '',
            textSize: 'normal'
        }
    ];

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
                    const galleryItems = document.querySelectorAll('.gallery-item');
                    galleryItems.forEach((item, index) => {
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
    }, []);

    const getSpanClass = (span) => {
        if (span === 'row-span-2 col-span-2') return 'gallery-item-row-span-2';
        if (span === 'col-span-2') return 'gallery-item-col-span-2';
        return '';
    };

    const getTextClass = (size) => {
        return size === 'large' ? 'gallery-overlay-text-large' : '';
    };

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
                            className={`gallery-item ${getSpanClass(item.span)}`}
                        >
                            <img 
                                src={item.img} 
                                alt={item.title} 
                                className="gallery-img" 
                            />
                            <div className="gallery-overlay">
                                <span className={`gallery-overlay-text ${getTextClass(item.textSize)}`}>
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