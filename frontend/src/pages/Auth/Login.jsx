import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import api from '../../axios';
import FormErrorAlert from '../../components/ui/FormErrorAlert';
import { parseLoginApiError } from '../../utils/laravelErrors';

/**
 * @param {{ onAuthed: () => void }} props
 */
export default function Login({ onAuthed }) {
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
      localStorage.setItem('token', data.token);
      onAuthed(data.user);
      navigate('/', { replace: true });
    } catch (err) {
      const { fieldErrors: next, banner } = parseLoginApiError(err);
      setFieldErrors(next);
      if (banner) setBannerMessages([banner]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-10 font-sans text-slate-900 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 14, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="mb-8 text-center">
            <p className="font-black tracking-tight text-3xl text-slate-900">HireTrack</p>
            <h1 className="mt-2 font-black text-2xl tracking-tight text-slate-800">Sign in</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Welcome back. Enter your credentials to continue.</p>
          </div>

          {bannerMessages.length > 0 && (
            <div className="mb-6">
              <FormErrorAlert messages={bannerMessages} title="We couldn’t complete sign-in" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none ring-blue-500/0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                  required
                />
              </div>
              {emailError ? <p className="mt-1.5 text-sm font-medium text-red-600">{emailError}</p> : null}
            </div>

            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              {passwordError ? <p className="mt-1.5 text-sm font-medium text-red-600">{passwordError}</p> : null}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-blue-600 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don’t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
