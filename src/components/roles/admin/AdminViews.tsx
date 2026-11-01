import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  GraduationCap,
  FolderTree,
  Building2,
  Shield,
  Sliders,
  History,
  Settings,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Edit2,
  Check,
  X,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Eye,
  ArrowRight,
  UserPlus,
  RefreshCw,
  Info,
  BookOpen,
  Lock,
  ChevronRight,
  Award,
  LogOut
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { UserAccount, UserRole, ClassTeacher, AuditLogItem } from '../../../types/academic';

export const AdminViews: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    userAccounts,
    classTeachers,
    subjectTeachers,
    students,
    classes,
    auditLogs,
    academicConfig,
    updateAcademicConfig,
    addUserAccount,
    updateUserAccount,
    toggleUserStatus,
    changeUserRole,
    createClassTeacherAccount,
    promoteTeacherToClassTeacher,
    assignClassTeacherToClass,
    removeClassTeacherAssignment,
    toggleClassTeacherStatus,
    showToast,
    searchTerm,
    setSearchTerm
  } = useApp();

  // --- Local Search & Filters ---
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [classTeacherFilter, setClassTeacherFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState<string>('');

  // --- Modals State ---
  // User Management Modals
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [statusConfirmUser, setStatusConfirmUser] = useState<UserAccount | null>(null);
  const [changingRoleUser, setChangingRoleUser] = useState<UserAccount | null>(null);

  // Class Teacher Modals
  const [isCreateCTModalOpen, setIsCreateCTModalOpen] = useState(false);
  const [isPromoteTeacherModalOpen, setIsPromoteTeacherModalOpen] = useState(false);
  const [assigningCT, setAssigningCT] = useState<ClassTeacher | null>(null);
  const [viewingCT, setViewingCT] = useState<ClassTeacher | null>(null);
  const [ctStatusConfirm, setCtStatusConfirm] = useState<ClassTeacher | null>(null);

  // Classes Overview Modal
  const [inspectingClass, setInspectingClass] = useState<any | null>(null);

  // Forms State
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    identifier: '',
    role: 'student' as UserRole,
    department: 'Computer Science & Engineering',
    status: 'active' as 'active' | 'inactive',
    phone: '+91 98765 00000',
    assignedClass: ''
  });

  const [newCTForm, setNewCTForm] = useState({
    name: '',
    email: '',
    identifier: '',
    phone: '+91 98450 00000',
    department: 'Computer Science & Engineering',
    status: 'active' as 'active' | 'inactive',
    assignedClassId: ''
  });

  const [promoteForm, setPromoteForm] = useState({
    teacherId: subjectTeachers[0]?.id || '',
    assignedClassId: ''
  });

  const [selectedClassIdToAssign, setSelectedClassIdToAssign] = useState<string>('');
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>('student');

  // Academic Config Form State
  const [configForm, setConfigForm] = useState(academicConfig);

  // Derived counts
  const totalUsers = userAccounts.length;
  const totalClassTeachers = classTeachers.length;
  const totalTeachers = subjectTeachers.length;
  const totalStudents = students.length;
  const totalClasses = classes.length;
  const inactiveUsersCount = userAccounts.filter((u) => u.status === 'inactive').length;

  // Filtered Users
  const filteredUsers = userAccounts.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    const matchesStatus = userStatusFilter === 'all' || user.status === userStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filtered Class Teachers
  const filteredClassTeachers = classTeachers.filter((ct) => {
    const matchesSearch =
      ct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ct.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ct.assignedClass && ct.assignedClass.toLowerCase().includes(searchTerm.toLowerCase()));
    const isAssigned = ct.assignedClassId && ct.assignedClassId.length > 0 && ct.assignedClass !== 'Unassigned';
    const matchesFilter =
      classTeacherFilter === 'all' ||
      (classTeacherFilter === 'assigned' && isAssigned) ||
      (classTeacherFilter === 'unassigned' && !isAssigned);
    return matchesSearch && matchesFilter;
  });

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesQuery =
      log.action.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(auditSearchQuery.toLowerCase());
    const matchesStatus = auditStatusFilter === 'all' || log.status === auditStatusFilter;
    return matchesQuery && matchesStatus;
  });

  // Helper for role styling
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">Administrator</span>;
      case 'class_teacher':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">Class Teacher</span>;
      case 'teacher':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">Teacher</span>;
      case 'student':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">Student</span>;
    }
  };

  // =========================================================================
  // 1. DASHBOARD VIEW
  // =========================================================================
  if (currentPage === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Banner with Clear Demo Data Notice */}
        <div className="bg-black text-white p-6 sm:p-7 rounded-3xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Shield size={14} /> Administrator Console • Central Role & Account Authority
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">System Administration Overview</h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Centralized user provisioning, Class Teacher appointments, role allocation, and institutional oversight. Academic operations (attendance records, IA marks, and assignments) remain scoped to classroom faculty.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCreateCTModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <UserPlus size={15} /> Create Class Teacher
            </button>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all border border-white/10"
            >
              <Plus size={15} /> Add User
            </button>
          </div>
        </div>

        {/* Demo Data Disclaimer Banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 uppercase tracking-wide text-[11px] block">
              Demonstration Mode • Local State Storage
            </span>
            <p className="text-amber-800 text-[11px] mt-0.5">
              This preview operates using reactive client-side mock state. Modifications (such as creating class teachers, updating roles, and assigning classrooms) update active session state and audit logs immediately for demonstration purposes.
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Users</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{totalUsers}</div>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">All 4 platform roles</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Class Teachers</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{totalClassTeachers}</div>
            <p className="text-[11px] text-blue-600 mt-0.5 font-semibold">
              {classTeachers.filter((c) => c.assignedClassId).length} assigned to classes
            </p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subject Teachers</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <BookOpen size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{totalTeachers}</div>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Teaching 6 subjects</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Students</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <GraduationCap size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{totalStudents}</div>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Enrolled in 5th Sem</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Classrooms</span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <FolderTree size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{totalClasses}</div>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Sections monitored</p>
          </div>
        </div>

        {/* Account Status Alert Badge */}
        {inactiveUsersCount > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  {inactiveUsersCount} Inactive User Account{inactiveUsersCount > 1 ? 's' : ''} on Record
                </p>
                <p className="text-[11px] text-gray-500">
                  Accounts marked inactive are prevented from signing in until reactivated by the Administrator.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setUserStatusFilter('inactive');
                setCurrentPage('user-management');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline shrink-0"
            >
              Review Inactive
            </button>
          </div>
        )}

        {/* Quick Admin Actions & Overview Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Administrative Activity (Section 4 requirement) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <History size={16} className="text-blue-600" />
                <h3 className="text-sm font-black text-gray-900">Recent Administrative Events</h3>
              </div>
              <button
                onClick={() => setCurrentPage('audit-logs')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Full Audit Log</span>
                <ArrowRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-gray-50/70 border border-gray-100 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700'
                          : log.status === 'warning'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {log.status === 'success' ? (
                        <CheckCircle2 size={14} />
                      ) : log.status === 'warning' ? (
                        <AlertTriangle size={14} />
                      ) : (
                        <Info size={14} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900">{log.action}</span>
                        <span className="text-[10px] text-gray-400">• {log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">{log.details}</p>
                      <span className="inline-block mt-1 font-semibold text-[10px] bg-white border border-gray-200 text-gray-700 px-1.5 py-0.2 rounded-md">
                        Target: {log.targetResource}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 capitalize shrink-0">{log.performerRole}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom & Role Allocation Progress */}
          <div className="space-y-6">
            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
              <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                <Sliders size={16} className="text-gray-600" />
                Administrative Shortcuts
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setIsCreateCTModalOpen(true)}
                  className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <UserCheck size={14} className="text-blue-600" />
                    <span>Create Class Teacher Account</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentPage('user-management')}
                  className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Users size={14} className="text-purple-600" />
                    <span>Manage User Accounts & Roles</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentPage('classes-overview')}
                  className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <FolderTree size={14} className="text-indigo-600" />
                    <span>Inspect Classrooms & Mentors</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
                <button
                  onClick={() => setCurrentPage('role-access')}
                  className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/60 transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-gray-800">
                    <Shield size={14} className="text-emerald-600" />
                    <span>View Role Responsibility Matrix</span>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Role Hierarchy Summary */}
            <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-xs">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">
                Role Boundary Enforcement
              </h4>
              <ul className="text-xs space-y-2.5 text-gray-300">
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Administrator:</strong> Account and role authority only.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Class Teacher:</strong> Manages assigned classroom & teachers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Subject Teacher:</strong> Records attendance & marks for subjects.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={14} className="text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Student:</strong> Personal records & What-If calculator.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. USER MANAGEMENT VIEW (Section 5)
  // =========================================================================
  if (currentPage === 'user-management') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">User Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage accounts, configure user roles, activate or suspend access, and inspect profile information.
            </p>
          </div>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 self-start sm:self-auto shadow-sm"
          >
            <UserPlus size={15} /> Create User Account
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or USN/ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Role Filter */}
            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Roles ({userAccounts.length})</option>
              <option value="admin">Administrator</option>
              <option value="class_teacher">Class Teacher</option>
              <option value="teacher">Subject Teacher</option>
              <option value="student">Student</option>
            </select>

            {/* Status Filter */}
            <select
              value={userStatusFilter}
              onChange={(e) => setUserStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* User Table (Desktop) */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10.5px] font-extrabold uppercase text-gray-400 tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-4 py-3.5">Identifier</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Last Activity</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
                      No user accounts match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900">{user.name}</div>
                            <div className="text-[11px] text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-gray-700">
                        {user.identifier}
                      </td>
                      <td className="px-4 py-3.5">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-3.5 text-gray-600 truncate max-w-[140px]">{user.department}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            user.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-[11px]">{user.lastLogin}</td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingUser(user)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                            title="View Profile Details"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setChangingRoleUser(user);
                              setNewSelectedRole(user.role);
                            }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 font-bold text-[11px]"
                            title="Change Role"
                          >
                            Role
                          </button>
                          <button
                            onClick={() => setStatusConfirmUser(user)}
                            className={`px-2 py-1 rounded-lg text-[10.5px] font-bold transition-colors ${
                              user.status === 'active'
                                ? 'text-amber-700 hover:bg-amber-50'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title={user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Card Layout (Mobile) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
                    <p className="text-[11px] text-gray-400">{user.email}</p>
                    <span className="font-mono text-[10px] text-gray-500 font-semibold">{user.identifier}</span>
                  </div>
                </div>
                <div>{getRoleBadge(user.role)}</div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    user.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  />
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="text-gray-400 text-[10px]">{user.department}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setViewingUser(user)}
                  className="flex-1 py-1.5 rounded-lg border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 text-center"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    setChangingRoleUser(user);
                    setNewSelectedRole(user.role);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs text-center"
                >
                  Change Role
                </button>
                <button
                  onClick={() => setStatusConfirmUser(user)}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-xs text-center ${
                    user.status === 'active' ? 'bg-amber-50 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. CLASS TEACHER MANAGEMENT VIEW (Section 6)
  // =========================================================================
  if (currentPage === 'class-teacher-management') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Class Teacher Management
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Appoint Class Teachers, assign or reassign classrooms, and oversee class leadership across departments.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPromoteTeacherModalOpen(true)}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Award size={15} className="text-blue-600" /> Promote Teacher
            </button>
            <button
              onClick={() => setIsCreateCTModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus size={15} /> Create Class Teacher
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Class Teachers</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">{classTeachers.length}</span>
            <span className="text-[11px] text-gray-500">Authorized faculty</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned to Classroom</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">
              {classTeachers.filter((ct) => ct.assignedClassId && ct.assignedClass !== 'Unassigned').length}
            </span>
            <span className="text-[11px] text-gray-500">Active class mentors</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Unassigned Mentors</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {classTeachers.filter((ct) => !ct.assignedClassId || ct.assignedClass === 'Unassigned').length}
            </span>
            <span className="text-[11px] text-amber-700">Available for assignment</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Monitored Students</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {classTeachers.reduce((acc, ct) => acc + (ct.totalStudents || 0), 0)}
            </span>
            <span className="text-[11px] text-gray-500">Under appointed mentors</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Class Teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setClassTeacherFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                classTeacherFilter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({classTeachers.length})
            </button>
            <button
              onClick={() => setClassTeacherFilter('assigned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                classTeacherFilter === 'assigned'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setClassTeacherFilter('unassigned')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                classTeacherFilter === 'unassigned'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unassigned
            </button>
          </div>
        </div>

        {/* Class Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClassTeachers.map((ct) => {
            const isAssigned = ct.assignedClassId && ct.assignedClass !== 'Unassigned';
            return (
              <div
                key={ct.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ct.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={ct.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
                      />
                      <div>
                        <h4 className="font-black text-gray-900 text-sm leading-tight">{ct.name}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">{ct.email}</p>
                        <span className="text-[10px] text-gray-500 font-semibold">{ct.phone}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        ct.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {ct.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Classroom Assignment Status Box */}
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      isAssigned
                        ? 'bg-blue-50/70 border-blue-200/80 text-blue-950'
                        : 'bg-amber-50/80 border-amber-200/80 text-amber-950'
                    }`}
                  >
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-0.5">
                      Classroom Assignment
                    </div>
                    <div className="flex items-center justify-between font-bold">
                      <span className="truncate">{ct.assignedClass}</span>
                      {isAssigned && (
                        <span className="text-[10px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded-full shadow-2xs border border-blue-200">
                          {ct.totalStudents} Students
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setAssigningCT(ct);
                        setSelectedClassIdToAssign(ct.assignedClassId || '');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white font-bold text-[11px] transition-colors"
                    >
                      {isAssigned ? 'Reassign' : 'Assign Class'}
                    </button>
                    {isAssigned && (
                      <button
                        onClick={() => removeClassTeacherAssignment(ct.id)}
                        className="px-2 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-[11px]"
                        title="Remove classroom assignment"
                      >
                        Unassign
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewingCT(ct)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100"
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => setCtStatusConfirm(ct)}
                      className={`text-[10.5px] font-bold px-2 py-1 rounded-lg ${
                        ct.status === 'active'
                          ? 'text-amber-700 hover:bg-amber-50'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {ct.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. CLASSES OVERVIEW VIEW (Section 7 - Read-Only for Administrator)
  // =========================================================================
  if (currentPage === 'classes-overview') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Classes Overview</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Read-only institutional classroom directory. Inspect assigned mentors, enrolled student counts, and subject allocations.
            </p>
          </div>
          <button
            onClick={() => setCurrentPage('class-teacher-management')}
            className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserCheck size={14} /> Manage Class Teachers
          </button>
        </div>

        {/* Read-Only Notice (Section 7 requirement) */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
          <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950">
            <span className="font-bold uppercase tracking-wide text-[10.5px] block text-blue-900">
              Administrative Delegation Note
            </span>
            <p className="mt-0.5 text-blue-900 leading-relaxed text-[11px]">
              Classroom-level academic operations (such as recording session attendance, evaluating internal assessment marks, posting assignments, and handling student dispute requests) are exclusively handled by the appointed Class Teacher and Subject Teachers. The Administrator oversees high-level class provisioning and teacher appointments.
            </p>
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const hasCT = cls.classTeacherId && cls.classTeacherName && cls.classTeacherName !== 'Unassigned';
            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                        Semester {cls.semester} • {cls.department}
                      </span>
                      <h4 className="text-base font-black text-gray-900 mt-0.5">{cls.name}</h4>
                      <p className="text-[11px] text-gray-400">
                        {cls.collegeName || 'RV College of Engineering'}
                      </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                      In Session
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    {/* Assigned Class Teacher */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck size={15} className={hasCT ? 'text-blue-600' : 'text-amber-500'} />
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Assigned Class Teacher</div>
                          <div className="font-bold text-gray-900 text-xs">
                            {cls.classTeacherName || 'Unassigned'}
                          </div>
                        </div>
                      </div>
                      {!hasCT && (
                        <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          Action Needed
                        </span>
                      )}
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-2 gap-2 text-center pt-1">
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-base font-black text-gray-900">{cls.totalStudents}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Enrolled Students</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                        <div className="text-base font-black text-gray-900">{cls.roomNumber || 'CS-201'}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Room / Block</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-semibold">AY {cls.academicYear}</span>
                  <button
                    onClick={() => setInspectingClass(cls)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Class Info</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // =========================================================================
  // 5. ROLE & ACCESS MANAGEMENT VIEW (Section 8)
  // =========================================================================
  if (currentPage === 'role-access') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Role & Access Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Overview of the four distinct system roles, structural responsibilities, and access boundaries.
          </p>
        </div>

        {/* 4 Roles Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Administrator */}
          <div className="bg-white rounded-2xl border-2 border-purple-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">1. Administrator (Platform Owner)</h4>
                  <span className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
                    Central Authority
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                1 Account (Me)
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Responsible for high-level system oversight, user account lifecycle, creating Class Teachers, role reassignments, and system audit logging.
            </p>
            <div className="text-[11px] bg-purple-50/50 p-3 rounded-xl border border-purple-100 text-purple-950 font-medium space-y-1">
              <div>• Manages user accounts and role assignments.</div>
              <div>• Only role authorized to create or appoint Class Teachers.</div>
              <div>• Oversees institutional configurations and audit logs.</div>
              <div>• Does NOT perform routine classroom attendance or marks entry.</div>
            </div>
          </div>

          {/* 2. Class Teacher */}
          <div className="bg-white rounded-2xl border-2 border-blue-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">2. Class Teacher (Section Mentor)</h4>
                  <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                    Classroom Head
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                {classTeachers.length} Accounts
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Responsible for the comprehensive academic health and progress of an assigned class/section (e.g., 5th Sem CSE-A).
            </p>
            <div className="text-[11px] bg-blue-50/50 p-3 rounded-xl border border-blue-100 text-blue-950 font-medium space-y-1">
              <div>• Manages assigned classroom (e.g. 5th Sem CSE Section A).</div>
              <div>• Assigns Subject Teachers to course modules.</div>
              <div>• Approves student requests to join classroom.</div>
              <div>• Reviews student attendance disputes and resolves academic alerts.</div>
            </div>
          </div>

          {/* 3. Teacher (Subject Teacher) */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">3. Teacher (Subject Teacher)</h4>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    Course Instructor
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                {subjectTeachers.length} Accounts
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Delivers subject curriculum, records session attendance, enters and evaluates internal assessment marks, and publishes assignments.
            </p>
            <div className="text-[11px] bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-emerald-950 font-medium space-y-1">
              <div>• Access strictly limited to authorized subjects and sections.</div>
              <div>• Records daily attendance for lecture/lab sessions.</div>
              <div>• Enters IA-1, IA-2, and lab internal assessment marks.</div>
              <div>• Creates course assignments and grades submissions.</div>
            </div>
          </div>

          {/* 4. Student */}
          <div className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-sm">4. Student</h4>
                  <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                    Academic Learner
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                {students.length} Accounts
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Inspects personal academic records, attendance percentages, internal assessment scores, assignment deadlines, and receives early alerts.
            </p>
            <div className="text-[11px] bg-amber-50/50 p-3 rounded-xl border border-amber-100 text-amber-950 font-medium space-y-1">
              <div>• Views personal academic records, attendance %, and IA marks.</div>
              <div>• Receives explainable academic alerts and improvement recommendations.</div>
              <div>• Runs the Attendance What-If Calculator to plan attendance.</div>
              <div>• Submits assignment files and files attendance dispute corrections.</div>
            </div>
          </div>
        </div>

        {/* Permission Matrix Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
            <Lock size={16} className="text-gray-500" />
            Core Permission Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10.5px] font-extrabold uppercase text-gray-400 tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Platform Capability</th>
                  <th className="px-3 py-3 text-center">Administrator</th>
                  <th className="px-3 py-3 text-center">Class Teacher</th>
                  <th className="px-3 py-3 text-center">Subject Teacher</th>
                  <th className="px-3 py-3 text-center">Student</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {[
                  { name: 'Create & Manage User Accounts', admin: true, ct: false, tch: false, stu: false },
                  { name: 'Appoint & Assign Class Teachers', admin: true, ct: false, tch: false, stu: false },
                  { name: 'Assign Subject Teachers to Modules', admin: false, ct: true, tch: false, stu: false },
                  { name: 'Approve Student Classroom Enrollment', admin: false, ct: true, tch: false, stu: false },
                  { name: 'Record Daily Class Attendance', admin: false, ct: true, tch: true, stu: false },
                  { name: 'Enter & Evaluate IA Marks', admin: false, ct: false, tch: true, stu: false },
                  { name: 'Publish Course Assignments', admin: false, ct: false, tch: true, stu: false },
                  { name: 'Submit What-If Attendance Simulation', admin: false, ct: false, tch: false, stu: true },
                  { name: 'Submit Assignment Submissions', admin: false, ct: false, tch: false, stu: true },
                  { name: 'View Audit Logs & Administrative History', admin: true, ct: false, tch: false, stu: false }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3 font-semibold text-gray-800">{row.name}</td>
                    <td className="px-3 py-3 text-center">
                      {row.admin ? (
                        <Check size={16} className="text-emerald-600 inline" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.ct ? (
                        <Check size={16} className="text-blue-600 inline" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.tch ? (
                        <Check size={16} className="text-emerald-600 inline" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {row.stu ? (
                        <Check size={16} className="text-amber-600 inline" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 6. SYSTEM OVERVIEW VIEW (Section 6 from menu)
  // =========================================================================
  if (currentPage === 'system-overview') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">System Overview</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Architecture health, VTU academic rules engine status, and operational session configuration.
          </p>
        </div>

        {/* Health Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frontend Runtime</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            </div>
            <div className="text-base font-black text-gray-900">React + Vite</div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Online • Reactive State</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Early Alert Engine</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
            </div>
            <div className="text-base font-black text-gray-900">VTU 2021/22 Scheme</div>
            <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">75% Cutoff Rule Active</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Demonstration Node</span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-100" />
            </div>
            <div className="text-base font-black text-gray-900">Multi-College Context</div>
            <p className="text-[11px] text-blue-700 font-semibold mt-0.5">RVCE Node Active</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit Trail</span>
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-4 ring-purple-100" />
            </div>
            <div className="text-base font-black text-gray-900">{auditLogs.length} Events Logged</div>
            <p className="text-[11px] text-purple-700 font-semibold mt-0.5">Session Memory Active</p>
          </div>
        </div>

        {/* Academic Rules Configuration Summary */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-gray-900">Academic Policy Thresholds</h3>
              <p className="text-[11px] text-gray-500">Configured according to VTU Autonomous Regulations</p>
            </div>
            <button
              onClick={() => setCurrentPage('settings')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Modify in Settings
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Minimum Attendance</span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">{academicConfig.minAttendancePercent}%</span>
              <p className="text-gray-500 text-[11px] mt-1">Students below this threshold trigger a Critical Alert for mentor counseling.</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Warning Attendance</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">{academicConfig.attendanceWarningPercent}%</span>
              <p className="text-gray-500 text-[11px] mt-1">Triggers early advisory warnings before reaching the critical VTU 75% bar.</p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/70">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">Internal Assessment Passing</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">40% (20/50)</span>
              <p className="text-gray-500 text-[11px] mt-1">Minimum cumulative IA mark requirement for semester examination eligibility.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 7. AUDIT LOGS VIEW (Section 9)
  // =========================================================================
  if (currentPage === 'audit-logs') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Audit Logs</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Review chronological record of administrative actions, role assignments, and account modifications.
            </p>
          </div>
          <button
            onClick={() => showToast('Audit logs exported to demonstration report (PDF/CSV)', 'info')}
            className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw size={14} /> Export Audit Trail
          </button>
        </div>

        {/* Demo Audit Notice (Section 9 requirement) */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-start gap-3">
          <Info size={18} className="text-gray-600 shrink-0 mt-0.5" />
          <div className="text-xs text-gray-700">
            <span className="font-bold text-gray-900 uppercase tracking-wide text-[10.5px] block">
              Demonstration Audit Record
            </span>
            <p className="mt-0.5 text-[11px] text-gray-600">
              Administrative events are tracked in local session memory for this academic demonstration. No passwords, tokens, or private credentials are exposed in audit records.
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit events, users, or targets..."
              value={auditSearchQuery}
              onChange={(e) => setAuditSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={auditStatusFilter}
              onChange={(e) => setAuditStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses ({auditLogs.length})</option>
              <option value="success">Success Events</option>
              <option value="warning">Warning Events</option>
              <option value="info">Info / Updates</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-[10.5px] font-extrabold uppercase text-gray-400 tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Performed By</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Affected Account / Resource</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                      No audit events match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="px-5 py-3.5 text-gray-500 font-mono text-[11px] shrink-0">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-gray-900">{log.performedBy}</div>
                        <div className="text-[10px] text-gray-400">{log.performerRole}</div>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-gray-900">{log.action}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-gray-800 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md text-[11px]">
                          {log.targetResource}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            log.status === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : log.status === 'warning'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 max-w-sm truncate text-[11.5px]">
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 8. SETTINGS VIEW
  // =========================================================================
  if (currentPage === 'settings') {
    return (
      <div className="max-w-4xl space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Administrator Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage administrator profile details, platform alert thresholds, and demo environment settings.
          </p>
        </div>

        {/* Administrator Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Shield size={16} className="text-purple-600" />
            Administrator Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value="Rehan (Administrator)"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Official Email</label>
              <input
                type="email"
                disabled
                value="admin@college.edu"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Administrative Identifier</label>
              <input
                type="text"
                disabled
                value="ADM-2025-01"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Assigned Department</label>
              <input
                type="text"
                disabled
                value="Central Academic Affairs"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Academic Threshold Settings */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Sliders size={16} className="text-blue-600" />
            Early Alert Policy Parameters
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5 font-bold">
                <span className="text-gray-800">Minimum Mandatory Attendance Cutoff</span>
                <span className="text-rose-600 font-black">{configForm.minAttendancePercent}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                value={configForm.minAttendancePercent}
                onChange={(e) =>
                  setConfigForm({ ...configForm, minAttendancePercent: Number(e.target.value) })
                }
                className="w-full accent-black cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">VTU regulation mandates 75% minimum attendance to write end-semester examinations.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 font-bold">
                <span className="text-gray-800">Early Warning Attendance Bar</span>
                <span className="text-amber-600 font-black">{configForm.attendanceWarningPercent}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="90"
                value={configForm.attendanceWarningPercent}
                onChange={(e) =>
                  setConfigForm({ ...configForm, attendanceWarningPercent: Number(e.target.value) })
                }
                className="w-full accent-black cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  updateAcademicConfig(configForm);
                  showToast('Academic configurations saved successfully', 'success');
                }}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-xs"
              >
                Save Threshold Policies
              </button>
            </div>
          </div>
        </div>

        {/* Demo Data Reset */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-gray-900">Demonstration Session Controls</h4>
            <p className="text-[11px] text-gray-500">Reset local frontend state or trigger session sync.</p>
          </div>
          <button
            onClick={() => showToast('Session demo state refreshed', 'info')}
            className="px-3 py-1.5 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-white shadow-2xs"
          >
            Refresh Session
          </button>
        </div>

        {/* Account Session & Sign Out */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <LogOut size={16} />
              </span>
              <h4 className="text-sm font-bold text-gray-900">Account Session & Logout</h4>
            </div>
            <p className="text-xs text-gray-500 max-w-xl">
              Sign out of the Academio Administrator Console on this workstation. You will need to re-authenticate with your administrator credentials to manage college users, role allocations, and audit logs.
            </p>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-2 transition-colors border border-rose-200 shrink-0"
          >
            <LogOut size={14} />
            <span>Sign Out / Logout</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MODALS & DIALOGS
  // =========================================================================

  return (
    <div>
      {/* 1. Create User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Create User Account</h3>
                  <p className="text-[10px] text-gray-400">Add an authorized platform user</p>
                </div>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newUserForm.name || !newUserForm.email || !newUserForm.identifier) {
                  showToast('Please fill all required fields', 'error');
                  return;
                }
                addUserAccount({
                  name: newUserForm.name,
                  email: newUserForm.email,
                  identifier: newUserForm.identifier,
                  role: newUserForm.role,
                  department: newUserForm.department,
                  status: newUserForm.status,
                  phone: newUserForm.phone,
                  assignedClass: newUserForm.assignedClass || undefined
                });
                setIsAddUserModalOpen(false);
                setNewUserForm({
                  name: '',
                  email: '',
                  identifier: '',
                  role: 'student',
                  department: 'Computer Science & Engineering',
                  status: 'active',
                  phone: '+91 98765 00000',
                  assignedClass: ''
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh.k@college.edu"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">User Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="USN or Emp ID"
                    value={newUserForm.identifier}
                    onChange={(e) => setNewUserForm({ ...newUserForm, identifier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Platform Role *</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Subject Teacher</option>
                    <option value="class_teacher">Class Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Department</label>
                <select
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Science & Engineering">Information Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Management & Humanities">Management & Humanities</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Initial Status</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newUserForm.status === 'active'}
                      onChange={() => setNewUserForm({ ...newUserForm, status: 'active' })}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={newUserForm.status === 'inactive'}
                      onChange={() => setNewUserForm({ ...newUserForm, status: 'inactive' })}
                    />
                    <span>Inactive (Suspended)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create Class Teacher Modal (Section 6) */}
      {isCreateCTModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <UserCheck size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Create Class Teacher Account</h3>
                  <p className="text-[10px] text-gray-400">Assign classroom mentor authority</p>
                </div>
              </div>
              <button onClick={() => setIsCreateCTModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCTForm.name || !newCTForm.email || !newCTForm.identifier) {
                  showToast('Please provide name, email, and employee identifier', 'error');
                  return;
                }
                const success = createClassTeacherAccount({
                  name: newCTForm.name,
                  email: newCTForm.email,
                  identifier: newCTForm.identifier,
                  phone: newCTForm.phone,
                  department: newCTForm.department,
                  status: newCTForm.status,
                  assignedClassId: newCTForm.assignedClassId || undefined
                });
                if (success) {
                  setIsCreateCTModalOpen(false);
                  setNewCTForm({
                    name: '',
                    email: '',
                    identifier: '',
                    phone: '+91 98450 00000',
                    department: 'Computer Science & Engineering',
                    status: 'active',
                    assignedClassId: ''
                  });
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajeshwari S."
                  value={newCTForm.name}
                  onChange={(e) => setNewCTForm({ ...newCTForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajeshwari.s@rvce.edu.in"
                  value={newCTForm.email}
                  onChange={(e) => setNewCTForm({ ...newCTForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Employee Identifier *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EMP-CSE-045"
                    value={newCTForm.identifier}
                    onChange={(e) => setNewCTForm({ ...newCTForm, identifier: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newCTForm.phone}
                    onChange={(e) => setNewCTForm({ ...newCTForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Classroom Assignment (Optional)</label>
                <select
                  value={newCTForm.assignedClassId}
                  onChange={(e) => setNewCTForm({ ...newCTForm, assignedClassId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="">Leave Unassigned (Assign Later)</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.totalStudents} Students)
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  If left unassigned, the Class Teacher can manage or be linked to a classroom later.
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateCTModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Create Class Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Promote Existing Teacher to Class Teacher Modal */}
      {isPromoteTeacherModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Award size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900">Promote Teacher to Class Teacher</h3>
                  <p className="text-[10px] text-gray-400">Elevate role with classroom leadership</p>
                </div>
              </div>
              <button onClick={() => setIsPromoteTeacherModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                promoteTeacherToClassTeacher(promoteForm.teacherId, promoteForm.assignedClassId || undefined);
                setIsPromoteTeacherModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Select Eligible Subject Teacher</label>
                <select
                  value={promoteForm.teacherId}
                  onChange={(e) => setPromoteForm({ ...promoteForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                >
                  {subjectTeachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Assign Classroom (Optional)</label>
                <select
                  value={promoteForm.assignedClassId}
                  onChange={(e) => setPromoteForm({ ...promoteForm, assignedClassId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="">Leave Unassigned for now</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoteTeacherModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Confirm Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Assign Classroom Modal */}
      {assigningCT && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-1">Assign Classroom</h3>
            <p className="text-xs text-gray-500 mb-4">
              Select an authorized classroom for <strong>{assigningCT.name}</strong>.
            </p>

            <div className="space-y-3 text-xs mb-5">
              <label className="font-bold text-gray-700 block">Classroom</label>
              <select
                value={selectedClassIdToAssign}
                onChange={(e) => setSelectedClassIdToAssign(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
              >
                <option value="">-- Choose Classroom --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.totalStudents} students)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAssigningCT(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 text-xs"
              >
                Cancel
              </button>
              <button
                disabled={!selectedClassIdToAssign}
                onClick={() => {
                  assignClassTeacherToClass(assigningCT.id, selectedClassIdToAssign);
                  setAssigningCT(null);
                }}
                className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs disabled:opacity-40"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. View User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={viewingUser.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-black text-gray-900">{viewingUser.name}</h3>
                  <p className="text-xs text-gray-400">{viewingUser.email}</p>
                  <span className="font-mono text-[10px] text-gray-500 font-bold">{viewingUser.identifier}</span>
                </div>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Role</span>
                <div className="mt-1">{getRoleBadge(viewingUser.role)}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                <div className="mt-1 font-bold capitalize text-gray-800">{viewingUser.status}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Department</span>
                <div className="mt-1 font-bold text-gray-800">{viewingUser.department}</div>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Created On</span>
                <div className="mt-1 font-bold text-gray-800">{viewingUser.createdAt}</div>
              </div>
            </div>

            {viewingUser.assignedClass && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900">
                <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Associated Classroom</span>
                <span className="font-bold">{viewingUser.assignedClass}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. View Class Teacher Details Modal */}
      {viewingCT && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={viewingCT.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={viewingCT.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-black text-gray-900">{viewingCT.name}</h3>
                  <p className="text-xs text-gray-400">{viewingCT.email}</p>
                  <span className="text-[11px] text-gray-500">{viewingCT.phone}</span>
                </div>
              </div>
              <button onClick={() => setViewingCT(null)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Institution:</span>
                <span className="font-semibold text-gray-800">{viewingCT.collegeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Department:</span>
                <span className="font-semibold text-gray-800">{viewingCT.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Assigned Class:</span>
                <span className="font-bold text-blue-700">{viewingCT.assignedClass}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold">Students Monitored:</span>
                <span className="font-bold text-gray-900">{viewingCT.totalStudents}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewingCT(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Status Confirmation Dialog (Deactivate / Activate Account) */}
      {statusConfirmUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-3">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-sm font-black text-gray-900 mb-1">
              Confirm {statusConfirmUser.status === 'active' ? 'Deactivation' : 'Reactivation'}
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Are you sure you want to {statusConfirmUser.status === 'active' ? 'deactivate' : 'activate'} the account for <strong>{statusConfirmUser.name}</strong> ({statusConfirmUser.identifier})?
              {statusConfirmUser.status === 'active' && ' The user will be unable to log in until reactivated.'}
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setStatusConfirmUser(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleUserStatus(statusConfirmUser.id);
                  setStatusConfirmUser(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-white ${
                  statusConfirmUser.status === 'active'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm {statusConfirmUser.status === 'active' ? 'Deactivation' : 'Reactivation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Change Role Modal */}
      {changingRoleUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-1">Change User Role</h3>
            <p className="text-xs text-gray-500 mb-4">
              Update authorization role for <strong>{changingRoleUser.name}</strong>.
            </p>

            <div className="space-y-2 text-xs mb-5">
              {(['admin', 'class_teacher', 'teacher', 'student'] as UserRole[]).map((r) => (
                <label
                  key={r}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    newSelectedRole === r
                      ? 'bg-blue-50/60 border-blue-400 font-bold text-blue-900'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="capitalize">{r.replace('_', ' ')}</span>
                  <input
                    type="radio"
                    name="newRole"
                    checked={newSelectedRole === r}
                    onChange={() => setNewSelectedRole(r)}
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setChangingRoleUser(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  changeUserRole(changingRoleUser.id, newSelectedRole);
                  setChangingRoleUser(null);
                }}
                className="px-4 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-bold"
              >
                Save Role Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Class Teacher Status Confirmation */}
      {ctStatusConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <h3 className="text-sm font-black text-gray-900 mb-1">
              {ctStatusConfirm.status === 'active' ? 'Deactivate' : 'Activate'} Class Teacher?
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Toggle access status for <strong>{ctStatusConfirm.name}</strong>.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setCtStatusConfirm(null)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleClassTeacherStatus(ctStatusConfirm.id);
                  setCtStatusConfirm(null);
                }}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Inspect Classroom Modal */}
      {inspectingClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  Semester {inspectingClass.semester} • {inspectingClass.department}
                </span>
                <h3 className="text-base font-black text-gray-900 mt-0.5">{inspectingClass.name}</h3>
                <p className="text-xs text-gray-400">{inspectingClass.collegeName}</p>
              </div>
              <button onClick={() => setInspectingClass(null)} className="p-1 rounded-lg text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Appointed Class Teacher</div>
                <div className="font-bold text-gray-900 text-sm mt-0.5">
                  {inspectingClass.classTeacherName || 'Unassigned'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-base font-black text-gray-900">{inspectingClass.totalStudents}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Enrolled Students</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-base font-black text-gray-900">{inspectingClass.roomNumber || 'CS-201'}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Room Allocation</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
                Attendance records, IA evaluations, and assignment submissions for this section are maintained directly by the appointed Class Teacher.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingClass(null)}
                className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Logout Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-3">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-1">Confirm Administrator Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your session as <strong>Administrator (Prof. Rehan)</strong>? You will be safely signed out and redirected to the login screen.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    showToast('Logged out of Academio Administrator Console', 'info');
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <LogOut size={14} />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
