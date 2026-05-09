import { create } from 'zustand';
import { getToken, setToken, removeToken } from '../services/tokenStorage';
import { signin as apiSignin } from '../services/api';

export const useAuthStore = create((set) => ({
    token: null,
    isAuthenticated: false,
    isInitialized: false,

    initialize: async () => {
        const token = await getToken();
        set({ token, isAuthenticated: !!token, isInitialized: true });
    },

    signIn: async (email, password) => {
        const { token } = await apiSignin(email, password);
        await setToken(token);
        set({ token, isAuthenticated: true });
    },

    signOut: async () => {
        await removeToken();
        set({ token: null, isAuthenticated: false });
    },
}));
