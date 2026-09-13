import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchLookups, Lookups } from '../lib/api';

interface LookupsContextValue {
  lookups: Lookups | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const LookupsContext = createContext<LookupsContextValue | undefined>(undefined);

export function LookupsProvider({ children }: { children: React.ReactNode }) {
  const [lookups, setLookups] = useState<Lookups | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLookups();
      setLookups(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load reference data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <LookupsContext.Provider value={{ lookups, loading, error, reload }}>
      {children}
    </LookupsContext.Provider>
  );
}

export function useLookups() {
  const ctx = useContext(LookupsContext);
  if (!ctx) throw new Error('useLookups must be used within LookupsProvider');
  return ctx;
}
