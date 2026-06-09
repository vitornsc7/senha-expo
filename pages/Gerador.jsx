import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Pressable } from 'react-native';
import { useNavigate } from 'react-router-dom';
import * as Clipboard from 'expo-clipboard';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { usePasswordStore } from '../stores/usePasswordStore';
import { useAuthStore } from '../stores/useAuthStore';

export default function Gerador() {
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  const { currentPassword, isCurrentLocal, generateLoading, error, generate } = usePasswordStore();
  const signOut = useAuthStore((s) => s.signOut);

  async function handleGerarSenha() {
    await generate(isOnline);
  }

  async function copyToClipboard() {
    if (currentPassword) await Clipboard.setStringAsync(currentPassword);
  }

  async function handleSignout() {
    await signOut();
    navigate('/signin');
  }

  return (
    <View className="flex-1 bg-white items-center justify-center gap-4">
      <View className="flex-row items-center justify-center gap-1.5">
        <Image
          source={require('../assets/lock-icon.png')}
          className="w-6 h-6"
          style={{ width: 24, height: 24 }}
        />
        <Text className="text-brand text-lg font-semibold">Gerador de Senha</Text>
      </View>

      {error ? <Text className="text-red-600 text-[13px]">{error}</Text> : null}

      <View className="gap-1.5">
        <View>
          <Text testID="current-password" className="w-[180px] bg-white rounded border border-brand p-2.5">{currentPassword || '—'}</Text>
        </View>

        <Pressable
          testID="generate-button"
          className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
          onPress={handleGerarSenha}
          disabled={generateLoading}
        >
          <Text className="text-white text-center">{generateLoading ? 'Gerando...' : 'Gerar senha'}</Text>
        </Pressable>

        <Pressable
          testID="copy-button"
          className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
          onPress={copyToClipboard}
        >
          <Text className="text-white text-center">Copiar</Text>
        </Pressable>

        <Pressable
          testID="history-button"
          className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 w-[180px] rounded"
          onPress={() => navigate('/historico')}
        >
          <Text className="text-white text-center">Ver historico</Text>
        </Pressable>

        <Pressable
          testID="signout-button"
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
