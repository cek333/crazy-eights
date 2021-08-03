import store from '../store/store';
import {
  populateDeck,
  shuffleDeck,
  setDeck,
  removeCard as removeCardFromDeck,
  selectTopCard as selectTopCardFromDeck,
  countCards as deckSize
} from '../store/slices/deckSlice';
import {
  addCard as addCardToPile,
  removeAll as clearPile,
  selectTopCard as selectTopCardFromPile,
  selectAll as getPile
} from '../store/slices/pileSlice';
import {
  addCard as addCardToComputer,
  removeCard as removeCardFromComputer,
  removeAll as resetComputer,
  selectEntities as getComputerHand,
  countCards as computerHandSize,
  getMostFrequentSuit as chooseNextSuit,
  computeNextPlay
} from '../store/slices/computerSlice';
import {
  addCard as addCardToPlayer,
  removeCard as removeCardFromPlayer,
  removeAll as resetPlayer,
  countCards as playerHandSize
} from '../store/slices/playerSlice';
import {
  setComputerMove, setGuide, setDraw,
  setExpected, setLock, clearLock, resetInfo,
  getGuide, getDraw, getExpected
} from '../store/slices/infoSlice';
import {
  cardToString
} from '../store/util/util';
const INITIAL_CARDS_PER_PLAYER = 7;
// After player's turn, insert some delay so player can see their card on pile,
// before executing computer's play.
// For command-line version of app, REACT_APP_POST_PLAYER_DELAY is set to 0 (in package.json)
const POST_PLAYER_DELAY = Number(process.env.REACT_APP_POST_PLAYER_DELAY || 3000);
let TIMER_HANDLE;

function startGame() {
  // Cancel any timed event in progress
  clearInterval(TIMER_HANDLE);
  // Reset all cards
  store.dispatch([
    resetInfo(),
    resetComputer(),
    resetPlayer(),
    clearPile(),
    populateDeck(),
    shuffleDeck()
  ]);
  // Share cards
  for (let idx = 0; idx < INITIAL_CARDS_PER_PLAYER * 2; idx++) {
    const cardFromDeck = selectTopCardFromDeck(store.getState());
    if (idx % 2 === 0) {
      store.dispatch([
        removeCardFromDeck(cardFromDeck.id),
        addCardToComputer(cardFromDeck)
      ]);
    } else {
      store.dispatch([
        removeCardFromDeck(cardFromDeck.id),
        addCardToPlayer(cardFromDeck)
      ]);
    } 
  }
  // Place initial card on pile
  const cardFromDeck = selectTopCardFromDeck(store.getState());
  store.dispatch([
    removeCardFromDeck(cardFromDeck.id),
    addCardToPile(cardFromDeck)
  ]);
  computePlayerOptions();
}

// Update on-screen guides - including last move and suggestions for the player.
function computePlayerOptions() {
  const state = store.getState();
  const pileCard = selectTopCardFromPile(state);
  if (pileCard.rank === '2') {
    const curDraw = getDraw(state);
    const newDraw = curDraw === 1 ? curDraw + 1 : curDraw + 2;
    store.dispatch([
      setComputerMove(`Computer played a '2'.`),
      setGuide(`Play a '2' or draw ${newDraw} cards.`),
      setDraw(newDraw),
      setExpected({ rank: ['2'], suit: null })
    ]);
  } else if (pileCard.rank === '8') {
    const computerHand = getComputerHand(state);
    const nextSuit = chooseNextSuit(computerHand);
    store.dispatch([
      setComputerMove(`Computer played an '8'. Computer selects ${nextSuit} as the next suit.`),
      setGuide(`Play an '8' or ${nextSuit}.`),
      setExpected({ rank: ['8'], suit: nextSuit })
    ]);
  } else {
    const { rank, suit } = pileCard;
    store.dispatch([
      setComputerMove(`Computer played a ${cardToString(pileCard)}.`),
      setGuide(`Play a '${rank}', a ${suit}, or an '8'.`),
      setExpected({ rank: ['8', rank], suit })
    ]);
  }
}

// Only update draw/expected fields (and guide field if 8 is played)
function computeComputerOptions(nextSuit) {
  const state = store.getState();
  const pileCard = selectTopCardFromPile(state);
  if (pileCard.rank === '2') {
    const curDraw = getDraw(state);
    const newDraw = curDraw === 1 ? curDraw + 1 : curDraw + 2;
    store.dispatch([
      setDraw(newDraw),
      setExpected({ rank: ['2'], suit: null })
    ]);
  } else if (pileCard.rank === '8') {
    store.dispatch([
      setGuide(`Play an '8' or ${nextSuit}.`),
      setExpected({ rank: ['8'], suit: nextSuit })
    ]);
  } else {
    const { rank, suit } = pileCard;
    store.dispatch([
      setExpected({ rank: ['8', rank], suit })
    ]);
  }
}

// Check that player has entered a valid choice.
// Player's values are checked against state.info.expected.
// Expected values are set by computePlayerOptions().
function validatePlayerChoice(choice) {
  const { rank: expRank, suit: expSuit } = getExpected(store.getState());
  if (expSuit === null) {
    return expRank.includes(choice.rank);
  } else {
    return (expRank.includes(choice.rank)) || (choice.suit === expSuit);
  }
}

// Move card from player's hand to pile
// First set lock to prevent further plays by player.
//   Game is unlocked after computer plays or by starting a new game.
//   If computer wins, game remains locked, and player must start new game to unlock.
// If player's card count goes to 0, player wins. In this case, return true.
// If player hasn't won, initiate computer's play.
function handlePlayerPlay(card, nextSuit = null) {
  // Note: setLock() prevents player from making another move until computer has played
  store.dispatch([
    setLock(),
    removeCardFromPlayer(card.id),
    addCardToPile(card)
  ]);
  const cardCnt = playerHandSize(store.getState());
  if (cardCnt === 0) {
    // Update guide text to indicate that player has won
    store.dispatch([
      setGuide('Player wins!')
    ]);
    return true;
  }
  // Player still has cards.
  computeComputerOptions(nextSuit);
  if (POST_PLAYER_DELAY === 0) {
    // Run synchronously. Use for command-line mode.
    performComputerPlay();
  } else {
    // Run asynchronously (with delay)
    TIMER_HANDLE = setTimeout(performComputerPlay, POST_PLAYER_DELAY);
  }
  return false;
}

// Draw ${drawCnt} cards from deck
function handlePlayerDraw(drawCnt) {
  store.dispatch(setLock());
  for (let idx = 0; idx < drawCnt; idx++) {
    const cardFromDeck = selectTopCardFromDeck(store.getState());
    store.dispatch([
      removeCardFromDeck(cardFromDeck.id),
      addCardToPlayer(cardFromDeck)
    ]);
    const deckCnt = deckSize(store.getState());
    if (deckCnt === 0) {
      replenishDeck();
    }
  }
  // Reset drawCnt
  const pileCard = selectTopCardFromPile(store.getState());
  const { rank, suit } = pileCard;
  // If pileCard === 8, keep previous expected values
  if (pileCard.rank !== '8') {
    store.dispatch([
      setDraw(1),
      setExpected({ rank: ['8', rank], suit })
    ]);
  }
  if (POST_PLAYER_DELAY === 0) {
    // Run synchronously. Use for command-line mode.
    performComputerPlay();
  } else {
    // Run asynchronously (with delay)
    TIMER_HANDLE = setTimeout(performComputerPlay, POST_PLAYER_DELAY);
  }
}

// Move card from computer's hand to pile
// If computer's card count goes to 0, computer wins.
// If computer hasn't won, unlock game to allow player's turn.
function handleComputerPlay(card) {
  store.dispatch([
    removeCardFromComputer(card.id),
    addCardToPile(card)
  ]);
  const state = store.getState()
  const cardCnt = computerHandSize(state);
  if (cardCnt === 0) {
    // Update guide text to indicate that player has won
    let guide = getGuide(state);
    guide += ' Computer wins!';
    store.dispatch([
      setGuide(guide)
    ]);
    return true;
  }
  // Update guide info
  computePlayerOptions();
  return false;
}

// Draw ${drawCnt} cards from deck
function handleComputerDraw(drawCnt) {
  for (let idx = 0; idx < drawCnt; idx++) {
    const cardFromDeck = selectTopCardFromDeck(store.getState());
    store.dispatch([
      removeCardFromDeck(cardFromDeck.id),
      addCardToComputer(cardFromDeck)
    ]);
    const deckCnt = deckSize(store.getState());
    if (deckCnt === 0) {
      replenishDeck();
    }
  }
  // Update on-screen info
  const pileCard = selectTopCardFromPile(store.getState());
  // If card === 8, previous instructions still
  if (pileCard.rank === '8') {
    store.dispatch([
      setComputerMove(`Computer drew ${drawCnt}.`)
      // Previous guide/draw/expected should still be valid
    ]);
  } else {
    const { rank, suit } = pileCard;
    store.dispatch([
      setComputerMove(`Computer drew ${drawCnt}.`),
      setGuide(`Play a '${rank}', a ${suit}, or an '8'.`),
      setDraw(1),
      setExpected({ rank: ['8', rank], suit })
    ]);
  }
}

function performComputerPlay() {
  const state = store.getState();
  const { rank: expRank, suit: expSuit } = getExpected(state);
  const computerHand = getComputerHand(state);
  const drawCnt = getDraw(state);
  const nextPlay = computeNextPlay(computerHand, expRank, expSuit);
  let computerWins = false;
  if (nextPlay) {
    computerWins = handleComputerPlay(nextPlay);
  } else {
    // No suitable play found. (nextPlay is falsy/undefined). Draw card.
    handleComputerDraw(drawCnt);
  }
  if (computerWins) {
    // Game over
    return;
  } else {
    // Unlock game to allow player to play
    store.dispatch([
      clearLock()
    ]);
  }
}

function replenishDeck() {
  const state = store.getState();
  const topCardFromPile = selectTopCardFromPile(state);
  const pile = getPile(state);
  store.dispatch([ clearPile(), addCardToPile(topCardFromPile) ]);
  store.dispatch([
    setDeck(pile.filter(card =>card.id !== topCardFromPile.id)),
    shuffleDeck()
  ]);
}

export {
  startGame, computePlayerOptions, validatePlayerChoice,
  handlePlayerPlay, handlePlayerDraw
};