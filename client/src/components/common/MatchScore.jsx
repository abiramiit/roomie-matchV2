export default function MatchScore({ score }) {
  const color = score >= 75 ? 'text-green-600 bg-green-50' : score >= 50 ? 'text-yellow-600 bg-yellow-50' : 'text-red-500 bg-red-50'
  return (
    <span className={`badge ${color} font-bold text-sm px-3 py-1`}>
      {score}% Match
    </span>
  )
}
