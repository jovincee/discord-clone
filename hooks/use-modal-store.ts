/**
 * This hook is used to control all models' states.
 * In this case, create a store for editing, and creating server where 
 * states are managed here using the Zustand library
 */

import { ChannelType, Server, Channel} from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createServer" | "editServer" | "invite" | "members" | "createChannel" | "deleteChannel" | "editChannel" |
"leaveServer" | "deleteServer";

/**
 * Create a zustand store for modal; creating server, editing server, invite people,
 */
interface ModalData {
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    
}

interface ModalStore {
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data}),
    onClose: () => set({ type: null, isOpen: false})
}));