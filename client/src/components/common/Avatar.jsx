export default function Avatar({ src, name = '', size = 'md', online }) {
  const sizes = { xs: 'h-7 w-7 text-xs', sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-xl', xl: 'h-24 w-24 text-3xl' }
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="relative inline-block flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-primary text-white flex items-center justify-center font-semibold ring-2 ring-white`}>
          {initials || '?'}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${online ? 'bg-green-400' : 'bg-gray-300'}`} />
      )}
    </div>
  )
}
