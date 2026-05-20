import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { ArrowLeft, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import api from '../../axios';
import FormErrorAlert from '../../components/ui/FormErrorAlert';
import { parseLoginApiError } from '../../utils/laravelErrors';
import { useAuth } from '../../auth-context';
import { useNotification } from '../../notification-context';

export default function Login() {
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerMessages, setBannerMessages] = useState([]);
  const [pending, setPending] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [showPassword, setShowPassword] = useState(false);

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

  const emailError = fieldErrors.email || '';
  const passwordError = fieldErrors.password || '';

  const handleGoogleSuccess = async (credentialResponse) => {
    setPending(true);
    setFieldErrors({});
    setBannerMessages([]);
    try {
      const response = await api.post('/auth/google', {
        token: credentialResponse.credential,
      });

      // Data Validation Guard: Verify response structure before proceeding
      if (response.data && response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        login(token, user);
        addNotification({
          type: 'success',
          title: 'Successfully signed in',
          description: `Welcome, ${user?.name || 'User'}!`,
        });
        navigate('/dashboard', { replace: true });
      } else {
        console.log('Backend response type:', typeof response.data);
        console.log('Backend response keys:', response.data ? Object.keys(response.data) : 'null');
        console.log('Backend response data:', response.data);
        
        const detail = response.data?.error || "Missing user or token in success response.";
        throw new Error(`Server returned status ${response.status} but invalid data: ${detail}`);
      }
    } catch (err) {
      console.error('Google Auth failure:', err);
      // Capture backend error or fallback to generic message
      const errorMessage = err.response?.data?.error || err.message || "Google authentication failed. Please try again.";
      setBannerMessages([errorMessage]);
    } finally {
      setPending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setBannerMessages([]);
    setPending(true);
    try {
      const { data } = await api.post('/login', { email, password });
      login(data.token, data.user);
      addNotification({
        type: 'success',
        title: 'Successfully signed in',
        description: `Welcome back, ${data.user.name}!`,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const { fieldErrors: next, banner } = parseLoginApiError(err);
      setFieldErrors(next);
      if (banner) setBannerMessages([banner]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 dark:bg-[#020617] px-4 py-10 font-sans transition-colors duration-300 antialiased relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-500/20 dark:bg-indigo-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-rose-500/15 dark:bg-rose-500/15 rounded-full blur-[120px] animate-blob animation-delay-4000" />
        <div className="absolute bottom-[-5%] right-[10%] w-[45%] h-[45%] bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[40%] left-[30%] w-[35%] h-[35%] bg-amber-400/15 dark:bg-amber-400/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 relative overflow-hidden">
          {/* Header with Back and Theme Toggle */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" strokeWidth={3} />
              <span>Back</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all shadow-sm"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="mb-8 text-center relative z-10">
            <p className="font-black tracking-tighter text-4xl text-black dark:text-white">HireTrack</p>
            <h1 className="mt-4 font-black text-2xl tracking-tight text-black dark:text-white">Sign in</h1>
            <p className="mt-2 text-sm font-bold text-black/60 dark:text-white/60">Welcome back. Enter your credentials to continue.</p>
          </div>

          {bannerMessages.length > 0 && (
            <div className="mb-6">
              <FormErrorAlert messages={bannerMessages} title="We couldn’t complete sign-in" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-black dark:text-white">
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40 transition-colors"
                  aria-hidden
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 py-3.5 pl-10 pr-4 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 shadow-inner outline-none transition focus:border-black/30 dark:focus:border-white/30"
                  placeholder="you@company.com"
                  required
                />
              </div>
              {emailError ? <p className="mt-1.5 text-sm font-bold text-red-400">{emailError}</p> : null}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-bold text-black dark:text-white">
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40 dark:text-white/40 transition-colors"
                  aria-hidden
                />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 py-3.5 pl-10 pr-12 text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 shadow-inner outline-none transition focus:border-black/30 dark:focus:border-white/30"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError ? <p className="mt-1.5 text-sm font-bold text-red-400">{passwordError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-black dark:bg-white py-3.5 text-center text-base font-black text-white dark:text-slate-900 shadow-xl transition hover:opacity-90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm font-bold uppercase tracking-widest">
                <span className="bg-white dark:bg-[#020617] px-4 text-slate-500 dark:text-white/40">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log('Google Auth Failed');
                  setBannerMessages(['Google authentication was cancelled or failed.']);
                }}
                theme="filled_blue"
                shape="circle"
              />
            </div>
          </div>

          <p className="mt-8 text-center text-sm font-bold text-black dark:text-white transition-colors">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-black text-black dark:text-white underline underline-offset-4 decoration-black/20 dark:decoration-white/20 transition hover:decoration-black dark:hover:decoration-white"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
