import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  College,
  ClassTeacher,
  SubjectTeacher,
  Student,
  ClassSection,
  Department,
  Subject,
  AcademicAlert,
  Assignment,
  CorrectionRequest,
  Announcement,
  ActivityLog,
  AcademicConfig,
  UserAccount,
  AuditLogItem,
  StudentJoinRequest
} from '../types/academic';
import {
  initialColleges,
  initialDepartments,
  initialClasses,
  initialSubjects,
  initialClassTeachers,
  initialSubjectTeachers,
  initialStudents,
  initialAlerts,
  initialAssignments,
  initialCorrectionRequests,
  initialAnnouncements,
  initialActivityLogs,
  initialAcademicConfig,
  initialUserAccounts,
  initialAuditLogs,
  initialStudentJoinRequests
} from '../data/mockData';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedCollegeId: string;
  setSelectedCollegeId: (id: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  colleges: College[];
  departments: Department[];
  classes: ClassSection[];
  subjects: Subject[];
  classTeachers: ClassTeacher[];
  subjectTeachers: SubjectTeacher[];
  students: Student[];
  userAccounts: UserAccount[];
  auditLogs: AuditLogItem[];
  alerts: AcademicAlert[];
  assignments: Assignment[];
  correctionRequests: CorrectionRequest[];
  announcements: Announcement[];
  activityLogs: ActivityLog[];
  academicConfig: AcademicConfig;
  studentJoinRequests: StudentJoinRequest[];
  toasts: ToastItem[];

  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Actions
  addCollege: (c: Omit<College, 'id'>) => void;
  updateCollege: (c: College) => void;
  toggleCollegeStatus: (id: string) => void;
  addStudent: (s: Omit<Student, 'id'>) => void;
  updateStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  addClassTeacher: (t: Omit<ClassTeacher, 'id'>) => void;
  addSubjectTeacher: (t: Omit<SubjectTeacher, 'id'>) => void;
  assignTeacherToSubject: (subjectCode: string, classId: string, teacherName: string) => void;
  updateAcademicConfig: (cfg: AcademicConfig) => void;
  createAssignment: (a: Omit<Assignment, 'id'>) => void;
  resolveAlert: (alertId: string) => void;
  resolveCorrectionRequest: (requestId: string, status: 'approved' | 'rejected', note?: string) => void;
  createAnnouncement: (ann: Omit<Announcement, 'id'>) => void;
  logActivity: (action: string, performedBy: string, role: string, details: string) => void;
  approveStudentJoinRequest: (id: string) => void;
  rejectStudentJoinRequest: (id: string, reason?: string) => void;

  // Admin Central Account & Role Management Actions
  addUserAccount: (user: Omit<UserAccount, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUserAccount: (user: UserAccount) => void;
  toggleUserStatus: (id: string) => void;
  changeUserRole: (id: string, newRole: UserRole) => void;
  createClassTeacherAccount: (data: {
    name: string;
    email: string;
    identifier: string;
    phone?: string;
    department: string;
    status: 'active' | 'inactive';
    assignedClassId?: string;
  }) => boolean;
  promoteTeacherToClassTeacher: (teacherId: string, assignedClassId?: string) => void;
  assignClassTeacherToClass: (classTeacherId: string, classId: string) => void;
  removeClassTeacherAssignment: (classTeacherId: string) => void;
  toggleClassTeacherStatus: (classTeacherId: string) => void;
  addAuditLog: (action: string, targetResource: string, details: string, status?: 'success' | 'warning' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('admin');
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>('col-1');
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [colleges, setColleges] = useState<College[]>(initialColleges);
  const [departments] = useState<Department[]>(initialDepartments);
  const [classes, setClasses] = useState<ClassSection[]>(initialClasses);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [classTeachers, setClassTeachers] = useState<ClassTeacher[]>(initialClassTeachers);
  const [subjectTeachers, setSubjectTeachers] = useState<SubjectTeacher[]>(initialSubjectTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>(initialUserAccounts);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [alerts, setAlerts] = useState<AcademicAlert[]>(initialAlerts);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [correctionRequests, setCorrectionRequests] = useState<CorrectionRequest[]>(initialCorrectionRequests);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [academicConfig, setAcademicConfig] = useState<AcademicConfig>(initialAcademicConfig);
  const [studentJoinRequests, setStudentJoinRequests] = useState<StudentJoinRequest[]>(initialStudentJoinRequests);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setCurrentPage('dashboard');
    showToast(`Switched view to ${role === 'admin' ? 'Admin (Platform Owner)' : role === 'class_teacher' ? 'Class Teacher (5th Sem CSE-A)' : role === 'teacher' ? 'Subject Teacher (Computer Networks & DBMS)' : 'Student (Rahul Sharma - 1RV22CS084)'}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (action: string, performedBy: string, role: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      collegeId: selectedCollegeId,
      action,
      performedBy,
      role,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      details
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  const addCollege = (c: Omit<College, 'id'>) => {
    const newCollege: College = { ...c, id: `col-${Date.now()}` };
    setColleges((prev) => [...prev, newCollege]);
    showToast(`College "${c.name}" created successfully`, 'success');
    logActivity('College Added', 'Admin', 'Admin', `Added new college ${c.name} (${c.code})`);
  };

  const updateCollege = (c: College) => {
    setColleges((prev) => prev.map((item) => (item.id === c.id ? c : item)));
    showToast(`College "${c.name}" updated`, 'success');
    logActivity('College Updated', 'Admin', 'Admin', `Updated details for ${c.name}`);
  };

  const toggleCollegeStatus = (id: string) => {
    setColleges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'suspended' : 'active';
          showToast(`College status changed to ${nextStatus}`, 'info');
          logActivity('College Status Changed', 'Admin', 'Admin', `${c.name} status set to ${nextStatus}`);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const addStudent = (s: Omit<Student, 'id'>) => {
    const newStu: Student = { ...s, id: `stu-${Date.now()}` };
    setStudents((prev) => [newStu, ...prev]);
    showToast(`Student ${s.name} (${s.usn}) enrolled`, 'success');
    logActivity('Student Enrolled', 'Class Teacher', 'Class Teacher', `Enrolled student ${s.name} in ${s.className}`);
  };

  const updateStudent = (s: Student) => {
    setStudents((prev) => prev.map((item) => (item.id === s.id ? s : item)));
    showToast(`Student profile for ${s.name} updated`, 'success');
  };

  const deleteStudent = (id: string) => {
    const stu = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    showToast(`Student record removed (Demonstration)`, 'warning');
    if (stu) {
      logActivity('Student Record Removed', 'Class Teacher', 'Class Teacher', `Removed ${stu.name} (${stu.usn})`);
    }
  };

  const addClassTeacher = (t: Omit<ClassTeacher, 'id'>) => {
    const newTeacher: ClassTeacher = { ...t, id: `ct-${Date.now()}` };
    setClassTeachers((prev) => [...prev, newTeacher]);
    showToast(`Class teacher ${t.name} appointed`, 'success');
  };

  const addSubjectTeacher = (t: Omit<SubjectTeacher, 'id'>) => {
    const newTeacher: SubjectTeacher = { ...t, id: `t-${Date.now()}` };
    setSubjectTeachers((prev) => [...prev, newTeacher]);
    showToast(`Subject teacher ${t.name} registered`, 'success');
  };

  const assignTeacherToSubject = (subjectCode: string, classId: string, teacherName: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.code === subjectCode ? { ...s, assignedTeacherName: teacherName } : s))
    );
    showToast(`Assigned ${teacherName} to ${subjectCode}`, 'success');
    logActivity('Faculty Allotment', 'Class Teacher', 'Class Teacher', `Assigned ${teacherName} for ${subjectCode}`);
  };

  const updateAcademicConfig = (cfg: AcademicConfig) => {
    setAcademicConfig(cfg);
    showToast('Academic configurations saved successfully', 'success');
    logActivity('Config Updated', 'Admin', 'Admin', `Updated attendance threshold to ${cfg.minAttendancePercent}%`);
  };

  const createAssignment = (a: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = { ...a, id: `asg-${Date.now()}` };
    setAssignments((prev) => [newAsg, ...prev]);
    showToast(`Assignment "${a.title}" published to ${a.className}`, 'success');
    logActivity('Assignment Created', a.teacherName, 'Teacher', `Published assignment "${a.title}" in ${a.subjectCode}`);
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === alertId ? { ...alt, status: 'resolved' as const } : alt))
    );
    showToast('Academic alert marked as addressed & resolved', 'success');
  };

  const resolveCorrectionRequest = (requestId: string, status: 'approved' | 'rejected', note?: string) => {
    setCorrectionRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status, resolutionNote: note } : req))
    );
    showToast(`Correction request ${status}`, status === 'approved' ? 'success' : 'warning');
    logActivity('Correction Resolved', 'Faculty', 'Class Teacher', `Marked correction request #${requestId} as ${status}`);
  };

  const createAnnouncement = (ann: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = { ...ann, id: `ann-${Date.now()}` };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast(`Announcement published: "${ann.title}"`, 'success');
    logActivity('Announcement Posted', ann.authorName, ann.authorRole, `Published announcement: ${ann.title}`);
  };

  const approveStudentJoinRequest = (id: string) => {
    const req = studentJoinRequests.find((r) => r.id === id);
    if (!req) return;
    setStudentJoinRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    );
    const exists = students.some((s) => s.usn.toLowerCase() === req.usn.toLowerCase());
    if (!exists) {
      const newStudent: Student = {
        id: `stu-${Date.now()}`,
        name: req.studentName,
        usn: req.usn,
        email: req.email,
        phone: req.phone,
        collegeId: 'col-1',
        collegeName: 'RV College of Engineering',
        classId: req.classId,
        className: '5th Sem CSE - Section A',
        semester: req.semester,
        branch: req.branch,
        overallAttendance: 85.0,
        totalClassesAttended: 156,
        totalClassesHeld: 184,
        avgIA: 80.0,
        alertsCount: 0,
        status: 'active',
        mentorName: 'Dr. K. Srinivas'
      };
      setStudents((prev) => [newStudent, ...prev]);
    }
    showToast(`Approved join request for ${req.studentName} (${req.usn})`, 'success');
    logActivity('Student Join Request Approved', 'Dr. K. Srinivas', 'Class Teacher', `Approved admission to Section A for ${req.studentName} (${req.usn})`);
  };

  const rejectStudentJoinRequest = (id: string, reason: string = 'Verification criteria not satisfied') => {
    const req = studentJoinRequests.find((r) => r.id === id);
    if (!req) return;
    setStudentJoinRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as const, rejectionReason: reason } : r))
    );
    showToast(`Rejected request for ${req.studentName}: ${reason}`, 'warning');
    logActivity('Student Join Request Rejected', 'Dr. K. Srinivas', 'Class Teacher', `Rejected request for ${req.studentName} (${req.usn}): ${reason}`);
  };

  const addAuditLog = (
    action: string,
    targetResource: string,
    details: string,
    status: 'success' | 'warning' | 'info' = 'success'
  ) => {
    const newAudit: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      performedBy: 'Administrator (Rehan)',
      performerRole: 'Administrator',
      action,
      targetResource,
      status,
      details
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const addUserAccount = (user: Omit<UserAccount, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: UserAccount = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never logged in'
    };
    setUserAccounts((prev) => [newUser, ...prev]);
    showToast(`User account created for ${user.name} (${user.identifier})`, 'success');
    addAuditLog('User Account Created', `${user.name} (${user.identifier})`, `Created ${user.role.toUpperCase()} account with status ${user.status}.`, 'success');
  };

  const updateUserAccount = (user: UserAccount) => {
    setUserAccounts((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    showToast(`Updated account details for ${user.name}`, 'success');
    addAuditLog('Account Updated', `${user.name} (${user.identifier})`, `Administrator updated account profile info.`, 'info');
  };

  const toggleUserStatus = (id: string) => {
    let targetUser: UserAccount | undefined;
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          targetUser = u;
          const nextStatus = u.status === 'active' ? 'inactive' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    if (targetUser) {
      const nextStatus = targetUser.status === 'active' ? 'inactive' : 'active';
      setClassTeachers((prev) =>
        prev.map((ct) => (ct.email === targetUser?.email ? { ...ct, status: nextStatus } : ct))
      );
      setSubjectTeachers((prev) =>
        prev.map((st) => (st.email === targetUser?.email ? { ...st, status: nextStatus } : st))
      );
      setStudents((prev) =>
        prev.map((st) => (st.email === targetUser?.email ? { ...st, status: nextStatus } : st))
      );
      showToast(
        `Account for ${targetUser.name} is now ${nextStatus.toUpperCase()}`,
        nextStatus === 'active' ? 'success' : 'warning'
      );
      addAuditLog(
        nextStatus === 'active' ? 'Account Activated' : 'Account Deactivated',
        `${targetUser.name} (${targetUser.identifier})`,
        `Administrator switched account status to ${nextStatus}.`,
        nextStatus === 'active' ? 'success' : 'warning'
      );
    }
  };

  const changeUserRole = (id: string, newRole: UserRole) => {
    let targetUser: UserAccount | undefined;
    setUserAccounts((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          targetUser = u;
          return { ...u, role: newRole };
        }
        return u;
      })
    );
    if (targetUser) {
      showToast(`Updated role for ${targetUser.name} to ${newRole.replace('_', ' ').toUpperCase()}`, 'success');
      addAuditLog('User Role Changed', `${targetUser.name} (${targetUser.identifier})`, `Role modified from ${targetUser.role} to ${newRole}.`, 'info');
    }
  };

  const createClassTeacherAccount = (data: {
    name: string;
    email: string;
    identifier: string;
    phone?: string;
    department: string;
    status: 'active' | 'inactive';
    assignedClassId?: string;
  }): boolean => {
    const exists = userAccounts.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase() || u.identifier.toLowerCase() === data.identifier.toLowerCase()
    );
    if (exists) {
      showToast(`Account with email "${data.email}" or ID "${data.identifier}" already exists`, 'error');
      return false;
    }

    const assignedClassObj = classes.find((c) => c.id === data.assignedClassId);
    const newCTId = `ct-${Date.now()}`;

    const newCT: ClassTeacher = {
      id: newCTId,
      name: data.name,
      email: data.email,
      phone: data.phone || '+91 98450 00000',
      collegeId: selectedCollegeId,
      collegeName: colleges.find((c) => c.id === selectedCollegeId)?.name || 'RV College of Engineering',
      department: data.department || 'Computer Science & Engineering',
      assignedClass: assignedClassObj ? assignedClassObj.name : 'Unassigned',
      assignedClassId: data.assignedClassId || '',
      totalStudents: assignedClassObj ? assignedClassObj.totalStudents : 0,
      status: data.status,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    };

    setClassTeachers((prev) => [newCT, ...prev]);

    const newUser: UserAccount = {
      id: `usr-${newCTId}`,
      name: data.name,
      email: data.email,
      identifier: data.identifier,
      role: 'class_teacher',
      department: data.department || 'Computer Science & Engineering',
      status: data.status,
      assignedClass: assignedClassObj ? assignedClassObj.name : 'Unassigned',
      assignedClassId: data.assignedClassId || '',
      phone: data.phone,
      lastLogin: 'Never logged in',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUserAccounts((prev) => [newUser, ...prev]);

    if (assignedClassObj) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === data.assignedClassId
            ? { ...c, classTeacherId: newCTId, classTeacherName: data.name }
            : c
        )
      );
    }

    showToast(`Created Class Teacher account for ${data.name}`, 'success');
    addAuditLog(
      'Class Teacher Created',
      `${data.name} (${data.identifier})`,
      `Created Class Teacher account ${assignedClassObj ? 'and assigned to ' + assignedClassObj.name : '(unassigned classroom)'}.`,
      'success'
    );
    return true;
  };

  const promoteTeacherToClassTeacher = (teacherId: string, assignedClassId?: string) => {
    const teacher = subjectTeachers.find((t) => t.id === teacherId) || userAccounts.find((u) => u.id === teacherId);
    if (!teacher) return;

    const assignedClassObj = classes.find((c) => c.id === assignedClassId);
    const newCTId = `ct-${Date.now()}`;

    const newCT: ClassTeacher = {
      id: newCTId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '+91 98450 00000',
      collegeId: selectedCollegeId,
      collegeName: colleges.find((c) => c.id === selectedCollegeId)?.name || 'RV College of Engineering',
      department: teacher.department,
      assignedClass: assignedClassObj ? assignedClassObj.name : 'Unassigned',
      assignedClassId: assignedClassId || '',
      totalStudents: assignedClassObj ? assignedClassObj.totalStudents : 0,
      status: 'active'
    };

    setClassTeachers((prev) => [newCT, ...prev]);

    setUserAccounts((prev) =>
      prev.map((u) =>
        u.email === teacher.email
          ? {
              ...u,
              role: 'class_teacher',
              assignedClass: assignedClassObj ? assignedClassObj.name : 'Unassigned',
              assignedClassId: assignedClassId || ''
            }
          : u
      )
    );

    if (assignedClassObj) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === assignedClassId
            ? { ...c, classTeacherId: newCTId, classTeacherName: teacher.name }
            : c
        )
      );
    }

    showToast(`Promoted ${teacher.name} to Class Teacher`, 'success');
    addAuditLog(
      'User Role Updated',
      `${teacher.name}`,
      `Promoted Teacher to Class Teacher role ${assignedClassObj ? 'and assigned to ' + assignedClassObj.name : ''}.`,
      'success'
    );
  };

  const assignClassTeacherToClass = (classTeacherId: string, classId: string) => {
    const ct = classTeachers.find((c) => c.id === classTeacherId);
    const cls = classes.find((c) => c.id === classId);
    if (!ct || !cls) return;

    setClassTeachers((prev) =>
      prev.map((item) =>
        item.id === classTeacherId
          ? { ...item, assignedClass: cls.name, assignedClassId: cls.id, totalStudents: cls.totalStudents }
          : item
      )
    );

    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, classTeacherId: ct.id, classTeacherName: ct.name }
          : c.classTeacherId === ct.id
          ? { ...c, classTeacherId: '', classTeacherName: 'Unassigned' }
          : c
      )
    );

    setUserAccounts((prev) =>
      prev.map((u) =>
        u.email === ct.email
          ? { ...u, assignedClass: cls.name, assignedClassId: cls.id }
          : u
      )
    );

    showToast(`Assigned ${ct.name} to ${cls.name}`, 'success');
    addAuditLog('Classroom Assigned', `${cls.name}`, `Assigned ${ct.name} as official Class Teacher.`, 'success');
  };

  const removeClassTeacherAssignment = (classTeacherId: string) => {
    const ct = classTeachers.find((c) => c.id === classTeacherId);
    if (!ct) return;

    const oldClassName = ct.assignedClass;

    setClassTeachers((prev) =>
      prev.map((item) =>
        item.id === classTeacherId
          ? { ...item, assignedClass: 'Unassigned', assignedClassId: '', totalStudents: 0 }
          : item
      )
    );

    setClasses((prev) =>
      prev.map((c) =>
        c.classTeacherId === ct.id
          ? { ...c, classTeacherId: '', classTeacherName: 'Unassigned' }
          : c
      )
    );

    setUserAccounts((prev) =>
      prev.map((u) =>
        u.email === ct.email
          ? { ...u, assignedClass: 'Unassigned', assignedClassId: '' }
          : u
      )
    );

    showToast(`Removed classroom assignment from ${ct.name}`, 'warning');
    addAuditLog('Classroom Unassigned', `${oldClassName}`, `Removed Class Teacher assignment for ${ct.name}.`, 'warning');
  };

  const toggleClassTeacherStatus = (classTeacherId: string) => {
    let targetCT: ClassTeacher | undefined;
    setClassTeachers((prev) =>
      prev.map((ct) => {
        if (ct.id === classTeacherId) {
          targetCT = ct;
          const nextStatus = ct.status === 'active' ? 'inactive' : 'active';
          return { ...ct, status: nextStatus };
        }
        return ct;
      })
    );
    if (targetCT) {
      const nextStatus = targetCT.status === 'active' ? 'inactive' : 'active';
      setUserAccounts((prev) =>
        prev.map((u) => (u.email === targetCT?.email ? { ...u, status: nextStatus } : u))
      );
      showToast(`Class Teacher ${targetCT.name} marked as ${nextStatus.toUpperCase()}`, nextStatus === 'active' ? 'success' : 'warning');
      addAuditLog(
        nextStatus === 'active' ? 'Account Activated' : 'Account Deactivated',
        `${targetCT.name}`,
        `Administrator set Class Teacher status to ${nextStatus}.`,
        nextStatus === 'active' ? 'success' : 'warning'
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedCollegeId,
        setSelectedCollegeId,
        currentPage,
        setCurrentPage,
        searchTerm,
        setSearchTerm,
        colleges,
        departments,
        classes,
        subjects,
        classTeachers,
        subjectTeachers,
        students,
        userAccounts,
        auditLogs,
        alerts,
        assignments,
        correctionRequests,
        announcements,
        activityLogs,
        academicConfig,
        toasts,
        showToast,
        dismissToast,
        addCollege,
        updateCollege,
        toggleCollegeStatus,
        addStudent,
        updateStudent,
        deleteStudent,
        addClassTeacher,
        addSubjectTeacher,
        assignTeacherToSubject,
        updateAcademicConfig,
        createAssignment,
        resolveAlert,
        resolveCorrectionRequest,
        createAnnouncement,
        logActivity,
        studentJoinRequests,
        approveStudentJoinRequest,
        rejectStudentJoinRequest,
        addUserAccount,
        updateUserAccount,
        toggleUserStatus,
        changeUserRole,
        createClassTeacherAccount,
        promoteTeacherToClassTeacher,
        assignClassTeacherToClass,
        removeClassTeacherAssignment,
        toggleClassTeacherStatus,
        addAuditLog
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
