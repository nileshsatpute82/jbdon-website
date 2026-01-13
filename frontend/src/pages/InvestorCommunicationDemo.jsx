import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, ArrowLeft, Play, RotateCcw, CheckCircle, Circle, Loader,
  Mail, MessageSquare, Calculator, FileText, Send, Megaphone,
  X, Info, ChevronRight, Eye, Download, Phone, Clock, Search,
  AlertTriangle, CheckCircle2, User, Building, IndianRupee, Calendar,
  Filter, MailOpen, MailX, TrendingUp, PieChart, Tag, Reply
} from 'lucide-react';

const SUB_AGENTS = [
  { id: 'query-classifier', name: 'Query Classifier Agent', icon: Tag },
  { id: 'payout-calculator', name: 'Payout Calculator Agent', icon: Calculator },
  { id: 'certificate-generator', name: 'Certificate Generator Agent', icon: FileText },
  { id: 'response-composer', name: 'Response Composer Agent', icon: Reply },
  { id: 'broadcast-manager', name: 'Broadcast Manager Agent', icon: Megaphone },
  { id: 'grievance-tracker', name: 'Grievance Tracker Agent', icon: AlertTriangle },
];

const DEMO_QUERIES = [
  { id: 'Q001', from: 'Rajesh Sharma', email: 'rajesh.sharma@gmail.com', subject: 'Interest payment not received', category: 'payout', priority: 'high', date: '13-Jan-2025 09:15', status: 'new' },
  { id: 'Q002', from: 'Priya Investments Ltd', email: 'accounts@priyainv.com', subject: 'Request for TDS Certificate', category: 'certificate', priority: 'medium', date: '13-Jan-2025 08:45', status: 'new' },
  { id: 'Q003', from: 'Suresh Kumar', email: 'suresh.k@yahoo.com', subject: 'When is the next interest payment?', category: 'info', priority: 'low', date: '12-Jan-2025 16:30', status: 'new' },
  { id: 'Q004', from: 'ABC Mutual Fund', email: 'operations@abcmf.com', subject: 'Holding statement required for audit', category: 'certificate', priority: 'medium', date: '12-Jan-2025 14:20', status: 'new' },
  { id: 'Q005', from: 'Meera Patel', email: 'meera.p@hotmail.com', subject: 'Complaint: Wrong TDS deducted', category: 'grievance', priority: 'high', date: '12-Jan-2025 11:00', status: 'new' },
];

export default function InvestorCommunicationDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ queries: 0, payouts: 0, certificates: 0, broadcasts: 0 });
  const [showResults, setShowResults] = useState(false);
  const [showInitial, setShowInitial] = useState(true);
  const [classifiedQueries, setClassifiedQueries] = useState([]);
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);
  const [composedResponses, setComposedResponses] = useState([]);
  const [broadcastStatus, setBroadcastStatus] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  
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
    setClassifiedQueries([]); setPayoutDetails(null); setGeneratedCertificates([]);
    setComposedResponses([]); setBroadcastStatus(null); setGrievances([]);
    setStats({ queries: 0, payouts: 0, certificates: 0, broadcasts: 0 });

    timerRef.current = setInterval(() => setElapsed(prev => prev + 100), 100);

    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    addCommentary('INVESTOR COMMUNICATION AGENT - INITIALIZATION', 'header');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    await sleep(1500);
    addCommentary('NCD Issue: Tata Motors 8.75% NCD 2029', 'system');
    addCommentary('Total Investors: 12,450', 'system');
    addCommentary('Pending Queries: 5', 'system');
    addCommentary('Upcoming Interest Payment: 15-Mar-2025', 'system');
    await sleep(1500);
    addCommentary('Initializing 6 AI Sub-Agents for investor servicing...', 'system');
    await sleep(1500);

    for (let i = 0; i < SUB_AGENTS.length; i++) {
      setCurrentAgentIndex(i);
      addCommentary('', 'spacer');
      addCommentary('═══════════════════════════════════════════════════════════', 'divider');
      addCommentary('PHASE ' + (i+1) + '/6: ' + SUB_AGENTS[i].name.toUpperCase(), 'header');
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
    addCommentary('INVESTOR COMMUNICATION CYCLE COMPLETE', 'header');
    addCommentary('All queries processed and responses ready', 'complete');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
  };

  const simulateAgent = async (id) => {
    if (id === 'query-classifier') {
      addCommentary('Scanning incoming investor queries...', 'agent');
      await sleep(2000);
      addCommentary('Found 5 unprocessed queries in inbox', 'detail');
      await sleep(1500);
      
      addCommentary('', 'spacer');
      addCommentary('CLASSIFYING QUERIES:', 'header');
      await sleep(1000);

      const classified = [
        { ...DEMO_QUERIES[0], aiCategory: 'Payout Inquiry', aiPriority: 'HIGH', aiReason: 'Payment not received - requires immediate attention', routing: 'Payout Calculator' },
        { ...DEMO_QUERIES[1], aiCategory: 'Certificate Request', aiPriority: 'MEDIUM', aiReason: 'Standard TDS certificate request', routing: 'Certificate Generator' },
        { ...DEMO_QUERIES[2], aiCategory: 'Information Request', aiPriority: 'LOW', aiReason: 'General inquiry about payment schedule', routing: 'Response Composer' },
        { ...DEMO_QUERIES[3], aiCategory: 'Certificate Request', aiPriority: 'MEDIUM', aiReason: 'Holding statement for institutional investor', routing: 'Certificate Generator' },
        { ...DEMO_QUERIES[4], aiCategory: 'Grievance', aiPriority: 'HIGH', aiReason: 'TDS complaint - requires investigation', routing: 'Grievance Tracker' },
      ];

      for (const q of classified) {
        const icon = q.aiPriority === 'HIGH' ? '🔴' : q.aiPriority === 'MEDIUM' ? '🟡' : '🟢';
        const type = q.aiPriority === 'HIGH' ? 'error' : q.aiPriority === 'MEDIUM' ? 'warning' : 'data';
        addCommentary(`   ${icon} ${q.from}: "${q.subject}"`, type);
        addCommentary(`      Category: ${q.aiCategory} | Priority: ${q.aiPriority}`, 'detail');
        addCommentary(`      Routing to: ${q.routing}`, 'detail');
        setClassifiedQueries(prev => [...prev, q]);
        await sleep(800);
      }

      setStats(prev => ({...prev, queries: classified.length}));
      addCommentary('', 'spacer');
      addCommentary('CLASSIFICATION SUMMARY:', 'header');
      addCommentary('   Payout Inquiries: 1', 'data');
      addCommentary('   Certificate Requests: 2', 'data');
      addCommentary('   Information Requests: 1', 'data');
      addCommentary('   Grievances: 1', 'data');
      await sleep(1500);
    }
    else if (id === 'payout-calculator') {
      addCommentary('Processing payout inquiry from Rajesh Sharma...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('FETCHING INVESTOR DETAILS:', 'header');
      await sleep(1000);
      addCommentary('   Investor ID: INV-2024-08547', 'data');
      addCommentary('   PAN: AXXPS1234K', 'data');
      addCommentary('   Holding: 500 NCDs (Face Value: ₹10,00,000)', 'data');
      addCommentary('   Category: Individual - Resident', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('CALCULATING INTEREST PAYOUT:', 'header');
      await sleep(1000);

      addCommentary('   Interest Period: 15-Sep-2024 to 14-Mar-2025', 'step');
      addCommentary('   Days: 181 days', 'detail');
      await sleep(800);

      addCommentary('   Principal Amount: ₹10,00,000', 'step');
      addCommentary('   Coupon Rate: 8.75% p.a.', 'detail');
      await sleep(800);

      addCommentary('   Gross Interest = ₹10,00,000 × 8.75% × (181/365)', 'step');
      addCommentary('   Gross Interest = ₹43,390.41', 'data');
      await sleep(800);

      addCommentary('   TDS Rate: 10% (PAN available)', 'step');
      addCommentary('   TDS Amount = ₹4,339.04', 'warning');
      await sleep(800);

      addCommentary('   Net Payable = ₹43,390.41 - ₹4,339.04', 'step');
      addCommentary('   Net Payable = ₹39,051.37', 'success');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('PAYMENT STATUS CHECK:', 'header');
      addCommentary('   Payment Date: 15-Sep-2024', 'data');
      addCommentary('   Status: PAID via NECS', 'success');
      addCommentary('   UTR: HDFC0123456789', 'data');
      addCommentary('   Credit Date: 16-Sep-2024', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('ANALYSIS: Payment was credited successfully on 16-Sep-2024', 'success');
      addCommentary('Investor may need to check with their bank', 'detail');

      setPayoutDetails({
        investorId: 'INV-2024-08547',
        name: 'Rajesh Sharma',
        pan: 'AXXPS1234K',
        holding: { ncds: 500, faceValue: 1000000 },
        calculation: {
          period: '15-Sep-2024 to 14-Mar-2025',
          days: 181,
          principal: 1000000,
          rate: 8.75,
          grossInterest: 43390.41,
          tdsRate: 10,
          tdsAmount: 4339.04,
          netPayable: 39051.37,
        },
        payment: {
          date: '15-Sep-2024',
          status: 'PAID',
          mode: 'NECS',
          utr: 'HDFC0123456789',
          creditDate: '16-Sep-2024',
        }
      });

      setStats(prev => ({...prev, payouts: 1}));
    }
    else if (id === 'certificate-generator') {
      addCommentary('Processing certificate requests...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('[1/2] TDS CERTIFICATE - Priya Investments Ltd', 'header');
      await sleep(1000);

      addCommentary('   Fetching TDS records for FY 2024-25...', 'step');
      await sleep(1500);
      addCommentary('   Q1: ₹1,25,000 interest, ₹12,500 TDS', 'data');
      addCommentary('   Q2: ₹1,25,000 interest, ₹12,500 TDS', 'data');
      addCommentary('   Q3: ₹1,25,000 interest, ₹12,500 TDS', 'data');
      await sleep(1000);
      addCommentary('   Generating Form 16A...', 'step');
      await sleep(1500);
      addCommentary('   ✓ TDS_Certificate_PriyaInv_FY25.pdf generated', 'success');
      await sleep(1000);

      addCommentary('', 'spacer');
      addCommentary('[2/2] HOLDING STATEMENT - ABC Mutual Fund', 'header');
      await sleep(1000);

      addCommentary('   Fetching holding details...', 'step');
      await sleep(1500);
      addCommentary('   ISIN: INE155A07KL8', 'data');
      addCommentary('   Units: 25,000 NCDs', 'data');
      addCommentary('   Face Value: ₹25,00,00,000', 'data');
      addCommentary('   Acquisition Date: 15-Mar-2024', 'data');
      await sleep(1000);
      addCommentary('   Generating holding statement...', 'step');
      await sleep(1500);
      addCommentary('   ✓ Holding_Statement_ABCMF_Jan2025.pdf generated', 'success');
      await sleep(1000);

      setGeneratedCertificates([
        { id: 'CERT001', type: 'TDS Certificate (Form 16A)', investor: 'Priya Investments Ltd', filename: 'TDS_Certificate_PriyaInv_FY25.pdf', period: 'FY 2024-25', status: 'generated' },
        { id: 'CERT002', type: 'Holding Statement', investor: 'ABC Mutual Fund', filename: 'Holding_Statement_ABCMF_Jan2025.pdf', period: 'As on 13-Jan-2025', status: 'generated' },
      ]);

      setStats(prev => ({...prev, certificates: 2}));
      addCommentary('', 'spacer');
      addCommentary('2 certificates generated successfully', 'success');
    }
    else if (id === 'response-composer') {
      addCommentary('Composing responses for all classified queries...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('COMPOSING RESPONSES:', 'header');
      await sleep(1000);

      const responses = [
        {
          queryId: 'Q001',
          to: 'Rajesh Sharma',
          subject: 'RE: Interest payment not received',
          summary: 'Payment confirmation with UTR details and bank verification suggestion',
          attachments: ['Interest_Calculation_Sep2024.pdf'],
          tone: 'Empathetic & Helpful'
        },
        {
          queryId: 'Q002',
          to: 'Priya Investments Ltd',
          subject: 'RE: Request for TDS Certificate',
          summary: 'TDS certificate attached with year-wise breakup',
          attachments: ['TDS_Certificate_PriyaInv_FY25.pdf'],
          tone: 'Professional'
        },
        {
          queryId: 'Q003',
          to: 'Suresh Kumar',
          subject: 'RE: When is the next interest payment?',
          summary: 'Next payment date: 15-Mar-2025, expected credit: 16-17 Mar 2025',
          attachments: [],
          tone: 'Friendly & Informative'
        },
        {
          queryId: 'Q004',
          to: 'ABC Mutual Fund',
          subject: 'RE: Holding statement required for audit',
          summary: 'Holding statement as on date attached',
          attachments: ['Holding_Statement_ABCMF_Jan2025.pdf'],
          tone: 'Professional'
        },
      ];

      for (const resp of responses) {
        addCommentary(`   📧 To: ${resp.to}`, 'step');
        addCommentary(`      Subject: ${resp.subject}`, 'detail');
        addCommentary(`      Summary: ${resp.summary}`, 'data');
        if (resp.attachments.length > 0) {
          addCommentary(`      Attachments: ${resp.attachments.join(', ')}`, 'detail');
        }
        addCommentary(`      Tone: ${resp.tone}`, 'detail');
        setComposedResponses(prev => [...prev, resp]);
        await sleep(1000);
      }

      addCommentary('', 'spacer');
      addCommentary('4 responses composed and ready for review', 'success');
      addCommentary('Responses queued for approval before sending', 'detail');
    }
    else if (id === 'broadcast-manager') {
      addCommentary('Preparing broadcast for upcoming interest payment...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('BROADCAST CONFIGURATION:', 'header');
      await sleep(1000);

      addCommentary('   Event: Interest Payment Due', 'data');
      addCommentary('   Payment Date: 15-Mar-2025', 'data');
      addCommentary('   Record Date: 08-Mar-2025', 'data');
      addCommentary('   Coupon Rate: 8.75% p.a.', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('TARGET AUDIENCE:', 'header');
      addCommentary('   Total Investors: 12,450', 'data');
      addCommentary('   Email Available: 11,890 (95.5%)', 'data');
      addCommentary('   SMS Enabled: 10,234 (82.2%)', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('COMPOSING BROADCAST MESSAGE:', 'step');
      await sleep(2000);
      addCommentary('   ✓ Email template populated', 'success');
      addCommentary('   ✓ SMS template created (160 chars)', 'success');
      await sleep(1000);

      addCommentary('', 'spacer');
      addCommentary('SCHEDULING BROADCAST:', 'header');
      addCommentary('   T-7 Reminder: 08-Mar-2025 (Record Date)', 'data');
      addCommentary('   T-1 Reminder: 14-Mar-2025 (Day before payment)', 'data');
      addCommentary('   Payment Confirmation: 15-Mar-2025 (Post-payment)', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('SENDING TEST BROADCAST...', 'step');
      await sleep(2000);
      addCommentary('   ✓ Test email sent to compliance@tatamotors.com', 'success');
      addCommentary('   ✓ Test SMS sent to +91-98XXX-XXXXX', 'success');
      await sleep(1500);

      setBroadcastStatus({
        event: 'Interest Payment Due',
        paymentDate: '15-Mar-2025',
        recordDate: '08-Mar-2025',
        audience: {
          total: 12450,
          email: 11890,
          sms: 10234,
        },
        schedule: [
          { date: '08-Mar-2025', type: 'Record Date Reminder', status: 'scheduled' },
          { date: '14-Mar-2025', type: 'Payment Reminder', status: 'scheduled' },
          { date: '15-Mar-2025', type: 'Payment Confirmation', status: 'scheduled' },
        ],
        testStatus: 'completed',
      });

      setStats(prev => ({...prev, broadcasts: 3}));
      addCommentary('', 'spacer');
      addCommentary('Broadcast scheduled: 3 notifications over 8 days', 'success');
    }
    else if (id === 'grievance-tracker') {
      addCommentary('Processing grievance from Meera Patel...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('GRIEVANCE DETAILS:', 'header');
      await sleep(1000);
      addCommentary('   Complainant: Meera Patel', 'data');
      addCommentary('   Issue: Wrong TDS deducted', 'data');
      addCommentary('   Date Received: 12-Jan-2025', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('INVESTIGATING COMPLAINT:', 'header');
      await sleep(1000);

      addCommentary('   Fetching investor records...', 'step');
      await sleep(1500);
      addCommentary('   Investor ID: INV-2024-03892', 'data');
      addCommentary('   PAN: BXXPM5678L', 'data');
      addCommentary('   Category: Individual - Senior Citizen', 'detail');
      await sleep(1000);

      addCommentary('   Checking TDS rate applied...', 'step');
      await sleep(1500);
      addCommentary('   Applied Rate: 10%', 'data');
      addCommentary('   Correct Rate for Sr. Citizen: 10% (with Form 15H: NIL)', 'warning');
      await sleep(1000);

      addCommentary('   Checking Form 15H submission...', 'step');
      await sleep(1500);
      addCommentary('   ⚠️ Form 15H submitted on 01-Apr-2024', 'warning');
      addCommentary('   ⚠️ But NOT processed in system due to data entry error', 'error');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('ROOT CAUSE IDENTIFIED:', 'header');
      addCommentary('   Form 15H was submitted but not updated in RTA system', 'error');
      addCommentary('   TDS of ₹8,750 deducted incorrectly in Q1 & Q2', 'error');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('RESOLUTION ACTIONS:', 'header');
      addCommentary('   1. Update Form 15H status in RTA system', 'step');
      addCommentary('   2. Process TDS refund of ₹8,750', 'step');
      addCommentary('   3. Ensure NIL TDS for future payments', 'step');
      addCommentary('   4. Send apology letter with refund details', 'step');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('GRIEVANCE TICKET CREATED:', 'header');
      addCommentary('   Ticket ID: GRV-2025-00124', 'success');
      addCommentary('   Priority: HIGH', 'error');
      addCommentary('   SLA: 7 working days', 'data');
      addCommentary('   Assigned to: RTA Coordinator', 'data');
      addCommentary('   Escalation: Senior Manager (if not resolved in 5 days)', 'detail');
      await sleep(1500);

      setGrievances([
        {
          ticketId: 'GRV-2025-00124',
          complainant: 'Meera Patel',
          issue: 'Wrong TDS deducted - Form 15H not processed',
          rootCause: 'Data entry error in RTA system',
          resolution: 'TDS refund of ₹8,750 + system correction',
          priority: 'HIGH',
          sla: '7 working days',
          assignedTo: 'RTA Coordinator',
          status: 'In Progress',
          created: '13-Jan-2025',
        }
      ]);

      addCommentary('', 'spacer');
      addCommentary('Grievance logged and escalation path set', 'success');
    }
  };

  const resetDemo = () => {
    setIsRunning(false); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowInitial(true);
    setClassifiedQueries([]); setPayoutDetails(null); setGeneratedCertificates([]);
    setComposedResponses([]); setBroadcastStatus(null); setGrievances([]);
    setStats({ queries: 0, payouts: 0, certificates: 0, broadcasts: 0 });
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
                <div><h1 className="text-lg font-bold text-gray-900">Investor Communication Agent</h1><p className="text-xs text-gray-500">Query handling, payouts & notifications</p></div>
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
          {/* Issue Info Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-purple-600" /></div>
              <div><h3 className="font-semibold text-gray-900">Tata Motors 8.75% NCD 2029</h3><p className="text-sm text-gray-500">ISIN: INE155A07KL8</p></div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center"><p className="text-2xl font-bold text-gray-900">12,450</p><p className="text-xs text-gray-500">Investors</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-purple-600">5</p><p className="text-xs text-gray-500">Pending Queries</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-green-600">15-Mar</p><p className="text-xs text-gray-500">Next Payment</p></div>
            </div>
          </div>

          {/* Initial State */}
          {showInitial && !isRunning && !showResults && (
            <div className="space-y-6">
              {/* Inbox Preview */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Mail className="w-5 h-5 text-purple-600" />Investor Query Inbox</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">5 New</span>
                </div>
                <div className="divide-y divide-gray-100">
                  {DEMO_QUERIES.map(query => (
                    <div key={query.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${query.priority === 'high' ? 'bg-red-500' : query.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        <div>
                          <p className="font-medium text-gray-900">{query.from}</p>
                          <p className="text-sm text-gray-600">{query.subject}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{query.date}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${query.category === 'payout' ? 'bg-blue-100 text-blue-700' : query.category === 'certificate' ? 'bg-green-100 text-green-700' : query.category === 'grievance' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{query.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200"><p className="text-sm text-gray-600"><Info className="w-4 h-4 inline mr-1" />Click <strong>"Run Demo"</strong> to process all queries with AI.</p></div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><Mail className="w-5 h-5 text-purple-500" /><span className="text-sm text-gray-500">Today</span></div>
                  <p className="text-2xl font-bold text-purple-600">23</p>
                  <p className="text-xs text-gray-500">Queries Received</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><Clock className="w-5 h-5 text-yellow-500" /><span className="text-sm text-gray-500">Pending</span></div>
                  <p className="text-2xl font-bold text-yellow-600">5</p>
                  <p className="text-xs text-gray-500">Awaiting Response</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><CheckCircle2 className="w-5 h-5 text-green-500" /><span className="text-sm text-gray-500">Resolved</span></div>
                  <p className="text-2xl font-bold text-green-600">18</p>
                  <p className="text-xs text-gray-500">This Week</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-blue-500" /><span className="text-sm text-gray-500">Avg Response</span></div>
                  <p className="text-2xl font-bold text-blue-600">2.4h</p>
                  <p className="text-xs text-gray-500">Response Time</p>
                </div>
              </div>
            </div>
          )}

          {/* Classified Queries (During Processing) */}
          {classifiedQueries.length > 0 && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Tag className="w-5 h-5 text-purple-600" />Classified Queries</h3>
              <div className="space-y-3">
                {classifiedQueries.map((q, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border ${q.aiPriority === 'HIGH' ? 'bg-red-50 border-red-200' : q.aiPriority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{q.from}</p>
                        <p className="text-sm text-gray-600">{q.subject}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${q.aiPriority === 'HIGH' ? 'bg-red-100 text-red-700' : q.aiPriority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{q.aiPriority}</span>
                        <p className="text-xs text-gray-500 mt-1">{q.aiCategory}</p>
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
                <button onClick={() => setShowQueryModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <Mail className="w-5 h-5 text-purple-600" /><span className="font-medium">View Responses</span><span className="text-sm text-gray-500">({composedResponses.length})</span>
                </button>
                <button onClick={() => setShowBroadcastModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <Megaphone className="w-5 h-5 text-blue-600" /><span className="font-medium">Broadcast Schedule</span><span className="text-sm text-gray-500">({stats.broadcasts})</span>
                </button>
              </div>

              {/* Payout Calculation Card */}
              {payoutDetails && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calculator className="w-5 h-5 text-blue-600" />Payout Calculation - {payoutDetails.name}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Investor Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Investor ID:</span><span className="font-mono">{payoutDetails.investorId}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">PAN:</span><span className="font-mono">{payoutDetails.pan}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Holding:</span><span>{payoutDetails.holding.ncds} NCDs</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Face Value:</span><span>₹{(payoutDetails.holding.faceValue/100000).toFixed(2)} Lacs</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Interest Calculation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Period:</span><span>{payoutDetails.calculation.days} days</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Gross Interest:</span><span className="text-green-600">₹{payoutDetails.calculation.grossInterest.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">TDS ({payoutDetails.calculation.tdsRate}%):</span><span className="text-red-600">-₹{payoutDetails.calculation.tdsAmount.toLocaleString()}</span></div>
                        <div className="flex justify-between font-bold"><span>Net Payable:</span><span className="text-blue-600">₹{payoutDetails.calculation.netPayable.toLocaleString()}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800"><CheckCircle className="w-4 h-4 inline mr-1" />Payment Status: <strong>PAID</strong> on {payoutDetails.payment.creditDate} via {payoutDetails.payment.mode} (UTR: {payoutDetails.payment.utr})</p>
                  </div>
                </div>
              )}

              {/* Generated Certificates */}
              {generatedCertificates.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" />Generated Certificates</h3>
                  <div className="space-y-3">
                    {generatedCertificates.map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium text-gray-900">{cert.type}</p>
                            <p className="text-sm text-gray-500">{cert.investor} | {cert.period}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Ready</span>
                          <button className="p-2 hover:bg-gray-200 rounded-lg"><Download className="w-4 h-4 text-gray-600" /></button>
                          <button className="p-2 hover:bg-gray-200 rounded-lg"><Send className="w-4 h-4 text-gray-600" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grievance Card */}
              {grievances.length > 0 && (
                <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-red-800">Grievance Logged</h3>
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">HIGH PRIORITY</span>
                      </div>
                      {grievances.map((g, idx) => (
                        <div key={idx}>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="text-gray-600">Ticket ID:</span><span className="ml-2 font-mono font-bold">{g.ticketId}</span></div>
                            <div><span className="text-gray-600">Complainant:</span><span className="ml-2 font-medium">{g.complainant}</span></div>
                            <div><span className="text-gray-600">Issue:</span><span className="ml-2">{g.issue}</span></div>
                            <div><span className="text-gray-600">Resolution:</span><span className="ml-2">{g.resolution}</span></div>
                            <div><span className="text-gray-600">Assigned To:</span><span className="ml-2">{g.assignedTo}</span></div>
                            <div><span className="text-gray-600">SLA:</span><span className="ml-2">{g.sla}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-200 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"><Eye className="w-4 h-4" />View Details</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50"><Send className="w-4 h-4" />Escalate</button>
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[['Queries Processed', stats.queries], ['Payouts Calculated', stats.payouts], ['Certificates Generated', stats.certificates], ['Broadcasts Scheduled', stats.broadcasts]].map(([l,v]) => (
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
              {[['Queries', stats.queries], ['Payouts', stats.payouts], ['Certificates', stats.certificates], ['Broadcasts', stats.broadcasts]].map(([l,v]) => (
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

      {/* Responses Modal */}
      {showQueryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Composed Responses</h2>
              <button onClick={() => setShowQueryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4">
              {composedResponses.map((resp, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">{resp.to}</p>
                      <p className="text-sm text-gray-600">{resp.subject}</p>
                    </div>
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Ready to Send</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{resp.summary}</p>
                  {resp.attachments.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FileText className="w-4 h-4" />
                      <span>Attachments: {resp.attachments.join(', ')}</span>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex gap-2">
                    <button className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700"><Send className="w-3 h-3 inline mr-1" />Send</button>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"><Eye className="w-3 h-3 inline mr-1" />Preview</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && broadcastStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Broadcast Schedule</h2>
              <button onClick={() => setShowBroadcastModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">{broadcastStatus.event}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-600">Payment Date:</span><span className="ml-2 font-medium">{broadcastStatus.paymentDate}</span></div>
                  <div><span className="text-gray-600">Record Date:</span><span className="ml-2 font-medium">{broadcastStatus.recordDate}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Target Audience</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900">{broadcastStatus.audience.total.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Investors</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{broadcastStatus.audience.email.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Email Recipients</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{broadcastStatus.audience.sms.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">SMS Recipients</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Scheduled Notifications</h4>
                <div className="space-y-3">
                  {broadcastStatus.schedule.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">{s.type}</p>
                          <p className="text-sm text-gray-500">{s.date}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Scheduled</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
