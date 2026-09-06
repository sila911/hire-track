import { motion } from 'framer-motion';
import { DirectboxNotif, TickCircle, TrendUp, Briefcase } from 'iconsax-react';
import { useState } from 'react';

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <section id="about" className="relative z-10 w-full py-20 px-6 md:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left Column: The Mission (Bigger UI) */}
          <div className="flex flex-col items-start text-left">
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] md:text-xs font-black tracking-[0.2em] uppercase mb-8 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <DirectboxNotif size={16} variant="Bulk" color="currentColor" />
                Our Mission
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8 text-slate-900 dark:text-white leading-[1.1]"
            >
              Why We Built <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Hire Tracking</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-10 max-w-xl"
            >
              We believe the job search is stressful enough without having to manage chaotic spreadsheets. Focus on landing the job, let us track the journey.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-6">
              <div className="flex items-center gap-4 text-base md:text-xl font-bold text-slate-800 dark:text-slate-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner shrink-0">
                   <TickCircle size={24} variant="Bold" color="currentColor" />
                </div>
                Eliminate spreadsheet chaos
              </div>
              <div className="flex items-center gap-4 text-base md:text-xl font-bold text-slate-800 dark:text-slate-200">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-inner shrink-0">
                   <TrendUp size={24} variant="Bold" color="currentColor" />
                </div>
                Data-driven interview insights
              </div>
            </motion.div>
          </div>

          {/* Right Column: 3D Elements */}
          <motion.div 
            variants={itemVariants}
            style={{ perspective: 2000 }}
            className="relative w-full aspect-[4/5] md:aspect-square flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
             {/* Background glow */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 rounded-[4rem] blur-[100px] pointer-events-none"></div>
             
             {/* Main 3D Container */}
             <motion.div 
                style={{ transformStyle: "preserve-3d" }}
                animate={{ 
                  rotateX: isHovered ? 15 : 10, 
                  rotateY: isHovered ? -15 : -20,
                  scale: isHovered ? 1.05 : 1
                }}
                transition={{ duration: 0.8, type: "spring", damping: 15 }}
                className="relative w-full max-w-sm md:max-w-lg rounded-[2.5rem] md:rounded-[3rem] bg-white/40 dark:bg-slate-900/40 border border-black/10 dark:border-white/10 backdrop-blur-3xl p-6 md:p-10 shadow-[0_50px_100px_rgba(0,0,0,0.15)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
             >
                {/* Header inside 3D card */}
                <motion.div animate={{ z: 50 }} className="flex items-center justify-between mb-8 md:mb-12">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/40">
                      <Briefcase size={24} variant="Bold" color="currentColor" className="text-white md:w-8 md:h-8" />
                    </div>
                    <div>
                      <div className="text-lg md:text-2xl font-black text-slate-900 dark:text-white leading-tight">Pipeline Status</div>
                      <div className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Live Overview</div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 md:px-5 md:py-2.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-wider shadow-inner">
                    Active
                  </div>
                </motion.div>

                <div className="space-y-4 md:space-y-6 relative" style={{ transformStyle: "preserve-3d" }}>
                  {/* 3D Floating Item 1 */}
                  <motion.div 
                    animate={{ z: isHovered ? 80 : 30, x: isHovered ? -10 : 0, y: isHovered ? -5 : 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/10 flex items-center justify-between shadow-2xl backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base md:text-xl font-black text-black dark:text-white shadow-inner shrink-0">G</div>
                      <div>
                        <div className="text-base md:text-xl font-black text-slate-900 dark:text-white">Google</div>
                        <div className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5">Frontend Engineer</div>
                      </div>
                    </div>
                    <div className="text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl shadow-inner shrink-0">Interview</div>
                  </motion.div>

                  {/* 3D Floating Item 2 */}
                  <motion.div 
                    animate={{ z: isHovered ? 120 : 50, x: isHovered ? 15 : 0 }}
                    transition={{ duration: 0.9, type: "spring", delay: 0.05 }}
                    className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/10 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.15)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base md:text-xl font-black text-black dark:text-white shadow-inner shrink-0">S</div>
                      <div>
                        <div className="text-base md:text-xl font-black text-slate-900 dark:text-white">Stripe</div>
                        <div className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5">Full Stack Dev</div>
                      </div>
                    </div>
                    <div className="text-[10px] md:text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl shadow-inner shrink-0">Applied</div>
                  </motion.div>

                  {/* 3D Floating Item 3 */}
                  <motion.div 
                    animate={{ z: isHovered ? 160 : 70, x: isHovered ? -20 : 0, y: isHovered ? 10 : 0 }}
                    transition={{ duration: 1, type: "spring", delay: 0.1 }}
                    className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/90 dark:bg-slate-800/90 border border-black/10 dark:border-white/10 flex items-center justify-between shadow-[0_40px_80px_rgba(0,0,0,0.2)] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base md:text-xl font-black text-black dark:text-white shadow-inner shrink-0">N</div>
                      <div>
                        <div className="text-base md:text-xl font-black text-slate-900 dark:text-white">Netflix</div>
                        <div className="text-[10px] md:text-xs font-bold text-slate-500 mt-0.5">UI Engineer</div>
                      </div>
                    </div>
                    <div className="text-[10px] md:text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl shadow-inner shrink-0">Offer</div>
                  </motion.div>
                </div>
             </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
