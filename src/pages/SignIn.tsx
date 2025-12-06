
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Loader2, AlertCircle, Check, Phone, User, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  // We can use AuthContext to detect when isAdmin updates, or just wait for redirect
  const { user, isAdmin } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
        if (isAdmin) {
            navigate('/admin');
        } else {
            navigate('/');
        }
    }
  }, [user, isAdmin, navigate]);

  // Password Strength Logic
  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1; 
    if (pass.length < 10 || !/[0-9]/.test(pass) || !/[!@#$%^&*]/.test(pass)) return 2;
    return 3;
  };

  const strength = getPasswordStrength(password);
  
  const getStrengthLabel = () => {
    switch (strength) {
      case 1: return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500' };
      case 2: return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-500' };
      case 3: return { label: 'Strong', color: 'bg-primary', text: 'text-primary' };
      default: return { label: '', color: 'bg-gray-700', text: 'text-gray-500' };
    }
  };
  
  const strengthInfo = getStrengthLabel();

  // Reset state on mode switch
  useEffect(() => {
    setError(null);
    setMessage(null);
    setFullName('');
    setUsername('');
    setPhoneNumber('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
  }, [isSignUp, isForgotPassword]);

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setMessage(null);
      
      try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: window.location.origin + '/profile', 
          });
          if (error) throw error;
          setMessage("Password reset email sent. Check your inbox.");
      } catch (err: any) {
          setError(err.message || "Failed to send reset email.");
      } finally {
          setLoading(false);
      }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        if (!phoneNumber) throw new Error("Phone number is required.");
        
        // Register user with metadata
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: username,
              phone_number: phoneNumber,
            }
          }
        });

        if (error) throw error;
        setMessage("Account created! You can now sign in.");
        setIsSignUp(false);
      } else {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // Navigation will be handled by the useEffect above monitoring user/isAdmin state
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false); // Stop loading if error
    } 
    // Do not stop loading on success immediately, wait for redirect
  };

  if (isForgotPassword) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-md w-full space-y-8 bg-surface border border-white/10 p-10 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm">
                <div className="text-center">
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-400">Enter your email to receive a reset link.</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4" />{error}
                        </div>
                    )}
                    {message && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4" />{message}
                        </div>
                    )}
                    <div>
                        <label className="sr-only">Email address</label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-primary hover:bg-white transition-all shadow-neon"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Reset Link'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="w-full text-sm text-gray-400 hover:text-white"
                    >
                        Back to Sign In
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 bg-surface border border-white/10 p-10 rounded-3xl shadow-2xl relative z-10 backdrop-blur-sm">
        
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary transition-colors duration-300">
                <Dumbbell className="h-8 w-8 text-primary group-hover:text-black transition-colors duration-300" />
            </div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">
            {isSignUp ? 'Join the Elite' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            {isSignUp ? 'Create your profile to start booking.' : 'Access your performance dashboard.'}
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <Check className="h-4 w-4" />
              {message}
            </div>
          )}

          <div className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="sr-only">Full Name</label>
                      <div className="relative">
                          <input
                              type="text"
                              required
                              className="appearance-none block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                              placeholder="Full Name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                     </div>
                     <div>
                      <label className="sr-only">Username</label>
                      <div className="relative">
                          <input
                              type="text"
                              required
                              className="appearance-none block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                              placeholder="Username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                     </div>
                </div>
                
                <div>
                  <label htmlFor="phone-number" className="sr-only">Phone Number</label>
                  <div className="relative">
                    <input
                        id="phone-number"
                        type="tel"
                        required
                        className="appearance-none block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition-all"
                        placeholder="Phone Number (e.g. +1 555 123 4567)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm transition-all"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    required
                    className="appearance-none block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              
              {isSignUp && password.length > 0 && (
                <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">Password Strength</span>
                        <span className={`text-xs font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${strengthInfo.color} transition-all duration-300`} 
                            style={{ width: `${(strength / 3) * 100}%` }}
                        />
                    </div>
                </div>
              )}
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      className={`appearance-none block w-full pl-10 pr-4 py-3 border ${confirmPassword && confirmPassword !== password ? 'border-red-500/50 focus:ring-red-500' : 'border-white/10 focus:ring-primary'} bg-white/5 placeholder-gray-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:border-transparent focus:z-10 sm:text-sm transition-all`}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
             <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-gray-400 hover:text-primary transition-colors">
                Forgot Password?
             </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || (isSignUp && (password !== confirmPassword || strength === 0))}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-black bg-primary hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-neon disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
