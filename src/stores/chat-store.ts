import { create } from "zustand";
import {
    ChatSession,
    Message,
    ActivityFeedItem,
    ChatRequest,
    CreateSessionRequest
} from "@/types/equimind";
import { EquiMindAPI } from "@/lib/api/equimind";
import { toast } from "sonner"; // Assuming sonner is used for notifications based on package.json

interface ChatState {
    // State
    sessions: ChatSession[];
    currentSessionId: string | null;
    messages: Message[];
    activityFeed: ActivityFeedItem[];
    isLoading: boolean;
    isStreaming: boolean;
    alerts: any[]; // Placeholder for alerts

    // Actions
    loadSessions: () => Promise<void>;
    createSession: (title?: string) => Promise<string>;
    selectSession: (sessionId: string) => Promise<void>;
    sendMessage: (content: string, options?: Partial<ChatRequest>) => Promise<void>;
    resetState: () => void;
    deleteSession: (sessionId: string) => Promise<void>;
    archiveSession: (sessionId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
    sessions: [],
    currentSessionId: null,
    messages: [],
    activityFeed: [],
    isLoading: false,
    isStreaming: false,
    alerts: [],

    loadSessions: async () => {
        try {
            const data = await EquiMindAPI.listSessions();
            set({ sessions: data.sessions || [] });
        } catch (error) {
            console.error("Failed to load sessions", error);
            toast.error("Failed to load history");
        }
    },

    createSession: async (title?: string) => {
        try {
            set({ isLoading: true });
            const session = await EquiMindAPI.createSession({ title: title || "New Chat" });
            set((state) => ({
                sessions: [session, ...state.sessions],
                currentSessionId: session.id,
                messages: [],
                activityFeed: [],
                isLoading: false
            }));
            return session.id;
        } catch (error) {
            set({ isLoading: false });
            console.error("Failed to create session", error);
            toast.error("Failed to create new session");
            throw error;
        }
    },

    selectSession: async (sessionId: string) => {
        if (!sessionId) {
            console.error("selectSession called with null/undefined sessionId");
            return;
        }
        try {
            set({ currentSessionId: sessionId, isLoading: true, messages: [], activityFeed: [] });

            // Try getting session details first
            try {
                const sessionDetails = await EquiMindAPI.getSession(sessionId);
                set({
                    messages: sessionDetails.messages || [],
                    isLoading: false
                });
            } catch (err) {
                console.warn("getSession failed, trying getSessionMessages", err);
                // Fallback: try getting just messages if full session details fail (e.g. 500 error on session endpoint)
                // This covers cases where the session exists but the detail endpoint is buggy
                const messagesData = await EquiMindAPI.getSessionMessages(sessionId);
                // getSessionMessages returns { messages: [] } or just []? Types say ChatSessionDetails but endpoint name implies otherwise.
                // Let's assume it returns ChatSessionDetails structure based on our type definition, or adjust if needed.
                // Actually our type for getSessionMessages return is ChatSessionDetails.
                set({
                    messages: messagesData.messages || [],
                    isLoading: false
                });
            }

        } catch (error) {
            set({ isLoading: false });
            console.error("Failed to load session", error);
            // Show more specific error to user
            const msg = error instanceof Error ? error.message : "Server error";
            toast.error(`Failed to load chat: ${msg}`);
        }
    },

    deleteSession: async (sessionId: string) => {
        try {
            await EquiMindAPI.deleteSession(sessionId);
            set((state) => ({
                sessions: state.sessions.filter(s => s.id !== sessionId),
                currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
                messages: state.currentSessionId === sessionId ? [] : state.messages
            }));
            toast.success("Session deleted");
        } catch (error) {
            console.error("Failed to delete session", error);
            toast.error("Failed to delete session");
        }
    },

    archiveSession: async (sessionId: string) => {
        try {
            await EquiMindAPI.archiveSession(sessionId);
            // Maybe assume archiving hides it from the list or marks it inactive
            // Re-fetch sessions to update list
            await get().loadSessions();
            toast.success("Session archived");
        } catch (error) {
            console.error("Failed to archive session", error);
            toast.error("Failed to archive session");
        }
    },

    sendMessage: async (content: string, options?: Partial<ChatRequest>) => {
        const { currentSessionId, messages } = get();
        let sessionId = currentSessionId;

        // Optimistic User Message
        const tempUserMessage: Message = {
            id: Date.now().toString(),
            session_id: sessionId || "temp",
            role: "user",
            content,
            timestamp: new Date().toISOString(),
        };

        set({
            messages: [...messages, tempUserMessage],
            isStreaming: true,
            activityFeed: [] // Clear activity feed for new turnaround
        });

        try {
            const requestData: ChatRequest = {
                message: content,
                session_id: sessionId,
                context_mode: "internal_only", // Default
                reasoning_mode: "deep", // Default as per UI?
                ...options
            };

            await EquiMindAPI.streamChat(
                requestData,
                (event) => {
                    if (event.type === 'activity') {
                        set((state) => ({
                            activityFeed: [...state.activityFeed, event.data]
                        }));
                    } else if (event.type === 'response') {
                        // Final response
                        const responseData = event.data;

                        // Update session ID if it was new
                        if (!sessionId) {
                            sessionId = responseData.session_id;
                            set({ currentSessionId: sessionId });
                            // Refresh session list to show new session
                            get().loadSessions();
                        }

                        // Replace temp user message with real one if needed, or just append assistant response
                        // Actually, the API returns the assistant message.
                        set((state) => {
                            // Ensure we don't duplicate if we were handling partials (but we aren't here yet)
                            return {
                                messages: [...state.messages, responseData.message],
                                isStreaming: false
                            };
                        });
                    } else if (event.type === 'error') {
                        toast.error(event.message || "Error during generation");
                        set({ isStreaming: false });
                    }
                },
                (error) => {
                    console.error("Stream error", error);
                    set({ isStreaming: false });
                    toast.error("Connection interrupted");
                },
                () => {
                    set({ isStreaming: false });
                }
            );

        } catch (error) {
            console.error("Send message error", error);
            set({ isStreaming: false });
            toast.error("Failed to send message");
        }
    },

    resetState: () => {
        set({
            currentSessionId: null,
            messages: [],
            activityFeed: [],
            isLoading: false,
            isStreaming: false
        });
    }

}));
