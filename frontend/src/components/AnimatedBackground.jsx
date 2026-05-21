import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-white dark:bg-[#0a0f1c] z-[-1] pointer-events-none transition-colors duration-500">
      {/* Immersive Blurred Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[100px]"
      />
      
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          opacity: [0.05, 0.2, 0.05],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-[-5%] w-[40%] h-[40%] bg-pink-500/5 dark:bg-pink-500/10 rounded-full blur-[100px]"
      />

      {/* Geometric Grid Layer with Dynamic Colors */}
      <div className="absolute inset-0 
        bg-[linear-gradient(rgba(226,232,240,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(244,114,182,0.1)_1px,transparent_1px)]
        dark:bg-[linear-gradient(rgba(244,114,182,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(52,211,153,0.05)_1px,transparent_1px)] 
        bg-[size:48px_48px] 
        [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_90%)]"
      ></div>

      {/* Subtle Overlay to blend */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_95%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#0a0f1c_95%)] opacity-60"></div>
    </div>
  );
}
