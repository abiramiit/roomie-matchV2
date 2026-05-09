export default function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-1">{title}</h3>
      {subtitle && <p className="text-gray-400 text-sm mb-4">{subtitle}</p>}
      {action}
    </div>
  )
}
