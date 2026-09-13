import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { workerIdToEmail } from '../lib/workerAuth';
import type { WorkerAccount } from '../types/database';

interface RegisterInput {
  workerId: string;
  fullName: string;
  projectId: number;
  phone?: string;
  pin: string;
}

interface AuthContextValue {
  session: Session | null;
  worker: WorkerAccount | null;
  loading: boolean;
  signIn: (workerId: string, pin: string) => Promise<{ error: string | null }>;
  register: (input: RegisterInput) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshWorker: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [worker, setWorker] = useState<WorkerAccount | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWorker = async (userId: string) => {
    const { data, error } = await supabase
      .from('worker_accounts')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setWorker(data as WorkerAccount);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) await loadWorker(data.session.user.id);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await loadWorker(newSession.user.id);
      } else {
        setWorker(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (workerId: string, pin: string) => {
    const email = workerIdToEmail(workerId);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pin });
    return { error: error?.message ?? null };
  };

  const register = async (input: RegisterInput) => {
    const { data, error } = await supabase.functions.invoke<{ email: string; error?: string }>(
      'register-worker',
      {
        body: {
          worker_id: input.workerId,
          full_name: input.fullName,
          project_id: input.projectId,
          phone: input.phone,
          pin: input.pin,
        },
      }
    );
    if (error) {
      // supabase-js surfaces a generic FunctionsHttpError for non-2xx;
      // the function's own JSON {error} message is more useful to show.
      let message = error.message;
      try {
        const ctx = (error as any).context;
        if (ctx?.json) {
          const body = await ctx.json();
          if (body?.error) message = body.error;
        }
      } catch {
        // fall back to the generic message
      }
      return { error: message };
    }
    if (data?.error) return { error: data.error };

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data!.email,
      password: input.pin,
    });
    return { error: signInError?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshWorker = async () => {
    if (session?.user) await loadWorker(session.user.id);
  };

  return (
    <AuthContext.Provider
      value={{ session, worker, loading, signIn, register, signOut, refreshWorker }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
