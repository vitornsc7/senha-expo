import { StatusBar } from 'expo-status-bar';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { usePasswordStore } from '../stores/usePasswordStore';

export default function Historico() {
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const { history, historyLoading, error, loadHistory, deleteItem } = usePasswordStore();

  useEffect(() => {
    loadHistory(isOnline);
  }, [isOnline]);

  async function handleExcluir(item) {
    await deleteItem(item, isOnline);
  }

  return (
    <View className="flex-1 bg-white items-center justify-center gap-4">
      <Text className="text-brand text-xl font-bold">Historico de Senhas</Text>

      {error ? <Text className="text-red-600 text-[13px]">{error}</Text> : null}

      <ScrollView
        testID="history-list"
        className="w-[280px] max-h-[260px] border border-brand rounded-lg bg-white"
        contentContainerStyle={{ padding: 10, gap: 8 }}
      >
        {historyLoading ? (
          <Text className="text-brand-muted">Carregando...</Text>
        ) : history.length === 0 ? (
          <Text className="text-brand-muted">Nenhuma senha gerada ainda.</Text>
        ) : (
          history.map((item) => (
            <View key={item.id} className="flex-row items-center justify-between gap-2">
              <View className="flex-1">
                <Text className="p-2 rounded bg-brand-light text-brand-text">{item.password}</Text>
                {item.isLocal && (
                  <Text style={{ color: '#b45309', fontSize: 10, marginTop: 1 }}>local</Text>
                )}
              </View>
              <Pressable
                testID={`delete-item-${item.id}`}
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
        testID="back-button"
        className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
        onPress={() => navigate('/')}
      >
        <Text className="text-white text-center">Voltar</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}
