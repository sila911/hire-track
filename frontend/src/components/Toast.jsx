import { motion } from 'framer-motion';
import { 
  FaCircleCheck, 
  FaCircleXmark, 
  FaCircleInfo, 
  FaXmark 
} from 'react-icons/fa6';

const icons = {
  success: <FaCircleCheck className="text-emerald-400 w-5 h-5" />,
  error: <FaCircleXmark className="text-rose-400 w-5 h-5" />,
  info: <FaCircleInfo className="text-sky-400 w-5 h-5" />,
};

const Toast = ({ type, title, description, onClose }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const variants = {
    initial: isMobile ? { y: -50, opacity: 0 } : { x: 50, opacity: 0 },
    animate: isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <motion.div
      layout
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-full relative group"
    >
      <div className="backdrop-blur-xl bg-slate-900/60 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-4 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-none" />
        
        <div className="shrink-0 mt-0.5 relative z-10">
          {icons[type] || icons.info}
        </div>

        <div className="flex-1 min-w-0 relative z-10">
          <h4 className="text-white font-bold text-sm leading-tight truncate">
            {title}
          </h4>
          {description && (
            <p className="text-white/90 text-xs mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="shrink-0 p-1 text-white/40 hover:text-white transition-colors relative z-10"
        >
          <FaXmark className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
