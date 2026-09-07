import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OAuthProviders } from '../../components/auth/OAuthProviders';
import { useRegisterMutation } from '../../hooks/useAuthMutations';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: 'Prof.',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    location: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const registerMutation = useRegisterMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match. Please verify your password.');
      return;
    }

    const { confirmPassword, ...commandData } = formData;
    registerMutation.mutate(commandData);
  };

  const isSuccess = registerMutation.data?.success;
  const apiError = registerMutation.error
    ? (registerMutation.error as any)?.response?.data?.message || 'Registration failed. Please check your inputs.'
    : registerMutation.data && !registerMutation.data.success
    ? registerMutation.data.message
    : null;

  const errorMessage = validationError || apiError;

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Enter your details below to create your Lectura Portal account."
    >
      {isSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-lectura-slate-900">Registration Successful!</h3>
            <p className="text-sm text-lectura-slate-600 max-w-sm mx-auto">
              We have sent a verification email to <strong className="text-lectura-slate-900">{formData.email}</strong>. Please check your inbox to activate your account.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-base"
          >
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900 text-sm shadow-xs">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Registration Error</p>
                <p className="text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Title & Full Name */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5 col-span-1">
              <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Title</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-semibold text-lectura-slate-900 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all cursor-pointer"
              >
                <option value="Prof.">Prof.</option>
                <option value="Dr.">Dr.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>

            <div className="space-y-1.5 col-span-2 sm:col-span-3">
              <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-3 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-medium text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full pl-10 pr-3 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-medium text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all"
              />
            </div>
          </div>

          {/* Password & Confirm Password (2 Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-medium text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-lectura-slate-400 hover:text-lectura-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-10 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-medium text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all"
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
          </div>

          {/* Phone Number & Location (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Phone (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-3 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-medium text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-lectura-slate-700 uppercase tracking-wider">Location (Optional)</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-lectura-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location / Institution"
                  className="w-full pl-10 pr-3 py-3 bg-lectura-slate-50/80 border border-lectura-slate-200 rounded-xl text-sm font-medium text-lectura-slate-900 placeholder:text-lectura-slate-400 focus:bg-white focus:border-lectura-blue-600 focus:ring-4 focus:ring-lectura-blue-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60 mt-4"
          >
            {registerMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* OAuth SSO Providers */}
          <OAuthProviders actionLabel="register with" />

          {/* Login Redirect */}
          <div className="text-center pt-3 border-t border-lectura-slate-100">
            <p className="text-sm font-medium text-lectura-slate-600">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-lectura-blue-600 hover:text-lectura-blue-800 hover:underline ml-1">
                Sign In Instead
              </Link>
            </p>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
