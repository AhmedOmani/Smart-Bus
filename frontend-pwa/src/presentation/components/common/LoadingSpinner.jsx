// Presentation Component - Loading Spinner
export const LoadingSpinner = ({ size = 'md', text = 'جاري التحميل...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className={`${sizeClasses[size]} relative animate-spin`}>
        <div className="absolute inset-0 rounded-full border-2 border-[#262626]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand" />
      </div>
      
      {text && (
        <div className="text-sm text-[#CFCFCF] font-medium animate-pulse">
          {text}
        </div>
      )}
    </div>
  )
}
