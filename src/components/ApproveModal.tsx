import { useState, useEffect } from "react";

interface ApproveModalProps {
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export function ApproveModal({ onConfirm, onClose }: ApproveModalProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onConfirm();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h3>Approve Application</h3>
        <p className="modal-subtitle">
          Are you sure you want to approve this organizer application? This will grant them access to
          create and manage events.
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-modal-approve"
            disabled={submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Approving…" : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
