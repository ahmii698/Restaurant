import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const TestimonialsManager = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', title: '', initials: '', stars: 5, quote: '', order: 0
    });

    useEffect(() => {
        fetchTestimonials();
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
            setFormData({ name: '', title: '', initials: '', stars: 5, quote: '', order: 0 });
            fetchTestimonials();
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            await adminAPI.deleteTestimonial(id);
            fetchTestimonials();
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 gradient-gold">Testimonials</h1>
            <button onClick={() => setShowForm(!showForm)} className="btn-add mb-4">+ Add New Testimonial</button>
            
            {showForm && (
                <form onSubmit={handleSubmit} className="admin-form">
                    <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <input type="text" placeholder="Title (e.g., Food Critic)" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                    <input type="text" placeholder="Initials (e.g., MK)" value={formData.initials} onChange={(e) => setFormData({...formData, initials: e.target.value})} required />
                    <select value={formData.stars} onChange={(e) => setFormData({...formData, stars: e.target.value})}>
                        <option value="5">5 Stars</option><option value="4">4 Stars</option><option value="3">3 Stars</option>
                    </select>
                    <textarea placeholder="Quote" value={formData.quote} onChange={(e) => setFormData({...formData, quote: e.target.value})} required />
                    <input type="number" placeholder="Order" value={formData.order} onChange={(e) => setFormData({...formData, order: e.target.value})} />
                    <button type="submit">{editingId ? 'Update' : 'Create'}</button>
                </form>
            )}
            
            <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Title</th><th>Stars</th><th>Order</th><th>Actions</th></tr></thead>
                <tbody>
                    {testimonials.map(t => (
                        <tr key={t.id}>
                            <td>{t.id}</td><td>{t.name}</td><td>{t.title}</td><td>{'★'.repeat(t.stars)}</td><td>{t.order}</td>
                            <td>
                                <button onClick={() => handleEdit(t)} className="btn-edit">Edit</button>
                                <button onClick={() => handleDelete(t.id)} className="btn-delete ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestimonialsManager;