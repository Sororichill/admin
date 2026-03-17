import { useState } from "react";
import type { Organizer, OrganizerStatus } from "../types";

interface OrganizerCardProps {
  organizer: Organizer;
  status: OrganizerStatus;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  fading?: boolean;
}

export function OrganizerCard({ organizer: o, status, onApprove, onReject, fading }: OrganizerCardProps) {
  const [imgError, setImgError] = useState(false);

  const profileName = o.profile
    ? o.profile.display_name ||
      `${o.profile.first_name || ""} ${o.profile.last_name || ""}`.trim() ||
      "—"
    : "—";

  const date = new Date(o.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="organizer-card"
      style={fading ? { opacity: 0.5, transition: "opacity 0.3s" } : undefined}
    >
      <div className="organizer-info">
        {o.image_url && !imgError ? (
          <img
            className="organizer-avatar"
            src={o.image_url}
            alt=""
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="avatar-placeholder">👤</div>
        )}
        <div className="organizer-details">
          <h3>
            {o.name || "Unnamed"}
            {status === "pending" && <span className="status-badge pending">pending</span>}
            {status !== "pending" && <span className={`status-badge ${status}`}>{status}</span>}
          </h3>
          <div className="meta">
            Applied {date} · User: {profileName}
          </div>
          <div className="detail-grid">
            <DetailItem label="Stripe Account" value={o.stripe_account_id || "—"} />
          </div>
          {o.description && <div className="desc-text">{o.description}</div>}
          {status === "rejected" && (
            <div className="rejection-box">
              <div className="rejection-label">Rejection reason</div>
              <div className={`rejection-text${o.rejection_reason ? "" : " empty"}`}>
                {o.rejection_reason || "No reason provided"}
              </div>
            </div>
          )}
        </div>
      </div>
      {status === "pending" ? (
        <div className="organizer-actions">
          <button className="btn-approve" onClick={() => onApprove(o.id)}>
            ✓ Approve
          </button>
          <button className="btn-reject" onClick={() => onReject(o.id)}>
            ✗ Reject
          </button>
        </div>
      ) : (
        <div className="organizer-actions">
          <span className={`status-badge ${status}`}>{status}</span>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <div className="dl">{label}</div>
      <div className="dv">{value}</div>
    </div>
  );
}
