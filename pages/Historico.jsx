import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, clearHistory } from '../services/api';

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

  async function handleLimpar() {
    try {
      await clearHistory();
      setHistorico([]);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historico de Senhas</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView style={styles.historyBox} contentContainerStyle={styles.historyContent}>
        {loading ? (
          <Text style={styles.emptyText}>Carregando...</Text>
        ) : historico.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma senha gerada ainda.</Text>
        ) : (
          historico.map((item, index) => (
            <Text key={`${item}-${index}`} style={styles.historyItem}>{item}</Text>
          ))
        )}
      </ScrollView>

      <Pressable
        style={({ pressed, hovered }) => [
          styles.pressable,
          (pressed || hovered) && styles.pressableActive,
        ]}
        onPress={handleLimpar}
      >
        <Text style={styles.buttonText}>Limpar historico</Text>
      </Pressable>

      <Pressable
        style={({ pressed, hovered }) => [
          styles.pressable,
          (pressed || hovered) && styles.pressableActive,
        ]}
        onPress={() => navigate('/')}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    backgroundColor: '#5c9285',
    padding: 10,
    width: 180,
    borderRadius: 5,
  },
  pressableActive: {
    backgroundColor: '#4a7a6f',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  title: {
    color: '#5c9285',
    fontSize: 20,
    fontWeight: '700',
  },
  historyBox: {
    width: 280,
    maxHeight: 260,
    borderWidth: 1,
    borderColor: '#5c9285',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  historyContent: {
    padding: 10,
    gap: 8,
  },
  historyItem: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#eef5f3',
    color: '#274740',
  },
  emptyText: {
    color: '#6d7f79',
  },
});
