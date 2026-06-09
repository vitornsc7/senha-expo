import { usePasswordStore } from '../../stores/usePasswordStore';
import { generatePassword, getHistory, deletePassword as apiDeletePassword } from '../../services/api';
import { getLocalPasswords, addLocalPassword, removeLocalPassword } from '../../services/cache';

jest.mock('../../services/api');
jest.mock('../../services/cache');

const initialState = {
    history: [],
    currentPassword: '',
    isCurrentLocal: false,
    historyLoading: false,
    generateLoading: false,
    error: '',
};

beforeEach(() => {
    usePasswordStore.setState(initialState);
    jest.clearAllMocks();
});

describe('usePasswordStore', () => {
    describe('generate', () => {
        it('gera senha localmente quando offline', async () => {
            addLocalPassword.mockResolvedValue(undefined);

            await usePasswordStore.getState().generate(false);

            const state = usePasswordStore.getState();
            expect(state.currentPassword).toHaveLength(12);
            expect(state.isCurrentLocal).toBe(true);
            expect(addLocalPassword).toHaveBeenCalledWith(state.currentPassword);
        });

        it('usa senha do servidor quando online e requisição tem sucesso', async () => {
            generatePassword.mockResolvedValue({ password: 'senha-do-servidor-123' });

            await usePasswordStore.getState().generate(true);

            const state = usePasswordStore.getState();
            expect(state.currentPassword).toBe('senha-do-servidor-123');
            expect(state.isCurrentLocal).toBe(false);
            expect(state.generateLoading).toBe(false);
        });

        it('fallback para senha local quando online mas servidor falha', async () => {
            generatePassword.mockRejectedValue(new Error('Network error'));
            addLocalPassword.mockResolvedValue(undefined);

            await usePasswordStore.getState().generate(true);

            const state = usePasswordStore.getState();
            expect(state.currentPassword).toHaveLength(12);
            expect(state.isCurrentLocal).toBe(true);
            expect(state.generateLoading).toBe(false);
            expect(addLocalPassword).toHaveBeenCalled();
        });

        it('seta generateLoading como true durante chamada ao servidor', async () => {
            let resolveFn;
            generatePassword.mockReturnValue(new Promise((resolve) => { resolveFn = resolve; }));

            const generatePromise = usePasswordStore.getState().generate(true);

            expect(usePasswordStore.getState().generateLoading).toBe(true);

            resolveFn({ password: 'senha-final' });
            await generatePromise;

            expect(usePasswordStore.getState().generateLoading).toBe(false);
        });

        it('limpa o error antes de gerar nova senha', async () => {
            usePasswordStore.setState({ error: 'Erro anterior' });
            generatePassword.mockResolvedValue({ password: 'nova-senha' });

            await usePasswordStore.getState().generate(true);

            expect(usePasswordStore.getState().error).toBe('');
        });
    });

    describe('loadHistory', () => {
        it('carrega histórico do servidor quando online', async () => {
            const mockHistory = [{ id: 1, password: 'abc' }, { id: 2, password: 'def' }];
            getHistory.mockResolvedValue({ history: mockHistory });

            await usePasswordStore.getState().loadHistory(true);

            const state = usePasswordStore.getState();
            expect(state.history).toEqual(mockHistory);
            expect(state.historyLoading).toBe(false);
        });

        it('carrega histórico local quando offline', async () => {
            const localPasswords = [{ id: 'local-1', password: 'xyz', isLocal: true }];
            getLocalPasswords.mockResolvedValue(localPasswords);

            await usePasswordStore.getState().loadHistory(false);

            const state = usePasswordStore.getState();
            expect(state.history).toEqual(localPasswords);
            expect(state.historyLoading).toBe(false);
        });
    });

    describe('deleteItem', () => {
        it('remove item local do histórico', async () => {
            const localItem = { id: 'local-1', password: 'abc', isLocal: true };
            usePasswordStore.setState({ history: [localItem] });
            removeLocalPassword.mockResolvedValue(undefined);

            await usePasswordStore.getState().deleteItem(localItem, false);

            expect(usePasswordStore.getState().history).toHaveLength(0);
            expect(removeLocalPassword).toHaveBeenCalledWith('local-1');
        });

        it('remove item do servidor quando online', async () => {
            const serverItem = { id: 10, password: 'xyz', isLocal: false };
            usePasswordStore.setState({ history: [serverItem] });
            apiDeletePassword.mockResolvedValue(undefined);

            await usePasswordStore.getState().deleteItem(serverItem, true);

            expect(usePasswordStore.getState().history).toHaveLength(0);
            expect(apiDeletePassword).toHaveBeenCalledWith(10);
        });

        it('exibe erro ao tentar deletar item do servidor sem conexão', async () => {
            const serverItem = { id: 5, password: 'abc', isLocal: false };
            usePasswordStore.setState({ history: [serverItem] });

            await usePasswordStore.getState().deleteItem(serverItem, false);

            expect(usePasswordStore.getState().error).toBeTruthy();
            expect(usePasswordStore.getState().history).toHaveLength(1);
        });
    });
});
