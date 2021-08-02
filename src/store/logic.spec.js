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
      setComputerHand(computerHand),
      setPlayerHand(playerHand)
    ]);
  });
  test('Dealer plays a 2, Player draws, Computer plays', () => {
    const firstCard = { id: 2, suit: 'hearts', rank: '2' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(/played a '2'/);
    expect(guide).toMatch(/Play a '2' or draw 2 cards/);

    // Player draws
    handlePlayerDraw(2);
    // Computer follows by playing 5 of hearts
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length + 2);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[0])}`));
    expect(guide).toMatch(/Play a '5', a hearts, or an '8'/);
  });
  test('Dealer plays a 2, Player plays a 2, Computer draws', () => {
    const firstCard = { id: 2, suit: 'hearts', rank: '2' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(/played a '2'/);
    expect(guide).toMatch(/Play a '2' or draw 2 cards/);

    // Player plays 2 of spades
    const allowed = validatePlayerChoice(playerHand[5]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[5]);
    // Computer will be forced to draw 4 cards
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    const computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 4);
    expect(move).toMatch(/Computer drew 4/);
    expect(guide).toMatch(/Play a '2', a spades, or an '8'/);
  });
  test('Dealer plays a 8, Player draws, Computer plays', () => {
    const firstCard = { id: 8, suit: 'hearts', rank: '8' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(/played an '8'. Computer selects clubs as the next suit/);
    expect(guide).toMatch(/Play an '8' or clubs/);

    // Player draws
    handlePlayerDraw(1);
    // Computer follows by playing 3 of clubs
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length + 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[1])}`));
    expect(guide).toMatch(/Play a '3', a clubs, or an '8'/);
  });
  test('Dealer plays a 8, Player plays a 8, Computer plays requested suit', () => {
    const firstCard = { id: 8, suit: 'hearts', rank: '8' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(/played an '8'. Computer selects clubs as the next suit/);
    expect(guide).toMatch(/Play an '8' or clubs/);

    // Player plays 8 or diamonds, selects spades as next suit
    const allowed = validatePlayerChoice(playerHand[2]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[2], 'spades');
    // Computer plays 9 of spades
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    const computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[6])}`));
    expect(guide).toMatch(/Play a '9', a spades, or an '8'/);
  });
  test('Dealer plays a 8, Player plays requested suit, Computer plays', () => {
    const firstCard = { id: 8, suit: 'hearts', rank: '8' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(/played an '8'. Computer selects clubs as the next suit/);
    expect(guide).toMatch(/Play an '8' or clubs/);

    // Player plays 5 of clubs
    const allowed = validatePlayerChoice(playerHand[3]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[3]);
    // Computer plays 3 of clubs
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    const computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[1])}`));
    expect(guide).toMatch(/Play a '3', a clubs, or an '8'/);
  });
  /*
  test('Dealer plays a Q, Player skipped, Computer plays', () => {

  });
  */
  test('Dealer plays non-special card, Player draws, Computer plays', () => {
    const firstCard = { id: 40, suit: 'spades', rank: 'ace' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(new RegExp(`played a ${cardToString(firstCard)}`));
    expect(guide).toMatch(/Play a 'ace', a spades, or an '8'/);

    // Player draws
    handlePlayerDraw(1);
    // Computer plays 9 of spades
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    const computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length + 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[6])}`));
    expect(guide).toMatch(/Play a '9', a spades, or an '8'/);
  });
  test('Dealer plays non-special card, Player plays, Computer plays', () => {
    const firstCard = { id: 40, suit: 'spades', rank: 'ace' };
    store.dispatch(addCardToPile(firstCard));
    computePlayerOptions();
    let state = store.getState();
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(move).toMatch(new RegExp(`played a ${cardToString(firstCard)}`));
    expect(guide).toMatch(/Play a 'ace', a spades, or an '8'/);

    // Player plays 8 of spades
    const allowed = validatePlayerChoice(playerHand[6]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[6], 'spades');
    // Computer plays 9 of spades
    state = store.getState();
    const playerHandCnt = playerHandSize(state);
    const computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[6])}`));
    expect(guide).toMatch(/Play a '9', a spades, or an '8'/);
  });
});
describe('Reacting to Player', () => {
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
  beforeEach(() => {
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
  });
  test('Player plays a 2, Computer draws, Player plays, Computer plays', () => {
    store.dispatch(setComputerHand(computerDrawHand));
    // Player plays 2 of clubs
    handlePlayerPlay(playerHand[2]);
    // Computer draws
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 2);
    expect(move).toMatch(/Computer drew 2/);
    expect(guide).toMatch(/Play a '2', a clubs, or an '8'/);

    // Player plays 5 of clubs
    const allowed = validatePlayerChoice(playerHand[3]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[3]);
    // Computer plays 3 of clubs
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1 - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 2 - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[2])}`));
    expect(guide).toMatch(/Play a '3', a clubs, or an '8'/);
  });
  test('Player plays a 2, Computer plays a 2, Player plays a 2, Computer draws, Player plays, Computer plays', () => {
    store.dispatch(setComputerHand(computerHand));
    // Player plays 2 of clubs
    handlePlayerPlay(playerHand[2]);
    // Computer plays 2 of hearts
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(/played a '2'/);
    expect(guide).toMatch(/Play a '2' or draw 4 cards/);

    // Player plays 2 of spades
    let allowed = validatePlayerChoice(playerHand[5]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[5]);
    // Computer draws
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1 - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1 + 6);
    expect(move).toMatch(/Computer drew 6/);
    expect(guide).toMatch(/Play a '2', a spades, or an '8'/);

    // Player plays 8 of spades
    allowed = validatePlayerChoice(playerHand[6]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[6], 'spades');
    // Computer plays 9 of spades
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1 - 1 - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1 + 6 - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[6])}`));
    expect(guide).toMatch(/Play a '9', a spades, or an '8'/);
  });
  test('Player plays a 8, Computer draws, Player plays requested suit, Computer Plays', () => {
    store.dispatch(setComputerHand(computerDrawHand));
    // Player plays 8 of spades
    handlePlayerPlay(playerHand[6], 'diamonds');
    // Computer draws
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 1);
    expect(move).toMatch(/Computer drew 1/);
    expect(guide).toMatch(/Play an '8' or diamonds/);

    // Player plays 3 of diamonds
    const allowed = validatePlayerChoice(playerHand[0]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[0]);
    // Computer plays 3 of hearts
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1 - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 1 - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerDrawHand[0])}`));
    expect(guide).toMatch(/Play a '3', a hearts, or an '8'/);
  });
  test('Player plays a 8, Computer plays a 8, Player plays requested suit, Computer plays', () => {
    store.dispatch(setComputerHand(computerHand));
    // Player plays 8 of spades
    handlePlayerPlay(playerHand[6], 'diamonds');
    // Computer plays 8 of clubs
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(/played an '8'. Computer selects clubs as the next suit/);
    expect(guide).toMatch(/Play an '8' or clubs/);

    // Player plays 2 of clubs
    const allowed = validatePlayerChoice(playerHand[2]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[2]);
    // Computer plays 2 of hearts
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1 - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1 - 1);
    expect(move).toMatch(/played a '2'/);
    expect(guide).toMatch(/Play a '2' or draw 4 cards/);
  });
  test('Player plays a 8, Computer plays requested suit', () => {
    store.dispatch(setComputerHand(computerHand));
    // Player plays 8 of spades
    handlePlayerPlay(playerHand[6], 'spades');
    // Computer plays 9 of spades
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[6])}`));
    expect(guide).toMatch(/Play a '9', a spades, or an '8'/);
  });
  /*
  test('Player plays a Q, Computer skipped, Player plays, Computer plays', () => {

  });
  */
  test('Player plays non-special card, Computer draws, Player plays, Computer plays', () => {
    store.dispatch(setComputerHand(computerDrawHand));
    // Player plays 4 of diamonds
    handlePlayerPlay(playerHand[1]);
    // Computer draws
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 1);
    expect(move).toMatch(/Computer drew 1/);
    expect(guide).toMatch(/Play a '4', a diamonds, or an '8'/);

    // Player plays 5 of clubs (not allowed)
    let allowed = validatePlayerChoice(playerHand[3]);
    expect(allowed).toBeFalsy();
    // Player plays 3 of diamonds
    allowed = validatePlayerChoice(playerHand[0]);
    expect(allowed).toBeTruthy();
    handlePlayerPlay(playerHand[0]);
    // Computer plays 3 of hearts
    state = store.getState();
    playerHandCnt = playerHandSize(state);
    computerHandCnt = computerHandSize(state);
    move = getComputerMove(state);
    guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1 - 1);
    expect(computerHandCnt).toEqual(computerHand.length + 1 - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerDrawHand[0])}`));
    expect(guide).toMatch(/Play a '3', a hearts, or an '8'/);
  });
  test('Player plays non-special card, Computer plays', () => {
    store.dispatch(setComputerHand(computerHand));
    // Player plays 5 of clubs
    handlePlayerPlay(playerHand[3]);
    // Computer plays 3 of clubs
    let state = store.getState();
    let playerHandCnt = playerHandSize(state);
    let computerHandCnt = computerHandSize(state);
    let move = getComputerMove(state);
    let guide = getGuide(state);
    expect(playerHandCnt).toEqual(playerHand.length - 1);
    expect(computerHandCnt).toEqual(computerHand.length - 1);
    expect(move).toMatch(new RegExp(`played a ${cardToString(computerHand[2])}`));
    expect(guide).toMatch(/Play a '3', a clubs, or an '8'/);
  });
});
