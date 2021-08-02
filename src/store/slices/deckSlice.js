import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import CARDS from '../util/cardData';
import { shuffleArray } from '../util/util';

const deckAdapter = createEntityAdapter();
const initialState = deckAdapter.getInitialState();
const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    populateDeck(state, action) {
      deckAdapter.setAll(state, CARDS);
    },
    shuffleDeck(state, action) {
      const shuffled = shuffleArray(state.ids);
      state.ids = shuffled;
    },
    setDeck: deckAdapter.setAll,
    removeCard: deckAdapter.removeOne
  }
});

export const {
  populateDeck,
  shuffleDeck,
  setDeck,
  removeCard
} = deckSlice.actions;

export const {
  selectIds,
  selectById
} = deckAdapter.getSelectors(state => state.deck);
export const selectTopCard = (state) => selectById(state, state.deck.ids[0]);
export const countCards = (state) => selectIds(state).length;

export default deckSlice.reducer;
