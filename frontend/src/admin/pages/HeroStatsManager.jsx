import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const HeroStatsManager = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        label: '',
        value: '',
        icon: '',
        order: 0,
        is_active: true
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const response = await adminAPI.getHeroStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
            alert('Error fetching hero stats');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingId) {
                await adminAPI.updateHeroStat(editingId, formData);
                alert('✓ Stat updated successfully!');
            } else {
                await adminAPI.createHeroStat(formData);
                alert('✓ Stat added successfully!');
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ label: '', value: '', icon: '', order: 0, is_active: true });
            fetchStats();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving stat');
        }
    };

    const handleEdit = (stat) => {
        setEditingId(stat.id);
        setFormData(stat);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this stat?')) {
            try {
                await adminAPI.deleteHeroStat(id);
                fetchStats();
                alert('✓ Stat deleted successfully!');
            } catch (error) {
                alert('Error deleting stat');
            }
        }
    };

    const handleToggleStatus = async (stat) => {
        try {
            await adminAPI.updateHeroStat(stat.id, { ...stat, is_active: !stat.is_active });
            fetchStats();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const handleOrderChange = async (id, newOrder) => {
        const updatedStats = stats.map(stat => 
            stat.id === id ? { ...stat, order: parseInt(newOrder) } : stat
        );
        setStats(updatedStats);
        
        // Update order in database
        try {
            const orderData = updatedStats.map((stat, index) => ({
                id: stat.id,
                order: stat.order
            }));
            await adminAPI.updateHeroStatsOrder(orderData);
            fetchStats();
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Loading stats...</span>
        </div>
    );

    return (
        <div className="px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-yellow-600">
                    <i className="fas fa-chart-simple mr-2"></i>
                    Hero Stats
                </h1>
                {!showForm && (
                    <button 
                        onClick={() => setShowForm(true)} 
                        className="w-full sm:w-auto px-4 sm:px-5 py-2 bg-yellow-700 hover:bg-yellow-600 text-white font-semibold rounded-lg transition text-sm sm:text-base"
                    >
                        <i className="fas fa-plus mr-2"></i>
                        Add New Stat
                    </button>
                )}
            </div>
            
            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-gray-900 rounded-xl border border-yellow-700/50 p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-yellow-600">
                            <i className="fas fa-pen-alt mr-2"></i>
                            {editingId ? 'Edit Stat' : 'Add New Stat'}
                        </h2>
                        <button 
                            type="button" 
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setFormData({ label: '', value: '', icon: '', order: 0, is_active: true });
                            }} 
                            className="text-gray-400 hover:text-red-500 transition"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-yellow-600 text-xs sm:text-sm font-semibold mb-2">Label *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Gourmet Burgers" 
                                    value={formData.label} 
                                    onChange={(e) => setFormData({...formData, label: e.target.value})} 
                                    required 
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-xs sm:text-sm font-semibold mb-2">Value *</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g., 95" 
                                    value={formData.value} 
                                    onChange={(e) => setFormData({...formData, value: e.target.value})} 
                                    required 
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            <div>
                                <label className="block text-yellow-600 text-xs sm:text-sm font-semibold mb-2">Icon (FontAwesome)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., fa-burger" 
                                    value={formData.icon} 
                                    onChange={(e) => setFormData({...formData, icon: e.target.value})} 
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-yellow-600 text-xs sm:text-sm font-semibold mb-2">Display Order</label>
                                <input 
                                    type="number" 
                                    placeholder="1, 2, 3..." 
                                    value={formData.order} 
                                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} 
                                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-yellow-600 focus:outline-none transition text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.is_active} 
                                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})} 
                                    className="w-4 h-4 accent-yellow-600"
                                />
                                <span className="text-gray-300 text-sm">Active (show on website)</span>
                            </label>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
                            <button 
                                type="submit" 
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-lg transition text-sm sm:text-base"
                            >
                                <i className="fas fa-save mr-2"></i>
                                {editingId ? 'Update Stat' : 'Add Stat'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                    setFormData({ label: '', value: '', icon: '', order: 0, is_active: true });
                                }} 
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {/* Stats Table */}
            <div className="bg-gray-900 rounded-xl border border-yellow-700/50 overflow-x-auto">
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-yellow-700/30 bg-gray-800">
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">ID</th>
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">Label</th>
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">Value</th>
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">Icon</th>
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">Order</th>
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">Status</th>
                                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-yellow-600 font-semibold text-xs sm:text-sm">Actions</th>
                                  </tr>
                            </thead>
                            <tbody>
                                {stats.map((stat) => (
                                    <tr key={stat.id} className="border-b border-yellow-700/20 hover:bg-gray-800/50 transition">
                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm">{stat.id}</td>
                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-white text-xs sm:text-sm">{stat.label}</td>
                                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-yellow-500 font-bold text-sm sm:text-base">{stat.value}</td>
                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                            {stat.icon && <i className={`fas ${stat.icon} text-yellow-500`}></i>}
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                            <input 
                                                type="number" 
                                                value={stat.order} 
                                                onChange={(e) => handleOrderChange(stat.id, e.target.value)}
                                                className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm text-center"
                                            />
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                            <button 
                                                onClick={() => handleToggleStatus(stat)}
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    stat.is_active ? 'bg-green-700/50 text-green-400' : 'bg-gray-700/50 text-gray-400'
                                                }`}
                                            >
                                                {stat.is_active ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                                            <div className="flex flex-wrap gap-1">
                                                <button 
                                                    onClick={() => handleEdit(stat)} 
                                                    className="px-2 sm:px-3 py-1 bg-yellow-700/50 text-yellow-500 rounded-lg hover:bg-yellow-700 transition text-xs sm:text-sm whitespace-nowrap"
                                                >
                                                    <i className="fas fa-edit mr-1"></i>
                                                    <span className="hidden sm:inline">Edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(stat.id)} 
                                                    className="px-2 sm:px-3 py-1 bg-red-700/50 text-red-400 rounded-lg hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
                                                >
                                                    <i className="fas fa-trash mr-1"></i>
                                                    <span className="hidden sm:inline">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {stats.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <i className="fas fa-chart-line text-4xl mb-3 block"></i>
                        <p className="text-sm sm:text-base">No stats found. Click "Add New Stat" to create one.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroStatsManager;