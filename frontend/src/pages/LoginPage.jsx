import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, FileCheck, Building, CheckCircle, Users } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleO365Login = async () => {
    setLoading(true);
    setError('');
    
    const result = await login('nilesh@axistrustee.com');
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  const stats = [
    { value: '500+', label: 'Issues Monitored' },
    { value: '6', label: 'AI Agents' },
    { value: '₹1.2L Cr', label: 'AUM' },
    { value: '24/7', label: 'Monitoring' },
  ];

  const features = [
    { icon: FileCheck, text: 'Automated covenant monitoring' },
    { icon: Shield, text: 'Real-time breach detection' },
    { icon: Building, text: 'SEBI compliant reporting' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Logo - 75% larger */}
          <div className="flex items-center gap-4 mb-12">
            <img 
              src="/logo.jpg" 
              alt="Agentic Trustee Services" 
              className="h-36 w-auto"
              style={{ height: '140px' }}
            />
          </div>

          {/* Headline */}
          <h2 className="font-display text-4xl lg:text-5xl text-gray-900 mb-3">
            Intelligent Trustee
          </h2>
          <h2 className="font-display text-4xl lg:text-5xl text-axis-700 mb-6">
            Services.
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            AI-powered monitoring and compliance for debenture trustees
          </p>

          {/* Login Card */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <button
              onClick={handleO365Login}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-700 font-medium hover:border-axis-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-axis-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z"/>
                  <path fill="#81bc06" d="M12 1h10v10H12z"/>
                  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                  <path fill="#ffba08" d="M12 12h10v10H12z"/>
                </svg>
              )}
              Continue with Office 365
            </button>

            {error && (
              <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-4">Secure enterprise login</p>
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {feature.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-xs text-gray-400 text-center">
            Powered by Applied Cloud Computing © 2025
          </p>
        </div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden lg:flex w-1/2 gradient-axis p-12 flex-col justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white rounded-full" />
          <div className="absolute bottom-40 right-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 border border-white rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm font-medium">AI-Powered Platform</span>
          </div>

          <h3 className="text-3xl font-display text-white mb-4">
            Smart Covenant Monitoring
          </h3>
          <p className="text-white/80 text-lg mb-10">
            Transform your trustee operations with AI-powered document analysis, 
            automated compliance tracking, and instant breach detection.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Agent Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Analysis Complete</p>
                <p className="text-white/60 text-sm">All covenants tested</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-green-400 rounded-full" />
              </div>
              <span className="text-white text-sm font-medium">85%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
