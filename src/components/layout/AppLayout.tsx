import React, { useState } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  BookOpen,
  FolderTree,
  Sliders,
  BarChart3,
  FileSpreadsheet,
  Megaphone,
  History,
  Settings,
  User,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Check,
  ClipboardList,
  Upload,
  CalendarCheck,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  LogOut,
  Info,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types/academic';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  onExitToLanding?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onLogout, onExitToLanding }) => {
  const {
    currentRole,
    setCurrentRole,
    selectedCollegeId,
    setSelectedCollegeId,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    colleges,
    alerts,
    announcements,
    toasts,
    dismissToast,
    showToast,
    studentJoinRequests,
    correctionRequests
  } = useApp();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const activeCollege = colleges.find((c) => c.id === selectedCollegeId) || colleges[0];
  const pendingRequestsCount = studentJoinRequests?.filter((r) => r.status === 'pending').length || 0;
  const activeClassAlertsCount = alerts.filter((a) => a.status === 'open' && a.classId === 'cls-1').length;
  const teacherAlertsCount = alerts.filter((a) => a.subjectCode === '21CS52' || a.subjectCode === '21CSL57').length;
  const teacherCorrectionsCount = (correctionRequests || []).filter((r) => (r.subjectCode === '21CS52' || r.subjectCode === '21CSL57') && r.status === 'pending').length;

  const studentAlertsCount = alerts.filter((a) => a.studentUsn === '1RV22CS084').length;

  const adminNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'class-teacher-management', label: 'Class Teacher Management', icon: UserCheck },
    { id: 'classes-overview', label: 'Classes Overview', icon: FolderTree },
    { id: 'role-access', label: 'Role & Access Management', icon: Shield },
    { id: 'system-overview', label: 'System Overview', icon: Building2 },
    { id: 'audit-logs', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const classTeacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-classroom', label: 'My Classroom', icon: FolderTree },
    { id: 'student-management', label: 'Student Management', icon: Users, badge: pendingRequestsCount },
    { id: 'teacher-management', label: 'Teacher Management', icon: UserCheck },
    { id: 'academic-management', label: 'Academic Management', icon: Award },
    { id: 'communication-monitoring', label: 'Communication & Monitoring', icon: Megaphone, badge: activeClassAlertsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-classes-subjects', label: 'My Classes & Subjects', icon: BookOpen },
    { id: 'academic-management', label: 'Academic Management', icon: CalendarCheck, badge: teacherCorrectionsCount > 0 ? teacherCorrectionsCount : undefined },
    { id: 'academic-insights', label: 'Academic Insights', icon: BarChart3, badge: teacherAlertsCount > 0 ? teacherAlertsCount : undefined },
    { id: 'communication', label: 'Communication', icon: Megaphone },
    { id: 'settings-profile', label: 'Settings & Profile', icon: User },
  ];

  const studentNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'my-academics', label: 'My Academics', icon: CalendarCheck },
    { id: 'academic-insights', label: 'Academic Insights', icon: BarChart3, badge: studentAlertsCount > 0 ? studentAlertsCount : 2 },
    { id: 'academic-resources', label: 'Academic Resources', icon: BookOpen },
    { id: 'communication', label: 'Communication', icon: Megaphone },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentNavItems =
    currentRole === 'admin'
      ? adminNavItems
      : currentRole === 'class_teacher'
      ? classTeacherNavItems
      : currentRole === 'teacher'
      ? teacherNavItems
      : studentNavItems;

  const getRoleDetails = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Admin (Platform Owner)',
          badgeText: 'Admin',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
          userName: 'Prof. Rehan (Admin)',
          sub: 'Platform Controller • All Colleges'
        };
      case 'class_teacher':
        return {
          title: 'Class Teacher',
          badgeText: 'Class Teacher',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          userName: 'Dr. K. Srinivas',
          sub: '5th Sem CSE-A Coordinator • RVCE'
        };
      case 'teacher':
        return {
          title: 'Subject Teacher',
          badgeText: 'Teacher',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          userName: 'Prof. Ananya Sharma',
          sub: 'Computer Networks & DBMS • RVCE'
        };
      case 'student':
        return {
          title: 'Student',
          badgeText: 'Student',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          userName: 'Rahul Sharma',
          sub: 'USN: 1RV22CS084 • 5th Sem CSE-A'
        };
    }
  };

  const roleInfo = getRoleDetails(currentRole);

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col text-gray-900 font-sans antialiased">
      {/* 1. Clean, Minimal Top Navbar */}
      <header className="bg-black text-white px-3.5 sm:px-6 h-14 shrink-0 flex items-center justify-between gap-3 sticky top-0 z-50 border-b border-gray-800 shadow-xs">
        {/* Left: Mobile Sidebar Toggle + Academio Logo & Brand Name */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-1.5 -ml-1 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg md:hidden transition-colors shrink-0"
            aria-label="Toggle navigation menu"
            title="Toggle menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
              <GraduationCap size={18} />
            </div>
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-sm sm:text-base font-black tracking-tight text-white truncate">Academio</span>
              <span className="text-[11px] font-semibold text-gray-400 hidden sm:inline truncate">
                Your Academic Hub
              </span>
            </div>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileMenuOpen(false);
              }}
              className="relative p-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={18} />
              {alerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-black" />
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotificationsOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Notifications & Alerts</h4>
                      <p className="text-[10px] text-gray-400">{alerts.length} academic items require attention</p>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full">
                      {alerts.filter((a) => a.severity === 'critical').length} Critical
                    </span>
                  </div>

                  <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                    {alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-left">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-gray-900 truncate">{alert.title}</span>
                          <span className="text-[9px] font-bold text-rose-600 uppercase tracking-wider">
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2">{alert.reason}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{alert.studentName} ({alert.studentUsn})</p>
                      </div>
                    ))}
                    {announcements.slice(0, 1).map((ann) => (
                      <div key={ann.id} className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-left">
                        <p className="font-bold text-blue-900 truncate">{ann.title}</p>
                        <p className="text-[11px] text-blue-700/80 line-clamp-2">{ann.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                    <button
                      onClick={() => {
                        setCurrentPage(
                          currentRole === 'teacher' ? 'academic-insights' :
                          currentRole === 'student' ? 'communication' :
                          currentRole === 'class_teacher' ? 'communication-monitoring' : 'dashboard'
                        );
                        setIsNotificationsOpen(false);
                      }}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      View All Alerts
                    </button>
                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-gray-500 hover:text-black font-semibold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors border border-gray-800"
              aria-label="User profile menu"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {roleInfo.userName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {roleInfo.userName}
                </p>
                <p className="text-[10px] text-gray-400 leading-none capitalize">{currentRole.replace('_', ' ')}</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>

            {isProfileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 border border-gray-200 rounded-2xl shadow-xl z-50 p-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="pb-3 border-b border-gray-100 text-left">
                    <p className="text-xs font-black text-gray-900 truncate">{roleInfo.userName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{roleInfo.sub}</p>
                    <span className={`inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
                      {roleInfo.badgeText}
                    </span>
                  </div>

                  <div className="py-2 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setCurrentPage(
                          currentRole === 'teacher' ? 'settings-profile' :
                          currentRole === 'student' ? 'profile' : 'settings'
                        );
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                      View My Profile
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPage(currentRole === 'teacher' ? 'settings-profile' : 'settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                    >
                      Account Settings
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden relative">
        {/* 2. Left Sidebar (Role-Specific) */}
        <aside
          className={`fixed inset-y-0 left-0 top-14 z-40 w-64 h-[calc(100vh-3.5rem)] bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out md:sticky md:top-14 md:translate-x-0 md:h-full shrink-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm shrink-0">
                <GraduationCap size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-black tracking-tight text-gray-900 truncate">Academio</h2>
                <p className="text-[10px] font-semibold text-gray-500 truncate">{activeCollege.name}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg md:hidden"
            >
              <X size={18} />
            </button>
          </div>

          {/* Current Persona Card */}
          <div className="p-3 mx-3 mt-3 bg-gray-50 border border-gray-200/80 rounded-xl">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${roleInfo.badgeColor}`}>
                {roleInfo.badgeText}
              </span>
              <span className="text-[10px] font-bold text-gray-400">VTU 2025-26</span>
            </div>
            <p className="text-xs font-bold text-gray-900 truncate">{roleInfo.userName}</p>
            <p className="text-[10.5px] text-gray-500 font-medium truncate">{roleInfo.sub}</p>
          </div>

          {/* Sidebar Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 custom-scrollbar">
            <div className="px-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              {currentRole.replace('_', ' ')} Navigation
            </div>
            {currentNavItems.map((item) => {
              const isActive =
                currentPage === item.id ||
                (currentRole === 'teacher' && (
                  (item.id === 'my-classes-subjects' && ['my-classes-subjects', 'student-directory'].includes(currentPage)) ||
                  (item.id === 'academic-management' && ['academic-management', 'attendance', 'ia-marks', 'assignments', 'correction-requests'].includes(currentPage)) ||
                  (item.id === 'academic-insights' && ['academic-insights', 'subject-analytics', 'academic-alerts', 'reports'].includes(currentPage)) ||
                  (item.id === 'communication' && ['communication', 'announcements', 'notifications'].includes(currentPage)) ||
                  (item.id === 'settings-profile' && ['settings-profile', 'settings', 'profile'].includes(currentPage))
                )) ||
                (currentRole === 'class_teacher' && (
                  (item.id === 'student-management' && ['student-management', 'student-requests'].includes(currentPage)) ||
                  (item.id === 'communication-monitoring' && ['communication-monitoring', 'notifications', 'reports', 'early-alerts', 'announcements'].includes(currentPage)) ||
                  (item.id === 'academic-management' && ['academic-management', 'attendance', 'ia-marks', 'assignments'].includes(currentPage))
                )) ||
                (currentRole === 'student' && (
                  (item.id === 'my-academics' && ['my-academics', 'attendance', 'ia-marks', 'assignments'].includes(currentPage)) ||
                  (item.id === 'academic-insights' && ['academic-insights', 'academic-alerts', 'performance-analytics', 'what-if-calculator'].includes(currentPage)) ||
                  (item.id === 'academic-resources' && ['academic-resources', 'academic-calendar', 'study-resources'].includes(currentPage)) ||
                  (item.id === 'communication' && ['communication', 'notifications', 'announcements'].includes(currentPage))
                ));
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'logout') {
                      if (onLogout) {
                        onLogout();
                      } else {
                        showToast(`Logged out from ${roleInfo.title}`, 'info');
                      }
                      return;
                    }
                    setCurrentPage(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-black text-white shadow-xs font-bold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon size={16} className={isActive ? 'text-blue-400' : 'text-gray-400'} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span className="font-semibold truncate">VTU BE CSE • 5th Sem</span>
              <button
                onClick={() => showToast('Session logs synced for demonstration', 'info')}
                className="text-blue-600 font-bold hover:underline"
              >
                Sync
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-30 md:hidden"
          />
        )}

        {/* 3. Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          {/* Top Workspace Header (Breadcrumb & Search) */}
          <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              {/* Breadcrumb & Section Title */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 truncate">
                  <span>{activeCollege.code}</span>
                  <span>/</span>
                  <span className="capitalize">{currentRole.replace('_', ' ')}</span>
                  <span>/</span>
                  <span className="text-gray-700 capitalize">{currentPage.replace('-', ' ')}</span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight capitalize truncate">
                  {currentPage.replace('-', ' ')}
                </h1>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Quick Search */}
              <div className="relative w-40 sm:w-56 lg:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students, USN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all shadow-2xs"
                />
              </div>
            </div>
          </header>

          {/* Main Page Workspace */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Floating Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          const typeColors = {
            success: 'bg-gray-950 text-white border-gray-800',
            info: 'bg-blue-900 text-white border-blue-700',
            warning: 'bg-amber-900 text-white border-amber-700',
            error: 'bg-rose-950 text-white border-rose-800'
          };
          const icons = {
            success: <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />,
            info: <Info size={16} className="text-blue-300 shrink-0" />,
            warning: <AlertCircle size={16} className="text-amber-300 shrink-0" />,
            error: <AlertCircle size={16} className="text-rose-400 shrink-0" />
          };
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${typeColors[toast.type]}`}
            >
              <div className="flex items-center gap-2">
                {icons[toast.type]}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-400 hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
