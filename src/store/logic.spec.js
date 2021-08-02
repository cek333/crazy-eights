import store from '../store/store';
import {
  computePlayerOptions,
  handlePlayerPlay,
  handlePlayerDraw
} from './logic';
import {
  setHand as setComputerHand,
  countCards as computerHandSize
} from './slices/computerSlice';
import {
  setHand as setPlayerHand,
  countCards as playerHandSize
} from './slices/playerSlice';
import {
  addCard as addCardToPile
} from './slices/pileSlice';
import {
  setDeck
} from '../store/slices/deckSlice';
import {
  getComputerMove, getGuide, getDraw, getExpected, setExpected
} from './slices/infoSlice';

describe('Reacting to Dealer', () => {
  const playerHand = [
    { id: 16, suit: 'diamonds', rank: '3' },
    { id: 17, suit: 'diamonds', rank: '4' },
    { id: 21, suit: 'diamonds', rank: '8' },
    { id: 31, suit: 'clubs', rank: '5' },
    { id: 38, suit: 'clubs', rank: 'queen' },
    { id: 41, suit: 'spades', rank: '2' },
    { id: 47, suit: 'spades', rank: '8' }
  ];
  const computerHand = [
    { id: 5, suit: 'hearts', rank: '5' },
    { id: 29, suit: 'clubs', rank: '3' },
    { id: 30, suit: 'clubs', rank: '4' },
    { id: 32, suit: 'clubs', rank: '6' },
    { id: 33, suit: 'clubs', rank: '7' },
    { id: 35, suit: 'clubs', rank: '9' },
    { id: 48, suit: 'spades', rank: '9' }
  ];
  beforeEach(() => {
    const deck = [
      { id: 8, suit: 'hearts', rank: '8' },
      { id: 9, suit: 'hearts', rank: '9' },
      { id: 10, suit: 'hearts', rank: '10' },
      { id: 11, suit: 'hearts', rank: 'jack' },
      { id: 12, suit: 'hearts', rank: 'queen' },
      { id: 13, suit: 'hearts', rank: 'king' },
      { id: 42, suit: 'spades', rank: '3' },
      { id: 43, suit: 'spades', rank: '4' },
      { id: 44, suit: 'spades', rank: '5' },
      { id: 45, suit: 'spades', rank: '6' },
   ];
   store.dispatch(setDeck(deck));
    store.dispatch([
      setComputerHand(computerHand),
      setPlayerHand(playerHand)
    ]);
  });
  test('Dealer plays a 2, Player draws, Computer plays', () => {
    const firstCard = { id: 2, suit: 'hearts', rank: '2' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions(firstCard);
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(/played a '2'/);
    expect(guide).toMatch(/Play a '2' or draw 2 cards/);
    handlePlayerDraw(2); // Computer follows by playing 5 of hearts
    state = store.getState();
    let playerHandCnt = playerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length + 2);
    expect(move).toEqual('');
    expect(guide).toMatch(/Play a '5', a hearts, or an '8'/);
  });
  /*
  test('Dealer plays a 2, Player plays a 2, Computer draws, Player plays', () => {

  });
  test('Dealer plays a 8, Player draws, Computer plays', () => {

  });
  test('Dealer plays a 8, Player plays a 8, Computer plays requested suit', () => {

  });
  test('Dealer plays a 8, Player plays requested suit', () => {

  });
  test('Dealer plays a Q, Player skipped, Computer plays', () => {

  });
  test('Dealer plays non-special card, Player draws, Computer plays', () => {

  });
  test('Dealer plays non-special card, Player plays', () => {

  });
  */
});
/*
describe('Reacting to Player', () => {
  test('Player plays a 2, Computer draws, Player plays', () => {

  });
  test('Player plays a 2, Computer plays a 2, Player plays a 2, Computer draws, Player plays', () => {

  });
  test('Player plays a 8, Computer draws, Player plays', () => {

  });
  test('Player plays a 8, Computer plays a 8, Player plays requested suit', () => {

  });
  test('Player plays a 8, Computer plays requested suit', () => {

  });
  test('Player plays a Q, Computer skipped, Player plays', () => {

  });
  test('Player plays non-special card, Computer draws, Player plays', () => {

  });
  test('Player plays non-special card, Computer plays', () => {

  });
});

describe('Reacting to Computer', () => {
  test('Computer plays a 2, Player draws, Computer plays', () => {

  });
  test('Computer plays a 2, Player plays a 2, Computer plays a 2, Player plays a 2, Computer draws, Player plays', () => {

  });
  test('Computer plays a 8, Player draws, Computer plays', () => {

  });
  test('Computer plays a 8, Player plays a 8, Computer plays requested suit', () => {

  });
  test('Computer plays a 8, Player plays requested suit', () => {

  });
  test('Computer plays a Q, Player skipped, Computer plays', () => {

  });
  test('Computer plays non-special card, Player draws, Computer plays', () => {

  });
  test('Computer plays non-special card, Player plays', () => {

  });
});
*/