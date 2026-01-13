# Axis Trustee AI Platform

AI-powered monitoring and compliance platform for debenture trustees. This demo showcases 6 AI agents for trustee operations, with a fully functional **Covenant Monitoring Agent** demo.

## 🏛️ Overview

Axis Trustee Services Limited (a subsidiary of Axis Bank) provides comprehensive trustee and agency services. This platform demonstrates how AI agents can automate and enhance trustee operations.

### AI Agents

| Agent | Status | Description |
|-------|--------|-------------|
| 🔍 Covenant Monitoring | ✅ Active | Monitors NCD covenants, detects breaches, generates notices |
| 📄 Document Intelligence | 🔜 Coming Soon | Analyzes Trust Deeds, extracts key terms |
| 🔐 Escrow Lifecycle | 🔜 Coming Soon | Tracks escrow conditions, manages releases |
| 🏢 Regulatory Filing | 🔜 Coming Soon | Manages SEBI filings, tracks deadlines |
| 👥 Investor Communication | 🔜 Coming Soon | Answers queries, calculates payouts |
| 🛡️ Security Monitoring | 🔜 Coming Soon | Monitors collateral, triggers margin calls |

---

## 🚀 Complete Deployment Guide

### Prerequisites

- GitHub account
- Render account (https://render.com)
- Microsoft 365 admin access (for Azure AD)
- Domain access for atsl.acc.ltd (optional)

---

## Step 1: GitHub Setup

### 1.1 Create Repository

1. Go to https://github.com/new
2. **Repository name**: `axis-trustee-ai`
3. **Visibility**: Private
4. Click **Create repository**

### 1.2 Push Code

```bash
# Extract the zip file
unzip axis-trustee-ai.zip
cd axis-trustee-ai

# Initialize Git
git init

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
.env.production
*.log
.DS_Store
.vscode/
.idea/
EOF

# Commit and push
git add .
git commit -m "Initial commit: Axis Trustee AI Platform"
git remote add origin https://github.com/YOUR_USERNAME/axis-trustee-ai.git
git branch -M main
git push -u origin main
```

---

## Step 2: Azure AD / Office 365 SSO Setup

### 2.1 Register Application

1. Go to **Azure Portal**: https://portal.azure.com
2. Search for **App registrations** → Click **+ New registration**
3. Configure:
   - **Name**: `Axis Trustee AI`
   - **Supported account types**: `Accounts in this organizational directory only`
   - **Redirect URI**: 
     - Platform: `Web`
     - URL: `https://atsl.acc.ltd/api/auth/callback`
4. Click **Register**

### 2.2 Get Application Credentials

From the **Overview** page, copy:
```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  → AZURE_CLIENT_ID
Directory (tenant) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   → AZURE_TENANT_ID
```

### 2.3 Create Client Secret

1. Go to **Certificates & secrets** → **+ New client secret**
2. Description: `Production Key`
3. Expires: `24 months`
4. Click **Add** and copy the **Value** immediately:
```
Client Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxx  → AZURE_CLIENT_SECRET
```

### 2.4 Configure API Permissions

1. Go to **API permissions** → **+ Add a permission**
2. Select **Microsoft Graph** → **Delegated permissions**
3. Add: `openid`, `profile`, `email`, `User.Read`
4. Click **Grant admin consent for [Organization]**

---

## Step 3: Render Deployment

### 3.1 Create Render Account

1. Go to https://render.com
2. Sign up with **GitHub** (for easy repository access)

### 3.2 Deploy Backend

1. Click **New +** → **Web Service**
2. Connect GitHub → Select `axis-trustee-ai` repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `axis-trustee-ai-backend` |
| **Region** | `Singapore` (or closest to users) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Starter` ($7/month) or `Free` for demo |

4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `SESSION_SECRET` | `your-random-32-char-string` |
| `FRONTEND_URL` | `https://atsldemo.acc.ltd` |
| `AZURE_CLIENT_ID` | `your-azure-client-id` |
| `AZURE_TENANT_ID` | `your-azure-tenant-id` |
| `AZURE_CLIENT_SECRET` | `your-azure-client-secret` |
| `REDIRECT_URI` | `https://atsl.acc.ltd/api/auth/callback` |

**Generate SESSION_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Click **Create Web Service**
6. Wait for deployment → Note URL: `https://atsl.acc.ltd`

### 3.3 Deploy Frontend

1. Click **New +** → **Static Site**
2. Connect GitHub → Select `axis-trustee-ai` repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `axis-trustee-ai` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://atsl.acc.ltd` |

5. Add **Redirect/Rewrite Rule** (for SPA routing):
   - Go to **Redirects/Rewrites** tab
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

6. Click **Create Static Site**

### 3.4 Verify Deployment

1. Backend Health: `https://atsl.acc.ltd/api/health`
2. Frontend: `https://atsldemo.acc.ltd`

---

## Step 4: Custom Domain Setup (atsl.acc.ltd)

### 4.1 Backend Domain

1. In Render Backend service → **Settings** → **Custom Domains**
2. Add: `atsl.acc.ltd`
3. Add DNS record:
   ```
   Type: CNAME
   Name: api.atsl
   Value: atsl.acc.ltd
   ```

### 4.2 Frontend Domain

1. In Render Static Site → **Settings** → **Custom Domains**
2. Add: `atsl.acc.ltd`
3. Add DNS records:
   ```
   Type: CNAME
   Name: atsl
   Value: atsldemo.acc.ltd
   ```

### 4.3 Update Environment Variables

**Backend**:
- `FRONTEND_URL` = `https://atsl.acc.ltd`
- `REDIRECT_URI` = `https://atsl.acc.ltd/api/auth/callback`

**Frontend**:
- `VITE_API_URL` = `https://atsl.acc.ltd`

**Azure AD**:
- Update Redirect URI to `https://atsl.acc.ltd/api/auth/callback`

---

## 🧪 Testing the Deployment

1. **Open**: https://atsl.acc.ltd (or Render URL)
2. **Click**: "Continue with Office 365"
3. **Login**: With your Microsoft 365 account
4. **Navigate**: To Covenant Monitoring Agent
5. **Click**: "Run Demo"
6. **Watch**: 7 sub-agents process in sequence

---

## 📁 Project Structure

```
axis-trustee-ai/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js          # O365 SSO
│   │   ├── masters.js       # CRUD APIs
│   │   ├── covenants.js     # Business logic
│   │   └── demo.js          # Demo config
│   └── data/masters/        # JSON data files
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── utils/
│   └── dist/                # Production build
└── README.md
```

---

## 🔧 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check browser console for specific CORS messages

### SSO Not Working
- Verify all Azure AD values are correct
- Check Redirect URI matches exactly (including https://)
- Ensure admin consent was granted for permissions

### 502 Bad Gateway
- Check Render logs for backend errors
- Ensure all environment variables are set
- Verify Node version compatibility

### Build Failures
- Check `Root Directory` is set correctly
- Verify `package.json` exists in the specified directory

---

## 📝 License

Proprietary - Applied Cloud Computing

## 🤝 Support

For support, contact: support@acc.ltd

---

Built with ❤️ by Applied Cloud Computing for Axis Trustee Services Limited
