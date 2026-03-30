import React, { useState, useEffect } from 'react';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className={`glass-nav fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                            <i className="fas fa-utensils text-black text-xl"></i>
                        </div>
                        <span className="text-2xl font-bold gradient-gold">Gourmet Bistro</span>
                    </div>
                    
                    <div className="hidden md:flex space-x-10 items-center">
                        <button onClick={() => scrollToSection('home')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold">Home</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold">About</button>
                        <button onClick={() => scrollToSection('menu')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold">Menu</button>
                        <button onClick={() => scrollToSection('reservation')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold">Reservations</button>
                        <button onClick={() => scrollToSection('gallery')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold">Gallery</button>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold">Contact</button>
                    </div>
                    
                    <button onClick={() => window.toggleBooking && window.toggleBooking()} className="btn-primary text-black font-bold px-7 py-2.5 rounded-full text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg">
                        <i className="fas fa-calendar-alt"></i> Book Table
                    </button>
                    
                    <button className="md:hidden text-2xl" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            
            {isMobileMenuOpen && (
                <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-yellow-500/20">
                    <div className="flex flex-col p-6 space-y-4">
                        <button onClick={() => scrollToSection('home')} className="text-lg hover:text-yellow-500 py-2 text-left">Home</button>
                        <button onClick={() => scrollToSection('about')} className="text-lg hover:text-yellow-500 py-2 text-left">About</button>
                        <button onClick={() => scrollToSection('menu')} className="text-lg hover:text-yellow-500 py-2 text-left">Menu</button>
                        <button onClick={() => scrollToSection('reservation')} className="text-lg hover:text-yellow-500 py-2 text-left">Reservations</button>
                        <button onClick={() => scrollToSection('gallery')} className="text-lg hover:text-yellow-500 py-2 text-left">Gallery</button>
                        <button onClick={() => scrollToSection('contact')} className="text-lg hover:text-yellow-500 py-2 text-left">Contact</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;