const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const MASTERS_DIR = path.join(__dirname, '../data/masters');

async function readMaster(filename) {
  const filePath = path.join(MASTERS_DIR, filename);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Demo configuration for Covenant Monitoring Agent
const COVENANT_AGENT_CONFIG = {
  id: 'covenant-monitoring',
  name: 'Covenant Monitoring Agent',
  description: 'Monitors debenture covenants, detects breaches, and generates compliance notices',
  icon: 'FileCheck',
  color: '#8B1538',
  subAgents: [
    {
      id: 'document-ingestion',
      name: 'Document Ingestion Agent',
      description: 'Extracts financial data from uploaded PDF/Excel statements',
      duration: 4000,
      steps: [
        { text: 'Receiving uploaded document...', duration: 500 },
        { text: 'Identifying document type... Quarterly Financial Results', duration: 600 },
        { text: 'Locating Balance Sheet... Found on Page 12', duration: 700 },
        { text: 'Locating P&L Statement... Found on Page 14', duration: 600 },
        { text: 'Locating Cash Flow Statement... Found on Page 16', duration: 500 },
        { text: 'Extracting line items using AI...', duration: 1100 }
      ]
    },
    {
      id: 'data-validation',
      name: 'Data Validation Agent',
      description: 'Validates extracted data for completeness and consistency',
      duration: 3000,
      steps: [
        { text: 'Validating Balance Sheet equation... Assets = Liabilities + Equity ✓', duration: 600 },
        { text: 'Checking for missing mandatory fields... All 12 required fields present ✓', duration: 500 },
        { text: 'Cross-validating with previous quarter... Variance within acceptable range ✓', duration: 700 },
        { text: 'Verifying currency and units... All values in ₹ Crores ✓', duration: 500 },
        { text: 'Checking for anomalies... No unusual values detected ✓', duration: 700 }
      ]
    },
    {
      id: 'ratio-calculation',
      name: 'Ratio Calculation Agent',
      description: 'Computes all required financial ratios from extracted data',
      duration: 3500,
      steps: [
        { text: 'Calculating Debt to Equity Ratio...', duration: 500 },
        { text: 'Calculating Interest Coverage Ratio...', duration: 500 },
        { text: 'Calculating Current Ratio...', duration: 500 },
        { text: 'Calculating Debt Service Coverage Ratio...', duration: 600 },
        { text: 'Calculating Asset Coverage Ratio...', duration: 500 },
        { text: 'Calculating Minimum Net Worth...', duration: 400 },
        { text: 'All 6 covenant ratios computed successfully', duration: 500 }
      ]
    },
    {
      id: 'covenant-comparison',
      name: 'Covenant Comparison Agent',
      description: 'Compares calculated ratios against Trust Deed thresholds',
      duration: 3000,
      steps: [
        { text: 'Loading covenant thresholds from Trust Deed...', duration: 400 },
        { text: 'Comparing Debt/Equity: 1.37 vs ≤2.0... COMPLIANT', duration: 400 },
        { text: 'Comparing ICR: 3.61x vs ≥1.5x... COMPLIANT', duration: 400 },
        { text: 'Comparing Current Ratio: 1.10 vs ≥1.2... BREACH DETECTED', duration: 500 },
        { text: 'Comparing DSCR: 2.45x vs ≥1.25x... COMPLIANT', duration: 400 },
        { text: 'Comparing Asset Cover: 1.58x vs ≥1.25x... COMPLIANT', duration: 400 },
        { text: 'Comparison complete: 5/6 compliant, 1 breach detected', duration: 500 }
      ]
    },
    {
      id: 'breach-detection',
      name: 'Breach Detection Agent',
      description: 'Formally identifies and documents covenant breaches',
      duration: 2500,
      steps: [
        { text: 'Analyzing breach: Current Ratio', duration: 400 },
        { text: 'Threshold: ≥1.20, Actual: 1.10', duration: 300 },
        { text: 'Deviation: -8.33% below threshold', duration: 400 },
        { text: 'Checking if first occurrence... Yes, first breach in this covenant', duration: 500 },
        { text: 'Retrieving cure period from Trust Deed... 30 days', duration: 400 },
        { text: 'Breach formally recorded in system', duration: 500 }
      ]
    },
    {
      id: 'severity-classification',
      name: 'Severity Classification Agent',
      description: 'Classifies breach severity based on deviation and rules',
      duration: 2000,
      steps: [
        { text: 'Loading severity classification rules...', duration: 300 },
        { text: 'Analyzing deviation magnitude: 8.33%', duration: 400 },
        { text: 'Checking severity thresholds...', duration: 300 },
        { text: 'Technical Breach: ≤10% deviation ✓', duration: 300 },
        { text: 'Classification: TECHNICAL BREACH', duration: 400 },
        { text: 'Determining escalation path... Relationship Manager notified', duration: 300 }
      ]
    },
    {
      id: 'notice-generation',
      name: 'Notice Generation Agent',
      description: 'Generates formal breach notices from templates',
      duration: 2500,
      steps: [
        { text: 'Loading notice template: Technical Breach - First Notice', duration: 400 },
        { text: 'Populating issuer details...', duration: 400 },
        { text: 'Inserting covenant specifics...', duration: 400 },
        { text: 'Adding Trust Deed references...', duration: 300 },
        { text: 'Calculating cure deadline: 12-Feb-2026', duration: 400 },
        { text: 'Notice generated and ready for review', duration: 600 }
      ]
    }
  ]
};

// Get all agents configuration
router.get('/agents', (req, res) => {
  const agents = [
    {
      id: 'covenant-monitoring',
      name: 'Covenant Monitoring Agent',
      description: 'Monitors NCD covenants, detects breaches, generates compliance notices',
      icon: 'FileCheck',
      color: '#8B1538',
      stats: { issues: 20, covenants: 85, breaches: 1 },
      status: 'active'
    },
    {
      id: 'document-intelligence',
      name: 'Document Intelligence Agent',
      description: 'Analyzes Trust Deeds, extracts key terms, answers questions with AI',
      icon: 'FileSearch',
      color: '#7C3AED',
      stats: { documents: 45, terms: 890, clauses: 124 },
      status: 'active'
    },
    {
      id: 'escrow-lifecycle',
      name: 'Escrow Lifecycle Agent',
      description: 'Tracks escrow utilization, validates releases, ensures compliance',
      icon: 'Vault',
      color: '#059669',
      stats: { escrows: 34, releases: 28, balance: '₹8.5K Cr' },
      status: 'active'
    },
    {
      id: 'regulatory-filing',
      name: 'Regulatory Filing Agent',
      description: 'Automates SEBI/Exchange filings, tracks deadlines, ensures compliance',
      icon: 'Building',
      color: '#EA580C',
      stats: { filings: 47, deadlines: 6, compliance: '100%' },
      status: 'active'
    },
    {
      id: 'investor-communication',
      name: 'Investor Communication Agent',
      description: 'Handles queries, calculates payouts, sends notifications',
      icon: 'Users',
      color: '#7C3AED',
      stats: { queries: 23, investors: '12.4K', responseTime: '2.4h' },
      status: 'active'
    },
    {
      id: 'security-monitoring',
      name: 'Security Monitoring Agent',
      description: 'Monitors collateral value, triggers margin calls, tracks LTV',
      icon: 'Shield',
      color: '#065F46',
      stats: { securities: 78, alerts: 5, coverage: '1.45x' },
      status: 'coming_soon'
    }
  ];
  
  res.json(agents);
});

// Get specific agent configuration
router.get('/agents/:agentId', (req, res) => {
  const { agentId } = req.params;
  
  if (agentId === 'covenant-monitoring') {
    res.json(COVENANT_AGENT_CONFIG);
  } else {
    res.status(404).json({ error: 'Agent not found or not yet implemented' });
  }
});

// Get demo data for covenant monitoring agent
router.get('/covenant-monitoring/data', async (req, res) => {
  try {
    const issuers = await readMaster('issuers.json');
    const issues = await readMaster('ncd_issues.json');
    const covenantLibrary = await readMaster('covenant_library.json');
    const issueCovenants = await readMaster('issue_covenants.json');
    const financialData = await readMaster('financial_data.json');
    
    // Get demo issuer (Tata Motors)
    const demoIssuer = issuers.find(i => i.id === 'ISS001');
    const demoIssue = issues.find(i => i.id === 'NCD001');
    const demoFinancials = financialData.find(f => f.issuer_id === 'ISS001' && f.period === 'Q3 FY25');
    const demoCovenants = issueCovenants.find(ic => ic.issue_id === 'NCD001');
    
    // Calculate actual ratios for demo
    const bs = demoFinancials?.balance_sheet || {};
    const pl = demoFinancials?.profit_and_loss || {};
    const other = demoFinancials?.other_data || {};
    
    const calculatedRatios = [
      {
        id: 'COV001',
        name: 'Debt/Equity',
        threshold: 2.0,
        actual: Math.round((bs.total_debt / bs.total_equity) * 100) / 100,
        comparison: '≤',
        unit: 'ratio',
        status: 'compliant'
      },
      {
        id: 'COV002',
        name: 'ICR',
        threshold: 1.5,
        actual: Math.round((pl.ebitda / pl.interest_expense) * 100) / 100,
        comparison: '≥',
        unit: 'times',
        status: 'compliant'
      },
      {
        id: 'COV003',
        name: 'Current Ratio',
        threshold: 1.2,
        actual: Math.round((bs.current_assets / bs.current_liabilities) * 100) / 100,
        comparison: '≥',
        unit: 'ratio',
        status: 'breach'
      },
      {
        id: 'COV004',
        name: 'DSCR',
        threshold: 1.25,
        actual: Math.round(((pl.pat + pl.depreciation + pl.interest_expense) / (pl.interest_expense + other.principal_repayment)) * 100) / 100,
        comparison: '≥',
        unit: 'times',
        status: 'compliant'
      },
      {
        id: 'COV005',
        name: 'Asset Cover',
        threshold: 1.25,
        actual: Math.round((other.security_value / other.outstanding_debt) * 100) / 100,
        comparison: '≥',
        unit: 'times',
        status: 'compliant'
      },
      {
        id: 'COV006',
        name: 'Net Worth',
        threshold: 5000,
        actual: bs.total_equity,
        comparison: '≥',
        unit: '₹ Cr',
        status: 'compliant'
      }
    ];
    
    res.json({
      issuer: demoIssuer,
      issue: demoIssue,
      financials: demoFinancials,
      covenants: demoCovenants,
      calculatedRatios,
      extractedData: {
        balance_sheet: [
          { item: 'Total Assets', value: bs.total_assets, unit: '₹ Cr' },
          { item: 'Total Liabilities', value: bs.total_liabilities, unit: '₹ Cr' },
          { item: 'Total Equity', value: bs.total_equity, unit: '₹ Cr' },
          { item: 'Total Debt', value: bs.total_debt, unit: '₹ Cr' },
          { item: 'Current Assets', value: bs.current_assets, unit: '₹ Cr' },
          { item: 'Current Liabilities', value: bs.current_liabilities, unit: '₹ Cr' }
        ],
        profit_loss: [
          { item: 'Total Revenue', value: pl.total_revenue, unit: '₹ Cr' },
          { item: 'EBITDA', value: pl.ebitda, unit: '₹ Cr' },
          { item: 'Depreciation', value: pl.depreciation, unit: '₹ Cr' },
          { item: 'Interest Expense', value: pl.interest_expense, unit: '₹ Cr' },
          { item: 'PAT', value: pl.pat, unit: '₹ Cr' }
        ]
      },
      breach: {
        covenant_id: 'COV003',
        covenant_name: 'Current Ratio',
        threshold: 1.2,
        actual: 1.10,
        deviation_pct: 8.33,
        severity: 'technical',
        trust_deed_section: '8.2(c)',
        cure_period_days: 30,
        cure_deadline: '2026-02-12'
      }
    });
    
  } catch (error) {
    console.error('Demo data error:', error);
    res.status(500).json({ error: 'Failed to load demo data' });
  }
});

// Get commentary for each sub-agent
router.get('/covenant-monitoring/commentary/:subAgentId', (req, res) => {
  const { subAgentId } = req.params;
  
  const commentaries = {
    'document-ingestion': [
      "Document Ingestion Agent has started processing the uploaded financial statement.",
      "I'm using AI to identify and extract key financial line items from the PDF.",
      "Found Balance Sheet on page 12 with 18 line items.",
      "Extracted Profit & Loss statement with quarterly comparison data.",
      "All key financial metrics successfully extracted and structured."
    ],
    'data-validation': [
      "Data Validation Agent is verifying the extracted financial data.",
      "Checking if Balance Sheet balances... Assets (₹1,24,560 Cr) equals Liabilities + Equity (₹89,440 + ₹35,120 = ₹1,24,560 Cr).",
      "Perfect match! Validating all mandatory fields are present.",
      "Cross-checking against previous quarter for reasonableness.",
      "Data quality score: 98/100. All validations passed."
    ],
    'ratio-calculation': [
      "Ratio Calculation Agent is computing financial ratios defined in the Trust Deed.",
      "Debt-to-Equity = ₹48,230 Cr / ₹35,120 Cr = 1.37",
      "Interest Coverage = ₹8,450 Cr / ₹2,340 Cr = 3.61x",
      "Current Ratio = ₹42,100 Cr / ₹38,200 Cr = 1.10",
      "I'm seeing a potential issue with Current Ratio - it's below the 1.2 threshold.",
      "All 6 covenant ratios computed. Proceeding to threshold comparison."
    ],
    'covenant-comparison': [
      "Covenant Comparison Agent is checking each ratio against Trust Deed thresholds.",
      "Loading thresholds from Trust Deed dated 10-Mar-2024...",
      "Debt/Equity: 1.37 ≤ 2.0 ✓ COMPLIANT",
      "ICR: 3.61x ≥ 1.5x ✓ COMPLIANT",
      "Current Ratio: 1.10 < 1.2 ⚠️ BREACH DETECTED",
      "5 out of 6 covenants are compliant. One breach identified."
    ],
    'breach-detection': [
      "Breach Detection Agent is formally documenting the covenant breach.",
      "Covenant: Current Ratio (Section 8.2(c) of Trust Deed)",
      "Required threshold: ≥ 1.20, Actual value: 1.10",
      "This is the first breach of this covenant for this issuer.",
      "Cure period as per Trust Deed: 30 days from detection date.",
      "Breach recorded. Moving to severity classification."
    ],
    'severity-classification': [
      "Severity Classification Agent is analyzing the breach magnitude.",
      "Deviation from threshold: 8.33% (shortfall)",
      "Checking against severity rules in Trust Deed...",
      "Technical Breach: ≤10% deviation - MATCHES",
      "Classification: TECHNICAL BREACH",
      "This means standard cure period applies with no immediate enforcement action."
    ],
    'notice-generation': [
      "Notice Generation Agent is preparing the formal breach notice.",
      "Using template: 'Technical Breach - First Notice'",
      "Auto-populating issuer details and covenant specifics from Trust Deed.",
      "Cure deadline calculated: 12-Feb-2026 (30 days from today).",
      "Notice includes request for remediation plan within 7 days.",
      "Draft notice ready for your review before dispatch to issuer."
    ]
  };
  
  res.json({
    subAgentId,
    commentary: commentaries[subAgentId] || []
  });
});

module.exports = router;
