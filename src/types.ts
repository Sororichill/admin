export type OrganizerStatus = "pending" | "approved" | "rejected";

export interface OrganizerProfile {
  display_name?: string;
  first_name?: string;
  last_name?: string;
}

export interface Organizer {
  id: string;
  name?: string;
  image_url?: string;
  created_at: string;
  stripe_account_id?: string;
  description?: string;
  rejection_reason?: string;
  profile?: OrganizerProfile;
}
