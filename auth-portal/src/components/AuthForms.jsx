// auth-portal/src/components/AuthForms.jsx
import { useState } from 'react';

export default function AuthForms({
    isLoginMode,
    setIsLoginMode,
    statusMessage,
    setStatusMessage,
    activeUser,
    secretCryptData,
    onRegisterSubmit,
    onLoginSubmit,
    onFetchSecretDashboard,
    onLogout
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;
        
        if (isLoginMode) {
            onLoginSubmit(username.trim(), password.trim());
        } else {
            onRegisterSubmit(username.trim(), password.trim());
            setPassword(''); // Wipe password row on registration success
        }
    };

    // 🛑 SCREEN FLOW STATE 1: If logged inside, display the Inner Crypt Secret Dashboard Panel Room
    if (activeUser) {
        return (
            <div style={{ maxWidth: '600px', margin: '60px auto', padding: '30px', fontFamily: 'monospace', background: '#0f172a', color: '#f8fafc', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '15px', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', color: '#10b981' }}>🔓 Inner Crypt Active Room</h2>
                        <small style={{ color: '#64748b' }}>Authorized Session: <strong>{activeUser}</strong></small>
                    </div>
                    <button onClick={onLogout} style={{ padding: '6px 14px', background: '#f43f5e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>Disconnect 🔌</button>
                </div>

                <p style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#cbd5e1', borderLeft: '4px solid #10b981', margin: '0 0 20px 0' }}>
                    📡 <strong>Trace Terminal:</strong> {statusMessage}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <button onClick={onFetchSecretDashboard} style={{ width: '100%', padding: '12px', background: 'linear-gradient(to right, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                        🔑 Access Guarded Private Crypt Data
                    </button>

                    {secretCryptData && (
                        <div style={{ background: '#020617', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '12px', lineHeight: '1.6' }}>
                            <span style={{ color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🛰️ DECIPHERED CLOUD INTELLIGENCE DATASTREAM:</span>
                            <span style={{ color: '#34d399' }}>{secretCryptData}</span>
                            <p style={{ color: '#475569', fontSize: '10px', marginTop: '15px', borderTop: '1px dashed #1e293b', paddingTop: '10px', margin: '15px 0 0 0' }}>
                                🛡️ Anti-XSS Metric: If you type `document.cookie` inside your browser inspection console right now, it will return blank. Your session token is 100% invisible to hacker script vectors!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 🛑 SCREEN FLOW STATE 2: Otherwise, display the login gate account input panel cards
    return (
        <div style={{ maxWidth: '420px', margin: '100px auto', padding: '30px', fontFamily: 'monospace', background: '#0f172a', color: '#f8fafc', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #1e293b' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '15px', marginBottom: '20px' }}>
                <span style={{ fontSize: '28px' }}>🗝️</span>
                <h2 style={{ margin: '10px 0 5px 0', fontSize: '18px', color: '#38bdf8' }}>{isLoginMode ? 'SESSION LOGIN DOOR' : 'CREATE FORTRÈSS ACCOUNT'}</h2>
                <small style={{ color: '#64748b' }}>Armored Cookie Token Security Sandbox</small>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', color: '#94a3b8' }}>USER PERMIT HANDLE:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." style={{ width: '94%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '6px', color: '#94a3b8' }}>PASSPHRASE CHARACTER MATRIX:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '94%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '13px', outline: 'none' }} />
                </div>

                <button type="submit" style={{ width: '100%', padding: '12px', background: isLoginMode ? 'linear-gradient(to right, #0284c7, #4f46e5)' : 'linear-gradient(to right, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '10px' }}>
                    {isLoginMode ? '⚡ Authenticate and Inject Cookie' : '🛡️ Establish Secure Profile'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px' }}>
                <span style={{ color: '#64748b' }}>{isLoginMode ? "New operative?" : "Already hold permissions?"} </span>
                <span onClick={() => { setIsLoginMode(!isLoginMode); setStatusMessage('System Status: Shifted console operation parameters.'); }} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
                    {isLoginMode ? 'Register Handle' : 'Back to Login Door'}
                </span>
            </div>

            {statusMessage && (
                <div style={{ marginTop: '20px', padding: '10px', background: '#1e293b', borderRadius: '8px', fontSize: '10px', textAlign: 'center', border: '1px solid #131924', color: statusMessage.includes('VERIFIED') || statusMessage.includes('granted') || statusMessage.includes('secured') ? '#34d399' : '#94a3b8' }}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
}
