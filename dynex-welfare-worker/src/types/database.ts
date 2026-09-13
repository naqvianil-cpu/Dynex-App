// Mirrors the worker-relevant parts of claude/schema_production.sql plus
// the worker_accounts / worker_push_tokens additions in migration
// 12_worker_accounts_and_self_service and the language/translation
// columns added in 14_worker_language_and_translation. Keep in sync
// manually -- there is no generated-types step in this sandbox.

export type ConfidentialityLevel = 'standard' | 'confidential' | 'anonymous';

export interface WorkerAccount {
  id: string;
  worker_id: string;
  full_name: string;
  project_id: number | null;
  phone: string | null;
  created_at: string;
}

export interface LookupItem {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Priority extends LookupItem {
  sort_order: number;
  color_hex: string;
  sla_days: number;
}

export interface Grievance {
  id: number;
  reference_no: string;
  date_received: string;
  time_received: string | null;
  project_id: number;
  category_id: number;
  description: string;
  priority_id: number;
  confidentiality: ConfidentialityLevel;
  status_id: number;
  submitted_by_worker: string | null;
  submitted_language: string | null;
  description_en: string | null;
  translation_status: 'not_applicable' | 'pending' | 'done' | 'failed';
  target_resolution_date: string | null;
  closure_date: string | null;
  created_at: string;
  updated_at: string;
}

// vw_grievance_master, the flattened read model -- used for a worker's
// own case list/detail exactly as the staff tooling uses it.
export interface GrievanceMasterRow {
  id: number;
  grievance_id: string; // reference_no
  date_received: string;
  project: string;
  category: string;
  priority: string;
  status: string;
  is_closed: boolean;
  is_overdue: boolean;
  target_resolution_date: string | null;
  closure_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface GrievanceEvent {
  id: number;
  grievance_id: number;
  event_type: string;
  field_changed: string | null;
  old_value: string | null;
  new_value: string | null;
  note: string | null;
  performed_at: string;
}

export interface Attachment {
  id: number;
  grievance_id: number;
  file_name: string;
  storage_path: string;
  file_type: string | null;
  file_size_bytes: number | null;
  description: string | null;
  uploaded_by_worker: string | null;
  uploaded_at: string;
}

export interface WorkerFeedback {
  id: number;
  grievance_id: number;
  was_resolved: boolean | null;
  satisfaction_score: number | null;
  comments: string | null;
  submitted_at: string;
}
