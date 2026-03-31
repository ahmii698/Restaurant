import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import axios from 'axios';

const GalleryManager = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', 
        image_url: '', 
        category: 'general', 
        order: 0, 
        span_type: '', 
        text_size: 'normal'
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await adminAPI.getGallery();
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching gallery:', error);
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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.success) {
                return response.data.url;
            }
            return null;
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + (error.response?.data?.message || 'Server error'));
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) {
            setFormData({...formData, image_url: uploadedUrl});
            alert('✓ Image uploaded successfully!');
        }
    };

    const handleUrlChange = (e) => {
        setFormData({...formData, image_url: e.target.value});
        setImagePreview(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.image_url) {
            alert('Please upload an image or enter image URL');
            return;
        }
        
        try {
            if (editingId) {
                await adminAPI.updateGallery(editingId, formData);
            } else {
                await adminAPI.createGallery(formData);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', image_url: '', category: 'general', order: 0, span_type: '', text_size: 'normal' });
            setImagePreview(null);
            fetchGallery();
            alert('✓ Image saved successfully!');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving image');
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        setFormData(item);
        setImagePreview(item.image_url);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            await adminAPI.deleteGallery(id);
            fetchGallery();
            alert('✓ Image deleted successfully!');
        }
    };

    const spanOptions = [
        { value: '', label: 'Normal' },
        { value: 'col-span-2', label: 'Large Width (2 columns)' },
        { value: 'row-span-2 col-span-2', label: 'Extra Large (2 rows + 2 columns)' }
    ];

    const categoryOptions = [
        'general', 'dining', 'food', 'drinks', 'vip', 'kitchen'
    ];

    const textSizeOptions = [
        { value: 'normal', label: 'Normal' },
        { value: 'large', label: 'Large' }
    ];

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-yellow-600">📸 Gallery</h1>
                {!showForm && (
                    <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600">
                        <i className="fas fa-plus mr-2"></i> Add New Image
                    </button>
                )}
            </div>
            
            {showForm && (
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                    <div className="flex justify-between mb-4">
                        <h2 className="text-xl font-bold text-yellow-600">
                            {editingId ? 'Edit Image' : 'Add New Image'}
                        </h2>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500">✕</button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Image Title" 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        
                        {/* Image Upload Section */}
                        <div>
                            <label className="block text-yellow-600 mb-2">Upload Image from Computer</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer px-5 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600">
                                    <i className="fas fa-upload mr-2"></i> Choose Image
                                    <input type="file" accept="image/*" onChange={handleImageSelect} disabled={uploading} className="hidden" />
                                </label>
                                {uploading && <span className="text-yellow-600"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                            </div>
                            <p className="text-gray-500 text-sm mt-1">Or enter image URL below</p>
                        </div>
                        
                        <input 
                            type="text" 
                            placeholder="Or paste image URL here" 
                            value={formData.image_url} 
                            onChange={handleUrlChange}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        
                        {imagePreview && (
                            <div className="p-3 bg-gray-800 rounded-lg">
                                <p className="text-yellow-600 mb-2">Preview:</p>
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-h-40 rounded"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=Invalid+Image'; }}
                                />
                            </div>
                        )}
                        
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                            {categoryOptions.map(cat => (
                                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                        
                        <input 
                            type="number" 
                            placeholder="Display Order (1, 2, 3...)" 
                            value={formData.order} 
                            onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        />
                        
                        <select 
                            value={formData.span_type || ''} 
                            onChange={(e) => setFormData({...formData, span_type: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                            {spanOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        
                        <select 
                            value={formData.text_size} 
                            onChange={(e) => setFormData({...formData, text_size: e.target.value})}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
                        >
                            {textSizeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        
                        <div className="flex gap-3 pt-4">
                            <button type="submit" disabled={uploading} className="px-6 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600">
                                {editingId ? 'Update' : 'Add'} Image
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Gallery Table */}
            <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-800 border-b border-yellow-700/30">
                        <tr>
                            <th className="p-3 text-left text-yellow-600">ID</th>
                            <th className="p-3 text-left text-yellow-600">Image</th>
                            <th className="p-3 text-left text-yellow-600">Title</th>
                            <th className="p-3 text-left text-yellow-600">Category</th>
                            <th className="p-3 text-left text-yellow-600">Order</th>
                            <th className="p-3 text-left text-yellow-600">Span Type</th>
                            <th className="p-3 text-left text-yellow-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map(img => (
                            <tr key={img.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50">
                                <td className="p-3">{img.id}</td>
                                <td className="p-3">
                                    <img 
                                        src={img.image_url} 
                                        alt={img.title} 
                                        className="w-12 h-12 object-cover rounded"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=No+Image'; }}
                                    />
                                </td>
                                <td className="p-3 font-medium">{img.title}</td>
                                <td className="p-3 text-gray-400">{img.category}</td>
                                <td className="p-3 text-gray-400">{img.order}</td>
                                <td className="p-3 text-gray-400">{img.span_type || 'Normal'}</td>
                                <td className="p-3">
                                    <button onClick={() => handleEdit(img)} className="px-2 py-1 bg-yellow-700/50 text-yellow-500 rounded hover:bg-yellow-700 mr-2">
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button onClick={() => handleDelete(img.id)} className="px-2 py-1 bg-red-700/50 text-red-400 rounded hover:bg-red-700">
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GalleryManager;