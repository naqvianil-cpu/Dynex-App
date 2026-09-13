# DYNEX Worker Welfare — Worker App

A worker-facing mobile app (Android + iOS, one Expo/React Native codebase)
for DYNEX Arabia's grievance-registry system. Workers sign in with a
**Worker ID + 6-digit PIN**, submit a grievance in their own language,
track its status, and give feedback once it's resolved.

This app replaces an earlier staff-facing prototype (`dynex-welfare-mobile`,
documented as `step19` in the project). Per an explicit product decision,
the staff-facing app was discontinued: **workers are the primary users of
this system**, and staff continue to work the existing web dashboard.

## Branding

Colors and logo are DYNEX's own (from *DYNEX | Brand Guideline*, Ver. 02
2025): deep navy `#00033A` as the primary/brand color, periwinkle
`#4252B1` as the accent (`src/theme/index.ts`). The DYNEX wordmark
(`assets/dynex-wordmark.png`) appears on the language-select and sign-in
screens; the app icon, Android adaptive icon (foreground/background/
monochrome) and favicon are all generated from the brand's "X" mark
(`assets/icon.png` and siblings).

The sign-in screen (`LoginScreen`) sits on an off-white ground
(`colors.offWhite`) with the brand guideline's large two-tone "X" graphic
(`assets/big-x-mark.png`, extracted from the guideline's cover slide)
stretched full-height along the right edge at 20% opacity — a deliberate
brand moment rather than the app's everyday neutral background.

See below for the animated launch screen, which reuses this same navy +
white-wordmark treatment as the very first thing a worker sees.

## Architecture

- **Expo SDK 57 / React Native 0.86 / React 19**, TypeScript, React
  Navigation v7 (bottom tabs + native stack).
- **Backend**: the same live Supabase project as the web app
  (`dynex-welfare-registry`, `rzjfuoztfozskxkkssmf`). No new backend was
  stood up — this app is a new client against the existing schema, plus
  additive migrations (`12`–`19`) and three new Edge Functions.
- **State**: React Context (`AuthContext`, `LanguageContext`,
  `LookupsContext`) + AsyncStorage for session and language persistence.

### Identity: Worker ID + PIN over Supabase Auth

Supabase Auth is email/password under the hood. A worker's `WORKER-ID` is
deterministically mapped to a synthetic email
(`w-<workerid-lowercased-alnum>@workers.dynexarabia.app`, see
`src/lib/workerAuth.ts`), and the PIN is used as the Auth password. The
worker never sees or types an email address.

- **Register** (`RegisterScreen`) calls the `register-worker` Edge
  Function (no JWT required), which validates the PIN, checks the Worker
  ID isn't taken, creates the `auth.users` row via the Admin API with
  `email_confirm: true` (so there's no email-confirmation step to get
  stuck on), inserts a `worker_accounts` row, and rolls back the auth user
  if that insert fails. The client then signs in with the returned email.
- **Sign in** (`LoginScreen`) derives the same synthetic email client-side
  and calls `supabase.auth.signInWithPassword` directly.
- **No self-service PIN reset is built.** If a worker forgets their PIN,
  a staff member resets it from the Supabase dashboard (Auth → Users →
  reset password) — same limitation as the web app's existing account
  recovery story.

### Database changes (migrations 12–16)

- `worker_accounts` (id → `auth.users`, `worker_id` unique, `full_name`,
  `project_id`, `phone`) and `worker_push_tokens` (Expo push tokens, one
  worker can have several devices).
- `grievances.submitted_by_worker` and
  `grievance_events.performed_by_worker` (nullable FKs to
  `worker_accounts`) — added alongside the existing staff-oriented
  `performed_by` (FK to `profiles`) rather than loosening it, since a
  worker's `auth.uid()` isn't a valid `profiles.id`.
- RLS: staff visibility is unchanged (`EXISTS (SELECT 1 FROM profiles
  WHERE id = auth.uid())`); worker visibility is scoped to rows they own
  (`submitted_by_worker = auth.uid()`, or the case's owner for events and
  feedback). Workers never see other workers' cases, staff names, or
  internal-only event types (only `Created` and `Status Changed` events
  are worker-visible).
- All worker writes go through narrow `SECURITY DEFINER` RPCs
  (`register_worker`, `submit_worker_grievance`,
  `submit_worker_feedback`) rather than open table-level INSERT policies,
  so a worker can only ever create rows shaped exactly like a legitimate
  submission.
- `projects_select_anon`: `projects` is readable by the `anon` role
  (active projects only) so the Register screen can list them before the
  worker has a session.
- `attachments.uploaded_by_worker` (migration 17) + a `submit_worker_attachment`
  RPC and worker-scoped Storage policies, for the Evidence tab (see below).
- **Reference numbers are continuous across the whole registry, not
  per-app.** `submit_worker_grievance` calls the same
  `next_grievance_reference()` function the web app uses — a single
  shared counter (`grievance_id_counter`), atomically incremented on every
  call regardless of source, never reset. A grievance filed from this app
  gets the next number after whatever the most recently registered
  grievance got, whether that one came from the web dashboard, the
  hotline import, or another worker's phone.

### ⚠️ Security fix applied mid-build (migrations 18–19)

Two migrations from a different, concurrent change to this project
(`add_camp_liaison_role` / `scope_camp_liaison_access`, applied *after*
migration 16) recreated `grievances_select`, `events_select` and
`feedback_select` back to their original staff-only form, silently
dropping the worker-visibility clauses this app depends on. Combined with
`vw_grievance_master` — the view `fetchMyGrievances`/`fetchGrievanceById`
actually query — being owned by the `postgres` role (which has
`BYPASSRLS`), the net effect was: **any signed-in worker could read every
grievance in the system through this app, including other workers' and
ones marked confidential or anonymous, not just their own.** This was
caught and fixed during this session, before this build was ever shipped
to a device, but it means the *previously delivered* zip from earlier in
this conversation has the vulnerability — use this zip, not that one.

Fix (migration `18_fix_worker_data_isolation`): re-added the worker-scoped
`SELECT` policies (additive, staff policies untouched) and switched
`vw_grievance_master` to `SECURITY INVOKER` so it enforces the *caller's*
RLS instead of the owner's. That surfaced a second, pre-existing bug —
`profiles_select`'s own policy queried `profiles` from inside itself,
which is a classic Postgres RLS recursion trap; it had been dormant only
because nothing forced a genuinely RLS-scoped read of `profiles` until
the view fix did. Migration `19_fix_profiles_select_recursion` rewrites
it to use the existing `SECURITY DEFINER` `auth_role()` helper instead
(same semantics, no self-reference).

Both fixes were verified live: a worker JWT now sees only their own
grievance through the view; a second test worker with no cases sees
none of the first worker's; an admin JWT still sees the full list (83
rows) unaffected; the recursion error is gone. **If anything else in this
project touches RLS policies on `grievances`, `grievance_events`,
`worker_feedback`, or `profiles` going forward, re-check that the
worker-scoped policies added here (`grievances_select_worker`,
`events_select_worker`, `feedback_select_worker`) survive it** — this is
exactly how they got dropped the first time.

### Push notifications

`grievance_events` has an `AFTER INSERT` trigger
(`notify_worker_on_grievance_event`) that, for `Status Changed` events,
looks up the case's `submitted_by_worker` and calls the
`send-case-notification` Edge Function via `pg_net.http_post` (fire-and
-forget, 15s timeout — tuned up from the pg_net default of 5s after a
real cold-start timeout during testing). That function looks up the
worker's registered Expo push tokens (`worker_push_tokens`, populated by
the app on login via `src/lib/pushNotifications.ts`) and posts to Expo's
push API.

**This cannot be end-to-end tested from this sandbox** — there is no
physical device or simulator here to receive a push. The
trigger→function→Expo-API pipeline was verified live (a direct
`net.http_post` call reached the deployed function and got the expected
response), but actual delivery to a device needs testing after a real
EAS build is installed on a phone.

### Multi-language UI + auto-translation to English

The app ships in 8 languages: English, Urdu (اردو), Arabic (العربية),
Bangla (বাংলা), Hindi (हिन्दी), Nepali (नेपाली), Filipino (Tagalog), and
Chinese (中文). A worker picks one on first launch (`LanguageSelectScreen`)
and can change it anytime in Settings; the choice persists in
AsyncStorage.

- `src/i18n/strings.ts` defines an `interface Strings` and a full
  translation per language typed against it — a missing key is a
  **compile-time error**, not a silent blank at runtime.
- Fixed English values from the database (status names, priority names,
  category names — seeded in `schema_production.sql`) are localized via
  lookup maps in `src/context/LanguageContext.tsx`
  (`localizeStatus`/`localizePriority`/`localizeCategory`), so a worker
  never sees raw English enum values mixed into an otherwise-translated
  screen.
- Urdu and Arabic are the RTL languages; screens that show free text
  (`SubmitGrievanceScreen`) mirror `textAlign` accordingly. Full RTL
  layout mirroring (`I18nManager.forceRTL`) was deliberately **not**
  wired up, because React Native requires an app restart for it to take
  effect — that's a reasonable v2 improvement, not something that can be
  done cleanly at runtime on first language selection.

**Auto-translation**: when a worker submits a grievance in a non-English
language, `submit_worker_grievance` stores the original text plus
`submitted_language`, sets `translation_status = 'pending'`, and a
trigger (`trigger_translate_grievance`) fires the `translate-grievance`
Edge Function. That function calls the free **MyMemory Translation API**
and writes the result to `grievances.description_en`, flipping
`translation_status` to `done` (or `failed`, left visible to staff on the
web dashboard so nothing silently vanishes). English submissions skip
translation entirely (`translation_status = 'not_applicable'`).

This was tested live end-to-end for all 8 source languages against the
deployed function (e.g. Urdu "مجھے دو ماہ سے تنخواہ نہیں ملی" → "I have
not been paid for two months"; Arabic "لم أتقاضَ راتبي منذ شهرين" →
"I haven't been paid in two months"). Adding Arabic required redeploying
`translate-grievance` (version 3) to add `ar` to its `LANG_MAP` — it was
missing initially.

> **Production note**: MyMemory is a free, keyless service intended for
> light use and pilots — it has no uptime SLA and its translation quality
> for longer or idiomatic grievance text should not be assumed to be
> reliable. Before relying on this for real grievances, swap
> `callProvider()` in `supabase/functions/translate-grievance/index.ts`
> for Google Cloud Translation or DeepL (both are one-line swaps — the
> function already isolates the provider call), and have the welfare team
> spot-check `description_en` against the original for the first few
> weeks either way. The UI translations in `strings.ts` are
> machine-assisted and should get a native-speaker review pass per
> language before a production rollout.

### Animated launch screen

The app's cold-start loading gate (previously a bare spinner) is now a
premium animated splash — `src/components/splash/DynexSplashScreen.tsx`,
composed from a handful of small reusable pieces in the same folder:
`AnimatedBackground` (the navy → midnight → royal → blue-gray gradient
ground, two soft "light wave" bands, a few background particles),
`OrbitalRings` (three rotating rings around the logo, each carrying a
tiny traveling highlight dot — blue-white on the outer ring, a warm amber
one on the middle ring), `LogoGlow` (a stacked-circle radial halo behind
the logo that breathes), `LogoShimmer` (a soft diagonal light sweep that
crosses the wordmark itself every few seconds, clipped tightly to its own
bounding box), and `SplashTransition` (a generic fade + subtle-scale
wrapper used for the hand-off into the real app). The DYNEX wordmark
itself (`assets/dynex-wordmark-white.png` — the existing wordmark asset,
recolored to white via its alpha channel, not redrawn) sits centered and
untouched by any of the above.

Motion was tuned to be clearly felt rather than merely present: rings
complete a revolution every 10–20s (not 16–30s), waves drift on a 6s
cycle, the halo breathes every ~2s — still "flowing light", not a fast
UI transition, but more alive than the first pass.

- **No new heavy dependencies.** Only `expo-linear-gradient` (for the
  gradient/wave fills) and `expo-splash-screen` (for the native pre-JS
  splash, below) were added — both official, tiny Expo SDK modules.
  Everything else (rotation, opacity, scale, the radial glow) is built
  from React Native's own `Animated` API using stacked circles and large
  `borderRadius` values rather than pulling in an SVG or animation
  library.
- **Timing**: waits for both (a) `LanguageContext`/`AuthContext` to
  actually finish resolving — the same condition the old spinner gated
  on — and (b) a minimum on-screen time (2.5s, or 0.7s under Reduce
  Motion) before cross-fading into the language-select/sign-in/main-tabs
  tree, so neither a fast nor a slow network cuts the brand moment short
  or drags it out.
- **Native hand-off**: `app.json`'s `expo-splash-screen` plugin config
  gives the *native*, pre-JS-load splash the same navy background +
  centered white wordmark, so there's no white flash before the animated
  JS splash takes over — `index.ts` calls
  `SplashScreen.preventAutoHideAsync()` and `DynexSplashScreen` hides it
  again on mount.
- **Reduce Motion**: `DynexSplashScreen` reads
  `AccessibilityInfo.isReduceMotionEnabled()` (and subscribes to live
  changes) and, when it's on, skips ring rotation, wave drift, particle
  fading and the glow's breathing pulse entirely — just a plain logo
  fade-in on a static gradient, with a much shorter minimum display time.
- **Not verified on-device** for the same reason as push notifications
  above (no physical device/simulator in this sandbox): `tsc --noEmit`
  is clean and `expo export` bundles both platforms successfully with
  the new assets and dependencies, but the actual animation feel/timing
  is worth a quick look on a real phone via Expo Go before shipping.

## What a worker can do

- **Submit a new grievance** — category, urgency, confidentiality
  (standard / confidential / anonymous), free-text description in their
  own language.
- **Track their own cases** — list + status timeline, refreshed on every
  screen focus and pull-to-refresh.
- **Attach evidence photos** — the Evidence tab lets a worker pick one of
  their own cases and add photos to it, taken with the camera or chosen
  from their library (`EvidenceScreen.tsx`).
- **Get notified on status changes** — push notification once a device
  token is registered.
- **Give feedback once a case is closed** — resolved yes/no, 1–5
  satisfaction, optional comments (`submit_worker_feedback`), one
  submission per case.

### Evidence photos (migration 17)

Reuses the `attachments` Storage bucket the staff app already writes to
(migration 11), scoped per-worker: a photo uploads to
`worker/<worker-uuid>/<grievance-id>/<file>` in the bucket, gated by
Storage RLS policies that only allow a worker to read/write under their
own `worker/<their uuid>/` prefix. The metadata row (file name, size,
type) is recorded via the `submit_worker_attachment` RPC, which re-checks
that the grievance actually belongs to the calling worker and that the
storage path matches their own folder before inserting — same "narrow
`SECURITY DEFINER` RPC, no open table grant" pattern as the other worker
writes. Thumbnails are shown via short-lived signed URLs
(`getAttachmentSignedUrl`), since the bucket is private. Verified live:
upload → metadata row created → correct rejection when a path outside
the caller's own worker folder is attempted (`invalid storage path`).

## Running it

```bash
npm install
cp .env.example .env   # already points at the live Supabase project
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) on a
physical device — push notifications need `Device.isDevice`, so they're
silently skipped in a simulator.

## Building installable binaries (EAS)

Not run from this sandbox (no network access to Expo's build
infrastructure here). To build:

```bash
npm install -g eas-cli
eas login
eas build:configure        # sets app.json's extra.eas.projectId for real
eas build --profile preview --platform android   # installable .apk
eas build --profile production --platform all    # store-ready .aab / .ipa
```

`eas.json`'s `EXPO_PUBLIC_SUPABASE_ANON_KEY` is the public anon key (safe
to ship in a client bundle — RLS is what actually protects data, not this
key). `app.json`'s `extra.eas.projectId` is a placeholder until
`eas build:configure` is run once against a real EAS project.

## Known limitations

- No self-service PIN reset (staff resets via the Supabase dashboard).
- Push delivery to a real device is unverified from this sandbox (the
  server-side pipeline is verified; device receipt is not).
- Machine-assisted UI translations and MyMemory-based auto-translation
  should get native-speaker / production-grade-provider review before a
  full rollout (see above).
- RTL layout is text-alignment-only for Urdu and Arabic, not full
  mirrored layout.
- The app icon and wordmark were generated by cropping and upscaling a
  small mark from the brand guideline deck (the source art wasn't a
  separate high-res icon file) — it's the real DYNEX mark and colors, but
  worth swapping for a proper vector export before a store submission if
  DYNEX's design team has one.
