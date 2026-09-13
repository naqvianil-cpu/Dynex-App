import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STRINGS, Strings, en } from '../i18n/strings';
import { DEFAULT_LANGUAGE, LANGUAGES } from '../i18n/languages';

const STORAGE_KEY = 'worker-app-language';
const CHOSEN_KEY = 'worker-app-language-chosen';

interface LanguageContextValue {
  lang: string;
  strings: Strings;
  isRTL: boolean;
  ready: boolean;
  hasChosen: boolean;
  setLang: (code: string) => Promise<void>;
  confirmChosen: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState(DEFAULT_LANGUAGE);
  const [hasChosen, setHasChosen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(STORAGE_KEY), AsyncStorage.getItem(CHOSEN_KEY)])
      .then(([storedLang, storedChosen]) => {
        if (storedLang && STRINGS[storedLang]) setLangState(storedLang);
        if (storedChosen === 'true') setHasChosen(true);
      })
      .finally(() => setReady(true));
  }, []);

  const setLang = async (code: string) => {
    setLangState(code);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, code);
    } catch {
      // best effort -- language just won't persist across app restarts
    }
  };

  const confirmChosen = async () => {
    setHasChosen(true);
    try {
      await AsyncStorage.setItem(CHOSEN_KEY, 'true');
    } catch {
      // best effort
    }
  };

  const isRTL = LANGUAGES.find((l) => l.code === lang)?.isRTL ?? false;

  return (
    <LanguageContext.Provider
      value={{ lang, strings: STRINGS[lang] ?? en, isRTL, ready, hasChosen, setLang, confirmChosen }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

// DB lookup names (fixed, seeded values -- see schema_production.sql) ->
// translation keys, so status/category/priority text is localized too,
// not just the app's own chrome.
const STATUS_KEY_BY_NAME: Record<string, keyof Strings['statuses']> = {
  New: 'new',
  Acknowledged: 'acknowledged',
  'In Progress': 'inProgress',
  'On Hold': 'onHold',
  Escalated: 'escalated',
  Resolved: 'resolved',
  'Partially Closed': 'partiallyClosed',
  Closed: 'closed',
};

const PRIORITY_KEY_BY_NAME: Record<string, keyof Strings['priorities']> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
};

const CATEGORY_KEY_BY_NAME: Record<string, keyof Strings['categories']> = {
  Accommodation: 'accommodation',
  Food: 'food',
  Salary: 'salary',
  Overtime: 'overtime',
  Safety: 'safety',
  Medical: 'medical',
  Documentation: 'documentation',
  Leave: 'leave',
  Camp: 'camp',
  'Final Exit/Ticket': 'finalExit',
  Other: 'other',
};

export function localizeStatus(strings: Strings, dbName: string): string {
  const key = STATUS_KEY_BY_NAME[dbName];
  return key ? strings.statuses[key] : dbName;
}

export function localizePriority(strings: Strings, dbName: string): string {
  const key = PRIORITY_KEY_BY_NAME[dbName];
  return key ? strings.priorities[key] : dbName;
}

export function localizeCategory(strings: Strings, dbName: string): string {
  const key = CATEGORY_KEY_BY_NAME[dbName];
  return key ? strings.categories[key] : dbName;
}
