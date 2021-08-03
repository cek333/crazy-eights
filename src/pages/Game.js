import React from 'react';
import PlayerContainer from '../components/PlayerContainer';
import Deck from '../components/Deck';
import Pile from '../components/Pile';
import Info from '../components/Info';
import Computer from '../components/Computer';
import { startGame } from '../store/logic';
import './Game.css';

function Game() {

  function handleClick(evt) {
    startGame();
  }
  
  return (
    <div>
      <div className='flex-container header'>
        <h2>Crazy Eights</h2>
        <button onClick={handleClick}>New Game</button>
      </div>
      <div className='flex-container center-row'>
        <Deck />
        <Pile />
        <Computer />
        <Info />
      </div>
      <PlayerContainer />
    </div>
  );
}

export default Game;