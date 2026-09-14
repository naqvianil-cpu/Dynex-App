import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { setStatusBarStyle } from 'expo-status-bar';
import { Alert, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchMyFeedback, fetchMyGrievances, submitFeedback } from '../lib/api';
import type { GrievanceMasterRow } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { useLanguage, localizeCategory } from '../context/LanguageContext';
import CaseRow from '../components/CaseRow';
import {
  ErrorView,
  LoadingView,
  PrimaryButton,
  Screen,
  StatRow,
  StatTile,
  TableHeader,
} from '../components/ui';
import { colors, fontSize, radius, spacing } from '../theme';
import type { HomeStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;

// The number of recent cases shown on the dashboard's own table before
// pointing the worker to the full My Cases screen for the rest.
const RECENT_LIMIT = 5;

type MoodKey = 'veryHappy' | 'happy' | 'ok' | 'sad';

const MOOD_LABEL_KEY: Record<MoodKey, 'moodVeryHappy' | 'moodHappy' | 'moodOk' | 'moodSad'> = {
  veryHappy: 'moodVeryHappy',
  happy: 'moodHappy',
  ok: 'moodOk',
  sad: 'moodSad',
};

// Maps each smiley straight onto the same wasResolved/satisfactionScore
// shape CaseDetailScreen's fuller feedback form already sends -- the
// Dashboard's one-tap picker is a faster path to the same backend record,
// not a different kind of feedback.
const MOODS: { key: MoodKey; emoji: string; satisfactionScore: number; wasResolved: boolean }[] = [
  { key: 'veryHappy', emoji: '\u{1F604}', satisfactionScore: 5, wasResolved: true },
  { key: 'happy', emoji: '\u{1F642}', satisfactionScore: 4, wasResolved: true },
  { key: 'ok', emoji: '\u{1F610}', satisfactionScore: 3, wasResolved: true },
  { key: 'sad', emoji: '\u{1F61E}', satisfactionScore: 1, wasResolved: false },
];

export default function DashboardScreen() {
  const navigation = useNavigation<Nav>();
  const { worker } = useAuth();
  const { strings } = useLanguage();
  const insets = useSafeAreaInsets();

  const [rows, setRows] = useState<GrievanceMasterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The single most-recently-closed case still waiting on the worker's
  // feedback, if any -- the Dashboard only ever prompts for one case at a
  // time (the latest one), same as the mock-up.
  const [feedbackCase, setFeedbackCase] = useState<GrievanceMasterRow | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [submittingMood, setSubmittingMood] = useState(false);

  // The hero banner runs the brand's royal blue straight through the
  // status bar, so its icons/clock need to switch to light content while
  // this tab is focused, and back to dark everywhere else in the app.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle('light');
      return () => setStatusBarStyle('dark');
    }, [])
  );

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchMyGrievances();
      setRows(data);

      const lastClosed = data
        .filter((r) => r.is_closed)
        .sort((a, b) => {
          const ad = new Date(a.closure_date ?? a.updated_at).getTime();
          const bd = new Date(b.closure_date ?? b.updated_at).getTime();
          return bd - ad;
        })[0];

      if (lastClosed) {
        const existing = await fetchMyFeedback(lastClosed.id);
        setFeedbackCase(existing ? null : lastClosed);
      } else {
        setFeedbackCase(null);
      }
      setSelectedMood(null);
      setFeedbackSent(false);
    } catch (e: any) {
      setError(e?.message ?? 'Could not load your cases.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const stats = useMemo(() => {
    const total = rows.length;
    const resolved = rows.filter((r) => r.is_closed).length;
    return { total, resolved, open: total - resolved };
  }, [rows]);

  const recent = rows.slice(0, RECENT_LIMIT);
  const firstName = worker?.full_name?.split(' ')[0];

  const handleMoodPress = async (mood: (typeof MOODS)[number]) => {
    if (!feedbackCase || selectedMood) return;
    setSelectedMood(mood.key);
    setSubmittingMood(true);
    try {
      await submitFeedback({
        grievanceId: feedbackCase.id,
        wasResolved: mood.wasResolved,
        satisfactionScore: mood.satisfactionScore,
      });
      setFeedbackSent(true);
    } catch (e: any) {
      setSelectedMood(null);
      Alert.alert(strings.submit.genericError, e?.message ?? '');
    } finally {
      setSubmittingMood(false);
    }
  };

  if (loading && rows.length === 0) {
    return (
      <Screen edges={[]}>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <LoadingView label={strings.common.loading} />
        </View>
      </Screen>
    );
  }
  if (error && rows.length === 0) {
    return (
      <Screen edges={[]}>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <ErrorView message={error} onRetry={() => load()} />
        </View>
      </Screen>
    );
  }

  let feedbackDate = feedbackCase?.closure_date ?? feedbackCase?.updated_at ?? '';
  try {
    if (feedbackDate) feedbackDate = format(new Date(feedbackDate), 'MMM d');
  } catch {
    // keep the raw value if it doesn't parse
  }

  return (
    <Screen edges={[]}>
      {/* Bleeds behind the status bar on purpose -- paddingTop below pushes
          the logo clear of the clock/signal/battery row instead of the
          usual top safe-area inset, so the royal blue reads as one
          continuous band from the very top of the screen. */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <Image
          source={require('../../assets/dynex-wordmark-white.png')}
          style={styles.heroLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.brand} />
        }
      >
        <Text style={styles.greeting}>
          {strings.dashboard.greeting}
          {firstName ? `, ${firstName}` : ''}
        </Text>
        <Text style={styles.heading}>{strings.dashboard.title}</Text>

        <StatRow>
          <StatTile value={stats.total} label={strings.dashboard.totalCases} color={colors.text} />
          <StatTile value={stats.open} label={strings.dashboard.openCases} color={colors.accent} />
          <StatTile value={stats.resolved} label={strings.dashboard.resolvedCases} color={colors.success} />
        </StatRow>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{strings.dashboard.recentCases}</Text>
          {rows.length > 0 ? (
            <Text
              style={styles.viewAll}
              onPress={() => navigation.getParent()?.navigate('Cases', { screen: 'MyCases' } as never)}
            >
              {strings.dashboard.viewAll}
            </Text>
          ) : null}
        </View>

        {rows.length === 0 ? (
          <Text style={styles.empty}>{strings.dashboard.emptyState}</Text>
        ) : (
          <View style={styles.table}>
            <TableHeader
              columns={[
                strings.dashboard.colRef,
                strings.dashboard.colStatus,
                strings.dashboard.colDate,
              ]}
            />
            {recent.map((item) => (
              <CaseRow
                key={item.id}
                item={item}
                onPress={() => navigation.navigate('CaseDetail', { id: item.id })}
              />
            ))}
          </View>
        )}

        {feedbackCase ? (
          <>
            <Text style={[styles.sectionTitle, styles.feedbackSectionTitle]}>
              {strings.dashboard.feedbackTitle}
            </Text>
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackQuestion}>{strings.dashboard.feedbackQuestion}</Text>
              <Text style={styles.feedbackSub}>
                <Text style={styles.feedbackSubStrong}>{feedbackCase.grievance_id}</Text>
                {' · '}
                {localizeCategory(strings, feedbackCase.category)} {strings.dashboard.feedbackWasClosedOn}{' '}
                {feedbackDate}
              </Text>

              <View style={styles.moodRow}>
                {MOODS.map((mood) => {
                  const isSelected = selectedMood === mood.key;
                  const isDimmed = selectedMood !== null && !isSelected;
                  return (
                    <Pressable
                      key={mood.key}
                      onPress={() => handleMoodPress(mood)}
                      disabled={selectedMood !== null}
                      style={[
                        styles.moodButton,
                        isSelected && styles.moodButtonSelected,
                        isDimmed && styles.moodButtonDimmed,
                      ]}
                    >
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text
                        style={[styles.moodLabel, isSelected && styles.moodLabelSelected]}
                        numberOfLines={1}
                      >
                        {strings.dashboard[MOOD_LABEL_KEY[mood.key]]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {feedbackSent ? (
                <Text style={styles.feedbackThanks}>{strings.caseDetail.feedbackThanks}</Text>
              ) : submittingMood ? (
                <Text style={styles.feedbackSending}>{strings.common.loading}</Text>
              ) : null}
            </View>
          </>
        ) : null}

        <View style={styles.actionWrap}>
          <PrimaryButton
            label={strings.dashboard.reportIssue}
            onPress={() => navigation.getParent()?.navigate('Submit' as never)}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.lg,
  },
  heroLogo: { width: 140, height: 30 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  greeting: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600' },
  heading: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, marginTop: 2, marginBottom: spacing.lg },
  actionWrap: { marginTop: spacing.xl, marginBottom: spacing.sm },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  viewAll: { fontSize: fontSize.sm, fontWeight: '700', color: colors.brand },
  table: { marginTop: spacing.xs },
  empty: { color: colors.textFaint, fontSize: fontSize.sm, marginTop: spacing.sm },

  feedbackSectionTitle: { marginTop: spacing.xl },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  feedbackQuestion: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: 4 },
  feedbackSub: { fontSize: fontSize.sm, color: colors.textMuted, lineHeight: 19, marginBottom: spacing.md },
  feedbackSubStrong: { color: colors.text, fontWeight: '700' },
  moodRow: { flexDirection: 'row', gap: spacing.sm },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: 2,
  },
  moodButtonSelected: { backgroundColor: '#EEF1FB', borderColor: colors.accent },
  moodButtonDimmed: { opacity: 0.35 },
  moodEmoji: { fontSize: 22, lineHeight: 26 },
  moodLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textAlign: 'center' },
  moodLabelSelected: { color: colors.accent },
  feedbackThanks: { fontSize: fontSize.sm, fontWeight: '700', color: colors.success, marginTop: spacing.md },
  feedbackSending: { fontSize: fontSize.sm, color: colors.textFaint, marginTop: spacing.md },
});
