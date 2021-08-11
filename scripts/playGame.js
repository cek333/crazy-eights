import inquirer from 'inquirer';
import store from '../src/store/store';
import {
  startGame,
  handlePlayerPlay,
  handlePlayerDraw,
  validatePlayerChoice
} from '../src/store/logic';
import {
  getComputerMove, getGuide, getDraw
} from '../src/store/slices/infoSlice';
import {
  countCards as getComputerHandCount
} from '../src/store/slices/computerSlice';
import {
  selectAll as getPlayerHand,
  countCards as getPlayerHandCount
} from '../src/store/slices/playerSlice';
import {
  selectTopCard as selectTopCardFromPile,
} from '../src/store/slices/pileSlice';
import {
  cardToString
} from '../src/store/util/util';

function displayInfo() {
  const state = store.getState();
  const lastMove = getComputerMove(state);
  const guide = getGuide(state);
  const computerHandCount = getComputerHandCount(state);
  const playerHandCount = getPlayerHandCount(state);
  if (lastMove.length > 0) {
    // When player wins, move is ''
    console.log(lastMove);
  }
  console.log(`Computer has ${computerHandCount} card(s).`);
  console.log(`You have ${playerHandCount} card(s).`);
  console.log(guide);
}

function getPlayerSelection() {
  const state = store.getState();
  const draw = getDraw(state);
  const playerHand = getPlayerHand(state);
  const questions = [
    {
      type: 'list',
      name: 'play',
      message: "Select next play:",
      choices: function(answers) {
        const options = playerHand.map(card =>
          ({ name: cardToString(card), value: { card, type: 'card' } })
        );
        options.push({ name: `Draw ${draw}.`, value: { type: 'draw', amt: draw } });
        options.push({ name: 'Exit', value: { type: 'exit' } });
        return options;
      }
    }
  ];
  return inquirer.prompt(questions);
}

function getSuitSelection() {
  const questions = [
    {
      type: 'list',
      name: 'suit',
      message: 'Select next suit:',
      choices: ['hearts', 'diamonds', 'spades', 'clubs']
    }
  ];
  return inquirer.prompt(questions);
}

// Check if queen was played. 
function queenPlayed(pileCard, lastCardId) {
  return (pileCard.rank === 'queen' && pileCard.id !== lastCardId);
}

function gameHasWinner() {
  const state = store.getState();
  const cardCntComputer = getComputerHandCount(state);
  const cardCntPlayer = getPlayerHandCount(state);
  return (cardCntComputer === 0 || cardCntPlayer === 0);
}

async function main() {
  let exit = false
  let lastCardId = null; // Use to check if top card on pile is fresh or from previous round
  console.log('CRAZY EIGHTS');
  startGame();
  while(!exit) {
    displayInfo();
    // Check for a winner
    if (gameHasWinner()) {
      exit = true; // Not necessary due to following break statement but set anyway.
      break;
    }
    const newCard = selectTopCardFromPile(store.getState());
    const newCardId = newCard.id;
    if (queenPlayed(newCard, lastCardId)) {
      // Skip turn implemented as player drawing 0 cards.
      handlePlayerDraw(0);
    } else {
      // Let player choose next move
      let redo;
      do {
        redo = false;
        const result = await getPlayerSelection();
        switch(result.play.type) {
          case 'card':
            // Check if valid choice made. If !valid => redo.
            redo = !(validatePlayerChoice(result.play.card));
            if (redo) {
              console.log('Invalid choice! Please select again.');
            } else {
              if (result.play.card.rank === '8') {
                const nextSuit = await getSuitSelection();
                handlePlayerPlay(result.play.card, nextSuit.suit);
              } else {
                handlePlayerPlay(result.play.card);
              }
              if (result.play.card.rank === 'queen') {
                // Player gets to play again.
                if (!gameHasWinner()) {
                  lastCardId = result.play.card.id;
                  displayInfo();
                  redo = true;
                }
              }
            }
            break;
          case 'draw':
            handlePlayerDraw(result.play.amt);
            break;
          default:
            // should be exit option
            exit = true;
            break;
        }
      } while (!exit && redo);
    }
    lastCardId = newCardId;
  }
}

main();