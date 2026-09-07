import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useForgotPasswordMutation } from '../../hooks/useAuthMutations';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const forgotMutation = useForgotPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    forgotMutation.mutate({ email });
  };

  const isSuccess = forgotMutation.data?.success;
  const errorMessage = forgotMutation.error
    ? (forgotMutation.error as any)?.response?.data?.message || 'Failed to process password reset request.'
    : forgotMutation.data && !forgotMutation.data.success
    ? forgotMutation.data.message
    : null;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your registered email address and we will send you password reset instructions."
    >
      {isSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 bg-blue-100 text-lectura-blue-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-lectura-slate-900">Reset Email Sent</h3>
            <p className="text-sm text-lectura-slate-600 max-w-sm mx-auto">
              We have sent password recovery instructions to <strong className="text-lectura-slate-900">{email}</strong>.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-base"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 text-sm shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Error</p>
                <p className="text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

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
                placeholder="Email"
                className="w-full pl-11 pr-4 py-3.5 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-senior-base text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={forgotMutation.isPending}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60"
          >
            {forgotMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </button>

          <div className="text-center pt-4 border-t border-lectura-slate-100">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 font-bold text-lectura-slate-600 hover:text-lectura-blue-600 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
