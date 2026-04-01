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
        <div>
            <h1 className="text-2xl font-bold mb-6 gradient-gold">Reservations</h1>
            
            {/* Email Modal */}
            {showEmailModal && selectedReservation && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-yellow-600">
                                <i className="fas fa-envelope mr-2"></i>
                                Send Email to {selectedReservation.name}
                            </h2>
                            <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
                        </div>
                        
                        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                            <p className="text-gray-400 text-sm">To: <span className="text-white">{selectedReservation.email || 'No email provided'}</span></p>
                            <p className="text-gray-400 text-sm mt-1">Reservation: {selectedReservation.date} at {selectedReservation.time}</p>
                            {!selectedReservation.email && (
                                <p className="text-red-400 text-sm mt-2">⚠️ Customer did not provide email address</p>
                            )}
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="Subject" 
                            value={emailData.subject}
                            onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white mb-3"
                            disabled={!selectedReservation.email}
                        />
                        
                        <textarea 
                            placeholder="Message" 
                            rows="6"
                            value={emailData.message}
                            onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white resize-none mb-4"
                            disabled={!selectedReservation.email}
                        />
                        
                        <div className="flex gap-3">
                            <button 
                                onClick={sendEmail} 
                                disabled={sendingEmail || !selectedReservation.email}
                                className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition disabled:opacity-50"
                            >
                                {sendingEmail ? (
                                    <><i className="fas fa-spinner fa-spin mr-2"></i> Sending...</>
                                ) : (
                                    <><i className="fas fa-paper-plane mr-2"></i> Send Email</>
                                )}
                            </button>
                            <button 
                                onClick={() => setShowEmailModal(false)} 
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Reservations Table */}
            <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-800 border-b border-yellow-700/30">
                        
                            <th className="p-3 text-left text-yellow-600">ID</th>
                            <th className="p-3 text-left text-yellow-600">Name</th>
                            <th className="p-3 text-left text-yellow-600">Phone</th>
                            <th className="p-3 text-left text-yellow-600">Email</th>
                            <th className="p-3 text-left text-yellow-600">Date</th>
                            <th className="p-3 text-left text-yellow-600">Time</th>
                            <th className="p-3 text-left text-yellow-600">Guests</th>
                            <th className="p-3 text-left text-yellow-600">Status</th>
                            <th className="p-3 text-left text-yellow-600">Actions</th>
                        </thead>
                    <tbody>
                        {reservations.map((res) => (
                            <tr key={res.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50">
                                <td className="p-3 text-white">{res.id} </td>
                                <td className="p-3">
                                    {editingId === res.id ? (
                                        <input 
                                            value={editData.name} 
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="bg-gray-800 px-2 py-1 rounded text-white w-32"
                                        />
                                    ) : res.name}
                                 </td>
                                <td className="p-3 text-gray-400">{res.phone} </td>
                                <td className="p-3">
                                    {res.email ? (
                                        <span className="text-green-400 text-sm">{res.email}</span>
                                    ) : (
                                        <span className="text-gray-500 text-sm">No email</span>
                                    )}
                                 </td>
                                <td className="p-3 text-gray-400">{res.date} </td>
                                <td className="p-3 text-gray-400">{res.time} </td>
                                <td className="p-3 text-gray-400">{res.guests} </td>
                                <td className="p-3">
                                    {editingId === res.id ? (
                                        <select 
                                            value={editData.status} 
                                            onChange={(e) => setEditData({...editData, status: e.target.value})}
                                            className="bg-gray-800 px-2 py-1 rounded text-white"
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
                                        <>
                                            <button onClick={() => handleUpdate(res.id)} className="px-2 py-1 bg-green-700/50 text-green-400 rounded hover:bg-green-700 mr-1">
                                                <i className="fas fa-save"></i> Save
                                            </button>
                                            <button onClick={() => setEditingId(null)} className="px-2 py-1 bg-gray-700 text-gray-400 rounded hover:bg-gray-600">
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex gap-1">
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
            
            {reservations.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-calendar-check text-4xl mb-3 block"></i>
                    <p>No reservations found.</p>
                </div>
            )}
        </div>
    );
};

export default Reservations;