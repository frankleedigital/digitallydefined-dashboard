// src/components/LoadingSpinner.jsx
// Small sharp-edged spinner used while the auth session is being restored.

export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-block h-5 w-5 animate-spin border-2 border-[#111111] border-t-transparent"
      style={{ borderRadius: 0 }}
    />
  );
}

