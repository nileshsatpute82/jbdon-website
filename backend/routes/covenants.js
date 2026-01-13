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

async function writeMaster(filename, data) {
  const filePath = path.join(MASTERS_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Calculate covenant ratio
function calculateRatio(covenant, financials) {
  const bs = financials.balance_sheet || {};
  const pl = financials.profit_and_loss || {};
  const other = financials.other_data || {};
  
  // Combine all data sources
  const data = { ...bs, ...pl, ...other };
  
  switch (covenant.id) {
    case 'COV001': // Debt to Equity
      return data.total_debt / data.total_equity;
    case 'COV002': // Interest Coverage
      return data.ebitda / data.interest_expense;
    case 'COV003': // Current Ratio
      return data.current_assets / data.current_liabilities;
    case 'COV004': // DSCR
      const numerator = data.pat + data.depreciation + data.interest_expense;
      const denominator = data.interest_expense + (data.principal_repayment || 0);
      return numerator / denominator;
    case 'COV005': // Asset Coverage
      return data.security_value / data.outstanding_debt;
    case 'COV006': // Minimum Net Worth
      return data.total_equity;
    case 'COV007': // Debt/EBITDA
      return data.total_debt / data.ebitda;
    case 'COV008': // ROCE
      return (data.ebit / data.capital_employed) * 100;
    case 'COV013': // NPA Ratio
      return (data.gross_npa / data.total_advances) * 100;
    case 'COV014': // CAR
      return ((data.tier1_capital + data.tier2_capital) / data.risk_weighted_assets) * 100;
    default:
      return null;
  }
}

// Check if covenant is breached
function checkBreach(covenant, actualValue, threshold) {
  const comparison = covenant.comparison;
  
  switch (comparison) {
    case 'lte':
      return actualValue > threshold;
    case 'gte':
      return actualValue < threshold;
    case 'lt':
      return actualValue >= threshold;
    case 'gt':
      return actualValue <= threshold;
    case 'eq':
      return actualValue !== threshold;
    default:
      return false;
  }
}

// Calculate deviation percentage
function calculateDeviation(covenant, actualValue, threshold) {
  if (covenant.comparison === 'lte' || covenant.comparison === 'lt') {
    // For "less than" covenants, deviation is how much we exceeded
    return ((actualValue - threshold) / threshold) * 100;
  } else {
    // For "greater than" covenants, deviation is how much we fell short
    return ((threshold - actualValue) / threshold) * 100;
  }
}

// Classify breach severity
function classifySeverity(deviationPct, severityRules) {
  const absDeviation = Math.abs(deviationPct);
  
  if (absDeviation >= (severityRules?.critical?.deviation_pct || 50)) {
    return 'critical';
  } else if (absDeviation >= (severityRules?.material?.deviation_pct || 25)) {
    return 'material';
  } else {
    return 'technical';
  }
}

// Test all covenants for an issue
router.post('/test/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params;
    const { financials, period } = req.body;
    
    const issues = await readMaster('ncd_issues.json');
    const issueCovenants = await readMaster('issue_covenants.json');
    const covenantLibrary = await readMaster('covenant_library.json');
    
    const issue = issues.find(i => i.id === issueId);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    
    const issueCovConfig = issueCovenants.find(ic => ic.issue_id === issueId);
    if (!issueCovConfig) {
      return res.status(404).json({ error: 'Covenant configuration not found' });
    }
    
    const results = [];
    const breaches = [];
    
    for (const covConfig of issueCovConfig.covenants) {
      const covenantDef = covenantLibrary.find(c => c.id === covConfig.covenant_id);
      if (!covenantDef) continue;
      
      const actualValue = calculateRatio(covenantDef, financials);
      if (actualValue === null) continue;
      
      const isBreach = checkBreach(covenantDef, actualValue, covConfig.threshold);
      const deviationPct = isBreach ? calculateDeviation(covenantDef, actualValue, covConfig.threshold) : 0;
      const severity = isBreach ? classifySeverity(deviationPct, covConfig.severity_rules) : null;
      
      const result = {
        covenant_id: covenantDef.id,
        covenant_name: covenantDef.name,
        short_name: covenantDef.short_name,
        threshold: covConfig.threshold,
        comparison: covenantDef.comparison,
        comparison_display: covenantDef.comparison_display,
        unit: covenantDef.unit,
        actual_value: Math.round(actualValue * 100) / 100,
        status: isBreach ? 'breach' : 'compliant',
        deviation_pct: Math.round(deviationPct * 100) / 100,
        severity,
        trust_deed_section: covConfig.trust_deed_section,
        cure_period_days: covConfig.cure_period_days
      };
      
      results.push(result);
      
      if (isBreach) {
        breaches.push({
          ...result,
          issue_id: issueId,
          issuer_id: issue.issuer_id,
          testing_period: period
        });
      }
    }
    
    res.json({
      issue_id: issueId,
      issuer_id: issue.issuer_id,
      period,
      testing_date: new Date().toISOString(),
      covenants_tested: results.length,
      covenants_compliant: results.filter(r => r.status === 'compliant').length,
      covenants_breached: breaches.length,
      overall_status: breaches.length > 0 ? 'breach' : 'compliant',
      results,
      breaches
    });
    
  } catch (error) {
    console.error('Covenant testing error:', error);
    res.status(500).json({ error: 'Failed to test covenants' });
  }
});

// Record a breach
router.post('/breach', async (req, res) => {
  try {
    const breachData = req.body;
    const breachLog = await readMaster('breach_log.json');
    const issuers = await readMaster('issuers.json');
    const covenantLibrary = await readMaster('covenant_library.json');
    
    const issuer = issuers.find(i => i.id === breachData.issuer_id);
    const covenant = covenantLibrary.find(c => c.id === breachData.covenant_id);
    
    // Calculate cure deadline
    const cureDeadline = new Date();
    cureDeadline.setDate(cureDeadline.getDate() + (breachData.cure_period_days || 30));
    
    const newBreach = {
      id: `BR${String(breachLog.length + 1).padStart(3, '0')}`,
      issue_id: breachData.issue_id,
      issuer_id: breachData.issuer_id,
      covenant_id: breachData.covenant_id,
      covenant_name: covenant?.name || breachData.covenant_name,
      detection_date: new Date().toISOString().split('T')[0],
      testing_period: breachData.testing_period,
      threshold: breachData.threshold,
      actual_value: breachData.actual_value,
      deviation_pct: breachData.deviation_pct,
      severity: breachData.severity,
      trust_deed_section: breachData.trust_deed_section,
      cure_period_days: breachData.cure_period_days || 30,
      cure_deadline: cureDeadline.toISOString().split('T')[0],
      status: 'active',
      notice_sent: false,
      notice_date: null,
      remediation_plan_received: false,
      remediation_plan_date: null,
      cured: false,
      cure_date: null,
      escalated: false,
      escalation_date: null,
      assigned_rm: issuer?.assigned_rm || 'RM001',
      notes: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    breachLog.push(newBreach);
    await writeMaster('breach_log.json', breachLog);
    
    res.json({ success: true, breach: newBreach });
    
  } catch (error) {
    console.error('Record breach error:', error);
    res.status(500).json({ error: 'Failed to record breach' });
  }
});

// Generate notice for a breach
router.post('/notice/:breachId', async (req, res) => {
  try {
    const { breachId } = req.params;
    
    const breachLog = await readMaster('breach_log.json');
    const noticeTemplates = await readMaster('notice_templates.json');
    const issues = await readMaster('ncd_issues.json');
    const issuers = await readMaster('issuers.json');
    const covenantLibrary = await readMaster('covenant_library.json');
    
    const breach = breachLog.find(b => b.id === breachId);
    if (!breach) {
      return res.status(404).json({ error: 'Breach not found' });
    }
    
    const issue = issues.find(i => i.id === breach.issue_id);
    const issuer = issuers.find(i => i.id === breach.issuer_id);
    const covenant = covenantLibrary.find(c => c.id === breach.covenant_id);
    
    // Select appropriate template based on severity
    const template = noticeTemplates.find(t => 
      t.type === 'breach_notice' && t.severity === breach.severity
    ) || noticeTemplates.find(t => t.type === 'breach_notice');
    
    if (!template) {
      return res.status(404).json({ error: 'Notice template not found' });
    }
    
    // Replace placeholders
    const replacements = {
      '{{series_name}}': issue?.series_name || '',
      '{{isin}}': issue?.isin || '',
      '{{trust_deed_date}}': issue?.trust_deed_date || '',
      '{{issuer_name}}': issuer?.name || '',
      '{{testing_period}}': breach.testing_period || '',
      '{{covenant_name}}': breach.covenant_name || '',
      '{{trust_deed_section}}': breach.trust_deed_section || '',
      '{{comparison_display}}': covenant?.comparison_display || '',
      '{{threshold}}': breach.threshold?.toString() || '',
      '{{unit}}': covenant?.unit || '',
      '{{actual_value}}': breach.actual_value?.toString() || '',
      '{{deviation_pct}}': breach.deviation_pct?.toString() || '',
      '{{cure_period_days}}': breach.cure_period_days?.toString() || '',
      '{{cure_deadline}}': breach.cure_deadline || ''
    };
    
    let subject = template.subject;
    let body = template.body;
    
    for (const [placeholder, value] of Object.entries(replacements)) {
      subject = subject.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
      body = body.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    
    res.json({
      breach_id: breachId,
      template_id: template.id,
      template_name: template.name,
      subject,
      body,
      recipient: {
        name: issuer?.contact_person,
        designation: issuer?.contact_designation,
        email: issuer?.contact_email,
        address: issuer?.registered_address
      }
    });
    
  } catch (error) {
    console.error('Generate notice error:', error);
    res.status(500).json({ error: 'Failed to generate notice' });
  }
});

module.exports = router;
