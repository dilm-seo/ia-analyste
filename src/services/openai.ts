import OpenAI from 'openai';
import type { NewsItem } from '../types';

export async function analyzeNewsWithAI(news: NewsItem[], apiKey: string, model: string) {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  const prompt = `Analyze the following forex news and provide:
1. Sentiment (bullish/bearish/neutral)
2. Impact level (low/medium/high)
3. Related keywords (max 3)
4. Trading recommendation (buy/sell/wait)
5. Confidence score (0-1)
6. Based on the news content, specify the relevant currency pair (e.g., EUR/USD, USD/JPY).

News: ${news.map(item => `
Title: ${item.title}
Description: ${item.description}
`).join('\n')}`;

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a professional forex analyst specializing in news analysis and trading signals.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const analysis = response.choices[0].message.content;

  // Debugging: Print AI response for verification
  console.log('AI Response:', analysis);

  return parseAIResponse(analysis, news);
}

function parseAIResponse(analysis: string, originalNews: NewsItem[]) {
  const lines = analysis.split('\n');
  const newsItems = [...originalNews];
  let currentSignal = {
    action: 'wait' as const,
    confidence: 0.5, // Default confidence
    pair: 'Unknown', // Default pair if not identified
  };

  lines.forEach(line => {
    if (line.includes('Sentiment:')) {
      const sentiment = line.toLowerCase();
      if (sentiment.includes('bullish')) newsItems[0].sentiment = 'bullish';
      else if (sentiment.includes('bearish')) newsItems[0].sentiment = 'bearish';
      else newsItems[0].sentiment = 'neutral';
    } else if (line.includes('Impact:')) {
      const impact = line.toLowerCase();
      if (impact.includes('high')) newsItems[0].impact = 'high';
      else if (impact.includes('medium')) newsItems[0].impact = 'medium';
      else newsItems[0].impact = 'low';
    } else if (line.includes('Keywords:')) {
      newsItems[0].keywords = line
        .replace('Keywords:', '')
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .slice(0, 3);
    } else if (line.includes('Trading recommendation:')) {
      const rec = line.toLowerCase();
      if (rec.includes('buy')) currentSignal.action = 'buy';
      else if (rec.includes('sell')) currentSignal.action = 'sell';
    } else if (line.toLowerCase().includes('confidence')) {
      const confidenceMatch = line.match(/[\d.]+/);
      if (confidenceMatch) {
        currentSignal.confidence = Math.min(Math.max(parseFloat(confidenceMatch[0]), 0.1), 0.95); // Limiter entre 10 % et 95 %
        console.log('Confidence extracted:', currentSignal.confidence); // Debug
      } else {
        console.log('Confidence not found in line:', line); // Debug if extraction fails
      }
    } else if (line.toLowerCase().includes('pair')) {
      currentSignal.pair = line.split(':')[1]?.trim() || 'Unknown';
    }
  });

  // Fallback for confidence score if not extracted
  if (currentSignal.confidence === 0.5) {
    if (newsItems[0].impact === 'high') {
      currentSignal.confidence = 0.75; // Réduire la confiance pour les impacts élevés
    } else if (newsItems[0].impact === 'medium') {
      currentSignal.confidence = 0.6; // Moyen : 60 %
    } else {
      currentSignal.confidence = 0.5; // Faible reste à 50 %
    }
  }

  // Recalibration based on impact and confidence
  if (currentSignal.confidence > 0.9 && newsItems[0].impact !== 'high') {
    currentSignal.confidence = 0.8; // Si confiance > 90% mais impact non élevé, réduire
  }
  if (currentSignal.confidence < 0.1) {
    currentSignal.confidence = 0.2; // Si trop faible, le forcer à un minimum de 20%
  }

  // Fallback for pair detection if not provided by AI
  if (currentSignal.pair === 'Unknown') {
    currentSignal.pair = detectCurrencyPair(newsItems[0]);
  }

  return {
    analyzedNews: newsItems,
    signal: {
      ...currentSignal,
      timestamp: new Date().toISOString(),
      newsSource: newsItems.slice(0, 2), // Include the top two news items for reference
    },
  };
}

function detectCurrencyPair(news: NewsItem): string {
  const pairs = ['USD/CAD', 'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/NZD', 'XAU/USD', 'BTC/USD'];
  const text = `${news.title} ${news.description}`.toUpperCase();

  for (const pair of pairs) {
    if (text.includes(pair.replace('/', ' ')) || text.includes(pair)) {
      return pair;
    }
  }
  return 'Unknown';
}
