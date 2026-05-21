import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  Smartphone, 
  ChevronRight, 
  Briefcase,
  Sun,
  Moon,
  Quote,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { 
  SiGoogle, 
  SiStripe, 
  SiNetflix, 
  SiAirbnb, 
  SiSpotify 
} from 'react-icons/si';import { FaMicrosoft } from 'react-icons/fa6';
import { useAuth } from '../auth-context';

import AboutSection from '../components/AboutSection';
import AnimatedBackground from '../components/AnimatedBackground';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [scrollVisible, setScrollVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60 && currentScrollY > lastScrollY) {
        setScrollVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setScrollVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      quote: "My Excel tracking sheet was so ugly it gave me depression. Moving to this sleek dashboard gives me the exact same dopamine hit as playing video games. I’m still unemployed, but at least my coping mechanism looks beautiful.",
      author: "Sila S.",
      role: "Single & Employed",
      url: "https://silasem.me",
      avatar: "https://github.com/sila911.png",
    },
    {
      quote: " website. My girlfriend broke up with me after I used this website.",
      author: "Samrach Oep.",
      role: "Network Engineer @ CloudNet",
      url: "https://www.facebook.com/share/14cb9f5TM7d/?mibextid=wwXIfr",
      avatar: "https://scontent.fpnh8-2.fna.fbcdn.net/v/t39.30808-1/476797606_1134817501391810_5935420307205904795_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=gEeEaQ_ubBUQ7kNvwFmEnGX&_nc_oc=AdppW5-2RGL7TQtYYea1e17yujNog3jeJomajvfzVIVrWV1rl8CoXO20DUntRRs52VA&_nc_zt=24&_nc_ht=scontent.fpnh8-2.fna&_nc_gid=Ix5RSkOdZ3PKZw4x0IAMiw&_nc_ss=7b289&oh=00_Af6YG8Ns7hfwYuyZihFB5fKKZePsxYbbu7MuBB97gtjptw&oe=6A151248",
    },
    {
      quote: "This website is dangerously effective. My girlfriend broke up with me because I spent Valentine's Day automating my application code instead of taking her to a nice cafe at Riverside. Got an internship offer, a perfect layout, and zero replies on Telegram.",
      author: "Rotha D.",
      role: "Single & Coding",
      url: "https://twitter.com/alexd",
      avatar: "",
    }
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-white selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500 relative">
      <AnimatedBackground />

      {/* Floating Dark iOS-Style Capsule Navbar */}
      <nav 
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-14 rounded-full bg-[#030712]/60 border border-white/10 backdrop-blur-xl px-6 shadow-2xl flex items-center justify-between z-50 transition-all duration-300 ease-out ${scrollVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-24 opacity-0 scale-95 pointer-events-none'}`}
      >
        {/* Left: Avatar + Name (or Logo if not logged in) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 overflow-hidden shadow-sm">
            {user?.profile_image_url ? (
              <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
            ) : user ? (
              <span className="text-[10px] font-black text-white">{initials}</span>
            ) : (
              <Briefcase size={16} className="text-white" />
            )}
          </div>
          <span className="text-sm font-black tracking-tight text-white truncate max-w-[100px]">
            {user?.name || 'HireTrack'}
          </span>
        </div>

        {/* Center: Menu Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-white/50">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#stories" className="hover:text-white transition-colors">Stories</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>

        {/* Right: Theme, Sign In */}
        <div className="flex items-center gap-3 md:gap-5">
          <button
            onClick={toggleTheme}
            className="text-white/40 hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {!user && (
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2 bg-white text-black rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-transform"
            >
              Sign In
            </button>
          )}
          {user && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2 bg-indigo-500 text-white rounded-full text-[10px] font-black tracking-widest uppercase hover:scale-105 transition-transform"
            >
              App
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-20 md:px-12 flex flex-col lg:flex-row items-center gap-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 text-center lg:text-left"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-xs font-black tracking-[0.2em] uppercase mb-8">
              <Zap size={14} fill="currentColor" />
              Next-Gen Career Tracking
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.85] mb-8 text-slate-900 dark:text-white"
          >
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-purple-500 dark:to-pink-500">
              Job Search
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-12"
          >
            Stop losing track of your applications. HireTrack gives you a visual Kanban workflow, deep analytics, and a professional command center for your career growth.
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="relative w-full sm:w-auto px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] dark:shadow-[0_20px_50px_rgba(255,255,255,0.1)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started Free
                <ChevronRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Pulse Glow Effect */}
              <motion.div 
                animate={{ 
                  boxShadow: ["0 0 0 0px rgba(79, 70, 229, 0.4)", "0 0 0 20px rgba(79, 70, 229, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
              />
            </motion.button>
            
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <CheckCircle2 size={14} className="text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Unlimited job tracking
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Premium Layered Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 50, rotateY: -20 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 relative perspective-1000 w-full"
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-20"
          >
            {/* Main Content Card */}
            <div className="relative rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-2xl p-4 shadow-[0_50px_100px_rgba(0,0,0,0.1)] dark:shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden">
               <div className="bg-slate-100 dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/5 aspect-[1.4/1] flex items-center justify-center relative shadow-2xl group/preview">
                  <img 
                    src="/live-demo.gif" 
                    alt="HireTrack Dashboard Preview" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-105"
                  />
                  
                  {/* Floating Overlay Info */}
                  <div className="absolute inset-0 flex items-end justify-center pb-8 pointer-events-none">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="px-8 py-4 rounded-3xl bg-white/90 dark:bg-white text-black font-black text-sm shadow-2xl flex items-center gap-3 backdrop-blur-md"
                    >
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      
                    </motion.div>
                  </div>
               </div>
            </div>

            {/* Floating Secondary Elements */}
            <motion.div 
              animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl z-10"
            />
            <motion.div 
              animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-3xl z-10"
            />
          </motion.div>
        </motion.div>
      </main>

      {/* Interactive Logo Carousel */}
      <section className="relative z-10 py-16 border-y border-black/5 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-12 opacity-60">
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
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-40 md:px-12">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white"
          >
            Everything you need to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              land the job.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-2xl mx-auto"
          >
            Powerful tools built for the modern job seeker. Built on deep industry insights to give you the competitive edge.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<LayoutDashboard size={26} />}
            title="Visual Kanban Pipeline"
            description="Track applications effortlessly with a drag-and-drop workflow. See exactly where you stand in every process."
            delay={0.1}
          />
          <FeatureCard 
            icon={<BarChart2 size={26} />}
            title="Hiring Analytics"
            description="Deep insights into conversion rates and response speeds. Use data to optimize your interview performance."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Smartphone size={26} />}
            title="Sleek Mobile Optimization"
            description="Track your applications on the go. A perfectly responsive interface that works wherever you are."
            delay={0.3}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="relative z-10 max-w-7xl mx-auto px-6 py-40 md:px-12">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900 dark:text-white"
          >
            Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 font-medium text-lg"
          >
            Join thousands of job seekers landing their dream roles at world-class companies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.author} testimonial={t} index={i} />
          ))}
        </div>
      </section>

      <AboutSection />

      {/* High-Impact CTA Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-40 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 md:p-32 rounded-[4rem] bg-indigo-600 dark:bg-slate-950 text-white shadow-2xl relative overflow-hidden group border border-white/10"
        >
          {/* Animated Background Gradients for CTA */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 dark:bg-indigo-600/20 rounded-full blur-[100px] -mr-64 -mt-64 group-hover:bg-white/30 dark:group-hover:bg-indigo-600/30 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/20 dark:bg-purple-600/20 rounded-full blur-[100px] -ml-64 -mb-64 group-hover:bg-white/30 dark:group-hover:bg-purple-600/30 transition-colors duration-700"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-10 leading-[0.9]">Ready to land your <br />next big role?</h2>
            <p className="text-indigo-100 dark:text-indigo-100/60 text-lg md:text-xl font-medium mb-16 max-w-2xl mx-auto">
              Stop organizing in spreadsheets. Join thousands of users who have streamlined their search with HireTrack.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-12 py-6 bg-white text-indigo-600 rounded-[2rem] font-black text-2xl shadow-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 mx-auto group/btn"
            >
              Get Started for Free
              <ChevronRight size={28} className="group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/5 dark:border-white/5 py-16 text-center text-slate-500 text-sm font-medium">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                <Briefcase size={16} className="text-white dark:text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter text-black dark:text-white">HireTrack</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</a>
              <a href="https://github.com/sila911/hire-track" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          <p>© {new Date().getFullYear()} HireTrack. Designed for excellence. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group p-10 rounded-[3rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-white/[0.08] hover:border-black/10 dark:hover:border-white/20 transition-all duration-500 shadow-xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-500 shadow-inner">
          {icon}
        </div>
        <h3 className="text-2xl font-black mb-4 tracking-tight text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="p-10 rounded-[3rem] bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 backdrop-blur-xl shadow-xl flex flex-col h-full group hover:bg-white/60 dark:hover:bg-white/[0.08] transition-all duration-500"
    >
      <div className="text-indigo-500 dark:text-indigo-400 mb-8 transform group-hover:scale-110 transition-transform">
        <Quote size={40} fill="currentColor" className="opacity-20" />
      </div>
      <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-10 flex-1 italic leading-relaxed">
        "{testimonial.quote}"
      </p>
      <div className="flex items-center gap-4">
        {testimonial.avatar ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.author} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black shrink-0">
            {testimonial.author[0]}
          </div>
        )}
        <div>
          {testimonial.url ? (
            <a 
              href={testimonial.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-black text-slate-900 dark:text-white tracking-tight text-lg hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors inline-block hover:underline decoration-2 underline-offset-4"
            >
              {testimonial.author}
            </a>
          ) : (
            <p className="font-black text-slate-900 dark:text-white tracking-tight text-lg">{testimonial.author}</p>
          )}
          <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}
