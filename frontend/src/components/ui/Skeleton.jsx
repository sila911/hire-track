export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClasses = 'relative overflow-hidden bg-black/5 dark:bg-white/5';
  
  const variants = {
    circular: 'rounded-full',
    rectangular: 'rounded-2xl',
    text: 'rounded-md',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
      <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
    </div>
  );
}
