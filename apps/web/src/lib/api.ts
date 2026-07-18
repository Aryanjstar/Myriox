import { getToken } from "@/lib/auth-client";

// Plan Service: owns plan CRUD + the persona catalog.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8010";
// Simulation Service: owns the live multi-agent run + WebSocket stream.
export const API_WS_URL = process.env.NEXT_PUBLIC_API_WS_URL ?? "ws://localhost:8020";

export interface GridCell {
  x: number;
  y: number;
  type: string;
  width_meters?: number | null;
  zone_id?: string | null;
}

export interface GridPlan {
  id: string;
  orgId: string;
  name: string;
  width_cells: number;
  height_cells: number;
  cell_size_meters: number;
  cells: GridCell[];
  entry_points: { x: number; y: number; label: string }[];
  exit_points: { x: number; y: number; label: string }[];
  createdAt: string;
  updatedAt: string;
  /** Compressed data URI of the reference image this plan was traced from, if any. */
  source_image_blob_url?: string | null;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  objective: string;
  mobility_profile: string;
  speed_factor: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed with ${res.status}`);
  }
  return res.json();
}

export const api = {
  listPlans: () => request<GridPlan[]>("/api/plans"),
  getPlan: (id: string) => request<GridPlan>(`/api/plans/${id}`),
  createPlan: (payload: Omit<GridPlan, "id" | "orgId" | "createdAt" | "updatedAt">) =>
    request<GridPlan>("/api/plans", { method: "POST", body: JSON.stringify(payload) }),
  listPersonas: () => request<Persona[]>("/api/personas"),
};
