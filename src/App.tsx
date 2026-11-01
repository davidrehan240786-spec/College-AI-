import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  ArrowRight, 
  Globe, 
  Zap, 
  Shield, 
  Code, 
  Check,
  CreditCard,
  Video,
  Link as LinkIcon,
  Languages,
  Layout,
  AppWindow,
  Settings,
  Star,
  Mail,
  Smartphone,
  Heart,
  Activity,
  Stethoscope,
  Search,
  FileText,
  QrCode,
  LayoutDashboard,
  BrainCircuit,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Clock,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Calculator
} from 'lucide-react';

import { TestimonialsColumn } from './components/ui/testimonials-columns-1';
import { FAQAccordionBlock } from './components/ui/faq-accordion-block-shadcnui';
import { Dashboard } from './components/Dashboard';
import { Cta4 } from './components/ui/cta-4';
import { AnimatedLoginPage } from './components/ui/animated-characters-login-page';
import { AppProvider } from './context/AppContext';

// --- Reusable Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: { 
  children: React.ReactNode; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'black'; 
  className?: string;
  [key: string]: any;
}) => {
  const { asChild, aschild, ...domProps } = props;
  const variants = {
    primary: 'cal-button-primary',
    secondary: 'cal-button-secondary',
    ghost: 'text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-2 rounded-lg transition-all',
    black: 'bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all text-sm'
  };

  return (
    <button className={`${variants[variant]} ${className}`} {...domProps}>
      {children}
    </button>
  );
};

const Section = ({ children, className = '', id = '', container = true, animate = true }: { children: React.ReactNode; className?: string; id?: string; container?: boolean; animate?: boolean }) => (
  <section id={id} className={`py-5 sm:py-14 md:py-24 ${className}`}>
    {container ? (
      <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6">
        {animate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        ) : (
          children
        )}
      </div>
    ) : (
      children
    )}
  </section>
);

const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  const { asChild, aschild, ...domProps } = props;
  return (
    <div className={`cal-card ${className}`} {...domProps}>
      {children}
    </div>
  );
};

const Badge = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => {
  const { asChild, aschild, ...domProps } = props;
  return (
    <span className={`cal-badge ${className}`} {...domProps}>
      {children}
    </span>
  );
};

// --- Landing Page Sections ---

const Navbar = ({ onEnterApp }: { onEnterApp: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'How It Works', id: 'how-it-works' },
    { name: 'Stakeholders', id: 'testimonials' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Get Started', id: 'cta' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetAtTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetAtTop, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-200 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-xs' : 'bg-white/70 backdrop-blur-xs'}`}>
      <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 lg:gap-8">
          <a href="/" className="text-base sm:text-xl font-bold tracking-tighter flex items-center gap-2 uppercase shrink-0">
            <GraduationCap size={18} className="sm:w-5 sm:h-5 shrink-0 text-blue-600" /> Academio
          </a>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black px-3 py-2 transition-colors whitespace-nowrap"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Button variant="black" onClick={onEnterApp} className="min-h-[40px] px-5 text-xs uppercase tracking-wider font-bold">
            Access Portal <ArrowRight size={14} className="ml-1 inline" />
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1.5 lg:hidden">
          <Button variant="black" onClick={onEnterApp} className="text-[11px] px-2.5 py-1.5 min-h-[32px] flex items-center font-bold">
            Portal <ArrowRight size={11} className="ml-1 inline" />
          </Button>
          <button 
            type="button"
            className="w-9 h-9 rounded-lg text-black hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-14 sm:top-16 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-50 lg:hidden bg-white border-b border-gray-200 px-5 py-4 flex flex-col gap-1 shadow-xl overflow-hidden"
            >
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="text-sm font-semibold text-gray-800 py-2.5 border-b border-gray-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                >
                  <span>{link.name}</span>
                  <ChevronRight size={14} className="text-gray-400" />
                </a>
              ))}
              <div className="pt-2">
                <Button variant="black" className="w-full py-3 text-xs uppercase tracking-wider font-bold" onClick={() => { setIsOpen(false); onEnterApp(); }}>
                  Access Academic Portal <ArrowRight size={13} className="ml-1.5 inline" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onEnterApp }: { onEnterApp: () => void }) => (
  <Section className="pt-2 sm:pt-12 pb-4 sm:pb-20">
    <div className="grid lg:grid-cols-2 gap-5 lg:gap-12 items-center">
      <div>
        <Badge className="mb-2 sm:mb-6 bg-blue-50 text-blue-700 border-blue-100 flex items-center gap-1.5 w-fit text-[9px] sm:text-xs py-0.5 sm:py-1">
          <Zap size={11} /> Academio — Your Academic Hub <ChevronRight size={11} className="ml-0.5" />
        </Badge>
        <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 sm:mb-6 leading-[1.15] sm:leading-[1.1] tracking-tighter text-balance break-words">
          Stay Ahead with <span className="text-blue-600">Academio.</span>
        </h1>
        <p className="text-gray-500 text-xs sm:text-base md:text-lg mb-3.5 sm:mb-8 max-w-[500px] leading-relaxed font-medium">
          Track attendance, monitor internal marks, manage assignments, and identify academic concerns early — your centralized academic hub.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 max-w-[500px] w-full">
          <button 
            onClick={onEnterApp}
            className="w-full sm:flex-1 min-h-[40px] sm:min-h-[48px] bg-black text-white px-4 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-800 transition-all uppercase tracking-widest text-[11px] sm:text-xs shadow-md sm:shadow-lg shadow-black/10 active:scale-98"
          >
            Access Dashboard <ArrowRight size={13} />
          </button>
          <button 
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:flex-1 min-h-[40px] sm:min-h-[48px] bg-white text-gray-900 px-4 sm:px-8 py-2.5 sm:py-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-all uppercase tracking-widest text-[11px] sm:text-xs border border-gray-200 active:scale-98"
          >
            Explore Features
          </button>
        </div>
        <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 sm:mt-5 font-black uppercase tracking-widest">Designed for VTU BE CSE Continuous Evaluation</p>
      </div>

      <div className="relative w-full min-w-0">
        <Card className="p-0 shadow-cal border-gray-100 overflow-hidden rounded-xl sm:rounded-3xl">
          <div className="bg-white p-3 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-blue-200 shrink-0">
                  <BrainCircuit size={16} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">Early Alert Engine</p>
                  <h3 className="text-sm sm:text-xl font-black tracking-tight">Academic Monitor</h3>
                </div>
              </div>
              <div className="self-start sm:self-auto px-2 py-0.5 sm:px-3.5 sm:py-1.5 bg-emerald-50 text-emerald-600 rounded-md sm:rounded-xl flex items-center gap-1.5 border border-emerald-100">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Active Monitoring</span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-8">
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4">
                {[
                  { label: 'Attendance', value: '82%', icon: Clock },
                  { label: 'Avg IA Marks', value: '76/100', icon: Activity },
                  { label: 'Pending Tasks', value: '3', icon: FileText },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 p-1.5 sm:p-4 rounded-lg sm:rounded-2xl border border-gray-100 flex flex-col items-center text-center min-w-0">
                    <item.icon size={13} className="sm:w-4 sm:h-4 text-gray-400 mb-0.5 sm:mb-1 shrink-0" />
                    <p className="text-[7.5px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider leading-none mb-0.5 truncate w-full">{item.label}</p>
                    <p className="text-[11px] sm:text-sm font-black truncate w-full">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="relative pl-3 sm:pl-6 space-y-2.5 sm:space-y-8 before:absolute before:left-[4px] sm:before:left-[11px] before:top-1.5 before:bottom-1.5 before:w-px before:bg-gray-100">
                <div className="relative group">
                  <div className="absolute -left-[10px] sm:-left-[19px] top-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-blue-600 ring-2 sm:ring-4 ring-blue-50" />
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">10:30 AM • IA-2 Results</p>
                  <h4 className="text-[11px] sm:text-sm font-black mb-0.5 sm:mb-1">Data Structures & OS Recorded</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium leading-normal sm:leading-relaxed">Scored 24/30 in Internal Assessment 2. Overall subject performance is on track.</p>
                </div>

                <div className="relative group opacity-70">
                   <div className="absolute -left-[10px] sm:-left-[19px] top-1 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 ring-2 sm:ring-4 ring-emerald-50" />
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">09:15 AM • Attendance Evaluated</p>
                  <h4 className="text-[11px] sm:text-sm font-black mb-0.5 sm:mb-1">Computer Networks at 81%</h4>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-medium leading-normal sm:leading-relaxed">Above the 75% VTU eligibility threshold. 3 classes buffer remaining.</p>
                </div>
              </div>

              <div className="pt-0.5">
                <div className="p-2 sm:p-4 bg-black text-white rounded-lg sm:rounded-2xl shadow-sm sm:shadow-lg shadow-black/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <Calculator size={15} className="sm:w-5 sm:h-5 text-blue-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[7.5px] sm:text-[9px] font-black text-white/50 uppercase tracking-widest leading-none mb-0.5 truncate">What-If Calculator</p>
                      <p className="text-[10px] sm:text-xs font-bold truncate">Attend next 4 classes to reach 85%</p>
                    </div>
                  </div>
                  <ChevronRight size={13} className="sm:w-4 sm:h-4 text-white/40 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Floating Badges */}
        <div className="mt-2.5 sm:mt-6 flex flex-wrap justify-center items-center gap-2.5 sm:gap-8 opacity-75">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-blue-500 fill-blue-500" />
            <span className="text-[10px] sm:text-xs font-bold">VTU Guidelines</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[7.5px] sm:text-[9px] font-bold">R</div>
            <span className="text-[10px] sm:text-xs font-bold">Rule-Based Alerts</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[7.5px] sm:text-[9px] font-bold">P</div>
            <span className="text-[10px] sm:text-xs font-bold">Role-Based Access</span>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

const Stats = () => (
  <div className="py-2.5 sm:py-12 bg-white border-y border-gray-100 overflow-hidden">
    <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6">
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-8 items-center">
        {[
          { label: "Centralized Records", icon: <FileText size={14} className="sm:w-5 sm:h-5" /> },
          { label: "What-If Calculator", icon: <Clock size={14} className="sm:w-5 sm:h-5" /> },
          { label: "Explainable Alerts", icon: <ShieldCheck size={14} className="sm:w-5 sm:h-5" /> }
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 p-0.5 sm:p-2 text-center sm:text-left"
          >
            <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-md sm:rounded-2xl bg-gray-50 flex items-center justify-center text-black shadow-xs shrink-0">
              {stat.icon}
            </div>
            <span className="text-[8px] sm:text-xs font-black uppercase tracking-wider leading-tight sm:tracking-widest">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorks = () => (
  <Section id="features" className="bg-gray-50/50">
    <div className="text-center mb-4 sm:mb-16 px-1">
      <Badge className="mb-1.5 sm:mb-4 bg-white px-2.5 py-0.5 sm:px-4 sm:py-1.5 border-gray-100 uppercase tracking-[0.2em] font-black text-[7.5px] sm:text-[9px] text-gray-400">Academic Management Platform</Badge>
      <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-1.5 sm:mb-6 tracking-tighter leading-tight text-balance">Centralized. Explainable. Proactive.</h2>
      <p className="text-gray-500 text-xs sm:text-base md:text-lg max-w-[600px] mx-auto font-medium">
        Bringing attendance, internal marks, and assignments together to detect potential academic concerns before semester finals.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
      {[
        { 
          title: 'Centralized Records', 
          desc: "Track class attendance, internal marks, and assignment deadlines in one unified student view.",
          icon: <FileText className="h-4 w-4 sm:h-6 sm:w-6" />
        },
        { 
          title: 'Attendance What-If', 
          desc: "Simulate future attendance scenarios to estimate your semester percentage without altering logs.",
          icon: <Clock className="h-4 w-4 sm:h-6 sm:w-6" />
        },
        { 
          title: 'Explainable Early Alerts', 
          desc: "Receive transparent notifications when attendance drops below 75% or marks fall behind targets.",
          icon: <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6" />
        },
        { 
          title: 'Improvement Suggestions', 
          desc: "Get personalized, rule-based recommendations and study priorities based on academic records.",
          icon: <BrainCircuit className="h-4 w-4 sm:h-6 sm:w-6" />
        }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Card className="p-3.5 sm:p-8 flex flex-col h-full hover:scale-[1.02] transition-all border-none shadow-xs sm:shadow-xl shadow-black/5 bg-white rounded-xl sm:rounded-2xl">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-black text-white rounded-lg sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-6 shadow-xs sm:shadow-md shadow-black/10 shrink-0">
              {item.icon}
            </div>
            <h3 className="text-sm sm:text-xl font-black mb-1 sm:mb-3 tracking-tight">{item.title}</h3>
            <p className="text-gray-400 text-[10px] sm:text-xs mb-0 sm:mb-10 leading-normal sm:leading-relaxed font-bold uppercase tracking-wider sm:tracking-widest">{item.desc}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  </Section>
);

const Benefits = () => (
  <Section id="how-it-works" className="bg-white">
    <div className="text-center mb-4 sm:mb-16 px-1">
      <Badge className="mb-1.5 sm:mb-4 bg-gray-50 uppercase tracking-widest font-black text-[7.5px] sm:text-[9px] px-2.5 py-0.5 sm:px-4 sm:py-2">Why Academio?</Badge>
      <h2 className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1.5 sm:mb-6 tracking-tighter text-balance">Built for Timely Intervention</h2>
      <p className="text-gray-500 text-xs sm:text-base md:text-lg max-w-[600px] mx-auto font-medium">
        Engineered to empower students, faculty mentors, and academic administrators with clear, actionable insights.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <Card className="p-3.5 sm:p-8 md:p-10 border-none shadow-xs sm:shadow-xl shadow-black/5 bg-white rounded-xl sm:rounded-3xl hover:scale-[1.01] transition-all h-full">
          <h3 className="text-base sm:text-2xl font-black mb-1 sm:mb-3 tracking-tighter">Explainable Early Alerts</h3>
          <p className="text-gray-400 text-[10px] sm:text-sm mb-2.5 sm:mb-8 leading-normal sm:leading-relaxed font-bold uppercase tracking-wider sm:tracking-widest">No black-box ambiguity. The system clearly explains why an alert was triggered and provides exact targets to recover.</p>
          <div className="bg-gray-50 rounded-lg sm:rounded-3xl border border-gray-100 p-2.5 sm:p-6 md:p-8">
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 sm:mb-6">Configured Alert Rules</p>
            <div className="space-y-1.5 sm:space-y-4">
              <div className="bg-white border border-gray-200 p-2 sm:p-4 rounded-md sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex justify-between items-center shadow-xs">
                <span>ATTENDANCE &lt; 75% THRESHOLD</span> <ShieldCheck size={12} className="sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" />
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-4">
                <div className="bg-white border border-gray-200 p-2 sm:p-4 rounded-md sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex justify-between items-center shadow-xs">
                  <span>IA DECLINE &gt; 15%</span> <Shield size={12} className="sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
                </div>
                <div className="bg-white border border-gray-200 p-2 sm:p-4 rounded-md sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex justify-between items-center shadow-xs">
                  <span>OVERDUE TASKS</span> <Shield size={12} className="sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.12 }}
      >
        <Card className="p-3.5 sm:p-8 md:p-10 border-none shadow-xs sm:shadow-xl shadow-black/5 bg-white rounded-xl sm:rounded-3xl hover:scale-[1.01] transition-all h-full">
          <h3 className="text-base sm:text-2xl font-black mb-1 sm:mb-3 tracking-tighter">Attendance What-If Forecasting</h3>
          <p className="text-gray-400 text-[10px] sm:text-sm mb-2.5 sm:mb-8 leading-normal sm:leading-relaxed font-bold uppercase tracking-wider sm:tracking-widest">Plan future attendance responsibly. Test how attending or missing upcoming lecture and lab hours impacts eligibility.</p>
          <div className="bg-gray-50 rounded-lg sm:rounded-3xl border border-gray-100 p-2.5 sm:p-6 md:p-8 relative overflow-hidden">
            <div className="flex bg-white p-2 sm:p-5 rounded-md sm:rounded-2xl shadow-xs sm:shadow-md border border-gray-100 items-center gap-2 sm:gap-5 min-w-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xs sm:shadow-lg shadow-blue-200">
                <Clock size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[7.5px] sm:text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5 truncate">What-If Simulation Active</p>
                <p className="text-[10px] sm:text-xs font-black tracking-tight truncate">"Attend next 4 classes to reach 85%."</p>
              </div>
            </div>
            <div className="mt-2.5 sm:mt-6 flex flex-wrap gap-1 sm:gap-3">
              {['75% Min Req', '82% Current', '85% Projected'].map(t => <span key={t} className="px-2 py-0.5 sm:px-4 sm:py-2 bg-white border border-gray-100 rounded-md sm:rounded-xl text-[7.5px] sm:text-[9px] font-black uppercase tracking-widest shadow-xs">{t}</span>)}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <Card className="p-3.5 sm:p-8 md:p-10 border-none shadow-xs sm:shadow-xl shadow-black/5 bg-white rounded-xl sm:rounded-3xl hover:scale-[1.01] transition-all h-full">
          <h3 className="text-base sm:text-2xl font-black mb-1 sm:mb-3 tracking-tighter">Internal Assessment Tracking</h3>
          <p className="text-gray-400 text-[10px] sm:text-sm mb-2.5 sm:mb-8 leading-normal sm:leading-relaxed font-bold uppercase tracking-wider sm:tracking-widest">Monitor IA-1, IA-2, and lab assessments across every registered subject to identify weak areas before semester finals.</p>
          <div className="bg-gray-50 rounded-lg sm:rounded-3xl border border-gray-100 p-2.5 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-2 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-3 sm:w-7 sm:h-4 bg-emerald-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full transition-all" /></div>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest">IA Progression Active</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className={`h-6 sm:h-16 rounded-md sm:rounded-xl border mb-0.5 sm:mb-2 shadow-xs flex items-center justify-center ${i < 4 ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-white border-gray-100 text-gray-200'}`}>
                    {i < 4 ? <CheckCircle size={12} className="sm:w-5 sm:h-5" /> : <div className="w-2.5 h-2.5 sm:w-4 sm:h-4 rounded-full border-2 border-gray-100" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-3.5 sm:p-8 md:p-10 border-none shadow-xs sm:shadow-xl shadow-black/5 bg-white rounded-xl sm:rounded-3xl hover:scale-[1.01] transition-all h-full">
          <h3 className="text-base sm:text-2xl font-black mb-1 sm:mb-3 tracking-tighter">Three-Tier Role Management</h3>
          <p className="text-gray-400 text-[10px] sm:text-sm mb-2.5 sm:mb-8 leading-normal sm:leading-relaxed font-bold uppercase tracking-wider sm:tracking-widest">Dedicated portals for Students, Teachers, and Administrators ensure strict role authorization and data privacy.</p>
          <div className="bg-gray-50 rounded-lg sm:rounded-3xl border border-gray-100 p-2.5 sm:p-6 md:p-8 flex items-center justify-center">
            <div className="bg-white p-2 sm:p-5 rounded-md sm:rounded-2xl shadow-xs sm:shadow-md border border-gray-100 flex items-center gap-2 sm:gap-5 w-full min-w-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-black rounded-lg sm:rounded-2xl flex items-center justify-center text-white shadow-xs sm:shadow-md shadow-black/10 shrink-0">
                <GraduationCap size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[7.5px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-0.5 truncate">Role-Authorized Workflow</p>
                <p className="text-[10px] sm:text-xs font-black tracking-tight truncate">"Faculty entered CSE-5B Database IA-2 marks & attendance."</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  </Section>
);

const Testimonials = () => {
  const testimonials = [
    {
      text: "Having attendance percentages and IA marks in one dashboard prevents sudden attendance shortage notices before semester exams.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Arjun Rao",
      role: "5th Sem CSE Student",
    },
    {
      text: "Entering marks and identifying students who need timely mentoring is seamless with automated, explainable alert flags.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Prof. Ananya Sharma",
      role: "Assistant Professor, CSE",
    },
    {
      text: "The What-If calculator lets students see the concrete impact of upcoming classes without altering any official college records.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Dr. K. Srinivas",
      role: "Academic Mentor & Faculty",
    },
    {
      text: "Centralizing assignment deadlines and submission logs prevents coursework backlogs during busy internal exam weeks.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Meera Nair",
      role: "CSE Student Representative",
    },
    {
      text: "Managing class allotments and reviewing audit logs across multiple semesters is straightforward and secure.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Prof. Rajesh Kumar",
      role: "Department Administrator",
    },
    {
      text: "The rule-based recommendations give students actionable advice on which subjects need urgent revision.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150",
      name: "Dr. P. Venkatesh",
      role: "HOD, Computer Science",
    },
  ];

  const firstColumn = testimonials.slice(0, 2);
  const secondColumn = testimonials.slice(2, 4);
  const thirdColumn = testimonials.slice(4, 6);

  return (
    <Section id="testimonials" className="bg-gray-50/30 overflow-hidden">
      <div className="text-center mb-3.5 sm:mb-16 px-1">
        <Badge className="mb-1.5 sm:mb-4">Stakeholder Perspectives</Badge>
        <h2 className="text-xl sm:text-4xl md:text-5xl font-bold mb-1.5 sm:mb-6 text-balance">Value for College Academics</h2>
        <p className="text-gray-500 text-xs sm:text-base md:text-lg max-w-[600px] mx-auto">
          How centralized tracking and early alerts benefit students, faculty mentors, and academic administrators.
        </p>
      </div>

      <div className="flex justify-center gap-2 sm:gap-6 mt-3 sm:mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[250px] sm:max-h-[600px] md:max-h-[740px] overflow-hidden">
        <TestimonialsColumn testimonials={firstColumn} duration={15} />
        <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
        <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
      </div>
    </Section>
  );
};

const FinalCTA = ({ onEnterApp }: { onEnterApp: () => void }) => (
  <Cta4
    title="Stay ahead of your academics with Academio."
    description="Centralize your academic records, test attendance What-If scenarios, and receive explainable alerts before semester finals — your complete academic hub."
    buttonText="Access Dashboard"
    buttonOnClick={onEnterApp}
    items={[
      "Centralized Attendance Tracking",
      "Internal Assessment Analytics",
      "Attendance What-If Calculator",
      "Explainable Early Alerts",
      "Role-Based Academic Portals"
    ]}
  />
);

const Footer = () => (
  <footer className="py-4 sm:py-12 border-t border-gray-100 bg-white">
    <div className="max-w-[1200px] mx-auto px-3.5 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-2.5 sm:gap-6 text-center md:text-left">
      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-tighter">
        <GraduationCap size={15} /> Academio
      </div>
      <p className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-tight">© 2026 Academio — Your Academic Hub. VTU BE CSE Mini Project.</p>
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-6">
        {['Overview', 'Features', 'Roles', 'Guidelines'].map(l => (
          <a key={l} href="#" className="text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors min-h-[26px] sm:min-h-[32px] flex items-center px-1">{l}</a>
        ))}
      </div>
    </div>
  </footer>
);

const LandingPage = ({ onEnterApp }: { onEnterApp: () => void }) => (
  <div className="min-h-screen bg-white w-full overflow-x-hidden">
    <Navbar onEnterApp={onEnterApp} />
    <main className="w-full overflow-x-hidden">
      <Hero onEnterApp={onEnterApp} />
      <Stats />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <div id="faq">
        <FAQAccordionBlock />
      </div>
      <div id="pricing">
        <div id="cta">
          <FinalCTA onEnterApp={onEnterApp} />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'dashboard'>('landing');

  // Reset scroll to top when view changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [view]);

  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
          >
            <LandingPage onEnterApp={() => setView('login')} />
          </motion.div>
        )}
        {view === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatedLoginPage 
              onLoginSuccess={() => setView('dashboard')} 
              onBack={() => setView('landing')} 
            />
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-screen w-full overflow-hidden"
          >
            <Dashboard 
              onLogout={() => setView('login')}
              onExitToLanding={() => setView('landing')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppProvider>
  );
}
