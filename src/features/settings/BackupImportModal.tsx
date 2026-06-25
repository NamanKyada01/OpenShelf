import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from 'react-native-modal';
import { radius, spacing } from '../../theme/spacing';

interface BackupImportModalProps {
  visible: boolean;
  importJson: string;
  importing: boolean;
  palette: Record<string, string>;
  onClose: () => void;
  onChangeJson: (value: string) => void;
  onImport: () => void;
}

export function BackupImportModal({
  visible,
  importJson,
  importing,
  palette,
  onClose,
  onChangeJson,
  onImport,
}: BackupImportModalProps) {
  return (
    <Modal isVisible={visible} onBackdropPress={onClose} style={styles.modal}>
      <View style={[styles.sheet, { backgroundColor: palette.surface }]}>
        <Text style={[styles.heading, { color: palette.textPrimary }]}>Import JSON</Text>
        <Text style={[styles.hint, { color: palette.textSecondary }]}>
          Paste a backup JSON export from OpenShelf.
        </Text>
        <TextInput
          value={importJson}
          onChangeText={onChangeJson}
          multiline
          placeholder='{"items":[...]}'
          placeholderTextColor={palette.textMuted}
          style={[
            styles.input,
            {
              color: palette.textPrimary,
              borderColor: palette.border,
              backgroundColor: palette.background,
            },
          ]}
        />
        <Pressable
          style={[styles.btn, { backgroundColor: palette.primary }]}
          onPress={onImport}
          disabled={importing}
        >
          <Text style={styles.btnText}>{importing ? 'Importing...' : 'Import'}</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: 13,
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  btn: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
