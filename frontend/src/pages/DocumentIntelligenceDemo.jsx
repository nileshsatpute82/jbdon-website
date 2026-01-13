import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import { 
  FileSearch, ArrowLeft, Play, RotateCcw, CheckCircle, Circle, Loader,
  FileText, Search, BookOpen, GitCompare, MessageSquare, X,
  ChevronRight, Building, File, Eye, Send, Sparkles, AlertTriangle,
  Info, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';

const SUB_AGENTS = [
  { id: 'document-parser', name: 'Document Parser Agent', icon: FileText },
  { id: 'term-extractor', name: 'Term Extractor Agent', icon: Search },
  { id: 'clause-analyzer', name: 'Clause Analyzer Agent', icon: BookOpen },
  { id: 'query-responder', name: 'Query Responder Agent', icon: MessageSquare },
  { id: 'comparison-engine', name: 'Comparison Engine Agent', icon: GitCompare },
];

const DEMO_DOCUMENTS = [
  { id: 'TD001', name: 'Trust_Deed_Tata_Motors_2024.pdf', issuer: 'Tata Motors Limited', pages: 156, size: '4.2 MB', date: '15-Mar-2024', status: 'ready' },
  { id: 'TD002', name: 'Trust_Deed_Reliance_NCD_2023.pdf', issuer: 'Reliance Industries', pages: 189, size: '5.1 MB', date: '20-Nov-2023', status: 'ready' },
  { id: 'TD003', name: 'Trust_Deed_Bajaj_Finance_2024.pdf', issuer: 'Bajaj Finance Ltd', pages: 142, size: '3.8 MB', date: '10-Jan-2024', status: 'ready' },
  { id: 'TD004', name: 'Supplemental_Agreement_TML.pdf', issuer: 'Tata Motors Limited', pages: 12, size: '340 KB', date: '15-Jun-2024', status: 'ready' },
];

const SAMPLE_QUERIES = [
  { q: "What happens if Tata Motors misses an interest payment?", category: "Events of Default" },
  { q: "Can the company sell the secured assets?", category: "Security" },
  { q: "What are the financial covenants?", category: "Covenants" },
  { q: "What is the cure period for covenant breach?", category: "Remedies" },
  { q: "Who is the Security Trustee?", category: "Parties" },
];

export default function DocumentIntelligenceDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const [stats, setStats] = useState({ pages: 0, terms: 0, clauses: 0, queries: 0 });
  const [showResults, setShowResults] = useState(false);
  const [showDocumentList, setShowDocumentList] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(DEMO_DOCUMENTS[0]);
  const [documentStructure, setDocumentStructure] = useState([]);
  const [extractedTerms, setExtractedTerms] = useState(null);
  const [clauseSummaries, setClauseSummaries] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const commentaryRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (commentaryRef.current) commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
  }, [commentary]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chatHistory]);

  const addCommentary = (text, type = 'info') => setCommentary(prev => [...prev, { text, type }]);
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const runDemo = async () => {
    setIsRunning(true); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowDocumentList(false);
    setDocumentStructure([]); setExtractedTerms(null); setClauseSummaries([]);
    setComparisonData(null); setChatHistory([]);
    setStats({ pages: 0, terms: 0, clauses: 0, queries: 0 });

    timerRef.current = setInterval(() => setElapsed(prev => prev + 100), 100);

    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    addCommentary('DOCUMENT INTELLIGENCE AGENT - INITIALIZATION', 'header');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
    await sleep(1500);
    addCommentary('Selected Document: ' + selectedDoc.name, 'system');
    addCommentary('Issuer: ' + selectedDoc.issuer, 'system');
    addCommentary('Pages: ' + selectedDoc.pages + ' | Size: ' + selectedDoc.size, 'system');
    await sleep(1500);
    addCommentary('Initializing 5 AI Sub-Agents for document analysis...', 'system');
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
    addCommentary('DOCUMENT INTELLIGENCE READY', 'header');
    addCommentary('You can now ask questions about the Trust Deed', 'complete');
    addCommentary('═══════════════════════════════════════════════════════════', 'divider');
  };

  const simulateAgent = async (id) => {
    if (id === 'document-parser') {
      addCommentary('Loading PDF document...', 'agent');
      await sleep(2000);
      addCommentary('Performing OCR text extraction...', 'detail');
      await sleep(2500);
      addCommentary('Extracted ' + selectedDoc.pages + ' pages of text content', 'detail');
      await sleep(1500);
      
      addCommentary('', 'spacer');
      addCommentary('Identifying document structure...', 'agent');
      await sleep(2000);

      const structure = [
        { id: 'preamble', name: 'Preamble', pages: '1-3', items: 3 },
        { id: 'article1', name: 'Article I - Definitions', pages: '4-18', items: 45 },
        { id: 'article2', name: 'Article II - The Debentures', pages: '19-35', items: 12 },
        { id: 'article3', name: 'Article III - Security', pages: '36-52', items: 18 },
        { id: 'article4', name: 'Article IV - Covenants', pages: '53-78', items: 24 },
        { id: 'article5', name: 'Article V - Events of Default', pages: '79-92', items: 14 },
        { id: 'article6', name: 'Article VI - Remedies', pages: '93-108', items: 16 },
        { id: 'article7', name: 'Article VII - The Trustee', pages: '109-125', items: 20 },
        { id: 'article8', name: 'Article VIII - Miscellaneous', pages: '126-140', items: 18 },
        { id: 'schedule1', name: 'Schedule I - Form of Debenture Certificate', pages: '141-145', items: 5 },
        { id: 'schedule2', name: 'Schedule II - Conditions of Issue', pages: '146-150', items: 8 },
        { id: 'schedule3', name: 'Schedule III - Security Documents', pages: '151-154', items: 6 },
        { id: 'schedule4', name: 'Schedule IV - Permitted Investments', pages: '155-156', items: 4 },
      ];

      addCommentary('', 'spacer');
      addCommentary('DOCUMENT STRUCTURE IDENTIFIED:', 'header');
      for (const section of structure) {
        addCommentary('├── ' + section.name + ' (Pages ' + section.pages + ')', 'data');
        setDocumentStructure(prev => [...prev, section]);
        await sleep(400);
      }
      
      setStats(prev => ({...prev, pages: selectedDoc.pages}));
      addCommentary('', 'spacer');
      addCommentary('Total sections identified: ' + structure.length, 'success');
      addCommentary('Building cross-reference index...', 'detail');
      await sleep(2000);
      addCommentary('Cross-reference index created with 234 internal links', 'success');
    }
    else if (id === 'term-extractor') {
      addCommentary('Scanning document for key legal terms...', 'agent');
      await sleep(2000);
      
      addCommentary('', 'spacer');
      addCommentary('EXTRACTING PARTIES...', 'step');
      await sleep(1500);
      addCommentary('   • Issuer: Tata Motors Limited', 'data');
      addCommentary('   • Trustee: Axis Trustee Services Limited', 'data');
      addCommentary('   • Security Trustee: IDBI Trusteeship Services Ltd', 'data');
      addCommentary('   • Registrar: Link Intime India Pvt Ltd', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('EXTRACTING KEY DATES...', 'step');
      await sleep(1500);
      addCommentary('   • Issue Date: 15-Mar-2024', 'data');
      addCommentary('   • Maturity Date: 15-Mar-2029', 'data');
      addCommentary('   • First Coupon: 15-Sep-2024', 'data');
      addCommentary('   • Record Date: 7 days before payment', 'data');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('EXTRACTING FINANCIAL COVENANTS...', 'step');
      await sleep(2000);
      const covenants = [
        { name: 'Debt to Equity', threshold: '≤ 2.0', section: '4.2.1' },
        { name: 'Interest Coverage', threshold: '≥ 1.5x', section: '4.2.2' },
        { name: 'Current Ratio', threshold: '≥ 1.2', section: '4.2.3' },
        { name: 'DSCR', threshold: '≥ 1.25x', section: '4.2.4' },
        { name: 'Asset Coverage', threshold: '≥ 1.25x', section: '4.2.5' },
        { name: 'Minimum Net Worth', threshold: '≥ ₹5,000 Cr', section: '4.2.6' },
      ];
      for (const cov of covenants) {
        addCommentary('   • ' + cov.name + ' ' + cov.threshold + ' (Section ' + cov.section + ')', 'data');
        await sleep(600);
      }

      addCommentary('', 'spacer');
      addCommentary('EXTRACTING EVENTS OF DEFAULT...', 'step');
      await sleep(2000);
      const events = [
        { name: 'Payment Default', section: '5.1.1', cure: '7 business days' },
        { name: 'Covenant Breach', section: '5.1.2', cure: '30 days' },
        { name: 'Cross Default', section: '5.1.3', cure: 'None' },
        { name: 'Insolvency', section: '5.1.4', cure: 'None' },
        { name: 'Material Adverse Change', section: '5.1.5', cure: 'Trustee discretion' },
        { name: 'Breach of Representation', section: '5.1.6', cure: '15 days' },
      ];
      for (const evt of events) {
        addCommentary('   • ' + evt.name + ' (Section ' + evt.section + ') - Cure: ' + evt.cure, 'data');
        await sleep(500);
      }
      addCommentary('   ... and 6 more events identified', 'detail');
      await sleep(1000);

      addCommentary('', 'spacer');
      addCommentary('EXTRACTING SECURITY DETAILS...', 'step');
      await sleep(1500);
      addCommentary('   • Security Type: First pari passu charge', 'data');
      addCommentary('   • Secured Assets: Plant & Machinery at Pune facility', 'data');
      addCommentary('   • Security Cover: Minimum 1.25x outstanding', 'data');
      addCommentary('   • Valuation Frequency: Annual', 'data');
      await sleep(1500);

      setExtractedTerms({
        parties: [
          { role: 'Issuer', name: 'Tata Motors Limited', cin: 'L28920MH1945PLC004520' },
          { role: 'Debenture Trustee', name: 'Axis Trustee Services Limited', sebi: 'INE000005780' },
          { role: 'Security Trustee', name: 'IDBI Trusteeship Services Ltd', sebi: 'IND000000123' },
          { role: 'Registrar', name: 'Link Intime India Pvt Ltd', sebi: 'INR000004058' },
        ],
        dates: [
          { event: 'Issue Date', date: '15-Mar-2024' },
          { event: 'Deemed Date of Allotment', date: '15-Mar-2024' },
          { event: 'Maturity Date', date: '15-Mar-2029' },
          { event: 'First Coupon Payment', date: '15-Sep-2024' },
          { event: 'Record Date', date: '7 days before payment date' },
        ],
        covenants: covenants,
        eventsOfDefault: events,
        security: {
          type: 'First pari passu charge',
          assets: 'Plant & Machinery at Pune manufacturing facility',
          cover: '1.25x of outstanding debentures',
          valuation: 'Annual by independent valuer',
        }
      });
      
      setStats(prev => ({...prev, terms: 68}));
      addCommentary('', 'spacer');
      addCommentary('Total terms extracted: 68', 'success');
    }
    else if (id === 'clause-analyzer') {
      addCommentary('Analyzing legal clauses for plain English conversion...', 'agent');
      await sleep(2000);

      const clauses = [
        {
          section: '5.1.1',
          title: 'Payment Default',
          legal: 'If the Issuer fails to pay any sum due in respect of the Debentures or any of them within seven Business Days of the due date for payment thereof...',
          plain: 'If Tata Motors fails to pay interest or principal within 7 business days of the due date, it is considered a default. The Trustee can then take action to protect investor interests.',
          risk: 'HIGH',
          obligations: ['Pay on due date', 'Notify trustee of any delay', 'Cure within 7 days']
        },
        {
          section: '5.1.3',
          title: 'Cross Default',
          legal: 'If the Issuer defaults in the payment of any Indebtedness in excess of Rs. 100 Crores or if any such Indebtedness becomes due and payable prior to its stated maturity...',
          plain: 'If Tata Motors defaults on any other loan/debt above ₹100 Crores, this NCD is also considered defaulted automatically. This protects NCD holders from being last to know about company troubles.',
          risk: 'HIGH',
          obligations: ['Monitor all debt obligations', 'Report defaults immediately']
        },
        {
          section: '4.4.2',
          title: 'Negative Pledge',
          legal: 'The Issuer shall not create or permit to subsist any Security Interest upon the whole or any part of its present or future revenues or assets...',
          plain: 'Tata Motors cannot pledge its assets to anyone else without trustee permission. This ensures the secured assets remain available for NCD holders.',
          risk: 'MEDIUM',
          obligations: ['No additional security creation', 'Seek trustee consent for exceptions']
        },
        {
          section: '4.3.1',
          title: 'Information Covenant',
          legal: 'The Issuer shall deliver to the Trustee within 45 days of the end of each quarter, the unaudited financial statements...',
          plain: 'Tata Motors must send quarterly financial statements within 45 days. This ensures the Trustee can monitor covenant compliance regularly.',
          risk: 'LOW',
          obligations: ['Submit quarterly financials', 'Submit annual audited accounts', 'Notify material events']
        },
        {
          section: '6.2.1',
          title: 'Acceleration',
          legal: 'Upon occurrence of an Event of Default, the Trustee may by notice to the Issuer declare all amounts outstanding under the Debentures to be immediately due and payable...',
          plain: 'If a default happens, the Trustee can demand immediate repayment of all outstanding amounts instead of waiting for maturity. This is the nuclear option.',
          risk: 'HIGH',
          obligations: ['Full repayment on demand', 'Security enforcement possible']
        },
      ];

      for (const clause of clauses) {
        addCommentary('', 'spacer');
        addCommentary('ANALYZING: Section ' + clause.section + ' - ' + clause.title, 'step');
        await sleep(1500);
        addCommentary('   Legal Text: "' + clause.legal.substring(0, 80) + '..."', 'detail');
        await sleep(1500);
        addCommentary('   Plain English: ' + clause.plain.substring(0, 100) + '...', 'data');
        await sleep(1000);
        addCommentary('   Risk Level: ' + clause.risk, clause.risk === 'HIGH' ? 'error' : clause.risk === 'MEDIUM' ? 'warning' : 'success');
        await sleep(800);
        setClauseSummaries(prev => [...prev, clause]);
      }

      setStats(prev => ({...prev, clauses: 124}));
      addCommentary('', 'spacer');
      addCommentary('Analyzed 124 clauses with plain English summaries', 'success');
      addCommentary('Identified 18 HIGH risk, 42 MEDIUM risk, 64 LOW risk clauses', 'success');
    }
    else if (id === 'query-responder') {
      addCommentary('Building knowledge base for Q&A...', 'agent');
      await sleep(2000);
      addCommentary('Indexing all extracted terms and clauses...', 'detail');
      await sleep(2000);
      addCommentary('Creating semantic search vectors...', 'detail');
      await sleep(2500);
      addCommentary('Knowledge base ready with 156 pages indexed', 'success');
      await sleep(1500);

      addCommentary('', 'spacer');
      addCommentary('TESTING SAMPLE QUERIES:', 'header');
      await sleep(1000);

      // Demo Q&A
      addCommentary('', 'spacer');
      addCommentary('Q: "What happens if Tata Motors misses an interest payment?"', 'step');
      await sleep(2500);
      addCommentary('A: According to Section 5.1.1 (Page 79), failure to pay within', 'data');
      addCommentary('   7 business days constitutes an Event of Default. The Trustee', 'data');
      addCommentary('   may then declare acceleration under Section 6.2.1.', 'data');
      addCommentary('   Source: Trust Deed Section 5.1.1, Page 79-80', 'detail');
      await sleep(2000);

      addCommentary('', 'spacer');
      addCommentary('Q: "What are the financial covenants?"', 'step');
      await sleep(2500);
      addCommentary('A: The Trust Deed specifies 6 financial covenants in Section 4.2:', 'data');
      addCommentary('   1. Debt/Equity ≤ 2.0  2. ICR ≥ 1.5x  3. Current Ratio ≥ 1.2', 'data');
      addCommentary('   4. DSCR ≥ 1.25x  5. Asset Cover ≥ 1.25x  6. Net Worth ≥ ₹5,000 Cr', 'data');
      addCommentary('   Source: Trust Deed Section 4.2, Pages 53-58', 'detail');
      await sleep(2000);

      setChatHistory([
        { role: 'assistant', content: 'Knowledge base created! I\'ve analyzed the Trust Deed for Tata Motors NCD 2024. You can ask me any questions about covenants, events of default, security, or any other provisions.' }
      ]);
      
      setStats(prev => ({...prev, queries: 5}));
      addCommentary('', 'spacer');
      addCommentary('Query engine ready - natural language search enabled', 'success');
    }
    else if (id === 'comparison-engine') {
      addCommentary('Loading comparison document: Trust_Deed_Reliance_NCD_2023.pdf', 'agent');
      await sleep(2500);
      addCommentary('Parsing comparison document (189 pages)...', 'detail');
      await sleep(3000);
      addCommentary('Aligning sections between documents...', 'detail');
      await sleep(2500);

      addCommentary('', 'spacer');
      addCommentary('COMPARISON: Tata Motors vs Reliance Industries', 'header');
      addCommentary('─────────────────────────────────────────', 'divider');
      await sleep(1000);

      addCommentary('', 'spacer');
      addCommentary('ISSUE DETAILS:', 'step');
      addCommentary('                      Tata Motors    Reliance', 'detail');
      addCommentary('   Issue Size         ₹5,000 Cr      ₹7,500 Cr', 'data');
      addCommentary('   Tenure             5 years        7 years', 'data');
      addCommentary('   Coupon Rate        8.75%          8.25%', 'data');
      addCommentary('   Security           Secured        Unsecured', 'data');
      await sleep(2000);

      addCommentary('', 'spacer');
      addCommentary('COVENANT COMPARISON:', 'step');
      addCommentary('   Debt/Equity        ≤ 2.0          ≤ 2.5       ⚠️ Different', 'warning');
      addCommentary('   Interest Coverage  ≥ 1.5x         ≥ 2.0x      ⚠️ Different', 'warning');
      addCommentary('   Current Ratio      ≥ 1.2          Not specified', 'data');
      addCommentary('   DSCR               ≥ 1.25x        ≥ 1.5x      ⚠️ Different', 'warning');
      await sleep(2000);

      addCommentary('', 'spacer');
      addCommentary('KEY DIFFERENCES IDENTIFIED:', 'step');
      addCommentary('   1. Reliance has stricter ICR (2.0x vs 1.5x)', 'error');
      addCommentary('   2. Tata Motors requires Current Ratio, Reliance does not', 'data');
      addCommentary('   3. Tata Motors is secured, Reliance is unsecured', 'error');
      addCommentary('   4. Cross-default threshold: ₹100 Cr vs ₹500 Cr', 'warning');
      await sleep(2000);

      setComparisonData({
        doc1: { name: 'Tata Motors NCD 2024', issuer: 'Tata Motors Limited' },
        doc2: { name: 'Reliance NCD 2023', issuer: 'Reliance Industries' },
        issueDetails: [
          { param: 'Issue Size', val1: '₹5,000 Cr', val2: '₹7,500 Cr', diff: false },
          { param: 'Tenure', val1: '5 years', val2: '7 years', diff: true },
          { param: 'Coupon Rate', val1: '8.75%', val2: '8.25%', diff: true },
          { param: 'Security', val1: 'Secured', val2: 'Unsecured', diff: true },
          { param: 'Rating', val1: 'AA+', val2: 'AAA', diff: true },
        ],
        covenants: [
          { param: 'Debt/Equity', val1: '≤ 2.0', val2: '≤ 2.5', diff: true },
          { param: 'Interest Coverage', val1: '≥ 1.5x', val2: '≥ 2.0x', diff: true },
          { param: 'Current Ratio', val1: '≥ 1.2', val2: 'Not specified', diff: true },
          { param: 'DSCR', val1: '≥ 1.25x', val2: '≥ 1.5x', diff: true },
          { param: 'Asset Coverage', val1: '≥ 1.25x', val2: 'N/A (Unsecured)', diff: true },
          { param: 'Min Net Worth', val1: '≥ ₹5,000 Cr', val2: '≥ ₹50,000 Cr', diff: true },
        ],
        defaults: [
          { param: 'Payment Default Cure', val1: '7 business days', val2: '3 business days', diff: true },
          { param: 'Cross Default Threshold', val1: '₹100 Cr', val2: '₹500 Cr', diff: true },
          { param: 'Covenant Breach Cure', val1: '30 days', val2: '30 days', diff: false },
        ],
        keyDifferences: [
          'Reliance has stricter Interest Coverage requirement (2.0x vs 1.5x)',
          'Tata Motors requires Current Ratio maintenance, Reliance does not',
          'Tata Motors NCD is secured with fixed assets, Reliance is unsecured',
          'Reliance has higher cross-default threshold (₹500 Cr vs ₹100 Cr)',
          'Reliance has shorter payment cure period (3 days vs 7 days)',
        ]
      });

      addCommentary('', 'spacer');
      addCommentary('Comparison analysis complete - 12 differences identified', 'success');
    }
  };

  const handleQuerySubmit = async () => {
    if (!queryInput.trim() || isTyping) return;
    
    const question = queryInput;
    setQueryInput('');
    setChatHistory(prev => [...prev, { role: 'user', content: question }]);
    setIsTyping(true);

    // Simulate AI response
    await sleep(2000);

    let response = '';
    const q = question.toLowerCase();
    
    if (q.includes('interest') && q.includes('payment') || q.includes('miss')) {
      response = `According to Section 5.1.1 (Page 79) of the Trust Deed:\n\nIf Tata Motors fails to pay any interest or principal amount within **7 business days** of the due date, it constitutes an Event of Default.\n\n**Consequences:**\n• Trustee may declare acceleration (all amounts immediately due)\n• Security can be enforced\n• Legal proceedings may be initiated\n\n📖 Source: Section 5.1.1, Pages 79-80`;
    } else if (q.includes('covenant') || q.includes('financial ratio')) {
      response = `The Trust Deed specifies **6 financial covenants** in Section 4.2:\n\n| Covenant | Threshold | Testing |\n|----------|-----------|--------|\n| Debt to Equity | ≤ 2.0 | Quarterly |\n| Interest Coverage | ≥ 1.5x | Quarterly |\n| Current Ratio | ≥ 1.2 | Quarterly |\n| DSCR | ≥ 1.25x | Annual |\n| Asset Coverage | ≥ 1.25x | Annual |\n| Min Net Worth | ≥ ₹5,000 Cr | Quarterly |\n\n📖 Source: Section 4.2, Pages 53-58`;
    } else if (q.includes('security') || q.includes('collateral') || q.includes('asset')) {
      response = `**Security Details** from Section 3 (Pages 36-52):\n\n• **Type:** First pari passu charge\n• **Assets:** Plant & Machinery at Pune manufacturing facility\n• **Coverage Required:** Minimum 1.25x of outstanding debentures\n• **Valuation:** Annual valuation by independent valuer\n• **Security Trustee:** IDBI Trusteeship Services Ltd\n\nThe Issuer cannot sell or encumber these assets without Trustee consent (Section 4.4.2).\n\n📖 Source: Article III, Pages 36-52`;
    } else if (q.includes('default') || q.includes('event')) {
      response = `The Trust Deed lists **12 Events of Default** in Section 5.1:\n\n**Critical Events (No Cure):**\n• Insolvency/Winding up\n• Cross Default (>₹100 Cr)\n\n**Curable Events:**\n• Payment Default - 7 business days\n• Covenant Breach - 30 days\n• Information Default - 15 days\n• Breach of Representation - 15 days\n\nUpon default, Trustee may accelerate and enforce security.\n\n📖 Source: Section 5.1, Pages 79-92`;
    } else if (q.includes('trustee') || q.includes('who')) {
      response = `**Key Parties** from the Preamble:\n\n• **Issuer:** Tata Motors Limited\n  CIN: L28920MH1945PLC004520\n\n• **Debenture Trustee:** Axis Trustee Services Limited\n  SEBI Reg: INE000005780\n\n• **Security Trustee:** IDBI Trusteeship Services Ltd\n\n• **Registrar:** Link Intime India Pvt Ltd\n\n📖 Source: Preamble, Pages 1-3`;
    } else if (q.includes('cure') || q.includes('remedy')) {
      response = `**Cure Periods** for different defaults:\n\n| Default Type | Cure Period |\n|-------------|-------------|\n| Payment Default | 7 business days |\n| Covenant Breach | 30 days |\n| Information Default | 15 days |\n| Representation Breach | 15 days |\n| Cross Default | No cure |\n| Insolvency | No cure |\n\nCure period starts from the date of written notice by Trustee.\n\n📖 Source: Section 5.1, Pages 79-92`;
    } else {
      response = `I searched the Trust Deed for "${question}" but couldn't find a specific clause addressing this.\n\nHere are some related sections you might find helpful:\n• Article IV - Covenants (Pages 53-78)\n• Article V - Events of Default (Pages 79-92)\n• Article VI - Remedies (Pages 93-108)\n\nWould you like me to search for something more specific?`;
    }

    setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
    setStats(prev => ({...prev, queries: prev.queries + 1}));
  };

  const resetDemo = () => {
    setIsRunning(false); setCurrentAgentIndex(-1); setCompletedAgents([]); setCommentary([]);
    setElapsed(0); setShowResults(false); setShowDocumentList(true);
    setDocumentStructure([]); setExtractedTerms(null); setClauseSummaries([]);
    setComparisonData(null); setChatHistory([]);
    setStats({ pages: 0, terms: 0, clauses: 0, queries: 0 });
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
                <div><h1 className="text-lg font-bold text-gray-900">Document Intelligence Agent</h1><p className="text-xs text-gray-500">AI-powered Trust Deed analysis & Q&A</p></div>
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
          {/* Document Info Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center"><FileSearch className="w-6 h-6 text-purple-600" /></div>
              <div><h3 className="font-semibold text-gray-900">{selectedDoc.name}</h3><p className="text-sm text-gray-500">{selectedDoc.issuer}</p></div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div><span className="text-gray-500">Pages:</span><span className="ml-2 font-medium">{selectedDoc.pages}</span></div>
              <div><span className="text-gray-500">Size:</span><span className="ml-2 font-medium">{selectedDoc.size}</span></div>
              <div><span className="text-gray-500">Date:</span><span className="ml-2 font-medium">{selectedDoc.date}</span></div>
            </div>
          </div>

          {/* Document List - Initial State */}
          {showDocumentList && !isRunning && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2"><FileText className="w-5 h-5 text-purple-600" />Select Trust Deed for Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">Choose a document to analyze with AI (~5 minutes)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {DEMO_DOCUMENTS.map(doc => (
                  <div key={doc.id} onClick={() => setSelectedDoc(doc)} className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${selectedDoc.id === doc.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50"><File className="w-5 h-5 text-purple-600" /></div>
                      <div><p className="font-medium text-gray-900">{doc.name}</p><p className="text-sm text-gray-500">{doc.issuer}</p></div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>{doc.pages} pages</span><span>{doc.size}</span>
                      {selectedDoc.id === doc.id && <CheckCircle className="w-5 h-5 text-purple-600" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200"><p className="text-sm text-gray-600"><Info className="w-4 h-4 inline mr-1" />Click <strong>"Run Demo"</strong> to analyze the selected document.</p></div>
            </div>
          )}

          {/* Document Structure (During Processing) */}
          {documentStructure.length > 0 && !showResults && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-purple-600" />Document Structure</h3>
              <div className="space-y-1 font-mono text-sm">
                {documentStructure.map((section, idx) => (
                  <div key={section.id} className="flex items-center gap-2 text-gray-700">
                    <span className="text-gray-400">{idx === documentStructure.length - 1 ? '└──' : '├──'}</span>
                    <span className="font-medium">{section.name}</span>
                    <span className="text-gray-400">(Pages {section.pages})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Panel */}
          {showResults && (
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button onClick={() => setShowTermsModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <Search className="w-5 h-5 text-purple-600" /><span className="font-medium">View Extracted Terms</span><span className="text-sm text-gray-500">({stats.terms} terms)</span>
                </button>
                <button onClick={() => setShowComparisonModal(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                  <GitCompare className="w-5 h-5 text-blue-600" /><span className="font-medium">View Comparison</span><span className="text-sm text-gray-500">(vs Reliance)</span>
                </button>
              </div>

              {/* Chat Interface */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-600" />Ask Questions About This Trust Deed</h3>
                  <p className="text-sm text-gray-500 mt-1">Get instant answers with page citations</p>
                </div>
                
                {/* Chat Messages */}
                <div ref={chatRef} className="h-80 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-axis-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-xl p-4"><div className="flex gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} /><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} /></div></div>
                    </div>
                  )}
                </div>

                {/* Sample Questions */}
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_QUERIES.slice(0, 4).map((sq, idx) => (
                      <button key={idx} onClick={() => setQueryInput(sq.q)} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-purple-300 hover:text-purple-600">{sq.q.substring(0, 40)}...</button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input type="text" value={queryInput} onChange={e => setQueryInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleQuerySubmit()} placeholder="Ask any question about the Trust Deed..." className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-400" />
                    <button onClick={handleQuerySubmit} disabled={!queryInput.trim() || isTyping} className="px-6 py-3 gradient-axis text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50"><Send className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>

              {/* Clause Summaries */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200"><h3 className="font-semibold text-gray-900">Key Clause Summaries (Plain English)</h3></div>
                <div className="divide-y divide-gray-100">
                  {clauseSummaries.map((clause, idx) => (
                    <div key={idx} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-500">Section {clause.section}</span>
                          <span className="font-medium text-gray-900">{clause.title}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${clause.risk === 'HIGH' ? 'bg-red-100 text-red-700' : clause.risk === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{clause.risk} RISK</span>
                      </div>
                      <p className="text-sm text-gray-600">{clause.plain}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[['Pages Indexed', stats.pages], ['Terms Extracted', stats.terms], ['Clauses Analyzed', stats.clauses], ['Queries Answered', stats.queries]].map(([l,v]) => (
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
              {[['Pages', stats.pages], ['Terms', stats.terms], ['Clauses', stats.clauses], ['Queries', stats.queries]].map(([l,v]) => (
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

      {/* Terms Modal */}
      {showTermsModal && extractedTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Extracted Terms - {selectedDoc.name}</h2>
              <button onClick={() => setShowTermsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
              {/* Parties */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Parties</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left">Role</th><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Registration</th></tr></thead>
                    <tbody>{extractedTerms.parties.map((p,i) => (<tr key={i} className="border-t border-gray-200"><td className="px-4 py-2 font-medium">{p.role}</td><td className="px-4 py-2">{p.name}</td><td className="px-4 py-2 font-mono text-xs">{p.cin || p.sebi}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
              {/* Key Dates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Dates</h3>
                <div className="grid grid-cols-2 gap-3">
                  {extractedTerms.dates.map((d,i) => (<div key={i} className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">{d.event}</p><p className="font-medium">{d.date}</p></div>))}
                </div>
              </div>
              {/* Covenants */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Financial Covenants</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left">Covenant</th><th className="px-4 py-2 text-left">Threshold</th><th className="px-4 py-2 text-left">Section</th></tr></thead>
                    <tbody>{extractedTerms.covenants.map((c,i) => (<tr key={i} className="border-t border-gray-200"><td className="px-4 py-2 font-medium">{c.name}</td><td className="px-4 py-2 text-purple-600 font-medium">{c.threshold}</td><td className="px-4 py-2 font-mono text-xs">{c.section}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
              {/* Events of Default */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Events of Default</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100"><tr><th className="px-4 py-2 text-left">Event</th><th className="px-4 py-2 text-left">Section</th><th className="px-4 py-2 text-left">Cure Period</th></tr></thead>
                    <tbody>{extractedTerms.eventsOfDefault.map((e,i) => (<tr key={i} className="border-t border-gray-200"><td className="px-4 py-2 font-medium">{e.name}</td><td className="px-4 py-2 font-mono text-xs">{e.section}</td><td className="px-4 py-2">{e.cure}</td></tr>))}</tbody>
                  </table>
                </div>
              </div>
              {/* Security */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Security Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(extractedTerms.security).map(([k,v],i) => (<div key={i} className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 capitalize">{k}</p><p className="font-medium">{v}</p></div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparisonModal && comparisonData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Trust Deed Comparison</h2>
              <button onClick={() => setShowComparisonModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
              {/* Header */}
              <div className="grid grid-cols-3 gap-4">
                <div></div>
                <div className="bg-purple-50 rounded-lg p-4 text-center"><p className="font-bold text-purple-700">{comparisonData.doc1.name}</p><p className="text-sm text-gray-500">{comparisonData.doc1.issuer}</p></div>
                <div className="bg-blue-50 rounded-lg p-4 text-center"><p className="font-bold text-blue-700">{comparisonData.doc2.name}</p><p className="text-sm text-gray-500">{comparisonData.doc2.issuer}</p></div>
              </div>
              {/* Issue Details */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Issue Details</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>{comparisonData.issueDetails.map((row,i) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="px-4 py-2 font-medium w-1/3">{row.param}</td>
                        <td className="px-4 py-2 w-1/3">{row.val1}</td>
                        <td className={`px-4 py-2 w-1/3 ${row.diff ? 'bg-yellow-50' : ''}`}>{row.val2} {row.diff && <span className="text-yellow-600 ml-1">⚠️</span>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {/* Covenants */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Covenant Comparison</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>{comparisonData.covenants.map((row,i) => (
                      <tr key={i} className="border-t border-gray-200">
                        <td className="px-4 py-2 font-medium w-1/3">{row.param}</td>
                        <td className="px-4 py-2 w-1/3">{row.val1}</td>
                        <td className={`px-4 py-2 w-1/3 ${row.diff ? 'bg-yellow-50' : ''}`}>{row.val2} {row.diff && <span className="text-yellow-600 ml-1">⚠️</span>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {/* Key Differences */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" />Key Differences</h3>
                <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                  {comparisonData.keyDifferences.map((diff, i) => (
                    <div key={i} className="flex items-start gap-2"><span className="text-orange-500 font-bold">{i+1}.</span><span className="text-gray-700">{diff}</span></div>
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
