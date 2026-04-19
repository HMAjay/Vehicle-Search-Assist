export default function ConfirmModal({
  eyebrow = "Confirm",
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
  busy = false,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-box fade-up">
        <p className="modal-eyebrow">{eyebrow}</p>
        <p className="modal-title">{title}</p>
        <p className="modal-sub">{message}</p>
        <div className="modal-actions">
          <button
            className="btn btn-ghost"
            style={{ flex: 1, padding: "11px" }}
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            className={danger ? "btn btn-danger" : "btn btn-primary"}
            style={{ flex: 1, padding: "11px" }}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
