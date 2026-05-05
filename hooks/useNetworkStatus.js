import { useState, useEffect } from 'react';

/**
 * Detecta o status de rede usando navigator.onLine (web / Expo Web).
 * No caso de falha silenciosa da API, o try/catch nos componentes
 * também aciona o modo offline.
 */
export function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}
