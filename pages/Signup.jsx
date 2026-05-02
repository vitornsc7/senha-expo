import { Text, View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

export default function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignup() {
        setError('');
        setLoading(true);
        try {
            await signup(name, email, password, passwordConfirm);
            navigate('/signin');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-white items-center justify-center gap-4">
            <Text className="text-brand text-xl font-bold">Criar conta</Text>

            {error ? <Text className="text-red-600 text-[13px]">{error}</Text> : null}

            <View className="gap-2.5 w-[220px]">
                <TextInput
                    className="border border-brand rounded p-2.5 w-full"
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
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
                <TextInput
                    className="border border-brand rounded p-2.5 w-full"
                    placeholder="Confirmar senha"
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry
                />

                <Pressable
                    className="bg-brand active:bg-brand-dark hover:bg-brand-dark p-2.5 rounded"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text className="text-white text-center">{loading ? 'Criando...' : 'Criar conta'}</Text>
                </Pressable>

                <Pressable className="mt-1" onPress={() => navigate('/signin')}>
                    <Text className="text-brand text-center underline">Já tenho conta</Text>
                </Pressable>
            </View>
        </View>
    );
}
