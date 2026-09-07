import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useCurrentUserQuery } from '../hooks/useCurrentUser';
import {
  BookOpen,
  LogOut,
  Target,
  Calendar,
  DollarSign,
  Award,
  TrendingUp,
  AlertTriangle,
  Layers,
  UserCheck,
  Building,
  Loader2,
} from 'lucide-react';

export const DashboardPreview: React.FC = () => {
  const dispatch = useDispatch();
  const { data: userProfile, isLoading, error } = useCurrentUserQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-lectura-slate-50 text-lectura-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-lectura-slate-200 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-lectura-blue-600 rounded-xl text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-lectura-slate-900">Lectura Portal</span>
              <p className="text-xs text-lectura-slate-600 font-medium">Enterprise Assessment & Question Bank Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-lectura-slate-100 rounded-xl border border-lectura-slate-200 text-xs font-medium">
              <Building className="w-4 h-4 text-lectura-slate-600" />
              <span>{userProfile?.location || 'University Faculty'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-xl text-sm transition-all border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Deep Royal Navy Banner (Inspired directly by reference image) */}
        <div className="bg-gradient-to-r from-lectura-navy-900 via-lectura-navy-800 to-lectura-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-0.5 bg-blue-500/30 text-blue-200 rounded-full text-xs font-semibold border border-blue-400/30">
                Academic Dashboard Scoped
              </span>
              <span className="text-xs text-lectura-navy-100">
                {userProfile?.email || 'authenticated.lecturer@university.edu'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {isLoading ? 'Lecturer...' : userProfile?.fullName ? `${userProfile.title ? userProfile.title + ' ' : ''}${userProfile.fullName}` : 'Faculty Member'}
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl">
              All question bank metrics, active quota limits, assessment pipelines, and ingestion logs are synchronized for your user account.
            </p>
          </div>

          <div className="z-10 flex items-center gap-3">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
              <p className="text-xs text-lectura-navy-100 uppercase tracking-wider font-semibold">Faculty ID</p>
              <p className="text-lg font-bold text-white">#{userProfile?.id?.substring(0, 6) || 'LEC-2026'}</p>
            </div>
          </div>
        </div>

        {/* User Profile Status Box */}
        {isLoading ? (
          <div className="p-8 bg-white rounded-2xl border border-lectura-slate-200 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-lectura-blue-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-lectura-slate-600">Fetching Academic Profile via React Query...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Profile query returned offline mode. Authenticated session active.</span>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-lectura-slate-200 p-6 shadow-card-soft grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-lectura-blue-600 rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Account Role</p>
                <p className="text-lg font-bold text-lectura-slate-900">{userProfile?.role || 'Senior Lecturer'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Location / Institution</p>
                <p className="text-lg font-bold text-lectura-slate-900">{userProfile?.location || 'Academic Affairs'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Status</p>
                <p className="text-lg font-bold text-green-700">Verified Academic</p>
              </div>
            </div>
          </div>
        )}

        {/* 10-Card Metric Grid (Directly Inspired by Provided Reference Image) */}
        <div>
          <h3 className="text-lg font-bold text-lectura-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-lectura-blue-600" />
            <span>Academic Performance & Assessment Overview</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Question Quota</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">10,000</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">Annual Allocation</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Ingestion Limit</span>
                <div className="p-2 bg-blue-50 text-lectura-blue-600 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">250 MB</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">Through Q3 Active</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Questions Created</span>
                <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-green-700">6,420</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">64.2% Utilization</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Accuracy Rate</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">98.4%</p>
                <div className="w-full bg-lectura-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-lectura-blue-600 h-full rounded-full w-[98.4%]"></div>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Assessments Delivered</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-purple-700">42 Exams</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">Semester Target Exceeded</p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Remaining Quota</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Target className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-700">3,580</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">Required to hit year target</p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Projected Growth</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">+24.5%</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">vs Previous Semester</p>
              </div>
            </div>

            {/* Card 8 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Pending Documents</span>
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-red-700">2 Ingestions</p>
                <p className="text-xs text-red-600 mt-0.5">Awaiting Indexing</p>
              </div>
            </div>

            {/* Card 9 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Ingestion Success</span>
                <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">99.1%</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">OCR & Text Processing</p>
              </div>
            </div>

            {/* Card 10 */}
            <div className="bg-white rounded-2xl p-5 border border-lectura-slate-200/80 shadow-card-soft hover:shadow-card-hover transition-all space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-lectura-slate-600 uppercase tracking-wider">Course Modules</span>
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-lectura-slate-900">8 Active</p>
                <p className="text-xs text-lectura-slate-600 mt-0.5">Assigned Courses</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
