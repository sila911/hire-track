import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
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

  const emailError = fieldErrors.email || '';
  const passwordError = fieldErrors.password || '';

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
    <div className="flex min-h-dvh items-center justify-center bg-[#020617] px-4 py-10 font-sans text-white antialiased">
      <motion.div
        initial={{ opacity: 0, y: 14, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="font-black tracking-tighter text-4xl text-white">HireTrack</p>
            <h1 className="mt-4 font-black text-2xl tracking-tight text-white">Sign in</h1>
            <p className="mt-2 text-sm font-bold text-white">Welcome back. Enter your credentials to continue.</p>
          </div>

          {bannerMessages.length > 0 && (
            <div className="mb-6">
              <FormErrorAlert messages={bannerMessages} title="We couldn’t complete sign-in" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-bold text-white">
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white"
                  aria-hidden
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-4 text-white placeholder-white/20 shadow-inner outline-none focus:border-white/30 transition"
                  placeholder="you@company.com"
                  required
                />
              </div>
              {emailError ? <p className="mt-1.5 text-sm font-bold text-red-400">{emailError}</p> : null}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-bold text-white">
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white"
                  aria-hidden
                />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-10 pr-4 text-white placeholder-white/20 shadow-inner outline-none focus:border-white/30 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
              {passwordError ? <p className="mt-1.5 text-sm font-bold text-red-400">{passwordError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-white py-3.5 text-center text-base font-black text-slate-900 shadow-xl transition hover:bg-white/90 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-bold text-white">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-black text-white underline underline-offset-4 decoration-white/20 transition hover:decoration-white"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
