import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage, localizeCategory } from '../context/LanguageContext';
import { fetchAttachments, fetchMyGrievances, getAttachmentSignedUrl, uploadEvidencePhoto } from '../lib/api';
import type { Attachment, GrievanceMasterRow } from '../types/database';
import { Chip, LoadingView, PrimaryButton } from '../components/ui';
import { colors, fontSize, radius, spacing } from '../theme';

// One attachment thumbnail. Private bucket -> a signed URL is fetched
// per row rather than using a public URL (see getAttachmentSignedUrl).
function Thumbnail({ attachment }: { attachment: Attachment }) {
  const [url, setUrl] = useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    getAttachmentSignedUrl(attachment.storage_path)
      .then((u) => {
        if (!cancelled) setUrl(u);
      })
      .catch(() => {
        // leave url null -- shows the placeholder box below instead
      });
    return () => {
      cancelled = true;
    };
  }, [attachment.storage_path]);

  return (
    <View style={styles.thumbWrap}>
      {url ? (
        <Image source={{ uri: url }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <ActivityIndicator size="small" color={colors.textFaint} />
        </View>
      )}
    </View>
  );
}

export default function EvidenceScreen() {
  const { worker } = useAuth();
  const { strings } = useLanguage();

  const [cases, setCases] = useState<GrievanceMasterRow[]>([]);
  const [selectedCase, setSelectedCase] = useState<GrievanceMasterRow | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingAttachments, setLoadingAttachments] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadCases = useCallback(async () => {
    setLoadingCases(true);
    try {
      const data = await fetchMyGrievances();
      setCases(data);
      // Keep the current selection if it still exists, otherwise default
      // to the most recent case.
      setSelectedCase((prev) => {
        if (prev) {
          const stillThere = data.find((c) => c.id === prev.id);
          if (stillThere) return stillThere;
        }
        return data[0] ?? null;
      });
    } catch {
      // Evidence is secondary to the core flows -- fail quietly to an
      // empty case picker rather than blocking the screen.
    } finally {
      setLoadingCases(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCases();
    }, [loadCases])
  );

  const loadAttachments = useCallback(async (grievanceId: number) => {
    setLoadingAttachments(true);
    try {
      const data = await fetchAttachments(grievanceId);
      setAttachments(data);
    } catch {
      setAttachments([]);
    } finally {
      setLoadingAttachments(false);
    }
  }, []);

  React.useEffect(() => {
    if (selectedCase) loadAttachments(selectedCase.id);
    else setAttachments([]);
  }, [selectedCase, loadAttachments]);

  const handleUpload = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!selectedCase || !worker) return;
    setUploading(true);
    try {
      const fileName = asset.fileName ?? `photo-${Date.now()}.jpg`;
      await uploadEvidencePhoto({
        workerId: worker.id,
        grievanceId: selectedCase.id,
        localUri: asset.uri,
        fileName,
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
      await loadAttachments(selectedCase.id);
    } catch (e: any) {
      Alert.alert(strings.evidence.uploadError, e?.message ?? '');
    } finally {
      setUploading(false);
    }
  };

  const pickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) await handleUpload(result.assets[0]);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!result.canceled && result.assets[0]) await handleUpload(result.assets[0]);
  };

  if (loadingCases) return <LoadingView label={strings.common.loading} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>{strings.evidence.title}</Text>
      <Text style={styles.subheading}>{strings.evidence.subtitle}</Text>

      {cases.length === 0 ? (
        <Text style={styles.empty}>{strings.evidence.noCases}</Text>
      ) : (
        <>
          <Text style={styles.label}>{strings.evidence.selectCase}</Text>
          <View style={styles.chipWrap}>
            {cases.map((c) => (
              <Chip
                key={c.id}
                label={`${c.grievance_id} · ${localizeCategory(strings, c.category)}`}
                active={selectedCase?.id === c.id}
                onPress={() => setSelectedCase(c)}
              />
            ))}
          </View>

          {selectedCase ? (
            <>
              <View style={styles.actionsRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <PrimaryButton
                    label={strings.evidence.takePhoto}
                    onPress={takePhoto}
                    loading={uploading}
                    disabled={uploading}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <PrimaryButton
                    label={strings.evidence.chooseFromLibrary}
                    onPress={pickFromLibrary}
                    loading={uploading}
                    disabled={uploading}
                    variant="secondary"
                  />
                </View>
              </View>

              {loadingAttachments ? (
                <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.brand} />
              ) : attachments.length === 0 ? (
                <Text style={styles.empty}>{strings.evidence.noAttachments}</Text>
              ) : (
                <FlatList
                  data={attachments}
                  keyExtractor={(item) => String(item.id)}
                  numColumns={3}
                  scrollEnabled={false}
                  columnWrapperStyle={{ gap: spacing.sm }}
                  contentContainerStyle={{ gap: spacing.sm, marginTop: spacing.lg }}
                  renderItem={({ item }) => <Thumbnail attachment={item} />}
                />
              )}
            </>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg },
  heading: { fontSize: fontSize.xl, fontWeight: '800', color: colors.text },
  subheading: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    lineHeight: 19,
  },
  label: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text, marginBottom: spacing.sm },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.md },
  actionsRow: { flexDirection: 'row', marginTop: spacing.sm, marginBottom: spacing.lg },
  empty: { color: colors.textFaint, fontSize: fontSize.sm, marginTop: spacing.md },
  thumbWrap: { flex: 1 / 3 },
  thumb: { width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.surface },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
