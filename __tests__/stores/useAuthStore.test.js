import { useAuthStore } from '../../stores/useAuthStore';
import { getToken, setToken, removeToken } from '../../services/tokenStorage';
import { signin as apiSignin } from '../../services/api';

jest.mock('../../services/tokenStorage');
jest.mock('../../services/api');

const initialState = {
    token: null,
    isAuthenticated: false,
    isInitialized: false,
};

beforeEach(() => {
    useAuthStore.setState(initialState);
    jest.clearAllMocks();
});

describe('useAuthStore', () => {
    describe('initialize', () => {
        it('autentica quando token existe no storage', async () => {
            getToken.mockResolvedValue('token-armazenado');

            await useAuthStore.getState().initialize();

            const state = useAuthStore.getState();
            expect(state.token).toBe('token-armazenado');
            expect(state.isAuthenticated).toBe(true);
            expect(state.isInitialized).toBe(true);
        });

        it('não autentica quando não há token no storage', async () => {
            getToken.mockResolvedValue(null);

            await useAuthStore.getState().initialize();

            const state = useAuthStore.getState();
            expect(state.token).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isInitialized).toBe(true);
        });
    });

    describe('signIn', () => {
        it('armazena token e seta isAuthenticated no sucesso', async () => {
            apiSignin.mockResolvedValue({ token: 'novo-token' });
            setToken.mockResolvedValue(undefined);

            await useAuthStore.getState().signIn('usuario@email.com', 'senha123');

            const state = useAuthStore.getState();
            expect(state.token).toBe('novo-token');
            expect(state.isAuthenticated).toBe(true);
            expect(setToken).toHaveBeenCalledWith('novo-token');
        });

        it('propaga erro quando a API retorna falha', async () => {
            apiSignin.mockRejectedValue(new Error('Credenciais inválidas'));

            await expect(
                useAuthStore.getState().signIn('errado@email.com', 'senha-errada')
            ).rejects.toThrow('Credenciais inválidas');
        });
    });

    describe('signOut', () => {
        it('limpa o token e seta isAuthenticated como false', async () => {
            useAuthStore.setState({ token: 'algum-token', isAuthenticated: true });
            removeToken.mockResolvedValue(undefined);

            await useAuthStore.getState().signOut();

            const state = useAuthStore.getState();
            expect(state.token).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(removeToken).toHaveBeenCalled();
        });
    });
});
