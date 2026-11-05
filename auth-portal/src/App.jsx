// auth-portal/src/App.jsx
import { useState, useEffect } from 'react';
import AuthForms from './components/AuthForms.jsx';

export default function App() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [statusMessage, setStatusMessage] = useState('System Status: Standing by for session validation...');
    const [activeUser, setActiveUser] = useState(null);
    const [secretCryptData, setSecretCryptData] = useState('');

    // ⚡ NEW PERSISTENCE CHECK: Run automatically the microsecond a user presses F5 refresh!
    useEffect(() => {
        const checkActiveSession = async () => {
            try {
                const response = await fetch('http://localhost:3020/api/auth/me', {
                    method: 'GET',
                    credentials: 'include' // Crucial: passes cookies up to check matching parameters
                });
                const data = await response.json();
                
                if (response.ok && data.authenticated) {
                    setActiveUser(data.user.username);
                    setStatusMessage('🔒 SESSION RECOVERED: Automatically authenticated from secure browser cookie.');
                }
            } catch (err) {
                // Keep silently on standby if no previous cookie session parameters are alive
            }
        };
        checkActiveSession();
    }, []);

    const handleRegister = async (username, password) => {
        setStatusMessage('Transmitting registration parameters to authentication core...');
        try {
            const response = await fetch('http://localhost:3020/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                setStatusMessage('🔒 Account secured! Switching to Login terminal...');
                setIsLoginMode(true);
            } else {
                setStatusMessage(`Registration Error: ${data.error || 'Request rejected'}`);
            }
        } catch (err) {
            setStatusMessage('Network Fault: Failed to reach authentication desk.');
        }
    };

    const handleLogin = async (username, password) => {
        setStatusMessage('Evaluating account credential hash compliance...');
        try {
            const response = await fetch('http://localhost:3020/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();

            if (response.ok) {
                setActiveUser(data.user.username);
                setStatusMessage('🔒 VERIFIED: Session token locked in browser cookie engine.');
            } else {
                setStatusMessage(`Access Denied: ${data.error || 'Invalid credentials'}`);
            }
        } catch (err) {
            setStatusMessage('Network Fault: Failed to reach authentication desk.');
        }
    };

    const handleFetchSecretDashboard = async () => {
        setStatusMessage('Requesting private vault access tracking authorization...');
        try {
            const response = await fetch('http://localhost:3020/api/private/dashboard', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setSecretCryptData(data.secretIntelligencePayload);
                setStatusMessage('Success: Private vault clearance granted.');
            } else {
                setStatusMessage(`Access Blocked: ${data.error || 'Verification failed'}`);
            }
        } catch (err) {
            setStatusMessage('Network Fault: Secure path inaccessible.');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:3020/api/auth/logout', { method: 'POST', credentials: 'include' });
            setActiveUser(null);
            setSecretCryptData('');
            setStatusMessage('Session closed. Security cookie wiped cleanly.');
        } catch (err) {
            setStatusMessage('Error: Failed to safely close session.');
        }
    };

    return (
        <AuthForms
            isLoginMode={isLoginMode}
            setIsLoginMode={setIsLoginMode}
            statusMessage={statusMessage}
            setStatusMessage={setStatusMessage}
            activeUser={activeUser}
            secretCryptData={secretCryptData}
            onRegisterSubmit={handleRegister}
            onLoginSubmit={handleLogin}
            onFetchSecretDashboard={handleFetchSecretDashboard}
            onLogout={handleLogout}
        />
    );
}
