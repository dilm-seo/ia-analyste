import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      latestNews: 'Latest News',
      analyzeNews: 'Analyze News',
      analyzing: 'Analyzing...',
      tradingSignals: 'Trading Signals',
      confidence: 'Confidence',
      confidenceTrend: 'Confidence Trend',
      signalDistribution: 'Signal Distribution',
      basedOnNews: 'Based on News',
      noSignalsYet: 'No Trading Signals Yet',
      analyzeNewsToGenerateSignals: 'Analyze news to generate trading signals',
      readMore: 'Read More',
      buy: 'Buy',
      sell: 'Sell',
      wait: 'Wait',
      impact: {
        low: 'Low Impact',
        medium: 'Medium Impact',
        high: 'High Impact',
      },
      openaiApiKey: 'OpenAI API Key',
      openaiModel: 'OpenAI Model',
      language: 'Language',
      notificationEmail: 'Notification Email',
      webhookUrl: 'Webhook URL',
      saveSettings: 'Save Settings',
      settingsSaved: 'Settings saved successfully',
      errorFetchingNews: 'Error fetching news',
      errorAnalyzing: 'Error analyzing news',
      analysisComplete: 'Analysis complete',
      noApiKey: 'Please set your OpenAI API key in settings',
    },
  },
  fr: {
    translation: {
      dashboard: 'Tableau de bord',
      settings: 'Paramètres',
      latestNews: 'Dernières nouvelles',
      analyzeNews: 'Analyser les nouvelles',
      analyzing: 'Analyse en cours...',
      tradingSignals: 'Signaux de trading',
      confidence: 'Confiance',
      confidenceTrend: 'Tendance de confiance',
      signalDistribution: 'Distribution des signaux',
      basedOnNews: 'Basé sur les nouvelles',
      noSignalsYet: 'Pas encore de signaux de trading',
      analyzeNewsToGenerateSignals: 'Analysez les nouvelles pour générer des signaux',
      readMore: 'Lire plus',
      buy: 'Acheter',
      sell: 'Vendre',
      wait: 'Attendre',
      impact: {
        low: 'Impact faible',
        medium: 'Impact moyen',
        high: 'Impact fort',
      },
      openaiApiKey: 'Clé API OpenAI',
      openaiModel: 'Modèle OpenAI',
      language: 'Langue',
      notificationEmail: 'Email de notification',
      webhookUrl: 'URL Webhook',
      saveSettings: 'Enregistrer les paramètres',
      settingsSaved: 'Paramètres enregistrés avec succès',
      errorFetchingNews: 'Erreur lors de la récupération des nouvelles',
      errorAnalyzing: 'Erreur lors de l\'analyse des nouvelles',
      analysisComplete: 'Analyse terminée',
      noApiKey: 'Veuillez configurer votre clé API OpenAI dans les paramètres',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('language') || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;