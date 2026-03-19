import { API_URL } from "./config";
import type { Organizer, OrganizerStatus } from "./types";

export async function apiFetch(
  method: string,
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
  return fetch(API_URL + params, opts);
}

export async function loadOrganizers(
  secret: string,
  status: OrganizerStatus
): Promise<Organizer[]> {
  const res = await apiFetch("GET", secret, `?status=${status}`);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to load organizers");
  }
  return data.organizers ?? [];
}

export async function approveOrganizer(
  secret: string,
  organizerId: string
): Promise<void> {
  const res = await apiFetch("POST", secret, "", {
    organizer_id: organizerId,
    action: "approve",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Approval failed");
}

export async function rejectOrganizer(
  secret: string,
  organizerId: string,
  reason: string
): Promise<void> {
  const res = await apiFetch("POST", secret, "", {
    organizer_id: organizerId,
    action: "reject",
    reason,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Rejection failed");
}
