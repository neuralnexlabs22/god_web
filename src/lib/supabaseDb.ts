// Supabase REST client for persistent database operations
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xruuhhtxnhtaqzdyzimf.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

function getHeaders(useServiceRole = true) {
  const key = useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function supabaseQuery<T = any>(
  table: string,
  options: {
    query?: string;
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: any;
    useServiceRole?: boolean;
    prefer?: string;
  } = {}
): Promise<{ data: T | null; error: string | null; count?: number | null }> {
  try {
    const { query = "", method = "GET", body, useServiceRole = true, prefer } = options;
    const url = `${SUPABASE_URL}/rest/v1/${table}${query ? `?${query}` : ""}`;

    const headers: Record<string, string> = getHeaders(useServiceRole);
    if (prefer) {
      headers["Prefer"] = prefer;
    } else if (method === "POST" || method === "PATCH") {
      headers["Prefer"] = "return=representation";
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!response.ok) {
      const errText = await response.text();
      return { data: null, error: `Supabase error (${response.status}): ${errText}` };
    }

    const contentRange = response.headers.get("content-range");
    let count: number | null = null;
    if (contentRange && contentRange.includes("/")) {
      const total = contentRange.split("/")[1];
      if (total && total !== "*") {
        count = parseInt(total, 10);
      }
    }

    if (response.status === 204) {
      return { data: null, error: null, count };
    }

    const data = await response.json().catch(() => null);
    return { data, error: null, count };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { data: null, error: message };
  }
}
