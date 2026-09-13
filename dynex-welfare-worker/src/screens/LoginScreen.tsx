import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Field, PrimaryButton, TextField } from '../components/ui';
import { colors, fontSize, radius, spacing } from '../theme';
import type { AuthStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn } = useAuth();
  const { strings, isRTL } = useLanguage();
  const [workerId, setWorkerId] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!workerId.trim() || pin.length !== 6) {
      setError(strings.login.invalidCredentials);
      return;
    }
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(workerId.trim(), pin);
    setLoading(false);
    if (signInError) setError(strings.login.invalidCredentials);
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/big-x-mark.png')}
        style={styles.watermark}
        resizeMode="contain"
      />
      <KeyboardAvoidingView
        style={styles.flexTransparent}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <Image
              source={require('../../assets/dynex-wordmark.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>{strings.login.title}</Text>
            <Text style={styles.subtitle}>{strings.login.subtitle}</Text>
          </View>

          <View style={styles.card}>
            <Field label={strings.login.workerId} required>
              <TextField
                value={workerId}
                onChangeText={setWorkerId}
                autoCapitalize="characters"
                editable={!loading}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              />
            </Field>
            <Field label={strings.login.pin} required>
              <TextField
                value={pin}
                onChangeText={(t) => setPin(t.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="••••••"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />
            </Field>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <PrimaryButton label={strings.login.signIn} onPress={handleLogin} loading={loading} />

            <Text style={styles.forgot}>{strings.login.forgotPin}</Text>
          </View>

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.registerRow}>
            <Text style={styles.registerText}>
              {strings.login.noAccount} <Text style={styles.registerLink}>{strings.login.register}</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Off-white ground for the big DYNEX "X" brand mark behind the sign-in
  // card (from the brand guideline's cover-slide graphic).
  root: { flex: 1, backgroundColor: colors.offWhite, overflow: 'hidden' },
  flexTransparent: { flex: 1, backgroundColor: 'transparent' },
  watermark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: -60,
    height: '100%',
    aspectRatio: 900 / 1066, // source asset's native ratio, so it stretches full-height without distortion
    opacity: 0.2, // "big X" at 80% transparency
    pointerEvents: 'none',
  },
  container: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  logoImage: { width: 168, height: 36, marginBottom: spacing.lg },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.xl,
  },
  error: { color: colors.danger, fontSize: fontSize.sm, marginBottom: spacing.md },
  forgot: {
    textAlign: 'center',
    color: colors.textFaint,
    fontSize: fontSize.xs,
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  registerRow: { marginTop: spacing.xl, alignItems: 'center' },
  registerText: { fontSize: fontSize.sm, color: colors.textMuted },
  registerLink: { color: colors.brand, fontWeight: '700' },
});
