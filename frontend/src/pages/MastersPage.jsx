import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../utils/api';
import { 
  ArrowLeft, Database, Building, FileText, Scale, AlertTriangle,
  Bell, Users, Settings, ChevronRight, Search, Plus, Edit, Trash2,
  Save, X, RefreshCw
} from 'lucide-react';

const MASTER_ICONS = {
  issuers: Building,
  ncd_issues: FileText,
  covenant_library: Scale,
  issue_covenants: Settings,
  financial_data: Database,
  compliance_status: AlertTriangle,
  breach_log: AlertTriangle,
  notice_templates: Bell,
  alert_rules: Bell,
  users: Users,
};

export default function MastersPage() {
  const { masterName } = useParams();
  const [masters, setMasters] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMasters();
  }, []);

  useEffect(() => {
    if (masterName) {
      loadMasterData(masterName);
    } else {
      setSelectedMaster(null);
      setMasterData([]);
    }
  }, [masterName]);

  const loadMasters = async () => {
    try {
      const response = await fetch(`${API_URL}/api/masters`);
      const data = await response.json();
      setMasters(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load masters:', error);
      setLoading(false);
    }
  };

  const loadMasterData = async (name) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/masters/${name}`);
      const data = await response.json();
      setMasterData(data);
      setSelectedMaster(masters.find(m => m.id === name) || { id: name, name: name });
    } catch (error) {
      console.error('Failed to load master data:', error);
    }
    setLoading(false);
  };

  const handleMasterClick = (master) => {
    navigate(`/masters/${master.id}`);
  };

  const getDisplayColumns = (masterName) => {
    const columnConfigs = {
      issuers: ['name', 'sector', 'credit_rating', 'assigned_rm', 'status'],
      ncd_issues: ['isin', 'series_name', 'issue_size', 'coupon_rate', 'maturity_date'],
      covenant_library: ['name', 'category', 'default_threshold', 'testing_frequency'],
      issue_covenants: ['issue_id', 'issuer_id'],
      financial_data: ['issuer_id', 'period', 'submission_date', 'status'],
      compliance_status: ['issue_id', 'period', 'overall_status', 'covenants_tested'],
      breach_log: ['issuer_id', 'covenant_name', 'severity', 'status', 'cure_deadline'],
      notice_templates: ['name', 'type', 'severity'],
      alert_rules: ['name', 'trigger_type', 'priority'],
      users: ['name', 'email', 'role', 'designation'],
    };
    return columnConfigs[masterName] || ['id', 'name'];
  };

  const filteredData = masterData.filter(item => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchLower)
    );
  });

  if (loading && !selectedMaster) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-axis-200 border-t-axis-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading masters...</p>
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
              <button
                onClick={() => masterName ? navigate('/masters') : navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-axis-100 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-axis-700" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    {selectedMaster ? selectedMaster.name : 'Masters Management'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {selectedMaster ? `${filteredData.length} records` : 'Configure system data'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.name}</span>
              <div className="w-9 h-9 gradient-axis rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.avatar}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {!masterName ? (
          /* Masters List View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {masters.map((master) => {
              const Icon = MASTER_ICONS[master.id] || Database;
              return (
                <div
                  key={master.id}
                  onClick={() => handleMasterClick(master)}
                  className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:border-axis-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-axis-50 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-axis-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{master.name}</h3>
                        <p className="text-sm text-gray-500">{master.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Master Data View */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-axis-300"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => loadMasterData(masterName)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 gradient-axis text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                  Add New
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    {getDisplayColumns(masterName).map((col) => (
                      <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {col.replace(/_/g, ' ')}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={getDisplayColumns(masterName).length + 2} className="px-4 py-8 text-center">
                        <div className="w-8 h-8 border-4 border-axis-200 border-t-axis-700 rounded-full animate-spin mx-auto"></div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={getDisplayColumns(masterName).length + 2} className="px-4 py-8 text-center text-gray-500">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">
                          {item.id}
                        </td>
                        {getDisplayColumns(masterName).map((col) => (
                          <td key={col} className="px-4 py-3 text-sm text-gray-900">
                            {typeof item[col] === 'object' 
                              ? JSON.stringify(item[col]).substring(0, 50) + '...'
                              : String(item[col] || '-').substring(0, 50)
                            }
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination placeholder */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
              <span>Showing {filteredData.length} of {masterData.length} records</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
