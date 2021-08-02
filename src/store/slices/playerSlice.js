import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const playerAdapter = createEntityAdapter();
const initialState = playerAdapter.getInitialState();
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addCard: playerAdapter.addOne,
    setHand: playerAdapter.setAll, // for faster testing
    removeCard: playerAdapter.removeOne,
    removeAll: playerAdapter.removeAll
  }
});

export const {
  addCard,
  setHand,
  removeCard,
  removeAll
} = playerSlice.actions;

// Selectors
export const {
  selectIds,
  selectById,
  selectEntities
} = playerAdapter.getSelectors(state => state.player);
// Custom Selectrs
export const countCards = (state) => selectIds(state).length;

export default playerSlice.reducer;
