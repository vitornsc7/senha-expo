import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Clipboard from 'expo-clipboard';
import { generatePassword } from '../services/api';

export default function Gerador() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGerarSenha() {
    setError('');
    setLoading(true);
    try {
      const { password } = await generatePassword();
      setSenha(password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    if (senha) await Clipboard.setStringAsync(senha);
  }

  function handleSignout() {
    localStorage.removeItem('token');
    navigate('/signin');
  }

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <Image
          source={require('../assets/lock-icon.png')}
          style={styles.tinyLogo}
        />
        <Text style={{ color: '#5c9285', fontSize: 18, fontWeight: 600 }}>Gerador de Senha</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={{ gap: 6 }}>
        <Text style={styles.text}>{senha || '—'}</Text>

        <Pressable
          style={({ pressed, hovered }) => [
            styles.pressable,
            (pressed || hovered) && styles.pressableActive,
          ]}
          onPress={handleGerarSenha}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Gerando...' : 'Gerar senha'}</Text>
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
          onPress={() => navigate('/historico')}
          style={({ pressed, hovered }) => [
            styles.pressable,
            (pressed || hovered) && styles.pressableActive,
          ]}
        >
          <Text style={styles.buttonText}>Ver historico</Text>
        </Pressable>

        <Pressable
          onPress={handleSignout}
          style={({ pressed, hovered }) => [
            styles.pressableOutline,
            (pressed || hovered) && styles.pressableOutlineActive,
          ]}
        >
          <Text style={styles.buttonTextOutline}>Sair</Text>
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
  error: {
    color: '#c0392b',
    fontSize: 13,
  },
  pressableOutline: {
    borderWidth: 1,
    borderColor: '#5c9285',
    padding: 10,
    width: 180,
    borderRadius: 5,
  },
  pressableOutlineActive: {
    backgroundColor: '#eef5f3',
  },
  buttonTextOutline: {
    color: '#5c9285',
    textAlign: 'center',
  },
});
