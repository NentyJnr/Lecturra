import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Loader2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OAuthProviders } from '../../components/auth/OAuthProviders';
import { useLoginMutation } from '../../hooks/useAuthMutations';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginEmail = email || 'prof.john.smith@university.edu';
    const loginPassword = password || 'Password123!';
    loginMutation.mutate({ email: loginEmail, password: loginPassword });
  };

  const handleDemoSignIn = () => {
    const demoEmail = 'prof.john.smith@university.edu';
    const demoPassword = 'Password123!';
    setEmail(demoEmail);
    setPassword(demoPassword);
    loginMutation.mutate({ email: demoEmail, password: demoPassword });
  };

  const errorMessage = loginMutation.error
    ? (loginMutation.error as any)?.response?.data?.message || 'Invalid email or password credentials.'
    : loginMutation.data && !loginMutation.data.success
    ? loginMutation.data.message
    : null;

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Welcome back! Please enter your credentials to access Lectura Portal."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 text-sm shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Authentication Failed</p>
              <p className="text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Quick Demo Seed User Banner */}
        <div className="p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-lectura-blue-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-lectura-slate-800">Seed User: Prof. John Smith</span>
          </div>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loginMutation.isPending}
            className="px-3 py-1 bg-lectura-blue-600 hover:bg-lectura-blue-700 active:bg-lectura-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition-all cursor-pointer"
          >
            Quick Sign In
          </button>
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lectura-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (e.g. prof.john.smith@university.edu)"
              className="w-full pl-11 pr-4 py-3.5 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-senior-base text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all font-medium"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-lectura-blue-600 hover:text-lectura-blue-800 hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-lectura-slate-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-11 py-3.5 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-senior-base text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-lectura-slate-400 hover:text-lectura-slate-600 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </>
          )}
        </button>

        {/* OAuth SSO Providers */}
        <OAuthProviders actionLabel="sign in with" />

        {/* Register Redirect Prompt */}
        <div className="text-center pt-4 border-t border-lectura-slate-100">
          <p className="text-sm font-medium text-lectura-slate-600">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-lectura-blue-600 hover:text-lectura-blue-800 hover:underline transition-colors ml-1"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
