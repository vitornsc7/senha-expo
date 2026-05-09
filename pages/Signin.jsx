import { Text, View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function Signin() {
    const navigate = useNavigate();
    const signIn = useAuthStore((s) => s.signIn);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignin() {
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-white items-center justify-center gap-4">
            <Text className="text-brand text-xl font-bold">Entrar</Text>

            {error ? <Text className="text-red-600 text-[13px]">{error}</Text> : null}

            <View className="gap-2.5 w-[220px]">
                <TextInput
                    className="border border-brand rounded p-2.5 w-full"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    className="border border-brand rounded p-2.5 w-full"
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Pressable
                    className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 rounded"
                    onPress={handleSignin}
                    disabled={loading}
                >
                    <Text className="text-white text-center">{loading ? 'Entrando...' : 'Entrar'}</Text>
                </Pressable>

                <Pressable className="mt-1" onPress={() => navigate('/signup')}>
                    <Text className="text-brand text-center underline">Criar conta</Text>
                </Pressable>
            </View>
        </View>
    );
}
