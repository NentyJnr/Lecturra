import React, { useState } from 'react';
import { Settings, CheckCircle2 } from 'lucide-react';
import { useCurrentUserQuery } from '../hooks/useCurrentUser';

export const SettingsPage: React.FC = () => {
  const { data: userProfile } = useCurrentUserQuery();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-lectura-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lectura-slate-100 text-lectura-slate-800 rounded-xl">
              <Settings className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-lectura-slate-900 tracking-tight">Faculty Settings</h1>
          </div>
          <p className="text-sm text-lectura-slate-500 font-medium mt-1">
            Manage your lecturer profile, academic department details, and account security.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-lectura-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {saved && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2 text-green-800 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span>Faculty Profile Settings Updated Successfully!</span>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-base font-bold text-lectura-slate-900 border-b border-lectura-slate-100 pb-2">Academic Profile</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-lectura-slate-700 uppercase tracking-wider">Title & Full Name</label>
              <input
                type="text"
                defaultValue={`${userProfile?.title || 'Prof.'} ${userProfile?.fullName || 'John Smith'}`}
                className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl font-medium focus:bg-white focus:border-lectura-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-lectura-slate-700 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                defaultValue={userProfile?.email || 'prof.john.smith@university.edu'}
                disabled
                className="w-full px-4 py-3 bg-lectura-slate-100 border border-lectura-slate-200 rounded-xl font-medium text-lectura-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-lectura-slate-700 uppercase tracking-wider">Academic Role</label>
              <input
                type="text"
                defaultValue={userProfile?.role || 'Senior Lecturer'}
                className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl font-medium focus:bg-white focus:border-lectura-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-lectura-slate-700 uppercase tracking-wider">Institution / Department</label>
              <input
                type="text"
                defaultValue={userProfile?.location || 'University of Oxford - Department of Computer Science'}
                className="w-full px-4 py-3 bg-lectura-slate-50 border border-lectura-slate-200 rounded-xl font-medium focus:bg-white focus:border-lectura-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-xs cursor-pointer"
          >
            Save Settings Changes
          </button>
        </div>
      </form>
    </div>
  );
};
