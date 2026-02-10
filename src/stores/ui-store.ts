import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    isWatchlistPanelOpen: boolean;
    isDetailsPanelOpen: boolean;
    toggleWatchlistPanel: () => void;
    toggleDetailsPanel: () => void;
    isEquimindChatPanelOpen: boolean;
    isEquimindActivityPanelOpen: boolean;
    toggleEquimindChatPanel: () => void;
    toggleEquimindActivityPanel: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            isSidebarOpen: true,
            toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            setSidebarOpen: (open) => set({ isSidebarOpen: open }),
            isWatchlistPanelOpen: true,
            isDetailsPanelOpen: true,
            toggleWatchlistPanel: () => set((state) => ({ isWatchlistPanelOpen: !state.isWatchlistPanelOpen })),
            toggleDetailsPanel: () => set((state) => ({ isDetailsPanelOpen: !state.isDetailsPanelOpen })),
            isEquimindChatPanelOpen: true,
            isEquimindActivityPanelOpen: true,
            toggleEquimindChatPanel: () => set((state) => ({ isEquimindChatPanelOpen: !state.isEquimindChatPanelOpen })),
            toggleEquimindActivityPanel: () => set((state) => ({ isEquimindActivityPanelOpen: !state.isEquimindActivityPanelOpen })),
        }),
        {
            name: "ui-storage",
        }
    )
);
