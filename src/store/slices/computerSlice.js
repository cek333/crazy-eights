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
  console.log('getMostFrequentSuit', hand);
  const suitMap = Object.values(hand).reduce(
    (acc, card) => {
      console.log('getMostFrequentSuit', acc);
      console.log('getMostFrequentSuit', card);
      acc[card.suit].value++;
      console.log('getMostFrequentSuit', acc);
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
  return highestFreqSuit;
}

const hasRank = (hand, rank) => {
  return Object.values(hand).find(card => card.rank === rank);
}

const hasSuit = (hand, suit) => {
  return Object.values(hand).find(card => card.suit === suit);
}

// Returns the next card to play. (Note, computeNextPlay() does not remove card from hand.)
export const computeNextPlay = (hand, pileCard) => {
  let potentialPlay;
  if (pileCard.rank === '2') {
    // Play another 2 if possible
    potentialPlay = hasRank(hand, '2');
    return potentialPlay; // either 2 or undefined
  }
  // Try to match suit
  potentialPlay = hasSuit(hand, pileCard.suit);
  if (potentialPlay) return potentialPlay;
  // Try to match rank
  potentialPlay = hasRank(hand, pileCard.rank);
  if (potentialPlay) return potentialPlay;
  // What about an eight?
  potentialPlay = hasRank(hand, '8');
  return potentialPlay; // either 8 or undefined
}

export default computerSlice.reducer;
