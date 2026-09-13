// Workers sign in with a Worker ID + 6-digit PIN, but Supabase Auth (as
// used here) is email+password underneath. This derives a stable,
// synthetic, never-emailed-to address from the Worker ID so the same
// mapping is used consistently by both the register-worker Edge
// Function (server side) and this client (for sign-in).
export function workerIdToEmail(workerId: string): string {
  const cleaned = workerId.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  return `w-${cleaned}@workers.dynexarabia.app`;
}

export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}
