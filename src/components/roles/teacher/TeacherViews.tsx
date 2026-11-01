import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CalendarCheck,
  Award,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  BarChart3,
  FileSpreadsheet,
  Megaphone,
  User,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Check,
  X,
  FileText,
  Mail,
  Phone,
  FolderTree,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sliders,
  Send,
  Eye,
  Edit2,
  Lock,
  Unlock,
  Shield,
  Key,
  Bell,
  Trash2,
  GraduationCap,
  ExternalLink,
  Printer,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  LogOut
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { Student, AcademicAlert, Assignment, CorrectionRequest } from '../../../types/academic';

type MainSection =
  | 'dashboard'
  | 'my-classes-subjects'
  | 'academic-management'
  | 'academic-insights'
  | 'communication'
  | 'settings-profile';

interface TeacherViewsProps {
  onLogout?: () => void;
}

export const TeacherViews: React.FC<TeacherViewsProps> = ({ onLogout }) => {
  const {
    currentPage,
    setCurrentPage,
    students,
    alerts,
    resolveAlert,
    assignments,
    createAssignment,
    correctionRequests,
    resolveCorrectionRequest,
    announcements,
    createAnnouncement,
    showToast,
    logActivity,
    searchTerm,
    setSearchTerm
  } = useApp();

  // Subject Teacher Scope: Prof. Ananya Sharma (Computer Networks 21CS52 & Networks Lab 21CSL57 for 5th Sem CSE-A & B)
  const teacherName = 'Prof. Ananya Sharma';
  const facultyId = 'RVCE-FAC-048';
  const department = 'Department of Computer Science & Engineering';
  const collegeName = 'R.V. College of Engineering (RVCE), Bengaluru';

  const assignedSubjects = [
    {
      code: '21CS52',
      name: 'Computer Networks',
      classId: 'cls-1',
      className: '5th Sem CSE - Section A',
      credits: 4,
      hours: 50,
      hoursCompleted: 35,
      studentsCount: 64,
      room: 'CS-302',
      schedule: 'Mon 10:00 AM, Wed 09:00 AM, Fri 11:15 AM',
      classTeacher: 'Dr. K. Srinivas'
    },
    {
      code: '21CS52',
      name: 'Computer Networks',
      classId: 'cls-2',
      className: '5th Sem CSE - Section B',
      credits: 4,
      hours: 50,
      hoursCompleted: 34,
      studentsCount: 62,
      room: 'CS-304',
      schedule: 'Tue 11:15 AM, Thu 10:00 AM, Sat 09:00 AM',
      classTeacher: 'Prof. Meenakshi Sundaram'
    },
    {
      code: '21CSL57',
      name: 'Computer Networks Laboratory',
      classId: 'cls-1',
      className: '5th Sem CSE - Section A',
      credits: 2,
      hours: 36,
      hoursCompleted: 24,
      studentsCount: 64,
      room: 'Networks Lab 3 (CS Dept)',
      schedule: 'Thursday 02:00 PM – 05:00 PM',
      classTeacher: 'Dr. K. Srinivas'
    }
  ];

  // Active Subject Selection
  const [selectedSubject, setSelectedSubject] = useState(assignedSubjects[0]);

  // Tab State for Grouped Menus
  const [classesSubjectsTab, setClassesSubjectsTab] = useState<'classes' | 'subjects' | 'directory' | 'details'>('classes');
  const [academicMgmtTab, setAcademicMgmtTab] = useState<'attendance' | 'ia-marks' | 'assignments' | 'corrections'>('attendance');
  const [insightsTab, setInsightsTab] = useState<'analytics' | 'alerts' | 'reports'>('analytics');
  const [communicationTab, setCommunicationTab] = useState<'notifications' | 'announcements'>('announcements');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'account' | 'password'>('profile');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Sync internal tabs if navigated via legacy/direct routes
  useEffect(() => {
    if (currentPage === 'student-directory') {
      setClassesSubjectsTab('directory');
    } else if (currentPage === 'attendance') {
      setAcademicMgmtTab('attendance');
    } else if (currentPage === 'ia-marks') {
      setAcademicMgmtTab('ia-marks');
    } else if (currentPage === 'assignments') {
      setAcademicMgmtTab('assignments');
    } else if (currentPage === 'correction-requests') {
      setAcademicMgmtTab('corrections');
    } else if (currentPage === 'subject-analytics') {
      setInsightsTab('analytics');
    } else if (currentPage === 'academic-alerts') {
      setInsightsTab('alerts');
    } else if (currentPage === 'reports') {
      setInsightsTab('reports');
    } else if (currentPage === 'announcements') {
      setCommunicationTab('announcements');
    } else if (currentPage === 'profile' || currentPage === 'settings') {
      setSettingsTab('profile');
    }
  }, [currentPage]);

  // Filtered items based on teacher's subjects
  const teacherAlerts = alerts.filter(a => a.subjectCode === '21CS52' || a.subjectCode === '21CSL57');
  const teacherCorrectionRequests = correctionRequests.filter(r => r.subjectCode === '21CS52' || r.subjectCode === '21CSL57');
  const teacherAssignments = assignments.filter(a => a.subjectCode === '21CS52' || a.teacherName.includes('Ananya'));

  // Modals & Forms State
  const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendancePeriod, setAttendancePeriod] = useState(2);
  const [attendanceTopic, setAttendanceTopic] = useState('Network Layer Routing & Distance Vector Protocol');
  const [studentAttendanceMap, setStudentAttendanceMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    students.filter(s => s.classId === 'cls-1').forEach(s => {
      map[s.id] = s.usn !== '1RV22CS086'; // Everyone present except Karthik by default
    });
    return map;
  });

  // Recent Past Attendance Sessions Log
  const [attendanceSessions, setAttendanceSessions] = useState([
    { id: 'att-1', date: '2026-10-15', period: 'Period 2 (10:00 AM)', topic: 'TCP Sliding Window & Flow Control', present: 58, absent: 6, rate: 90.6, locked: true },
    { id: 'att-2', date: '2026-10-13', period: 'Period 1 (09:00 AM)', topic: 'Go-Back-N vs Selective Repeat ARQ Protocols', present: 56, absent: 8, rate: 87.5, locked: true },
    { id: 'att-3', date: '2026-10-10', period: 'Period 4 (12:15 PM)', topic: 'Subnet Masking & CIDR Hierarchical Routing', present: 54, absent: 10, rate: 84.3, locked: true },
    { id: 'att-4', date: '2026-10-08', period: 'Period 2 (10:00 AM)', topic: 'Distance Vector vs Link State Routing Algorithms', present: 59, absent: 5, rate: 92.1, locked: true },
    { id: 'att-5', date: '2026-10-05', period: 'Period 3 (11:15 AM)', topic: 'IPv6 Header Format & Dual Stack Translation', present: 52, absent: 12, rate: 81.2, locked: true }
  ]);

  // IA Marks State
  const [selectedIAType, setSelectedIAType] = useState<'IA-1' | 'IA-2' | 'Lab Internal'>('IA-2');
  const [isMarksLocked, setIsMarksLocked] = useState(false);
  const [studentIAMarksMap, setStudentIAMarksMap] = useState<Record<string, number>>({
    'stu-1': 19, // Rahul Sharma
    'stu-2': 28, // Priya
    'stu-3': 14, // Karthik
    'stu-4': 25, // Sneha
    'stu-5': 20, // Zaid
  });

  // Create Assignment Modal
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    className: '5th Sem CSE - Section A',
    dueDate: '',
    maxMarks: 20,
    description: ''
  });

  // Submissions Roster Modal for an Assignment
  const [gradingAssignment, setGradingAssignment] = useState<Assignment | null>(null);
  const [assignmentSubmissions, setAssignmentSubmissions] = useState([
    { id: 'sub-1', studentName: 'Rahul Sharma', usn: '1RV22CS084', submittedDate: '2026-10-14 11:20 PM', file: 'CN_Lab_Socket_Program_Rahul.pdf', status: 'Submitted', score: 18, graded: true },
    { id: 'sub-2', studentName: 'Priya K. Patel', usn: '1RV22CS085', submittedDate: '2026-10-14 06:15 PM', file: 'Wireshark_Packet_Analysis_Priya.pdf', status: 'Submitted', score: 20, graded: true },
    { id: 'sub-3', studentName: 'Karthik Gowda', usn: '1RV22CS086', submittedDate: '2026-10-15 08:30 AM', file: 'Assignment2_KarthikG.pdf', status: 'Late Submission', score: 14, graded: true },
    { id: 'sub-4', studentName: 'Sneha Rao', usn: '1RV22CS087', submittedDate: '2026-10-14 09:45 PM', file: 'Sneha_CN_Assign2.pdf', status: 'Submitted', score: 19, graded: true },
    { id: 'sub-5', studentName: 'Zaid Khan', usn: '1RV22CS088', submittedDate: '2026-10-15 10:10 PM', file: 'Zaid_Networks_Assignment.pdf', status: 'Submitted', score: 17, graded: true }
  ]);

  // Announcement Modal
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [newAnnouncementText, setNewAnnouncementText] = useState({
    title: '',
    content: '',
    category: 'Academic' as 'Academic' | 'Exam' | 'Circular',
    targetSection: '5th Sem CSE - Section A & B'
  });

  // Student Inspect Modal
  const [inspectStudent, setInspectStudent] = useState<Student | null>(null);

  // Resolve Alert Modal
  const [selectedAlertForCounseling, setSelectedAlertForCounseling] = useState<AcademicAlert | null>(null);
  const [counselingNotes, setCounselingNotes] = useState('');

  // Dispute Resolution State
  const [selectedDispute, setSelectedDispute] = useState<CorrectionRequest | null>(null);
  const [disputeResolutionText, setDisputeResolutionText] = useState('');

  // Report Preview Modal State
  const [previewReport, setPreviewReport] = useState<{ title: string; type: string; date: string } | null>(null);

  // Filtered Students for the directory
  const [directoryClassFilter, setDirectoryClassFilter] = useState<'all' | 'cls-1' | 'cls-2'>('all');
  const classAStudents = students.filter(s => s.classId === 'cls-1');
  const displayStudents = directoryClassFilter === 'all' 
    ? classAStudents 
    : classAStudents.filter(s => s.classId === directoryClassFilter);

  const filteredStudents = displayStudents.filter(s =>
    searchTerm ? (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.usn.toLowerCase().includes(searchTerm.toLowerCase())) : true
  );

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    name: teacherName,
    id: facultyId,
    email: 'ananya.sharma@rvce.edu.in',
    phone: '+91 98860 11223',
    extension: '304',
    cabin: 'CS Department Block, 3rd Floor, Room 312',
    designation: 'Assistant Professor (Senior Scale)',
    department: department,
    mentoringHours: 'Wednesdays & Fridays, 03:00 PM – 04:30 PM',
    specialization: 'Computer Networks, SDN Architecture, IoT Protocols, Network Security',
    education: 'Ph.D. in Computer Science (IISc Bengaluru), M.Tech (VTU Belagavi)'
  });

  // Account Preferences State
  const [accountPrefs, setAccountPrefs] = useState({
    emailAttendanceAlerts: true,
    emailCorrectionRequests: true,
    autoSaveInterval: '5',
    defaultAttendancePeriod: 2,
    enableRemedialAlerts: true,
    smsParentBroadcast: false
  });

  // Password Management State
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications State for Teacher
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 'notif-1',
      title: 'Dispute Raised for Attendance',
      content: 'Karthik Gowda (1RV22CS086) submitted an attendance correction request for Lecture #32 (Oct 11).',
      time: '1 hour ago',
      read: false,
      type: 'warning'
    },
    {
      id: 'notif-2',
      title: 'Early Alert Flagged by System',
      content: 'Rahul Sharma (1RV22CS084) attendance dropped to 71.4% in 21CS52 (Threshold: 75%).',
      time: '3 hours ago',
      read: false,
      type: 'alert'
    },
    {
      id: 'notif-3',
      title: 'Assignment Submissions Update',
      content: '57 of 64 students have submitted Assignment #2: Socket Programming by the deadline.',
      time: 'Yesterday',
      read: true,
      type: 'info'
    },
    {
      id: 'notif-4',
      title: 'Dean of Academics Circular',
      content: 'VTU Form B Continuous Internal Evaluation marks ledger must be finalized by Oct 28.',
      time: '2 days ago',
      read: true,
      type: 'info'
    }
  ]);

  // Helpers
  const toggleStudentAttendance = (studentId: string) => {
    setStudentAttendanceMap(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAllAttendance = (status: boolean) => {
    const updated: Record<string, boolean> = {};
    classAStudents.forEach(s => {
      updated[s.id] = status;
    });
    setStudentAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    const presentCount = Object.values(studentAttendanceMap).filter(Boolean).length;
    const absentCount = classAStudents.length - presentCount;
    const rate = Math.round((presentCount / classAStudents.length) * 1000) / 10;

    const newSession = {
      id: `att-${Date.now()}`,
      date: attendanceDate,
      period: `Period ${attendancePeriod} (${attendancePeriod === 1 ? '09:00 AM' : attendancePeriod === 2 ? '10:00 AM' : attendancePeriod === 3 ? '11:15 AM' : '02:00 PM'})`,
      topic: attendanceTopic,
      present: presentCount,
      absent: absentCount,
      rate: rate,
      locked: true
    };

    setAttendanceSessions(prev => [newSession, ...prev]);
    showToast(`Recorded attendance for ${selectedSubject.name} (${attendanceDate}, Period ${attendancePeriod}): ${presentCount}/${classAStudents.length} Present`, 'success');
    logActivity('Attendance Submitted', teacherName, 'Subject Teacher', `Recorded session attendance for ${selectedSubject.name} - ${presentCount}/${classAStudents.length} present`);
    setIsTakeAttendanceOpen(false);
  };

  const handleSaveIAMarks = () => {
    showToast(`Successfully saved and locked ${selectedIAType} marks for ${selectedSubject.name}`, 'success');
    logActivity('IA Marks Updated', teacherName, 'Subject Teacher', `Updated ${selectedIAType} marks for ${selectedSubject.name} (${selectedSubject.className})`);
    setIsMarksLocked(true);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate) {
      showToast('Please fill in title and due date', 'error');
      return;
    }
    createAssignment({
      collegeId: 'col-1',
      classId: selectedSubject.classId,
      className: selectedSubject.className,
      subjectCode: newAssignment.subjectCode,
      subjectName: newAssignment.subjectName,
      teacherName: teacherName,
      title: newAssignment.title,
      description: newAssignment.description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: newAssignment.dueDate,
      maxMarks: Number(newAssignment.maxMarks),
      submissionsCount: 0,
      totalStudents: selectedSubject.studentsCount,
      status: 'active'
    });
    setIsCreateAssignmentOpen(false);
    showToast(`Published assignment: "${newAssignment.title}"`, 'success');
    logActivity('Assignment Created', teacherName, 'Subject Teacher', `Published assignment: ${newAssignment.title} for ${selectedSubject.className}`);
    setNewAssignment({
      title: '',
      subjectCode: '21CS52',
      subjectName: 'Computer Networks',
      className: '5th Sem CSE - Section A',
      dueDate: '',
      maxMarks: 20,
      description: ''
    });
  };

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.title || !newAnnouncementText.content) {
      showToast('Please enter announcement title and content', 'error');
      return;
    }
    createAnnouncement({
      collegeId: 'col-1',
      title: newAnnouncementText.title,
      content: newAnnouncementText.content,
      targetRole: 'students',
      priority: 'high',
      authorName: teacherName,
      authorRole: 'Subject Teacher (Computer Networks)',
      date: new Date().toISOString().split('T')[0],
      category: newAnnouncementText.category
    });
    setIsAnnouncementModalOpen(false);
    showToast('Notice successfully broadcast to students', 'success');
    logActivity('Announcement Broadcast', teacherName, 'Subject Teacher', `Published notice: ${newAnnouncementText.title}`);
    setNewAnnouncementText({ title: '', content: '', category: 'Academic', targetSection: '5th Sem CSE - Section A & B' });
  };

  const handleResolveAlert = () => {
    if (!selectedAlertForCounseling) return;
    resolveAlert(selectedAlertForCounseling.id);
    showToast(`Alert resolved with faculty counseling note: "${counselingNotes || 'Student advised on remedial attendance schedule.'}"`, 'success');
    logActivity('Alert Resolved', teacherName, 'Subject Teacher', `Resolved alert for ${selectedAlertForCounseling.studentName} with notes`);
    setSelectedAlertForCounseling(null);
    setCounselingNotes('');
  };

  const handleResolveDispute = (action: 'approved' | 'rejected') => {
    if (!selectedDispute) return;
    const resolutionNote = disputeResolutionText || (action === 'approved' ? 'Verified lecture slip. Attendance register updated.' : 'Verified against physical register. Record correct.');
    resolveCorrectionRequest(selectedDispute.id, action, resolutionNote);
    showToast(`Dispute #${selectedDispute.id} has been ${action}.`, action === 'approved' ? 'success' : 'info');
    logActivity('Correction Resolved', teacherName, 'Subject Teacher', `${action.toUpperCase()} dispute for ${selectedDispute.studentName}`);
    setSelectedDispute(null);
    setDisputeResolutionText('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Faculty profile details updated successfully', 'success');
    logActivity('Profile Updated', teacherName, 'Subject Teacher', 'Updated faculty contact and office details');
  };

  const handleSavePreferences = () => {
    showToast('Account preferences and alert thresholds saved', 'success');
    logActivity('Preferences Saved', teacherName, 'Subject Teacher', 'Updated alert preferences');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      showToast('Please enter both current and new passwords', 'error');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      showToast('New password and confirmation do not match', 'error');
      return;
    }
    if (passwordState.newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }
    showToast('Password changed successfully! Keep your credentials secure.', 'success');
    logActivity('Password Changed', teacherName, 'Subject Teacher', 'Updated account password');
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Determine current active section
  const currentSection: MainSection =
    currentPage === 'my-classes-subjects' || currentPage === 'student-directory'
      ? 'my-classes-subjects'
      : currentPage === 'academic-management' || ['attendance', 'ia-marks', 'assignments', 'correction-requests'].includes(currentPage)
      ? 'academic-management'
      : currentPage === 'academic-insights' || ['subject-analytics', 'academic-alerts', 'reports'].includes(currentPage)
      ? 'academic-insights'
      : currentPage === 'communication' || ['announcements', 'notifications'].includes(currentPage)
      ? 'communication'
      : currentPage === 'settings-profile' || currentPage === 'settings' || currentPage === 'profile'
      ? 'settings-profile'
      : 'dashboard';

  /* =========================================================================================
     PAGE 1: DASHBOARD
  ========================================================================================= */
  if (currentSection === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Welcome Header & Role Guardrail */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Shield size={12} className="text-emerald-700" />
                Authorized Course Instructor
              </span>
              <span className="text-gray-400 text-xs">•</span>
              <span className="text-gray-500 text-xs font-semibold">{department} • {collegeName}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-1.5">
              Welcome, {teacherName}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Subject Faculty In-Charge for <strong className="text-gray-800">Computer Networks (21CS52)</strong> & <strong className="text-gray-800">Networks Lab (21CSL57)</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsTakeAttendanceOpen(true)}
              className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <CalendarCheck size={14} />
              Take Today's Attendance
            </button>
            <button
              onClick={() => {
                setCurrentPage('academic-management');
                setAcademicMgmtTab('ia-marks');
              }}
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Award size={14} />
              Enter IA Marks
            </button>
            <button
              onClick={() => setIsCreateAssignmentOpen(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              Post Assignment
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Assigned Classes</span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">3 Batches</div>
            <p className="text-[11px] text-gray-500 font-medium mt-1">126 Total enrolled students</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Average Attendance</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CalendarCheck size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">81.4%</div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +2.1% across 35 lectures held</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">IA-1 & IA-2 Avg</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Award size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">74.2%</div>
            <p className="text-[11px] text-purple-700 font-semibold mt-1">Class Avg: 22.3 / 30 marks</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Academic Alerts</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <AlertCircle size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-600">{teacherAlerts.length} Flagged</div>
            <p className="text-[11px] text-rose-700 font-semibold mt-1">Below VTU 75% threshold in 21CS52</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Pending Tasks</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock size={18} />
              </div>
            </div>
            <div className="text-2xl font-black text-gray-900">{teacherCorrectionRequests.length + 1} Action Items</div>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">1 IA lock + {teacherCorrectionRequests.length} dispute open</p>
          </div>
        </div>

        {/* Assigned Subjects Overview Cards */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Layers size={18} className="text-blue-600" />
                Assigned Subjects & Teaching Load
              </h2>
              <p className="text-xs text-gray-500">VTU 2021 Autonomous Scheme • Odd Semester 2025–26</p>
            </div>
            <button
              onClick={() => {
                setCurrentPage('my-classes-subjects');
                setClassesSubjectsTab('subjects');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto"
            >
              View Full Syllabus & Timetable <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assignedSubjects.map((sub, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all bg-gradient-to-b from-white to-gray-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-gray-900 text-white font-mono">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {sub.credits} Credits
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{sub.name}</h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">{sub.className}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-500">Syllabus Covered</span>
                      <span className="text-gray-900 font-bold">
                        {sub.hoursCompleted} / {sub.hours} hrs ({Math.round((sub.hoursCompleted / sub.hours) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${(sub.hoursCompleted / sub.hours) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 font-medium">
                      <span>Room: {sub.room}</span>
                      <span className="text-emerald-700 font-bold">On Schedule</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-medium">Strength: {sub.studentsCount}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSubject(sub);
                        setIsTakeAttendanceOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gray-900 text-white font-bold text-[11px] hover:bg-black transition-colors"
                    >
                      Record Lecture
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Grid: Students Requiring Academic Follow-Up & Pending Disputes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Students in Teacher's Subject */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-500" />
                <h2 className="text-base font-bold text-gray-900">Attendance Watchlist in 21CS52</h2>
              </div>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                {teacherAlerts.length} At-Risk Students
              </span>
            </div>

            <div className="space-y-3">
              {teacherAlerts.map(alert => (
                <div key={alert.id} className="p-4 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{alert.studentName}</span>
                      <span className="font-mono text-[10px] text-gray-500">({alert.studentUsn})</span>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {alert.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 font-semibold">{alert.title}</p>
                  <p className="text-[11px] text-gray-600 font-medium">
                    Current: <strong className="text-rose-700">{alert.currentValue}%</strong> (VTU Minimum Required: {alert.thresholdValue}%)
                  </p>
                  <div className="p-2 bg-blue-50/80 rounded-lg text-[11px] text-blue-900 font-medium">
                    💡 <strong>Suggested Faculty Remedy:</strong> {alert.recommendedAction}
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        showToast(`Sent counseling reminder email to ${alert.studentName}`, 'info');
                      }}
                      className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-[11px] font-bold transition-colors"
                    >
                      Email Student
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAlertForCounseling(alert);
                      }}
                      className="px-3 py-1 rounded-lg bg-black text-white hover:bg-gray-800 text-[11px] font-bold transition-colors"
                    >
                      Resolve & Counsel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Correction / Dispute Queries */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle size={18} className="text-blue-500" />
                <h2 className="text-base font-bold text-gray-900">Student Correction Requests</h2>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                {teacherCorrectionRequests.length} Open Queries
              </span>
            </div>

            {teacherCorrectionRequests.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-xs font-bold">No pending student disputes</p>
                <p className="text-[11px] text-gray-400 mt-1">All attendance & IA marks records verified</p>
              </div>
            ) : (
              <div className="space-y-3">
                {teacherCorrectionRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-xl border border-gray-200 bg-white space-y-2.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{req.studentName}</span>
                        <span className="font-mono text-[10px] text-gray-500">({req.studentUsn})</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {req.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 font-medium">{req.details}</p>
                    <div className="flex items-center justify-between text-xs bg-gray-50 p-2.5 rounded-xl font-mono">
                      <span className="text-gray-500">Recorded: <strong className="text-gray-800">{req.originalValue}</strong></span>
                      <span className="text-emerald-700 font-bold">Claimed: {req.requestedValue}</span>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setSelectedDispute(req);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors"
                      >
                        Review & Respond
                      </button>
                      <button
                        onClick={() => resolveCorrectionRequest(req.id, 'approved', 'Verified guest lecture attendance slip. Updated to present.')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                      >
                        Quick Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent IA Marks Activity and Active Assignments Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent IA Marks Activity */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-purple-600" />
                <h3 className="font-bold text-sm text-gray-900">Recent IA Marks Activity</h3>
              </div>
              <button
                onClick={() => {
                  setCurrentPage('academic-management');
                  setAcademicMgmtTab('ia-marks');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Open IA Manager
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Continuous Assessment IA-1 (Max 30)</h4>
                  <p className="text-[11px] text-gray-500">Evaluated on Sept 22 • 64 students graded</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600">Avg 22.8/30</span>
                  <span className="block text-[10px] text-gray-400">Locked & Submitted</span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-blue-900">Continuous Assessment IA-2 (Max 30)</h4>
                  <p className="text-[11px] text-blue-700">Currently in grading • 64 students</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-blue-800">Avg 21.9/30</span>
                  <span className="block text-[10px] text-amber-700 font-bold">Ready to Lock</span>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Lab Continuous Evaluation Test (Max 50)</h4>
                  <p className="text-[11px] text-gray-500">Scheduled for Oct 28 • Networks Lab-3</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-gray-500">Upcoming Test</span>
                  <span className="block text-[10px] text-gray-400">Rubric prepared</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Assignments */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-emerald-600" />
                <h3 className="font-bold text-sm text-gray-900">Active Course Assignments</h3>
              </div>
              <button
                onClick={() => setIsCreateAssignmentOpen(true)}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Post New
              </button>
            </div>

            <div className="space-y-3">
              {teacherAssignments.slice(0, 2).map(asg => (
                <div key={asg.id} className="p-3.5 rounded-xl border border-gray-100 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-gray-900 line-clamp-1">{asg.title}</span>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      Due: {asg.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{asg.description}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-gray-500">Submissions</span>
                      <span className="font-bold text-blue-600">
                        {asg.submissionsCount} / {asg.totalStudents} ({Math.round((asg.submissionsCount / asg.totalStudents) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${(asg.submissionsCount / asg.totalStudents) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================================
     PAGE 2: MY CLASSES & SUBJECTS
  ========================================================================================= */
  if (currentSection === 'my-classes-subjects') {
    return (
      <div className="space-y-6">
        {/* Header & Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                My Classes & Assigned Subjects
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Review assigned teaching batches, syllabus coverage, timetable slots, and enrolled student directories.
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full self-start sm:self-auto">
              Teaching Load: 10 Hours / Week
            </span>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setClassesSubjectsTab('classes')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                classesSubjectsTab === 'classes'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FolderTree size={14} />
              My Classes ({assignedSubjects.length})
            </button>
            <button
              onClick={() => setClassesSubjectsTab('subjects')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                classesSubjectsTab === 'subjects'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <BookOpen size={14} />
              My Subjects & Syllabus
            </button>
            <button
              onClick={() => setClassesSubjectsTab('directory')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                classesSubjectsTab === 'directory'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Users size={14} />
              Student Directory ({filteredStudents.length})
            </button>
            <button
              onClick={() => setClassesSubjectsTab('details')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                classesSubjectsTab === 'details'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileText size={14} />
              Class & Allotment Details
            </button>
          </div>
        </div>

        {/* TAB 1: MY CLASSES */}
        {classesSubjectsTab === 'classes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedSubjects.map((sub, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-gray-900 text-white px-2.5 py-1 rounded-md">
                      {sub.code}
                    </span>
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">
                      {sub.className}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Active
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900">{sub.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Class Teacher: <strong>{sub.classTeacher}</strong> • Room: <strong>{sub.room}</strong>
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weekly Lecture Schedule:</span>
                    <span className="font-semibold text-gray-900">{sub.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Enrolled Strength:</span>
                    <span className="font-bold text-gray-900">{sub.studentsCount} Students</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Classes Completed:</span>
                    <span className="font-bold text-blue-700">{sub.hoursCompleted} of {sub.hours} contact hours</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-600">Syllabus Completion</span>
                    <span className="text-blue-600 font-bold">
                      {Math.round((sub.hoursCompleted / sub.hours) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(sub.hoursCompleted / sub.hours) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setClassesSubjectsTab('directory');
                    }}
                    className="font-bold text-gray-700 hover:text-black flex items-center gap-1"
                  >
                    <Users size={14} /> Student List
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubject(sub);
                      setIsTakeAttendanceOpen(true);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Mark Today's Attendance <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: MY SUBJECTS & SYLLABUS */}
        {classesSubjectsTab === 'subjects' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    VTU 2021 Autonomous Scheme
                  </span>
                  <h2 className="text-lg font-black text-gray-900 mt-1">21CS52 — Computer Networks</h2>
                  <p className="text-xs text-gray-500">4 Credits • 50 Lecture Hours • Continuous Internal Evaluation (CIE: 50 Marks, SEE: 50 Marks)</p>
                </div>
                <button
                  onClick={() => showToast('Downloaded VTU 21CS52 official syllabus copy', 'info')}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold flex items-center gap-1.5 hover:bg-gray-50"
                >
                  <Download size={14} /> Download Syllabus PDF
                </button>
              </div>

              {/* Course Outcomes */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-gray-700 uppercase text-[10px] tracking-wider block">Course Outcomes (CO Mapping):</span>
                <ul className="space-y-1 text-gray-600">
                  <li><strong>CO1:</strong> Explain the fundamentals of computer networks, ISO-OSI reference model, and TCP/IP protocol suite.</li>
                  <li><strong>CO2:</strong> Analyze data link layer protocols, error detection (CRC), and medium access control mechanisms.</li>
                  <li><strong>CO3:</strong> Design network addressing schemes using IPv4 subnetting, CIDR, and compute routing paths using Dijkstra and Bellman-Ford.</li>
                  <li><strong>CO4:</strong> Evaluate transport layer reliability mechanisms: TCP sliding window, flow control, and Reno congestion collapse.</li>
                  <li><strong>CO5:</strong> Develop client-server network applications using BSD sockets in C/Python and analyze packets using Wireshark.</li>
                </ul>
              </div>

              {/* Modules Breakdown */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-gray-900">Module-Wise Teaching Progress</h3>
                {[
                  { module: 'Module 1', title: 'Introduction to Networks & Physical/Data Link Layers', hoursPlanned: 10, hoursDone: 10, status: 'Completed' },
                  { module: 'Module 2', title: 'Network Layer, IPv4/IPv6 Addressing, Subnetting & CIDR', hoursPlanned: 10, hoursDone: 10, status: 'Completed' },
                  { module: 'Module 3', title: 'Routing Protocols: Distance Vector, Link State & OSPF', hoursPlanned: 10, hoursDone: 9, status: 'In Progress' },
                  { module: 'Module 4', title: 'Transport Layer Protocols: TCP, UDP, Flow & Congestion Control', hoursPlanned: 10, hoursDone: 6, status: 'In Progress' },
                  { module: 'Module 5', title: 'Application Layer Protocols: DNS, HTTP, SMTP & Socket Programming', hoursPlanned: 10, hoursDone: 0, status: 'Pending' }
                ].map((mod, i) => (
                  <div key={i} className="p-3.5 border border-gray-100 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{mod.module}:</span>
                        <span className="text-gray-700 font-medium">{mod.title}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 mt-0.5 block">{mod.hoursDone} of {mod.hoursPlanned} contact hours covered</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mod.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : mod.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Textbooks */}
              <div className="pt-2 text-xs text-gray-500">
                <strong>Prescribed Reference Textbooks:</strong> James F. Kurose and Keith W. Ross, <em>Computer Networking: A Top-Down Approach</em>, 7th Edition; Andrew S. Tanenbaum, <em>Computer Networks</em>, 5th Edition.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT DIRECTORY */}
        {classesSubjectsTab === 'directory' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Filter Class:</span>
                <select
                  value={directoryClassFilter}
                  onChange={e => setDirectoryClassFilter(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                >
                  <option value="all">All Assigned Students (Section A & B)</option>
                  <option value="cls-1">5th Sem CSE - Section A (64 Students)</option>
                  <option value="cls-2">5th Sem CSE - Section B (62 Students)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or USN..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black w-56 sm:w-64"
                  />
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  {filteredStudents.length} Students
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">21CS52 Attendance</th>
                      <th className="py-3 px-4">IA-1</th>
                      <th className="py-3 px-4">IA-2</th>
                      <th className="py-3 px-4">VTU Standing</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {filteredStudents.map(student => {
                      const isCritical = student.usn === '1RV22CS084' || student.usn === '1RV22CS086';
                      const attPercent = student.usn === '1RV22CS084' ? 71.4 : student.usn === '1RV22CS086' ? 62.5 : 88.0;

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-900 flex items-center gap-2">
                            <div className="size-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-[10px]">
                              {student.name.charAt(0)}
                            </div>
                            <span>{student.name}</span>
                          </td>
                          <td className="py-3 px-4 font-mono text-gray-500">{student.usn}</td>
                          <td className="py-3 px-4 text-gray-600 font-semibold">{student.className}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold ${
                                  attPercent < 75 ? 'text-rose-600' : attPercent < 80 ? 'text-amber-600' : 'text-emerald-600'
                                }`}
                              >
                                {attPercent}%
                              </span>
                              <span className="text-[10px] text-gray-400">
                                ({student.usn === '1RV22CS084' ? '25/35' : student.usn === '1RV22CS086' ? '22/35' : '31/35'})
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {student.usn === '1RV22CS084' ? '22/30' : student.usn === '1RV22CS086' ? '18/30' : '26/30'}
                          </td>
                          <td className="py-3 px-4 font-bold text-gray-800">
                            {student.usn === '1RV22CS084' ? '19/30' : student.usn === '1RV22CS086' ? '14/30' : '28/30'}
                          </td>
                          <td className="py-3 px-4">
                            {isCritical ? (
                              <span className="bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                Shortage Warning
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                Eligible
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setInspectStudent(student)}
                              className="text-blue-600 hover:text-blue-900 font-bold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Subject Card
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CLASS & ALLOTMENT DETAILS */}
        {classesSubjectsTab === 'details' && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900">Academic Allotment & Infrastructure Record</h3>
            <p className="text-xs text-gray-500">Official department faculty assignment ledger for Academic Year 2025–26.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Classroom CS-302 Facilities</span>
                <p className="text-gray-800">Equipped with 4K Interactive Smartboard, Gigabit LAN drop, Wi-Fi 6 access point, audio system.</p>
                <p className="text-gray-500">Seating capacity: 70 students. Designated for 5th Sem CSE-A theory lectures.</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Computer Networks Laboratory (Lab 3)</span>
                <p className="text-gray-800">40 High-performance Linux workstations configured with NS2, Wireshark, Cisco Packet Tracer, and Mininet.</p>
                <p className="text-gray-500">Lab Technician: Mr. Ramesh Kumar (Ext 318).</p>
              </div>
            </div>

            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-blue-900">Department Governance Guideline:</span>
              <p className="text-blue-800">
                Teachers maintain academic authority over marks and attendance for allocated course codes. Structural class-level changes, roster additions, or enrollments must be routed to the respective Class Teacher (Dr. K. Srinivas for Sec A).
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================================
     PAGE 3: ACADEMIC MANAGEMENT
  ========================================================================================= */
  if (currentSection === 'academic-management') {
    return (
      <div className="space-y-6">
        {/* Header with Sub-Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <CalendarCheck size={20} className="text-blue-600" />
                Academic Management Portal
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage lecture attendance sessions, Continuous Internal Evaluation (IA) marks, assignments, and resolve correction disputes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTakeAttendanceOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <CalendarCheck size={14} />
                Record Lecture
              </button>
              <button
                onClick={() => setIsCreateAssignmentOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus size={14} />
                New Task
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setAcademicMgmtTab('attendance')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                academicMgmtTab === 'attendance'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <CalendarCheck size={14} />
              Attendance Management
            </button>
            <button
              onClick={() => setAcademicMgmtTab('ia-marks')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                academicMgmtTab === 'ia-marks'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Award size={14} />
              IA Marks Entry & Locking
            </button>
            <button
              onClick={() => setAcademicMgmtTab('assignments')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                academicMgmtTab === 'assignments'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <ClipboardList size={14} />
              Assignment Management ({teacherAssignments.length})
            </button>
            <button
              onClick={() => setAcademicMgmtTab('corrections')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                academicMgmtTab === 'corrections'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <HelpCircle size={14} />
              Correction Requests
              {teacherCorrectionRequests.length > 0 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {teacherCorrectionRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: ATTENDANCE MANAGEMENT */}
        {academicMgmtTab === 'attendance' && (
          <div className="space-y-6">
            {/* Quick Actions & Shortage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Classes Held</span>
                <div className="text-3xl font-black text-gray-900">35 Lectures</div>
                <p className="text-xs text-gray-500">70% of 50 prescribed contact hours completed</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Overall Subject Rate</span>
                <div className="text-3xl font-black text-emerald-600">81.4%</div>
                <p className="text-xs text-emerald-700 font-medium">59 of 64 students above 75% cutoff</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Critical Shortage List</span>
                <div className="text-3xl font-black text-rose-600">2 Students</div>
                <p className="text-xs text-rose-700 font-medium">Shortage notice dispatched to HOD</p>
              </div>
            </div>

            {/* Attendance Sessions Ledger */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Lecture Session Registers (21CS52)</h2>
                  <p className="text-xs text-gray-500">Recorded sessions locked for audit compliance.</p>
                </div>
                <button
                  onClick={() => setIsTakeAttendanceOpen(true)}
                  className="bg-black text-white hover:bg-gray-800 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Plus size={14} /> New Session
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Topic Covered</th>
                      <th className="py-3 px-4">Present</th>
                      <th className="py-3 px-4">Absent</th>
                      <th className="py-3 px-4">Attendance %</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {attendanceSessions.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{row.date}</td>
                        <td className="py-3 px-4 text-gray-600">{row.period}</td>
                        <td className="py-3 px-4 font-semibold text-gray-900">{row.topic}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">{row.present}</td>
                        <td className="py-3 px-4 text-rose-600 font-bold">{row.absent}</td>
                        <td className="py-3 px-4 font-bold text-gray-900">{row.rate}%</td>
                        <td className="py-3 px-4 text-right">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 justify-end">
                            <Lock size={10} /> Locked
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

        {/* TAB 2: IA MARKS */}
        {academicMgmtTab === 'ia-marks' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Continuous Assessment Marks Entry</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Enter, compute percentage grades, and submit VTU Continuous Internal Evaluation (CIE) scores.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedIAType}
                  onChange={e => setSelectedIAType(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800"
                >
                  <option value="IA-1">Continuous Assessment IA-1 (Max 30)</option>
                  <option value="IA-2">Continuous Assessment IA-2 (Max 30)</option>
                  <option value="Lab Internal">Laboratory Continuous Test (Max 50)</option>
                </select>
                <button
                  onClick={handleSaveIAMarks}
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <Lock size={14} />
                  Save & Lock Marks
                </button>
              </div>
            </div>

            {/* Marks Entry Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <span className="font-bold text-gray-600">
                  Editing: <strong className="text-gray-900">{selectedIAType}</strong> for 5th Sem CSE-A (Computer Networks)
                </span>
                <div className="flex items-center gap-4 text-gray-500">
                  <span>Class Average: <strong className="text-gray-900 font-bold">22.6 / 30</strong></span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    VTU Form B Ledger Mode
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">USN</th>
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Max Marks</th>
                      <th className="py-3 px-4">Marks Obtained</th>
                      <th className="py-3 px-4">Percentage</th>
                      <th className="py-3 px-4">Evaluation Grade</th>
                      <th className="py-3 px-4 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {classAStudents.map(student => {
                      const currentScore = studentIAMarksMap[student.id] ?? 24;
                      const maxMarks = selectedIAType === 'Lab Internal' ? 50 : 30;
                      const percent = Math.round((currentScore / maxMarks) * 100);

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900">{student.usn}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{student.name}</td>
                          <td className="py-3 px-4 font-bold text-gray-500">{maxMarks}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              max={maxMarks}
                              min={0}
                              value={currentScore}
                              onChange={e => {
                                const val = Math.min(maxMarks, Math.max(0, Number(e.target.value)));
                                setStudentIAMarksMap(prev => ({
                                  ...prev,
                                  [student.id]: val
                                }));
                              }}
                              className="w-20 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-bold text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                            />
                          </td>
                          <td className="py-3 px-4 font-bold">
                            <span className={percent < 60 ? 'text-rose-600' : 'text-gray-900'}>{percent}%</span>
                          </td>
                          <td className="py-3 px-4 font-black">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] ${
                                percent >= 85
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : percent >= 70
                                  ? 'bg-blue-100 text-blue-800'
                                  : percent >= 50
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {percent >= 85 ? 'O (Distinction)' : percent >= 70 ? 'A+ (Very Good)' : percent >= 50 ? 'B (Average)' : 'F (Needs Remedial)'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-[11px] text-gray-400">
                            {currentScore < 15 ? 'Remedial coaching required' : 'Satisfactory progress'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENT MANAGEMENT */}
        {academicMgmtTab === 'assignments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Course Assignments & Lab Mini-Projects</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Publish assignments, track student deliverables, download submissions, and grade work.
                </p>
              </div>
              <button
                onClick={() => setIsCreateAssignmentOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
              >
                <Plus size={14} />
                New Assignment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teacherAssignments.map(asg => (
                <div key={asg.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black bg-gray-900 text-white px-2.5 py-1 rounded-md">
                        {asg.subjectCode}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          asg.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {asg.status.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-gray-900">{asg.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{asg.description}</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Submission Due:</span>
                        <span className="text-gray-900 font-bold">{asg.dueDate}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-500">Submissions Received:</span>
                        <span className="text-blue-600 font-bold">
                          {asg.submissionsCount} / {asg.totalStudents} ({Math.round((asg.submissionsCount / asg.totalStudents) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${(asg.submissionsCount / asg.totalStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-400">Max Marks: {asg.maxMarks}</span>
                    <button
                      onClick={() => setGradingAssignment(asg)}
                      className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      Grade Submissions ({asg.submissionsCount}) <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CORRECTION REQUESTS */}
        {academicMgmtTab === 'corrections' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Student Correction Requests & Disputes</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Review student claims for missing attendance marks or IA test paper re-evaluations for 21CS52.
                </p>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full">
                {teacherCorrectionRequests.length} Total Open
              </span>
            </div>

            {teacherCorrectionRequests.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
                <h3 className="font-black text-base text-gray-900">Zero Pending Disputes</h3>
                <p className="text-xs text-gray-500 mt-1">All attendance & marks disputes have been adjudicated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {teacherCorrectionRequests.map(req => (
                  <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">{req.studentName}</h3>
                        <p className="text-xs font-mono text-gray-500">{req.studentUsn} • {req.subjectName}</p>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 bg-gray-50 p-3.5 rounded-xl font-medium leading-relaxed">
                      {req.details}
                    </p>

                    <div className="flex items-center gap-6 text-xs font-mono bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                      <span className="text-gray-500">Currently in Portal: <strong className="text-gray-800">{req.originalValue}</strong></span>
                      <span className="text-emerald-700 font-bold">Claimed Value: {req.requestedValue}</span>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedDispute(req);
                        }}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"
                      >
                        Provide Detailed Adjudication
                      </button>
                      <button
                        onClick={() => resolveCorrectionRequest(req.id, 'rejected', 'Dispute rejected upon verification with physical attendance register.')}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => resolveCorrectionRequest(req.id, 'approved', 'Dispute accepted. Official register updated.')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        Approve Correction
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================================
     PAGE 4: ACADEMIC INSIGHTS
  ========================================================================================= */
  if (currentSection === 'academic-insights') {
    return (
      <div className="space-y-6">
        {/* Header with Sub-Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                Academic Insights & Early Alerts
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Monitor pass percentage distributions, explainable early alert flags, and export VTU consolidated registers.
              </p>
            </div>
            <button
              onClick={() => {
                setInsightsTab('reports');
              }}
              className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
            >
              <FileSpreadsheet size={14} />
              Export VTU Reports
            </button>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setInsightsTab('analytics')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                insightsTab === 'analytics'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={14} />
              Subject Analytics
            </button>
            <button
              onClick={() => setInsightsTab('alerts')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                insightsTab === 'alerts'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <AlertCircle size={14} />
              Academic Alerts ({teacherAlerts.length})
            </button>
            <button
              onClick={() => setInsightsTab('reports')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                insightsTab === 'reports'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileSpreadsheet size={14} />
              VTU Reports & Ledgers
            </button>
          </div>
        </div>

        {/* TAB 1: SUBJECT ANALYTICS */}
        {insightsTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Projected Pass Rate</span>
                <div className="text-4xl font-black text-emerald-600">92.4%</div>
                <p className="text-xs text-gray-500 font-medium">59 of 64 students meeting passing threshold</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Average IA Score</span>
                <div className="text-4xl font-black text-blue-600">74.2%</div>
                <p className="text-xs text-gray-500 font-medium">Combined average across IA-1 & IA-2</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2 text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance Compliance</span>
                <div className="text-4xl font-black text-gray-900">81.4%</div>
                <p className="text-xs text-gray-500 font-medium">5 students below VTU 75% cutoff</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Marks Distribution Bands (21CS52)</h3>
              <div className="space-y-3">
                {[
                  { band: '85% – 100% (Distinction / S Grade)', count: 22, percentage: 34, color: 'bg-emerald-500' },
                  { band: '70% – 84% (First Class / A Grade)', count: 26, percentage: 41, color: 'bg-blue-500' },
                  { band: '60% – 69% (Second Class / B Grade)', count: 11, percentage: 17, color: 'bg-amber-500' },
                  { band: 'Below 60% (At Risk / Remedial Coaching)', count: 5, percentage: 8, color: 'bg-rose-500' }
                ].map((row, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-gray-700">{row.band}</span>
                      <span className="text-gray-900 font-bold">{row.count} Students ({row.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance & IA Correlation Insight */}
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Sparkles size={18} />
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-bold text-emerald-950">Explainable Analytical Finding</h4>
                <p className="text-emerald-900">
                  Students with lecture attendance &gt;85% secured an average score of 25.4/30 in Continuous Assessment IA-2, while students below 75% attendance scored an average of 14.8/30. Targeted remedial classes on Subnetting & CIDR are strongly recommended.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACADEMIC ALERTS */}
        {insightsTab === 'alerts' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">Rule-Based Early Warning Triggers</h3>
                <p className="text-xs text-gray-500">Automated explainable alerts evaluated after each attendance session and test score entry.</p>
              </div>
              <span className="text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 px-3 py-1 rounded-full">
                {teacherAlerts.length} Flagged Cases
              </span>
            </div>

            <div className="space-y-4">
              {teacherAlerts.map(alert => (
                <div key={alert.id} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                        <AlertTriangle size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-gray-900">{alert.title}</h3>
                        <p className="text-xs text-gray-500 font-mono">
                          Student: {alert.studentName} ({alert.studentUsn}) • {alert.className}
                        </p>
                      </div>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                      {alert.severity} Severity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Explainable Trigger Reason</span>
                      <p className="text-gray-800 font-medium">{alert.reason}</p>
                    </div>
                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl space-y-1">
                      <span className="text-blue-600 font-bold uppercase text-[10px]">Recommended Faculty Action</span>
                      <p className="text-blue-900 font-medium">{alert.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-400">Triggered: {alert.date}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          showToast(`Dispatched mentoring notice to ${alert.studentName}`, 'info');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors"
                      >
                        Notify Student
                      </button>
                      <button
                        onClick={() => setSelectedAlertForCounseling(alert)}
                        className="px-4 py-1.5 rounded-xl bg-black text-white hover:bg-gray-800 text-xs font-bold transition-colors"
                      >
                        Resolve with Counseling Note
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {insightsTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Subject Attendance Register',
                  desc: 'Comprehensive lecture session log with date-wise student presence, total classes held, and VTU threshold percentage.',
                  type: 'PDF / Excel Format',
                  code: 'VTU Form A'
                },
                {
                  title: 'Continuous Evaluation IA Sheet',
                  desc: 'Official marks consolidation sheet including IA-1, IA-2, and lab internal scores ready for VTU exam portal submission.',
                  type: 'VTU Form B Ledger',
                  code: 'CIE Ledger'
                },
                {
                  title: 'Attendance Shortage (<75%) Notice',
                  desc: 'Official list of detained or at-risk students for formal transmission to the HOD and Dean of Academics.',
                  type: 'Department Notice',
                  code: 'Official Memo'
                }
              ].map((rep, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 size-fit">
                        <FileSpreadsheet size={20} />
                      </div>
                      <span className="font-mono text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {rep.code}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-gray-900">{rep.title}</h3>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">{rep.desc}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewReport({ title: rep.title, type: rep.type, date: new Date().toISOString().split('T')[0] })}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button
                      onClick={() => showToast(`Generated report "${rep.title}" (Demonstration Export)`, 'success')}
                      className="flex-1 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Download size={14} /> Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================================
     PAGE 5: COMMUNICATION
  ========================================================================================= */
  if (currentSection === 'communication') {
    return (
      <div className="space-y-6">
        {/* Header with Sub-Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Megaphone size={20} className="text-blue-600" />
                Communication & Announcements
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Post academic notices, homework circulars, exam guidelines, and review incoming student notifications.
              </p>
            </div>
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 self-start sm:self-auto"
            >
              <Megaphone size={14} />
              Post New Notice
            </button>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCommunicationTab('announcements')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                communicationTab === 'announcements'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Megaphone size={14} />
              Class Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setCommunicationTab('notifications')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                communicationTab === 'notifications'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Bell size={14} />
              Notifications Log ({notificationsList.filter(n => !n.read).length} Unread)
            </button>
          </div>
        </div>

        {/* TAB 1: ANNOUNCEMENTS */}
        {communicationTab === 'announcements' && (
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {ann.category}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400 font-mono">Target: {ann.targetRole}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{ann.date}</span>
                </div>
                <h3 className="font-bold text-base text-gray-900">{ann.title}</h3>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{ann.content}</p>
                <div className="pt-2 text-[11px] text-gray-400 font-semibold border-t border-gray-50 flex justify-between items-center">
                  <span>Author: {ann.authorName} ({ann.authorRole})</span>
                  <button
                    onClick={() => showToast(`Notice "${ann.title}" copied to clipboard`, 'info')}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Share Notice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS LOG */}
        {communicationTab === 'notifications' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-900">Faculty Notification Stream</h3>
              <button
                onClick={() => {
                  setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
                  showToast('All notifications marked as read', 'success');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Mark All Read
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {notificationsList.map(item => (
                <div key={item.id} className="py-3.5 flex items-start gap-3">
                  <div
                    className={`size-8 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'alert'
                        ? 'bg-rose-100 text-rose-700'
                        : item.type === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <Bell size={16} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
                      <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================================================
     PAGE 6: SETTINGS & PROFILE
  ========================================================================================= */
  if (currentSection === 'settings-profile') {
    return (
      <div className="space-y-6">
        {/* Header with Sub-Tabs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <User size={20} className="text-blue-600" />
                Faculty Settings & Profile
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Manage your academic credentials, office hours, alert thresholds, and account security.
              </p>
            </div>
            <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full self-start sm:self-auto font-mono">
              Faculty ID: {facultyId}
            </span>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-100 pt-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSettingsTab('profile')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                settingsTab === 'profile'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <User size={14} />
              My Profile
            </button>
            <button
              onClick={() => setSettingsTab('account')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                settingsTab === 'account'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Sliders size={14} />
              Account Settings & Preferences
            </button>
            <button
              onClick={() => setSettingsTab('password')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                settingsTab === 'password'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Key size={14} />
              Password & Security
            </button>
          </div>
        </div>

        {/* TAB 1: MY PROFILE */}
        {settingsTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="size-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                AS
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    Subject Faculty
                  </span>
                  <span className="text-xs text-gray-400 font-mono">ID: {facultyId}</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mt-1">{teacherName}</h2>
                <p className="text-xs text-gray-500 font-medium">
                  Assistant Professor (Senior Scale) • Dept. of Computer Science & Engineering
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Official College Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Phone / Intercom</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Faculty Cabin Location</label>
                  <input
                    type="text"
                    value={profileData.cabin}
                    onChange={e => setProfileData({ ...profileData, cabin: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-600 font-bold mb-1">Student Counseling & Mentoring Hours</label>
                  <input
                    type="text"
                    value={profileData.mentoringHours}
                    onChange={e => setProfileData({ ...profileData, mentoringHours: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-600 font-bold mb-1">Areas of Specialization & Research</label>
                  <textarea
                    rows={2}
                    value={profileData.specialization}
                    onChange={e => setProfileData({ ...profileData, specialization: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ACCOUNT SETTINGS */}
        {settingsTab === 'account' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-gray-900">Faculty Alert & Portal Preferences</h3>
              <p className="text-xs text-gray-500">Configure automated alerts, default attendance options, and notification triggers.</p>
            </div>

            <div className="space-y-4 text-xs font-medium divide-y divide-gray-100">
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Email Alerts on Low Attendance</h4>
                  <p className="text-[11px] text-gray-500">Receive instant alerts when a student in 21CS52 drops below 75% attendance.</p>
                </div>
                <input
                  type="checkbox"
                  checked={accountPrefs.emailAttendanceAlerts}
                  onChange={e => setAccountPrefs({ ...accountPrefs, emailAttendanceAlerts: e.target.checked })}
                  className="size-4 accent-black rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Student Dispute Notifications</h4>
                  <p className="text-[11px] text-gray-500">Get notified immediately when a student submits an attendance or marks correction.</p>
                </div>
                <input
                  type="checkbox"
                  checked={accountPrefs.emailCorrectionRequests}
                  onChange={e => setAccountPrefs({ ...accountPrefs, emailCorrectionRequests: e.target.checked })}
                  className="size-4 accent-black rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Default Attendance Lecture Period</h4>
                  <p className="text-[11px] text-gray-500">Auto-select timetable period when opening attendance marker.</p>
                </div>
                <select
                  value={accountPrefs.defaultAttendancePeriod}
                  onChange={e => setAccountPrefs({ ...accountPrefs, defaultAttendancePeriod: Number(e.target.value) })}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold"
                >
                  <option value={1}>Period 1 (09:00 AM)</option>
                  <option value={2}>Period 2 (10:00 AM)</option>
                  <option value={3}>Period 3 (11:15 AM)</option>
                  <option value={4}>Period 4 (12:15 PM)</option>
                  <option value={5}>Period 5 (02:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: PASSWORD MANAGEMENT */}
        {settingsTab === 'password' && (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-xl space-y-6">
            <div>
              <h3 className="font-bold text-base text-gray-900">Change Account Password</h3>
              <p className="text-xs text-gray-500">Ensure your password is at least 8 characters long and contains numbers and symbols.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordState.currentPassword}
                  onChange={e => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={passwordState.newPassword}
                  onChange={e => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={passwordState.confirmPassword}
                  onChange={e => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-[11px] text-gray-500">
                <span className="font-bold text-gray-700 block">Password Guidelines:</span>
                <p>• Must not match previous 3 passwords.</p>
                <p>• Protect your faculty credentials from unauthorized student access.</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
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
              Sign out of your Academio Subject Faculty workspace on this device. You will need to re-authenticate with your faculty credentials to submit attendance ledgers, record IA scores, and upload course materials.
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

  /* =========================================================================================
     MODALS: ATTENDANCE, CREATE ASSIGNMENT, ANNOUNCEMENT, STUDENT CARD, RESOLVE ALERT, DISPUTE, REPORT PREVIEW
  ========================================================================================= */
  return (
    <div>
      {/* Attendance Modal */}
      {isTakeAttendanceOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="font-black text-lg text-gray-900">Mark Class Attendance</h3>
                <p className="text-xs text-gray-500">
                  {selectedSubject.code} - {selectedSubject.name} • {selectedSubject.className}
                </p>
              </div>
              <button
                onClick={() => setIsTakeAttendanceOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Session Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={e => setAttendanceDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Timetable Period</label>
                  <select
                    value={attendancePeriod}
                    onChange={e => setAttendancePeriod(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value={1}>Period 1 (09:00 AM – 10:00 AM)</option>
                    <option value={2}>Period 2 (10:00 AM – 11:00 AM)</option>
                    <option value={3}>Period 3 (11:15 AM – 12:15 PM)</option>
                    <option value={4}>Period 4 (12:15 PM – 01:15 PM)</option>
                    <option value={5}>Period 5 (02:00 PM – 03:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 font-bold mb-1">Selected Batch</label>
                  <select
                    value={selectedSubject.code}
                    onChange={e => {
                      const found = assignedSubjects.find(s => s.code === e.target.value);
                      if (found) setSelectedSubject(found);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {assignedSubjects.map((s, i) => (
                      <option key={i} value={s.code}>{s.code} - {s.className}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 font-bold mb-1 text-xs">Lecture Topic Covered</label>
                <input
                  type="text"
                  placeholder="e.g. Distance Vector Routing & Bellman-Ford equation"
                  value={attendanceTopic}
                  onChange={e => setAttendanceTopic(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Attendance Quick Toggle Header */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-gray-700">
                  Student Roll Call ({classAStudents.length} Students)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => markAllAttendance(true)}
                    className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                  >
                    Mark All Present
                  </button>
                  <button
                    onClick={() => markAllAttendance(false)}
                    className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100"
                  >
                    Mark All Absent
                  </button>
                </div>
              </div>

              {/* Roll Call List */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {classAStudents.map(student => {
                  const isPresent = studentAttendanceMap[student.id] ?? true;
                  return (
                    <div
                      key={student.id}
                      onClick={() => toggleStudentAttendance(student.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                        isPresent ? 'bg-white hover:bg-emerald-50/30' : 'bg-rose-50/40 hover:bg-rose-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPresent ? <Check size={12} /> : <X size={12} />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-gray-900">{student.name}</div>
                          <div className="font-mono text-[10px] text-gray-400">{student.usn}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isPresent ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isPresent ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-xs text-gray-500 font-semibold">
                Summary:{' '}
                <strong className="text-emerald-600 font-bold">
                  {Object.values(studentAttendanceMap).filter(Boolean).length} Present
                </strong>
                ,{' '}
                <strong className="text-rose-600 font-bold">
                  {classAStudents.length - Object.values(studentAttendanceMap).filter(Boolean).length} Absent
                </strong>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTakeAttendanceOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-black text-xs"
                >
                  Save & Lock Attendance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {isCreateAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Post Course Assignment</h3>
              <button
                onClick={() => setIsCreateAssignmentOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Exercise 3: Socket Programming in Python"
                  value={newAssignment.title}
                  onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Subject Code</label>
                  <select
                    value={newAssignment.subjectCode}
                    onChange={e => {
                      const isTheory = e.target.value === '21CS52';
                      setNewAssignment({
                        ...newAssignment,
                        subjectCode: e.target.value,
                        subjectName: isTheory ? 'Computer Networks' : 'Computer Networks Laboratory'
                      });
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="21CS52">21CS52 - Computer Networks</option>
                    <option value="21CSL57">21CSL57 - Networks Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Class Section</label>
                  <input
                    type="text"
                    disabled
                    value={newAssignment.className}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Submission Due Date</label>
                  <input
                    type="date"
                    required
                    value={newAssignment.dueDate}
                    onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    max={50}
                    min={5}
                    value={newAssignment.maxMarks}
                    onChange={e => setNewAssignment({ ...newAssignment, maxMarks: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Problem Statement & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Provide specifications, deliverables, sample packets, and Wireshark capture requirements..."
                  value={newAssignment.description}
                  onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateAssignmentOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grading Submissions Modal */}
      {gradingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-black text-base text-gray-900">{gradingAssignment.title} — Submissions</h3>
                <p className="text-xs text-gray-500">Max Marks: {gradingAssignment.maxMarks} • Due Date: {gradingAssignment.dueDate}</p>
              </div>
              <button
                onClick={() => setGradingAssignment(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
              {assignmentSubmissions.map(sub => (
                <div key={sub.id} className="p-3.5 border border-gray-100 rounded-xl flex items-center justify-between text-xs bg-gray-50/50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{sub.studentName}</span>
                      <span className="font-mono text-[10px] text-gray-500">({sub.usn})</span>
                    </div>
                    <p className="text-[11px] text-blue-600 font-mono font-medium flex items-center gap-1">
                      <FileText size={12} /> {sub.file}
                    </p>
                    <span className="text-[10px] text-gray-400">Uploaded: {sub.submittedDate}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-500 font-bold">Marks:</span>
                      <input
                        type="number"
                        max={gradingAssignment.maxMarks}
                        min={0}
                        value={sub.score}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setAssignmentSubmissions(prev =>
                            prev.map(item => (item.id === sub.id ? { ...item, score: val } : item))
                          );
                        }}
                        className="w-14 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-center"
                      />
                      <span className="text-gray-400">/{gradingAssignment.maxMarks}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Saved grade for ${sub.studentName}: ${sub.score}/${gradingAssignment.maxMarks}`, 'success')}
                      className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-black text-white text-[11px] font-bold"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setGradingAssignment(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Broadcast Notice to Students</h3>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handlePostAnnouncement} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Exam Date Sheet & Wireshark Viva Guidelines"
                  value={newAnnouncementText.title}
                  onChange={e => setNewAnnouncementText({ ...newAnnouncementText, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Category</label>
                  <select
                    value={newAnnouncementText.category}
                    onChange={e => setNewAnnouncementText({ ...newAnnouncementText, category: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Academic">Academic Notice</option>
                    <option value="Exam">Exam Schedule</option>
                    <option value="Circular">General Circular</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Audience</label>
                  <input
                    type="text"
                    disabled
                    value={newAnnouncementText.targetSection}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Notice Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed instructions, reporting timings, lab dress code, and mandatory references..."
                  value={newAnnouncementText.content}
                  onChange={e => setNewAnnouncementText({ ...newAnnouncementText, content: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Inspect Modal */}
      {inspectStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Subject Academic Card</h3>
              <button
                onClick={() => setInspectStudent(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
            <div className="py-4 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-lg font-black">
                  {inspectStudent.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{inspectStudent.name}</h4>
                  <p className="font-mono text-gray-500">{inspectStudent.usn}</p>
                  <p className="text-[11px] text-gray-400">{inspectStudent.className}</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Course Code:</span>
                  <span className="text-gray-900">Computer Networks (21CS52)</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Subject Attendance:</span>
                  <span className={inspectStudent.usn === '1RV22CS084' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {inspectStudent.usn === '1RV22CS084' ? '71.4% (25 of 35 lectures)' : '88.6% (31 of 35 lectures)'}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">IA-1 Score:</span>
                  <span className="text-gray-900 font-bold">22 / 30</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">IA-2 Score:</span>
                  <span className="text-gray-900 font-bold">19 / 30</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-500">Lab Continuous Evaluation:</span>
                  <span className="text-emerald-600 font-bold">36 / 50</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900">
                <p className="font-bold text-[11px]">Faculty Recommendation:</p>
                <p className="text-[11px] mt-0.5 font-medium">
                  {inspectStudent.usn === '1RV22CS084'
                    ? 'Advise student to attend next 5 consecutive lectures to reach VTU 75% exam threshold.'
                    : 'Performance is on track. Advise participation in advanced socket programming mini-project.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectStudent(null)}
                className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold"
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Alert with Counseling Note Modal */}
      {selectedAlertForCounseling && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Resolve Early Academic Alert</h3>
              <button
                onClick={() => setSelectedAlertForCounseling(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 text-rose-900">
                <p className="font-bold">{selectedAlertForCounseling.title}</p>
                <p className="text-[11px] font-mono mt-0.5">Student: {selectedAlertForCounseling.studentName} ({selectedAlertForCounseling.studentUsn})</p>
                <p className="text-[11px] mt-1">{selectedAlertForCounseling.reason}</p>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Faculty Mentoring & Counseling Notes</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Record counseling discussion, agreed attendance recovery schedule, or remedial test plan..."
                  value={counselingNotes}
                  onChange={e => setCounselingNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAlertForCounseling(null)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveAlert}
                className="px-5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white font-black text-xs"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Review & Adjudication Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Adjudicate Student Dispute</h3>
              <button
                onClick={() => setSelectedDispute(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{selectedDispute.studentName}</span>
                  <span className="font-mono text-gray-500">{selectedDispute.studentUsn}</span>
                </div>
                <p className="text-gray-700 font-medium">{selectedDispute.details}</p>
                <div className="text-[11px] font-mono pt-1 text-gray-600">
                  Recorded: <strong>{selectedDispute.originalValue}</strong> → Claimed: <strong>{selectedDispute.requestedValue}</strong>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Faculty Reason & Verification Ledger Note</label>
                <textarea
                  rows={3}
                  placeholder="Enter remarks explaining whether physical register matched the claim..."
                  value={disputeResolutionText}
                  onChange={e => setDisputeResolutionText(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleResolveDispute('rejected')}
                className="px-4 py-2 rounded-xl border border-gray-200 text-rose-600 hover:bg-rose-50 font-bold text-xs"
              >
                Reject Claim
              </button>
              <button
                onClick={() => handleResolveDispute('approved')}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs"
              >
                Approve & Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-blue-600" />
                <h3 className="font-black text-base text-gray-900">{previewReport.title}</h3>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-mono">
              <div className="p-3 bg-gray-900 text-gray-100 rounded-xl space-y-1">
                <p className="font-bold">VTU AUTONOMOUS REPORT PREVIEW</p>
                <p className="text-[11px] text-gray-400">R.V. COLLEGE OF ENGINEERING, BENGALURU</p>
                <p className="text-[11px] text-gray-400">Department of Computer Science & Engineering</p>
                <p className="text-[11px] text-emerald-400">Course: 21CS52 Computer Networks • Faculty: {teacherName}</p>
                <p className="text-[11px] text-gray-400">Generated: {previewReport.date}</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-gray-700 space-y-1 text-[11px]">
                <p>• Total Enrolled: 64 Students (5th Sem CSE-A)</p>
                <p>• Total Lectures Conducted: 35 Hours</p>
                <p>• Average Attendance: 81.4% (VTU Minimum Cutoff: 75%)</p>
                <p>• Students Detained/Shortage: 2 Students (1RV22CS084, 1RV22CS086)</p>
                <p>• Class CIE Average: 22.3 / 30 marks</p>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => showToast('Printed official register copy', 'info')}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5"
              >
                <Printer size={14} /> Print Preview
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewReport(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    showToast(`Exported "${previewReport.title}" to Excel`, 'success');
                    setPreviewReport(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-black text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download size={14} /> Download File
                </button>
              </div>
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
            <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Faculty Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your session as <span className="font-semibold text-gray-800">Subject Faculty (Prof. Ananya Sharma)</span>? You will need your faculty credentials to sign back in.
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
                    showToast('Logged out of Academio Subject Faculty session', 'info');
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
