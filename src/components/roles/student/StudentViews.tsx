import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CalendarCheck,
  Award,
  ClipboardList,
  AlertCircle,
  Sliders,
  BarChart3,
  Megaphone,
  Calendar,
  BookOpen,
  Settings,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  HelpCircle,
  Check,
  X,
  FileText,
  Upload,
  Send,
  Calculator,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Info,
  ShieldCheck,
  Share2,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Building,
  CheckCheck,
  LogOut
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { studentRahulAttendance, studentRahulIAMarks } from '../../../data/mockData';
import { CorrectionRequest } from '../../../types/academic';

interface StudentViewsProps {
  onLogout?: () => void;
}

export const StudentViews: React.FC<StudentViewsProps> = ({ onLogout }) => {
  const {
    currentPage,
    setCurrentPage,
    alerts,
    assignments,
    announcements,
    showToast,
    logActivity,
    correctionRequests
  } = useApp();

  // Student Persona: Rahul Sharma (1RV22CS084, 5th Sem CSE-A, RVCE)
  const [studentProfile, setStudentProfile] = useState({
    name: 'Rahul Sharma',
    usn: '1RV22CS084',
    college: 'RV College of Engineering (RVCE)',
    branch: 'Computer Science & Engineering',
    semester: 5,
    section: 'A',
    classroom: 'CR-304 (Alan Turing Block)',
    admissionType: 'KCET Government Quota (Rank #1842)',
    email: 'rahul.cs22@rvce.edu.in',
    phone: '+91 98450 12345',
    guardianName: 'Manoj Sharma',
    guardianPhone: '+91 98450 98765',
    bloodGroup: 'O+ve',
    dob: '14 August 2004',
    address: '#42, 3rd Cross, RR Nagar, Bengaluru - 560098',
    overallAttendance: 82.4,
    attendedClasses: 151,
    totalClasses: 184,
    avgIA: 78.5,
    cgpa: '8.43',
    mentorName: 'Dr. K. Srinivas',
    mentorDesignation: 'Assoc. Professor, Dept. of CSE',
    mentorEmail: 'srinivas.k@rvce.edu.in',
    academicYear: '2025-2026'
  });

  // State for sub-navigation tabs within grouped sections
  const [academicsTab, setAcademicsTab] = useState<'attendance' | 'ia-marks' | 'assignments'>('attendance');
  const [insightsTab, setInsightsTab] = useState<'early-alerts' | 'analytics' | 'what-if'>('early-alerts');
  const [resourcesTab, setResourcesTab] = useState<'calendar' | 'resources'>('calendar');
  const [communicationTab, setCommunicationTab] = useState<'notifications' | 'announcements'>('notifications');
  const [settingsTab, setSettingsTab] = useState<'preferences' | 'security' | 'display'>('preferences');
  const [profileTab, setProfileTab] = useState<'overview' | 'academic' | 'id-cards'>('overview');

  // Deep-linking synchronization: automatically activate corresponding sub-tab if currentPage targets a nested view
  useEffect(() => {
    if (currentPage === 'attendance') setAcademicsTab('attendance');
    else if (currentPage === 'ia-marks') setAcademicsTab('ia-marks');
    else if (currentPage === 'assignments') setAcademicsTab('assignments');
    else if (currentPage === 'academic-alerts') setInsightsTab('early-alerts');
    else if (currentPage === 'performance-analytics') setInsightsTab('analytics');
    else if (currentPage === 'what-if-calculator') setInsightsTab('what-if');
    else if (currentPage === 'academic-calendar') setResourcesTab('calendar');
    else if (currentPage === 'study-resources') setResourcesTab('resources');
    else if (currentPage === 'notifications') setCommunicationTab('notifications');
    else if (currentPage === 'announcements') setCommunicationTab('announcements');
  }, [currentPage]);

  const studentAlerts = alerts.filter(a => a.studentUsn === '1RV22CS084');

  // Attendance & Correction State
  const [subjectAttendance, setSubjectAttendance] = useState(studentRahulAttendance);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeForm, setDisputeForm] = useState({
    subjectCode: '21CS52',
    subjectName: 'Computer Networks',
    type: 'attendance' as 'attendance' | 'ia_marks',
    originalValue: 'Absent on Oct 11, Period 2',
    requestedValue: 'Present (Attended Lecture)',
    details: ''
  });

  // Assignment Submission State
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [selectedAssignmentToSubmit, setSelectedAssignmentToSubmit] = useState<any | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // What-If Calculator State
  const [whatIfSubject, setWhatIfSubject] = useState<'overall' | string>('21CS52'); // Default to critical subject
  const [futureClassesAttend, setFutureClassesAttend] = useState<number>(5);
  const [futureClassesMiss, setFutureClassesMiss] = useState<number>(0);
  const [targetPercentGoal, setTargetPercentGoal] = useState<number>(75);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Profile Edit Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileEditForm, setProfileEditForm] = useState({
    phone: studentProfile.phone,
    guardianPhone: studentProfile.guardianPhone,
    address: studentProfile.address
  });

  // Settings State: Preferences & Password
  const [notificationPreferences, setNotificationPreferences] = useState({
    smsAlerts: true,
    dailyAssignmentReminder: true,
    iaMarksPublished: true,
    mentoringCirculars: false,
    emailSummary: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Mock Notifications for Student
  const [studentNotifications, setStudentNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Low Attendance Alert: Computer Networks',
      description: 'Your attendance in 21CS52 is 71.4%, which is below the VTU mandatory 75% cutoff.',
      timestamp: 'Today, 09:30 AM',
      type: 'alert',
      unread: true
    },
    {
      id: 'notif-2',
      title: 'Assignment Due Tomorrow: Wireshark Packet Analysis',
      description: 'Lab Assignment 3 for Computer Networks is due on Oct 24 at 11:59 PM.',
      timestamp: 'Yesterday, 04:15 PM',
      type: 'assignment',
      unread: true
    },
    {
      id: 'notif-3',
      title: 'CIE-2 Test Schedule Released',
      description: 'VTU CIE-2 timetable has been officially posted on the department board.',
      timestamp: '2 days ago',
      type: 'exam',
      unread: false
    },
    {
      id: 'notif-4',
      title: 'DBMS Lab Manual Updated',
      description: 'Prof. K. Srinivas added new SQL stored procedure exercises in Study Resources.',
      timestamp: '3 days ago',
      type: 'resource',
      unread: false
    }
  ]);

  // Active Subject for What-If
  const activeSubjectData =
    whatIfSubject === 'overall'
      ? {
          name: 'Overall Academic Attendance (All Subjects)',
          code: 'ALL',
          attended: studentProfile.attendedClasses,
          total: studentProfile.totalClasses,
          percentage: studentProfile.overallAttendance
        }
      : (() => {
          const s = subjectAttendance.find(sub => sub.subjectCode === whatIfSubject) || subjectAttendance[1];
          return {
            name: s.subjectName,
            code: s.subjectCode,
            attended: s.attended,
            total: s.total,
            percentage: s.percentage
          };
        })();

  // What-If Dynamic Calculation
  const projectedAttended = activeSubjectData.attended + futureClassesAttend;
  const projectedTotal = activeSubjectData.total + futureClassesAttend + futureClassesMiss;
  const projectedPercentage = projectedTotal > 0 ? Number(((projectedAttended / projectedTotal) * 100).toFixed(1)) : 0;
  const percentageDelta = Number((projectedPercentage - activeSubjectData.percentage).toFixed(1));

  // Inverse Target Calculator
  const calculateClassesNeeded = (target: number) => {
    if (activeSubjectData.percentage >= target) return 0;
    const numerator = target * activeSubjectData.total - 100 * activeSubjectData.attended;
    const denominator = 100 - target;
    if (denominator <= 0) return 0;
    return Math.max(0, Math.ceil(numerator / denominator));
  };
  const classesNeededForTarget = calculateClassesNeeded(targetPercentGoal);

  // Submit dispute handler
  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeForm.details.trim()) {
      showToast('Please describe your correction reason', 'error');
      return;
    }
    const ticketId = Math.floor(1000 + Math.random() * 9000);
    showToast(`Correction ticket #${ticketId} submitted to faculty for ${disputeForm.subjectName}.`, 'success');
    logActivity('Correction Request Filed', studentProfile.name, 'Student', `Disputed ${disputeForm.type} in ${disputeForm.subjectCode}`);
    setIsDisputeModalOpen(false);
    setDisputeForm({
      subjectCode: '21CS52',
      subjectName: 'Computer Networks',
      type: 'attendance',
      originalValue: 'Absent on Oct 11, Period 2',
      requestedValue: 'Present (Attended Lecture)',
      details: ''
    });
  };

  // Submit assignment handler
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName) {
      showToast('Please choose or upload a solution file', 'error');
      return;
    }
    showToast(`Successfully submitted "${selectedAssignmentToSubmit.title}" to ${selectedAssignmentToSubmit.teacherName}!`, 'success');
    logActivity('Assignment Submitted', studentProfile.name, 'Student', `Submitted solution for ${selectedAssignmentToSubmit.title}`);
    setSelectedAssignmentToSubmit(null);
    setUploadedFileName('');
    setSubmissionNotes('');
  };

  // Save profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentProfile(prev => ({
      ...prev,
      phone: profileEditForm.phone,
      guardianPhone: profileEditForm.guardianPhone,
      address: profileEditForm.address
    }));
    setIsEditProfileOpen(false);
    showToast('Contact information updated successfully', 'success');
  };

  // Password Change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  /* =========================================================================================
     1. DASHBOARD VIEW (PRESERVED & ENHANCED)
  ========================================================================================= */
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              5th Semester BE CSE
            </span>
            <span className="text-gray-400 text-xs font-mono">USN: {studentProfile.usn}</span>
            <span className="text-gray-400 text-xs">•</span>
            <span className="text-gray-300 text-xs font-semibold">{studentProfile.college}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Hello, {studentProfile.name}!
          </h1>
          <p className="text-xs text-gray-300 max-w-xl font-medium leading-relaxed">
            Academio has analyzed your 5th-semester progression. You currently have{' '}
            <strong className="text-white">1 explainable attendance warning</strong> in Computer Networks and{' '}
            <strong className="text-white">2 pending assignments</strong> due this week.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-3 relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">VTU Status</span>
            <span className="text-xl font-black text-emerald-400">Eligible</span>
            <span className="text-[10px] text-gray-300 block mt-0.5">Overall: {studentProfile.overallAttendance}%</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[120px]">
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Avg IA Score</span>
            <span className="text-xl font-black text-blue-300">{studentProfile.avgIA}%</span>
            <span className="text-[10px] text-gray-300 block mt-0.5">Top 15% in Section A</span>
          </div>
        </div>
      </div>

      {/* Highlight Banner: Explainable Early Alert */}
      {studentAlerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md shadow-rose-600/20 shrink-0">
              <AlertTriangle size={22} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                  Explainable Early Alert
                </span>
                <span className="text-xs font-mono text-rose-700 font-bold">21CS52 - Computer Networks</span>
              </div>
              <h3 className="text-base font-black text-rose-950">
                {studentAlerts[0].title}
              </h3>
              <p className="text-xs text-rose-900 font-medium">
                <strong>Why triggered:</strong> {studentAlerts[0].reason}
              </p>
              <p className="text-xs text-blue-900 font-bold bg-white/80 p-2 rounded-xl border border-rose-100 mt-1">
                💡 Actionable Recommendation: {studentAlerts[0].recommendedAction}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setWhatIfSubject('21CS52');
              setCurrentPage('academic-insights');
              setInsightsTab('what-if');
              showToast('Opened What-If Calculator for Computer Networks', 'info');
            }}
            className="bg-black hover:bg-gray-800 text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            Simulate in What-If
          </button>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => {
            setCurrentPage('my-academics');
            setAcademicsTab('attendance');
          }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Overall Attendance</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CalendarCheck size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{studentProfile.overallAttendance}%</div>
          <p className="text-[11px] text-gray-500 font-medium mt-1">
            {studentProfile.attendedClasses} / {studentProfile.totalClasses} classes attended
          </p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${studentProfile.overallAttendance}%` }} />
          </div>
        </div>

        <div
          onClick={() => {
            setCurrentPage('my-academics');
            setAcademicsTab('ia-marks');
          }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Internal Assessment</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Award size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{studentProfile.avgIA}% Average</div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ Above Class Average (74.2%)</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${studentProfile.avgIA}%` }} />
          </div>
        </div>

        <div
          onClick={() => {
            setCurrentPage('my-academics');
            setAcademicsTab('assignments');
          }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Assignments</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">2 Pending</div>
          <p className="text-[11px] text-amber-600 font-bold mt-1">Due within next 6 days</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full" style={{ width: '66%' }} />
          </div>
        </div>

        <div
          onClick={() => {
            setCurrentPage('profile');
          }}
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-gray-300 transition-all"
        >
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Academic Mentor</span>
            <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
              <User size={18} />
            </div>
          </div>
          <div className="text-sm font-black text-gray-900 line-clamp-1">{studentProfile.mentorName}</div>
          <p className="text-[11px] text-gray-500 font-medium mt-1">Office Hours: Wed 3-4 PM</p>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-blue-600 font-bold">
            <span>View Faculty Details</span> <ChevronRight size={12} />
          </div>
        </div>
      </div>

      {/* Dual Section: Subject-wise Quick Snapshot & Attendance What-If Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Attendance Breakdown Cards */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Subject-Wise Attendance</h2>
              <p className="text-xs text-gray-500">VTU requirement: Minimum 75% in each subject</p>
            </div>
            <button
              onClick={() => setIsDisputeModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Raise Correction <HelpCircle size={14} />
            </button>
          </div>

          <div className="space-y-3">
            {subjectAttendance.map((sub) => {
              const isCritical = sub.percentage < 75;
              const isWarning = sub.percentage >= 75 && sub.percentage < 80;

              return (
                <div
                  key={sub.subjectCode}
                  className="p-3.5 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-gray-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                        {sub.subjectCode}
                      </span>
                      <span className="font-bold text-xs text-gray-900">{sub.subjectName}</span>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800'
                          : isWarning
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {sub.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>Attended: {sub.attended} / {sub.total} classes</span>
                    <span>Faculty: {sub.teacherName}</span>
                  </div>

                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick What-If Calculator Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Sliders size={18} />
                </div>
                <h2 className="text-base font-bold text-gray-900">Attendance What-If Simulator</h2>
              </div>
              <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md uppercase">
                Sandbox Tool
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Estimate future attendance scenarios without affecting official records.
            </p>

            {/* Subject Selector */}
            <div className="mt-4">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Select Subject to Simulate
              </label>
              <select
                value={whatIfSubject}
                onChange={e => setWhatIfSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
              >
                <option value="overall">Overall Attendance (All Subjects)</option>
                {subjectAttendance.map(s => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.subjectCode} - {s.subjectName} ({s.percentage}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Sliders */}
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700">Next Upcoming Classes You Will Attend</span>
                  <span className="text-emerald-600 font-black">+{futureClassesAttend} Classes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={futureClassesAttend}
                  onChange={e => setFutureClassesAttend(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-700">Upcoming Classes You Might Miss</span>
                  <span className="text-rose-600 font-black">+{futureClassesMiss} Classes</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={futureClassesMiss}
                  onChange={e => setFutureClassesMiss(Number(e.target.value))}
                  className="w-full accent-rose-600 h-2 bg-gray-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Simulation Result Preview */}
            <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black text-white space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Current Attendance:</span>
                <span className="font-mono font-bold">{activeSubjectData.percentage}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-gray-200">Simulated Future Attendance:</span>
                <span
                  className={`font-mono text-xl font-black ${
                    projectedPercentage >= 75 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {projectedPercentage}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-gray-800 text-gray-400">
                <span>Projected Status:</span>
                <span
                  className={`font-bold ${
                    projectedPercentage >= 85
                      ? 'text-emerald-400'
                      : projectedPercentage >= 75
                      ? 'text-blue-300'
                      : 'text-rose-400'
                  }`}
                >
                  {projectedPercentage >= 85
                    ? 'Distinction Zone'
                    : projectedPercentage >= 75
                    ? 'VTU Exam Eligible'
                    : 'Detained / Ineligible'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setCurrentPage('academic-insights');
                setInsightsTab('what-if');
              }}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Detailed Sandbox Simulator</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* =========================================================================================
     2. MY PROFILE VIEW
  ========================================================================================= */
  const renderProfile = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="size-20 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20">
              RS
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Undergraduate Student
                </span>
                <span className="text-xs text-gray-400 font-mono">USN: {studentProfile.usn}</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mt-1">{studentProfile.name}</h2>
              <p className="text-xs text-gray-500 font-medium">
                Bachelor of Engineering in {studentProfile.branch} • Semester {studentProfile.semester}, Section {studentProfile.section}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setProfileEditForm({
                phone: studentProfile.phone,
                guardianPhone: studentProfile.guardianPhone,
                address: studentProfile.address
              });
              setIsEditProfileOpen(true);
            }}
            className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            Edit Contact Details
          </button>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-gray-100 gap-6 text-xs font-bold">
          <button
            onClick={() => setProfileTab('overview')}
            className={`pb-3 border-b-2 transition-all ${
              profileTab === 'overview'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Personal & Academic Information
          </button>
          <button
            onClick={() => setProfileTab('academic')}
            className={`pb-3 border-b-2 transition-all ${
              profileTab === 'academic'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            VTU CGPA & Academic History
          </button>
          <button
            onClick={() => setProfileTab('id-cards')}
            className={`pb-3 border-b-2 transition-all ${
              profileTab === 'id-cards'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Campus ID & Credentials
          </button>
        </div>

        {profileTab === 'overview' && (
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">College Affiliation</span>
                <p className="text-gray-900 font-bold">{studentProfile.college}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">University Registration</span>
                <p className="text-gray-900 font-bold">VTU Belagavi (2022 Scheme)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Classroom Assigned</span>
                <p className="text-gray-900 font-bold">{studentProfile.classroom}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Admission Category</span>
                <p className="text-gray-900 font-bold">{studentProfile.admissionType}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Official Student Email</span>
                <p className="text-gray-900 font-bold">{studentProfile.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Mobile Number</span>
                <p className="text-gray-900 font-bold">{studentProfile.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Guardian / Parent Contact</span>
                <p className="text-gray-900 font-bold">{studentProfile.guardianName} ({studentProfile.guardianPhone})</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                <span className="text-gray-400 font-bold text-[10px] uppercase">Permanent Address</span>
                <p className="text-gray-900 font-bold">{studentProfile.address}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <User size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-700 block">Assigned Faculty Mentor</span>
                  <p className="text-sm font-black text-gray-900">{studentProfile.mentorName}</p>
                  <p className="text-xs text-gray-600">{studentProfile.mentorDesignation} • {studentProfile.mentorEmail}</p>
                </div>
              </div>
              <button
                onClick={() => showToast(`Drafting email to mentor: ${studentProfile.mentorEmail}`, 'info')}
                className="px-3 py-1.5 bg-white border border-blue-200 text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-100"
              >
                Message Mentor
              </button>
            </div>
          </div>
        )}

        {profileTab === 'academic' && (
          <div className="space-y-6 pt-2">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-gray-900">VTU Grade Point Average Progression</h3>
                <span className="text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  Cumulative CGPA: {studentProfile.cgpa}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Sem 1 SGPA</span>
                  <span className="text-gray-900 font-black text-base mt-1 block">8.42</span>
                  <span className="text-[10px] text-emerald-600 font-bold">First Class with Dist.</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Sem 2 SGPA</span>
                  <span className="text-gray-900 font-black text-base mt-1 block">8.65</span>
                  <span className="text-[10px] text-emerald-600 font-bold">First Class with Dist.</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block text-[10px] font-bold uppercase">Sem 3 SGPA</span>
                  <span className="text-gray-900 font-black text-base mt-1 block">8.15</span>
                  <span className="text-[10px] text-emerald-600 font-bold">First Class with Dist.</span>
                </div>
                <div className="p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
                  <span className="text-blue-500 block text-[10px] font-bold uppercase">Sem 4 SGPA</span>
                  <span className="text-blue-950 font-black text-base mt-1 block">8.50</span>
                  <span className="text-[10px] text-blue-700 font-bold">First Class with Dist.</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-2">
              <h4 className="font-bold text-gray-900">University Examination Standing</h4>
              <p className="text-gray-600 leading-relaxed">
                VTU Belagavi criteria mandates zero active backlogs to remain eligible for 7th-semester campus placements.
                Current record shows <strong className="text-emerald-600">0 backlogs</strong> with 100% credit completion (88/88 earned credits).
              </p>
            </div>
          </div>
        )}

        {profileTab === 'id-cards' && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <IdCard size={18} className="text-blue-600" />
                  <span>Smart RFID Campus ID</span>
                </div>
                <p className="text-gray-500 font-mono text-[11px]">ID #RVCE2022CS084</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active • Biometrics Linked
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <BookOpen size={18} className="text-purple-600" />
                  <span>Central Library Card</span>
                </div>
                <p className="text-gray-500 font-mono text-[11px]">LIB-22CS-084 (3 Books Limit)</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Zero Dues • 0 Overdue
                </span>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <Building size={18} className="text-amber-600" />
                  <span>BMTC Bus Concession Pass</span>
                </div>
                <p className="text-gray-500 font-mono text-[11px]">Route #14 (Majestic - RVCE)</p>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Valid till July 2026
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Update Student Contact Details</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Student Phone Number</label>
                <input
                  type="text"
                  required
                  value={profileEditForm.phone}
                  onChange={e => setProfileEditForm({ ...profileEditForm, phone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Parent / Guardian Phone</label>
                <input
                  type="text"
                  required
                  value={profileEditForm.guardianPhone}
                  onChange={e => setProfileEditForm({ ...profileEditForm, guardianPhone: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Permanent Residential Address</label>
                <textarea
                  rows={3}
                  required
                  value={profileEditForm.address}
                  onChange={e => setProfileEditForm({ ...profileEditForm, address: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 font-black text-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     3. MY ACADEMICS (Grouped: Attendance, IA Marks, Assignments)
  ========================================================================================= */
  const renderMyAcademics = () => (
    <div className="space-y-6">
      {/* Header and Sub-Tab Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">My Academics</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage attendance records, internal assessments, coursework assignments, and correction disputes.
          </p>
        </div>

        {/* Action Button depending on active tab */}
        {academicsTab === 'attendance' && (
          <button
            onClick={() => {
              setDisputeForm({
                subjectCode: '21CS52',
                subjectName: 'Computer Networks',
                type: 'attendance',
                originalValue: 'Absent on Oct 11, Period 2',
                requestedValue: 'Present (Attended Lecture)',
                details: ''
              });
              setIsDisputeModalOpen(true);
            }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <HelpCircle size={14} /> Raise Attendance Dispute
          </button>
        )}
        {academicsTab === 'ia-marks' && (
          <button
            onClick={() => {
              setDisputeForm({
                subjectCode: '21CS52',
                subjectName: 'Computer Networks',
                type: 'ia_marks',
                originalValue: '19/30 (IA-2 Score)',
                requestedValue: '23/30 (Re-evaluation request)',
                details: ''
              });
              setIsDisputeModalOpen(true);
            }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <HelpCircle size={14} /> Request Marks Re-evaluation
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm gap-6 text-xs font-bold">
        <button
          onClick={() => setAcademicsTab('attendance')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            academicsTab === 'attendance'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <CalendarCheck size={16} />
          <span>Attendance</span>
        </button>
        <button
          onClick={() => setAcademicsTab('ia-marks')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            academicsTab === 'ia-marks'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Award size={16} />
          <span>IA Marks & Results</span>
        </button>
        <button
          onClick={() => setAcademicsTab('assignments')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            academicsTab === 'assignments'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ClipboardList size={16} />
          <span>Assignments & Deadlines</span>
          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
            2
          </span>
        </button>
      </div>

      {/* TAB 1: ATTENDANCE */}
      {academicsTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Overall Attendance</span>
              <div className="text-2xl font-black text-gray-900 mt-1">{studentProfile.overallAttendance}%</div>
              <p className="text-[11px] text-emerald-600 font-bold">Above VTU 75% Cutoff</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Total Sessions Held</span>
              <div className="text-2xl font-black text-gray-900 mt-1">{studentProfile.totalClasses} Classes</div>
              <p className="text-[11px] text-gray-500 font-medium">Attended: {studentProfile.attendedClasses} | Missed: {studentProfile.totalClasses - studentProfile.attendedClasses}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Subjects Requiring Attention</span>
              <div className="text-2xl font-black text-rose-600 mt-1">1 Subject</div>
              <p className="text-[11px] text-rose-600 font-bold">21CS52 Computer Networks (71.4%)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Official Subject-Wise Ledger</span>
              <span className="text-xs text-gray-500 font-medium">Odd Semester 2025-26</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Subject Code</th>
                    <th className="py-3 px-4">Subject Title</th>
                    <th className="py-3 px-4">Faculty In-Charge</th>
                    <th className="py-3 px-4">Classes Held</th>
                    <th className="py-3 px-4">Attended</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4 text-right">VTU Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {subjectAttendance.map((sub) => {
                    const isCritical = sub.percentage < 75;
                    const isWarning = sub.percentage >= 75 && sub.percentage < 80;

                    return (
                      <tr key={sub.subjectCode} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{sub.subjectCode}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{sub.subjectName}</td>
                        <td className="py-3.5 px-4 text-gray-600">{sub.teacherName}</td>
                        <td className="py-3.5 px-4 text-gray-500">{sub.total}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-900">{sub.attended}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-black ${
                              isCritical ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {sub.percentage}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isCritical
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : isWarning
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isCritical ? 'Critical Shortage' : isWarning ? 'Borderline Safe' : 'Eligible'}
                          </span>
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

      {/* TAB 2: IA MARKS & RESULTS */}
      {academicsTab === 'ia-marks' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-blue-950 font-bold">
              <Award size={18} className="text-blue-600" />
              <span>Continuous Internal Evaluation (CIE) Criteria: Minimum 40% aggregate required for VTU examination clearance.</span>
            </div>
            <span className="font-black text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
              Your Avg: {studentProfile.avgIA}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentRahulIAMarks.map((sub) => (
              <div key={sub.subjectCode} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                    {sub.subjectCode}
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Grade {sub.grade}
                  </span>
                </div>
                <h3 className="font-bold text-base text-gray-900">{sub.subjectName}</h3>

                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">IA-1</span>
                    <span className="text-gray-900 font-black">{sub.ia1} / {sub.ia1Max}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">IA-2</span>
                    <span className="text-gray-900 font-black">{sub.ia2} / {sub.ia2Max}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] font-bold uppercase">Assignments</span>
                    <span className="text-gray-900 font-black">{sub.assignmentScore} / 20</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Your Score vs Class Average</span>
                    <span className="text-blue-600 font-bold">{sub.percentage}% (Avg: {sub.classAverage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${sub.percentage}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSIGNMENTS & DEADLINES */}
      {academicsTab === 'assignments' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Filter By Status:</span>
              {(['all', 'pending', 'submitted', 'graded'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setAssignmentFilter(f)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all ${
                    assignmentFilter === f
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              Showing {assignments.length} Total Coursework Tasks
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assignments
              .filter(asg => {
                if (assignmentFilter === 'all') return true;
                if (assignmentFilter === 'pending') return asg.studentSubmissionStatus !== 'submitted' && asg.studentSubmissionStatus !== 'graded';
                return asg.studentSubmissionStatus === assignmentFilter;
              })
              .map((asg) => {
                const isSubmitted = asg.studentSubmissionStatus === 'submitted' || asg.studentSubmissionStatus === 'graded';
                return (
                  <div key={asg.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-black bg-gray-900 text-white px-2 py-0.5 rounded">
                          {asg.subjectCode}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            asg.studentSubmissionStatus === 'graded'
                              ? 'bg-purple-100 text-purple-800'
                              : isSubmitted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asg.studentSubmissionStatus || 'Pending'}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-gray-900">{asg.title}</h3>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{asg.description}</p>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-gray-100 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-400">Due Date:</span>
                        <span className="text-gray-800 font-bold">{asg.dueDate}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-400">Faculty:</span>
                        <span className="text-gray-800">{asg.teacherName}</span>
                      </div>

                      {asg.studentScore !== undefined && (
                        <div className="flex justify-between font-semibold p-2 bg-emerald-50 rounded-lg text-emerald-800">
                          <span>Score Awarded:</span>
                          <span className="font-black">{asg.studentScore} / {asg.maxMarks}</span>
                        </div>
                      )}

                      {!isSubmitted ? (
                        <button
                          onClick={() => setSelectedAssignmentToSubmit(asg)}
                          className="w-full py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          Upload Solution
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2 bg-gray-100 text-gray-500 font-bold text-xs rounded-xl cursor-default"
                        >
                          Submitted ✓
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     4. ACADEMIC INSIGHTS (Grouped: Early Alerts, Performance Analytics, What-If Calculator)
  ========================================================================================= */
  const renderAcademicInsights = () => (
    <div className="space-y-6">
      {/* Header and Sub-Tab Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Academic Insights</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent early academic alerts, performance analytics, and what-if forecasting simulator.
          </p>
        </div>
        <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 text-xs font-semibold flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600 shrink-0" />
          <span>VTU Mandatory Cutoff: <strong>75.0%</strong></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm gap-6 text-xs font-bold">
        <button
          onClick={() => setInsightsTab('early-alerts')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            insightsTab === 'early-alerts'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <AlertCircle size={16} />
          <span>Early Alerts</span>
          {studentAlerts.length > 0 && (
            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {studentAlerts.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setInsightsTab('analytics')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            insightsTab === 'analytics'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BarChart3 size={16} />
          <span>Performance Analytics</span>
        </button>
        <button
          onClick={() => setInsightsTab('what-if')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            insightsTab === 'what-if'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sliders size={16} />
          <span>What-If Calculator</span>
        </button>
      </div>

      {/* TAB 1: EARLY ALERTS */}
      {insightsTab === 'early-alerts' && (
        <div className="space-y-4">
          {studentAlerts.map((alert) => (
            <div key={alert.id} className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900">{alert.title}</h3>
                    <p className="text-xs font-mono text-gray-500">{alert.subjectCode} - {alert.subjectName}</p>
                  </div>
                </div>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                  {alert.severity} Severity
                </span>
              </div>

              {/* Explainability Breakdown Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                    1. Why This Alert Fired (Rule Trigger)
                  </span>
                  <p className="text-gray-800 font-semibold leading-relaxed">{alert.reason}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-gray-600 border-t border-gray-200/60">
                    <span>Current Recorded Value: <strong className="text-rose-600">{alert.currentValue}%</strong></span>
                    <span>Required Cutoff: <strong>{alert.thresholdValue}%</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                    2. Recommended Improvement Path
                  </span>
                  <p className="text-blue-950 font-bold leading-relaxed">{alert.recommendedAction}</p>
                  <p className="text-[11px] text-blue-700 font-medium pt-1">
                    Rule-Based Guidance: Maintaining consecutive attendance will restore your examination eligibility before the VTU portal closes.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Triggered: {alert.date}</span>
                <button
                  onClick={() => {
                    setWhatIfSubject(alert.subjectCode || '21CS52');
                    setInsightsTab('what-if');
                    showToast('Opening What-If Calculator to simulate recovery', 'info');
                  }}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5"
                >
                  <Sliders size={14} /> Open in What-If Calculator
                </button>
              </div>
            </div>
          ))}

          {studentAlerts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6">
              <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
              <h3 className="text-base font-bold text-gray-900">Zero Active Academic Warnings</h3>
              <p className="text-xs text-gray-500 mt-1">All subject attendance and continuous evaluation scores satisfy VTU benchmarks.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERFORMANCE ANALYTICS */}
      {insightsTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Semester SGPA Target</span>
              <div className="text-4xl font-black text-blue-600">8.75</div>
              <p className="text-xs text-gray-500">Projected based on IA-1 & IA-2 scores</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attendance Compliance</span>
              <div className="text-4xl font-black text-emerald-600">82.4%</div>
              <p className="text-xs text-gray-500">5 out of 6 subjects eligible</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section Ranking</span>
              <div className="text-4xl font-black text-gray-900">#9 / 64</div>
              <p className="text-xs text-gray-500">In 5th Sem CSE - Section A</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Continuous Assessment Progression vs Class Benchmark</h3>
            <div className="space-y-4">
              {studentRahulIAMarks.map((sub) => (
                <div key={sub.subjectCode} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">{sub.subjectName} ({sub.subjectCode})</span>
                    <span className="text-gray-900 font-bold">{sub.percentage}% (Class Avg: {sub.classAverage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${sub.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHAT-IF CALCULATOR */}
      {insightsTab === 'what-if' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                1. Select Subject to Simulate
              </label>
              <select
                value={whatIfSubject}
                onChange={e => setWhatIfSubject(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-black text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="overall">All Subjects Combined (Overall Attendance: {studentProfile.overallAttendance}%)</option>
                {subjectAttendance.map(s => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.subjectCode} - {s.subjectName} (Current: {s.percentage}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Official Current Record Badge */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Official Current Record
              </span>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{activeSubjectData.name}</h4>
                  <p className="text-xs text-gray-500 font-mono">
                    Attended {activeSubjectData.attended} out of {activeSubjectData.total} conducted sessions
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xl font-black ${
                      activeSubjectData.percentage < 75 ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {activeSubjectData.percentage}%
                  </span>
                  <p className="text-[10px] text-gray-400">Current Rate</p>
                </div>
              </div>
            </div>

            {/* Sliders for Future Projection */}
            <div className="space-y-5 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-gray-800">Future Classes You Plan to Attend</span>
                  <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-2.5 py-1 rounded-lg">
                    +{futureClassesAttend} Sessions
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={futureClassesAttend}
                  onChange={e => setFutureClassesAttend(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                  <span>0 Classes</span>
                  <span>10 Classes</span>
                  <span>25 Classes</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-gray-800">Future Classes You Expect to Miss (Absences)</span>
                  <span className="text-rose-600 font-black text-sm bg-rose-50 px-2.5 py-1 rounded-lg">
                    +{futureClassesMiss} Sessions
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={futureClassesMiss}
                  onChange={e => setFutureClassesMiss(Number(e.target.value))}
                  className="w-full accent-rose-600 h-2.5 bg-gray-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                  <span>0 Absences</span>
                  <span>5 Absences</span>
                  <span>15 Absences</span>
                </div>
              </div>
            </div>

            {/* Target Solver Tab */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                  Target Recovery Solver
                </span>
                <span className="text-[11px] font-bold text-amber-700">Goal: {targetPercentGoal}%</span>
              </div>
              <div className="flex gap-2">
                {[75, 80, 85].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTargetPercentGoal(t)}
                    className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      targetPercentGoal === t
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100'
                    }`}
                  >
                    {t}% {t === 75 ? '(VTU Min)' : t === 80 ? '(Safe)' : '(Distinction)'}
                  </button>
                ))}
              </div>
              <p className="text-xs text-amber-950 font-medium">
                {classesNeededForTarget === 0 ? (
                  <span>
                    🎉 Your current attendance ({activeSubjectData.percentage}%) already satisfies the {targetPercentGoal}% target!
                  </span>
                ) : (
                  <span>
                    To reach <strong>{targetPercentGoal}%</strong>, you need to attend at least{' '}
                    <strong className="text-amber-700 underline text-sm">{classesNeededForTarget} consecutive lectures</strong>{' '}
                    without any absence.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Right Column: Projected Result Display & Visual Dial */}
          <div className="lg:col-span-5 bg-gradient-to-b from-gray-900 to-black text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                Simulation Projection Outcome
              </span>

              {/* Big Percentage Card */}
              <div className="text-center py-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Projected Attendance</div>
                <div
                  className={`text-6xl font-black tracking-tight mt-2 ${
                    projectedPercentage >= 75 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {projectedPercentage}%
                </div>
                <div className="mt-2 text-xs font-bold flex items-center justify-center gap-1.5">
                  <span className="text-gray-400">Baseline: {activeSubjectData.percentage}%</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      percentageDelta >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {percentageDelta >= 0 ? `+${percentageDelta}%` : `${percentageDelta}%`}
                  </span>
                </div>
              </div>

              {/* Threshold Checklist */}
              <div className="space-y-2 text-xs font-medium">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-300">VTU Minimum (75% Exam Cutoff)</span>
                  <span className={projectedPercentage >= 75 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {projectedPercentage >= 75 ? '✓ Satisfied' : '✗ Shortage Detained'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-300">Department Safe Zone (80%)</span>
                  <span className={projectedPercentage >= 80 ? 'text-emerald-400 font-bold' : 'text-gray-400 font-bold'}>
                    {projectedPercentage >= 80 ? '✓ Satisfied' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-gray-300">Academic Distinction (85%)</span>
                  <span className={projectedPercentage >= 85 ? 'text-emerald-400 font-bold' : 'text-gray-400 font-bold'}>
                    {projectedPercentage >= 85 ? '✓ Satisfied' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Projected calculation: ({activeSubjectData.attended} + {futureClassesAttend}) / ({activeSubjectData.total} + {futureClassesAttend} + {futureClassesMiss}) = {projectedAttended}/{projectedTotal} classes.
              </p>
              <p className="text-[10px] text-gray-500 italic">
                *Official college records are preserved and cannot be altered by simulator projections.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     5. ACADEMIC RESOURCES (Grouped: Academic Calendar, Study Resources)
  ========================================================================================= */
  const renderAcademicResources = () => (
    <div className="space-y-6">
      {/* Header and Sub-Tab Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Academic Resources</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            VTU university academic calendar, exam dates, syllabus notes, and lab manuals.
          </p>
        </div>
        <button
          onClick={() => showToast('VTU 2025-26 Scheme Syllabus PDF downloaded', 'success')}
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Download size={14} /> Download VTU Syllabus
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm gap-6 text-xs font-bold">
        <button
          onClick={() => setResourcesTab('calendar')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            resourcesTab === 'calendar'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Calendar size={16} />
          <span>Academic Calendar</span>
        </button>
        <button
          onClick={() => setResourcesTab('resources')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            resourcesTab === 'resources'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BookOpen size={16} />
          <span>Study Resources</span>
        </button>
      </div>

      {/* TAB 1: ACADEMIC CALENDAR */}
      {resourcesTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Upcoming VTU Key Milestones (5th Sem)</span>
            <span className="text-xs text-blue-600 font-semibold">Belagavi Notification #VTU/ACA/2025/381</span>
          </div>

          {[
            { date: 'Oct 27 – Nov 02, 2026', title: 'Continuous Internal Evaluation (CIE-2)', type: 'Exam', status: 'Upcoming' },
            { date: 'Nov 14 – Nov 20, 2026', title: 'Laboratory Internal Practical Examinations', type: 'Lab Test', status: 'Scheduled' },
            { date: 'Nov 25, 2026', title: 'Last Working Day & Official Attendance Freezing', type: 'Deadline', status: 'Crucial' },
            { date: 'Dec 02 – Dec 12, 2026', title: 'VTU Semester End Practical Examinations', type: 'University', status: 'Scheduled' },
            { date: 'Dec 15 – Jan 05, 2027', title: 'VTU Semester End Theory Examinations (SEE)', type: 'Final Exam', status: 'Scheduled' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 block">{item.date}</span>
                <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
              </div>
              <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-800 self-start sm:self-auto">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: STUDY RESOURCES */}
      {resourcesTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Computer Networks (21CS52) Lecture Notes', author: 'Prof. Ananya Sharma', format: 'PDF (12.4 MB)' },
            { title: 'DBMS Relational Algebra & SQL Exercises', author: 'Dr. K. Srinivas', format: 'PDF (8.1 MB)' },
            { title: 'Theory of Computation Pumping Lemma Notes', author: 'Prof. Prakash Rao', format: 'PDF (5.3 MB)' },
            { title: 'CN Laboratory Wireshark Manual', author: 'CSE Lab Manuals', format: 'PDF (15.0 MB)' },
            { title: 'VTU Model Question Papers (2021 Scheme)', author: 'VTU Directorate', format: 'ZIP (22.0 MB)' },
            { title: 'Management & Entrepreneurship Summary', author: 'Prof. Mohan K.', format: 'PDF (6.2 MB)' }
          ].map((res, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 size-fit">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-bold text-sm text-gray-900">{res.title}</h3>
                <p className="text-xs text-gray-400 font-medium">Provided by: {res.author}</p>
              </div>
              <button
                onClick={() => showToast(`Downloading "${res.title}"`, 'info')}
                className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Download size={14} /> Download {res.format}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     6. COMMUNICATION (Grouped: Notifications, Announcements)
  ========================================================================================= */
  const renderCommunication = () => (
    <div className="space-y-6">
      {/* Header and Sub-Tab Navigation */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Communication</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Class notifications, academic alerts, and official department circulars.
          </p>
        </div>
        {communicationTab === 'notifications' && (
          <button
            onClick={() => {
              setStudentNotifications(prev => prev.map(n => ({ ...n, unread: false })));
              showToast('All notifications marked as read', 'success');
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
          >
            <CheckCheck size={14} /> Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm gap-6 text-xs font-bold">
        <button
          onClick={() => setCommunicationTab('notifications')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            communicationTab === 'notifications'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Bell size={16} />
          <span>Notifications</span>
          {studentNotifications.filter(n => n.unread).length > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {studentNotifications.filter(n => n.unread).length}
            </span>
          )}
        </button>
        <button
          onClick={() => setCommunicationTab('announcements')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            communicationTab === 'announcements'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Megaphone size={16} />
          <span>Announcements</span>
        </button>
      </div>

      {/* TAB 1: NOTIFICATIONS */}
      {communicationTab === 'notifications' && (
        <div className="space-y-3">
          {studentNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setStudentNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.unread
                  ? 'bg-blue-50/50 border-blue-200'
                  : 'bg-white border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === 'alert'
                      ? 'bg-rose-100 text-rose-700'
                      : n.type === 'assignment'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Bell size={16} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">{n.title}</h4>
                    {n.unread && (
                      <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">{n.description}</p>
                  <span className="text-[10px] text-gray-400 font-mono block pt-1">{n.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {communicationTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {ann.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">{ann.date}</span>
              </div>
              <h3 className="font-bold text-base text-gray-900">{ann.title}</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">{ann.content}</p>
              <div className="pt-2 text-[11px] text-gray-400 font-semibold border-t border-gray-50 flex justify-between">
                <span>By: {ann.authorName} ({ann.authorRole})</span>
                <span className="capitalize text-gray-500">Audience: {ann.targetRole}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* =========================================================================================
     7. SETTINGS VIEW
  ========================================================================================= */
  const renderSettings = () => (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-black text-gray-900">Student Account & Preferences</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure notification thresholds, security credentials, and academic display preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6 rounded-2xl shadow-sm gap-6 text-xs font-bold">
        <button
          onClick={() => setSettingsTab('preferences')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            settingsTab === 'preferences'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Bell size={16} />
          <span>Notification Preferences</span>
        </button>
        <button
          onClick={() => setSettingsTab('security')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            settingsTab === 'security'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Lock size={16} />
          <span>Password & Security</span>
        </button>
        <button
          onClick={() => setSettingsTab('display')}
          className={`py-4 border-b-2 transition-all flex items-center gap-2 ${
            settingsTab === 'display'
              ? 'border-black text-black'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Settings size={16} />
          <span>Display Settings</span>
        </button>
      </div>

      {settingsTab === 'preferences' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs font-medium">
          {[
            {
              key: 'smsAlerts',
              label: 'Instant SMS Alert when Attendance drops < 80%',
              desc: 'Receive urgent mobile notification on registered parent & student phone.',
              checked: notificationPreferences.smsAlerts
            },
            {
              key: 'dailyAssignmentReminder',
              label: 'Daily Assignment Due Reminder',
              desc: 'Summary of tasks due in the next 48 hours sent at 08:00 AM.',
              checked: notificationPreferences.dailyAssignmentReminder
            },
            {
              key: 'iaMarksPublished',
              label: 'IA Marks Publication Notification',
              desc: 'Instant alert as soon as subject teachers publish test results.',
              checked: notificationPreferences.iaMarksPublished
            },
            {
              key: 'mentoringCirculars',
              label: 'Department Mentoring Circulars',
              desc: 'Receive notices regarding parent-teacher meetings and tutoring sessions.',
              checked: notificationPreferences.mentoringCirculars
            },
            {
              key: 'emailSummary',
              label: 'Weekly Academic Digest via Email',
              desc: 'Consolidated report delivered to rahul.cs22@rvce.edu.in every Saturday evening.',
              checked: notificationPreferences.emailSummary
            }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-3.5 bg-gray-50 rounded-xl gap-4">
              <div>
                <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                <p className="text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={e => {
                  setNotificationPreferences(prev => ({ ...prev, [item.key]: e.target.checked }));
                  showToast('Preference updated', 'success');
                }}
                className="size-4 accent-blue-600 rounded mt-1 cursor-pointer"
              />
            </div>
          ))}
        </div>
      )}

      {settingsTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
          <h3 className="font-bold text-sm text-gray-900">Change Account Password</h3>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md text-xs font-medium">
            <div>
              <label className="block text-gray-700 font-bold mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 pr-10 text-xs font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-xl font-bold text-xs shadow-xs"
            >
              Update Password
            </button>
          </form>
        </div>
      )}

      {settingsTab === 'display' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <div className="p-4 bg-gray-50 rounded-xl space-y-2">
            <span className="font-bold text-gray-900 block">Default What-If Target Attendance Benchmark</span>
            <div className="flex gap-2">
              {[75, 80, 85].map(b => (
                <button
                  key={b}
                  onClick={() => {
                    setTargetPercentGoal(b);
                    showToast(`Default target set to ${b}%`, 'success');
                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition-all ${
                    targetPercentGoal === b
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {b}% {b === 75 ? '(VTU Mandatory)' : b === 80 ? '(Safe Zone)' : '(Distinction)'}
                </button>
              ))}
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
            Sign out of the Academio Student Portal on this device. You will need your student USN and credentials to sign back in to view attendance, IA marks, and academic alerts.
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

  // Top-Level Router based on currentPage
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'profile':
        return renderProfile();
      case 'my-academics':
      case 'attendance':
      case 'ia-marks':
      case 'assignments':
        return renderMyAcademics();
      case 'academic-insights':
      case 'academic-alerts':
      case 'performance-analytics':
      case 'what-if-calculator':
        return renderAcademicInsights();
      case 'academic-resources':
      case 'academic-calendar':
      case 'study-resources':
        return renderAcademicResources();
      case 'communication':
      case 'notifications':
      case 'announcements':
        return renderCommunication();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div>
      {renderCurrentView()}

      {/* Global Correction Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Raise Academic Correction / Dispute</h3>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-600 font-bold mb-1">Dispute Type</label>
                <select
                  value={disputeForm.type}
                  onChange={e => setDisputeForm({ ...disputeForm, type: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="attendance">Attendance Ledger Discrepancy</option>
                  <option value="ia_marks">Internal Assessment Marks Re-check</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Subject</label>
                <select
                  value={disputeForm.subjectCode}
                  onChange={e => {
                    const code = e.target.value;
                    const sub = subjectAttendance.find(s => s.subjectCode === code);
                    setDisputeForm({
                      ...disputeForm,
                      subjectCode: code,
                      subjectName: sub?.subjectName || ''
                    });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {subjectAttendance.map(s => (
                    <option key={s.subjectCode} value={s.subjectCode}>
                      {s.subjectCode} - {s.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Current Portal Record</label>
                  <input
                    type="text"
                    value={disputeForm.originalValue}
                    onChange={e => setDisputeForm({ ...disputeForm, originalValue: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 font-bold mb-1">Claimed Correct Value</label>
                  <input
                    type="text"
                    value={disputeForm.requestedValue}
                    onChange={e => setDisputeForm({ ...disputeForm, requestedValue: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Justification & Details</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide lecture date, period, medical certificate details, or test question paper question number..."
                  value={disputeForm.details}
                  onChange={e => setDisputeForm({ ...disputeForm, details: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 font-black text-xs"
                >
                  Submit Dispute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Assignment Submission Modal */}
      {selectedAssignmentToSubmit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-base text-gray-900">Upload Assignment Solution</h3>
              <button
                onClick={() => setSelectedAssignmentToSubmit(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="space-y-4 py-4 text-xs font-medium">
              <div>
                <label className="block text-gray-400 font-bold uppercase text-[10px]">Assignment</label>
                <p className="font-bold text-sm text-gray-900">{selectedAssignmentToSubmit.title}</p>
                <p className="text-gray-500">{selectedAssignmentToSubmit.subjectName}</p>
              </div>

              <div className="p-4 border-2 border-dashed border-gray-200 hover:border-black rounded-2xl text-center cursor-pointer transition-colors">
                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                <p className="font-bold text-gray-700">Click to choose or drag submission PDF / ZIP</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Maximum file size: 25MB</p>
                <input
                  type="file"
                  className="hidden"
                  id="solution-upload"
                  onChange={e => {
                    if (e.target.files?.[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <label
                  htmlFor="solution-upload"
                  className="mt-3 inline-block px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-bold text-xs cursor-pointer"
                >
                  Select File
                </label>
                {uploadedFileName && (
                  <p className="mt-2 text-emerald-600 font-bold">Selected: {uploadedFileName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">Student Comments (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add GitHub repo link, test setup notes, or execution commands..."
                  value={submissionNotes}
                  onChange={e => setSubmissionNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignmentToSubmit(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-black text-white hover:bg-gray-800 font-black text-xs"
                >
                  Confirm Submission
                </button>
              </div>
            </form>
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
            <h3 className="text-base font-bold text-gray-900 mb-1">Confirm Student Logout</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Are you sure you want to log out of your student portal session as <span className="font-semibold text-gray-800">Rahul Sharma (1RV22CS084)</span>? You will be safely signed out and returned to the login screen.
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
                    showToast('Logged out of Academio Student Portal', 'info');
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
