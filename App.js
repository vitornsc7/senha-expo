import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { View, Text } from 'react-native';
import { useEffect, useRef } from 'react';
import Gerador from './pages/Gerador.jsx';
import Historico from './pages/Historico.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { getLocalPasswords, clearLocalPasswords } from './services/cache';
import { syncPasswords } from './services/api';

export default function App() {
  const isOnline = useNetworkStatus();
  const prevOnline = useRef(null);

  useEffect(() => {
    if (!isOnline) {
      prevOnline.current = false;
      return;
    }

    if (prevOnline.current === true) return;
    prevOnline.current = true;

    async function syncPendingPasswords() {
      const local = await getLocalPasswords();
      if (local.length === 0) return;
      try {
        await syncPasswords(local.map((p) => p.password));
        await clearLocalPasswords();
      } catch {
      }
    }

    syncPendingPasswords();
  }, [isOnline]);

  return (
    <BrowserRouter>
      {!isOnline && (
        <View className="absolute top-0 left-0 right-0 z-[999] bg-amber-700 py-1.5 items-center">
          <Text className="text-white text-xs font-semibold">
            Você está offline — senhas geradas serão sincronizadas ao reconectar
          </Text>
        </View>
      )}
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Gerador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
