import React, { useState } from 'react';
import { Alert, Share } from 'react-native';
import { BackupImportModal } from './BackupImportModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { exportMediaItems, importMediaItems } from '../../services/mediaService';
import { setMediaItems } from '../../store/slices/mediaSlice';
import type { MediaItem } from '../../types';

export function useBackupRestore() {
  const { palette } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const [importVisible, setImportVisible] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    if (!user) {
      return;
    }
    const items = exportMediaItems(user.uid);
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      items,
    };
    await Share.share({
      message: JSON.stringify(payload, null, 2),
      title: 'OpenShelf Backup',
    });
  };

  const handleImport = async () => {
    if (!user) {
      return;
    }
    setImporting(true);
    try {
      const parsed = JSON.parse(importJson) as { items?: MediaItem[] } | MediaItem[];
      const items = Array.isArray(parsed) ? parsed : parsed.items ?? [];
      if (!items.length) {
        Alert.alert('Import failed', 'No media items found in JSON.');
        return;
      }
      const imported = await importMediaItems(user.uid, items);
      dispatch(setMediaItems(imported));
      setImportVisible(false);
      setImportJson('');
      Alert.alert('Import complete', `${imported.length} items restored.`);
    } catch {
      Alert.alert('Import failed', 'Invalid JSON format.');
    } finally {
      setImporting(false);
    }
  };

  const ImportModal = React.createElement(BackupImportModal, {
    visible: importVisible,
    importJson,
    importing,
    palette,
    onClose: () => setImportVisible(false),
    onChangeJson: setImportJson,
    onImport: handleImport,
  });

  return {
    handleExport,
    openImport: () => setImportVisible(true),
    ImportModal,
  };
}
