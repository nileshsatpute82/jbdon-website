const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const MASTERS_DIR = path.join(__dirname, '../data/masters');

// Helper to read master file
async function readMaster(filename) {
  try {
    const filePath = path.join(MASTERS_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Helper to write master file
async function writeMaster(filename, data) {
  try {
    const filePath = path.join(MASTERS_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Get all masters list
router.get('/', async (req, res) => {
  const masters = [
    { id: 'issuers', name: 'Issuers', description: 'Company/Issuer master data', file: 'issuers.json' },
    { id: 'ncd_issues', name: 'NCD Issues', description: 'NCD issue details with ISIN', file: 'ncd_issues.json' },
    { id: 'covenant_library', name: 'Covenant Library', description: 'Standard covenant definitions', file: 'covenant_library.json' },
    { id: 'issue_covenants', name: 'Issue Covenants', description: 'Covenant-to-issue mapping', file: 'issue_covenants.json' },
    { id: 'financial_data', name: 'Financial Data', description: 'Uploaded financial statements', file: 'financial_data.json' },
    { id: 'compliance_status', name: 'Compliance Status', description: 'Compliance testing results', file: 'compliance_status.json' },
    { id: 'breach_log', name: 'Breach Log', description: 'Breach history and tracking', file: 'breach_log.json' },
    { id: 'notice_templates', name: 'Notice Templates', description: 'Notice and letter templates', file: 'notice_templates.json' },
    { id: 'alert_rules', name: 'Alert Rules', description: 'Alert and escalation rules', file: 'alert_rules.json' },
    { id: 'users', name: 'Users', description: 'User and RM master', file: 'users.json' }
  ];
  res.json(masters);
});

// Generic GET for any master
router.get('/:masterName', async (req, res) => {
  const { masterName } = req.params;
  const filename = `${masterName.replace(/-/g, '_')}.json`;
  const data = await readMaster(filename);
  res.json(data);
});

// Generic POST to add item to master
router.post('/:masterName', async (req, res) => {
  const { masterName } = req.params;
  const filename = `${masterName.replace(/-/g, '_')}.json`;
  const newItem = req.body;
  
  const data = await readMaster(filename);
  
  // Generate ID if not provided
  if (!newItem.id) {
    const prefix = masterName.substring(0, 3).toUpperCase();
    const maxId = data.reduce((max, item) => {
      const num = parseInt(item.id?.replace(/\D/g, '') || '0');
      return num > max ? num : max;
    }, 0);
    newItem.id = `${prefix}${String(maxId + 1).padStart(3, '0')}`;
  }
  
  newItem.created_at = new Date().toISOString();
  data.push(newItem);
  
  const success = await writeMaster(filename, data);
  if (success) {
    res.json({ success: true, item: newItem });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Generic PUT to update item in master
router.put('/:masterName/:itemId', async (req, res) => {
  const { masterName, itemId } = req.params;
  const filename = `${masterName.replace(/-/g, '_')}.json`;
  const updates = req.body;
  
  const data = await readMaster(filename);
  const index = data.findIndex(item => item.id === itemId);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  data[index] = { ...data[index], ...updates, updated_at: new Date().toISOString() };
  
  const success = await writeMaster(filename, data);
  if (success) {
    res.json({ success: true, item: data[index] });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Generic DELETE to remove item from master
router.delete('/:masterName/:itemId', async (req, res) => {
  const { masterName, itemId } = req.params;
  const filename = `${masterName.replace(/-/g, '_')}.json`;
  
  const data = await readMaster(filename);
  const filteredData = data.filter(item => item.id !== itemId);
  
  if (filteredData.length === data.length) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const success = await writeMaster(filename, filteredData);
  if (success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// Get enriched issuer data with issues and covenants
router.get('/enriched/issuers', async (req, res) => {
  const issuers = await readMaster('issuers.json');
  const issues = await readMaster('ncd_issues.json');
  const issueCovenants = await readMaster('issue_covenants.json');
  const complianceStatus = await readMaster('compliance_status.json');
  const breachLog = await readMaster('breach_log.json');
  
  const enrichedIssuers = issuers.map(issuer => {
    const issuerIssues = issues.filter(i => i.issuer_id === issuer.id);
    const issuerBreaches = breachLog.filter(b => b.issuer_id === issuer.id && b.status === 'active');
    
    // Get latest compliance status
    const latestCompliance = complianceStatus
      .filter(c => c.issuer_id === issuer.id)
      .sort((a, b) => new Date(b.testing_date) - new Date(a.testing_date))[0];
    
    return {
      ...issuer,
      issues: issuerIssues,
      issue_count: issuerIssues.length,
      total_outstanding: issuerIssues.reduce((sum, i) => sum + i.outstanding_amount, 0),
      active_breaches: issuerBreaches.length,
      latest_compliance: latestCompliance,
      overall_status: issuerBreaches.length > 0 ? 'breach' : (latestCompliance?.overall_status || 'pending')
    };
  });
  
  res.json(enrichedIssuers);
});

// Get dashboard summary
router.get('/summary/dashboard', async (req, res) => {
  const issuers = await readMaster('issuers.json');
  const issues = await readMaster('ncd_issues.json');
  const breachLog = await readMaster('breach_log.json');
  const complianceStatus = await readMaster('compliance_status.json');
  
  const activeBreaches = breachLog.filter(b => b.status === 'active');
  const curedBreaches = breachLog.filter(b => b.status === 'cured');
  
  // Calculate total outstanding
  const totalOutstanding = issues.reduce((sum, i) => sum + i.outstanding_amount, 0);
  
  // Get compliance stats
  const compliantIssuers = new Set(
    complianceStatus
      .filter(c => c.overall_status === 'compliant')
      .map(c => c.issuer_id)
  ).size;
  
  const summary = {
    total_issuers: issuers.length,
    active_issuers: issuers.filter(i => i.status === 'active').length,
    total_issues: issues.length,
    total_outstanding: totalOutstanding,
    total_outstanding_formatted: `₹${(totalOutstanding / 100).toFixed(0)} Cr`,
    active_breaches: activeBreaches.length,
    breaches_in_cure_period: activeBreaches.filter(b => new Date(b.cure_deadline) > new Date()).length,
    cured_breaches: curedBreaches.length,
    compliant_issuers: compliantIssuers,
    compliance_rate: ((compliantIssuers / issuers.length) * 100).toFixed(1),
    critical_breaches: activeBreaches.filter(b => b.severity === 'critical').length,
    material_breaches: activeBreaches.filter(b => b.severity === 'material').length,
    technical_breaches: activeBreaches.filter(b => b.severity === 'technical').length
  };
  
  res.json(summary);
});

module.exports = router;
