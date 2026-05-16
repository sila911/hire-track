import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';
import { useAuth } from '../auth-context';
import { useNotification } from '../notification-context';
import api from '../axios';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { addNotification } = useNotification();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    profile_image_url: user?.profile_image_url || ''
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
        description: 'Your personal information has been saved successfully.'
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          description: 'Could not update profile information.'
        });
      }
    } finally {
      setPending(false);
    }
  };

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??';

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2.5rem] bg-slate-950/75 border border-white/15 p-8 md:p-12 shadow-2xl backdrop-blur-2xl saturate-150 relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col items-center mb-12 relative z-10">
          <div className="w-28 h-28 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-6 shadow-inner overflow-hidden group relative">
            {user.profile_image_url ? (
              <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl font-black text-white">{initials}</span>
            )}
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white mb-2">{user.name}</h2>
          <p className="text-white font-black uppercase tracking-[0.2em] text-xs px-4 py-1.5 rounded-full bg-white/5 border border-white/10">{user.email}</p>
        </div>

        <section className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
              <FaUser className="text-sm" />
            </div>
            <h3 className="text-xl font-black tracking-tight text-white">Personal Information</h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">Display Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-white/30 transition shadow-inner"
                  placeholder="Your Name"
                  required
                />
                {errors.name && <p className="mt-2 text-xs font-black text-red-400 ml-1">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-white/60 mb-2 ml-1">Profile Image URL</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={profileForm.profile_image_url}
                      onChange={e => setProfileForm({ ...profileForm, profile_image_url: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-white/30 transition shadow-inner"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  {profileForm.profile_image_url && (
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 overflow-hidden shrink-0">
                      <img src={profileForm.profile_image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                {errors.profile_image_url && <p className="mt-2 text-xs font-black text-red-400 ml-1">{errors.profile_image_url[0]}</p>}
                <p className="mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Tip: Use a clear square image for best results.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full mt-4 bg-white text-slate-900 py-4 rounded-2xl font-black tracking-tight shadow-xl hover:bg-white/90 disabled:opacity-50 transition-all hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-2"
            >
              {pending ? (
                <div className="w-5 h-5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" />
              ) : 'Save Changes'}
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
