import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, Mail, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useResetPasswordMutation } from '../../hooks/useAuthMutations';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const resetMutation = useResetPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!newPassword || newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    resetMutation.mutate({ email, token, newPassword });
  };

  const isSuccess = resetMutation.data?.success;
  const apiError = resetMutation.error
    ? (resetMutation.error as any)?.response?.data?.message || 'Password reset failed.'
    : resetMutation.data && !resetMutation.data.success
    ? resetMutation.data.message
    : null;

  return (
    <AuthLayout
      title="Set New Account Password"
      subtitle="Enter your email and choose a strong new password for your faculty account."
    >
      {isSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-lectura-slate-900">Password Reset Complete</h3>
            <p className="text-sm text-lectura-slate-600">
              Your password has been updated successfully. You may now sign in with your new credentials.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-lectura-blue-600 hover:bg-lectura-blue-700 text-white font-bold rounded-xl shadow-md transition-all text-senior-base"
          >
            Sign In with New Password
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {(validationError || apiError) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-900 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Reset Error</p>
                <p className="text-red-700 mt-0.5">{validationError || apiError}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-lectura-slate-800">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-lectura-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-9 pr-3 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-600/20"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-lectura-slate-800">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-lectura-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-9 pr-10 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-600/20"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-lectura-slate-400 hover:text-lectura-slate-600 focus:outline-none"
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-lectura-slate-800">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-lectura-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-9 pr-10 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-lectura-blue-600 focus:ring-2 focus:ring-lectura-blue-600/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-lectura-slate-400 hover:text-lectura-slate-600 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="w-full py-4 px-6 bg-lectura-blue-600 hover:bg-lectura-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-senior-base disabled:opacity-60 mt-2"
          >
            {resetMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>

          <div className="text-center pt-3 border-t border-lectura-slate-100">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-lectura-slate-600 hover:text-lectura-blue-600">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
