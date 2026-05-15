import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import api from '../../axios';
import FormErrorAlert from '../../components/ui/FormErrorAlert';
import { parseRegisterApiError } from '../../utils/laravelErrors';

/**
 * @param {{ onAuthed: () => void }} props
 */
export default function Register({ onAuthed }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerMessages, setBannerMessages] = useState([]);
  const [pending, setPending] = useState(false);

  const nameError = fieldErrors.name || '';
  const emailError = fieldErrors.email || '';
  const passwordError = fieldErrors.password || '';
  const passwordConfirmationError = fieldErrors.password_confirmation || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setBannerMessages([]);
    setPending(true);
    try {
      const { data } = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      localStorage.setItem('token', data.token);
      onAuthed(data.user);
      navigate('/', { replace: true });
    } catch (err) {
      const { fieldErrors: next, banner } = parseRegisterApiError(err);
      setFieldErrors(next);
      if (banner) setBannerMessages([banner]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4 py-10 font-sans text-slate-900 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 14, x: 10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-900/5">
          <div className="mb-8 text-center">
            <p className="font-black tracking-tight text-3xl text-slate-900">HireTrack</p>
            <h1 className="mt-2 font-black text-2xl tracking-tight text-slate-800">Create account</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">Start tracking applications in one place.</p>
          </div>

          {bannerMessages.length > 0 && (
            <div className="mb-6">
              <FormErrorAlert messages={bannerMessages} title="Registration couldn’t complete" />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="register-name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <div className="relative">
                <FaUser
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Alex Morgan"
                  required
                />
              </div>
              {nameError ? <p className="mt-1.5 text-sm font-medium text-red-600">{nameError}</p> : null}
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="you@company.com"
                  required
                />
              </div>
              {emailError ? <p className="mt-1.5 text-sm font-medium text-red-600">{emailError}</p> : null}
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="relative">
                <FaLock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              {passwordError ? <p className="mt-1.5 text-sm font-medium text-red-600">{passwordError}</p> : null}
            </div>

            <div>
              <label
                htmlFor="register-password-confirmation"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                Confirm password
              </label>
              <div className="relative">
                <FaLock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  id="register-password-confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Repeat password"
                  required
                />
              </div>
              {passwordConfirmationError ? (
                <p className="mt-1.5 text-sm font-medium text-red-600">{passwordConfirmationError}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-blue-600 py-3 text-center text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 underline-offset-2 transition hover:text-blue-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
