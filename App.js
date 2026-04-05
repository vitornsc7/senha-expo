import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'password_history_v1';

export default function App() {
  const pasword = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const [senha, setSenha] = useState("ALMXOA1");
  const [historico, setHistorico] = useState([]);
  const [pagina, setPagina] = useState('gerador');

  useEffect(() => {
    async function carregarHistorico() {
      try {
        const historicoSalvo = await AsyncStorage.getItem(STORAGE_KEY);
        if (historicoSalvo) {
          setHistorico(JSON.parse(historicoSalvo));
        }
      } catch (error) {
        console.log('Erro ao carregar historico:', error);
      }
    }

    carregarHistorico();
  }, []);

  async function salvarHistorico(novoHistorico) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novoHistorico));
    } catch (error) {
      console.log('Erro ao salvar historico:', error);
    }
  }

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(senha);
  };

  async function gerarSenha() {
    let novaSenha = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * pasword.length);
      novaSenha += pasword[randomIndex];
    }

    setSenha(novaSenha);

    const novoHistorico = [novaSenha, ...historico];
    setHistorico(novoHistorico);
    await salvarHistorico(novoHistorico);
  }

  async function limparHistorico() {
    setHistorico([]);
    await salvarHistorico([]);
  }

  if (pagina === 'historico') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Historico de Senhas</Text>

        <ScrollView style={styles.historyBox} contentContainerStyle={styles.historyContent}>
          {historico.length === 0 ? (
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
          onPress={limparHistorico}
        >
          <Text style={styles.buttonText}>Limpar historico</Text>
        </Pressable>

        <Pressable
          style={({ pressed, hovered }) => [
            styles.pressable,
            (pressed || hovered) && styles.pressableActive,
          ]}
          onPress={() => setPagina('gerador')}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>

        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Image
          source={require('./assets/lock-icon.png')}
          style={styles.tinyLogo}
        />
        <Text style={{ color: '#5c9285', fontSize: 18, fontWeight: 600 }}>Gerador de Senha</Text>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={styles.text}>{senha}</Text>

        <Pressable
          style={({ pressed, hovered }) => [
            styles.pressable,
            (pressed || hovered) && styles.pressableActive,
          ]}
          onPress={gerarSenha}
        >
          <Text style={styles.buttonText}>Gerar senha</Text>
        </Pressable>

        <Pressable
          onPress={copyToClipboard}
          style={({ pressed, hovered }) => [
            styles.pressable,
            (pressed || hovered) && styles.pressableActive,
          ]}
        >
          <Text style={styles.buttonText}>Copiar</Text>
        </Pressable>

        <Pressable
          onPress={() => setPagina('historico')}
          style={({ pressed, hovered }) => [
            styles.pressable,
            (pressed || hovered) && styles.pressableActive,
          ]}
        >
          <Text style={styles.buttonText}>Ver historico</Text>
        </Pressable>
      </View>

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
  text: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#5c9285',
  },
  tinyLogo: {
    width: 24,
    height: 24,
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
