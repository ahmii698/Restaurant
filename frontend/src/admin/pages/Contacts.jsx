import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await adminAPI.getContacts();
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 gradient-gold">Contact Messages</h1>
            <table className="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Date</th></tr></thead>
                <tbody>
                    {contacts.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td className="max-w-md truncate">{c.message}</td><td>{new Date(c.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Contacts;