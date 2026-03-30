import React from 'react';

const Contact = () => {
    return (
        <section id="contact" className="py-20 bg-black border-t border-yellow-900/30">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                                <i className="fas fa-utensils text-black text-xl"></i>
                            </div>
                            <span className="text-3xl font-bold gradient-gold">Gourmet Bistro</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md leading-relaxed">Where exceptional burgers meet unforgettable experiences. Join us for a culinary journey that celebrates flavor, quality, and passion.</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"><i className="fab fa-instagram"></i></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"><i className="fab fa-twitter"></i></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-yellow-500">Quick Links</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="#about" className="hover:text-yellow-500 transition-colors">About Us</a></li>
                            <li><a href="#menu" className="hover:text-yellow-500 transition-colors">Our Menu</a></li>
                            <li><a href="#reservation" className="hover:text-yellow-500 transition-colors">Reservations</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Private Events</a></li>
                            <li><a href="#" className="hover:text-yellow-500 transition-colors">Gift Cards</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-6 text-yellow-500">Contact</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start gap-3"><i className="fas fa-map-marker-alt mt-1 text-yellow-500"></i><span>456 Gourmet Avenue<br />New York, NY 10001</span></li>
                            <li className="flex items-center gap-3"><i className="fas fa-phone text-yellow-500"></i><span>+1 (555) 987-6543</span></li>
                            <li className="flex items-center gap-3"><i className="fas fa-envelope text-yellow-500"></i><span>hello@gourmetbistro.com</span></li>
                            <li className="flex items-center gap-3"><i className="fas fa-clock text-yellow-500"></i><span>Mon-Sun: 11AM - 11PM</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;