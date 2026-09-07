import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-lectura-slate-50 to-blue-50/40 flex flex-col justify-between selection:bg-lectura-blue-100 selection:text-lectura-blue-800 font-sans">
      {/* Top Navbar */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-lectura-navy-900 text-white rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-lectura-slate-900">
              Lectura Portal
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-lectura-slate-600 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-lectura-slate-200 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-lectura-blue-600" />
            <span>Secure Academic SSL</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Card Container */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-lectura-slate-200/80 p-8 sm:p-10 space-y-6 relative overflow-hidden">
            {/* Ambient Background Glow Effect Behind Header */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-blue-400/15 to-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Centralized Brand Emblem */}
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-lectura-navy-900 to-lectura-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-lectura-blue-600/25 border border-white/20 mb-4 transform hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>

              {/* Centralized Heading & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-lectura-slate-900 tracking-tight text-center">
                {title}
              </h2>
              <p className="text-sm text-lectura-slate-600 font-medium text-center max-w-sm mx-auto mt-1.5 leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Form Content */}
            <div className="relative pt-2">
              {children}
            </div>
          </div>

          {/* Accessibility Info Footer */}
          <p className="text-center text-xs font-medium text-lectura-slate-500 mt-6">
            Lectura Portal • High Legibility & Accessibility Standard (WCAG 2.2 AA)
          </p>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-4 text-center text-xs text-lectura-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Lectura Portal. All rights reserved.</span>
          <div className="flex gap-4 text-lectura-slate-600 font-medium">
            <a href="#help" className="hover:text-lectura-blue-600 transition-colors">Support</a>
            <span>•</span>
            <a href="#privacy" className="hover:text-lectura-blue-600 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
