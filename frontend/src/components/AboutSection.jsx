import { motion } from 'framer-motion';
import { Target, CheckCircle2, TrendingUp, Briefcase } from 'lucide-react';

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

  return (
    <section id="about" className="relative z-10 w-full py-24 px-6 md:py-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          {/* Left Column: The Mission */}
          <div className="flex flex-col items-start text-left">
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black tracking-[0.2em] uppercase mb-6 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Target size={14} />
                Our Mission
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white"
            >
              Why We Built <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">HireTrack</span>
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-lg"
            >
              We believe the job search is stressful enough without having to manage chaotic spreadsheets. HireTrack was built to simplify the process for modern professionals by combining intuitive automation with beautiful, actionable analytics. Focus on landing the job, let us track the journey.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <CheckCircle2 size={16} />
                </div>
                Eliminate spreadsheet chaos
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                   <TrendingUp size={16} />
                </div>
                Data-driven interview insights
              </div>
            </motion.div>
          </div>

          {/* Right Column: The Interactive Graphic */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center"
          >
             {/* Background glow for the graphic */}
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
             
             {/* Glass Card */}
             <div className="relative w-full max-w-sm rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-2xl p-8 shadow-2xl overflow-hidden group">
                {/* Decorative subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <Briefcase size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 dark:text-white">Pipeline Status</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Overview</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
                      Active
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Mockup Item 1 */}
                    <motion.div 
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black">G</div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Google</div>
                          <div className="text-[10px] font-medium text-slate-500">Frontend Engineer</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded-md">Interview</div>
                    </motion.div>

                    {/* Mockup Item 2 */}
                    <motion.div 
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black">S</div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Stripe</div>
                          <div className="text-[10px] font-medium text-slate-500">Full Stack Dev</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">Applied</div>
                    </motion.div>

                    {/* Mockup Item 3 */}
                    <motion.div 
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between transition-all cursor-pointer opacity-70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-black">N</div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">Netflix</div>
                          <div className="text-[10px] font-medium text-slate-500">UI Engineer</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Offer</div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating decorative elements inside card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
