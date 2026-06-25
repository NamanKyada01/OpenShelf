import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MediaItem, MediaStatus, MediaType } from '../../types';

interface MediaSliceState {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
  filterStatus: MediaStatus | 'all';
  filterType: MediaType | 'all';
}

const initialState: MediaSliceState = {
  items: [],
  loading: false,
  error: null,
  filterStatus: 'all',
  filterType: 'all',
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setMediaItems(state, action: PayloadAction<MediaItem[]>) {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addMediaItem(state, action: PayloadAction<MediaItem>) {
      state.items.unshift(action.payload);
    },
    updateMediaItem(state, action: PayloadAction<MediaItem>) {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      }
    },
    removeMediaItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    setMediaLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setMediaError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    setFilterStatus(state, action: PayloadAction<MediaStatus | 'all'>) {
      state.filterStatus = action.payload;
    },
    setFilterType(state, action: PayloadAction<MediaType | 'all'>) {
      state.filterType = action.payload;
    },
  },
});

export const {
  setMediaItems,
  addMediaItem,
  updateMediaItem,
  removeMediaItem,
  setMediaLoading,
  setMediaError,
  setFilterStatus,
  setFilterType,
} = mediaSlice.actions;

export default mediaSlice.reducer;
