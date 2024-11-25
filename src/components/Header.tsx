import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, BarChart3, Rss } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <BarChart3 className="h-8 w-8" />
            <h1 className="text-2xl font-bold">ForexSignals AI</h1>
          </div>
          
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:text-blue-200 transition"
            >
              <Rss className="h-5 w-5" />
              <span>{t('dashboard')}</span>
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center space-x-2 hover:text-blue-200 transition"
            >
              <Settings className="h-5 w-5" />
              <span>{t('settings')}</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}