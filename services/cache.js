import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    LOCAL_PASSWORDS: '@local_passwords',
};

export async function getLocalPasswords() {
    try {
        const raw = await AsyncStorage.getItem(KEYS.LOCAL_PASSWORDS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function addLocalPassword(password) {
    try {
        const list = await getLocalPasswords();
        const item = { id: `local_${Date.now()}`, password, isLocal: true };
        const updated = [item, ...list];
        await AsyncStorage.setItem(KEYS.LOCAL_PASSWORDS, JSON.stringify(updated));
        return item;
    } catch {
        return null;
    }
}

export async function removeLocalPassword(id) {
    try {
        const list = await getLocalPasswords();
        const updated = list.filter((p) => p.id !== id);
        await AsyncStorage.setItem(KEYS.LOCAL_PASSWORDS, JSON.stringify(updated));
    } catch { }
}

export async function clearLocalPasswords() {
    try {
        await AsyncStorage.removeItem(KEYS.LOCAL_PASSWORDS);
    } catch { }
}
