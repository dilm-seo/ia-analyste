import type { TradingSignal } from '../types';

export async function sendNotification(signal: TradingSignal) {
  const email = localStorage.getItem('notificationEmail');
  const webhookUrl = localStorage.getItem('webhookUrl');

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New Trading Signal: ${signal.action.toUpperCase()} ${signal.pair}`,
          confidence: signal.confidence,
          timestamp: signal.timestamp,
          news: signal.newsSource.map(n => n.title).join('\n'),
        }),
      });
    } catch (error) {
      console.error('Webhook notification failed:', error);
    }
  }

  if (email) {
    // In a real application, you would integrate with an email service
    console.log('Email notification would be sent to:', email);
  }
}