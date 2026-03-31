import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Brown theme styles matching your website
const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0705',
        padding: '20px'
    },
    box: {
        background: '#1a1510',
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    logo: {
        width: '70px',
        height: '70px',
        background: 'linear-gradient(135deg, #d4af37, #b8942e)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px'
    },
    logoIcon: {
        fontSize: '32px',
        color: '#000000'
    },
    title: {
        fontSize: '28px',
        margin: '0',
        background: 'linear-gradient(135deg, #d4af37, #f5e6d3)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent'
    },
    subtitle: {
        fontSize: '14px',
        color: '#9ca3af',
        marginTop: '5px'
    },
    errorMsg: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid #ef4444',
        color: '#ef4444',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        color: '#eab308',
        fontSize: '14px',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    },
    inputFocus: {
        outline: 'none',
        borderColor: '#eab308',
        background: 'rgba(255, 255, 255, 0.12)'
    },
    button: {
        background: 'linear-gradient(135deg, #d4af37, #b8942e)',
        color: '#000000',
        fontWeight: 'bold',
        padding: '14px',
        borderRadius: '12px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'all 0.3s ease'
    },
    buttonHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px -5px rgba(212, 175, 55, 0.3)'
    },
    footer: {
        marginTop: '20px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)'
    },
    footerText: {
        fontSize: '12px',
        color: '#6b7280',
        margin: '0'
    },
    span: {
        color: '#eab308',
        fontWeight: 'bold'
    }
};

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/admin/login', {
                username,
                password
            });
            
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminData', JSON.stringify(response.data.admin));
                navigate('/admin/dashboard');
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Cannot connect to server. Make sure backend is running');
            }
        } finally {
            setLoading(false);
        }
    };

    const getInputStyle = (fieldName) => ({
        ...styles.input,
        ...(focusedField === fieldName ? styles.inputFocus : {})
    });

    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <div style={styles.header}>
                    <div style={styles.logo}>
                        <i className="fas fa-utensils" style={styles.logoIcon}></i>
                    </div>
                    <h1 style={styles.title}>Gourmet Bistro</h1>
                    <p style={styles.subtitle}>Admin Panel Login</p>
                </div>
                
                {error && (
                    <div style={styles.errorMsg}>
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                            Username or Email
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your username or email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            required
                            style={getInputStyle('username')}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>
                            <i className="fas fa-lock" style={{ marginRight: '8px' }}></i>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            required
                            style={getInputStyle('password')}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{
                            ...styles.button,
                            ...(buttonHover && !loading ? styles.buttonHover : {})
                        }}
                        onMouseEnter={() => setButtonHover(true)}
                        onMouseLeave={() => setButtonHover(false)}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Logging in...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                                Login
                            </>
                        )}
                    </button>
                </form>
                
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Demo: <span style={styles.span}>admin</span> / <span style={styles.span}>admin123</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;