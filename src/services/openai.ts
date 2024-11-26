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
6. Identify relevant currency pair.

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
  return parseAIResponse(analysis, news);
}

function parseAIResponse(analysis: string, originalNews: NewsItem[]) {
  const lines = analysis.split('\n');
  const newsItems = [...originalNews];
  let currentSignal = {
    action: 'wait' as const,
    confidence: 0.5,
    pair: 'Unknown', // Default pair if not specified
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
    } else if (line.includes('Confidence:')) {
      const confidence = parseFloat(line.match(/[\d.]+/)?.[0] || '0.5');
      currentSignal.confidence = Math.min(Math.max(confidence, 0), 1);
    } else if (line.includes('Relevant pair:')) {
      currentSignal.pair = line.replace('Relevant pair:', '').trim();
    }
  });

  return {
    analyzedNews: newsItems,
    signal: {
      ...currentSignal,
      timestamp: new Date().toISOString(),
      newsSource: newsItems.slice(0, 2), // Include the top two news items for reference
    },
  };
}
