import { useEffect } from 'react';
import { View } from 'react-native';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, isInitialized, initialize } = useAuthStore();

    useEffect(() => {
        if (!isInitialized) initialize();
    }, [isInitialized]);

    if (!isInitialized) return <View />;
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    return children;
}
