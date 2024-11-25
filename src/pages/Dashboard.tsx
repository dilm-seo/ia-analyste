import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import NewsFeed from '../components/NewsFeed';
import TradingSignals from '../components/TradingSignals';
import type { NewsItem, TradingSignal } from '../types';
import { useTranslation } from 'react-i18next';
import { analyzeNewsWithAI } from '../services/openai';
import { sendNotification } from '../services/notifications';
import { setCacheItem, getCacheItem } from '../utils/cache';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Dashboard() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [signals, setSignals] = useLocalStorage<TradingSignal[]>('trading_signals', []);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const fetchNews = async () => {
    try {
      const cachedNews = getCacheItem<NewsItem[]>('latest_news');
      if (cachedNews) {
        setNews(cachedNews);
        return;
      }

      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          'https://www.forexlive.com/feed/news'
        )}`
      );
      const text = await response.text();
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      const items = xml.querySelectorAll('item');

      const newsItems: NewsItem[] = Array.from(items).map((item) => ({
        title: item.querySelector('title')?.textContent || '',
        pubDate: item.querySelector('pubDate')?.textContent || '',
        description: item.querySelector('description')?.textContent || '',
        link: item.querySelector('link')?.textContent || '',
        sentiment: 'neutral',
        impact: 'low',
        keywords: [],
      }));

      setNews(newsItems);
      setCacheItem('latest_news', newsItems);
    } catch (error) {
      toast.error(t('errorFetchingNews'));
    }
  };

  const analyzeNews = async () => {
    setLoading(true);
    try {
      const apiKey = localStorage.getItem('openaiKey');
      const model = localStorage.getItem('openaiModel') || 'gpt-4';

      if (!apiKey) {
        toast.error(t('noApiKey'));
        return;
      }

      const { analyzedNews, signal } = await analyzeNewsWithAI(
        news.slice(0, 3),
        apiKey,
        model
      );
      
      setNews(prevNews => [
        ...analyzedNews,
        ...prevNews.slice(analyzedNews.length),
      ]);
      
      setSignals(prev => [signal, ...prev]);
      await sendNotification(signal);
      
      toast.success(t('analysisComplete'));
    } catch (error) {
      toast.error(t('errorAnalyzing'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NewsFeed news={news} onAnalyze={analyzeNews} loading={loading} />
        <TradingSignals signals={signals} />
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}