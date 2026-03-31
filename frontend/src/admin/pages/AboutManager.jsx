import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const AboutManager = () => {
    const [about, setAbout] = useState(null);
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showFeatureForm, setShowFeatureForm] = useState(false);
    const [featureForm, setFeatureForm] = useState({ title: '', icon: 'fa-check-circle', order: 0 });
    const [editingFeatureId, setEditingFeatureId] = useState(null);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const response = await adminAPI.getAbout();
            setAbout(response.data.about);
            setFeatures(response.data.features);
            setFormData(response.data.about);
        } catch (error) {
            console.error('Error fetching about:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminAPI.updateAbout(about.id, formData);
            setEditing(false);
            fetchAbout();
            alert('About section updated successfully!');
        } catch (error) {
            console.error('Error updating:', error);
            alert('Error updating about section');
        }
    };

    const handleFeatureSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingFeatureId) {
                await adminAPI.updateFeature(editingFeatureId, featureForm);
            } else {
                await adminAPI.createFeature(featureForm);
            }
            setShowFeatureForm(false);
            setEditingFeatureId(null);
            setFeatureForm({ title: '', icon: 'fa-check-circle', order: 0 });
            fetchAbout();
            alert('Feature saved successfully!');
        } catch (error) {
            console.error('Error saving feature:', error);
            alert('Error saving feature');
        }
    };

    const handleDeleteFeature = async (id) => {
        if (window.confirm('Are you sure you want to delete this feature?')) {
            await adminAPI.deleteFeature(id);
            fetchAbout();
            alert('Feature deleted successfully!');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading about section...</span>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-yellow-600">About Section</h1>
                {!editing && (
                    <button 
                        onClick={() => setEditing(true)} 
                        className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition"
                    >
                        <i className="fas fa-edit mr-2"></i>
                        Edit Section
                    </button>
                )}
            </div>
            
            {!editing ? (
                // View Mode - Brown Theme Card
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-yellow-600 text-sm font-semibold">Badge</p>
                                <p className="text-white mt-1">{about?.badge || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-yellow-600 text-sm font-semibold">Heading</p>
                                <p className="text-white text-lg mt-1">{about?.heading || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-yellow-600 text-sm font-semibold">Button Text</p>
                                <p className="text-white mt-1">{about?.button_text || '—'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-yellow-600 text-sm font-semibold">Image URL</p>
                                <p className="text-gray-400 text-sm mt-1 break-all">{about?.image_url || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-yellow-600 text-sm font-semibold">Paragraph 1</p>
                                <p className="text-gray-300 mt-1 leading-relaxed">{about?.paragraph_1 || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <p className="text-yellow-600 text-sm font-semibold">Paragraph 2</p>
                                <p className="text-gray-300 mt-1 leading-relaxed">{about?.paragraph_2 || '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Mode - Brown Theme Form
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-yellow-600">
                            <i className="fas fa-pen-alt mr-2"></i>
                            Edit About Section
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => setEditing(false)} 
                            className="text-gray-400 hover:text-red-500 transition"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Badge</label>
                                <input 
                                    type="text" 
                                    value={formData.badge || ''} 
                                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                    placeholder="e.g., Our Story"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Heading</label>
                                <input 
                                    type="text" 
                                    value={formData.heading || ''} 
                                    onChange={(e) => setFormData({...formData, heading: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                    placeholder="e.g., A Legacy of Culinary Excellence"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-yellow-600 text-sm font-semibold mb-2">Paragraph 1</label>
                            <textarea 
                                value={formData.paragraph_1 || ''} 
                                onChange={(e) => setFormData({...formData, paragraph_1: e.target.value})}
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition resize-none"
                                placeholder="First paragraph..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-yellow-600 text-sm font-semibold mb-2">Paragraph 2</label>
                            <textarea 
                                value={formData.paragraph_2 || ''} 
                                onChange={(e) => setFormData({...formData, paragraph_2: e.target.value})}
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition resize-none"
                                placeholder="Second paragraph..."
                            />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Image URL</label>
                                <input 
                                    type="text" 
                                    value={formData.image_url || ''} 
                                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Button Text</label>
                                <input 
                                    type="text" 
                                    value={formData.button_text || ''} 
                                    onChange={(e) => setFormData({...formData, button_text: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                    placeholder="e.g., Discover Our Space"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-lg transition"
                            >
                                <i className="fas fa-save mr-2"></i>
                                Save Changes
                            </button>
                            <button 
                                type="button" 
                                onClick={() => setEditing(false)} 
                                className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                <i className="fas fa-times mr-2"></i>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Features Section */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-yellow-600">Features</h2>
                    {!showFeatureForm && (
                        <button 
                            onClick={() => setShowFeatureForm(true)} 
                            className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg transition"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Add Feature
                        </button>
                    )}
                </div>
                
                {showFeatureForm && (
                    <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-yellow-600">
                                <i className="fas fa-plus-circle mr-2"></i>
                                {editingFeatureId ? 'Edit Feature' : 'Add New Feature'}
                            </h3>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowFeatureForm(false);
                                    setEditingFeatureId(null);
                                    setFeatureForm({ title: '', icon: 'fa-check-circle', order: 0 });
                                }} 
                                className="text-gray-400 hover:text-red-500 transition"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleFeatureSubmit} className="space-y-4">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Feature Title</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Premium Wagyu Beef" 
                                    value={featureForm.title} 
                                    onChange={(e) => setFeatureForm({...featureForm, title: e.target.value})} 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Icon (Font Awesome class)</label>
                                <input 
                                    type="text" 
                                    placeholder="fa-check-circle" 
                                    value={featureForm.icon} 
                                    onChange={(e) => setFeatureForm({...featureForm, icon: e.target.value})} 
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                                <p className="text-gray-500 text-xs mt-1">Example: fa-check-circle, fa-star, fa-heart</p>
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Display Order</label>
                                <input 
                                    type="number" 
                                    placeholder="1, 2, 3..." 
                                    value={featureForm.order} 
                                    onChange={(e) => setFeatureForm({...featureForm, order: parseInt(e.target.value)})} 
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="submit" 
                                    className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-lg transition"
                                >
                                    <i className="fas fa-save mr-2"></i>
                                    {editingFeatureId ? 'Update Feature' : 'Add Feature'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowFeatureForm(false);
                                        setEditingFeatureId(null);
                                        setFeatureForm({ title: '', icon: 'fa-check-circle', order: 0 });
                                    }} 
                                    className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                
                {/* Features Table */}
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-yellow-700/30 bg-gray-800">
                                    <th className="px-6 py-4 text-left text-yellow-600 font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left text-yellow-600 font-semibold">Title</th>
                                    <th className="px-6 py-4 text-left text-yellow-600 font-semibold">Icon</th>
                                    <th className="px-6 py-4 text-left text-yellow-600 font-semibold">Order</th>
                                    <th className="px-6 py-4 text-left text-yellow-600 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map(f => (
                                    <tr key={f.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50 transition">
                                        <td className="px-6 py-4 text-white">{f.id}</td>
                                        <td className="px-6 py-4 text-white">{f.title}</td>
                                        <td className="px-6 py-4 text-yellow-500">
                                            <i className={`fas ${f.icon} mr-2`}></i> {f.icon}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{f.order}</td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => { 
                                                    setEditingFeatureId(f.id); 
                                                    setFeatureForm(f); 
                                                    setShowFeatureForm(true); 
                                                }} 
                                                className="px-3 py-1 bg-yellow-700/50 text-yellow-500 rounded-lg hover:bg-yellow-700 transition mr-2"
                                            >
                                                <i className="fas fa-edit mr-1"></i> Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteFeature(f.id)} 
                                                className="px-3 py-1 bg-red-700/50 text-red-400 rounded-lg hover:bg-red-700 transition"
                                            >
                                                <i className="fas fa-trash mr-1"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {features.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <i className="fas fa-list-ul text-4xl mb-3 block"></i>
                            <p>No features found. Click "Add Feature" to create one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutManager;