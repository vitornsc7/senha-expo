/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react-native';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

describe('useNetworkStatus', () => {
    it('retorna true quando navigator.onLine é true', () => {
        Object.defineProperty(global, 'navigator', {
            value: { onLine: true },
            configurable: true,
            writable: true,
        });

        const { result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe(true);
    });

    it('retorna false quando navigator.onLine é false', () => {
        Object.defineProperty(global, 'navigator', {
            value: { onLine: false },
            configurable: true,
            writable: true,
        });

        const { result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe(false);
    });

    it('retorna um valor booleano', () => {
        const { result } = renderHook(() => useNetworkStatus());
        expect(typeof result.current).toBe('boolean');
    });

    it('atualiza para true ao receber evento online', () => {
        Object.defineProperty(global, 'navigator', {
            value: { onLine: false },
            configurable: true,
            writable: true,
        });

        const { result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe(false);

        act(() => {
            window.dispatchEvent(new Event('online'));
        });

        expect(result.current).toBe(true);
    });

    it('atualiza para false ao receber evento offline', () => {
        Object.defineProperty(global, 'navigator', {
            value: { onLine: true },
            configurable: true,
            writable: true,
        });

        const { result } = renderHook(() => useNetworkStatus());
        expect(result.current).toBe(true);

        act(() => {
            window.dispatchEvent(new Event('offline'));
        });

        expect(result.current).toBe(false);
    });
});
