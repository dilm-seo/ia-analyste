import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, AlertTriangle } from 'lucide-react';
import type { TradingSignal } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

interface TradingSignalsProps {
  signals: TradingSignal[];
}

export default function TradingSignals({ signals }: TradingSignalsProps) {
  const { t } = useTranslation();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return <ArrowUpCircle className="h-6 w-6 text-green-500" />;
      case 'sell':
        return <ArrowDownCircle className="h-6 w-6 text-red-500" />;
      default:
        return <MinusCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sell':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const chartData = signals.map(signal => ({
    timestamp: new Date(signal.timestamp).toLocaleTimeString(),
    confidence: signal.confidence * 100,
    action: signal.action,
  }));

  if (signals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('tradingSignals')}</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <AlertTriangle className="h-12 w-12 mb-4" />
          <p className="text-lg">{t('noSignalsYet')}</p>
          <p className="text-sm text-center mt-2">{t('analyzeNewsToGenerateSignals')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('tradingSignals')}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="h-64">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('confidenceTrend')}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="confidence" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{t('signalDistribution')}</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="confidence"
                fill="#4F46E5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        {signals.map((signal, index) => (
          <div
            key={index}
            className={`border-2 rounded-lg p-4 hover:shadow-md transition ${getActionColor(
              signal.action
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getActionIcon(signal.action)}
                <div>
                  <h3 className="font-semibold text-lg">
                    {signal.pair} - {t(signal.action)}
                  </h3>
                  <p className="text-sm opacity-75">
                    {new Date(signal.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {(signal.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm opacity-75">{t('confidence')}</div>
              </div>
            </div>
            
            {signal.newsSource.length > 0 && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <p className="text-sm font-medium mb-1">{t('basedOnNews')}:</p>
                <ul className="text-sm space-y-1 opacity-75">
                  {signal.newsSource.map((news, idx) => (
                    <li key={idx} className="truncate">• {news.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}