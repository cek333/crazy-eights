import { configureStore } from '@reduxjs/toolkit';
import { reduxBatch }  from '@manaflair/redux-batch';
import deckReducer from './slices/deckSlice';
import pileReducer from './slices/pileSlice';
import playerReducer from './slices/playerSlice';
import computerReducer from './slices/computerSlice';
import infoSlice from './slices/infoSlice';

const store = configureStore({
  reducer: {
    deck: deckReducer,
    pile: pileReducer,
    computer: computerReducer,
    player: playerReducer,
    info: infoSlice
  },
  enhancers: [reduxBatch]
});

export default store;