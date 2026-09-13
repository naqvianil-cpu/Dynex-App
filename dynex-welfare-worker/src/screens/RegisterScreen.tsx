import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { fetchProjectsPublic } from '../lib/api';
import type { LookupItem } from '../types/database';
import { Chip, Field, PrimaryButton, TextField } from '../components/ui';
import { colors, fontSize, spacing } from '../theme';
import type { AuthStackParamList } from '../navigation/types';
import { isValidPin } from '../lib/workerAuth';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { register } = useAuth();
  const { strings, isRTL } = useLanguage();

  const [projects, setProjects] = useState<LookupItem[]>([]);
  const [fullName, setFullName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [projectId, setProjectId] = useState<number | null>(null);
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectsPublic()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);

  const canSubmit = fullName.trim() && workerId.trim() && projectId && pin.length === 6;

  const handleSubmit = async () => {
    if (!isValidPin(pin)) {
      setError(strings.register.pinLength);
      return;
    }
    if (pin !== confirmPin) {
      setError(strings.register.pinMismatch);
      return;
    }
    if (!canSubmit) return;

    setError(null);
    setLoading(true);
    const { error: registerError } = await register({
      workerId: workerId.trim(),
      fullName: fullName.trim(),
      projectId: projectId!,
      phone: phone.trim() || undefined,
      pin,
    });
    setLoading(false);
    if (registerError) {
      if (/already registered/i.test(registerError)) setError(strings.register.workerIdTaken);
      else setError(strings.register.genericError);
    }
  };

  const textAlign = isRTL ? 'right' : 'left';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{strings.register.title}</Text>

        <Field label={strings.register.fullName} required>
          <TextField value={fullName} onChangeText={setFullName} editable={!loading} style={{ textAlign }} />
        </Field>

        <Field label={strings.register.workerId} required>
          <TextField
            value={workerId}
            onChangeText={setWorkerId}
            autoCapitalize="characters"
            editable={!loading}
          />
        </Field>

        <Field label={strings.register.project} required>
          <View style={styles.chipWrap}>
            {projects.map((p) => (
              <Chip key={p.id} label={p.name} active={projectId === p.id} onPress={() => setProjectId(p.id)} />
            ))}
          </View>
        </Field>

        <Field label={strings.register.phoneOptional}>
          <TextField value={phone} onChangeText={setPhone} keyboardType="phone-pad" editable={!loading} />
        </Field>

        <Field label={strings.register.pin} required>
          <TextField
            value={pin}
            onChangeText={(t) => setPin(t.replace(/[^0-9]/g, '').slice(0, 6))}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />
        </Field>
        <Text style={styles.pinHint}>{strings.register.pinHint}</Text>

        <Field label={strings.register.confirmPin} required>
          <TextField
            value={confirmPin}
            onChangeText={(t) => setConfirmPin(t.replace(/[^0-9]/g, '').slice(0, 6))}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            editable={!loading}
          />
        </Field>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton
          label={strings.register.submit}
          onPress={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
        />

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.signInRow}>
          <Text style={styles.signInText}>
            {strings.register.haveAccount} <Text style={styles.signInLink}>{strings.register.signIn}</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.xl, paddingBottom: spacing.xxl },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  pinHint: { fontSize: fontSize.xs, color: colors.textFaint, marginTop: -spacing.sm, marginBottom: spacing.lg, lineHeight: 16 },
  error: { color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.md },
  signInRow: { marginTop: spacing.xl, alignItems: 'center' },
  signInText: { fontSize: fontSize.sm, color: colors.textMuted },
  signInLink: { color: colors.brand, fontWeight: '700' },
});
