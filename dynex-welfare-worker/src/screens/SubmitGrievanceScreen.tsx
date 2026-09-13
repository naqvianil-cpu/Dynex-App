import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage, localizeCategory, localizePriority } from '../context/LanguageContext';
import { useLookups } from '../context/LookupsContext';
import { submitGrievance } from '../lib/api';
import { Chip, Field, PrimaryButton, TextField } from '../components/ui';
import { colors, fontSize, spacing } from '../theme';
import type { TabParamList } from '../navigation/types';

type Nav = BottomTabNavigationProp<TabParamList, 'Submit'>;

const CONFIDENTIALITY_OPTIONS = (strings: ReturnType<typeof useLanguage>['strings']) =>
  [
    { value: 'standard' as const, label: strings.submit.confidentialityStandard },
    { value: 'confidential' as const, label: strings.submit.confidentialityConfidential },
    { value: 'anonymous' as const, label: strings.submit.confidentialityAnonymous },
  ];

export default function SubmitGrievanceScreen() {
  const navigation = useNavigation<Nav>();
  const { worker } = useAuth();
  const { strings, lang, isRTL } = useLanguage();
  const { lookups } = useLookups();

  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [priorityId, setPriorityId] = useState<number | null>(null);
  const [confidentiality, setConfidentiality] = useState<'standard' | 'confidential' | 'anonymous'>(
    'standard'
  );
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!lookups || !worker) return null;

  const canSubmit = categoryId && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !worker.project_id) return;
    setSubmitting(true);
    setError(null);
    try {
      const grievance = await submitGrievance({
        projectId: worker.project_id,
        categoryId,
        description: description.trim(),
        confidentiality,
        priorityId: priorityId ?? undefined,
        language: lang,
      });
      Alert.alert(strings.submit.successTitle, `${grievance.reference_no}: ${strings.submit.successMessage}`, [
        {
          text: strings.common.ok,
          onPress: () => {
            setCategoryId(null);
            setPriorityId(null);
            setConfidentiality('standard');
            setDescription('');
            navigation.navigate('Cases', { screen: 'MyCases' });
          },
        },
      ]);
    } catch (e: any) {
      setError(e?.message ?? strings.submit.genericError);
    } finally {
      setSubmitting(false);
    }
  };

  const textAlign = isRTL ? 'right' : 'left';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{strings.submit.title}</Text>
      <Text style={styles.subheading}>{strings.submit.subtitle}</Text>

      <Field label={strings.submit.category} required>
        <View style={styles.chipWrap}>
          {lookups.categories.map((c) => (
            <Chip
              key={c.id}
              label={localizeCategory(strings, c.name)}
              active={categoryId === c.id}
              onPress={() => setCategoryId(c.id)}
            />
          ))}
        </View>
      </Field>

      <Field label={strings.submit.urgency}>
        <View style={styles.chipWrap}>
          {lookups.priorities.map((p) => (
            <Chip
              key={p.id}
              label={localizePriority(strings, p.name)}
              active={priorityId === p.id}
              onPress={() => setPriorityId(p.id)}
            />
          ))}
        </View>
      </Field>

      <Field label={strings.submit.confidentiality}>
        <View style={styles.chipWrap}>
          {CONFIDENTIALITY_OPTIONS(strings).map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={confidentiality === o.value}
              onPress={() => setConfidentiality(o.value)}
            />
          ))}
        </View>
      </Field>

      <Field label={strings.submit.description} required>
        <TextField
          value={description}
          onChangeText={setDescription}
          placeholder={strings.submit.descriptionPlaceholder}
          multiline
          numberOfLines={6}
          style={{ textAlign, minHeight: 120 }}
        />
      </Field>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton
        label={strings.submit.submitButton}
        onPress={handleSubmit}
        disabled={!canSubmit}
        loading={submitting}
      />
      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  heading: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subheading: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg, lineHeight: 19 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  error: { color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.md },
});
