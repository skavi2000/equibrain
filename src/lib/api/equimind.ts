import {
    ChatRequest,
    ChatResponse,
    ChatSession,
    ChatSessionDetails,
    CreateSessionRequest,
    Alert,
    CreateAlertRequest,
    Message
} from "@/types/equimind";

const API_Base_URL = process.env.NEXT_PUBLIC_API_URL || "https://equimind-chat-agent-api-1.onrender.com";

function getUserId(): string | null {
    if (typeof window === "undefined") return null;
    try {
        const stored = localStorage.getItem("equibrain_user");
        if (stored) {
            const user = JSON.parse(stored);
            return user.user_id?.toString() || null;
        }
    } catch { }
    return null;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_Base_URL}${endpoint}`;
    console.log(`[EquiMindAPI] Requesting: ${url}`);

    // Add default headers
    const defaultHeaders: HeadersInit = {};
    // Only add JSON content type for methods that typically have a body
    if (options?.method && options.method !== 'GET' && options.method !== 'HEAD') {
        defaultHeaders["Content-Type"] = "application/json";
    }

    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options?.headers,
            },
        });

        if (!res.ok) {
            // Try to read error body, but be safe if CORS blocks it
            let errorData = {};
            try {
                errorData = await res.json();
            } catch (e) {
                console.warn("Could not read error JSON (likely CORS on error response)", e);
            }
            console.error(`[EquiMindAPI] Error ${res.status}:`, errorData);
            throw new Error((errorData as any).detail || (errorData as any).message || `API Error: ${res.status} ${res.statusText}`);
        }

        return res.json();
    } catch (error) {
        console.error(`[EquiMindAPI] Fetch failed for ${url}`, error);
        throw error;
    }
}

export const EquiMindAPI = {
    // Chat
    sendMessage: async (data: ChatRequest) => {
        return fetchAPI<ChatResponse>("/api/v1/chat/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    streamChat: async (
        data: ChatRequest,
        onMessage: (event: any) => void,
        onError: (error: any) => void,
        onComplete: () => void
    ) => {
        const url = `${API_Base_URL}/api/v1/chat/stream`;
        console.log(`[EquiMindAPI] Streaming from: ${url}`);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error(`Stream failed: ${response.statusText}`);
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;

                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.trim() === "") continue;
                    if (line.startsWith("data: ")) {
                        const dataStr = line.slice(6);
                        if (dataStr === "[DONE]") {
                            onComplete();
                            return;
                        }
                        try {
                            const eventData = JSON.parse(dataStr);
                            onMessage(eventData);
                        } catch (e) {
                            console.error("Error parsing SSE data", e);
                        }
                    }
                }
            }
            onComplete();
        } catch (err) {
            onError(err);
        }
    },

    getSessionMessages: async (sessionId: string) => {
        // API might return array of messages directly instead of object
        const response = await fetchAPI<Message[] | { messages: Message[] }>(`/api/v1/chat/sessions/${encodeURIComponent(sessionId)}/messages`);
        if (Array.isArray(response)) {
            return { messages: response, id: sessionId } as ChatSessionDetails; // Mock session detail wrapper
        }
        return response as ChatSessionDetails;
    },

    // History
    listSessions: async (limit: number = 20, offset: number = 0) => {
        // Note: API guide says page/page_size, implementation plan suggests list.
        // Adjust logic if needed based on actual API response structure.
        // Assuming API follows standard pagination.
        const searchParams = new URLSearchParams({
            page: Math.floor(offset / limit + 1).toString(),
            page_size: limit.toString()
        });
        return fetchAPI<{ sessions: ChatSession[], total: number }>(`/api/v1/history/sessions?${searchParams}`);
    },

    createSession: async (data: CreateSessionRequest) => {
        return fetchAPI<ChatSession>("/api/v1/history/sessions", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getSession: async (sessionId: string) => {
        return fetchAPI<ChatSessionDetails>(`/api/v1/history/sessions/${encodeURIComponent(sessionId)}`);
    },

    updateSession: async (sessionId: string, title: string) => {
        return fetchAPI<ChatSession>(`/api/v1/history/sessions/${encodeURIComponent(sessionId)}`, {
            method: "PATCH",
            body: JSON.stringify({ title }),
        });
    },

    deleteSession: async (sessionId: string) => {
        return fetchAPI<{ message: string }>(`/api/v1/history/sessions/${encodeURIComponent(sessionId)}`, {
            method: "DELETE",
        });
    },

    archiveSession: async (sessionId: string) => {
        return fetchAPI<{ message: string }>(`/api/v1/history/sessions/${encodeURIComponent(sessionId)}/archive`, {
            method: "POST"
        });
    },

    // Alerts
    createAlert: async (data: CreateAlertRequest) => {
        return fetchAPI<Alert>("/api/v1/alerts/", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getPredefinedMetrics: async () => {
        return fetchAPI<any>("/api/v1/alerts/predefined-metrics");
    },

    getAlert: async (alertId: string) => {
        return fetchAPI<Alert>(`/api/v1/alerts/${alertId}`);
    }
};
