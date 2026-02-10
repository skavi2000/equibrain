import { OrderBookAlertResponse } from "@/types/notification-mgr";

const NOTIFICATION_MGR_BASE_URL =
  process.env.NEXT_PUBLIC_NOTIFICATION_MGR_API_URL || "";

type SymbolData = {
  symbol: string;
};

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit,
  base: string = NOTIFICATION_MGR_BASE_URL,
): Promise<T> {
  const url = `${base}${endpoint}`;
  console.log(`[EquiMindAPI] Requesting: ${url}`);

  // Add default headers
  const defaultHeaders: HeadersInit = {};
  // Only add JSON content type for methods that typically have a body
  if (
    options?.method &&
    options.method !== "GET" &&
    options.method !== "HEAD"
  ) {
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
        console.warn(
          "Could not read error JSON (likely CORS on error response)",
          e,
        );
      }
      console.error(`[EquiMindAPI] Error ${res.status}:`, errorData);
      throw new Error(
        (errorData as any).detail ||
          (errorData as any).message ||
          `API Error: ${res.status} ${res.statusText}`,
      );
    }

    return res.json();
  } catch (error) {
    console.error(`[EquiMindAPI] Fetch failed for ${url}`, error);
    throw error;
  }
}

export const NotificationMgrAPI = {
  fetchOrderBookAlertData: async (
    data: SymbolData,
  ): Promise<OrderBookAlertResponse> => {
    return fetchAPI<OrderBookAlertResponse>(
      `/api/orderbook-agent?symbol=${data.symbol}&limit=10`,
      {
        method: "GET",
      },
    );
  },
};
