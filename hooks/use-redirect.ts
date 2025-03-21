import { create } from "zustand";


interface RedirectStore {
    hasRedirected: boolean;
    currentServerId: string | null;
}

export const useRedirect = create<RedirectStore>((set) =>({
    hasRedirected: false,
    currentServerId: null,
    setHasRedirected: (serverId: string) => set({hasRedirected: true, currentServerId: serverId})

}));