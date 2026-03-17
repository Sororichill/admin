import { useState, useEffect, useRef } from "react";

interface RejectModalProps {
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export function RejectModal({ onConfirm, onClose }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmedLen = reason.trim().length;
  const isValid = trimmedLen >= 10;

  useEffect(() => {
    textareaRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      await onConfirm(reason.trim());
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <h3>Reject Application</h3>
        <p className="modal-subtitle">
          Provide a reason for rejecting this application. The organizer will see this.
        </p>
        <textarea
          ref={textareaRef}
          placeholder="Reason for rejection…"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modal-char-count">{trimmedLen} / 10 min characters</div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-modal-reject"
            disabled={!isValid || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Rejecting…" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
