import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Smartphone, 
  ChevronRight, 
  Briefcase,
  Sun,
  Moon,
  Quote
} from 'lucide-react';
import { 
  SiGoogle, 
  SiStripe, 
  SiNetflix, 
  SiAirbnb, 
  SiSpotify 
} from 'react-icons/si';
import { FaMicrosoft } from 'react-icons/fa6';

export default function Landing() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const logos = [
    { name: 'Google', icon: SiGoogle, url: 'https://about.google' },
    { name: 'Microsoft', icon: FaMicrosoft, url: 'https://www.microsoft.com' },
    { name: 'Stripe', icon: SiStripe, url: 'https://stripe.com' },
    { name: 'Netflix', icon: SiNetflix, url: 'https://www.netflix.com' },
    { name: 'Airbnb', icon: SiAirbnb, url: 'https://www.airbnb.com' },
    { name: 'Spotify', icon: SiSpotify, url: 'https://www.spotify.com' },
  ];

  const testimonials = [
    {
      quote: "HireTrack helped me organize 150+ applications and I finally landed my dream job. The analytics showed me exactly where my pipeline was failing.",
      author: "Sarah J.",
      role: "Product Designer @ TechFlow",
    },
    {
      quote: "The Kanban board is a game changer. I used to use spreadsheets, but this is so much faster and more visual. Highly recommend for any job seeker.",
      author: "Michael L.",
      role: "Software Engineer @ Nova",
    },
    {
      quote: "I love the mobile optimization. I can update my application status while I'm on the train right after an interview. So convenient!",
      author: "Alex D.",
      role: "Marketing Specialist",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-300">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-8 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Briefcase size={22} className="text-white dark:text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter">HireTrack</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="text-sm font-bold tracking-tight text-slate-600 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-black tracking-[0.2em] uppercase mb-6">
              Next-Gen Career Tracking
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] mb-8 text-slate-900 dark:text-white">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
                Job Search Pipeline
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mb-10">
              Stop losing track of your applications. HireTrack gives you a visual Kanban workflow, deep analytics, and a professional command center for your career growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-lg shadow-xl dark:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-2xl transition-all flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <p className="text-sm font-bold text-slate-400 px-4">
                No credit card required.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10 rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl p-4 shadow-2xl"
          >
             <div className="bg-slate-200 dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 aspect-[1.4/1] flex items-center justify-center">
                {/* Visual placeholder for the app dashboard */}
                <div className="w-full h-full p-6 flex flex-col gap-4 opacity-30 dark:opacity-50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-32 h-6 bg-black/10 dark:bg-white/10 rounded-lg"></div>
                    <div className="w-10 h-10 bg-black/10 dark:bg-white/10 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="h-24 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5"></div>
                    <div className="h-24 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5"></div>
                    <div className="h-24 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5"></div>
                  </div>
                  <div className="flex-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 p-4 flex gap-4">
                    <div className="w-1/3 h-full bg-black/5 dark:bg-white/5 rounded-xl"></div>
                    <div className="w-1/3 h-full bg-black/5 dark:bg-white/5 rounded-xl"></div>
                    <div className="w-1/3 h-full bg-black/5 rounded-xl opacity-20"></div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="px-6 py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-black text-sm shadow-2xl">
                     Live Dashboard Preview
                   </div>
                </div>
             </div>
          </motion.div>
          {/* Decorative elements behind the preview */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </main>

      {/* Logo Carousel */}
      <section className="relative z-10 py-12 border-y border-black/5 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-10 opacity-60">
            Trusted by candidates hired at
          </p>
          
          <div className="relative flex overflow-hidden">
            <motion.div 
              className="flex items-center gap-12 md:gap-24 whitespace-nowrap"
              animate={{ x: [0, -1030] }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear",
              }}
            >
              {[...logos, ...logos].map((logo, index) => (
                <a 
                  key={`${logo.name}-${index}`}
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white transition-all duration-300 group grayscale hover:grayscale-0"
                >
                  <logo.icon size={24} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xl md:text-2xl font-black tracking-tighter">
                    {logo.name}
                  </span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Everything you need to land the job.</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Powerful tools built for the modern job seeker.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<LayoutDashboard size={24} />}
            title="Visual Kanban Pipeline"
            description="Track applications effortlessly with a drag-and-drop workflow. See exactly where you stand in every process."
            delay={0.1}
          />
          <FeatureCard 
            icon={<BarChart2 size={24} />}
            title="Hiring Analytics"
            description="Deep insights into conversion rates and response speeds. Use data to optimize your interview performance."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Smartphone size={24} />}
            title="Sleek Mobile Optimization"
            description="Track your applications on the go. A perfectly responsive interface that works wherever you are."
            delay={0.3}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:px-12 bg-indigo-500/[0.02] rounded-[4rem]">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Success Stories</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Join thousands of job seekers landing their dream roles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-xl flex flex-col h-full"
            >
              <div className="text-indigo-500 dark:text-indigo-400 mb-6">
                <Quote size={32} fill="currentColor" className="opacity-20" />
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-8 flex-1 italic leading-relaxed">
                "{t.quote}"
              </p>
              <div>
                <p className="font-black text-slate-900 dark:text-white tracking-tight">{t.author}</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest mt-1">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">Ready to land your <br />next big role?</h2>
            <p className="text-indigo-100 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
              Stop organizing in spreadsheets. Join thousands of users who have streamlined their search with HireTrack.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-xl shadow-2xl hover:bg-slate-50 transition-all"
            >
              Get Started for Free
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/5 dark:border-white/5 py-12 text-center text-slate-500 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-6">
          <p>© {new Date().getFullYear()} HireTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-lg hover:bg-white/60 dark:hover:bg-white/[0.08] hover:border-black/10 dark:hover:border-white/20 transition-all duration-300 shadow-xl"
    >
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
