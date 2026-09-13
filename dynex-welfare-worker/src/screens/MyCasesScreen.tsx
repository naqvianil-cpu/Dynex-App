import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { fetchMyGrievances } from '../lib/api';
import type { GrievanceMasterRow } from '../types/database';
import { Badge, Card, ErrorView, LoadingView, PrimaryButton } from '../components/ui';
import { colors, fontSize, priorityColors, spacing, statusColors } from '../theme';
import { useLanguage, localizeCategory, localizePriority, localizeStatus } from '../context/LanguageContext';
import type { CasesStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<CasesStackParamList, 'MyCases'>;

export default function MyCasesScreen() {
  const navigation = useNavigation<Nav>();
  const { strings } = useLanguage();
  const [rows, setRows] = useState<GrievanceMasterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await fetchMyGrievances();
      setRows(data);
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

  if (loading && rows.length === 0) return <LoadingView label={strings.common.loading} />;
  if (error && rows.length === 0) return <ErrorView message={error} onRetry={() => load()} />;

  return (
    <FlatList
      style={styles.screen}
      data={rows}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.brand} />
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => navigation.navigate('CaseDetail', { id: item.id })}>
          <Card style={styles.row}>
            <View style={styles.rowTop}>
              <Text style={styles.refNo}>{item.grievance_id}</Text>
              <Badge
                label={localizePriority(strings, item.priority)}
                color={priorityColors[item.priority] ?? colors.textMuted}
              />
            </View>
            <Text style={styles.category}>{localizeCategory(strings, item.category)}</Text>
            <View style={styles.rowBottom}>
              <Badge
                label={localizeStatus(strings, item.status)}
                color={statusColors[item.status] ?? colors.textMuted}
              />
              <Text style={styles.date}>{item.date_received}</Text>
            </View>
          </Card>
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{strings.myCases.empty}</Text>
          <View style={{ height: spacing.lg }} />
          <PrimaryButton
            label={strings.myCases.reportIssue}
            onPress={() => navigation.getParent()?.navigate('Submit' as never)}
          />
        </View>
      }
      ListFooterComponent={
        rows.length > 0 ? <Text style={styles.hint}>{strings.myCases.refreshHint}</Text> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing.md, flexGrow: 1 },
  row: { marginBottom: spacing.sm },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refNo: { fontSize: fontSize.md, fontWeight: '700', color: colors.text },
  category: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  date: { fontSize: fontSize.xs, color: colors.textFaint, marginLeft: 'auto' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xxl * 2, paddingHorizontal: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md, textAlign: 'center' },
  hint: { textAlign: 'center', color: colors.textFaint, fontSize: fontSize.xs, marginTop: spacing.md },
});
