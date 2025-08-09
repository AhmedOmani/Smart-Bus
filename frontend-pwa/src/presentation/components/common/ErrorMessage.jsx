// Presentation Component - Error Message
export const ErrorMessage = ({ 
  title = 'حدث خطأ', 
  message = 'حاول مرة أخرى', 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/20">
        <span className="text-red-400 text-3xl">⚠️</span>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">
          {title}
        </h3>
        
        <p className="text-sm text-[#CFCFCF] leading-relaxed max-w-sm">
          {message}
        </p>
      </div>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-brand hover:bg-brand-dark text-white font-medium rounded-xl transition-colors duration-200"
        >
          المحاولة مرة أخرى
        </button>
      )}
    </div>
  )
}
