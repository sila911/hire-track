import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../auth-context';
import { useNotification } from '../notification-context';
import api from '../axios';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    profile_image_url: user?.profile_image_url || ''
  });

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

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name,
        profile_image_url: user.profile_image_url || ''
      });
    }
  }, [user]);

  if (!user) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      const { data } = await api.put('/user/profile', profileForm);
      setUser(data.user);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your profile information has been saved.'
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          description: 'Could not update profile.'
        });
      }
    } finally {
      setPending(false);
    }
  };

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
    <div className="max-w-2xl mx-auto py-6 md:py-10 px-4">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-black dark:hover:text-white transition-colors group"
      >
        <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-black uppercase tracking-widest">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] md:rounded-[2.5rem] bg-white/70 dark:bg-slate-950/75 border border-slate-200 dark:border-white/15 p-6 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/30 to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Profile Section */}
        <section className="relative z-10 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/10 dark:border-white/10 text-black dark:text-white">
              <FaUserCircle className="text-sm" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-black dark:text-white">Account Profile</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 mb-2 ml-1">Display Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-5 text-sm text-black dark:text-white font-bold outline-none focus:border-black/20 dark:focus:border-white/30 transition shadow-inner"
                  placeholder="Your Name"
                  required
                />
                {errors.name && <p className="mt-2 text-[10px] font-black text-red-400 ml-1">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 mb-2 ml-1">Profile Image URL</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={profileForm.profile_image_url}
                      onChange={e => setProfileForm({ ...profileForm, profile_image_url: e.target.value })}
                      className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 px-5 text-sm text-black dark:text-white font-bold outline-none focus:border-black/20 dark:focus:border-white/30 transition shadow-inner"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  {profileForm.profile_image_url && (
                    <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 overflow-hidden shrink-0">
                      <img src={profileForm.profile_image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {errors.profile_image_url && <p className="mt-2 text-[10px] font-black text-red-400 ml-1">{errors.profile_image_url[0]}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-black dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl font-black tracking-tight shadow-xl hover:opacity-90 disabled:opacity-50 transition-all hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              {pending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : 'Update Profile'}
            </button>
          </form>
        </section>

        <div className="h-px bg-black/5 dark:bg-white/10 my-10" />

        {/* Security Section */}
        <section className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center border border-black/10 dark:border-white/10 text-black dark:text-white">
              <FaLock className="text-sm" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-black dark:text-white">Security Settings</h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 mb-2 ml-1">Current Password</label>
                <div className="relative">
                  <input
                    type={show.current ? 'text' : 'password'}
                    value={passwordForm.current_password}
                    onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-5 pr-12 text-sm text-black dark:text-white font-bold outline-none focus:border-black/20 dark:focus:border-white/30 transition shadow-inner"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, current: !show.current })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white transition"
                  >
                    {show.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.current_password && <p className="mt-2 text-[10px] font-black text-red-400 ml-1">{errors.current_password[0]}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 mb-2 ml-1">New Password</label>
                <div className="relative">
                  <input
                    type={show.new ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-5 pr-12 text-sm text-black dark:text-white font-bold outline-none focus:border-black/20 dark:focus:border-white/30 transition shadow-inner"
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, new: !show.new })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white transition"
                  >
                    {show.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-[10px] font-black text-red-400 ml-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/60 mb-2 ml-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={show.confirm ? 'text' : 'password'}
                    value={passwordForm.password_confirmation}
                    onChange={e => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl py-3 pl-5 pr-12 text-sm text-black dark:text-white font-bold outline-none focus:border-black/20 dark:focus:border-white/30 transition shadow-inner"
                    placeholder="Repeat new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShow({ ...show, confirm: !show.confirm })}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white transition"
                  >
                    {show.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-black dark:bg-white text-white dark:text-slate-900 py-3 rounded-2xl font-black tracking-tight shadow-xl hover:opacity-90 disabled:opacity-50 transition-all hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              {pending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : 'Update Password'}
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
