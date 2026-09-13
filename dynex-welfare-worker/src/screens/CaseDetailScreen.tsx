import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  fetchGrievanceById,
  fetchMyEvents,
  fetchMyFeedback,
  submitFeedback,
} from '../lib/api';
import type { GrievanceEvent, GrievanceMasterRow, WorkerFeedback } from '../types/database';
import { Badge, Card, Chip, ErrorView, LoadingView, PrimaryButton, TextField } from '../components/ui';
import { colors, fontSize, priorityColors, spacing, statusColors } from '../theme';
import { useLanguage, localizeCategory, localizePriority, localizeStatus } from '../context/LanguageContext';
import type { CasesStackParamList } from '../navigation/types';

type Rt = RouteProp<CasesStackParamList, 'CaseDetail'>;
type Nav = NativeStackNavigationProp<CasesStackParamList, 'CaseDetail'>;

function TimelineItem({ event, strings }: { event: GrievanceEvent; strings: ReturnType<typeof useLanguage>['strings'] }) {
  const isStatusChange = event.event_type === 'Status Changed' && event.new_value;
  const title = isStatusChange
    ? `${strings.caseDetail.status}: ${localizeStatus(strings, event.new_value!)}`
    : event.note || event.event_type;
  return (
    <View style={styles.timelineItem}>
      <View style={styles.tlDot} />
      <View style={{ flex: 1 }}>
        <Text style={styles.tlTitle}>{title}</Text>
        <Text style={styles.tlMeta}>{formatDistanceToNow(new Date(event.performed_at), { addSuffix: true })}</Text>
      </View>
    </View>
  );
}

export default function CaseDetailScreen() {
  const { params } = useRoute<Rt>();
  const navigation = useNavigation<Nav>();
  const { strings } = useLanguage();

  const [caseRow, setCaseRow] = useState<GrievanceMasterRow | null>(null);
  const [events, setEvents] = useState<GrievanceEvent[]>([]);
  const [feedback, setFeedback] = useState<WorkerFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [wasResolved, setWasResolved] = useState<boolean | null>(null);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [c, e, f] = await Promise.all([
        fetchGrievanceById(params.id),
        fetchMyEvents(params.id),
        fetchMyFeedback(params.id),
      ]);
      setCaseRow(c);
      setEvents(e);
      setFeedback(f);
      navigation.setOptions({ title: c.grievance_id });
    } catch (err: any) {
      setError(err?.message ?? 'Could not load this case.');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleSubmitFeedback = async () => {
    if (!caseRow || wasResolved === null) return;
    setSubmittingFeedback(true);
    try {
      await submitFeedback({
        grievanceId: caseRow.id,
        wasResolved,
        satisfactionScore: satisfaction ?? undefined,
        comments: comments.trim() || undefined,
      });
      await load();
    } catch (e: any) {
      Alert.alert(strings.submit.genericError, e?.message ?? '');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <LoadingView label={strings.common.loading} />;
  if (error || !caseRow) return <ErrorView message={error ?? 'Not found'} onRetry={load} />;

  const canGiveFeedback = caseRow.is_closed && !feedback;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.refNo}>{caseRow.grievance_id}</Text>
        <Badge label={localizePriority(strings, caseRow.priority)} color={priorityColors[caseRow.priority] ?? colors.textMuted} />
      </View>
      <View style={styles.badgeRow}>
        <Badge label={localizeStatus(strings, caseRow.status)} color={statusColors[caseRow.status] ?? colors.textMuted} />
      </View>

      <Card style={{ marginTop: spacing.md }}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{strings.caseDetail.category}</Text>
          <Text style={styles.infoValue}>{localizeCategory(strings, caseRow.category)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{strings.caseDetail.submitted}</Text>
          <Text style={styles.infoValue}>{caseRow.date_received}</Text>
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl, marginBottom: spacing.md }]}>
        {strings.caseDetail.updates}
      </Text>
      {events.length === 0 ? (
        <Text style={styles.emptyTimeline}>{strings.caseDetail.noUpdates}</Text>
      ) : (
        events.map((e) => <TimelineItem key={e.id} event={e} strings={strings} />)
      )}

      {caseRow.is_closed ? (
        <Card style={{ marginTop: spacing.xl }}>
          {feedback ? (
            <Text style={styles.thanks}>{strings.caseDetail.alreadyGaveFeedback}</Text>
          ) : (
            <>
              <Text style={styles.sectionTitle}>{strings.caseDetail.resolvedQuestion}</Text>
              <View style={styles.chipRow}>
                <Chip label={strings.caseDetail.yes} active={wasResolved === true} onPress={() => setWasResolved(true)} />
                <Chip label={strings.caseDetail.no} active={wasResolved === false} onPress={() => setWasResolved(false)} />
              </View>

              <Text style={[styles.sectionTitle, { marginTop: spacing.md }]}>{strings.caseDetail.satisfaction}</Text>
              <View style={styles.chipRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Chip key={n} label={String(n)} active={satisfaction === n} onPress={() => setSatisfaction(n)} />
                ))}
              </View>

              <View style={{ marginTop: spacing.md }}>
                <TextField
                  value={comments}
                  onChangeText={setComments}
                  placeholder={strings.caseDetail.commentsPlaceholder}
                  multiline
                  numberOfLines={3}
                  style={{ marginBottom: spacing.md }}
                />
                <PrimaryButton
                  label={strings.caseDetail.sendFeedback}
                  onPress={handleSubmitFeedback}
                  loading={submittingFeedback}
                  disabled={wasResolved === null}
                />
              </View>
            </>
          )}
        </Card>
      ) : null}

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refNo: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: fontSize.sm, color: colors.textMuted },
  infoValue: { fontSize: fontSize.sm, color: colors.text, fontWeight: '600' },
  emptyTimeline: { color: colors.textFaint, fontSize: fontSize.sm },
  timelineItem: { flexDirection: 'row', marginBottom: spacing.md },
  tlDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand, marginTop: 6, marginRight: spacing.sm },
  tlTitle: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text },
  tlMeta: { fontSize: fontSize.xs, color: colors.textFaint, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  thanks: { fontSize: fontSize.sm, color: colors.success, fontWeight: '600' },
});
