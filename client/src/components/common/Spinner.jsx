export default function Spinner({ size = 'md' }) {
  const s = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }[size]
  return (
    <div className="flex justify-center items-center">
      <div className={`${s} border-4 border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  )
}
