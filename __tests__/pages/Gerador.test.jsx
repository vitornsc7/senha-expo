import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import Gerador from '../../pages/Gerador';

const mockNavigate = jest.fn();
const mockGenerate = jest.fn();
const mockSignOut = jest.fn();

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('expo-clipboard', () => ({
    setStringAsync: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
    StatusBar: () => null,
}));

jest.mock('../../hooks/useNetworkStatus', () => ({
    useNetworkStatus: () => true,
}));

jest.mock('../../stores/usePasswordStore', () => ({
    usePasswordStore: jest.fn(),
}));

jest.mock('../../stores/useAuthStore', () => ({
    useAuthStore: jest.fn(),
}));

const { usePasswordStore } = require('../../stores/usePasswordStore');
const { useAuthStore } = require('../../stores/useAuthStore');
const Clipboard = require('expo-clipboard');

const defaultPasswordStore = {
    currentPassword: '',
    isCurrentLocal: false,
    generateLoading: false,
    error: '',
    generate: mockGenerate,
};

beforeEach(() => {
    jest.clearAllMocks();
    usePasswordStore.mockReturnValue(defaultPasswordStore);
    useAuthStore.mockImplementation((selector) => selector({ signOut: mockSignOut }));
});

describe('Gerador', () => {
    it('renderiza os botões corretamente', () => {
        render(<Gerador />);

        expect(screen.getByText('Gerar senha')).toBeTruthy();
        expect(screen.getByText('Copiar')).toBeTruthy();
        expect(screen.getByText('Ver historico')).toBeTruthy();
        expect(screen.getByText('Sair')).toBeTruthy();
    });

    it('exibe "—" quando não há senha gerada', () => {
        render(<Gerador />);

        expect(screen.getByText('—')).toBeTruthy();
    });

    it('exibe a senha atual quando ela está definida', () => {
        usePasswordStore.mockReturnValue({
            ...defaultPasswordStore,
            currentPassword: 'Abc123!@#XyZ',
        });

        render(<Gerador />);

        expect(screen.getByText('Abc123!@#XyZ')).toBeTruthy();
    });

    it('chama generate ao pressionar "Gerar senha"', () => {
        mockGenerate.mockResolvedValue(undefined);
        render(<Gerador />);

        fireEvent.press(screen.getByText('Gerar senha'));

        expect(mockGenerate).toHaveBeenCalledWith(true);
    });

    it('exibe "Gerando..." quando generateLoading é true', () => {
        usePasswordStore.mockReturnValue({
            ...defaultPasswordStore,
            generateLoading: true,
        });

        render(<Gerador />);

        expect(screen.getByText('Gerando...')).toBeTruthy();
        expect(screen.queryByText('Gerar senha')).toBeNull();
    });

    it('exibe mensagem de erro quando error está definido', () => {
        usePasswordStore.mockReturnValue({
            ...defaultPasswordStore,
            error: 'Erro ao gerar senha',
        });

        render(<Gerador />);

        expect(screen.getByText('Erro ao gerar senha')).toBeTruthy();
    });

    it('não exibe mensagem de erro quando error está vazio', () => {
        render(<Gerador />);

        expect(screen.queryByText(/erro/i)).toBeNull();
    });

    it('navega para /historico ao pressionar "Ver historico"', () => {
        render(<Gerador />);

        fireEvent.press(screen.getByText('Ver historico'));

        expect(mockNavigate).toHaveBeenCalledWith('/historico');
    });

    it('chama signOut e navega para /signin ao pressionar "Sair"', async () => {
        mockSignOut.mockResolvedValue(undefined);
        render(<Gerador />);

        fireEvent.press(screen.getByText('Sair'));

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/signin');
        });
    });

    it('copia a senha para o clipboard ao pressionar "Copiar"', async () => {
        Clipboard.setStringAsync.mockResolvedValue(undefined);
        usePasswordStore.mockReturnValue({
            ...defaultPasswordStore,
            currentPassword: 'minha-senha-segura',
        });

        render(<Gerador />);
        fireEvent.press(screen.getByText('Copiar'));

        await waitFor(() => {
            expect(Clipboard.setStringAsync).toHaveBeenCalledWith('minha-senha-segura');
        });
    });

    it('não copia para o clipboard quando não há senha', async () => {
        render(<Gerador />);
        fireEvent.press(screen.getByText('Copiar'));

        await waitFor(() => {
            expect(Clipboard.setStringAsync).not.toHaveBeenCalled();
        });
    });
});
