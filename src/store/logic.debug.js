import store from '../store/store';
import {
  computePlayerOptions,
  handlePlayerPlay,
  handlePlayerDraw,
  validatePlayerChoice
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
  addCard as addCardToPile,
  removeAll as clearPile
} from './slices/pileSlice';
import {
  setDeck
} from '../store/slices/deckSlice';
import {
  getComputerMove, getGuide, getDraw, getExpected, setExpected, resetInfo
} from './slices/infoSlice';
import {
  cardToString
} from '../store/util/util';

//describe('Reacting to Player', () => {
  const playerHand = [
    { id: 16, suit: 'diamonds', rank: '3' },
    { id: 17, suit: 'diamonds', rank: '4' },
    { id: 28, suit: 'clubs', rank: '2' },
    { id: 31, suit: 'clubs', rank: '5' },
    { id: 38, suit: 'clubs', rank: 'queen' },
    { id: 41, suit: 'spades', rank: '2' },
    { id: 47, suit: 'spades', rank: '8' }
  ];
  const computerHand = [
    { id: 2, suit: 'hearts', rank: '2' },
    { id: 5, suit: 'hearts', rank: '5' },
    { id: 29, suit: 'clubs', rank: '3' },
    { id: 32, suit: 'clubs', rank: '6' },
    { id: 33, suit: 'clubs', rank: '7' },
    { id: 34, suit: 'clubs', rank: '8' },
    { id: 48, suit: 'spades', rank: '9' }
  ];
  const computerDrawHand = [
    { id: 3, suit: 'hearts', rank: '3' },
    { id: 5, suit: 'hearts', rank: '5' },
    { id: 13, suit: 'hearts', rank: 'king' },
    { id: 29, suit: 'clubs', rank: '3' },
    { id: 32, suit: 'clubs', rank: '6' },
    { id: 33, suit: 'clubs', rank: '7' },
    { id: 48, suit: 'spades', rank: '9' }
  ];
//  beforeEach(() => {
    const deck = [
      { id: 1, suit: 'hearts', rank: 'ace' },
      { id: 7, suit: 'hearts', rank: '7' },
      { id: 9, suit: 'hearts', rank: '9' },
      { id: 10, suit: 'hearts', rank: '10' },
      { id: 11, suit: 'hearts', rank: 'jack' },
      { id: 12, suit: 'hearts', rank: 'queen' },
      { id: 42, suit: 'spades', rank: '3' },
      { id: 43, suit: 'spades', rank: '4' },
      { id: 44, suit: 'spades', rank: '5' },
      { id: 45, suit: 'spades', rank: '6' },
    ];
    store.dispatch([
      resetInfo(),
      clearPile(),
      setDeck(deck),
      setPlayerHand(playerHand)
    ]);
//  });
//  test('Player plays a 2, Computer plays a 2, Player plays a 2, Computer draws, Player plays, Computer plays', () => {
    store.dispatch(setComputerHand(computerHand));
    // Player plays 2 of clubs
    handlePlayerPlay(playerHand[2]);
    // Computer plays 2 of hearts
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
console.log('Expect playerHandCnt:', playerHandCnt);
console.log('Expect computerHandCnt:', computerHandCnt);
console.log('Expect move:', move);
console.log('Expect guide:', guide);

    // Player plays 2 of spades
    let allowed = validatePlayerChoice(playerHand[5]);
console.log('Expect allowed:', allowed);
    handlePlayerPlay(playerHand[5]);
    // Computer draws
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
console.log('Expect playerHandCnt:', playerHandCnt);
console.log('Expect computerHandCnt:', computerHandCnt);
console.log('Expect move:', move);
console.log('Expect guide:', guide);

    // Player plays 8 of spades
    allowed = validatePlayerChoice(playerHand[6]);
console.log('Expect allowed:', allowed);
    handlePlayerPlay(playerHand[6], 'spades');
    // Computer plays 9 of spades
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
console.log('Expect playerHandCnt:', playerHandCnt);
console.log('Expect computerHandCnt:', computerHandCnt);
console.log('Expect move:', move);
console.log('Expect guide:', guide);

store.dispatch([
  resetInfo(),
  clearPile(),
  setDeck(deck),
  setPlayerHand(playerHand)
]);
console.log(store.getState());
//  });
//  test('Player plays a 8, Computer draws, Player plays requested suit, Computer Plays', () => {
    store.dispatch(setComputerHand(computerDrawHand));
    // Player plays 8 of spades
    handlePlayerPlay(playerHand[6], 'diamonds');
    // Computer draws
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
console.log('Expect playerHandCnt:', playerHandCnt);
console.log('Expect computerHandCnt:', computerHandCnt);
console.log('Expect move:', move);
console.log('Expect guide:', guide);

    // Player plays 3 of diamonds
    allowed = validatePlayerChoice(playerHand[0]);
console.log('Expect allowed:', allowed);
    handlePlayerPlay(playerHand[0]);
    // Computer plays 3 of hearts
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
console.log('Expect playerHandCnt:', playerHandCnt);
console.log('Expect computerHandCnt:', computerHandCnt);
console.log('Expect move:', move);
console.log('Expect guide:', guide);
//  });
/*
//  test('Player plays a 8, Computer plays a 8, Player plays requested suit, Computer plays', () => {

//  });
//  test('Player plays a 8, Computer plays requested suit', () => {

//  });
//  test('Player plays a Q, Computer skipped, Player plays, Computer plays', () => {

//  });
//  test('Player plays non-special card, Computer draws, Player plays, Computer plays', () => {

//  });
//  test('Player plays non-special card, Computer plays', () => {

//  });
  */
//});
