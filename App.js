import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { View, Text } from 'react-native';
import { useEffect, useRef } from 'react';
import Gerador from './pages/Gerador.jsx';
import Historico from './pages/Historico.jsx';
import Signin from './pages/Signin.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { usePasswordStore } from './stores/usePasswordStore';

export default function App() {
  const isOnline = useNetworkStatus();
  const prevOnline = useRef(null);
  const syncPending = usePasswordStore((s) => s.syncPending);

  useEffect(() => {
    if (!isOnline) {
      prevOnline.current = false;
      return;
    }

    if (prevOnline.current === true) return;
    prevOnline.current = true;

    syncPending();
  }, [isOnline]);

  return (
    <BrowserRouter>
      {!isOnline && (
        <View className="absolute bottom-0 left-0 right-0 z-[999] bg-gray-300 py-1.5 flex-row items-center justify-center gap-1.5">
          <Text className="text-gray-500 text-[11px]">offline — dados serão sincronizados ao reconectar</Text>
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
