import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import { 
  FileCheck, FileSearch, Lock, Building, Users, Shield, 
  ChevronRight, LogOut, Settings, Database, Clock, AlertTriangle,
  CheckCircle, TrendingUp
} from 'lucide-react';

const agentIcons = {
  'FileCheck': FileCheck,
  'FileSearch': FileSearch,
  'Vault': Lock,
  'Building': Building,
  'Users': Users,
  'Shield': Shield,
};

export default function AgentHome() {
  const [agents, setAgents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [agentsRes, summaryRes] = await Promise.all([
        fetch(`${API_URL}/api/demo/agents`),
        fetch(`${API_URL}/api/masters/summary/dashboard`)
      ]);
      
      const agentsData = await agentsRes.json();
      const summaryData = await summaryRes.json();
      
      setAgents(agentsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentClick = (agent) => {
    if (agent.status === 'active') {
      if (agent.id === 'covenant-monitoring') {
        navigate('/agent/covenant-monitoring');
      } else if (agent.id === 'document-intelligence') {
        navigate('/agent/document-intelligence');
      } else if (agent.id === 'escrow-lifecycle') {
        navigate('/agent/escrow-lifecycle');
      } else if (agent.id === 'regulatory-filing') {
        navigate('/agent/regulatory-filing');
      } else if (agent.id === 'investor-communication') {
        navigate('/agent/investor-communication');
      } else {
        navigate(`/agent/${agent.id}`);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-axis-200 border-t-axis-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.jpg" 
                alt="Agentic Trustee Services" 
                className="h-16 w-auto"
              />
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/masters')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Masters</span>
              </button>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.designation}</p>
                </div>
                <div className="w-10 h-10 gradient-axis rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.avatar || 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-display text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-gray-600">
            Select an AI agent to monitor and manage trustee operations
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Issuers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.total_issuers}</p>
              <p className="text-xs text-gray-500 mt-1">{summary.active_issuers} active</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm text-gray-500">NCD Issues</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.total_issues}</p>
              <p className="text-xs text-gray-500 mt-1">{summary.total_outstanding_formatted} outstanding</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm text-gray-500">Active Breaches</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.active_breaches}</p>
              <p className="text-xs text-gray-500 mt-1">{summary.breaches_in_cure_period} in cure period</p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-100 card-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm text-gray-500">Compliance Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.compliance_rate}%</p>
              <p className="text-xs text-gray-500 mt-1">{summary.compliant_issuers} compliant issuers</p>
            </div>
          </div>
        )}

        {/* Agent Cards */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Agents</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const IconComponent = agentIcons[agent.icon] || FileCheck;
            const isActive = agent.status === 'active';
            
            return (
              <div
                key={agent.id}
                onClick={() => handleAgentClick(agent)}
                className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  isActive 
                    ? 'cursor-pointer hover:border-axis-200 hover:shadow-lg card-shadow' 
                    : 'opacity-70'
                }`}
              >
                {/* Agent Header */}
                <div 
                  className="p-6 pb-4"
                  style={{ borderBottom: `3px solid ${agent.color}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${agent.color}15` }}
                    >
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: agent.color }} 
                      />
                    </div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {agent.name}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {agent.description}
                  </p>
                </div>

                {/* Agent Stats */}
                <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                  <div className="flex gap-4">
                    {agent.stats && Object.entries(agent.stats).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <p className="text-sm font-semibold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                  {isActive && (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
