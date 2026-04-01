import React, { useState, useEffect, useRef } from 'react';
import { menuAPI } from '../services/api';
import './Menu.css';

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('burgers');
    const [allMenuItems, setAllMenuItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);
    const [isExpanded, setIsExpanded] = useState(false);
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const tabsRef = useRef(null);

    const categories = [
        { id: 'burgers', name: 'Burgers', icon: 'fa-hamburger' },
        { id: 'sides', name: 'Sides', icon: 'fa-fries' },
        { id: 'drinks', name: 'Drinks', icon: 'fa-wine-glass-alt' },
        { id: 'desserts', name: 'Desserts', icon: 'fa-cake-candles' },
        { id: 'hookah', name: 'Hookah Lounge', icon: 'fa-smoking' }
    ];

    // Fetch menu data from API
    useEffect(() => {
        fetchMenuData();
    }, [activeCategory]);

    const fetchMenuData = async () => {
        setLoading(true);
        setError('');
        setVisibleCount(3);
        setIsExpanded(false);
        try {
            const response = await menuAPI.getByCategory(activeCategory);
            setAllMenuItems(response.data);
            setDisplayedItems(response.data.slice(0, 3));
        } catch (err) {
            console.error('Error fetching menu:', err);
            setError('Failed to load menu. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        setVisibleCount(allMenuItems.length);
        setDisplayedItems(allMenuItems);
        setIsExpanded(true);
    };

    const showLess = () => {
        setVisibleCount(3);
        setDisplayedItems(allMenuItems.slice(0, 3));
        setIsExpanded(false);
    };

    // Intersection Observer for section visibility
    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (headerRef.current) headerRef.current.classList.add('visible');
                    if (tabsRef.current) tabsRef.current.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Animate cards when visible
    useEffect(() => {
        if (isVisible && !loading) {
            setTimeout(() => {
                const gridItems = document.querySelectorAll('.menu-card');
                gridItems.forEach((item, index) => {
                    item.classList.add('visible');
                    item.style.transitionDelay = `${index * 0.1}s`;
                });
            }, 100);
        }
    }, [isVisible, loading, displayedItems]);

    return (
        <section id="menu" className="menu-section" ref={sectionRef}>
            <div className="menu-bg-1"></div>
            <div className="menu-bg-2"></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="menu-header" ref={headerRef}>
                    <div className="menu-badge">
                        <span className="menu-badge-text">
                            <i className="fas fa-star text-yellow-500 text-xs"></i>
                            Curated Selection
                            <i className="fas fa-star text-yellow-500 text-xs"></i>
                        </span>
                    </div>
                    <h2 className="text-5xl font-bold mb-4 gradient-gold">Our Signature Menu</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Experience culinary artistry with our handcrafted dishes
                    </p>
                    
                    <div className="menu-tabs" ref={tabsRef}>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`menu-tab ${
                                    activeCategory === cat.id 
                                        ? 'menu-tab-active' 
                                        : 'menu-tab-inactive'
                                }`}
                            >
                                <i className={`fas ${cat.icon}`}></i>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
                
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-400 mt-4">Loading our delicious menu...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                        <p className="text-red-400">{error}</p>
                        <button 
                            onClick={fetchMenuData}
                            className="mt-4 px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : displayedItems.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No items in this category yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="menu-grid">
                            {displayedItems.map((item, index) => (
                                <div key={item.id || index} className="menu-card">
                                    <div className="menu-card-image">
                                        {item.badge && (
                                            <div className="menu-card-badge">
                                                {item.badge}
                                            </div>
                                        )}
                                        <img 
                                            src={item.image_url || item.img} 
                                            alt={item.name} 
                                            className="menu-card-img" 
                                        />
                                        <div className="menu-card-price">
                                            ${item.price}
                                        </div>
                                    </div>
                                    <div className="menu-card-content">
                                        <h3 className="menu-card-title">{item.name}</h3>
                                        <p className="menu-card-desc">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Load More / Show Less Buttons */}
                        <div className="text-center mt-10 flex gap-4 justify-center">
                            {!isExpanded && allMenuItems.length > 3 && (
                                <button 
                                    onClick={loadMore}
                                    className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <i className="fas fa-plus-circle mr-2"></i>
                                    Load More ({allMenuItems.length - 3} more)
                                </button>
                            )}
                            
                            {isExpanded && (
                                <button 
                                    onClick={showLess}
                                    className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-lg hover:shadow-lg transition-all hover:scale-105"
                                >
                                    <i className="fas fa-minus-circle mr-2"></i>
                                    Show Less (Show only 3)
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Menu;