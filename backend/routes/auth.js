const express = require('express');
const router = express.Router();
const { ConfidentialClientApplication } = require('@azure/msal-node');

// MSAL Configuration
const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || 'demo-client-id',
    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET || 'demo-secret'
  }
};

const pca = new ConfidentialClientApplication(msalConfig);
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:3001/api/auth/callback';

// Demo users for testing (when O365 is not configured)
const demoUsers = {
  'demo@axistrustee.com': {
    id: 'USR001',
    name: 'Priya Sharma',
    email: 'priya.sharma@axistrustee.com',
    role: 'relationship_manager',
    designation: 'Senior Manager',
    avatar: 'PS'
  }
};

// Get login URL
router.get('/login', async (req, res) => {
  try {
    // Check if Azure AD is configured
    if (process.env.AZURE_CLIENT_ID && process.env.AZURE_CLIENT_ID !== 'demo-client-id') {
      const authUrl = await pca.getAuthCodeUrl({
        scopes: ['user.read', 'openid', 'profile', 'email'],
        redirectUri: REDIRECT_URI
      });
      res.json({ authUrl, mode: 'sso' });
    } else {
      // Demo mode
      res.json({ authUrl: null, mode: 'demo' });
    }
  } catch (error) {
    console.error('Login URL error:', error);
    res.status(500).json({ error: 'Failed to generate login URL' });
  }
});

// Handle OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    const tokenResponse = await pca.acquireTokenByCode({
      code,
      scopes: ['user.read', 'openid', 'profile', 'email'],
      redirectUri: REDIRECT_URI
    });

    // Get user info from token
    const user = {
      id: tokenResponse.account.homeAccountId,
      name: tokenResponse.account.name,
      email: tokenResponse.account.username,
      role: 'relationship_manager',
      designation: 'Manager',
      avatar: tokenResponse.account.name.split(' ').map(n => n[0]).join('')
    };

    req.session.user = user;
    req.session.accessToken = tokenResponse.accessToken;

    // Redirect to frontend
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173');
  } catch (error) {
    console.error('Callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=auth_failed`);
  }
});

// Demo login (for testing without O365)
router.post('/demo-login', (req, res) => {
  const { email } = req.body;
  
  // Create demo user session
  const user = {
    id: 'USR001',
    name: 'Nilesh Satpute',
    email: email || 'nilesh@axistrustee.com',
    role: 'super_admin',
    designation: 'Super Admin',
    avatar: 'NS'
  };

  req.session.user = user;
  res.json({ success: true, user });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;
