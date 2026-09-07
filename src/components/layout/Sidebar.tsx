import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpenCheck,
  FileText,
  ClipboardList,
  FileSpreadsheet,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

const navItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Question Bank',
    path: '/question-bank',
    icon: BookOpenCheck,
    badge: '6.4k',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Document Ingestion',
    path: '/ingestion',
    icon: FileText,
    badge: '2 New',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Assessments',
    path: '/assessments',
    icon: ClipboardList,
    badge: '42 Active',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    name: 'Score Reports',
    path: '/score-reports',
    icon: FileSpreadsheet,
    badge: 'Reports',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Quota & Usage',
    path: '/quota',
    icon: CreditCard,
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
  },
];

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('lectura_sidebar_collapsed') === 'true';
  });

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lectura_sidebar_collapsed', isCollapsed.toString());
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={`bg-white border-r border-lectura-slate-200/80 flex flex-col justify-between transition-all duration-300 ease-in-out sticky top-0 h-screen z-40 select-none shadow-xs ${
        isCollapsed ? 'w-20' : 'w-64 sm:w-70'
      }`}
    >
      {/* Top Brand Logo Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-lectura-slate-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-gradient-to-tr from-lectura-navy-900 to-lectura-blue-600 text-white rounded-xl shadow-md shadow-lectura-blue-600/20 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>

            {!isCollapsed && (
              <div className="truncate">
                <span className="font-extrabold text-lg tracking-tight text-lectura-slate-900 block leading-tight">
                  Lectura Portal
                </span>
                <span className="text-[11px] font-semibold text-lectura-blue-600 uppercase tracking-wider block">
                  Academic Platform
                </span>
              </div>
            )}
          </div>

          {/* Toggle Button in Header */}
          <button
            type="button"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-2 rounded-xl text-lectura-slate-400 hover:text-lectura-slate-700 hover:bg-lectura-slate-100 focus:outline-none transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold transition-all duration-200 text-sm group relative ${
                    isActive
                      ? 'bg-lectura-blue-50 text-lectura-blue-700 font-bold border-r-4 border-lectura-blue-600 shadow-xs'
                      : 'text-lectura-slate-600 hover:text-lectura-slate-900 hover:bg-lectura-slate-50'
                  }`
                }
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-lectura-blue-600' : 'text-lectura-slate-400 group-hover:text-lectura-slate-600'
                  }`}
                />

                {!isCollapsed && (
                  <span className="truncate flex-1 font-semibold">{item.name}</span>
                )}

                {!isCollapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full ${
                      item.badgeColor || 'bg-lectura-slate-100 text-lectura-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Hover Tooltip in Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-lectura-slate-900 text-white text-xs font-bold rounded-xl shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-3 border-t border-lectura-slate-100">
        {!isCollapsed ? (
          <div className="p-3 bg-lectura-slate-50 rounded-2xl border border-lectura-slate-200/60 text-xs text-lectura-slate-600 space-y-1">
            <p className="font-bold text-lectura-slate-800">Lectura Enterprise</p>
            <p className="text-[11px] text-lectura-slate-500">Academic v2.4 • System Active</p>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Lectura Enterprise v2.4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
};
