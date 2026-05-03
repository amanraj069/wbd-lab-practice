export default function MessageAlert({ type, message }) {
  if (!message) return null;

  return <div className={`alert alert-${type}`}>{message}</div>;
}
