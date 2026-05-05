import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@token';

export async function getToken() {
    try {
        return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export async function setToken(token) {
    try {
        await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch { }
}

export async function removeToken() {
    try {
        await AsyncStorage.removeItem(TOKEN_KEY);
    } catch { }
}
