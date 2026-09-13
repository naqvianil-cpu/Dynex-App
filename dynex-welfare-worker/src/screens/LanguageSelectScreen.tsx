import React, { useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../i18n/languages';
import { PrimaryButton } from '../components/ui';
import { colors, fontSize, radius, spacing } from '../theme';

export default function LanguageSelectScreen() {
  const { lang, strings, setLang, confirmChosen } = useLanguage();
  const [selected, setSelected] = useState(lang);

  const handleContinue = async () => {
    await setLang(selected);
    await confirmChosen();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/dynex-wordmark.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>{strings.languageSelect.title}</Text>
        <Text style={styles.subtitle}>{strings.languageSelect.subtitle}</Text>
      </View>

      <FlatList
        data={LANGUAGES}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = item.code === selected;
          return (
            <Pressable
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => setSelected(item.code)}
            >
              <View>
                <Text style={[styles.native, isSelected && styles.nativeSelected]}>
                  {item.nativeName}
                </Text>
                {item.nativeName !== item.englishName ? (
                  <Text style={styles.english}>{item.englishName}</Text>
                ) : null}
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected ? <View style={styles.radioDot} /> : null}
              </View>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <PrimaryButton label={strings.languageSelect.continueButton} onPress={handleContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { alignItems: 'center', paddingTop: 64, paddingBottom: 24, paddingHorizontal: spacing.xl },
  logoImage: { width: 148, height: 32, marginBottom: spacing.md },
  title: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: fontSize.sm, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  rowSelected: { borderColor: colors.brand, backgroundColor: colors.brand + '0D' },
  native: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text },
  nativeSelected: { color: colors.brand },
  english: { fontSize: fontSize.xs, color: colors.textFaint, marginTop: 2 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.brand },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.brand },
  footer: { padding: spacing.lg, paddingBottom: spacing.xl },
});
