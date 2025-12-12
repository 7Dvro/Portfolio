import { RESUME_DATA } from '../constants';
import { ResumeData } from '../types';

const STORAGE_KEY = 'portfolio_data_v1';

export const dataManager = {
  // Get data from local storage or fallback to constants
  getData: (lang: 'en' | 'ar'): ResumeData => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${lang}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load data from storage", e);
    }
    return RESUME_DATA[lang];
  },

  // Save data to local storage
  saveData: (lang: 'en' | 'ar', data: ResumeData) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${lang}`, JSON.stringify(data));
      // Dispatch event to notify listeners
      window.dispatchEvent(new Event('resumeDataUpdated'));
    } catch (e) {
      console.error("Failed to save data to storage", e);
    }
  },

  // Reset to default
  resetData: (lang: 'en' | 'ar') => {
    localStorage.removeItem(`${STORAGE_KEY}_${lang}`);
    window.dispatchEvent(new Event('resumeDataUpdated'));
  },

  // Export data as JSON
  exportData: (lang: 'en' | 'ar') => {
    const data = dataManager.getData(lang);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${lang}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};