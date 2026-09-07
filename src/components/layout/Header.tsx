import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useCurrentUserQuery } from '../../hooks/useCurrentUser';
import { Building, LogOut, Target, UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { data: userProfile, isLoading } = useCurrentUserQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-lectura-slate-200/80 px-4 sm:px-8 py-3 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Active Institution & Workspace Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-lectura-slate-100/80 rounded-xl border border-lectura-slate-200 text-xs font-semibold text-lectura-slate-700">
            <Building className="w-4 h-4 text-lectura-blue-600" />
            <span>{userProfile?.location || 'University of Oxford'}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-xl border border-purple-200 text-xs font-bold text-purple-700">
            <Target className="w-4 h-4 text-purple-600" />
            <span>3,580 Quota Remaining</span>
          </div>
        </div>

        {/* User Avatar & Session Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 pr-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-lectura-navy-900 to-lectura-blue-600 text-white font-bold rounded-xl flex items-center justify-center text-sm shadow-xs border border-white/20">
              {isLoading
                ? 'JS'
                : `${userProfile?.fullName?.[0] || 'J'}${userProfile?.fullName?.split(' ')?.[1]?.[0] || 'S'}`}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-extrabold text-lectura-slate-900 leading-tight">
                {isLoading ? 'Lecturer' : `${userProfile?.title ? userProfile.title + ' ' : ''}${userProfile?.fullName || 'John Smith'}`}
              </p>
              <p className="text-[11px] text-lectura-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3 h-3 text-green-600" />
                <span>{userProfile?.role || 'Senior Lecturer'}</span>
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="flex items-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 font-bold rounded-xl text-xs transition-all border border-red-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
