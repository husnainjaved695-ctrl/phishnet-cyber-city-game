export default function ToastLayer({ toasts }) {
  return (
    <div className="toast-layer">
      {toasts.map((t) => (
        <div className="toast" key={t.id}>
          <span className="toast-icon">{t.icon}</span>
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  )
}
