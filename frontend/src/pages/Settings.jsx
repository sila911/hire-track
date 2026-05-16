import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../auth-context';
import { useNotification } from '../notification-context';
import api from '../axios';

export default function Settings() {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false
  });

  if (!user) return null;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      await api.post('/user/password', passwordForm);
      addNotification({
        type: 'success',
        title: 'Security Updated',
        description: 'Your password has been changed successfully.'
      });
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          description: 'Could not update security settings.'
        });
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] bg-slate-950/75 border border-white/15 p-8 md:p-12 shadow-2xl backdrop-blur-2xl saturate-150 relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <section className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
              <FaLock className="text-sm" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">Security Settings</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={show.current ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white font-bold outline-none focus:border-white/30 transition shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, current: !show.current })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  >
                    {show.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.current_password && <p className="mt-2 text-xs font-black text-red-400 ml-1">{errors.current_password[0]}</p>}
              </div>

              <div className="h-px bg-white/5 my-2" />

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={show.new ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white font-bold outline-none focus:border-white/30 transition shadow-inner"
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, new: !show.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  >
                    {show.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-xs font-black text-red-400 ml-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    value={passwordForm.password_confirmation}
                    onChange={e => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-white font-bold outline-none focus:border-white/30 transition shadow-inner"
                    placeholder="Repeat new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, confirm: !show.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  >
                    {show.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full mt-4 bg-white text-slate-900 py-4 rounded-2xl font-black tracking-tight shadow-xl hover:bg-white/90 disabled:opacity-50 transition-all hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-2"
            >
              {pending ? (
                <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
              ) : 'Update Password'}
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
