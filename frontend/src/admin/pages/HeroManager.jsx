import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import axios from 'axios';

const HeroManager = () => {
    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileType, setFileType] = useState('');

    useEffect(() => {
        fetchHero();
    }, []);

    const fetchHero = async () => {
        try {
            const response = await adminAPI.getHero();
            setHero(response.data);
            setFormData(response.data);
            setFilePreview(response.data.video_url);
            if (response.data.video_url && response.data.video_url.endsWith('.mp4')) {
                setFileType('video');
            } else if (response.data.video_url) {
                setFileType('image');
            }
        } catch (error) {
            console.error('Error fetching hero:', error);
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async (file) => {
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
            alert('Upload failed');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type.startsWith('image/')) {
            setFileType('image');
        } else if (file.type.startsWith('video/')) {
            setFileType('video');
        } else {
            alert('Please select an image or video file');
            return;
        }
        
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        setSelectedFile(file);
        
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
            setFormData({...formData, video_url: uploadedUrl});
            alert('✓ File uploaded successfully!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.video_url) {
            alert('Please upload a background image or video');
            return;
        }
        
        try {
            await adminAPI.updateHero(hero.id, formData);
            setEditing(false);
            fetchHero();
            alert('Hero section updated successfully!');
        } catch (error) {
            console.error('Error updating:', error);
            alert('Error updating hero section');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading hero section...</span>
        </div>
    );

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-yellow-600">🎬 Hero Section</h1>
                {!editing && (
                    <button 
                        onClick={() => setEditing(true)} 
                        className="px-5 py-2 bg-yellow-700 hover:bg-yellow-600 text-white font-semibold rounded-lg transition"
                    >
                        <i className="fas fa-edit mr-2"></i>
                        Edit Hero Content
                    </button>
                )}
            </div>
            
            {!editing ? (
                // View Mode
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <label className="text-yellow-600 text-sm font-semibold">Heading 1</label>
                                <p className="text-white text-lg mt-1">{hero?.heading_1 || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <label className="text-yellow-600 text-sm font-semibold">Heading 2</label>
                                <p className="text-white text-lg mt-1">{hero?.heading_2 || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <label className="text-yellow-600 text-sm font-semibold">Button 1 Text</label>
                                <p className="text-white text-lg mt-1">{hero?.btn_1_text || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <label className="text-yellow-600 text-sm font-semibold">Button 2 Text</label>
                                <p className="text-white text-lg mt-1">{hero?.btn_2_text || '—'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gray-800 rounded-lg p-4">
                                <label className="text-yellow-600 text-sm font-semibold">Background Media</label>
                                {filePreview && fileType === 'video' && (
                                    <video className="mt-2 w-full max-h-32 rounded-lg border border-yellow-700/50" controls>
                                        <source src={filePreview} type="video/mp4" />
                                    </video>
                                )}
                                {filePreview && fileType === 'image' && (
                                    <img src={filePreview} alt="Preview" className="mt-2 w-full max-h-32 object-cover rounded-lg border border-yellow-700/50" />
                                )}
                                <p className="text-gray-400 text-sm mt-2 break-all">{hero?.video_url || '—'}</p>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-4">
                                <label className="text-yellow-600 text-sm font-semibold">Description</label>
                                <p className="text-gray-300 mt-2 leading-relaxed">{hero?.description || '—'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Edit Mode
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-yellow-600">
                            <i className="fas fa-pen-alt mr-2"></i>
                            Edit Hero Content
                        </h2>
                        <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-red-500">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Heading 1</label>
                                <input type="text" value={formData.heading_1 || ''} onChange={(e) => setFormData({...formData, heading_1: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Heading 2</label>
                                <input type="text" value={formData.heading_2 || ''} onChange={(e) => setFormData({...formData, heading_2: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-yellow-600 text-sm font-semibold mb-2">Description</label>
                            <textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows="4" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none resize-none" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Button 1 Text</label>
                                <input type="text" value={formData.btn_1_text || ''} onChange={(e) => setFormData({...formData, btn_1_text: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-sm font-semibold mb-2">Button 2 Text</label>
                                <input type="text" value={formData.btn_2_text || ''} onChange={(e) => setFormData({...formData, btn_2_text: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                            </div>
                        </div>
                        
                        {/* File Upload Section */}
                        <div className="border-t border-yellow-700/30 pt-5">
                            <label className="block text-yellow-600 text-sm font-semibold mb-3">Background Image/Video</label>
                            
                            <div className="mb-4">
                                <div className="flex items-center gap-4">
                                    <label className="cursor-pointer">
                                        <div className="px-5 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-medium rounded-lg">
                                            <i className="fas fa-upload mr-2"></i>
                                            Choose File
                                        </div>
                                        <input type="file" accept="image/*,video/*" onChange={handleFileSelect} disabled={uploading} className="hidden" />
                                    </label>
                                    {uploading && <span className="text-yellow-600"><i className="fas fa-spinner fa-spin"></i> Uploading...</span>}
                                </div>
                                <p className="text-gray-500 text-xs mt-2">JPG, PNG, GIF, MP4 supported. Max 5MB.</p>
                            </div>
                            
                            {filePreview && (
                                <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-yellow-700/30">
                                    <p className="text-yellow-600 text-sm mb-2">Preview:</p>
                                    {fileType === 'video' ? (
                                        <video className="max-h-32 rounded" controls>
                                            <source src={filePreview} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <img src={filePreview} alt="Preview" className="max-h-32 object-cover rounded" />
                                    )}
                                    {formData.video_url && <p className="text-gray-500 text-xs mt-2 break-all">{formData.video_url}</p>}
                                </div>
                            )}
                            
                            <input type="text" placeholder="Or enter URL directly" value={formData.video_url || ''} 
                                onChange={(e) => { setFormData({...formData, video_url: e.target.value}); setFilePreview(e.target.value); }}
                                className="w-full mt-3 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none" />
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                            <button type="submit" disabled={uploading} className="px-6 py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-lg">
                                <i className="fas fa-save mr-2"></i> Save Changes
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HeroManager;