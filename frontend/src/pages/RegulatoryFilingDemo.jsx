import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import { 
  Building2, ArrowLeft, Play, RotateCcw, CheckCircle, Circle, Loader,
  Calendar, FileText, AlertTriangle, CheckCircle2, Clock, Upload,
  X, Info, ChevronRight, Eye, Download, Send, FileCheck, Bell,
  CalendarDays, CalendarClock, Filter, Search, ExternalLink,
  FileWarning, FileClock, FileCheck2, AlertCircle, BadgeCheck
} from 'lucide-react';

const SUB_AGENTS = [
  { id: 'deadline-tracker', name: 'Deadline Tracker Agent', icon: CalendarClock },
  { id: 'form-generator', name: 'Form Generator Agent', icon: FileText },
  { id: 'validation-engine', name: 'Validation Engine Agent', icon: CheckCircle2 },
  { id: 'submission-manager', name: 'Submission Manager Agent', icon: Upload },
  { id: 'archive-manager', name: 'Archive Manager Agent', icon: FileCheck },
];

const DEMO_ISSUERS = [
  { id: 'ISS001', name: 'Tata Motors Limited', filings: 12, pending: 2, overdue: 0 },
  { id: 'ISS002', name: 'Reliance Industries', filings: 15, pending: 1, overdue: 0 },
  { id: 'ISS003', name: 'Bajaj Finance Ltd', filings: 10, pending: 3, overdue: 1 },
];

export default function RegulatoryFilingDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ deadlines: 0, forms: 0, validations: 0, submissions: 0 });
  const [showResults, setShowResults] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const [selectedIssuer, setSelectedIssuer] = useState(DEMO_ISSUERS[0]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [generatedForms, setGeneratedForms] = useState([]);
  const [validationResults, setValidationResults] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [archivedFilings, setArchivedFilings] = useState([]);
  const [showDeadlinesModal, setShowDeadlinesModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const commentaryRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (commentaryRef.current) commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
  }, [commentary]);

  const addCommentary = (text, type = 'info') => setCommentary(prev => [...prev, { text, type }]);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runDemo = async () => {
    setIsRunning(true); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowInitial(false);
    setUpcomingDeadlines([]); setGeneratedForms([]); setValidationResults([]);
    setSubmissionStatus(null); setArchivedFilings([]);
    setStats({ deadlines: 0, forms: 0, validations: 0, submissions: 0 });

    timerRef.current = setInterval(() => setElapsed(prev => prev + 100), 100);

    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    addCommentary('REGULATORY FILING AGENT - INITIALIZATION', 'header');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    await sleep(1500);
    addCommentary('Issuer: ' + selectedIssuer.name, 'system');
    addCommentary('Active NCD Issues: 3', 'system');
    addCommentary('Regulatory Bodies: SEBI, BSE, NSE, RBI', 'system');
    await sleep(1500);
    addCommentary('Initializing 5 AI Sub-Agents for regulatory compliance...', 'system');
    await sleep(1500);

    for (let i = 0; i < SUB_AGENTS.length; i++) {
      setCurrentAgentIndex(i);
      addCommentary('', 'spacer');
      addCommentary('═══════════════════════════════════════════════════════════', 'divider');
      addCommentary('PHASE ' + (i+1) + '/5: ' + SUB_AGENTS[i].name.toUpperCase(), 'header');
      addCommentary('═══════════════════════════════════════════════════════════', 'divider');
      await sleep(1000);
      await simulateAgent(SUB_AGENTS[i].id);
      setCompletedAgents(prev => [...prev, SUB_AGENTS[i].id]);
      addCommentary('✓ ' + SUB_AGENTS[i].name + ' completed', 'success');
      await sleep(800);
    }

    clearInterval(timerRef.current);
    setIsRunning(false); setCurrentAgentIndex(-1); setShowResults(true);
    addCommentary('', 'spacer');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    addCommentary('REGULATORY FILING CYCLE COMPLETE', 'header');
    addCommentary('All filings submitted successfully', 'complete');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
  };

  const simulateAgent = async (id) => {
    if (id === 'deadline-tracker') {
      addCommentary('Loading regulatory calendar for FY 2024-25...', 'agent');
      await sleep(2000);
      addCommentary('Scanning upcoming deadlines across all regulators...', 'detail');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('UPCOMING DEADLINES (Next 30 Days):', 'header');
      await sleep(1000);

      const deadlines = [
        { id: 'DL001', filing: 'Half-Yearly Asset Cover Certificate', regulator: 'SEBI', regulation: 'Reg 56(1)(d)', dueDate: '15-Jan-2025', daysLeft: 2, status: 'urgent', isin: 'INE155A07KL8' },
        { id: 'DL002', filing: 'Quarterly Financial Results', regulator: 'BSE/NSE', regulation: 'LODR Reg 52', dueDate: '20-Jan-2025', daysLeft: 7, status: 'upcoming', isin: 'INE155A07KL8' },
        { id: 'DL003', filing: 'Credit Rating Update', regulator: 'SEBI', regulation: 'Reg 56(1)(b)', dueDate: '25-Jan-2025', daysLeft: 12, status: 'upcoming', isin: 'INE155A07MN2' },
        { id: 'DL004', filing: 'Debenture Trustee Report', regulator: 'SEBI', regulation: 'Reg 52(5)', dueDate: '31-Jan-2025', daysLeft: 18, status: 'normal', isin: 'INE155A07KL8' },
        { id: 'DL005', filing: 'Interest Payment Intimation', regulator: 'BSE/NSE', regulation: 'LODR Reg 57', dueDate: '01-Feb-2025', daysLeft: 19, status: 'normal', isin: 'INE155A07KL8' },
        { id: 'DL006', filing: 'Record Date Intimation', regulator: 'BSE/NSE', regulation: 'LODR Reg 60', dueDate: '08-Feb-2025', daysLeft: 26, status: 'normal', isin: 'INE155A07MN2' },
      ];

      for (const dl of deadlines) {
        const icon = dl.status === 'urgent' ? '🔴' : dl.status === 'upcoming' ? '🟡' : '🟢';
        const type = dl.status === 'urgent' ? 'error' : dl.status === 'upcoming' ? 'warning' : 'data';
        addCommentary(`   ${icon} ${dl.filing}`, type);
        addCommentary(`      Due: ${dl.dueDate} (${dl.daysLeft} days) | ${dl.regulator} | ${dl.regulation}`, 'detail');
        setUpcomingDeadlines(prev => [...prev, dl]);
        await sleep(700);
      }

      setStats(prev => ({...prev, deadlines: deadlines.length}));
      addCommentary('', 'spacer');
      addCommentary('ALERT SUMMARY:', 'header');
      addCommentary('   🔴 Urgent (≤3 days): 1 filing', 'error');
      addCommentary('   🟡 Upcoming (≤14 days): 2 filings', 'warning');
      addCommentary('   🟢 Normal: 3 filings', 'success');
      await sleep(1500);
      addCommentary('Sending T-3 alert for Half-Yearly Asset Cover Certificate...', 'agent');
      await sleep(1000);
      addCommentary('Email alert sent to: compliance@tatamotors.com', 'success');
    }
    else if (id === 'form-generator') {
      addCommentary('Generating forms for urgent filing: Half-Yearly Asset Cover Certificate', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('Loading master data for form population...', 'step');
      await sleep(1500);
      addCommentary('   ✓ Issuer details loaded', 'success');
      addCommentary('   ✓ NCD issue details loaded (ISIN: INE155A07KL8)', 'success');
      addCommentary('   ✓ Security valuation data loaded', 'success');
      addCommentary('   ✓ Outstanding amount fetched: ₹4,850 Cr', 'success');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('POPULATING SEBI FORMAT:', 'header');
      await sleep(1000);

      const formFields = [
        { field: 'Issuer Name', value: 'Tata Motors Limited', source: 'Master' },
        { field: 'CIN', value: 'L28920MH1945PLC004520', source: 'Master' },
        { field: 'ISIN', value: 'INE155A07KL8', source: 'Master' },
        { field: 'NCD Series', value: 'Series A - 8.75% NCD 2029', source: 'Master' },
        { field: 'Issue Size', value: '₹5,000 Crores', source: 'Master' },
        { field: 'Outstanding Amount', value: '₹4,850 Crores', source: 'Calculated' },
        { field: 'Security Type', value: 'First Pari Passu Charge', source: 'Trust Deed' },
        { field: 'Security Value', value: '₹6,500 Crores', source: 'Valuation Report' },
        { field: 'Asset Cover Ratio', value: '1.34x', source: 'Calculated' },
        { field: 'Required Cover', value: '1.25x', source: 'Trust Deed' },
        { field: 'Compliance Status', value: 'COMPLIANT', source: 'Calculated' },
        { field: 'Valuation Date', value: '31-Dec-2024', source: 'Valuation Report' },
        { field: 'Valuer Name', value: 'CRISIL Valuations', source: 'Valuation Report' },
        { field: 'Certificate Period', value: 'H2 FY25 (Oct-Dec 2024)', source: 'System' },
      ];

      for (const field of formFields) {
        addCommentary(`   ${field.field}: ${field.value}`, 'data');
        addCommentary(`      Source: ${field.source}`, 'detail');
        await sleep(400);
      }

      setGeneratedForms([
        { id: 'FORM001', name: 'Asset_Cover_Certificate_H2FY25.pdf', type: 'SEBI Reg 56(1)(d)', status: 'generated', pages: 3, fields: 14 },
        { id: 'FORM002', name: 'BSE_Intimation_Asset_Cover.pdf', type: 'BSE Format', status: 'generated', pages: 2, fields: 10 },
        { id: 'FORM003', name: 'NSE_Intimation_Asset_Cover.pdf', type: 'NSE Format', status: 'generated', pages: 2, fields: 10 },
      ]);

      setStats(prev => ({...prev, forms: 3}));
      addCommentary('', 'spacer');
      addCommentary('FORMS GENERATED:', 'header');
      addCommentary('   ✓ Asset_Cover_Certificate_H2FY25.pdf (SEBI format)', 'success');
      addCommentary('   ✓ BSE_Intimation_Asset_Cover.pdf (BSE format)', 'success');
      addCommentary('   ✓ NSE_Intimation_Asset_Cover.pdf (NSE format)', 'success');
      await sleep(1500);
      addCommentary('Forms ready for validation...', 'agent');
    }
    else if (id === 'validation-engine') {
      addCommentary('Running validation checks on generated forms...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('VALIDATION CHECKS:', 'header');
      await sleep(1000);

      const validations = [
        { id: 'V01', check: 'ISIN Format Validation', status: 'pass', detail: 'INE155A07KL8 - Valid 12-character ISIN' },
        { id: 'V02', check: 'CIN Format Validation', status: 'pass', detail: 'L28920MH1945PLC004520 - Valid 21-character CIN' },
        { id: 'V03', check: 'Amount Consistency', status: 'pass', detail: 'Outstanding ≤ Issue Size verified' },
        { id: 'V04', check: 'Asset Cover Calculation', status: 'pass', detail: '₹6,500 / ₹4,850 = 1.34x (Correct)' },
        { id: 'V05', check: 'Compliance Threshold', status: 'pass', detail: '1.34x ≥ 1.25x (Compliant)' },
        { id: 'V06', check: 'Valuation Date Validity', status: 'pass', detail: 'Within 3 months - Valid' },
        { id: 'V07', check: 'Valuer Registration', status: 'pass', detail: 'CRISIL - SEBI Registered Valuer' },
        { id: 'V08', check: 'Digital Signature Block', status: 'pass', detail: 'Signatory details present' },
        { id: 'V09', check: 'Cross-Reference Check', status: 'pass', detail: 'Trust Deed clause 8.5 matched' },
        { id: 'V10', check: 'Previous Filing Comparison', status: 'warning', detail: 'Asset cover decreased from 1.45x to 1.34x' },
      ];

      for (const v of validations) {
        const icon = v.status === 'pass' ? '✓' : v.status === 'warning' ? '⚠️' : '✗';
        const type = v.status === 'pass' ? 'success' : v.status === 'warning' ? 'warning' : 'error';
        addCommentary(`   ${icon} ${v.check}`, type);
        addCommentary(`      ${v.detail}`, 'detail');
        setValidationResults(prev => [...prev, v]);
        await sleep(600);
      }

      setStats(prev => ({...prev, validations: validations.length}));
      addCommentary('', 'spacer');
      addCommentary('VALIDATION SUMMARY:', 'header');
      addCommentary('   Passed: 9/10 checks', 'success');
      addCommentary('   Warnings: 1 (Non-blocking)', 'warning');
      addCommentary('   Failed: 0', 'success');
      await sleep(1500);
      addCommentary('Forms validated - Ready for submission', 'success');
    }
    else if (id === 'submission-manager') {
      addCommentary('Initiating submission to regulatory portals...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('SUBMISSION SEQUENCE:', 'header');
      await sleep(1000);

      // SEBI Submission
      addCommentary('', 'spacer');
      addCommentary('[1/3] SEBI SCORES Portal', 'step');
      addCommentary('   Connecting to scores.gov.in...', 'detail');
      await sleep(1500);
      addCommentary('   Authenticating with digital certificate...', 'detail');
      await sleep(1500);
      addCommentary('   Uploading Asset_Cover_Certificate_H2FY25.pdf...', 'detail');
      await sleep(2000);
      addCommentary('   ✓ SEBI Submission Successful', 'success');
      addCommentary('   Acknowledgment No: SEBI/DT/2025/001847', 'data');
      await sleep(1000);

      // BSE Submission
      addCommentary('', 'spacer');
      addCommentary('[2/3] BSE Listing Centre', 'step');
      addCommentary('   Connecting to listing.bseindia.com...', 'detail');
      await sleep(1500);
      addCommentary('   Logging in as Compliance Officer...', 'detail');
      await sleep(1500);
      addCommentary('   Uploading BSE_Intimation_Asset_Cover.pdf...', 'detail');
      await sleep(2000);
      addCommentary('   ✓ BSE Submission Successful', 'success');
      addCommentary('   Submission ID: BSE/DEBT/2025/00892', 'data');
      await sleep(1000);

      // NSE Submission
      addCommentary('', 'spacer');
      addCommentary('[3/3] NSE NEAPS Portal', 'step');
      addCommentary('   Connecting to neaps.nseindia.com...', 'detail');
      await sleep(1500);
      addCommentary('   Authenticating...', 'detail');
      await sleep(1500);
      addCommentary('   Uploading NSE_Intimation_Asset_Cover.pdf...', 'detail');
      await sleep(2000);
      addCommentary('   ✓ NSE Submission Successful', 'success');
      addCommentary('   Reference No: NSE/DEBT/2025/01234', 'data');
      await sleep(1000);

      setSubmissionStatus({
        filingName: 'Half-Yearly Asset Cover Certificate',
        submittedAt: new Date().toLocaleString('en-IN'),
        submissions: [
          { regulator: 'SEBI', portal: 'SCORES', status: 'success', refNo: 'SEBI/DT/2025/001847', timestamp: '13-Jan-2025 14:32:15' },
          { regulator: 'BSE', portal: 'Listing Centre', status: 'success', refNo: 'BSE/DEBT/2025/00892', timestamp: '13-Jan-2025 14:33:42' },
          { regulator: 'NSE', portal: 'NEAPS', status: 'success', refNo: 'NSE/DEBT/2025/01234', timestamp: '13-Jan-2025 14:34:58' },
        ],
        dueDate: '15-Jan-2025',
        submittedDaysBefore: 2,
      });

      setStats(prev => ({...prev, submissions: 3}));
      addCommentary('', 'spacer');
      addCommentary('ALL SUBMISSIONS COMPLETE', 'success');
      addCommentary('Filing submitted 2 days before deadline ✓', 'success');
    }
    else if (id === 'archive-manager') {
      addCommentary('Archiving submitted filings...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('ARCHIVING PROCESS:', 'header');
      await sleep(1000);

      addCommentary('   Creating filing record...', 'step');
      await sleep(1000);
      addCommentary('   ✓ Filing ID: FIL-2025-00147 created', 'success');
      await sleep(800);

      addCommentary('   Storing documents...', 'step');
      await sleep(1000);
      addCommentary('   ✓ 3 documents stored in secure archive', 'success');
      await sleep(800);

      addCommentary('   Saving acknowledgments...', 'step');
      await sleep(1000);
      addCommentary('   ✓ 3 acknowledgment receipts saved', 'success');
      await sleep(800);

      addCommentary('   Updating compliance tracker...', 'step');
      await sleep(1000);
      addCommentary('   ✓ Deadline DL001 marked as completed', 'success');
      await sleep(800);

      addCommentary('   Generating audit trail...', 'step');
      await sleep(1000);
      addCommentary('   ✓ Complete audit trail recorded', 'success');
      await sleep(1500);

      const archived = [
        { id: 'FIL-2025-00147', filing: 'Asset Cover Certificate H2 FY25', date: '13-Jan-2025', status: 'submitted', regulators: 'SEBI, BSE, NSE' },
        { id: 'FIL-2025-00098', filing: 'Quarterly Results Q2 FY25', date: '15-Oct-2024', status: 'submitted', regulators: 'BSE, NSE' },
        { id: 'FIL-2025-00067', filing: 'Asset Cover Certificate H1 FY25', date: '15-Jul-2024', status: 'submitted', regulators: 'SEBI, BSE, NSE' },
        { id: 'FIL-2025-00045', filing: 'Annual Return FY24', date: '30-Jun-2024', status: 'submitted', regulators: 'SEBI' },
        { id: 'FIL-2025-00023', filing: 'Credit Rating Update', date: '15-Apr-2024', status: 'submitted', regulators: 'SEBI, BSE, NSE' },
      ];

      setArchivedFilings(archived);

      addCommentary('', 'spacer');
      addCommentary('FILING ARCHIVE:', 'header');
      for (const a of archived.slice(0, 3)) {
        addCommentary(`   ${a.id}: ${a.filing}`, 'data');
        addCommentary(`      Date: ${a.date} | ${a.regulators}`, 'detail');
        await sleep(500);
      }
      addCommentary('   ... and 2 more filings in archive', 'detail');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('COMPLIANCE STATISTICS (YTD):', 'header');
      addCommentary('   Total Filings: 47', 'data');
      addCommentary('   On-Time: 47 (100%)', 'success');
      addCommentary('   Overdue: 0', 'success');
      addCommentary('   Compliance Score: 100%', 'success');
    }
  };

  const resetDemo = () => {
    setIsRunning(false); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowInitial(true);
    setUpcomingDeadlines([]); setGeneratedForms([]); setValidationResults([]);
    setSubmissionStatus(null); setArchivedFilings([]);
    setStats({ deadlines: 0, forms: 0, validations: 0, submissions: 0 });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (ms) => {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), t = Math.floor((ms % 1000) / 100);
    return m + ':' + String(s).padStart(2,'0') + '.' + t;
  };

  const progress = completedAgents.length / SUB_AGENTS.length * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Agentic Trustee Services" className="h-14 w-auto" />
                <div><h1 className="text-lg font-bold text-gray-900">Regulatory Filing Agent</h1><p className="text-xs text-gray-500">Automated SEBI/Exchange compliance filings</p></div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center"><p className="text-xs text-gray-500">Elapsed</p><p className="text-xl font-mono font-bold text-axis-700">{formatTime(elapsed)}</p></div>
              <div className="text-center"><p className="text-xs text-gray-500">Progress</p><div className="flex items-center gap-2"><div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-axis-600 rounded-full transition-all" style={{width: progress+'%'}} /></div><span className="text-sm font-bold">{Math.round(progress)}%</span></div></div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-3"><span className="text-sm text-gray-600">{user?.name}</span><div className="w-9 h-9 gradient-axis rounded-full flex items-center justify-center text-white font-medium text-sm">{user?.avatar}</div></div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex h-[calc(100vh-65px)]">
        {/* Left Panel */}
        <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto flex flex-col">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Agent Pipeline</h3>
          <div className="space-y-2 flex-1">
            {SUB_AGENTS.map((agent, idx) => {
              const Icon = agent.icon, isCompleted = completedAgents.includes(agent.id), isActive = currentAgentIndex === idx;
              return (
                <div key={agent.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-axis-50 border-2 border-axis-200' : isCompleted ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-axis-100' : isCompleted ? 'bg-green-100' : 'bg-gray-200'}`}>
                    {isActive ? <Loader className="w-4 h-4 text-axis-600 animate-spin" /> : isCompleted ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Circle className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0"><p className={`text-xs font-medium truncate ${isActive ? 'text-axis-700' : isCompleted ? 'text-green-700' : 'text-gray-600'}`}>{agent.name.replace(' Agent','')}</p>{isActive && <p className="text-xs text-axis-500">Processing...</p>}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2">
            <button onClick={runDemo} disabled={isRunning} className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-axis text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50"><Play className="w-4 h-4" />{isRunning ? 'Running...' : 'Run Demo'}</button>
            <button onClick={resetDemo} disabled={isRunning} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50"><RotateCcw className="w-4 h-4" />Reset</button>
          </div>
        </div>

        {/* Center Panel */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Issuer Info Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-orange-600" /></div>
              <div><h3 className="font-semibold text-gray-900">{selectedIssuer.name}</h3><p className="text-sm text-gray-500">Regulatory Filings Dashboard</p></div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">{selectedIssuer.filings}</p><p className="text-xs text-gray-500">Total Filings</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-yellow-600">{selectedIssuer.pending}</p><p className="text-xs text-gray-500">Pending</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-red-600">{selectedIssuer.overdue}</p><p className="text-xs text-gray-500">Overdue</p></div>
            </div>
          </div>

          {/* Initial State */}
          {showInitial && !isRunning && !showResults && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-orange-600" />Select Issuer for Filing Management</h3>
                  <p className="text-sm text-gray-500 mt-1">Choose an issuer to process regulatory filings (~5 minutes)</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {DEMO_ISSUERS.map(issuer => (
                    <div key={issuer.id} onClick={() => setSelectedIssuer(issuer)} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedIssuer.id === issuer.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50"><Building2 className="w-5 h-5 text-orange-600" /></div>
                        <div><p className="font-medium text-gray-900">{issuer.name}</p><p className="text-sm text-gray-500">{issuer.filings} filings this year</p></div>
                      </div>
                      <div className="flex items-center gap-4">
                        {issuer.pending > 0 && <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">{issuer.pending} pending</span>}
                        {issuer.overdue > 0 && <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">{issuer.overdue} overdue</span>}
                        {selectedIssuer.id === issuer.id && <CheckCircle className="w-5 h-5 text-orange-600" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200"><p className="text-sm text-gray-600"><Info className="w-4 h-4 inline mr-1" />Click <strong>"Run Demo"</strong> to process regulatory filings.</p></div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><CalendarClock className="w-5 h-5 text-red-500" /><span className="text-sm text-gray-500">Urgent</span></div>
                  <p className="text-2xl font-bold text-red-600">1</p>
                  <p className="text-xs text-gray-500">Due in 3 days</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><Calendar className="w-5 h-5 text-yellow-500" /><span className="text-sm text-gray-500">This Week</span></div>
                  <p className="text-2xl font-bold text-yellow-600">2</p>
                  <p className="text-xs text-gray-500">Filings due</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><CalendarDays className="w-5 h-5 text-blue-500" /><span className="text-sm text-gray-500">This Month</span></div>
                  <p className="text-2xl font-bold text-blue-600">6</p>
                  <p className="text-xs text-gray-500">Total deadlines</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><BadgeCheck className="w-5 h-5 text-green-500" /><span className="text-sm text-gray-500">Compliance</span></div>
                  <p className="text-2xl font-bold text-green-600">100%</p>
                  <p className="text-xs text-gray-500">YTD Score</p>
                </div>
              </div>
            </div>
          )}

          {/* Deadlines Card (During Processing) */}
          {upcomingDeadlines.length > 0 && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CalendarClock className="w-5 h-5 text-orange-600" />Upcoming Deadlines</h3>
              <div className="space-y-3">
                {upcomingDeadlines.slice(0, 4).map((dl, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${dl.status === 'urgent' ? 'bg-red-50 border-red-200' : dl.status === 'upcoming' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{dl.filing}</p>
                        <p className="text-sm text-gray-500">{dl.regulator} | {dl.regulation}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{dl.dueDate}</p>
                        <p className={`text-sm ${dl.status === 'urgent' ? 'text-red-600' : dl.status === 'upcoming' ? 'text-yellow-600' : 'text-gray-500'}`}>{dl.daysLeft} days left</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Panel */}
          {showResults && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="flex gap-4">
                <button onClick={() => setShowDeadlinesModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <CalendarClock className="w-5 h-5 text-orange-600" /><span className="font-medium">View All Deadlines</span><span className="text-sm text-gray-500">({stats.deadlines})</span>
                </button>
                <button onClick={() => setShowArchiveModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <FileCheck className="w-5 h-5 text-green-600" /><span className="font-medium">Filing Archive</span><span className="text-sm text-gray-500">({archivedFilings.length})</span>
                </button>
              </div>

              {/* Submission Success Card */}
              {submissionStatus && (
                <div className="bg-green-50 rounded-xl border-2 border-green-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">Filing Submitted Successfully</h3>
                      <p className="text-green-700 mb-4">{submissionStatus.filingName}</p>
                      <div className="space-y-2">
                        {submissionStatus.submissions.map((sub, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <div>
                                <p className="font-medium text-gray-900">{sub.regulator} - {sub.portal}</p>
                                <p className="text-sm text-gray-500">{sub.timestamp}</p>
                              </div>
                            </div>
                            <span className="font-mono text-sm text-gray-600">{sub.refNo}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-green-100 rounded-lg">
                        <p className="text-sm text-green-800"><CheckCircle className="w-4 h-4 inline mr-1" />Submitted <strong>{submissionStatus.submittedDaysBefore} days before</strong> deadline ({submissionStatus.dueDate})</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"><Download className="w-4 h-4" />Download Receipts</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50"><Eye className="w-4 h-4" />View Submissions</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-green-700 font-medium rounded-lg hover:bg-green-50"><Send className="w-4 h-4" />Email Confirmation</button>
                  </div>
                </div>
              )}

              {/* Generated Forms */}
              {generatedForms.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Forms</h3>
                  <div className="space-y-3">
                    {generatedForms.map((form, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-orange-500" />
                          <div>
                            <p className="font-medium text-gray-900">{form.name}</p>
                            <p className="text-sm text-gray-500">{form.type} | {form.pages} pages | {form.fields} fields</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Generated</span>
                          <button className="p-2 hover:bg-gray-200 rounded-lg"><Download className="w-4 h-4 text-gray-600" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validation Results */}
              {validationResults.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Validation Results</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">9/10 Passed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {validationResults.map((v, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${v.status === 'pass' ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <div className="flex items-center gap-2">
                          {v.status === 'pass' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-yellow-500" />}
                          <span className="font-medium text-gray-900 text-sm">{v.check}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">{v.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[['Deadlines Tracked', stats.deadlines], ['Forms Generated', stats.forms], ['Validations Run', stats.validations], ['Submissions Made', stats.submissions]].map(([l,v]) => (
                    <div key={l} className="text-center p-4 bg-gray-50 rounded-lg"><p className="text-3xl font-bold text-gray-900">{v}</p><p className="text-sm text-gray-500">{l}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Commentary */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              {[['Deadlines', stats.deadlines], ['Forms', stats.forms], ['Validations', stats.validations], ['Submissions', stats.submissions]].map(([l,v]) => (
                <div key={l} className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-gray-900">{v}</p><p className="text-xs text-gray-500 uppercase">{l}</p></div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isRunning?'bg-green-500 animate-pulse':'bg-gray-400'}`} /><h3 className="text-sm font-semibold text-gray-700">LIVE COMMENTARY</h3></div></div>
            <div ref={commentaryRef} className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs bg-gray-900">
              {commentary.length === 0 ? <p className="text-gray-500 italic">Commentary appears when demo starts...</p> : commentary.map((c,i) => (
                <div key={i} className={`py-0.5 ${c.type==='header'?'text-yellow-400 font-bold':c.type==='divider'?'text-gray-600':c.type==='system'?'text-blue-400':c.type==='agent'?'text-purple-400':c.type==='step'?'text-cyan-400':c.type==='detail'?'text-gray-400':c.type==='data'?'text-green-300':c.type==='result'?'text-yellow-300 font-bold':c.type==='success'?'text-green-400':c.type==='error'?'text-red-400':c.type==='warning'?'text-orange-400':c.type==='complete'?'text-green-300 font-bold':c.type==='spacer'?'':'text-gray-300'}`}>{c.type!=='spacer'&&c.text}</div>
              ))}
              {isRunning && <div className="text-green-400">_</div>}
            </div>
          </div>
        </div>
      </main>

      {/* Deadlines Modal */}
      {showDeadlinesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Regulatory Deadlines</h2>
              <button onClick={() => setShowDeadlinesModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="space-y-3">
                {upcomingDeadlines.map((dl, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${dl.status === 'urgent' ? 'bg-red-50 border-red-200' : dl.status === 'upcoming' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {dl.status === 'urgent' && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">URGENT</span>}
                          {dl.status === 'upcoming' && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">UPCOMING</span>}
                          <span className="font-medium text-gray-900">{dl.filing}</span>
                        </div>
                        <p className="text-sm text-gray-500">{dl.regulator} | {dl.regulation} | ISIN: {dl.isin}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{dl.dueDate}</p>
                        <p className={`text-sm font-medium ${dl.status === 'urgent' ? 'text-red-600' : dl.status === 'upcoming' ? 'text-yellow-600' : 'text-gray-500'}`}>{dl.daysLeft} days left</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Filing Archive</h2>
              <button onClick={() => setShowArchiveModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr><th className="px-4 py-3 text-left">Filing ID</th><th className="px-4 py-3 text-left">Filing Name</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Regulators</th><th className="px-4 py-3 text-left">Status</th></tr>
                </thead>
                <tbody>
                  {archivedFilings.map((filing, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="px-4 py-3 font-mono text-xs">{filing.id}</td>
                      <td className="px-4 py-3 font-medium">{filing.filing}</td>
                      <td className="px-4 py-3">{filing.date}</td>
                      <td className="px-4 py-3 text-gray-500">{filing.regulators}</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Submitted</span></td>
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
