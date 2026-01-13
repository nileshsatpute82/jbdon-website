import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import { FileCheck, ArrowLeft, Play, RotateCcw, CheckCircle, Circle, Loader, AlertTriangle, FileText, Calculator, Scale, Search, Tag, Bell, Download, Send, Building, File, FileSpreadsheet, Eye, Info } from 'lucide-react';

const SUB_AGENTS = [
  { id: 'document-ingestion', name: 'Document Ingestion Agent', icon: FileText },
  { id: 'data-validation', name: 'Data Validation Agent', icon: CheckCircle },
  { id: 'ratio-calculation', name: 'Ratio Calculation Agent', icon: Calculator },
  { id: 'covenant-comparison', name: 'Covenant Comparison Agent', icon: Scale },
  { id: 'breach-detection', name: 'Breach Detection Agent', icon: Search },
  { id: 'severity-classification', name: 'Severity Classification Agent', icon: Tag },
  { id: 'notice-generation', name: 'Notice Generation Agent', icon: Bell },
];

const DEMO_DOCUMENTS = [
  { id: 'DOC001', name: 'Q3_FY25_Quarterly_Results.pdf', type: 'Financial Statement', size: '2.4 MB', pages: 28, status: 'pending' },
  { id: 'DOC002', name: 'Trust_Deed_TML_NCD_2024.pdf', type: 'Trust Deed', size: '4.1 MB', pages: 85, status: 'pending' },
  { id: 'DOC003', name: 'Compliance_Certificate_Q2.pdf', type: 'Compliance Certificate', size: '156 KB', pages: 2, status: 'pending' },
  { id: 'DOC004', name: 'Security_Valuation_Report.xlsx', type: 'Valuation Report', size: '1.2 MB', pages: 12, status: 'pending' },
  { id: 'DOC005', name: 'Board_Resolution_Covenants.pdf', type: 'Board Resolution', size: '340 KB', pages: 4, status: 'pending' },
];

export default function CovenantMonitoringDemo() {
  const [demoData, setDemoData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ documents: 0, apiCalls: 0, validations: 0, dataPoints: 0, calculations: 0 });
  const [showResults, setShowResults] = useState(false);
  const [showDocumentList, setShowDocumentList] = useState(true);
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [calculatedRatios, setCalculatedRatios] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [currentCalculation, setCurrentCalculation] = useState(null);
  const [breachDetails, setBreachDetails] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const commentaryRef = useRef(null);

  useEffect(() => {
    loadDemoData();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (commentaryRef.current) commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
  }, [commentary]);

  const loadDemoData = async () => {
    try {
      const response = await fetch(API_URL + '/api/demo/covenant-monitoring/data');
      setDemoData(await response.json());
    } catch (error) { console.error('Failed to load demo data:', error); }
  };

  const addCommentary = (text, type = 'info') => setCommentary(prev => [...prev, { text, type }]);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const updateDocStatus = (id, status) => setDocuments(prev => prev.map(d => d.id === id ? {...d, status} : d));

  const runDemo = async () => {
    setIsRunning(true); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowDocumentList(false);
    setCalculatedRatios([]); setComparisonResults([]); setCurrentCalculation(null); setBreachDetails(null);
    setStats({ documents: 0, apiCalls: 0, validations: 0, dataPoints: 0, calculations: 0 });
    setDocuments(DEMO_DOCUMENTS.map(d => ({...d, status: 'pending'})));

    timerRef.current = setInterval(() => setElapsed(prev => prev + 100), 100);

    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    addCommentary('COVENANT MONITORING AGENT - INITIALIZATION', 'header');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    await sleep(1500);
    addCommentary('Issuer: ' + demoData?.issuer?.name, 'system');
    addCommentary('CIN: ' + demoData?.issuer?.cin, 'system');
    addCommentary('NCD Series: ' + demoData?.issue?.series_name, 'system');
    addCommentary('ISIN: ' + demoData?.issue?.isin, 'system');
    addCommentary('Issue Size: ₹' + demoData?.issue?.issue_size + ' Crores', 'system');
    await sleep(2000);
    addCommentary('Starting 7 AI Sub-Agents for covenant analysis...', 'system');
    await sleep(1500);

    for (let i = 0; i < SUB_AGENTS.length; i++) {
      setCurrentAgentIndex(i);
      addCommentary('', 'spacer');
      addCommentary('═══════════════════════════════════════════════════════════', 'divider');
      addCommentary('PHASE ' + (i+1) + '/7: ' + SUB_AGENTS[i].name.toUpperCase(), 'header');
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
    addCommentary('ALL PROCESSING COMPLETE - BREACH DETECTED', 'header');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
  };

  const simulateAgent = async (id) => {
    if (id === 'document-ingestion') {
      for (const doc of DEMO_DOCUMENTS) {
        updateDocStatus(doc.id, 'processing');
        addCommentary('📄 Processing: ' + doc.name, 'step');
        addCommentary('   Type: ' + doc.type + ' | Size: ' + doc.size + ' | Pages: ' + doc.pages, 'detail');
        await sleep(2500);
        if (doc.type === 'Financial Statement') {
          addCommentary('   Performing OCR and AI text extraction...', 'detail'); await sleep(2000);
          addCommentary('   Located Balance Sheet on pages 12-14', 'detail'); await sleep(1200);
          addCommentary('   Located Profit & Loss on pages 15-17', 'detail'); await sleep(1200);
          addCommentary('   Located Cash Flow Statement on pages 18-20', 'detail'); await sleep(1200);
          setStats(prev => ({...prev, documents: prev.documents+1, dataPoints: prev.dataPoints+45}));
        } else if (doc.type === 'Trust Deed') {
          addCommentary('   Extracting covenant definitions from Section 8...', 'detail'); await sleep(2000);
          addCommentary('   Found 6 financial covenants with thresholds', 'detail'); await sleep(1500);
          setStats(prev => ({...prev, documents: prev.documents+1, dataPoints: prev.dataPoints+18}));
        } else {
          addCommentary('   Document parsed successfully', 'detail'); await sleep(1500);
          setStats(prev => ({...prev, documents: prev.documents+1, dataPoints: prev.dataPoints+5}));
        }
        updateDocStatus(doc.id, 'completed');
        addCommentary('   ✓ ' + doc.name + ' processed', 'success'); await sleep(800);
      }
      addCommentary('', 'spacer');
      addCommentary('EXTRACTED FINANCIAL DATA:', 'header');
      const items = [
        ['Total Assets', '₹1,24,560 Cr'], ['Total Liabilities', '₹89,440 Cr'], ['Shareholders Equity', '₹35,120 Cr'],
        ['Total Debt', '₹48,230 Cr'], ['Current Assets', '₹42,100 Cr'], ['Current Liabilities', '₹38,200 Cr'],
        ['EBITDA', '₹8,450 Cr'], ['Interest Expense', '₹2,340 Cr'], ['PAT', '₹3,120 Cr'],
        ['Security Value', '₹62,500 Cr'], ['Principal Repayment', '₹4,500 Cr']
      ];
      for (const [k,v] of items) { addCommentary('   ' + k + ': ' + v, 'data'); await sleep(600); }
      setStats(prev => ({...prev, apiCalls: prev.apiCalls+3}));
    }
    else if (id === 'data-validation') {
      const validations = [
        ['Balance Sheet Equation', 'Total Assets = Liabilities + Equity', '₹1,24,560 = ₹89,440 + ₹35,120 ✓'],
        ['Debt Reconciliation', 'Total Debt = LT + ST Borrowings', '₹48,230 = ₹32,150 + ₹16,080 ✓'],
        ['P&L Flow Check', 'Revenue → EBITDA → PAT flow', 'All values reconciled ✓'],
        ['QoQ Variance', 'Comparing with Q2 FY25', 'No anomalies detected ✓'],
        ['Currency Consistency', 'All values in INR Crores', 'Verified ✓']
      ];
      for (const [name, desc, result] of validations) {
        addCommentary('VALIDATION: ' + name, 'step'); await sleep(1500);
        addCommentary('   Check: ' + desc, 'detail'); await sleep(1500);
        addCommentary('   Result: ' + result, 'success'); await sleep(1200);
        setStats(prev => ({...prev, validations: prev.validations+1}));
      }
      addCommentary('', 'spacer');
      addCommentary('Data Quality Score: 98/100 - VALIDATED', 'success');
      setStats(prev => ({...prev, apiCalls: prev.apiCalls+1}));
    }
    else if (id === 'ratio-calculation') {
      const ratios = [
        { name: 'Debt to Equity Ratio', formula: 'Total Debt ÷ Equity', calc: '48,230 ÷ 35,120', result: 1.37, unit: 'ratio', threshold: 2.0 },
        { name: 'Interest Coverage Ratio', formula: 'EBITDA ÷ Interest', calc: '8,450 ÷ 2,340', result: 3.61, unit: 'times', threshold: 1.5 },
        { name: 'Current Ratio', formula: 'Current Assets ÷ Current Liab', calc: '42,100 ÷ 38,200', result: 1.10, unit: 'ratio', threshold: 1.2 },
        { name: 'DSCR', formula: '(PAT+Dep+Int) ÷ (Int+Principal)', calc: '9,580 ÷ 6,840', result: 1.40, unit: 'times', threshold: 1.25 },
        { name: 'Asset Coverage', formula: 'Security Value ÷ Debt', calc: '62,500 ÷ 48,230', result: 1.30, unit: 'times', threshold: 1.25 },
        { name: 'Minimum Net Worth', formula: 'Shareholders Equity', calc: 'Direct Value', result: 35120, unit: '₹ Cr', threshold: 5000 }
      ];
      for (const r of ratios) {
        setCurrentCalculation(r);
        addCommentary('CALCULATING: ' + r.name, 'step'); await sleep(1500);
        addCommentary('   Formula: ' + r.formula, 'detail'); await sleep(1200);
        addCommentary('   Calculation: ' + r.calc, 'detail'); await sleep(1200);
        const disp = r.unit === '₹ Cr' ? '₹' + r.result.toLocaleString() + ' Cr' : r.result + ' ' + r.unit;
        addCommentary('   ══ RESULT: ' + disp + ' ══', 'result'); await sleep(1500);
        setCalculatedRatios(prev => [...prev, {...r, display: disp}]);
        setStats(prev => ({...prev, calculations: prev.calculations+1}));
        await sleep(800);
      }
      setCurrentCalculation(null);
      setStats(prev => ({...prev, apiCalls: prev.apiCalls+2}));
    }
    else if (id === 'covenant-comparison') {
      addCommentary('Loading Trust Deed thresholds (Section 8.2)...', 'agent'); await sleep(2000);
      const comparisons = [
        { name: 'Debt/Equity', threshold: '≤ 2.00', actual: '1.37', status: 'COMPLIANT', margin: 'Headroom: 31.5%' },
        { name: 'Interest Coverage', threshold: '≥ 1.50x', actual: '3.61x', status: 'COMPLIANT', margin: 'Above by 140.7%' },
        { name: 'Current Ratio', threshold: '≥ 1.20', actual: '1.10', status: 'BREACH', margin: 'Below by 8.33%' },
        { name: 'DSCR', threshold: '≥ 1.25x', actual: '1.40x', status: 'COMPLIANT', margin: 'Above by 12.0%' },
        { name: 'Asset Coverage', threshold: '≥ 1.25x', actual: '1.30x', status: 'COMPLIANT', margin: 'Above by 4.0%' },
        { name: 'Net Worth', threshold: '≥ ₹5,000 Cr', actual: '₹35,120 Cr', status: 'COMPLIANT', margin: 'Above by 602%' }
      ];
      for (const c of comparisons) {
        addCommentary('', 'spacer');
        addCommentary('COVENANT: ' + c.name, 'step'); await sleep(1200);
        addCommentary('   Required: ' + c.threshold, 'detail'); await sleep(1000);
        addCommentary('   Actual: ' + c.actual, 'detail'); await sleep(1000);
        if (c.status === 'BREACH') {
          addCommentary('   ⚠️ STATUS: BREACH DETECTED ⚠️', 'error');
          addCommentary('   ' + c.margin, 'error');
        } else {
          addCommentary('   ✓ STATUS: COMPLIANT', 'success');
          addCommentary('   ' + c.margin, 'detail');
        }
        setComparisonResults(prev => [...prev, c]);
        await sleep(1500);
      }
      addCommentary('', 'spacer');
      addCommentary('SUMMARY: 5/6 Compliant | 1 Breach Detected', 'error');
    }
    else if (id === 'breach-detection') {
      addCommentary('Analyzing detected covenant breach...', 'agent'); await sleep(2000);
      const breach = { covenant: 'Current Ratio', section: '8.2(c)', threshold: 1.20, actual: 1.10, deviation: -8.33, curePeriod: 30, cureDeadline: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-IN') };
      setBreachDetails(breach);
      addCommentary('', 'spacer');
      addCommentary('BREACH IDENTIFICATION:', 'header'); await sleep(1000);
      addCommentary('   Covenant: ' + breach.covenant, 'detail'); await sleep(800);
      addCommentary('   Trust Deed Section: ' + breach.section, 'detail'); await sleep(800);
      addCommentary('   Required: ≥ ' + breach.threshold, 'detail'); await sleep(800);
      addCommentary('   Actual: ' + breach.actual, 'detail'); await sleep(800);
      addCommentary('   Deviation: ' + breach.deviation + '%', 'error'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('HISTORICAL TREND:', 'step');
      const trend = [['Q4 FY24', 1.31], ['Q1 FY25', 1.28], ['Q2 FY25', 1.24], ['Q3 FY25', 1.10]];
      for (const [p,v] of trend) { addCommentary('   ' + p + ': ' + v + (v >= 1.2 ? ' ✓' : ' ⚠️'), v >= 1.2 ? 'detail' : 'error'); await sleep(1000); }
      addCommentary('   Trend: Declining over 4 quarters', 'error'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('CURE PERIOD:', 'step');
      addCommentary('   Cure Period: ' + breach.curePeriod + ' days', 'detail'); await sleep(1000);
      addCommentary('   Cure Deadline: ' + breach.cureDeadline, 'error'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('ROOT CAUSE INDICATORS:', 'step');
      addCommentary('   • Current Assets decreased by 3.2% QoQ', 'detail'); await sleep(800);
      addCommentary('   • Current Liabilities increased by 8.5% QoQ', 'detail'); await sleep(800);
      addCommentary('   • Working capital cycle extended', 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('BREACH RECORDED: BR-TML-2025-001', 'success');
      setStats(prev => ({...prev, apiCalls: prev.apiCalls+1}));
    }
    else if (id === 'severity-classification') {
      addCommentary('Loading severity rules from Trust Deed Section 8.4...', 'agent'); await sleep(2000);
      addCommentary('', 'spacer');
      addCommentary('SEVERITY THRESHOLDS:', 'step');
      addCommentary('   TECHNICAL: Deviation ≤ 10%', 'detail'); await sleep(1000);
      addCommentary('   MATERIAL: Deviation 10-25%', 'detail'); await sleep(1000);
      addCommentary('   CRITICAL: Deviation > 25%', 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('CLASSIFICATION:', 'step');
      addCommentary('   Breach Deviation: 8.33%', 'detail'); await sleep(1200);
      addCommentary('   Is 8.33% ≤ 10%? YES', 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('   ┌─────────────────────────────────────────────┐', 'result');
      addCommentary('   │  CLASSIFICATION: TECHNICAL BREACH           │', 'result');
      addCommentary('   └─────────────────────────────────────────────┘', 'result');
      await sleep(2000);
      addCommentary('', 'spacer');
      addCommentary('IMPLICATIONS:', 'header');
      addCommentary('   ✓ Standard cure period applies (30 days)', 'success'); await sleep(800);
      addCommentary('   ✓ No immediate enforcement action', 'success'); await sleep(800);
      addCommentary('   • Issuer must submit remediation plan in 7 days', 'detail'); await sleep(800);
      addCommentary('   • Enhanced monitoring for next quarter', 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('ESCALATION:', 'step');
      addCommentary('   Primary: Relationship Manager (Priya Sharma)', 'detail'); await sleep(800);
      addCommentary('   Secondary: Team Manager (if not cured in 15 days)', 'detail'); await sleep(1200);
    }
    else if (id === 'notice-generation') {
      addCommentary('Loading template: "Technical Breach - First Notice"', 'agent'); await sleep(2000);
      addCommentary('', 'spacer');
      addCommentary('STEP 1: Populating issuer details...', 'step'); await sleep(1500);
      addCommentary('   Company: ' + demoData?.issuer?.name, 'detail'); await sleep(800);
      addCommentary('   Contact: ' + demoData?.issuer?.contact_person, 'detail'); await sleep(800);
      addCommentary('   Address: ' + demoData?.issuer?.registered_address, 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('STEP 2: Inserting NCD details...', 'step'); await sleep(1500);
      addCommentary('   ISIN: ' + demoData?.issue?.isin, 'detail'); await sleep(800);
      addCommentary('   Trust Deed: ' + demoData?.issue?.trust_deed_ref, 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('STEP 3: Adding breach specifics...', 'step'); await sleep(1500);
      addCommentary('   Covenant: Current Ratio', 'detail'); await sleep(800);
      addCommentary('   Required: ≥ 1.20 | Actual: 1.10', 'detail'); await sleep(800);
      addCommentary('   Deviation: -8.33%', 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('STEP 4: Setting cure deadline...', 'step'); await sleep(1500);
      const deadline = new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('en-IN');
      addCommentary('   Cure Deadline: ' + deadline, 'detail'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('STEP 5: Generating PDF...', 'step'); await sleep(2000);
      addCommentary('   ✓ PDF generated: Breach_Notice_TML_CR_2025.pdf', 'success'); await sleep(1500);
      addCommentary('', 'spacer');
      addCommentary('NOTICE PREVIEW:', 'header');
      addCommentary('─────────────────────────────────────────', 'divider');
      addCommentary('To: The Company Secretary', 'detail');
      addCommentary('    ' + demoData?.issuer?.name, 'detail');
      addCommentary('', 'spacer');
      addCommentary('Subject: Notice of Covenant Breach', 'detail');
      addCommentary('         Current Ratio | ISIN: ' + demoData?.issue?.isin, 'detail');
      addCommentary('', 'spacer');
      addCommentary('Cure Deadline: ' + deadline, 'detail');
      addCommentary('─────────────────────────────────────────', 'divider');
      await sleep(2000);
      addCommentary('', 'spacer');
      addCommentary('NOTICE READY FOR REVIEW AND DISPATCH', 'success');
      setStats(prev => ({...prev, apiCalls: prev.apiCalls+1}));
    }
  };

  const resetDemo = () => {
    setIsRunning(false); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowDocumentList(true);
    setDocuments(DEMO_DOCUMENTS); setCalculatedRatios([]); setComparisonResults([]);
    setCurrentCalculation(null); setBreachDetails(null);
    setStats({ documents: 0, apiCalls: 0, validations: 0, dataPoints: 0, calculations: 0 });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (ms) => {
    const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000), t = Math.floor((ms % 1000) / 100);
    return m + ':' + String(s).padStart(2,'0') + '.' + t;
  };

  const progress = completedAgents.length / SUB_AGENTS.length * 100;

  if (!demoData) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-axis-200 border-t-axis-700 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading demo data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Agentic Trustee Services" className="h-14 w-auto" />
                <div><h1 className="text-lg font-bold text-gray-900">Covenant Monitoring Agent</h1><p className="text-xs text-gray-500">Real-time covenant testing & breach detection</p></div>
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

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center"><Building className="w-6 h-6 text-blue-600" /></div><div><h3 className="font-semibold text-gray-900">{demoData.issuer?.name}</h3><p className="text-sm text-gray-500">{demoData.issue?.series_name}</p></div></div>
            <div className="flex items-center gap-6 text-sm"><div><span className="text-gray-500">ISIN:</span><span className="ml-2 font-mono font-medium">{demoData.issue?.isin}</span></div><div><span className="text-gray-500">Issue Size:</span><span className="ml-2 font-medium">₹{demoData.issue?.issue_size} Cr</span></div><div><span className="text-gray-500">Rating:</span><span className="ml-2 font-medium text-green-600">{demoData.issuer?.credit_rating}</span></div></div>
          </div>

          {showDocumentList && !isRunning && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-gray-50"><h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-axis-600" />Documents to be Processed</h3><p className="text-sm text-gray-500 mt-1">The following documents will be analyzed by 7 AI sub-agents (~5 minutes)</p></div>
              <div className="divide-y divide-gray-100">
                {documents.map(doc => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.type==='Financial Statement'?'bg-blue-50':doc.type==='Trust Deed'?'bg-purple-50':'bg-gray-50'}`}>{doc.name.endsWith('.xlsx') ? <FileSpreadsheet className="w-5 h-5 text-green-600" /> : <File className={`w-5 h-5 ${doc.type==='Financial Statement'?'text-blue-600':doc.type==='Trust Deed'?'text-purple-600':'text-gray-600'}`} />}</div><div><p className="font-medium text-gray-900">{doc.name}</p><p className="text-sm text-gray-500">{doc.type}</p></div></div>
                    <div className="flex items-center gap-6 text-sm text-gray-500"><span>{doc.size}</span><span>{doc.pages} pages</span><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Pending</span></div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200"><p className="text-sm text-gray-600"><Info className="w-4 h-4 inline mr-1" />Click <strong>"Run Demo"</strong> to start processing. Demo takes ~5 minutes.</p></div>
            </div>
          )}

          {isRunning && currentAgentIndex === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-blue-50"><h3 className="font-semibold text-gray-900 flex items-center gap-2"><Loader className="w-5 h-5 text-blue-600 animate-spin" />Processing Documents</h3></div>
              <div className="divide-y divide-gray-100">
                {documents.map(doc => (
                  <div key={doc.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.status==='completed'?'bg-green-50':doc.status==='processing'?'bg-blue-50':'bg-gray-50'}`}>{doc.status==='completed'?<CheckCircle className="w-5 h-5 text-green-600"/>:doc.status==='processing'?<Loader className="w-5 h-5 text-blue-600 animate-spin"/>:<File className="w-5 h-5 text-gray-400"/>}</div><div><p className="font-medium text-gray-900">{doc.name}</p><p className="text-sm text-gray-500">{doc.type}</p></div></div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${doc.status==='completed'?'bg-green-100 text-green-700':doc.status==='processing'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600'}`}>{doc.status==='completed'?'Processed':doc.status==='processing'?'Processing...':'Pending'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentCalculation && (
            <div className="bg-white rounded-xl border-2 border-axis-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4"><Calculator className="w-6 h-6 text-axis-600" /><h3 className="text-lg font-semibold text-gray-900">Calculating: {currentCalculation.name}</h3></div>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm space-y-2">
                <p className="text-gray-600">Formula: {currentCalculation.formula}</p>
                <p className="text-gray-800">Calculation: {currentCalculation.calc}</p>
                <p className="text-axis-700 font-bold text-lg mt-2">= {currentCalculation.result} {currentCalculation.unit}</p>
              </div>
            </div>
          )}

          {calculatedRatios.length > 0 && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculated Ratios</h3>
              <div className="grid grid-cols-3 gap-4">{calculatedRatios.map(r => (<div key={r.name} className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-600 mb-1">{r.name}</p><p className="text-2xl font-bold text-gray-900">{r.display}</p></div>))}</div>
            </div>
          )}

          {showResults && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Covenant Testing Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  {comparisonResults.map((r,i) => (
                    <div key={i} className={`p-4 rounded-xl border-2 ${r.status==='BREACH'?'border-red-200 bg-red-50':'border-green-200 bg-green-50'}`}>
                      <div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-gray-600">{r.name}</span>{r.status==='BREACH'?<AlertTriangle className="w-4 h-4 text-red-500"/>:<CheckCircle className="w-4 h-4 text-green-500"/>}</div>
                      <p className="text-2xl font-bold text-gray-900">{r.actual}</p>
                      <p className="text-xs text-gray-500 mt-1">Threshold: {r.threshold}</p>
                    </div>
                  ))}
                </div>
              </div>

              {breachDetails && (
                <div className="bg-red-50 rounded-xl border-2 border-red-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Breach Detected - Technical</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-red-600">Covenant:</span><span className="ml-2 font-medium text-red-800">{breachDetails.covenant}</span></div>
                        <div><span className="text-red-600">Section:</span><span className="ml-2 font-medium text-red-800">{breachDetails.section}</span></div>
                        <div><span className="text-red-600">Required:</span><span className="ml-2 font-medium text-red-800">≥ {breachDetails.threshold}</span></div>
                        <div><span className="text-red-600">Actual:</span><span className="ml-2 font-medium text-red-800">{breachDetails.actual}</span></div>
                        <div><span className="text-red-600">Deviation:</span><span className="ml-2 font-medium text-red-800">{breachDetails.deviation}%</span></div>
                        <div><span className="text-red-600">Severity:</span><span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">TECHNICAL</span></div>
                        <div><span className="text-red-600">Cure Period:</span><span className="ml-2 font-medium text-red-800">{breachDetails.curePeriod} days</span></div>
                        <div><span className="text-red-600">Deadline:</span><span className="ml-2 font-medium text-red-800">{breachDetails.cureDeadline}</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-red-200 flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"><Download className="w-4 h-4" />Download Notice</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50"><Send className="w-4 h-4" />Send to Issuer</button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-700 font-medium rounded-lg hover:bg-red-50"><Eye className="w-4 h-4" />Preview</button>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Processing Summary</h3>
                <div className="grid grid-cols-5 gap-4">
                  {[['Documents', stats.documents], ['Data Points', stats.dataPoints], ['Validations', stats.validations], ['Calculations', stats.calculations], ['API Calls', stats.apiCalls]].map(([l,v]) => (
                    <div key={l} className="text-center p-4 bg-gray-50 rounded-lg"><p className="text-3xl font-bold text-gray-900">{v}</p><p className="text-sm text-gray-500">{l}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-3">
              {[['Documents', stats.documents], ['API Calls', stats.apiCalls], ['Validations', stats.validations], ['Data Points', stats.dataPoints]].map(([l,v]) => (
                <div key={l} className="bg-gray-50 rounded-lg p-3 text-center"><p className="text-2xl font-bold text-gray-900">{v}</p><p className="text-xs text-gray-500 uppercase">{l}</p></div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-gray-200"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${isRunning?'bg-green-500 animate-pulse':'bg-gray-400'}`} /><h3 className="text-sm font-semibold text-gray-700">LIVE COMMENTARY</h3></div></div>
            <div ref={commentaryRef} className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-xs bg-gray-900">
              {commentary.length === 0 ? <p className="text-gray-500 italic">Commentary appears when demo starts...</p> : commentary.map((c,i) => (
                <div key={i} className={`py-0.5 ${c.type==='header'?'text-yellow-400 font-bold':c.type==='divider'?'text-gray-600':c.type==='system'?'text-blue-400':c.type==='agent'?'text-purple-400':c.type==='step'?'text-cyan-400':c.type==='detail'?'text-gray-400':c.type==='data'?'text-green-300':c.type==='result'?'text-yellow-300 font-bold':c.type==='success'?'text-green-400':c.type==='error'?'text-red-400':c.type==='complete'?'text-green-300 font-bold':c.type==='spacer'?'':'text-gray-300'}`}>{c.type!=='spacer'&&c.text}</div>
              ))}
              {isRunning && <div className="text-green-400">_</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
