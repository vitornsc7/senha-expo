import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
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
    <View className="flex-1 bg-white items-center justify-center gap-4">
      <View className="flex-row items-center justify-center gap-1.5">
        <Image
          source={require('../assets/lock-icon.png')}
          className="w-6 h-6"
        />
        <Text className="text-brand text-lg font-semibold">Gerador de Senha</Text>
      </View>

      {error ? <Text className="text-red-600 text-[13px]">{error}</Text> : null}

      <View className="gap-1.5">
        <Text className="w-[180px] bg-white rounded border border-brand p-2.5">{senha || '—'}</Text>

        <Pressable
          className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
          onPress={handleGerarSenha}
          disabled={loading}
        >
          <Text className="text-white text-center">{loading ? 'Gerando...' : 'Gerar senha'}</Text>
        </Pressable>

        <Pressable
          className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
          onPress={copyToClipboard}
        >
          <Text className="text-white text-center">Copiar</Text>
        </Pressable>

        <Pressable
          className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
          onPress={() => navigate('/historico')}
        >
          <Text className="text-white text-center">Ver historico</Text>
        </Pressable>

        <Pressable
          className="border border-brand active:bg-brand-light hover:bg-brand-light p-2.5 w-[180px] rounded"
          onPress={handleSignout}
        >
          <Text className="text-brand text-center">Sair</Text>
        </Pressable>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}
