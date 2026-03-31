import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

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

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 gradient-gold">Reservations</h1>
            
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Guests</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map((res) => (
                        <tr key={res.id}>
                            <td>{res.id}</td>
                            <td>
                                {editingId === res.id ? (
                                    <input 
                                        value={editData.name} 
                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                        className="bg-gray-800 px-2 py-1 rounded"
                                    />
                                ) : res.name}
                            </td>
                            <td>{res.phone}</td>
                            <td>{res.date}</td>
                            <td>{res.time}</td>
                            <td>{res.guests}</td>
                            <td>
                                {editingId === res.id ? (
                                    <select 
                                        value={editData.status} 
                                        onChange={(e) => setEditData({...editData, status: e.target.value})}
                                        className="bg-gray-800 px-2 py-1 rounded"
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
                            <td>
                                {editingId === res.id ? (
                                    <>
                                        <button onClick={() => handleUpdate(res.id)} className="btn-edit text-green-500">Save</button>
                                        <button onClick={() => setEditingId(null)} className="btn-delete ml-2">Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleEdit(res)} className="btn-edit">Edit</button>
                                        <button onClick={() => handleDelete(res.id)} className="btn-delete ml-2">Delete</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reservations;