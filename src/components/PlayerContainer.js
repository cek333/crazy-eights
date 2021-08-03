import React, { useState } from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { selectAll } from '../store/slices/playerSlice';
import { getLock, getDraw } from '../store/slices/infoSlice';
import {
  validatePlayerChoice,
  handlePlayerPlay,
  handlePlayerDraw
} from '../store/logic';
import PlayingCard from './PlayingCard';
import './PlayerContainer.css';

function PlayerContainer() {
  const cards = useSelector(selectAll);
  const inputLocked = useSelector(getLock);
  const drawCnt = useSelector(getDraw);
  const [ errorMsg, setErrorMsg ] = useState(<>&nbsp;</>);
  const [ eightCard, setEightCard ] = useState(null);

  const cardContainerClasses = classnames(
    'flex-container',
    { disabled: inputLocked }
  );

  const hideBtns = cards.length <= 0;
  const defaultBtnClasses = classnames({ hide: inputLocked || hideBtns || (eightCard !== null) });
  const suitSelBtnClasses = classnames({ hide: inputLocked || hideBtns || (eightCard === null) });
  console.log('Classes:', defaultBtnClasses, suitSelBtnClasses, hideBtns, eightCard);

  function handlePlay(card) {
    // Clear previous error message
    setErrorMsg(<>&nbsp;</>);
    if (inputLocked) {
      return;
    }
    if (validatePlayerChoice(card)) {
      if (card.rank === '8') {
        setEightCard(card);
      } else {
        handlePlayerPlay(card);
      }
    } else {
      setErrorMsg('Invalid selection!');
      setTimeout(() => setErrorMsg(<>&nbsp;</>), 2000);
    }
  }

  function handlePlayEight(card, suit) {
    handlePlayerPlay(card, suit);
    setEightCard(null);
  }

  function handleDraw(drawCnt) {
    handlePlayerDraw(drawCnt);
  }

  return (
    <div>
      <h3>Player Cards</h3>
      <div className='flex-container btns'>
        <div className={suitSelBtnClasses}>
          <button onClick={() => handlePlayEight(eightCard, 'hearts')}>Hearts</button>
          <button onClick={() => handlePlayEight(eightCard, 'diamonds')}>Diamonds</button>
          <button onClick={() => handlePlayEight(eightCard, 'clubs')}>Clubs</button>
          <button onClick={() => handlePlayEight(eightCard, 'spades')}>Spades</button>
        </div>
        <div className={defaultBtnClasses}>
          <button onClick={() => handleDraw(drawCnt)}>Draw {drawCnt}</button>
        </div>
        <div className='error'>{errorMsg}</div>
      </div>
      <div className={cardContainerClasses}>
        {cards.map(card =>
          <PlayingCard key={card.id} card={card}
            onClick={() => handlePlay(card)} />)
        }
      </div>
    </div>
  );
}

export default PlayerContainer;