export interface NewsItem {
  title: string;
  pubDate: string;
  description: string;
  link: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  keywords: string[];
}

export interface TradingSignal {
  timestamp: string;
  action: 'buy' | 'sell' | 'wait';
  confidence: number;
  newsSource: NewsItem[];
  pair: string;
}

export interface Settings {
  openaiKey: string;
  openaiModel: string;
  language: 'en' | 'fr';
  notificationEmail?: string;
  webhookUrl?: string;
}