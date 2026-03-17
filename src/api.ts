import { ENV_CONFIG, type EnvKey } from "./config";
import type { Organizer, OrganizerStatus } from "./types";

export async function apiFetch(
  method: string,
  env: EnvKey,
  secret: string,
  params = "",
  body?: Record<string, unknown>
): Promise<Response> {
  const opts: RequestInit = {
    method,
    headers: {
      "X-Admin-Secret": secret,
      "Content-Type": "application/json",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(ENV_CONFIG[env].url + params, opts);
}

export async function loadOrganizers(
  env: EnvKey,
  secret: string,
  status: OrganizerStatus
): Promise<Organizer[]> {
  const res = await apiFetch("GET", env, secret, `?status=${status}`);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to load organizers");
  }
  return data.organizers ?? [];
}

export async function approveOrganizer(
  env: EnvKey,
  secret: string,
  organizerId: string
): Promise<void> {
  const res = await apiFetch("POST", env, secret, "", {
    organizer_id: organizerId,
    action: "approve",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Approval failed");
}

export async function rejectOrganizer(
  env: EnvKey,
  secret: string,
  organizerId: string,
  reason: string
): Promise<void> {
  const res = await apiFetch("POST", env, secret, "", {
    organizer_id: organizerId,
    action: "reject",
    reason,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Rejection failed");
}
