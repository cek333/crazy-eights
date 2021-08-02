import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const pileAdapter = createEntityAdapter();
const initialState = pileAdapter.getInitialState();
const pileSlice = createSlice({
  name: 'pile',
  initialState,
  reducers: {
    addCard: pileAdapter.addOne,
    removeAll: pileAdapter.removeAll,
    removeCard: pileAdapter.removeOne
  }
});

export const {
  addCard,
  removeAll,
  removeCard
} = pileSlice.actions;

export const {
  selectIds,
  selectById,
  selectEntities
} = pileAdapter.getSelectors(state => state.pile);
// For pile, top card is last card in array
export const selectTopCard = (state) => selectById(state, state.pile.ids[state.pile.ids.length - 1]);

export default pileSlice.reducer;
