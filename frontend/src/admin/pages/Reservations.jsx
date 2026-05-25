import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import axios from 'axios';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [emailData, setEmailData] = useState({
        subject: '',
        message: ''
    });
    const [sendingEmail, setSendingEmail] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await adminAPI.getReservations();
            setReservations(response.data);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                await adminAPI.deleteReservation(id);
                fetchReservations();
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
    };

    const handleEdit = (reservation) => {
        setEditingId(reservation.id);
        setEditData(reservation);
    };

    const handleUpdate = async (id) => {
        try {
            await adminAPI.updateReservation(id, editData);
            setEditingId(null);
            fetchReservations();
        } catch (error) {
            console.error('Error updating:', error);
        }
    };

    const openEmailModal = (reservation) => {
        setSelectedReservation(reservation);
        setEmailData({
            subject: `Your Reservation at Gourmet Bistro - ${reservation.date}`,
            message: `Dear ${reservation.name},\n\nYour reservation for ${reservation.date} at ${reservation.time} has been confirmed.\n\nGuests: ${reservation.guests}\n\nWe look forward to serving you!\n\nBest regards,\nGourmet Bistro Team`
        });
        setShowEmailModal(true);
    };

    const sendEmail = async () => {
        if (!selectedReservation) return;
        
        setSendingEmail(true);
        try {
            const response = await axios.post('http://localhost:8000/api/admin/send-email', {
                email: selectedReservation.email,
                name: selectedReservation.name,
                subject: emailData.subject,
                message: emailData.message
            });
            
            if (response.data.success) {
                alert('✓ Email sent successfully!');
                setShowEmailModal(false);
            } else {
                alert('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Error sending email. Make sure customer has provided email address.');
        } finally {
            setSendingEmail(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="px-4 sm:px-6">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 gradient-gold">Reservations</h1>
            
            {/* Email Modal - Responsive */}
            {showEmailModal && selectedReservation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-4 sm:p-6 max-w-lg w-full mx-4 sm:mx-0">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-yellow-600">
                                <i className="fas fa-envelope mr-2"></i>
                                <span className="hidden sm:inline">Send Email to </span>
                                {selectedReservation.name}
                            </h2>
                            <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
                        </div>
                        
                        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                            <p className="text-gray-400 text-xs sm:text-sm">To: <span className="text-white break-all">{selectedReservation.email || 'No email provided'}</span></p>
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">Reservation: {selectedReservation.date} at {selectedReservation.time}</p>
                            {!selectedReservation.email && (
                                <p className="text-red-400 text-xs sm:text-sm mt-2">⚠️ Customer did not provide email address</p>
                            )}
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="Subject" 
                            value={emailData.subject}
                            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-3 text-sm sm:text-base"
                            disabled={!selectedReservation.email}
                        />
                        
                        <textarea 
                            placeholder="Message" 
                            rows="6"
                            value={emailData.message}
                            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none mb-4 text-sm sm:text-base"
                            disabled={!selectedReservation.email}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button 
                                onClick={sendEmail} 
                                disabled={sendingEmail || !selectedReservation.email}
                                className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition disabled:opacity-50 text-sm sm:text-base"
                            >
                                {sendingEmail ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i> Sending...</>
                                ) : (
                                    <><i className="fas fa-paper-plane mr-2"></i> Send Email</>
                                )}
                            </button>
                            <button 
                                onClick={() => setShowEmailModal(false)} 
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Reservations Table - Responsive */}
            <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-x-auto">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-800 border-b border-yellow-700/30">
                            <tr>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">ID</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Name</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Phone</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Email</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Date</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Time</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Guests</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Status</th>
                                <th className="p-3 text-left text-yellow-600 text-xs sm:text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((res) => (
                                <tr key={res.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50">
                                    <td className="p-3 text-white text-sm">{res.id}</td>
                                    <td className="p-3 text-sm">
                                        {editingId === res.id ? (
                                            <input 
                                                value={editData.name} 
                                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                className="bg-gray-800 px-2 py-1 rounded text-white w-32 text-sm"
                                            />
                                        ) : res.name}
                                    </td>
                                    <td className="p-3 text-gray-400 text-sm">{res.phone}</td>
                                    <td className="p-3 text-sm">
                                        {res.email ? (
                                            <span className="text-green-400 text-xs sm:text-sm break-all">{res.email}</span>
                                        ) : (
                                            <span className="text-gray-500 text-xs sm:text-sm">No email</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-gray-400 text-sm">{res.date}</td>
                                    <td className="p-3 text-gray-400 text-sm">{res.time}</td>
                                    <td className="p-3 text-gray-400 text-sm">{res.guests}</td>
                                    <td className="p-3">
                                        {editingId === res.id ? (
                                            <select 
                                                value={editData.status} 
                                                onChange={(e) => setEditData({...editData, status: e.target.value})}
                                                className="bg-gray-800 px-2 py-1 rounded text-white text-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                res.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {res.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {editingId === res.id ? (
                                            <div className="flex gap-1">
                                                <button onClick={() => handleUpdate(res.id)} className="px-2 py-1 bg-green-700/50 text-green-400 rounded hover:bg-green-700 text-xs sm:text-sm">
                                                    <i className="fas fa-save"></i> Save
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-700 text-gray-400 rounded hover:bg-gray-600 text-xs sm:text-sm">
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                <button onClick={() => handleEdit(res)} className="px-2 py-1 bg-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700" title="Edit">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                {res.email && (
                                                    <button onClick={() => openEmailModal(res)} className="px-2 py-1 bg-blue-700/50 text-blue-400 rounded hover:bg-blue-700" title="Send Email">
                                                        <i className="fas fa-envelope"></i>
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(res.id)} className="px-2 py-1 bg-red-700/50 text-red-400 rounded hover:bg-red-700" title="Delete">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                    {reservations.map((res) => (
                        <div key={res.id} className="bg-gray-800 rounded-lg p-4 border border-yellow-700/30">
                            {editingId === res.id ? (
                                // Edit mode for mobile
                                <div className="space-y-3">
                                    <input 
                                        value={editData.name} 
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        placeholder="Name"
                                        className="w-full bg-gray-700 px-3 py-2 rounded text-white text-sm"
                                    />
                                    <select 
                                        value={editData.status} 
                                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                                        className="w-full bg-gray-700 px-3 py-2 rounded text-white text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleUpdate(res.id)} className="flex-1 px-3 py-2 bg-green-700/50 text-green-400 rounded text-sm">
                                            <i className="fas fa-save"></i> Save
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 px-3 py-2 bg-gray-700 text-gray-400 rounded text-sm">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View mode for mobile
                                <>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-gray-500 text-xs">ID: {res.id}</span>
                                            <h3 className="text-white font-bold text-base mt-1">{res.name}</h3>
                                            <p className="text-gray-400 text-xs">{res.phone}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                            res.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {res.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-xs">📅 Date:</span>
                                            <span className="text-white text-sm">{res.date}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-xs">⏰ Time:</span>
                                            <span className="text-white text-sm">{res.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-xs">👥 Guests:</span>
                                            <span className="text-white text-sm">{res.guests}</span>
                                        </div>
                                        {res.email && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500 text-xs">📧 Email:</span>
                                                <span className="text-green-400 text-xs break-all text-right max-w-[60%]">{res.email}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                                        <button onClick={() => handleEdit(res)} className="flex-1 px-3 py-2 bg-yellow-700/50 text-yellow-500 rounded text-sm">
                                            <i className="fas fa-edit mr-1"></i> Edit
                                        </button>
                                        {res.email && (
                                            <button onClick={() => openEmailModal(res)} className="flex-1 px-3 py-2 bg-blue-700/50 text-blue-400 rounded text-sm">
                                                <i className="fas fa-envelope mr-1"></i> Email
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(res.id)} className="flex-1 px-3 py-2 bg-red-700/50 text-red-400 rounded text-sm">
                                            <i className="fas fa-trash mr-1"></i> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {reservations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-calendar-check text-4xl mb-3 block"></i>
                    <p className="text-sm sm:text-base">No reservations found.</p>
                </div>
            )}
        </div>
    );
};

export default Reservations;