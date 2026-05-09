import { create } from 'zustand';
import {
    generatePassword,
    getHistory,
    deletePassword as apiDeletePassword,
    syncPasswords,
} from '../services/api';
import {
    getLocalPasswords,
    addLocalPassword,
    removeLocalPassword,
    clearLocalPasswords,
} from '../services/cache';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

function gerarSenhaLocal() {
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return password;
}

export const usePasswordStore = create((set, get) => ({
    history: [],
    currentPassword: '',
    isCurrentLocal: false,
    historyLoading: false,
    generateLoading: false,
    error: '',

    generate: async (isOnline) => {
        set({ error: '' });

        if (!isOnline) {
            // Offline: gera localmente de forma instantânea
            const password = gerarSenhaLocal();
            set({ currentPassword: password, isCurrentLocal: true });
            await addLocalPassword(password);
            return;
        }

        // Online: mostra senha local imediatamente (optimistic) e troca pela do servidor em background
        const optimistic = gerarSenhaLocal();
        set({ currentPassword: optimistic, isCurrentLocal: false, generateLoading: true });

        try {
            const { password } = await generatePassword();
            set({ currentPassword: password, isCurrentLocal: false, generateLoading: false });
        } catch {
            // Servidor falhou — mantém a senha local e salva
            await addLocalPassword(optimistic);
            set({ isCurrentLocal: true, generateLoading: false });
        }
    },

    loadHistory: async (isOnline) => {
        set({ historyLoading: true, error: '' });
        if (isOnline) {
            try {
                const { history } = await getHistory();
                set({ history, historyLoading: false });
            } catch {
                set({ historyLoading: false });
            }
        } else {
            const local = await getLocalPasswords();
            set({ history: local, historyLoading: false });
        }
    },

    deleteItem: async (item, isOnline) => {
        set({ error: '' });

        if (!isOnline && !item.isLocal) {
            set({ error: 'Sem conexão. Não é possível excluir senhas do servidor agora.' });
            return;
        }

        // Optimistic: remove da lista imediatamente
        set((state) => ({ history: state.history.filter((p) => p.id !== item.id) }));

        try {
            if (item.isLocal) {
                await removeLocalPassword(item.id);
            } else {
                await apiDeletePassword(item.id);
            }
        } catch (err) {
            // Rollback em caso de erro
            set((state) => ({ history: [item, ...state.history], error: err.message }));
        }
    },

    syncPending: async () => {
        const local = await getLocalPasswords();
        if (local.length === 0) return;
        try {
            await syncPasswords(local.map((p) => p.password));
            await clearLocalPasswords();
            // Atualiza o histórico buscando do servidor com as senhas recém sincronizadas
            await get().loadHistory(true);
        } catch { }
    },
}));
