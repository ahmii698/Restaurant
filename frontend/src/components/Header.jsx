import React, { useState } from 'react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav className="fixed w-full z-50 shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.95) 50%, rgba(0,0,0,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(234, 179, 8, 0.2)'
        }}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img 
                            src="/images/logo/brand_logo-removebg-preview.png"  
                            alt="Brand Logo" 
                            className="w-24 h-24 object-contain rounded-full"
                        />
                    </div>
                    
                    <div className="hidden md:flex space-x-10 items-center">
                        <button onClick={() => scrollToSection('home')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold text-white">Home</button>
                        <button onClick={() => scrollToSection('about')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold text-white">About</button>
                        <button onClick={() => scrollToSection('menu')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold text-white">Menu</button>
                        <button onClick={() => scrollToSection('reservation')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold text-white">Reservations</button>
                        <button onClick={() => scrollToSection('gallery')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold text-white">Gallery</button>
                        <button onClick={() => scrollToSection('contact')} className="hover:text-yellow-500 transition-colors duration-300 text-sm uppercase tracking-wide font-semibold text-white">Contact</button>
                    </div>
                    
                    <button onClick={() => window.toggleBooking && window.toggleBooking()} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black hover:text-white font-bold px-7 py-2.5 rounded-full text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg transition-all duration-300">
                        <i className="fas fa-calendar-alt"></i> Book Table
                    </button>
                    
                    <button className="md:hidden text-2xl text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </div>
            
            {isMobileMenuOpen && (
                <div className="md:hidden" style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(20,20,20,0.98) 100%)',
                    backdropFilter: 'blur(10px)',
                    borderTop: '1px solid rgba(234, 179, 8, 0.2)'
                }}>
                    <div className="flex flex-col p-6 space-y-4">
                        <button onClick={() => scrollToSection('home')} className="text-lg hover:text-yellow-500 py-2 text-left text-white">Home</button>
                        <button onClick={() => scrollToSection('about')} className="text-lg hover:text-yellow-500 py-2 text-left text-white">About</button>
                        <button onClick={() => scrollToSection('menu')} className="text-lg hover:text-yellow-500 py-2 text-left text-white">Menu</button>
                        <button onClick={() => scrollToSection('reservation')} className="text-lg hover:text-yellow-500 py-2 text-left text-white">Reservations</button>
                        <button onClick={() => scrollToSection('gallery')} className="text-lg hover:text-yellow-500 py-2 text-left text-white">Gallery</button>
                        <button onClick={() => scrollToSection('contact')} className="text-lg hover:text-yellow-500 py-2 text-left text-white">Contact</button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;