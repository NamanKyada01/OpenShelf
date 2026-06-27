import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MediaItem, MediaStatus, MediaType } from '../../types';

interface MediaSliceState {
  items: MediaItem[];
  loading: boolean;
  error: string | null;
  filterStatuses: MediaStatus[];
  filterType: MediaType | 'all';
}

const initialState: MediaSliceState = {
  items: [],
  loading: false,
  error: null,
  filterStatuses: [],
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
    toggleFilterStatus(state, action: PayloadAction<MediaStatus>) {
      if (state.filterStatuses.includes(action.payload)) {
        state.filterStatuses = state.filterStatuses.filter(s => s !== action.payload);
      } else {
        state.filterStatuses.push(action.payload);
      }
    },
    clearFilterStatuses(state) {
      state.filterStatuses = [];
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
  toggleFilterStatus,
  clearFilterStatuses,
  setFilterType,
} = mediaSlice.actions;

export default mediaSlice.reducer;
