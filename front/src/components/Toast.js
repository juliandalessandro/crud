function Toast({ message, type = "default" }) {
  if (!message) return null;

  // Elegimos la clase según tipo
  const className =
    type === "success"
      ? "toast-message-edit-upload"
      : type === "error"
      ? "toast-message"
      : "toast-message-edit-upload";

  return <div className={className}>{message}</div>;
}

export default Toast;