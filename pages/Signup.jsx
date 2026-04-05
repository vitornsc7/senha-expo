import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.title}>Criar conta</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar senha"
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    secureTextEntry
                />

                <Pressable
                    style={({ pressed, hovered }) => [
                        styles.pressable,
                        (pressed || hovered) && styles.pressableActive,
                    ]}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar conta'}</Text>
                </Pressable>

                <Pressable onPress={() => navigate('/signin')} style={styles.link}>
                    <Text style={styles.linkText}>Já tenho conta</Text>
                </Pressable>
            </View>
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
    title: {
        color: '#5c9285',
        fontSize: 20,
        fontWeight: '700',
    },
    form: {
        gap: 10,
        width: 220,
    },
    input: {
        borderWidth: 1,
        borderColor: '#5c9285',
        borderRadius: 5,
        padding: 10,
        width: '100%',
    },
    pressable: {
        backgroundColor: '#5c9285',
        padding: 10,
        borderRadius: 5,
    },
    pressableActive: {
        backgroundColor: '#4a7a6f',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    error: {
        color: '#c0392b',
        fontSize: 13,
    },
    link: {
        marginTop: 4,
    },
    linkText: {
        color: '#5c9285',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
