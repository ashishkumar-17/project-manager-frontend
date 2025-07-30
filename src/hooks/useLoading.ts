import { create } from 'zustand';

interface LoadingState {
    isLoading: boolean;
    loadingMessage: string;
    setLoading: (loading: boolean, message?: string) => void;
    withLoading: <T>(promise: Promise<T>, message?: string) => Promise<T>;
}

export const useLoading = create<LoadingState>((set, get) => ({
    isLoading: false,
    loadingMessage: 'Loading...',

    setLoading: (loading: boolean, message = 'Loading...') => {
        set({ isLoading: loading, loadingMessage: message });
    },

    withLoading: async <T>(promise: Promise<T>, message = 'Loading...'): Promise<T> => {
        const { setLoading } = get();

        try {
            setLoading(true, message);
            const result = await promise;
            return result;
        } finally {
            setLoading(false);
        }
    }
}));