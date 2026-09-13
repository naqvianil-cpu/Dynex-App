import { supabase } from './supabase';
import type {
  Attachment,
  Grievance,
  GrievanceEvent,
  GrievanceMasterRow,
  LookupItem,
  Priority,
  WorkerFeedback,
} from '../types/database';

// ---------------------------------------------------------------------
// Lookups needed for the submit-a-grievance form and the register form.
// Small, rarely-changing tables -- fetched once per session.
// ---------------------------------------------------------------------
export interface Lookups {
  projects: LookupItem[];
  categories: LookupItem[];
  priorities: Priority[];
}

// Used by the Register screen, before the person has an account or
// session -- projects has an anon-readable RLS policy specifically for
// this (see migration 16_projects_readable_before_registration).
export async function fetchProjectsPublic(): Promise<LookupItem[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return (data ?? []) as LookupItem[];
}

export async function fetchLookups(): Promise<Lookups> {
  const [projects, categories, priorities] = await Promise.all([
    supabase.from('projects').select('*').eq('is_active', true).order('name'),
    supabase.from('categories').select('*').eq('is_active', true).order('name'),
    supabase.from('priorities').select('*').order('sort_order'),
  ]);
  const firstError = [projects, categories, priorities].find((r) => r.error);
  if (firstError?.error) throw firstError.error;

  return {
    projects: (projects.data ?? []) as LookupItem[],
    categories: (categories.data ?? []) as LookupItem[],
    priorities: (priorities.data ?? []) as Priority[],
  };
}

// ---------------------------------------------------------------------
// My cases
// ---------------------------------------------------------------------
export async function fetchMyGrievances(): Promise<GrievanceMasterRow[]> {
  // RLS already restricts this to the signed-in worker's own rows
  // (grievances_select policy) -- no extra filter needed here.
  const { data, error } = await supabase
    .from('vw_grievance_master')
    .select('*')
    .order('date_received', { ascending: false })
    .order('id', { ascending: false });
  if (error) throw error;
  return (data ?? []) as GrievanceMasterRow[];
}

export async function fetchGrievanceById(id: number): Promise<GrievanceMasterRow> {
  const { data, error } = await supabase
    .from('vw_grievance_master')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as GrievanceMasterRow;
}

export async function fetchMyEvents(grievanceId: number): Promise<GrievanceEvent[]> {
  // RLS (events_select) already limits a worker to the Created/Status
  // Changed entries on their own case -- internal notes stay internal.
  const { data, error } = await supabase
    .from('grievance_events')
    .select('id, grievance_id, event_type, field_changed, old_value, new_value, note, performed_at')
    .eq('grievance_id', grievanceId)
    .order('performed_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as GrievanceEvent[];
}

export async function fetchMyFeedback(grievanceId: number): Promise<WorkerFeedback | null> {
  const { data, error } = await supabase
    .from('worker_feedback')
    .select('*')
    .eq('grievance_id', grievanceId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return (data as WorkerFeedback) ?? null;
}

// ---------------------------------------------------------------------
// Mutations -- all through SECURITY DEFINER RPCs (see migration
// 12_worker_accounts_and_self_service / 14_worker_language_and_translation),
// not direct table writes, so a worker never gets a broad INSERT grant.
// ---------------------------------------------------------------------
export async function submitGrievance(input: {
  projectId: number;
  categoryId: number;
  description: string;
  confidentiality: 'standard' | 'confidential' | 'anonymous';
  priorityId?: number;
  language: string;
}): Promise<Grievance> {
  const { data, error } = await supabase.rpc('submit_worker_grievance', {
    p_project_id: input.projectId,
    p_category_id: input.categoryId,
    p_description: input.description,
    p_confidentiality: input.confidentiality,
    p_priority_id: input.priorityId ?? null,
    p_language: input.language,
  });
  if (error) throw error;
  return data as Grievance;
}

export async function submitFeedback(input: {
  grievanceId: number;
  wasResolved: boolean;
  satisfactionScore?: number;
  comments?: string;
}): Promise<WorkerFeedback> {
  const { data, error } = await supabase.rpc('submit_worker_feedback', {
    p_grievance_id: input.grievanceId,
    p_was_resolved: input.wasResolved,
    p_satisfaction_score: input.satisfactionScore ?? null,
    p_comments: input.comments ?? null,
  });
  if (error) throw error;
  return data as WorkerFeedback;
}

// ---------------------------------------------------------------------
// Evidence photos -- Storage upload (worker/<worker uuid>/... path, see
// migration 17_worker_evidence_attachments) + a metadata row recorded via
// the submit_worker_attachment RPC, same "narrow SECURITY DEFINER RPC"
// pattern as the other worker writes.
// ---------------------------------------------------------------------
export async function fetchAttachments(grievanceId: number): Promise<Attachment[]> {
  // RLS (attachments_select_worker) already limits this to the worker's
  // own grievance.
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('grievance_id', grievanceId)
    .order('uploaded_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Attachment[];
}

export async function uploadEvidencePhoto(params: {
  workerId: string;
  grievanceId: number;
  localUri: string;
  fileName: string;
  mimeType: string;
}): Promise<Attachment> {
  const storagePath = `worker/${params.workerId}/${params.grievanceId}/${Date.now()}-${params.fileName}`;

  const response = await fetch(params.localUri);
  const arrayBuffer = await response.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('attachments')
    .upload(storagePath, arrayBuffer, { contentType: params.mimeType, upsert: false });
  if (uploadError) throw uploadError;

  const { data, error } = await supabase.rpc('submit_worker_attachment', {
    p_grievance_id: params.grievanceId,
    p_storage_path: storagePath,
    p_file_name: params.fileName,
    p_file_type: params.mimeType,
    p_file_size_bytes: arrayBuffer.byteLength,
  });
  if (error) throw error;
  return data as Attachment;
}

export async function getAttachmentSignedUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('attachments')
    .createSignedUrl(storagePath, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function registerPushToken(params: {
  workerAccountId: string;
  token: string;
  platform: string;
}): Promise<void> {
  const { error } = await supabase
    .from('worker_push_tokens')
    .upsert(
      { worker_account_id: params.workerAccountId, expo_push_token: params.token, platform: params.platform },
      { onConflict: 'worker_account_id,expo_push_token' }
    );
  if (error) throw error;
}
