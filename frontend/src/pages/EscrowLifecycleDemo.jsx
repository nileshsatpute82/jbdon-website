import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import { 
  Lock, ArrowLeft, Play, RotateCcw, CheckCircle, Circle, Loader,
  Building, FileText, DollarSign, ClipboardCheck, ShieldCheck, Archive,
  X, AlertTriangle, TrendingUp, TrendingDown, Calendar, Clock,
  Info, ChevronRight, Eye, Download, Send, CheckCircle2, XCircle,
  Banknote, PiggyBank, ArrowUpRight, ArrowDownRight, Landmark
} from 'lucide-react';

const SUB_AGENTS = [
  { id: 'account-monitor', name: 'Account Monitor Agent', icon: PiggyBank },
  { id: 'utilization-tracker', name: 'Utilization Tracker Agent', icon: TrendingUp },
  { id: 'condition-checker', name: 'Condition Checker Agent', icon: ClipboardCheck },
  { id: 'release-processor', name: 'Release Processor Agent', icon: Banknote },
  { id: 'compliance-auditor', name: 'Compliance Auditor Agent', icon: ShieldCheck },
  { id: 'closure-manager', name: 'Closure Manager Agent', icon: Archive },
];

const DEMO_ESCROWS = [
  { id: 'ESC001', name: 'Tata Motors NCD Escrow', issuer: 'Tata Motors Limited', balance: 2450.75, currency: 'Cr', status: 'active', openDate: '15-Mar-2024' },
  { id: 'ESC002', name: 'Reliance Industries Escrow', issuer: 'Reliance Industries', balance: 3820.50, currency: 'Cr', status: 'active', openDate: '20-Nov-2023' },
  { id: 'ESC003', name: 'Bajaj Finance Project Escrow', issuer: 'Bajaj Finance Ltd', balance: 1250.00, currency: 'Cr', status: 'active', openDate: '10-Jan-2024' },
  { id: 'ESC004', name: 'HDFC Realty Escrow', issuer: 'HDFC Ltd', balance: 0, currency: 'Cr', status: 'closed', openDate: '01-Apr-2022' },
];

export default function EscrowLifecycleDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ transactions: 0, conditions: 0, releases: 0, audits: 0 });
  const [showResults, setShowResults] = useState(false);
  const [showEscrowList, setShowEscrowList] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState(DEMO_ESCROWS[0]);
  const [accountData, setAccountData] = useState(null);
  const [utilizationData, setUtilizationData] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [releaseRequest, setReleaseRequest] = useState(null);
  const [auditFindings, setAuditFindings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  
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
    setElapsed(0); setShowResults(false); setShowEscrowList(false);
    setAccountData(null); setUtilizationData(null); setConditions([]);
    setReleaseRequest(null); setAuditFindings([]); setTransactions([]);
    setStats({ transactions: 0, conditions: 0, releases: 0, audits: 0 });

    timerRef.current = setInterval(() => setElapsed(prev => prev + 100), 100);

    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    addCommentary('ESCROW LIFECYCLE AGENT - INITIALIZATION', 'header');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    await sleep(1500);
    addCommentary('Selected Escrow: ' + selectedEscrow.name, 'system');
    addCommentary('Issuer: ' + selectedEscrow.issuer, 'system');
    addCommentary('Current Balance: ₹' + selectedEscrow.balance.toLocaleString() + ' ' + selectedEscrow.currency, 'system');
    addCommentary('Status: ' + selectedEscrow.status.toUpperCase(), 'system');
    await sleep(1500);
    addCommentary('Initializing 6 AI Sub-Agents for escrow monitoring...', 'system');
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
    addCommentary('ESCROW LIFECYCLE MONITORING COMPLETE', 'header');
    addCommentary('Release request ready for approval', 'complete');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
  };

  const simulateAgent = async (id) => {
    if (id === 'account-monitor') {
      addCommentary('Connecting to escrow bank account...', 'agent');
      await sleep(2000);
      addCommentary('Bank: HDFC Bank Ltd, Branch: Fort, Mumbai', 'detail');
      addCommentary('Account No: XXXX XXXX 4521', 'detail');
      await sleep(1500);
      
      addCommentary('', 'spacer');
      addCommentary('Fetching account statement (Last 30 days)...', 'agent');
      await sleep(2500);

      const txns = [
        { date: '10-Jan-2025', type: 'CR', desc: 'NCD Proceeds - Tranche 2', amount: 500.00, balance: 2450.75 },
        { date: '08-Jan-2025', type: 'DR', desc: 'Approved Release - Equipment Purchase', amount: 125.50, balance: 1950.75 },
        { date: '05-Jan-2025', type: 'CR', desc: 'Interest Credit', amount: 12.25, balance: 2076.25 },
        { date: '02-Jan-2025', type: 'DR', desc: 'Approved Release - Land Acquisition', amount: 350.00, balance: 2064.00 },
        { date: '28-Dec-2024', type: 'CR', desc: 'NCD Proceeds - Tranche 1', amount: 1500.00, balance: 2414.00 },
        { date: '20-Dec-2024', type: 'DR', desc: 'Approved Release - Working Capital', amount: 200.00, balance: 914.00 },
        { date: '15-Dec-2024', type: 'CR', desc: 'Initial Deposit', amount: 1114.00, balance: 1114.00 },
      ];

      addCommentary('RECENT TRANSACTIONS:', 'header');
      for (const txn of txns.slice(0, 5)) {
        const icon = txn.type === 'CR' ? '↑' : '↓';
        const color = txn.type === 'CR' ? 'success' : 'warning';
        addCommentary(`   ${txn.date} | ${icon} ₹${txn.amount} Cr | ${txn.desc}`, color);
        setTransactions(prev => [...prev, txn]);
        await sleep(600);
      }
      
      setAccountData({
        bank: 'HDFC Bank Ltd',
        branch: 'Fort, Mumbai',
        accountNo: 'XXXX XXXX 4521',
        openingBalance: 1114.00,
        totalCredits: 2012.25,
        totalDebits: 675.50,
        currentBalance: 2450.75,
        lastUpdated: new Date().toLocaleString('en-IN'),
      });

      setStats(prev => ({...prev, transactions: txns.length}));
      addCommentary('', 'spacer');
      addCommentary('Opening Balance: ₹1,114.00 Cr', 'data');
      addCommentary('Total Credits: ₹2,012.25 Cr (+)', 'success');
      addCommentary('Total Debits: ₹675.50 Cr (-)', 'warning');
      addCommentary('Current Balance: ₹2,450.75 Cr', 'result');
      await sleep(1500);
      addCommentary('Account reconciliation complete - Balance verified ✓', 'success');
    }
    else if (id === 'utilization-tracker') {
      addCommentary('Analyzing fund utilization against permitted uses...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('PERMITTED USES (From Trust Deed):', 'header');
      await sleep(1000);
      const permittedUses = [
        { category: 'Capital Expenditure', allocated: 1500, utilized: 475.50, pct: 31.7 },
        { category: 'Working Capital', allocated: 500, utilized: 200.00, pct: 40.0 },
        { category: 'Debt Refinancing', allocated: 800, utilized: 0, pct: 0 },
        { category: 'General Corporate', allocated: 200, utilized: 0, pct: 0 },
      ];

      for (const use of permittedUses) {
        addCommentary(`   ${use.category}:`, 'step');
        addCommentary(`      Allocated: ₹${use.allocated} Cr | Utilized: ₹${use.utilized} Cr (${use.pct}%)`, 'data');
        await sleep(800);
      }

      setUtilizationData({
        totalAllocated: 3000,
        totalUtilized: 675.50,
        utilizationPct: 22.5,
        categories: permittedUses,
        unusedFunds: 2324.50,
      });

      addCommentary('', 'spacer');
      addCommentary('UTILIZATION SUMMARY:', 'header');
      addCommentary('   Total Allocated: ₹3,000.00 Cr', 'data');
      addCommentary('   Total Utilized: ₹675.50 Cr (22.5%)', 'data');
      addCommentary('   Unused Funds: ₹2,324.50 Cr', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('COMPLIANCE CHECK:', 'step');
      addCommentary('   ✓ All releases within permitted categories', 'success');
      addCommentary('   ✓ No unauthorized utilization detected', 'success');
      addCommentary('   ✓ Supporting documents verified for all releases', 'success');
      await sleep(1500);
    }
    else if (id === 'condition-checker') {
      addCommentary('Loading release conditions from Trust Deed...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('PENDING RELEASE REQUEST:', 'header');
      addCommentary('   Request ID: REL-2025-0042', 'data');
      addCommentary('   Amount: ₹275.00 Cr', 'data');
      addCommentary('   Purpose: Equipment Purchase - Phase 2', 'data');
      addCommentary('   Category: Capital Expenditure', 'data');
      await sleep(2000);

      addCommentary('', 'spacer');
      addCommentary('CHECKING RELEASE CONDITIONS:', 'header');
      await sleep(1000);

      const conditionsList = [
        { id: 'C1', name: 'No Event of Default', status: 'met', detail: 'Verified - No defaults outstanding' },
        { id: 'C2', name: 'Compliance Certificate', status: 'met', detail: 'Received dated 05-Jan-2025' },
        { id: 'C3', name: 'Utilization within Permitted Use', status: 'met', detail: 'Capital Expenditure - Permitted' },
        { id: 'C4', name: 'Supporting Invoice/PO', status: 'met', detail: 'PO #TML-2025-1847 verified' },
        { id: 'C5', name: 'Board Resolution', status: 'met', detail: 'BR dated 02-Jan-2025 on file' },
        { id: 'C6', name: 'Security Cover Maintained', status: 'met', detail: 'Current cover: 1.45x (Req: 1.25x)' },
        { id: 'C7', name: 'Covenant Compliance', status: 'pending', detail: 'Awaiting Q3 financials verification' },
        { id: 'C8', name: 'No Material Adverse Change', status: 'met', detail: 'MAC certificate on file' },
      ];

      for (const cond of conditionsList) {
        const icon = cond.status === 'met' ? '✓' : '⏳';
        const type = cond.status === 'met' ? 'success' : 'warning';
        addCommentary(`   ${icon} ${cond.name}`, type);
        addCommentary(`      ${cond.detail}`, 'detail');
        setConditions(prev => [...prev, cond]);
        await sleep(700);
      }

      setStats(prev => ({...prev, conditions: conditionsList.length}));
      addCommentary('', 'spacer');
      addCommentary('CONDITIONS STATUS: 7/8 Met, 1 Pending', 'warning');
      await sleep(1500);
    }
    else if (id === 'release-processor') {
      addCommentary('Processing release request REL-2025-0042...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('RELEASE ELIGIBILITY CHECK:', 'header');
      await sleep(1000);

      addCommentary('   Checking available balance...', 'step');
      await sleep(1000);
      addCommentary('      Available: ₹2,450.75 Cr | Requested: ₹275.00 Cr ✓', 'success');
      await sleep(800);

      addCommentary('   Checking category headroom...', 'step');
      await sleep(1000);
      addCommentary('      CapEx Limit: ₹1,500 Cr | Used: ₹475.50 Cr | Headroom: ₹1,024.50 Cr ✓', 'success');
      await sleep(800);

      addCommentary('   Checking approval hierarchy...', 'step');
      await sleep(1000);
      addCommentary('      Amount ₹275 Cr requires: Manager + Senior Manager approval', 'data');
      await sleep(800);

      addCommentary('', 'spacer');
      addCommentary('RECOMMENDATION:', 'header');
      addCommentary('   ┌─────────────────────────────────────────────┐', 'result');
      addCommentary('   │  CONDITIONAL APPROVAL RECOMMENDED           │', 'result');
      addCommentary('   │  Pending: Covenant compliance verification  │', 'result');
      addCommentary('   └─────────────────────────────────────────────┘', 'result');
      await sleep(2000);

      setReleaseRequest({
        id: 'REL-2025-0042',
        amount: 275.00,
        purpose: 'Equipment Purchase - Phase 2',
        category: 'Capital Expenditure',
        requestDate: '10-Jan-2025',
        requestedBy: 'Tata Motors Finance Team',
        status: 'conditional',
        conditionsMet: 7,
        conditionsTotal: 8,
        pendingCondition: 'Covenant compliance verification',
        recommendation: 'Conditional Approval - Release upon covenant verification',
        approvalLevel: 'Manager + Senior Manager',
        postReleaseBalance: 2175.75,
      });

      addCommentary('', 'spacer');
      addCommentary('Post-release balance: ₹2,175.75 Cr', 'data');
      addCommentary('Release instruction draft prepared', 'success');
      setStats(prev => ({...prev, releases: prev.releases + 1}));
    }
    else if (id === 'compliance-auditor') {
      addCommentary('Running compliance audit on all escrow transactions...', 'agent');
      await sleep(2500);
      
      addCommentary('', 'spacer');
      addCommentary('AUDIT CHECKS:', 'header');
      await sleep(1000);

      const auditChecks = [
        { check: 'Authorization Verification', status: 'pass', detail: 'All 7 releases properly authorized' },
        { check: 'Supporting Document Check', status: 'pass', detail: 'All invoices/POs on file' },
        { check: 'Permitted Use Compliance', status: 'pass', detail: 'All releases within Trust Deed terms' },
        { check: 'Segregation of Duties', status: 'pass', detail: 'Maker-checker process followed' },
        { check: 'Timely Reporting', status: 'pass', detail: 'All quarterly reports filed on time' },
        { check: 'Interest Reconciliation', status: 'pass', detail: 'Interest credits match bank rate' },
        { check: 'Unutilized Funds Parking', status: 'observation', detail: 'Consider higher-yield permitted investment' },
      ];

      for (const audit of auditChecks) {
        const icon = audit.status === 'pass' ? '✓' : '⚠️';
        const type = audit.status === 'pass' ? 'success' : 'warning';
        addCommentary(`   ${icon} ${audit.check}`, type);
        addCommentary(`      ${audit.detail}`, 'detail');
        setAuditFindings(prev => [...prev, audit]);
        await sleep(700);
      }

      setStats(prev => ({...prev, audits: auditChecks.length}));
      addCommentary('', 'spacer');
      addCommentary('AUDIT SCORE: 98/100 - EXCELLENT', 'success');
      addCommentary('1 observation noted (non-critical)', 'warning');
      await sleep(1500);
    }
    else if (id === 'closure-manager') {
      addCommentary('Checking escrow closure eligibility...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('CLOSURE CHECKLIST:', 'header');
      await sleep(1000);

      const closureChecks = [
        { item: 'All NCD Obligations Discharged', status: 'pending', detail: 'NCDs mature on 15-Mar-2029' },
        { item: 'No Pending Release Requests', status: 'pending', detail: '1 request pending approval' },
        { item: 'All Conditions Satisfied', status: 'pending', detail: 'Ongoing monitoring required' },
        { item: 'Final Reconciliation Complete', status: 'na', detail: 'N/A - Account active' },
        { item: 'Investor NOC Obtained', status: 'na', detail: 'N/A - Account active' },
        { item: 'Trustee Sign-off', status: 'na', detail: 'N/A - Account active' },
      ];

      for (const check of closureChecks) {
        const icon = check.status === 'complete' ? '✓' : check.status === 'pending' ? '⏳' : '○';
        const type = check.status === 'complete' ? 'success' : check.status === 'pending' ? 'warning' : 'detail';
        addCommentary(`   ${icon} ${check.item}`, type);
        addCommentary(`      ${check.detail}`, 'detail');
        await sleep(600);
      }

      addCommentary('', 'spacer');
      addCommentary('CLOSURE STATUS:', 'header');
      addCommentary('   ┌─────────────────────────────────────────────┐', 'data');
      addCommentary('   │  ESCROW ACTIVE - CLOSURE NOT APPLICABLE     │', 'data');
      addCommentary('   │  Maturity Date: 15-Mar-2029                 │', 'data');
      addCommentary('   │  Days to Maturity: 1,521 days               │', 'data');
      addCommentary('   └─────────────────────────────────────────────┘', 'data');
      await sleep(2000);

      addCommentary('', 'spacer');
      addCommentary('Escrow lifecycle monitoring complete', 'success');
      addCommentary('Next review scheduled: 15-Apr-2025', 'detail');
    }
  };

  const resetDemo = () => {
    setIsRunning(false); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowEscrowList(true);
    setAccountData(null); setUtilizationData(null); setConditions([]);
    setReleaseRequest(null); setAuditFindings([]); setTransactions([]);
    setStats({ transactions: 0, conditions: 0, releases: 0, audits: 0 });
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
                <div><h1 className="text-lg font-bold text-gray-900">Escrow Lifecycle Agent</h1><p className="text-xs text-gray-500">End-to-end escrow monitoring & releases</p></div>
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
          {/* Escrow Info Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center"><Landmark className="w-6 h-6 text-emerald-600" /></div>
              <div><h3 className="font-semibold text-gray-900">{selectedEscrow.name}</h3><p className="text-sm text-gray-500">{selectedEscrow.issuer}</p></div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div><span className="text-gray-500">Balance:</span><span className="ml-2 font-bold text-emerald-600">₹{selectedEscrow.balance.toLocaleString()} {selectedEscrow.currency}</span></div>
              <div><span className="text-gray-500">Opened:</span><span className="ml-2 font-medium">{selectedEscrow.openDate}</span></div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedEscrow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{selectedEscrow.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Escrow List - Initial State */}
          {showEscrowList && !isRunning && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Landmark className="w-5 h-5 text-emerald-600" />Select Escrow Account for Monitoring</h3>
                <p className="text-sm text-gray-500 mt-1">Choose an escrow account to analyze with AI (~5 minutes)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {DEMO_ESCROWS.map(escrow => (
                  <div key={escrow.id} onClick={() => escrow.status === 'active' && setSelectedEscrow(escrow)} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedEscrow.id === escrow.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : ''} ${escrow.status === 'closed' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${escrow.status === 'active' ? 'bg-emerald-50' : 'bg-gray-100'}`}><Landmark className={`w-5 h-5 ${escrow.status === 'active' ? 'text-emerald-600' : 'text-gray-400'}`} /></div>
                      <div><p className="font-medium text-gray-900">{escrow.name}</p><p className="text-sm text-gray-500">{escrow.issuer}</p></div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="font-medium text-emerald-600">₹{escrow.balance.toLocaleString()} Cr</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${escrow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{escrow.status}</span>
                      {selectedEscrow.id === escrow.id && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200"><p className="text-sm text-gray-600"><Info className="w-4 h-4 inline mr-1" />Click <strong>"Run Demo"</strong> to start escrow monitoring.</p></div>
            </div>
          )}

          {/* Account Data Card (During Processing) */}
          {accountData && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><PiggyBank className="w-5 h-5 text-emerald-600" />Account Summary</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Opening Balance</p><p className="text-xl font-bold text-gray-900">₹{accountData.openingBalance.toLocaleString()} Cr</p></div>
                <div className="bg-green-50 rounded-lg p-4"><p className="text-xs text-gray-500">Total Credits</p><p className="text-xl font-bold text-green-600">+₹{accountData.totalCredits.toLocaleString()} Cr</p></div>
                <div className="bg-red-50 rounded-lg p-4"><p className="text-xs text-gray-500">Total Debits</p><p className="text-xl font-bold text-red-600">-₹{accountData.totalDebits.toLocaleString()} Cr</p></div>
                <div className="bg-emerald-50 rounded-lg p-4"><p className="text-xs text-gray-500">Current Balance</p><p className="text-xl font-bold text-emerald-600">₹{accountData.currentBalance.toLocaleString()} Cr</p></div>
              </div>
            </div>
          )}

          {/* Results Panel */}
          {showResults && (
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="flex gap-4">
                <button onClick={() => setShowTransactionsModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <DollarSign className="w-5 h-5 text-emerald-600" /><span className="font-medium">View Transactions</span><span className="text-sm text-gray-500">({stats.transactions})</span>
                </button>
                <button onClick={() => setShowConditionsModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" /><span className="font-medium">View Conditions</span><span className="text-sm text-gray-500">({conditions.length})</span>
                </button>
              </div>

              {/* Account Summary */}
              {accountData && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-xs text-gray-500">Opening Balance</p><p className="text-xl font-bold text-gray-900">₹{accountData.openingBalance.toLocaleString()} Cr</p></div>
                    <div className="bg-green-50 rounded-lg p-4"><p className="text-xs text-gray-500">Total Credits</p><p className="text-xl font-bold text-green-600">+₹{accountData.totalCredits.toLocaleString()} Cr</p></div>
                    <div className="bg-red-50 rounded-lg p-4"><p className="text-xs text-gray-500">Total Debits</p><p className="text-xl font-bold text-red-600">-₹{accountData.totalDebits.toLocaleString()} Cr</p></div>
                    <div className="bg-emerald-50 rounded-lg p-4"><p className="text-xs text-gray-500">Current Balance</p><p className="text-xl font-bold text-emerald-600">₹{accountData.currentBalance.toLocaleString()} Cr</p></div>
                  </div>
                </div>
              )}

              {/* Utilization Chart */}
              {utilizationData && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Utilization</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Overall Utilization</span>
                      <span className="font-medium">{utilizationData.utilizationPct}%</span>
                    </div>
                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{width: utilizationData.utilizationPct + '%'}} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {utilizationData.categories.map((cat, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{cat.category}</span>
                          <span className="text-sm text-gray-500">{cat.pct}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-emerald-400 rounded-full" style={{width: cat.pct + '%'}} />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Utilized: ₹{cat.utilized} Cr</span>
                          <span>Allocated: ₹{cat.allocated} Cr</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Release Request */}
              {releaseRequest && (
                <div className={`rounded-xl border-2 p-6 ${releaseRequest.status === 'conditional' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${releaseRequest.status === 'conditional' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                      <Banknote className={`w-6 h-6 ${releaseRequest.status === 'conditional' ? 'text-yellow-600' : 'text-green-600'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Release Request: {releaseRequest.id}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${releaseRequest.status === 'conditional' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {releaseRequest.status === 'conditional' ? 'CONDITIONAL APPROVAL' : 'APPROVED'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Amount:</span><span className="ml-2 font-bold text-gray-900">₹{releaseRequest.amount} Cr</span></div>
                        <div><span className="text-gray-500">Purpose:</span><span className="ml-2 font-medium">{releaseRequest.purpose}</span></div>
                        <div><span className="text-gray-500">Category:</span><span className="ml-2">{releaseRequest.category}</span></div>
                        <div><span className="text-gray-500">Conditions:</span><span className="ml-2">{releaseRequest.conditionsMet}/{releaseRequest.conditionsTotal} met</span></div>
                        <div><span className="text-gray-500">Approval Level:</span><span className="ml-2">{releaseRequest.approvalLevel}</span></div>
                        <div><span className="text-gray-500">Post-Release Balance:</span><span className="ml-2 font-medium">₹{releaseRequest.postReleaseBalance} Cr</span></div>
                      </div>
                      {releaseRequest.pendingCondition && (
                        <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                          <p className="text-sm text-yellow-800"><AlertTriangle className="w-4 h-4 inline mr-1" /><strong>Pending:</strong> {releaseRequest.pendingCondition}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-200 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700"><CheckCircle2 className="w-4 h-4" />Approve Release</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"><XCircle className="w-4 h-4" />Reject</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"><Eye className="w-4 h-4" />View Details</button>
                  </div>
                </div>
              )}

              {/* Audit Summary */}
              {auditFindings.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Compliance Audit Results</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Score: 98/100</span>
                  </div>
                  <div className="space-y-3">
                    {auditFindings.map((finding, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {finding.status === 'pass' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                          <div>
                            <p className="font-medium text-gray-900">{finding.check}</p>
                            <p className="text-sm text-gray-500">{finding.detail}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${finding.status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {finding.status === 'pass' ? 'PASS' : 'OBSERVATION'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[['Transactions', stats.transactions], ['Conditions', stats.conditions], ['Releases', stats.releases], ['Audit Checks', stats.audits]].map(([l,v]) => (
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
              {[['Transactions', stats.transactions], ['Conditions', stats.conditions], ['Releases', stats.releases], ['Audits', stats.audits]].map(([l,v]) => (
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

      {/* Transactions Modal */}
      {showTransactionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Escrow Transactions</h2>
              <button onClick={() => setShowTransactionsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Description</th><th className="px-4 py-3 text-right">Credit</th><th className="px-4 py-3 text-right">Debit</th><th className="px-4 py-3 text-right">Balance</th></tr>
                </thead>
                <tbody>
                  {transactions.map((txn, idx) => (
                    <tr key={idx} className="border-t border-gray-200">
                      <td className="px-4 py-3 font-mono">{txn.date}</td>
                      <td className="px-4 py-3">{txn.desc}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">{txn.type === 'CR' ? '₹' + txn.amount + ' Cr' : '-'}</td>
                      <td className="px-4 py-3 text-right text-red-600 font-medium">{txn.type === 'DR' ? '₹' + txn.amount + ' Cr' : '-'}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{txn.balance} Cr</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Conditions Modal */}
      {showConditionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Release Conditions</h2>
              <button onClick={() => setShowConditionsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-3">
              {conditions.map((cond, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${cond.status === 'met' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {cond.status === 'met' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-yellow-500" />}
                      <div>
                        <p className="font-medium text-gray-900">{cond.name}</p>
                        <p className="text-sm text-gray-600">{cond.detail}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${cond.status === 'met' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {cond.status === 'met' ? 'MET' : 'PENDING'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
