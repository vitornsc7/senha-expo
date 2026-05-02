import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, deletePassword } from '../services/api';

export default function Historico() {
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const { history } = await getHistory();
        setHistorico(history);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregarHistorico();
  }, []);

  async function handleExcluir(id) {
    try {
      await deletePassword(id);
      setHistorico(prev => prev.filter(item => item.id !== id));
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
              <Text className="flex-1 p-2 rounded bg-brand-light text-brand-text">{item.password}</Text>
              <Pressable
                className="bg-red-600 active:bg-red-700 hover:bg-red-700 py-1.5 px-2.5 rounded"
                onPress={() => handleExcluir(item.id)}
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
