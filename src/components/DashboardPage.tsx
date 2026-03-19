import { useState, useEffect, useCallback, useRef } from "react";
import { loadOrganizers as fetchOrganizers, approveOrganizer, rejectOrganizer } from "../api";
import type { Organizer, OrganizerStatus } from "../types";
import { OrganizerCard } from "./OrganizerCard";
import { ApproveModal } from "./ApproveModal";
import { RejectModal } from "./RejectModal";
import { toast } from "./Toast";

interface DashboardPageProps {
  secret: string;
  onLogout: () => void;
}

const STATUS_TABS: OrganizerStatus[] = ["pending", "approved", "rejected"];
const EMPTY_ICONS: Record<OrganizerStatus, string> = {
  pending: "📭",
  approved: "✅",
  rejected: "❌",
};

export function DashboardPage({
  secret,
  onLogout,
}: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<OrganizerStatus>("pending");
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [fadingId, setFadingId] = useState<string | null>(null);
  const [modalState, setModalState] = useState<
    | { type: "approve"; organizerId: string }
    | { type: "reject"; organizerId: string }
    | null
  >(null);

  const secretRef = useRef(secret);
  secretRef.current = secret;

  const loadCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        STATUS_TABS.map((s) =>
          fetchOrganizers(secretRef.current, s).then((list) => list.length)
        )
      );
      setCounts({
        pending: results[0],
        approved: results[1],
        rejected: results[2],
      });
    } catch {
      // Silently fail — individual loads will show errors
    }
  }, []);

  const loadList = useCallback(async (status: OrganizerStatus) => {
    setLoading(true);
    try {
      const list = await fetchOrganizers(secretRef.current, status);
      setOrganizers(list);
    } catch {
      setOrganizers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCounts();
    loadList(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret]);

  const handleTabSwitch = (status: OrganizerStatus) => {
    setActiveTab(status);
    loadList(status);
  };

  const handleApprove = async () => {
    if (!modalState || modalState.type !== "approve") return;
    const id = modalState.organizerId;
    try {
      await approveOrganizer(secret, id);
      setModalState(null);
      toast("Organizer approved ✓", "success");
      fadeOutAndReload(id);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Approval failed", "error");
    }
  };

  const handleReject = async (reason: string) => {
    if (!modalState || modalState.type !== "reject") return;
    const id = modalState.organizerId;
    try {
      await rejectOrganizer(secret, id, reason);
      setModalState(null);
      toast("Organizer rejected ✓", "success");
      fadeOutAndReload(id);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Rejection failed", "error");
    }
  };

  const fadeOutAndReload = (id: string) => {
    setFadingId(id);
    setTimeout(() => {
      setFadingId(null);
      loadList(activeTab);
      loadCounts();
    }, 400);
  };

  return (
    <>
      <header>
        <div className="header-left">
          <h1>Organizer Review</h1>
        </div>
        <div className="header-actions">
          <div className="tabs">
            {STATUS_TABS.map((s) => (
              <button
                key={s}
                className={`tab${activeTab === s ? " active" : ""}`}
                onClick={() => handleTabSwitch(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
                {s === "pending" && <span className="badge">{counts.pending}</span>}
              </button>
            ))}
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="main">
        <div className="stats">
          <div className="stat-card pending">
            <div className="label">Pending</div>
            <div className="value">{counts.pending}</div>
          </div>
          <div className="stat-card approved">
            <div className="label">Approved</div>
            <div className="value">{counts.approved}</div>
          </div>
          <div className="stat-card rejected">
            <div className="label">Rejected</div>
            <div className="value">{counts.rejected}</div>
          </div>
        </div>

        <div className="organizer-list">
          {loading ? (
            <div className="loading">
              <div className="spinner" />
              <br />
              Loading organizer applications…
            </div>
          ) : organizers.length === 0 ? (
            <div className="empty-state">
              <div className="icon">{EMPTY_ICONS[activeTab]}</div>
              <p>No {activeTab} organizer applications</p>
            </div>
          ) : (
            organizers.map((o) => (
              <OrganizerCard
                key={o.id}
                organizer={o}
                status={activeTab}
                fading={fadingId === o.id}
                onApprove={(id) => setModalState({ type: "approve", organizerId: id })}
                onReject={(id) => setModalState({ type: "reject", organizerId: id })}
              />
            ))
          )}
        </div>
      </div>

      {modalState?.type === "approve" && (
        <ApproveModal onConfirm={handleApprove} onClose={() => setModalState(null)} />
      )}
      {modalState?.type === "reject" && (
        <RejectModal
          onConfirm={handleReject}
          onClose={() => setModalState(null)}
        />
      )}
    </>
  );
}
