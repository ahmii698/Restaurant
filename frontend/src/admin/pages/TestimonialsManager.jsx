import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import axios from 'axios';

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [pendingTestimonials, setPendingTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showPending, setShowPending] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', title: '', initials: '', stars: 5, quote: '', order: 0, status: 'approved'
    });

    useEffect(() => {
        fetchTestimonials();
        fetchPendingTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await adminAPI.getTestimonials();
            setTestimonials(response.data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingTestimonials = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/admin/testimonials/pending');
            setPendingTestimonials(response.data);
        } catch (error) {
            console.error('Error fetching pending testimonials:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await adminAPI.updateTestimonial(editingId, formData);
            } else {
                await adminAPI.createTestimonial(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ name: '', title: '', initials: '', stars: 5, quote: '', order: 0, status: 'approved' });
            fetchTestimonials();
            alert('Testimonial saved successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving testimonial');
        }
    };

    const handleApprove = async (id) => {
        if (window.confirm('Approve this testimonial?')) {
            try {
                await axios.put(`http://localhost:8000/api/admin/testimonials/${id}/approve`);
                fetchPendingTestimonials();
                fetchTestimonials();
                alert('Testimonial approved!');
            } catch (error) {
                console.error('Error approving:', error);
                alert('Error approving testimonial');
            }
        }
    };

    const handleReject = async (id) => {
        if (window.confirm('Reject this testimonial?')) {
            try {
                await axios.put(`http://localhost:8000/api/admin/testimonials/${id}/reject`);
                fetchPendingTestimonials();
                alert('Testimonial rejected!');
            } catch (error) {
                console.error('Error rejecting:', error);
                alert('Error rejecting testimonial');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            await adminAPI.deleteTestimonial(id);
            fetchTestimonials();
            alert('Testimonial deleted successfully!');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading testimonials...</span>
        </div>
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header Section - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-yellow-600">
                    <i className="fas fa-star mr-2"></i>
                    Testimonials
                </h1>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {pendingTestimonials.length > 0 && (
                        <button 
                            onClick={() => setShowPending(!showPending)} 
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition relative text-sm sm:text-base"
                        >
                            <i className="fas fa-bell mr-2"></i>
                            <span className="hidden sm:inline">Pending</span>
                            <span className="sm:hidden">Pending</span>
                            ({pendingTestimonials.length})
                        </button>
                    )}
                    {!showForm && (
                        <button 
                            onClick={() => setShowForm(true)} 
                            className="flex-1 sm:flex-none px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition text-sm sm:text-base"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            <span className="hidden sm:inline">Add New</span>
                            <span className="sm:hidden">Add</span>
                        </button>
                    )}
                </div>
            </div>
            
            {/* Pending Testimonials Section - Responsive */}
            {showPending && pendingTestimonials.length > 0 && (
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-yellow-600">
                            <i className="fas fa-clock mr-2"></i>
                            <span className="hidden sm:inline">Pending Approval</span>
                            <span className="sm:hidden">Pending</span>
                            ({pendingTestimonials.length})
                        </h2>
                        <button onClick={() => setShowPending(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
                    </div>
                    <div className="space-y-4">
                        {pendingTestimonials.map(t => (
                            <div key={t.id} className="bg-gray-800 rounded-lg p-4 border border-yellow-700/30">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-yellow-700 flex items-center justify-center text-black font-bold flex-shrink-0">
                                                {t.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-white text-sm sm:text-base truncate">{t.name}</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm truncate">{t.title}</p>
                                            </div>
                                            <div className="text-yellow-500 text-sm sm:text-base">{'★'.repeat(t.stars)}</div>
                                        </div>
                                        <p className="text-gray-300 italic text-sm sm:text-base">"{t.quote.substring(0, 100)}{t.quote.length > 100 ? '...' : ''}"</p>
                                        <p className="text-gray-500 text-xs mt-2">Submitted: {new Date(t.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button 
                                            onClick={() => handleApprove(t.id)} 
                                            className="flex-1 sm:flex-none px-3 py-2 bg-green-700/50 text-green-400 rounded hover:bg-green-700 transition text-sm"
                                        >
                                            <i className="fas fa-check mr-1"></i> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleReject(t.id)} 
                                            className="flex-1 sm:flex-none px-3 py-2 bg-red-700/50 text-red-400 rounded hover:bg-red-700 transition text-sm"
                                        >
                                            <i className="fas fa-times mr-1"></i> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Add/Edit Form - Responsive */}
            {showForm && (
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg sm:text-xl font-bold text-yellow-600">
                            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
                        </h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 text-xl">✕</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Name" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                            />
                            <input 
                                type="text" 
                                placeholder="Title (e.g., Food Critic)" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                required 
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Initials (e.g., MK)" 
                                value={formData.initials} 
                                onChange={(e) => setFormData({...formData, initials: e.target.value})} 
                                required 
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                            />
                            <select 
                                value={formData.stars} 
                                onChange={(e) => setFormData({...formData, stars: e.target.value})}
                                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                            >
                                <option value="5">★★★★★ (5 Stars)</option>
                                <option value="4">★★★★☆ (4 Stars)</option>
                                <option value="3">★★★☆☆ (3 Stars)</option>
                            </select>
                        </div>
                        <textarea 
                            placeholder="Quote" 
                            rows="4"
                            value={formData.quote} 
                            onChange={(e) => setFormData({...formData, quote: e.target.value})} 
                            required 
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base resize-none focus:outline-none focus:border-yellow-500"
                        />
                        <input 
                            type="number" 
                            placeholder="Order (1, 2, 3...)" 
                            value={formData.order} 
                            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} 
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-yellow-500"
                        />
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button type="submit" className="px-6 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 transition">
                                {editingId ? 'Update' : 'Add'} Testimonial
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* All Testimonials - Responsive Table / Card View */}
            <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-hidden">
                {/* Desktop Table View - Hidden on mobile */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-800 border-b border-yellow-700/30">
                            <tr>
                                <th className="p-3 text-left text-yellow-600 text-sm">ID</th>
                                <th className="p-3 text-left text-yellow-600 text-sm">Name</th>
                                <th className="p-3 text-left text-yellow-600 text-sm">Title</th>
                                <th className="p-3 text-left text-yellow-600 text-sm">Stars</th>
                                <th className="p-3 text-left text-yellow-600 text-sm">Order</th>
                                <th className="p-3 text-left text-yellow-600 text-sm">Status</th>
                                <th className="p-3 text-left text-yellow-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map(t => (
                                <tr key={t.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50">
                                    <td className="p-3 text-sm">{t.id}</td>
                                    <td className="p-3 font-medium text-sm">{t.name}</td>
                                    <td className="p-3 text-gray-400 text-sm">{t.title}</td>
                                    <td className="p-3 text-yellow-500 text-sm">{'★'.repeat(t.stars)}</td>
                                    <td className="p-3 text-gray-400 text-sm">{t.order}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            t.status === 'approved' ? 'bg-green-700/50 text-green-400' :
                                            t.status === 'pending' ? 'bg-yellow-700/50 text-yellow-400' :
                                            'bg-red-700/50 text-red-400'
                                        }`}>
                                            {t.status || 'approved'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button onClick={() => handleEdit(t)} className="px-2 py-1 bg-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700 text-xs sm:text-sm">
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-700/50 text-red-400 rounded hover:bg-red-700 text-xs sm:text-sm">
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View - Visible only on mobile */}
                <div className="md:hidden space-y-4 p-4">
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-gray-800 rounded-lg p-4 border border-yellow-700/30">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-gray-500 text-xs">ID: {t.id}</span>
                                    <h3 className="font-bold text-white text-base mt-1">{t.name}</h3>
                                    <p className="text-gray-400 text-xs">{t.title}</p>
                                </div>
                                <div className="text-yellow-500 text-sm">{'★'.repeat(t.stars)}</div>
                            </div>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-400 text-xs">Order: {t.order}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    t.status === 'approved' ? 'bg-green-700/50 text-green-400' :
                                    t.status === 'pending' ? 'bg-yellow-700/50 text-yellow-400' :
                                    'bg-red-700/50 text-red-400'
                                }`}>
                                    {t.status || 'approved'}
                                </span>
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-gray-700">
                                <button onClick={() => handleEdit(t)} className="flex-1 px-3 py-2 bg-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700 text-sm transition">
                                    <i className="fas fa-edit mr-1"></i> Edit
                                </button>
                                <button onClick={() => handleDelete(t.id)} className="flex-1 px-3 py-2 bg-red-700/50 text-red-400 rounded hover:bg-red-700 text-sm transition">
                                    <i className="fas fa-trash mr-1"></i> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {testimonials.length === 0 && (
                    <div className="text-center py-12 px-4 text-gray-500">
                        <i className="fas fa-comment-slash text-4xl mb-3 block"></i>
                        <p className="text-sm sm:text-base">No testimonials found. Click "Add New" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestimonialsManager;