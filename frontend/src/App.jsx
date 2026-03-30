import React, { useEffect } from 'react';
import './App.css';

// Import Components - Tera diya hua order
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';

function App() {
    useEffect(() => {
        // Particle Effect
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        
        const particles = [];
        for (let i = 0; i < 80; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4
            });
        }
        
        let animationId;
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;
                if (p.x > canvas.width) p.x = 0;
                if (p.x < 0) p.x = canvas.width;
                if (p.y > canvas.height) p.y = 0;
                if (p.y < 0) p.y = canvas.height;
                ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            animationId = requestAnimationFrame(animateParticles);
        };
        animateParticles();
        
        window.addEventListener('resize', resizeCanvas);
        
        // Fade up animation on scroll
        const fadeElements = document.querySelectorAll('.fade-up');
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.2 });
        fadeElements.forEach(el => fadeObserver.observe(el));
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
            fadeObserver.disconnect();
        };
    }, []);
    
    return (
        <div className="App">
            <canvas id="particles-canvas" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}></canvas>
            <Header />
            <Hero />
            <About />
            <Menu />
            <Gallery />
            <Reservation />
            <Testimonials />
            <Contact />
            <Footer />
            <BookingModal />
            
            <div id="toast" className="fixed bottom-4 right-4 bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                <span id="toast-message">Added to order!</span>
            </div>
        </div>
    );
}

export default App;