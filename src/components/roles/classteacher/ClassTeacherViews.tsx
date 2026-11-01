import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  BarChart3,
  FileSpreadsheet,
  Megaphone,
  User,
  Upload,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  FolderTree,
  UserCheck,
  Download,
  Check,
  X,
  FileText,
  Mail,
  Phone,
  Trash2,
  Edit3,
  Shield,
  ArrowRight,
  Eye,
  ChevronRight,
  UserPlus,
  Sliders,
  Bell,
  RefreshCw,
  Send,
  Building2,
  CheckSquare,
  LogOut
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Student, AcademicAlert, CorrectionRequest, SubjectTeacher, Assignment } from '../../../types/academic';

export const ClassTeacherViews: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const {
    currentPage,
    setCurrentPage,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    alerts,
    resolveAlert,
    correctionRequests,
    resolveCorrectionRequest,
    subjects,
    subjectTeachers,
    addSubjectTeacher,
    assignTeacherToSubject,
    assignments,
    createAssignment,
    announcements,
    createAnnouncement,
    studentJoinRequests,
    approveStudentJoinRequest,
    rejectStudentJoinRequest,
    showToast,
    searchTerm,
    setSearchTerm,
    academicConfig,
    updateAcademicConfig
  } = useApp();

  // Class Scope: 5th Sem CSE - Section A
  const classStudents = students.filter((s) => s.classId === 'cls-1');
  const classAlerts = alerts.filter((a) => a.classId === 'cls-1');

  // Sub-tabs state for grouped menus
  const [studentTab, setStudentTab] = useState<'all' | 'add' | 'requests'>('all');
  const [studentRiskFilter, setStudentRiskFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const [teacherTab, setTeacherTab] = useState<'view' | 'assign' | 'add'>('view');
  const [academicTab, setAcademicTab] = useState<'attendance' | 'ia' | 'assignments'>('attendance');
  const [commTab, setCommTab] = useState<'alerts' | 'notifications' | 'reports' | 'announcements'>('alerts');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'preferences'>('profile');

  // Sync sub-tabs if opened via legacy route/links
  useEffect(() => {
    if (currentPage === 'import-students') {
      setStudentTab('add');
    } else if (currentPage === 'assign-teachers') {
      setTeacherTab('assign');
    } else if (currentPage === 'attendance-overview') {
      setAcademicTab('attendance');
    } else if (currentPage === 'ia-overview') {
      setAcademicTab('ia');
    } else if (currentPage === 'assignments-overview') {
      setAcademicTab('assignments');
    } else if (currentPage === 'academic-alerts') {
      setCommTab('alerts');
    } else if (currentPage === 'correction-requests') {
      setCommTab('notifications');
    } else if (currentPage === 'reports') {
      setCommTab('reports');
    } else if (currentPage === 'announcements') {
      setCommTab('announcements');
    }
  }, [currentPage]);

  // Modals state
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Rejection modal
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Assign modal
  const [assignSubjectCode, setAssignSubjectCode] = useState('21CS52');
  const [assignTeacherName, setAssignTeacherName] = useState('Prof. Ananya Sharma');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // New teacher modal
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'CSE',
    designation: 'Assistant Professor',
    employeeId: ''
  });

  // New assignment modal
  const [isNewAssignmentOpen, setIsNewAssignmentOpen] = useState(false);
  const [newAssignmentForm, setNewAssignmentForm] = useState({
    title: '',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    teacherName: 'Dr. K. Srinivas',
    dueDate: '2026-10-30',
    maxMarks: 20,
    description: ''
  });

  // New announcement modal
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: 'Academic',
    priority: 'high' as 'high' | 'medium' | 'low',
    content: ''
  });

  // Resolve alert modal
  const [resolvingAlert, setResolvingAlert] = useState<AcademicAlert | null>(null);
  const [counselingNotes, setCounselingNotes] = useState('');

  // Profile details form
  const [teacherProfile, setTeacherProfile] = useState({
    name: 'Dr. K. Srinivas',
    designation: 'Associate Professor & Class Coordinator',
    employeeId: 'FAC-CSE-042',
    email: 'srinivas.k@rvce.edu.in',
    phone: '+91 98450 44321',
    cabin: 'Room CS-304, 3rd Floor, CSE Block',
    officeHours: 'Mon-Fri: 2:00 PM - 4:00 PM',
    qualification: 'Ph.D. in Computer Science & Engineering (VTU)'
  });

  // Local preferences form
  const [prefForm, setPrefForm] = useState({
    minAttendance: academicConfig?.minAttendancePercent || 75,
    warningAttendance: academicConfig?.attendanceWarningPercent || 80,
    iaWarning: academicConfig?.iaWarningThresholdPercent || 60,
    emailAlerts: true,
    smsToParents: true,
    autoReminders: true
  });

  // Student Form
  const [studentForm, setStudentForm] = useState({
    name: '',
    usn: '',
    email: '',
    phone: '',
    branch: 'CSE',
    semester: 5,
    className: '5th Sem CSE - Section A',
    classId: 'cls-1',
    collegeId: 'col-1',
    collegeName: 'RV College of Engineering',
    overallAttendance: 85.0,
    totalClassesAttended: 156,
    totalClassesHeld: 184,
    avgIA: 78.0,
    alertsCount: 0,
    status: 'active' as const,
    mentorName: 'Dr. K. Srinivas'
  });

  // Filter students
  const filteredClassStudents = classStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.usn.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (studentRiskFilter === 'all') return true;
    if (studentRiskFilter === 'safe') return s.overallAttendance >= 80;
    if (studentRiskFilter === 'warning') return s.overallAttendance >= 75 && s.overallAttendance < 80;
    if (studentRiskFilter === 'critical') return s.overallAttendance < 75;
    return true;
  });

  // Pending join requests
  const pendingRequests = studentJoinRequests.filter((r) => r.status === 'pending');
  const filteredRequests = studentJoinRequests.filter((r) => {
    if (requestFilter === 'all') return true;
    return r.status === requestFilter;
  });

  // =========================================================================
  // 1. DASHBOARD
  // =========================================================================
  if (currentPage === 'dashboard') {
    const belowThreshold = classStudents.filter((s) => s.overallAttendance < 75).length;
    const warningStudents = classStudents.filter((s) => s.overallAttendance >= 75 && s.overallAttendance < 80).length;
    const safeStudents = classStudents.filter((s) => s.overallAttendance >= 80).length;
    const avgAttendance = classStudents.length > 0
      ? (classStudents.reduce((acc, s) => acc + s.overallAttendance, 0) / classStudents.length).toFixed(1)
      : '0.0';
    const avgIA = classStudents.length > 0
      ? (classStudents.reduce((acc, s) => acc + s.avgIA, 0) / classStudents.length).toFixed(1)
      : '0.0';
    const activeAlerts = classAlerts.filter((a) => a.status === 'open');

    return (
      <div className="space-y-6">
        {/* Class Overview Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-black text-white p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">
              <UserCheck size={14} /> Class Coordinator Desk • 2025-2026 Odd Semester
            </div>
            <h2 className="text-2xl font-black tracking-tight">5th Semester CSE — Section A</h2>
            <p className="text-gray-300 text-xs mt-1">
              Class Teacher: <strong>{teacherProfile.name}</strong> • RV College of Engineering • Room CS-302
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage('student-management');
                setStudentTab('add');
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={15} /> Add Student
            </button>
            <button
              onClick={() => {
                setCurrentPage('student-management');
                setStudentTab('requests');
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <UserPlus size={15} /> Join Requests ({pendingRequests.length})
            </button>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-gray-400">Total Students</span>
              <Users size={16} className="text-blue-600" />
            </div>
            <p className="text-2xl font-black text-gray-900">{classStudents.length}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Section A Roster</p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-gray-400">Subject Teachers</span>
              <UserCheck size={16} className="text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-600">{subjects.length}</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Assigned to Section</p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-gray-400">Pending Requests</span>
              <Clock size={16} className="text-amber-600" />
            </div>
            <p className="text-2xl font-black text-amber-600">{pendingRequests.length}</p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">Awaiting Verification</p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-gray-400">Class Attendance</span>
              <CalendarCheck size={16} className="text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-600">{avgAttendance}%</p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">Average Attendance</p>
          </div>

          <div className="bg-white p-4.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-gray-400">Shortage Risks</span>
              <AlertCircle size={16} className="text-rose-600" />
            </div>
            <p className="text-2xl font-black text-rose-600">{belowThreshold}</p>
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">&lt; 75% Attendance</p>
          </div>
        </div>

        {/* Pending Student Join Requests Notification Banner (if any) */}
        {pendingRequests.length > 0 && (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
                <UserPlus size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900">
                  {pendingRequests.length} Student Join Request{pendingRequests.length > 1 ? 's' : ''} Pending Approval
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Students have requested to join 5th Sem CSE - Section A. Review their details to approve into roster.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setCurrentPage('student-management');
                setStudentTab('requests');
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs flex items-center gap-1.5"
            >
              Review Join Requests <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Attendance Summary & Distribution Bar */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-black text-gray-900 tracking-tight">Class Attendance Summary</h3>
              <p className="text-xs text-gray-500">Distribution of students based on VTU attendance compliance criteria</p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('academic-management');
                setAcademicTab('attendance');
              }}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Detailed Attendance <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800">Safe Compliance (&gt;= 80%)</span>
                <p className="text-lg font-black text-emerald-700 mt-0.5">{safeStudents} Students</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100/80 px-2 py-1 rounded-lg">
                {classStudents.length > 0 ? Math.round((safeStudents / classStudents.length) * 100) : 0}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800">Warning Zone (75% - 79%)</span>
                <p className="text-lg font-black text-amber-700 mt-0.5">{warningStudents} Students</p>
              </div>
              <span className="text-xs font-extrabold text-amber-800 bg-amber-100/80 px-2 py-1 rounded-lg">
                {classStudents.length > 0 ? Math.round((warningStudents / classStudents.length) * 100) : 0}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-800">Critical Shortage (&lt; 75%)</span>
                <p className="text-lg font-black text-rose-700 mt-0.5">{belowThreshold} Students</p>
              </div>
              <span className="text-xs font-extrabold text-rose-800 bg-rose-100/80 px-2 py-1 rounded-lg">
                {classStudents.length > 0 ? Math.round((belowThreshold / classStudents.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Priority Academic Alerts Summary */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-gray-900 tracking-tight">Academic Alerts Requiring Class Teacher Action</h3>
              <p className="text-xs text-gray-500">Automated flags detecting attendance deficits, declining IA marks, or missing assignments</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                {activeAlerts.length} Unresolved
              </span>
              <button
                onClick={() => {
                  setCurrentPage('communication-monitoring');
                  setCommTab('alerts');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View All Alerts
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {classAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/60 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-gray-300 transition-all text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900">{alert.title}</h4>
                    <span className="text-[10px] text-gray-400">• {alert.date}</span>
                  </div>
                  <p className="text-gray-600">{alert.reason}</p>
                  <p className="text-blue-700 font-semibold text-[11px]">
                    Recommended Action: {alert.recommendedAction}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Student: <strong>{alert.studentName}</strong> ({alert.studentUsn})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === 'open' ? (
                    <button
                      onClick={() => {
                        setResolvingAlert(alert);
                        setCounselingNotes('');
                      }}
                      className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Remediate & Resolve
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. MY CLASSROOM
  // =========================================================================
  if (currentPage === 'my-classroom' || currentPage === 'my-classes') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">My Classroom — Academic Details</h2>
          <p className="text-xs text-gray-500">Official section details, VTU syllabus scheme, assigned subject teachers, and timetable schedule.</p>
        </div>

        {/* Classroom Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Department of Computer Science & Engineering
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-1">5th Semester CSE — Section A</h3>
              <p className="text-xs text-gray-500">Academic Year 2025-2026 (Odd Semester)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Classroom
              </span>
              <button
                onClick={() => showToast('Classroom timetable downloaded in PDF format', 'info')}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download size={14} /> Timetable
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class Room</span>
              <p className="text-base font-black text-gray-900 mt-0.5">CS-302 (3rd Floor)</p>
              <p className="text-[11px] text-gray-500">Computer Science Block</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class Strength</span>
              <p className="text-base font-black text-blue-600 mt-0.5">{classStudents.length} Students</p>
              <p className="text-[11px] text-gray-500">All registered & active</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Curriculum Scheme</span>
              <p className="text-base font-black text-purple-600 mt-0.5">VTU 2021 Scheme</p>
              <p className="text-[11px] text-gray-500">Choice Based Credit System</p>
            </div>
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Class Teacher</span>
              <p className="text-base font-black text-gray-900 mt-0.5">{teacherProfile.name}</p>
              <p className="text-[11px] text-gray-500">Cabin: CS-304</p>
            </div>
          </div>
        </div>

        {/* Assigned Subjects Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-gray-900">Assigned Subjects & Teaching Faculty</h3>
              <p className="text-xs text-gray-500">6 core VTU curriculum subjects allocated for 5th Sem CSE-A</p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('teacher-management');
                setTeacherTab('assign');
              }}
              className="px-3 py-1.5 bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <UserCheck size={14} /> Manage Assignments
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Subject Code & Name</th>
                  <th className="py-3 px-4">Credits & Type</th>
                  <th className="py-3 px-4">Allocated Teacher</th>
                  <th className="py-3 px-4">Faculty Contact</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {subjects.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/70">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-gray-900">{s.name}</p>
                      <p className="text-[10px] text-blue-600 font-bold">{s.code}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {s.credits} Credits • {s.type}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      {s.assignedTeacherName || <span className="text-rose-500 font-semibold">Unassigned</span>}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {s.assignedTeacherName === 'Dr. K. Srinivas'
                        ? 'srinivas.k@rvce.edu.in'
                        : s.assignedTeacherName === 'Prof. Ananya Sharma'
                        ? 'ananya.sharma@rvce.edu.in'
                        : s.assignedTeacherName === 'Prof. Prakash Rao'
                        ? 'prakash.rao@rvce.edu.in'
                        : 'faculty@rvce.edu.in'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Progress
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Class Representatives & Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-black text-gray-900">Class Representatives (CRs)</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Rahul Sharma (1RV22CS084)</p>
                  <p className="text-gray-500 text-[11px]">CR (Boys) • rahul.cs22@rvce.edu.in</p>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">CR-1</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">Ananya Deshmukh (1RV22CS085)</p>
                  <p className="text-gray-500 text-[11px]">CR (Girls) • ananya.cs22@rvce.edu.in</p>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">CR-2</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
            <h4 className="text-sm font-black text-gray-900">Class Information & Schedule</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• <strong>Working Days:</strong> Monday through Friday, 09:00 AM to 04:30 PM</p>
              <p>• <strong>Laboratory Sessions:</strong> Tuesday afternoon (CN Lab) & Thursday afternoon (DBMS Lab)</p>
              <p>• <strong>Mentorship Hour:</strong> Every Wednesday 03:30 PM - 04:30 PM in Room CS-302</p>
              <p>• <strong>CIE Evaluation Scheme:</strong> Best 2 of 3 Internal Assessments + Lab CIE + 2 Assignments</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. STUDENT MANAGEMENT (Grouped with Tabs)
  // =========================================================================
  if (currentPage === 'student-management' || currentPage === 'import-students') {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Student Management — 5th Sem CSE-A</h2>
            <p className="text-xs text-gray-500">Manage enrolled student rosters, handle join requests, and register new students.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStudentTab('add')}
              className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} /> Add Student
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setStudentTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              studentTab === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Students ({classStudents.length})
          </button>
          <button
            onClick={() => setStudentTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              studentTab === 'add'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Add Student / CSV Import
          </button>
          <button
            onClick={() => setStudentTab('requests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              studentTab === 'requests'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Student Join Requests
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: ALL STUDENTS */}
        {studentTab === 'all' && (
          <div className="space-y-4">
            {/* Search & Risk Filters */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-gray-500 text-[11px]">Filter by Attendance:</span>
                {(['all', 'safe', 'warning', 'critical'] as const).map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setStudentRiskFilter(risk)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] capitalize transition-all ${
                      studentRiskFilter === risk
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {risk === 'all'
                      ? 'All'
                      : risk === 'safe'
                      ? 'Safe (>=80%)'
                      : risk === 'warning'
                      ? 'Warning (75-79%)'
                      : 'Critical (<75%)'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name or USN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-xl w-48 sm:w-56 focus:outline-none focus:border-black"
                  />
                </div>
                <span className="text-gray-400 text-[11px]">
                  {filteredClassStudents.length} student{filteredClassStudents.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4 text-center">Attendance %</th>
                      <th className="py-3 px-4 text-center">IA Average</th>
                      <th className="py-3 px-4 text-center">Active Alerts</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredClassStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400">
                          No students matched your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredClassStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/70">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{s.name}</p>
                                <p className="text-[10px] text-gray-400">{s.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-gray-700">{s.usn}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`font-black ${
                                s.overallAttendance < 75
                                  ? 'text-rose-600'
                                  : s.overallAttendance < 80
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {s.overallAttendance}%
                            </span>
                            <span className="block text-[10px] text-gray-400 font-normal">
                              {s.totalClassesAttended}/{s.totalClassesHeld}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-black text-gray-900">{s.avgIA}%</td>
                          <td className="py-3.5 px-4 text-center">
                            {s.alertsCount > 0 ? (
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800">
                                {s.alertsCount} Alert{s.alertsCount > 1 ? 's' : ''}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium">None</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedStudentDetail(s)}
                                className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg"
                                title="View Academic Profile"
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                onClick={() => setEditingStudent(s)}
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                                title="Edit Student"
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => setStudentToDelete(s)}
                                className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                title="Remove from Classroom"
                              >
                                <Trash2 size={15} />
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
          </div>
        )}

        {/* TAB 2: ADD STUDENT & CSV IMPORT */}
        {studentTab === 'add' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct Add Form */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                <h3 className="text-sm font-black text-gray-900">Enroll New Student into CSE-5A</h3>
              </div>
              <p className="text-xs text-gray-500">
                Register an individual student directly into 5th Semester Section A.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addStudent(studentForm);
                  showToast(`Student ${studentForm.name} (${studentForm.usn}) enrolled successfully`, 'success');
                  setStudentForm({
                    ...studentForm,
                    name: '',
                    usn: '',
                    email: '',
                    phone: ''
                  });
                  setStudentTab('all');
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="e.g. Vikram Raghavan"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">University USN *</label>
                    <input
                      type="text"
                      required
                      value={studentForm.usn}
                      onChange={(e) => setStudentForm({ ...studentForm, usn: e.target.value.toUpperCase() })}
                      placeholder="e.g. 1RV22CS095"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={studentForm.phone}
                      onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                      placeholder="+91 98450 00000"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="student@rvce.edu.in"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Branch</label>
                    <input
                      type="text"
                      disabled
                      value="Computer Science & Engineering"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Assigned Class</label>
                    <input
                      type="text"
                      disabled
                      value="5th Sem CSE - Section A"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentTab('all')}
                    className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold shadow-xs"
                  >
                    Enroll Student
                  </button>
                </div>
              </form>
            </div>

            {/* CSV Import Section */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-purple-600" />
                <h3 className="text-sm font-black text-gray-900">Bulk CSV Roster Import</h3>
              </div>
              <p className="text-xs text-gray-500">
                Upload batch registration or VTU admission allotment CSV list.
              </p>

              <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50/50 hover:bg-gray-50 cursor-pointer">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-800 text-xs">Click or drag .csv or .xlsx roster file here</p>
                <p className="text-[11px] text-gray-400 mt-1">Columns: USN, Student Name, Email, Phone</p>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 space-y-1">
                <p className="font-bold">Sample CSV Format Preview:</p>
                <p className="font-mono text-[10px] text-gray-700">USN, Name, Email, Phone</p>
                <p className="font-mono text-[10px] text-gray-700">1RV22CS084, Rahul Sharma, rahul@rvce.edu.in, 9876543210</p>
                <p className="font-mono text-[10px] text-gray-700">1RV22CS085, Ananya Deshmukh, ananya@rvce.edu.in, 9876543211</p>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => showToast('Sample roster template downloaded', 'info')}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Download size={14} /> Download CSV Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Simulation: Verified 64 student records and synced to Section A', 'success');
                    setStudentTab('all');
                  }}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Simulate Batch Import
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT JOIN REQUESTS */}
        {studentTab === 'requests' && (
          <div className="space-y-4">
            {/* Filter buttons */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-500 text-[11px]">Filter by Status:</span>
                {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setRequestFilter(st)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] capitalize transition-all ${
                      requestFilter === st
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'all'
                      ? 'All Requests'
                      : st === 'pending'
                      ? `Pending (${pendingRequests.length})`
                      : st === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </button>
                ))}
              </div>
              <span className="text-gray-400 text-[11px]">
                Showing {filteredRequests.length} join request{filteredRequests.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student Details</th>
                      <th className="py-3 px-4">USN & Branch</th>
                      <th className="py-3 px-4">Target Classroom</th>
                      <th className="py-3 px-4">Request Date</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          No join requests found for this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50/70">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900">{req.studentName}</p>
                            <p className="text-[10px] text-gray-500">{req.email} • {req.phone}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-mono font-bold text-gray-900">{req.usn}</p>
                            <p className="text-[10px] text-gray-500">{req.branch} • Sem {req.semester}</p>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-gray-700">
                            {req.section}
                          </td>
                          <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                            {req.requestDate}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                req.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : req.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {req.status}
                            </span>
                            {req.rejectionReason && (
                              <p className="text-[10px] text-rose-600 mt-1 max-w-xs mx-auto truncate" title={req.rejectionReason}>
                                {req.rejectionReason}
                              </p>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {req.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => approveStudentJoinRequest(req.id)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setRejectingRequestId(req.id);
                                    setRejectionReasonInput('');
                                  }}
                                  className="px-3 py-1.5 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-bold transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-gray-400 font-medium">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 4. TEACHER MANAGEMENT (Grouped with Tabs)
  // =========================================================================
  if (currentPage === 'teacher-management' || currentPage === 'assign-teachers') {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Teacher Management — Subject Allotment</h2>
            <p className="text-xs text-gray-500">View teaching faculty, map teachers to 5th Sem CSE courses, and add new instructors.</p>
          </div>
          <button
            onClick={() => setIsAddTeacherOpen(true)}
            className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus size={15} /> Add Faculty Member
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setTeacherTab('view')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              teacherTab === 'view'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            View Teachers ({subjectTeachers.length})
          </button>
          <button
            onClick={() => setTeacherTab('assign')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              teacherTab === 'assign'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Assign Teachers to Subjects
          </button>
        </div>

        {/* TAB 1: VIEW TEACHERS */}
        {teacherTab === 'view' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center shrink-0">
                    {teacher.name.replace('Dr. ', '').replace('Prof. ', '').charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{teacher.name}</h4>
                    <p className="text-[11px] text-gray-500">{teacher.department} • {teacher.collegeName}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-gray-800">{teacher.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="font-semibold text-gray-800">{teacher.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Assigned Courses:</span>
                    <span className="font-bold text-blue-600">{teacher.subjects.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                    Active Faculty
                  </span>
                  <button
                    onClick={() => {
                      setTeacherTab('assign');
                      setAssignTeacherName(teacher.name);
                    }}
                    className="text-blue-600 font-bold hover:underline text-[11px]"
                  >
                    Allot Course &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ASSIGN TEACHERS TO SUBJECTS */}
        {teacherTab === 'assign' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Course Allotment Table</h3>
                  <p className="text-xs text-gray-500">Map certified instructors to syllabus modules for 5th Sem Section A</p>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus size={15} /> Allot Faculty
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Subject Code & Course</th>
                      <th className="py-3 px-4">Credits & Scheme</th>
                      <th className="py-3 px-4">Allocated Faculty</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {subjects.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50/70">
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-gray-900">{sub.name}</p>
                          <p className="text-[10px] text-blue-600 font-bold">{sub.code}</p>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {sub.credits} Credits • {sub.type}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-800">
                          {sub.assignedTeacherName || <span className="text-rose-500 font-semibold">Unassigned</span>}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                            Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setAssignSubjectCode(sub.code);
                              setIsAssignModalOpen(true);
                            }}
                            className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            Change Faculty
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 5. ACADEMIC MANAGEMENT (Grouped Attendance, IA Marks, Assignments)
  // =========================================================================
  if (
    currentPage === 'academic-management' ||
    currentPage === 'attendance-overview' ||
    currentPage === 'ia-overview' ||
    currentPage === 'assignments-overview'
  ) {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Academic Management — 5th Sem CSE-A</h2>
            <p className="text-xs text-gray-500">Monitor class attendance, internal assessment CIE performance, and assignment coursework.</p>
          </div>
          {academicTab === 'assignments' && (
            <button
              onClick={() => setIsNewAssignmentOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} /> Create Assignment Notice
            </button>
          )}
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setAcademicTab('attendance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              academicTab === 'attendance'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarCheck size={14} /> Attendance Management
          </button>
          <button
            onClick={() => setAcademicTab('ia')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              academicTab === 'ia'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award size={14} /> Internal Assessment (IA) Marks
          </button>
          <button
            onClick={() => setAcademicTab('assignments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              academicTab === 'assignments'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ClipboardList size={14} /> Assignments & Deadlines
          </button>
        </div>

        {/* TAB 1: ATTENDANCE MANAGEMENT */}
        {academicTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Subject-wise Attendance Distribution</h3>
                  <p className="text-xs text-gray-500">Live lecture attendance stats across all subjects for Section A</p>
                </div>
                <button
                  onClick={() => showToast('Attendance register exported in VTU compliance format', 'success')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Download size={14} /> Export Register
                </button>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Subject Teacher</th>
                    <th className="py-3 px-4 text-center">Sessions Held</th>
                    <th className="py-3 px-4 text-center">Class Avg %</th>
                    <th className="py-3 px-4 text-center">Shortage (&lt;75%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {[
                    { code: '21CS51', name: 'Management & Entrepreneurship', teacher: 'Prof. Mohan K.', sessions: 32, avg: '88.5%', count: 2 },
                    { code: '21CS52', name: 'Computer Networks', teacher: 'Prof. Ananya Sharma', sessions: 35, avg: '76.2%', count: 6 },
                    { code: '21CS53', name: 'Database Management Systems', teacher: 'Dr. K. Srinivas', sessions: 36, avg: '83.4%', count: 3 },
                    { code: '21CS54', name: 'Theory of Computation', teacher: 'Prof. Prakash Rao', sessions: 34, avg: '78.0%', count: 5 },
                    { code: '21CSL57', name: 'Computer Networks Lab', teacher: 'Prof. Ananya Sharma', sessions: 24, avg: '91.2%', count: 1 },
                    { code: '21CSL58', name: 'DBMS Lab with Mini Project', teacher: 'Dr. K. Srinivas', sessions: 23, avg: '87.0%', count: 2 }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/70">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{row.name}</p>
                        <p className="text-[10px] text-blue-600 font-bold">{row.code}</p>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-800">{row.teacher}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-gray-700">{row.sessions}</td>
                      <td className="py-3.5 px-4 text-center font-black text-gray-900">{row.avg}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-rose-600 font-black bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          {row.count} Students
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Critical Attendance Watch-List */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">Attendance Shortage Watch-List (&lt; 75%)</h4>
                  <p className="text-xs text-gray-500">Students at risk of VTU examination detention</p>
                </div>
                <button
                  onClick={() => showToast('Dispatched shortage intimations to parent SMS/email portals', 'success')}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Send Parent Warning Letters
                </button>
              </div>

              <div className="divide-y divide-gray-100 text-xs">
                {classStudents.filter(s => s.overallAttendance < 75).map(s => (
                  <div key={s.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{s.name} ({s.usn})</p>
                      <p className="text-gray-500 text-[11px]">{s.totalClassesAttended} attended of {s.totalClassesHeld} total sessions held</p>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-600 font-black text-sm">{s.overallAttendance}%</span>
                      <p className="text-[10px] text-rose-500 font-bold uppercase">Severe Shortage</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERNAL ASSESSMENT (IA) MARKS */}
        {academicTab === 'ia' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { subject: 'Computer Networks', code: '21CS52', ia1Avg: '23.4 / 30', ia2Avg: '21.8 / 30', passRate: '92%' },
                { subject: 'Database Management Systems', code: '21CS53', ia1Avg: '24.8 / 30', ia2Avg: '25.2 / 30', passRate: '96%' },
                { subject: 'Theory of Computation', code: '21CS54', ia1Avg: '21.0 / 30', ia2Avg: '20.4 / 30', passRate: '88%' }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-blue-600">{item.code}</span>
                  <h3 className="text-sm font-black text-gray-900 mt-0.5 mb-3">{item.subject}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">IA-1 Average:</span>
                      <span className="font-bold text-gray-800">{item.ia1Avg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IA-2 Average:</span>
                      <span className="font-bold text-gray-800">{item.ia2Avg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pass Rate:</span>
                      <span className="font-black text-emerald-600">{item.passRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Continuous Evaluation Performance Ledger</h3>
                  <p className="text-xs text-gray-500">Summary of student averages across all Continuous Internal Evaluation (CIE) components</p>
                </div>
                <button
                  onClick={() => showToast('CIE Ledger exported in university Excel format', 'success')}
                  className="px-3.5 py-1.5 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Download CIE Sheet
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px] font-extrabold tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4 text-center">IA-1 (Avg)</th>
                      <th className="py-3 px-4 text-center">IA-2 (Avg)</th>
                      <th className="py-3 px-4 text-center">Total CIE %</th>
                      <th className="py-3 px-4 text-center">CIE Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {classStudents.slice(0, 8).map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/70">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{s.name}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">{s.usn}</td>
                        <td className="py-3.5 px-4 text-center font-semibold">24 / 30</td>
                        <td className="py-3.5 px-4 text-center font-semibold">23 / 30</td>
                        <td className="py-3.5 px-4 text-center font-black text-blue-600">{s.avgIA}%</td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.avgIA >= 80
                                ? 'bg-emerald-50 text-emerald-700'
                                : s.avgIA >= 60
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {s.avgIA >= 80 ? 'Distinction' : s.avgIA >= 60 ? 'First Class' : 'Remedial Needed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS & DEADLINES */}
        {academicTab === 'assignments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {asg.subjectCode}
                      </span>
                      <h4 className="text-sm font-black text-gray-900">{asg.title}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded-full ${
                          asg.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {asg.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 max-w-xl">{asg.description}</p>
                    <p className="text-[11px] text-gray-400">
                      Due: <strong>{asg.dueDate}</strong> • Faculty: {asg.teacherName} • Max Marks: {asg.maxMarks}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-gray-900">
                      {asg.submissionsCount} / {asg.totalStudents}
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Submissions Received</p>
                    <div className="w-32 bg-gray-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{
                          width: `${Math.round((asg.submissionsCount / asg.totalStudents) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 6. COMMUNICATION & MONITORING (Grouped Alerts, Notifications, Reports, Announcements)
  // =========================================================================
  if (
    currentPage === 'communication-monitoring' ||
    currentPage === 'academic-alerts' ||
    currentPage === 'correction-requests' ||
    currentPage === 'reports' ||
    currentPage === 'announcements'
  ) {
    return (
      <div className="space-y-6">
        {/* Header & Sub-Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Communication & Monitoring</h2>
            <p className="text-xs text-gray-500">Early alerts, discrepancy corrections, official VTU reports, and class broadcast notices.</p>
          </div>
          {commTab === 'announcements' && (
            <button
              onClick={() => setIsNewAnnouncementOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={15} /> Post Class Notice
            </button>
          )}
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setCommTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              commTab === 'alerts'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <AlertCircle size={14} /> Early Alerts ({classAlerts.filter(a => a.status === 'open').length})
          </button>
          <button
            onClick={() => setCommTab('notifications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              commTab === 'notifications'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle size={14} /> Discrepancy Correction Requests ({correctionRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setCommTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              commTab === 'reports'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileSpreadsheet size={14} /> Official Reports
          </button>
          <button
            onClick={() => setCommTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              commTab === 'announcements'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Megaphone size={14} /> Announcements ({announcements.length})
          </button>
        </div>

        {/* TAB 1: EARLY ALERTS */}
        {commTab === 'alerts' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Active Academic Risk Warnings</h3>
                  <p className="text-xs text-gray-500">Rule-based alerts evaluating attendance drop-offs and test performance declines</p>
                </div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                  {classAlerts.filter(a => a.status === 'open').length} Requiring Attention
                </span>
              </div>

              <div className="space-y-3">
                {classAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            alt.severity === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {alt.severity}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900">{alt.title}</h4>
                        <span className="text-[10px] text-gray-400">• {alt.date}</span>
                      </div>
                      <p className="text-gray-600">{alt.reason}</p>
                      <p className="text-blue-700 font-semibold text-[11px]">
                        Target Remedy: {alt.recommendedAction}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Student: <strong>{alt.studentName}</strong> ({alt.studentUsn})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {alt.status === 'open' ? (
                        <button
                          onClick={() => {
                            setResolvingAlert(alt);
                            setCounselingNotes('');
                          }}
                          className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-xs"
                        >
                          Remediate & Resolve
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 size={15} /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CORRECTION REQUESTS */}
        {commTab === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900">Student Discrepancy Claims</h3>
                  <p className="text-xs text-gray-500">Student appeals for missed attendance periods or test clerical marks checks</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {correctionRequests.filter(r => r.status === 'pending').length} Pending Review
                </span>
              </div>

              <div className="space-y-3">
                {correctionRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-gray-200/70 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                          {req.type}
                        </span>
                        <h4 className="font-bold text-gray-900">{req.studentName} ({req.studentUsn})</h4>
                        <span className="text-gray-400 text-[10px]">({req.subjectName})</span>
                      </div>
                      <p className="text-gray-600 text-xs">{req.details}</p>
                      <p className="text-[11px] text-blue-600 mt-1 font-bold">
                        Claimed Value: {req.requestedValue} (Currently Recorded: {req.originalValue})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => resolveCorrectionRequest(req.id, 'approved', 'Verified and rectified in records')}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => resolveCorrectionRequest(req.id, 'rejected', 'Absence verified in master register')}
                            className="px-3.5 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-bold text-xs"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`font-bold capitalize text-xs ${
                            req.status === 'approved' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {commTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-black text-gray-900">VTU Shortage Intimation Notice</h4>
              <p className="text-xs text-gray-500">
                Official institutional letters for students with attendance below 75% for parent counseling and university records.
              </p>
              <button
                onClick={() => showToast('Attendance shortage notice generated for 7 students', 'success')}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Download size={14} /> Generate Shortage Letters
              </button>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-3">
              <h4 className="text-sm font-black text-gray-900">Continuous Evaluation Performance Ledger</h4>
              <p className="text-xs text-gray-500">
                Consolidated marks sheet combining CIE-1, CIE-2, lab records, and assignments for VTU uploading.
              </p>
              <button
                onClick={() => showToast('Class CIE register downloaded in CSV/Excel format', 'success')}
                className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Download size={14} /> Export CIE Ledger
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: ANNOUNCEMENTS */}
        {commTab === 'announcements' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">{ann.date}</span>
                  </div>
                  <h4 className="text-sm font-black text-gray-900">{ann.title}</h4>
                  <p className="text-xs text-gray-600">{ann.content}</p>
                  <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
                    Posted by: <strong>{ann.authorName}</strong> ({ann.authorRole})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // 7. SETTINGS (Profile Details & Account Preferences)
  // =========================================================================
  if (currentPage === 'settings' || currentPage === 'profile') {
    return (
      <div className="space-y-6 max-w-4xl">
        {/* Header & Sub-Tabs */}
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Class Teacher Settings & Preferences</h2>
          <p className="text-xs text-gray-500">Manage coordinator profile details, contact information, and early alert threshold preferences.</p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setSettingsTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'profile'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <User size={14} /> Profile Details
          </button>
          <button
            onClick={() => setSettingsTab('preferences')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              settingsTab === 'preferences'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Sliders size={14} /> Account Preferences
          </button>
        </div>

        {/* TAB 1: PROFILE DETAILS */}
        {settingsTab === 'profile' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-sm">
                KS
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">{teacherProfile.name}</h3>
                <p className="text-xs text-gray-500">{teacherProfile.designation}</p>
                <p className="text-xs font-bold text-blue-600 mt-0.5">Assigned Class: 5th Sem CSE - Section A</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Class Teacher profile updated successfully', 'success');
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Full Faculty Name</label>
                  <input
                    type="text"
                    value={teacherProfile.name}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Employee / Faculty ID</label>
                  <input
                    type="text"
                    disabled
                    value={teacherProfile.employeeId}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Official Email Address</label>
                  <input
                    type="email"
                    value={teacherProfile.email}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={teacherProfile.phone}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Cabin Location</label>
                  <input
                    type="text"
                    value={teacherProfile.cabin}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, cabin: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Office Counseling Hours</label>
                  <input
                    type="text"
                    value={teacherProfile.officeHours}
                    onChange={(e) => setTeacherProfile({ ...teacherProfile, officeHours: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ACCOUNT PREFERENCES */}
        {settingsTab === 'preferences' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-black text-gray-900">Academic Alert Thresholds & Notifications</h3>
              <p className="text-xs text-gray-500">Fine-tune automated triggers for Section A students</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Warning Attendance</span>
                  <p className="text-xl font-black text-amber-600 mt-1">{prefForm.warningAttendance}%</p>
                  <p className="text-[11px] text-gray-500 mt-1">Triggers early warning counselor notification</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Critical Attendance</span>
                  <p className="text-xl font-black text-rose-600 mt-1">{prefForm.minAttendance}%</p>
                  <p className="text-[11px] text-gray-500 mt-1">VTU mandatory exam eligibility threshold</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <span className="text-[10px] font-bold uppercase text-gray-400">IA Warning Level</span>
                  <p className="text-xl font-black text-purple-600 mt-1">{prefForm.iaWarning}%</p>
                  <p className="text-[11px] text-gray-500 mt-1">CIE passing threshold for remedial classes</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="font-bold text-gray-900">Communication Channels</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefForm.emailAlerts}
                      onChange={(e) => setPrefForm({ ...prefForm, emailAlerts: e.target.checked })}
                      className="rounded text-black focus:ring-0"
                    />
                    <span className="font-semibold text-gray-800">Email notification when a student slips into critical risk zone</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefForm.smsToParents}
                      onChange={(e) => setPrefForm({ ...prefForm, smsToParents: e.target.checked })}
                      className="rounded text-black focus:ring-0"
                    />
                    <span className="font-semibold text-gray-800">Automate SMS intimation to parents for 3 consecutive lecture absences</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefForm.autoReminders}
                      onChange={(e) => setPrefForm({ ...prefForm, autoReminders: e.target.checked })}
                      className="rounded text-black focus:ring-0"
                    />
                    <span className="font-semibold text-gray-800">Weekly consolidated attendance summary sent to Class Representatives</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => showToast('Class Teacher alert preferences saved', 'success')}
                  className="px-5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl font-bold shadow-xs"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Session & Sign Out Card */}
        <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                <LogOut size={16} />
              </span>
              <h4 className="text-sm font-bold text-gray-900">Account Session & Logout</h4>
            </div>
            <p className="text-xs text-gray-500 max-w-xl">
              Sign out of the Academio Class Teacher workspace on this device. You will need to re-authenticate with your faculty credentials to manage student rosters, attendance ledgers, and parent intimations.
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
  // MODALS (Shared across views)
  // =========================================================================
  return (
    <div>
      {/* View Student Detail Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center">
                  {selectedStudentDetail.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">{selectedStudentDetail.name}</h3>
                  <p className="text-xs text-blue-600 font-bold">{selectedStudentDetail.usn} • {selectedStudentDetail.className}</p>
                </div>
              </div>
              <button onClick={() => setSelectedStudentDetail(null)} className="text-gray-400 hover:text-black">
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase">Attendance</span>
                  <p className={`text-base font-black ${selectedStudentDetail.overallAttendance < 75 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {selectedStudentDetail.overallAttendance}%
                  </p>
                  <p className="text-[10px] text-gray-500">{selectedStudentDetail.totalClassesAttended} of {selectedStudentDetail.totalClassesHeld} classes</p>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] font-bold uppercase">IA Performance</span>
                  <p className="text-base font-black text-blue-600">{selectedStudentDetail.avgIA}%</p>
                  <p className="text-[10px] text-gray-500">Continuous Assessment Average</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Subject Attendance Breakdown (Demonstration)</h4>
                <div className="space-y-1.5">
                  {subjects.map((sub, i) => (
                    <div key={sub.id} className="flex justify-between items-center p-2 rounded-lg bg-gray-50/70 border border-gray-100 text-[11px]">
                      <div>
                        <span className="font-bold text-gray-800">{sub.name}</span>
                        <span className="text-gray-400 ml-1">({sub.code})</span>
                      </div>
                      <span className={`font-black ${i === 1 && selectedStudentDetail.usn === '1RV22CS084' ? 'text-rose-600' : 'text-gray-800'}`}>
                        {i === 1 && selectedStudentDetail.usn === '1RV22CS084' ? '71.4% (Shortage)' : '84.0%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  showToast(`Parent counseling intimation dispatched for ${selectedStudentDetail.name}`, 'info');
                  setSelectedStudentDetail(null);
                }}
                className="px-3.5 py-1.5 bg-rose-50 text-rose-700 font-bold rounded-xl text-xs hover:bg-rose-100"
              >
                Send Parent Notice
              </button>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-1.5 bg-black text-white font-bold rounded-xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Edit Student Details</h3>
              <button onClick={() => setEditingStudent(null)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStudent(editingStudent);
                showToast(`Student record for ${editingStudent.name} updated`, 'success');
                setEditingStudent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">USN</label>
                <input
                  type="text"
                  required
                  value={editingStudent.usn}
                  onChange={(e) => setEditingStudent({ ...editingStudent, usn: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={editingStudent.email}
                  onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={editingStudent.phone || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-3.5 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle size={20} />
              <h3 className="text-sm font-black text-gray-900">Remove Student from Section A?</h3>
            </div>
            <p className="text-xs text-gray-600 mb-4">
              Are you sure you want to remove <strong>{studentToDelete.name}</strong> ({studentToDelete.usn}) from the 5th Sem CSE-A roster?
            </p>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 border border-gray-200 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteStudent(studentToDelete.id);
                  showToast(`Removed ${studentToDelete.name} from classroom`, 'info');
                  setStudentToDelete(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Join Request Modal */}
      {rejectingRequestId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <h3 className="text-sm font-black text-gray-900 mb-2">Specify Reason for Rejection</h3>
            <p className="text-xs text-gray-500 mb-3">
              Please enter the reason for rejecting this student join request (e.g., incorrect branch or mismatched section).
            </p>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Student belongs to Section B / Branch mismatch"
              className="w-full p-2.5 border border-gray-200 rounded-xl text-xs mb-3 focus:outline-none focus:border-black"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectingRequestId(null)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rejectStudentJoinRequest(rejectingRequestId, rejectionReasonInput || 'Verification criteria not satisfied');
                  setRejectingRequestId(null);
                }}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Teacher Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <h3 className="text-sm font-black text-gray-900 mb-3">Allot Faculty to Course</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Subject</label>
                <select
                  value={assignSubjectCode}
                  onChange={(e) => setAssignSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-bold"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.code}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Qualified Faculty</label>
                <select
                  value={assignTeacherName}
                  onChange={(e) => setAssignTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-bold"
                >
                  {subjectTeachers.map((t) => (
                    <option key={t.id} value={t.name}>{t.name} ({t.department})</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    assignTeacherToSubject(assignSubjectCode, 'cls-1', assignTeacherName);
                    showToast(`Assigned ${assignTeacherName} to ${assignSubjectCode}`, 'success');
                    setIsAssignModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Confirm Allotment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Add Faculty Member</h3>
              <button onClick={() => setIsAddTeacherOpen(false)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addSubjectTeacher({
                  name: newTeacherForm.name,
                  email: newTeacherForm.email,
                  phone: newTeacherForm.phone,
                  collegeId: 'col-1',
                  collegeName: 'RV College of Engineering',
                  department: newTeacherForm.department,
                  subjects: ['21CS52 - Computer Networks']
                });
                showToast(`Faculty member ${newTeacherForm.name} registered`, 'success');
                setIsAddTeacherOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Babu"
                  value={newTeacherForm.name}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh.cs@rvce.edu.in"
                  value={newTeacherForm.email}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={newTeacherForm.phone}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Register Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {isNewAssignmentOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Create Assignment Notice</h3>
              <button onClick={() => setIsNewAssignmentOpen(false)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAssignment({
                  title: newAssignmentForm.title,
                  subjectCode: newAssignmentForm.subjectCode,
                  subjectName: newAssignmentForm.subjectName,
                  teacherName: newAssignmentForm.teacherName,
                  collegeId: 'col-1',
                  classId: 'cls-1',
                  className: '5th Sem CSE - Section A',
                  assignedDate: new Date().toISOString().split('T')[0],
                  dueDate: newAssignmentForm.dueDate,
                  maxMarks: Number(newAssignmentForm.maxMarks),
                  description: newAssignmentForm.description,
                  submissionsCount: 0,
                  totalStudents: classStudents.length,
                  status: 'active'
                });
                setIsNewAssignmentOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireshark Packet Analysis Lab Report"
                  value={newAssignmentForm.title}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subject</label>
                  <select
                    value={newAssignmentForm.subjectCode}
                    onChange={(e) => {
                      const sub = subjects.find(s => s.code === e.target.value);
                      setNewAssignmentForm({
                        ...newAssignmentForm,
                        subjectCode: e.target.value,
                        subjectName: sub ? sub.name : ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white font-semibold"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newAssignmentForm.dueDate}
                    onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  placeholder="Instructions for students regarding submission guidelines..."
                  value={newAssignmentForm.description}
                  onChange={(e) => setNewAssignmentForm({ ...newAssignmentForm, description: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAssignmentOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Announcement Modal */}
      {isNewAnnouncementOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="text-sm font-black text-gray-900">Broadcast Class Notice</h3>
              <button onClick={() => setIsNewAnnouncementOpen(false)} className="text-gray-400 hover:text-black">
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAnnouncement({
                  title: announcementForm.title,
                  content: announcementForm.content,
                  targetRole: 'students',
                  priority: announcementForm.priority,
                  collegeId: 'col-1',
                  category: announcementForm.category,
                  authorName: teacherProfile.name,
                  authorRole: 'Class Teacher',
                  date: new Date().toISOString().split('T')[0]
                });
                setIsNewAnnouncementOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-gray-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Continuous Evaluation Lab Assessment"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={announcementForm.category}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Examinations">Examinations</option>
                    <option value="Attendance Warning">Attendance Warning</option>
                    <option value="Laboratory">Laboratory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Priority</label>
                  <select
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Normal Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice details for Section A students..."
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full p-2.5 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAnnouncementOpen(false)}
                  className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Alert Counseling Dialog */}
      {resolvingAlert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <h3 className="text-sm font-black text-gray-900 mb-2">Remediate & Resolve Early Alert</h3>
            <p className="text-xs text-gray-500 mb-3">
              Student: <strong>{resolvingAlert.studentName}</strong> ({resolvingAlert.studentUsn})
            </p>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs mb-3 space-y-1">
              <p className="font-bold text-gray-800">{resolvingAlert.title}</p>
              <p className="text-gray-600">{resolvingAlert.reason}</p>
              <p className="text-blue-700 font-semibold">Recommended: {resolvingAlert.recommendedAction}</p>
            </div>

            <div>
              <label className="block font-bold text-gray-700 text-xs mb-1">Class Teacher Mentoring Notes</label>
              <textarea
                rows={3}
                value={counselingNotes}
                onChange={(e) => setCounselingNotes(e.target.value)}
                placeholder="e.g. Conducted counseling session; agreed on remedial attendance recovery plan..."
                className="w-full p-2.5 border border-gray-200 rounded-xl text-xs mb-3 focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setResolvingAlert(null)}
                className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resolveAlert(resolvingAlert.id);
                  showToast(`Alert for ${resolvingAlert.studentName} marked as resolved`, 'success');
                  setResolvingAlert(null);
                }}
                className="px-4 py-1.5 bg-black text-white rounded-xl font-bold"
              >
                Complete & Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
              <LogOut size={22} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your session as <span className="font-semibold text-gray-800">Class Teacher (Prof. Rajesh Kulkarni - CSE 5th Sem &apos;A&apos;)</span>? You will need your faculty credentials to sign back in.
            </p>
            <div className="flex items-center justify-end gap-3 text-xs">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  if (onLogout) {
                    onLogout();
                  } else {
                    showToast('Logged out of Academio Class Teacher session', 'info');
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <LogOut size={13} />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
