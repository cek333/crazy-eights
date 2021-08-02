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
  selectEntities as getPile
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
  setComputerMove, setGuide, setDraw, resetDraw,
  setExpected, setLock, clearLock, resetInfo,
  getComputerMove, getGuide, getDraw, getExpected, getLock
} from '../store/slices/infoSlice';
import {
  cardToString
} from '../store/util/util';
const INITIAL_CARDS_PER_PLAYER = 7;
// After player's turn, insert some delay so player can see their card on pile,
// before executing computer's play.
// For command-line version of app, REACT_APP_POST_PLAYER_DELAY is set to 0 (in package.json)
const POST_PLAYER_DELAY = Number(process.env.REACT_APP_POST_PLAYER_DELAY || 1000); 
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
  computePlayerOptions(cardFromDeck);
}

function computePlayerOptions(card) {
  if (card.rank === '2') {
    const curDraw = getDraw(store.getState());
    const newDraw = curDraw === 1 ? curDraw + 1 : curDraw + 2;
    store.dispatch([
      setComputerMove(`Computer played a '2'.`),
      setGuide(`Play a '2' or draw ${newDraw} cards.`),
      setDraw(newDraw),
      setExpected({ rank: ['2'], suit: null })
    ]);
  } else if (card.rank === '8') {
    const computerHand = getComputerHand(store.getState());
    const nextSuit = chooseNextSuit(computerHand);
    store.dispatch([
      setComputerMove(`Computer played a '8'. Computer selects ${nextSuit} as the next suit.`),
      setGuide(`Play an '8' or ${nextSuit}.`),
      setExpected({ rank: ['8'], suit: nextSuit })
    ]);
  } else {
    const rank = card.rank;
    const suit = card.suit;
    store.dispatch([
      setComputerMove(`Computer played a ${cardToString(card)}.`),
      setGuide(`Play a '${rank}', a ${suit}, or an '8'.`),
      setExpected({ rank: ['8', rank], suit })
    ]);
  }
}

// Check that player has entered a valid choice.
// Player's values are checked against state.info.expected.
// Expected values are set by computePlayerOptions().
function validatePlayerChoice(choice) {
  const { suit: expSuit, rank: expRank } = getExpected(store.getState());
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
function handlePlayerPlay(card) {
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
  } else {
    if (POST_PLAYER_DELAY === 0) {
      // Run synchronously. Use for command-line mode.
      performComputerPlay();
    } else {
      // Run asynchronously (with delay)
      TIMER_HANDLE = setTimeout(performComputerPlay, POST_PLAYER_DELAY);
    }
  }
  return false;
}

// Draw ${drawCnt} cards from deck
function handlePlayerDraw(drawCnt) {
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
}

function performComputerPlay() {
  const state = store.getState();
  const cardFromPile = selectTopCardFromPile(state);
  const computerHand = getComputerHand(state);
  const drawCnt = getDraw(state);
  const nextPlay = computeNextPlay(computerHand, cardFromPile);
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
    // Update guide info
    computePlayerOptions(nextPlay);
    // Unlock game to allow player to play
    store.dispatch([
      clearLock()
    ]);
  }
}

function replenishDeck() {

}

export {
  startGame, computePlayerOptions, validatePlayerChoice,
  handlePlayerPlay, handlePlayerDraw
};