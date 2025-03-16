/**
 * This hook is used to control all models' states.
 * In this case, create a store for editing, and creating server where 
 * states are managed here using the Zustand library
 */

import { create } from "zustand";

export type ModalType = "createServer";

/**
 * Create a zustand store for modal; creating server, editing server etc.
 */
interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    onOpen: (type: ModalType) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ isOpen: true, type}),
    onClose: () => set({ type: null, isOpen: false})
}));