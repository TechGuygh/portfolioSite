import React, { useState } from 'react';
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  Fingerprint,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './Card';
import { 
  db,
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  doc,
  setDoc,
  serverTimestamp
} from '../firebase';
import toast from 'react-hot-toast';

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (showForgot) {
        await sendPasswordResetEmail(auth, email);
        toast.success("Password reset link sent to your email!");
        setShowForgot(false);
      } else if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
        onSuccess?.();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Explicitly create user profile for email signup
        const defaultRole = email === 'nana038mail@gmail.com' ? 'Admin' : 'Salesperson';
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: username || email.split('@')[0],
          role: defaultRole,
          createdAt: serverTimestamp()
        });
        
        toast.success("Account created successfully!");
        onSuccess?.();
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "An authentication error occurred.";
      
      if (error.code === 'auth/invalid-credential') {
        message = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Access to this account has been temporarily disabled. Please wait a few minutes or reset your password.";
      } else if (error.code === 'auth/user-not-found') {
        message = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Incorrect password.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Please log in instead.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password should be at least 6 characters.";
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      let message = "Google Sign-In failed.";
      if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in popup was closed. Please try again.";
      } else if (error.code === 'auth/cancelled-by-user') {
        message = "Sign-in was cancelled.";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        message = "An account already exists with this email but using a different sign-in method.";
      } else if (error.message) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20 mb-4">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">ShopAssist</h1>
          <p className="text-slate-500 mt-2 font-medium">Enterprise Retail Management</p>
        </motion.div>

        <Card className="p-8 shadow-xl shadow-slate-200/50 border-slate-100">
          <AnimatePresence mode="wait">
            {showForgot ? (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
                  <p className="text-sm text-slate-500 mt-1">Enter your email and we'll send you a link to reset your password.</p>
                </div>
                
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
                    {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="w-full text-slate-500 text-sm font-medium hover:text-slate-900 transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Back to Login
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key={isLogin ? "login" : "signup"}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {isLogin 
                      ? "Securely access your business dashboard." 
                      : "Start managing your store with precision."}
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="text" 
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                          placeholder="johndoe"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                      {isLogin && (
                        <button 
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
                        >
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Register")}
                    {!isLoading && <Fingerprint size={20} className="group-hover:scale-110 transition-transform" />}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
                    <span className="bg-white px-4 text-slate-400">Secure Access</span>
                  </div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-[0.98]"
                >
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 grayscale opacity-70 group-hover:grayscale-0" referrerPolicy="no-referrer" />
                  Sign in with Google
                </button>

                <div className="mt-8 text-center text-sm font-medium text-slate-500">
                  {isLogin ? "New to ShopAssist?" : "Already Have account?"} {" "}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4 decoration-2 decoration-emerald-200"
                  >
                    {isLogin ? "Create account" : "Log in instead"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
        
        <p className="mt-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Lock size={12} />
          Protected by industry standard encryption
        </p>
      </div>
    </div>
  );
};
