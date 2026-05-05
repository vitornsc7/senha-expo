import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deletePassword } from '../services/api';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { getLocalPasswords, removeLocalPassword } from '../services/cache';

export default function Historico() {
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const carregarHistorico = useCallback(async () => {
    setLoading(true);
    setError('');

    if (isOnline) {
      try {
        const { history } = await getHistory();
        setHistorico(history);
      } catch {
        setError('Erro ao carregar histórico.');
      }
    } else {
      const local = await getLocalPasswords();
      setHistorico(local);
    }

    setLoading(false);
  }, [isOnline]);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  async function handleExcluir(item) {
    setError('');
    try {
      if (item.isLocal) {
        await removeLocalPassword(item.id);
        setHistorico((prev) => prev.filter((p) => p.id !== item.id));
      } else if (isOnline) {
        await deletePassword(item.id);
        setHistorico((prev) => prev.filter((p) => p.id !== item.id));
      } else {
        setError('Sem conexão. Não é possível excluir senhas do servidor agora.');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View className="flex-1 bg-white items-center justify-center gap-4">
      <Text className="text-brand text-xl font-bold">Historico de Senhas</Text>

      {error ? <Text className="text-red-600 text-[13px]">{error}</Text> : null}

      <ScrollView
        className="w-[280px] max-h-[260px] border border-brand rounded-lg bg-white"
        contentContainerStyle={{ padding: 10, gap: 8 }}
      >
        {loading ? (
          <Text className="text-brand-muted">Carregando...</Text>
        ) : historico.length === 0 ? (
          <Text className="text-brand-muted">Nenhuma senha gerada ainda.</Text>
        ) : (
          historico.map((item) => (
            <View key={item.id} className="flex-row items-center justify-between gap-2">
              <View className="flex-1">
                <Text className="p-2 rounded bg-brand-light text-brand-text">{item.password}</Text>
                {item.isLocal && (
                  <Text style={{ color: '#b45309', fontSize: 10, marginTop: 1 }}>local</Text>
                )}
              </View>
              <Pressable
                className="bg-red-600 active:bg-red-700 hover:bg-red-700 py-1.5 px-2.5 rounded"
                onPress={() => handleExcluir(item)}
              >
                <Text className="text-white text-xs">Excluir</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <Pressable
        className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
        onPress={() => navigate('/')}
      >
        <Text className="text-white text-center">Voltar</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}
