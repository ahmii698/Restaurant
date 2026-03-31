import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import axios from 'axios';

const MenuManager = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '', category: 'burgers', price: '', description: '', image_url: '', badge: '', order: 0
    });

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getMenu();
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
            alert('Error fetching menu items');
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file) => {
        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        
        try {
            const response = await axios.post('http://localhost:8000/api/admin/upload-image', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            
            if (response.data.success) {
                return response.data.url;
            } else {
                alert('Image upload failed: ' + response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Upload error:', error);
            if (error.response) {
                alert('Upload error: ' + (error.response.data?.message || 'Server error'));
            } else {
                alert('Cannot connect to server. Make sure backend is running on port 8000');
            }
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (jpg, png, webp, etc.)');
            return;
        }
        
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        
        // Upload image to server
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) {
            setFormData({...formData, image_url: uploadedUrl});
            alert('✓ Image uploaded successfully!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.image_url) {
            alert('Please upload an image first');
            return;
        }
        
        try {
            if (editingId) {
                await adminAPI.updateMenu(editingId, formData);
                alert('✓ Menu item updated successfully!');
            } else {
                await adminAPI.createMenu(formData);
                alert('✓ Menu item added successfully!');
            }
            setShowForm(false);
            setEditingId(null);
            setSelectedImage(null);
            setImagePreview(null);
            setFormData({ name: '', category: 'burgers', price: '', description: '', image_url: '', badge: '', order: 0 });
            fetchMenu();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving menu item');
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData(item);
        setImagePreview(item.image_url);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await adminAPI.deleteMenu(id);
                fetchMenu();
                alert('✓ Menu item deleted successfully!');
            } catch (error) {
                alert('Error deleting item');
            }
        }
    };

    const categories = ['burgers', 'sides', 'drinks', 'desserts', 'hookah'];
    const categoryLabels = {
        burgers: '🍔 Burgers', 
        sides: '🍟 Sides', 
        drinks: '🍷 Drinks', 
        desserts: '🍰 Desserts', 
        hookah: '💨 Hookah Lounge'
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading menu items...</span>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-yellow-600">🍽️ Menu Items</h1>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="px-5 py-2 bg-yellow-700 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Add New Item
                    </button>
                )}
            </div>
            
            {showForm && (
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-yellow-600">
                            <i className="fas fa-pen-alt mr-2"></i>
                            {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setSelectedImage(null);
                                setImagePreview(null);
                                setFormData({ name: '', category: 'burgers', price: '', description: '', image_url: '', badge: '', order: 0 });
                            }} 
                            className="text-gray-400 hover:text-red-500 transition"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Item Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Wagyu Truffle Burger" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Category *</label>
                                <select 
                                    value={formData.category} 
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Price ($) *</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="e.g., 28" 
                                    value={formData.price} 
                                    onChange={(e) => setFormData({...formData, price: e.target.value})} 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Display Order</label>
                                <input 
                                    type="number" 
                                    placeholder="1, 2, 3..." 
                                    value={formData.order} 
                                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} 
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-yellow-600 text-sm font-semibold mb-2">Description</label>
                            <textarea 
                                placeholder="Describe the dish..." 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                rows="3"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition resize-none"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-yellow-600 text-sm font-semibold mb-2">Badge (Optional)</label>
                            <input 
                                type="text" 
                                placeholder="e.g., Chef's Special, Best Seller, Vegan" 
                                value={formData.badge} 
                                onChange={(e) => setFormData({...formData, badge: e.target.value})} 
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                            />
                        </div>
                        
                        {/* Image Upload Section */}
                        <div className="border-t border-yellow-700/30 pt-5 mt-3">
                            <label className="block text-yellow-600 text-sm font-semibold mb-3">Item Image *</label>
                            
                            {/* Image Upload from Computer */}
                            <div className="mb-4">
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer">
                                        <div className="px-5 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-medium rounded-lg transition">
                                            <i className="fas fa-upload mr-2"></i>
                                            Choose Image
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    </label>
                                    {uploading && (
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <i className="fas fa-spinner fa-spin"></i>
                                            <span>Uploading...</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-500 text-xs mt-2">Select image from your computer. JPG, PNG, WebP supported. Max 5MB.</p>
                            </div>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-yellow-700/30">
                                    <p className="text-yellow-600 text-sm mb-2">✓ Image Preview:</p>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="max-w-full h-32 object-cover rounded-lg border border-yellow-700/50"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/128?text=Invalid+Image'; }}
                                    />
                                    {formData.image_url && (
                                        <p className="text-gray-500 text-xs mt-2 break-all">
                                            <i className="fas fa-link mr-1"></i> {formData.image_url}
                                        </p>
                                    )}
                                </div>
                            )}
                            
                            {/* Image URL Input (Optional) */}
                            <div className="mt-4">
                                <label className="block text-gray-400 text-sm mb-2">Or enter image URL directly</label>
                                <input 
                                    type="text" 
                                    placeholder="https://images.unsplash.com/..." 
                                    value={formData.image_url} 
                                    onChange={(e) => {
                                        setFormData({...formData, image_url: e.target.value});
                                        if (e.target.value) setImagePreview(e.target.value);
                                    }}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-lg transition disabled:opacity-50"
                            >
                                <i className="fas fa-save mr-2"></i>
                                {editingId ? 'Update Item' : 'Add Item'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setSelectedImage(null);
                                    setImagePreview(null);
                                    setFormData({ name: '', category: 'burgers', price: '', description: '', image_url: '', badge: '', order: 0 });
                                }} 
                                className="px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Menu Items Table */}
            <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-yellow-700/30 bg-gray-800">
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">ID</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Image</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Name</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Category</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Price</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Badge</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Order</th>
                                <th className="px-4 py-3 text-left text-yellow-600 font-semibold">Actions</th>
                             </tr>
                        </thead>
                        <tbody>
                            {menuItems.map(item => (
                                <tr key={item.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50 transition">
                                    <td className="px-4 py-3 text-white">{item.id}</td>
                                    <td className="px-4 py-3">
                                        <img 
                                            src={item.image_url} 
                                            alt={item.name} 
                                            className="w-12 h-12 object-cover rounded"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/48?text=No+Image'; }}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-white font-medium">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-400">{categoryLabels[item.category] || item.category}</td>
                                    <td className="px-4 py-3 text-yellow-500">${item.price}</td>
                                    <td className="px-4 py-3">
                                        {item.badge && (
                                            <span className="px-2 py-1 bg-red-700/50 text-red-300 text-xs rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{item.order}</td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => handleEdit(item)} 
                                            className="px-3 py-1 bg-yellow-700/50 text-yellow-500 rounded-lg hover:bg-yellow-700 transition mr-2"
                                        >
                                            <i className="fas fa-edit mr-1"></i> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item.id)} 
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
                {menuItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <i className="fas fa-utensils text-4xl mb-3 block"></i>
                        <p>No menu items found. Click "Add New Item" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuManager;