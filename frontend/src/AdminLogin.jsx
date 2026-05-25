import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        border: '1px solid rgba(218, 168, 55, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    logo: {
        width: '70px',
        height: '70px',
        background: 'linear-gradient(135deg, #daa837, #b8942e)',
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
        color: '#daa837'
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
    successMsg: {
        background: 'rgba(34, 197, 94, 0.2)',
        border: '1px solid #22c55e',
        color: '#22c55e',
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
        color: '#daa837',
        fontSize: '14px',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(218, 168, 55, 0.3)',
        borderRadius: '12px',
        color: '#ffffff',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease'
    },
    inputFocus: {
        outline: 'none',
        borderColor: '#daa837',
        background: 'rgba(255, 255, 255, 0.12)'
    },
    button: {
        background: 'linear-gradient(135deg, #daa837, #b8942e)',
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
        boxShadow: '0 10px 25px -5px rgba(218, 168, 55, 0.3)'
    },
    footer: {
        marginTop: '20px',
        textAlign: 'center',
        paddingTop: '20px',
        borderTop: '1px solid rgba(218, 168, 55, 0.2)'
    },
    forgotBtn: {
        background: 'transparent',
        border: 'none',
        color: '#daa837',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px',
        textDecoration: 'underline'
    },
    backBtn: {
        background: 'transparent',
        border: 'none',
        color: '#9ca3af',
        cursor: 'pointer',
        fontSize: '14px',
        marginTop: '10px'
    }
};

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [buttonHover, setButtonHover] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    
    // Forgot Password States
    const [showForgot, setShowForgot] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [step, setStep] = useState(1);
    
    const navigate = useNavigate();

    // Login Submit
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

    // Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/admin/forgot-password/send-otp', { email });
            
            if (response.data.success) {
                setResetToken(response.data.token);
                setStep(2);
                setSuccess('OTP sent to your email! Check your inbox.');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/admin/forgot-password/verify-otp', {
                email, otp, token: resetToken
            });
            
            if (response.data.success) {
                setStep(3);
                setSuccess('OTP verified! Enter your new password.');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    // Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await axios.post('http://localhost:8000/api/admin/forgot-password/reset', {
                email, otp, token: resetToken,
                password: newPassword,
                password_confirmation: confirmPassword
            });
            
            if (response.data.success) {
                setSuccess('Password reset successfully! You can now login.');
                setTimeout(() => {
                    setShowForgot(false);
                    setStep(1);
                    setEmail('');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setSuccess('');
                }, 2000);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const getInputStyle = (fieldName) => ({
        ...styles.input,
        ...(focusedField === fieldName ? styles.inputFocus : {})
    });

    // Forgot Password Form
    if (showForgot) {
        return (
            <div style={styles.container}>
                <div style={styles.box}>
                    <div style={styles.header}>
                        <div style={styles.logo}>
                            <i className="fas fa-key" style={styles.logoIcon}></i>
                        </div>
                        <h1 style={styles.title}>Reset Password</h1>
                        <p style={styles.subtitle}>
                            {step === 1 && 'Enter your email to receive OTP'}
                            {step === 2 && 'Enter the OTP sent to your email'}
                            {step === 3 && 'Create new password'}
                        </p>
                    </div>
                    
                    {error && <div style={styles.errorMsg}><i className="fas fa-exclamation-circle"></i>{error}</div>}
                    {success && <div style={styles.successMsg}><i className="fas fa-check-circle"></i>{success}</div>}
                    
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>Admin Email</label>
                                <input type="email" placeholder="Enter your registered email" value={email} onChange={(e) => setEmail(e.target.value)} required style={getInputStyle('email')} />
                            </div>
                            <button type="submit" disabled={loading} style={{ ...styles.button, ...(buttonHover && !loading ? styles.buttonHover : {}) }} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)}>
                                {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending OTP...</> : <><i className="fas fa-paper-plane"></i> Send OTP</>}
                            </button>
                        </form>
                    )}
                    
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><i className="fas fa-key" style={{ marginRight: '8px' }}></i>Enter OTP</label>
                                <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength="6" required style={getInputStyle('otp')} />
                            </div>
                            <button type="submit" disabled={loading} style={{ ...styles.button, ...(buttonHover && !loading ? styles.buttonHover : {}) }} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)}>
                                {loading ? <><i className="fas fa-spinner fa-spin"></i> Verifying...</> : <><i className="fas fa-check-circle"></i> Verify OTP</>}
                            </button>
                        </form>
                    )}
                    
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><i className="fas fa-lock"></i> New Password</label>
                                <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={getInputStyle('newPassword')} />
                            </div>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}><i className="fas fa-lock"></i> Confirm Password</label>
                                <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={getInputStyle('confirmPassword')} />
                            </div>
                            <button type="submit" disabled={loading} style={{ ...styles.button, ...(buttonHover && !loading ? styles.buttonHover : {}) }} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)}>
                                {loading ? <><i className="fas fa-spinner fa-spin"></i> Resetting...</> : <><i className="fas fa-save"></i> Reset Password</>}
                            </button>
                        </form>
                    )}
                    
                    <div style={styles.footer}>
                        <button onClick={() => { setShowForgot(false); setStep(1); setEmail(''); setOtp(''); setNewPassword(''); setConfirmPassword(''); setError(''); setSuccess(''); }} style={styles.backBtn}>
                            <i className="fas fa-arrow-left"></i> Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Login Form
    return (
        <div style={styles.container}>
            <div style={styles.box}>
                <div style={styles.header}>
                    <div style={styles.logo}><i className="fas fa-utensils" style={styles.logoIcon}></i></div>
                    <h1 style={styles.title}>Mehfil Cafe</h1>
                    <p style={styles.subtitle}>Admin Panel Login</p>
                </div>
                
                {error && <div style={styles.errorMsg}><i className="fas fa-exclamation-circle"></i>{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fas fa-user"></i> Username</label>
                        <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required style={getInputStyle('username')} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}><i className="fas fa-lock"></i> Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required style={getInputStyle('password')} />
                    </div>
                    <button type="submit" disabled={loading} style={{ ...styles.button, ...(buttonHover && !loading ? styles.buttonHover : {}) }} onMouseEnter={() => setButtonHover(true)} onMouseLeave={() => setButtonHover(false)}>
                        {loading ? <><i className="fas fa-spinner fa-spin"></i> Logging in...</> : <><i className="fas fa-sign-in-alt"></i> Login</>}
                    </button>
                </form>
                
                <div style={styles.footer}>
                    <button onClick={() => setShowForgot(true)} style={styles.forgotBtn}>
                        <i className="fas fa-question-circle"></i> Forgot Password?
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;