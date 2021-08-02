import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const computerAdapter = createEntityAdapter();
const initialState = computerAdapter.getInitialState();
const computerSlice = createSlice({
  name: 'computer',
  initialState,
  reducers: {
    addCard: computerAdapter.addOne,
    setHand: computerAdapter.setAll, // for faster testing
    removeCard: computerAdapter.removeOne,
    removeAll: computerAdapter.removeAll
  }
});

export const {
  addCard,
  setHand,
  removeCard,
  removeAll
} = computerSlice.actions;

// Selectors
export const {
  selectIds,
  selectById,
  selectEntities
} = computerAdapter.getSelectors(state => state.computer);
// Custom Selectrs
export const countCards = (state) => selectIds(state).length;

// NEXT PLAY LOGIC
export const getMostFrequentSuit = (hand) => {
  const suitMap = Object.values(hand).reduce(
    (acc, card) => {
      acc[card.suit].value++;
      return acc;
    },
    {
      hearts: { suit: 'hearts', value: 0 },
      diamonds: { suit: 'diamonds', value: 0 },
      spades: { suit: 'spades', value: 0 },
      clubs: { suit: 'clubs', value: 0 }
    }
  );
  const highestFreqSuit = Object.values(suitMap).reduce(
    (maxObj, suitObj) => maxObj.value > suitObj.value ? maxObj : suitObj
  );
  return highestFreqSuit.suit;
}

const hasRank = (hand, rank) => {
  return Object.values(hand).find(card => rank.includes(card.rank));
}

const hasSuit = (hand, suit) => {
  return Object.values(hand).find(card => card.suit === suit);
}

// Returns the next card to play. (Note, computeNextPlay() does not remove card from hand.)
export const computeNextPlay = (hand, expRank, expSuit) => {
  let potentialPlay;
  if (expRank.includes('2') && expSuit === null) {
    // Play another 2 if possible
    potentialPlay = hasRank(hand, '2');
    return potentialPlay; // either 2 or undefined
  }
  // Try to match suit
  potentialPlay = hasSuit(hand, expSuit);
  if (potentialPlay) return potentialPlay;
  // Try to match rank or 8
  return potentialPlay = hasRank(hand, expRank); // either rank, 8, or undefined
}

export default computerSlice.reducer;
