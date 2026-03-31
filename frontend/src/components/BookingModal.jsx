import React, { useState } from 'react';
import { reservationAPI } from '../services/api';

const BookingModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guests: '',
        specialRequest: ''
    });

    const toggleModal = () => {
        setIsOpen(!isOpen);
        // Reset form and error when closing
        if (!isOpen) {
            setFormData({
                name: '',
                phone: '',
                email: '',
                date: '',
                time: '',
                guests: '',
                specialRequest: ''
            });
            setError('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Phone number validation - only numbers
        if (name === 'phone') {
            const onlyNumbers = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: onlyNumbers });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        if (error) setError('');
    };

    // Get today's date for min date attribute
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        // Validate phone number length
        if (formData.phone.length < 10) {
            setError('Please enter a valid phone number (at least 10 digits)');
            setIsLoading(false);
            return;
        }
        
        try {
            const reservationData = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || null,
                date: formData.date,
                time: formData.time,
                guests: formData.guests,
                special_requests: formData.specialRequest || null,
                
            };
            
            console.log('Sending quick reservation:', reservationData);
            
            const response = await reservationAPI.create(reservationData);
            
            console.log('Quick reservation response:', response.data);
            
            // Show success message
            const toast = document.getElementById('toast');
            const message = document.getElementById('toast-message');
            if (toast && message) {
                if (formData.specialRequest) {
                    message.textContent = `✨ Reservation confirmed! We'll arrange: ${formData.specialRequest.substring(0, 40)}...`;
                } else {
                    message.textContent = '🎉 Reservation confirmed! Check your phone for details.';
                }
                toast.classList.remove('translate-y-20', 'opacity-0');
                setTimeout(() => {
                    toast.classList.add('translate-y-20', 'opacity-0');
                }, 4000);
            }
            
            // Close modal after success
            setTimeout(() => {
                toggleModal();
            }, 1500);
            
        } catch (err) {
            console.error('Quick reservation error:', err);
            console.error('Error response:', err.response?.data);
            
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                setError(errorMessages);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (typeof window !== 'undefined') {
        window.toggleBooking = toggleModal;
    }

    if (!isOpen) return null;

    return (
        <div id="booking-modal" className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={toggleModal}></div>
            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="bg-gradient-to-br from-gray-900 to-black w-full max-w-lg rounded-3xl p-6 md:p-8 border border-yellow-500/30 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-2xl font-bold gradient-gold">Quick Reservation</h3>
                            <p className="text-gray-500 text-sm mt-1">Book your table in seconds</p>
                        </div>
                        <button onClick={toggleModal} className="text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 text-sm">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label className="block text-yellow-500 text-sm font-semibold mb-1">
                                <i className="fas fa-user mr-2"></i>
                                Your Name
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                required 
                                placeholder="Enter your full name" 
                                value={formData.name}
                                onChange={handleChange} 
                                className="form-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300" 
                            />
                        </div>
                        
                        {/* Phone Field */}
                        <div>
                            <label className="block text-yellow-500 text-sm font-semibold mb-1">
                                <i className="fas fa-phone mr-2"></i>
                                Phone Number
                            </label>
                            <input 
                                type="tel" 
                                name="phone" 
                                required 
                                placeholder="Enter your phone number" 
                                value={formData.phone}
                                onChange={handleChange} 
                                className="form-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300" 
                            />
                        </div>
                        
                        {/* Email Field (Optional) */}
                        <div>
                            <label className="block text-yellow-500 text-sm font-semibold mb-1">
                                <i className="fas fa-envelope mr-2"></i>
                                Email (Optional)
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Enter your email address" 
                                value={formData.email}
                                onChange={handleChange} 
                                className="form-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300" 
                            />
                        </div>
                        
                        {/* Date and Time Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-yellow-500 text-sm font-semibold mb-1">
                                    <i className="fas fa-calendar-alt mr-2"></i>
                                    Date
                                </label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    required 
                                    min={getTodayDate()}
                                    value={formData.date}
                                    onChange={handleChange} 
                                    className="form-input w-full px-4 py-3 rounded-xl text-white bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300" 
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-500 text-sm font-semibold mb-1">
                                    <i className="fas fa-clock mr-2"></i>
                                    Time
                                </label>
                                <select 
                                    name="time" 
                                    required 
                                    value={formData.time}
                                    onChange={handleChange} 
                                    className="form-input w-full px-4 py-3 rounded-xl text-white bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300 appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-gray-900">Select Time</option>
                                    <option value="11:00 AM" className="bg-gray-900">11:00 AM</option>
                                    <option value="12:00 PM" className="bg-gray-900">12:00 PM</option>
                                    <option value="01:00 PM" className="bg-gray-900">01:00 PM</option>
                                    <option value="06:00 PM" className="bg-gray-900">06:00 PM</option>
                                    <option value="07:00 PM" className="bg-gray-900">07:00 PM</option>
                                    <option value="08:00 PM" className="bg-gray-900">08:00 PM</option>
                                    <option value="09:00 PM" className="bg-gray-900">09:00 PM</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Guests Select */}
                        <div>
                            <label className="block text-yellow-500 text-sm font-semibold mb-1">
                                <i className="fas fa-users mr-2"></i>
                                Number of Guests
                            </label>
                            <select 
                                name="guests" 
                                required 
                                value={formData.guests}
                                onChange={handleChange} 
                                className="form-input w-full px-4 py-3 rounded-xl text-white bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300 appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-gray-900">Select number of guests</option>
                                <option value="1 Person" className="bg-gray-900">1 Person</option>
                                <option value="2 People" className="bg-gray-900">2 People</option>
                                <option value="3 People" className="bg-gray-900">3 People</option>
                                <option value="4 People" className="bg-gray-900">4 People</option>
                                <option value="5-6 People" className="bg-gray-900">5-6 People</option>
                                <option value="7-8 People" className="bg-gray-900">7-8 People</option>
                                <option value="8+ People" className="bg-gray-900">8+ People</option>
                            </select>
                        </div>
                        
                        {/* Special Request Field */}
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <i className="fas fa-gift text-yellow-500 text-sm"></i>
                                <span className="text-yellow-500 text-sm font-semibold">Special Request (Optional)</span>
                            </div>
                            <textarea 
                                name="specialRequest" 
                                rows="3" 
                                placeholder="Birthday surprise? Anniversary celebration? Any special arrangements? Let us know..."
                                value={formData.specialRequest}
                                onChange={handleChange} 
                                className="form-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 bg-white/5 border border-yellow-500/20 focus:border-yellow-500 transition-all duration-300 resize-none"
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <i className="fas fa-info-circle text-yellow-500/50"></i>
                                We'll do our best to make your experience special!
                            </p>
                        </div>
                        
                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="relative group w-full overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-3 text-base transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-calendar-check"></i>
                                        Book Now
                                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </form>
                    
                    {/* Quick Info */}
                    <div className="mt-4 pt-4 border-t border-yellow-500/20 text-center">
                        <p className="text-xs text-gray-500">
                            <i className="fas fa-shield-alt text-yellow-500/70 mr-1"></i>
                            Your reservation is confirmed instantly. We'll call you if needed.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;