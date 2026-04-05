import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from '../services/api';

export default function Signin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSignin() {
        setError('');
        setLoading(true);
        try {
            const { token } = await signin(email, password);
            localStorage.setItem('token', token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrar</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.form}>
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

                <Pressable
                    style={({ pressed, hovered }) => [
                        styles.pressable,
                        (pressed || hovered) && styles.pressableActive,
                    ]}
                    onPress={handleSignin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
                </Pressable>

                <Pressable onPress={() => navigate('/signup')} style={styles.link}>
                    <Text style={styles.linkText}>Criar conta</Text>
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
