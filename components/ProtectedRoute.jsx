import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Navigate } from 'react-router-dom';
import { getToken } from '../services/tokenStorage';

export default function ProtectedRoute({ children }) {
    const [status, setStatus] = useState('loading'); // 'loading' | 'authed' | 'unauthed'

    useEffect(() => {
        getToken().then(token => {
            setStatus(token ? 'authed' : 'unauthed');
        });
    }, []);

    if (status === 'loading') return <View />;
    if (status === 'unauthed') return <Navigate to="/signin" replace />;
    return children;
}
