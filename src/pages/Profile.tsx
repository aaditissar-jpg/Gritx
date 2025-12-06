
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Lock, CheckCircle, AlertTriangle, Save, Shield } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.username || '');
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
      setBio(user.user_metadata?.bio || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Update Metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: { full_name: fullName, bio: bio, username: username }
      });
      if (metaError) throw metaError;

      // 2. Update Email if changed
      if (email !== user?.email) {
         const { error: emailError } = await supabase.auth.updateUser({ email });
         if (emailError) throw emailError;
      }

      // 3. Update Password if provided
      if (newPassword) {
        const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
        if (pwError) throw pwError;
      }

      setMessage("Profile updated successfully!");
      setNewPassword(''); // clear password field
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-white text-center pt-20">Please sign in to view this page.</div>;

  return (
    <div className="min-h-screen bg-bg py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-400 mb-10">Manage your profile details and security.</p>

        <div className="bg-surface border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            
            {/* Header / Avatar */}
            <div className="flex items-center gap-6 pb-8 border-b border-white/5">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary border border-primary/20 shadow-neon">
                {username ? username[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{fullName || 'User'}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-500">{user.email}</p>
                    {isAdmin && (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Admin
                        </span>
                    )}
                </div>
              </div>
            </div>

            {/* Notification Area */}
            {message && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle className="h-5 w-5" />
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input 
                            type="text" 
                            className="w-full bg-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input 
                            type="text" 
                            className="w-full bg-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Bio / Description</label>
                <textarea 
                    rows={4}
                    className="w-full bg-bg border border-white/10 rounded-xl p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder-gray-600"
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <div className="pt-6 border-t border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input 
                                type="email" 
                                className="w-full bg-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                            <input 
                                type="password" 
                                className="w-full bg-bg border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                placeholder="Leave blank to keep current"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-primary hover:bg-white text-black font-bold py-3 px-8 rounded-xl transition-all shadow-neon hover:shadow-lg flex items-center gap-2"
                >
                    {loading ? 'Saving...' : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
