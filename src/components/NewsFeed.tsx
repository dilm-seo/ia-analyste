import React from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import type { NewsItem } from '../types';

interface NewsFeedProps {
  news: NewsItem[];
  onAnalyze: () => void;
  loading: boolean;
}

function stripHtmlTags(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export default function NewsFeed({ news, onAnalyze, loading }: NewsFeedProps) {
  const { t } = useTranslation();

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{t('latestNews')}</h2>
          <div className="flex gap-3">
            <button
              onClick={onAnalyze}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : null}
              <span>{loading ? t('analyzing') : t('analyzeNews')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {news.map((item, index) => (
          <div
            key={index}
            className="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getSentimentIcon(item.sentiment)}
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-3">
                  {format(new Date(item.pubDate), 'PPp')}
                </p>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {stripHtmlTags(item.description)}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${getImpactColor(
                      item.impact
                    )}`}
                  >
                    {t(`impact.${item.impact}`)}
                  </span>
                  {item.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title={t('readMore')}
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}