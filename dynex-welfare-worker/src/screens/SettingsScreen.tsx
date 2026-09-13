import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { usePushNotifications } from '../lib/pushNotifications';
import { LANGUAGES } from '../i18n/languages';
import { Card, PrimaryButton } from '../components/ui';
import { colors, fontSize, spacing } from '../theme';

export default function SettingsScreen() {
  const { worker, signOut } = useAuth();
  const { lang, strings, setLang } = useLanguage();
  const pushStatus = usePushNotifications(worker?.id ?? null);
  const [langSheetOpen, setLangSheetOpen] = useState(false);

  const currentLanguage = LANGUAGES.find((l) => l.code === lang);

  const handleSignOut = () => {
    Alert.alert(strings.settings.signOutConfirmTitle, strings.settings.signOutConfirmMessage, [
      { text: strings.common.cancel, style: 'cancel' },
      { text: strings.common.signOut, style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{strings.settings.title}</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>
            {(worker?.full_name ?? '?')
              .split(' ')
              .map((p) => p[0])
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{worker?.full_name}</Text>
        <Text style={styles.workerId}>{worker?.worker_id}</Text>
      </Card>

      <Pressable onPress={() => setLangSheetOpen(true)}>
        <Card style={styles.row}>
          <Text style={styles.rowLabel}>{strings.settings.language}</Text>
          <Text style={styles.rowValue}>{currentLanguage?.nativeName}</Text>
        </Card>
      </Pressable>

      <Card style={styles.row}>
        <Text style={styles.rowLabel}>{strings.settings.notifications}</Text>
        <Text style={styles.rowValue}>
          {pushStatus === 'granted' ? strings.settings.notificationsOn : strings.settings.notificationsOff}
        </Text>
      </Card>

      <View style={{ marginTop: spacing.xl }}>
        <PrimaryButton label={strings.common.signOut} onPress={handleSignOut} variant="danger" />
      </View>

      <Text style={styles.version}>
        {strings.settings.version} · v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>

      <Modal visible={langSheetOpen} transparent animationType="slide" onRequestClose={() => setLangSheetOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setLangSheetOpen(false)} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>{strings.settings.language}</Text>
          {LANGUAGES.map((l) => (
            <Pressable
              key={l.code}
              style={styles.sheetOption}
              onPress={async () => {
                await setLang(l.code);
                setLangSheetOpen(false);
              }}
            >
              <View>
                <Text style={styles.optionNative}>{l.nativeName}</Text>
                {l.nativeName !== l.englishName ? (
                  <Text style={styles.optionEnglish}>{l.englishName}</Text>
                ) : null}
              </View>
              {l.code === lang ? <Text style={styles.optionCheck}>✓</Text> : null}
            </Pressable>
          ))}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  heading: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitials: { color: '#fff', fontWeight: '800', fontSize: fontSize.lg },
  name: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  workerId: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2 },
  row: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  rowValue: { fontSize: fontSize.sm, color: colors.textMuted },
  version: { textAlign: 'center', color: colors.textFaint, fontSize: fontSize.xs, marginTop: spacing.xl },
  backdrop: { flex: 1, backgroundColor: '#00000055' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.xl,
    maxHeight: '70%',
  },
  sheetTitle: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  sheetOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  optionNative: { fontSize: fontSize.md, fontWeight: '600', color: colors.text },
  optionEnglish: { fontSize: fontSize.xs, color: colors.textFaint, marginTop: 2 },
  optionCheck: { fontSize: fontSize.lg, color: colors.brand, fontWeight: '800' },
});
