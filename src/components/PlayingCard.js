import './PlayingCard.css';
import icon_hearts from '../assets/Cards_Icon_Hearts.png';
import icon_clubs from '../assets/Cards_Icon_Clubs.png';
import icon_spades from '../assets/Cards_Icon_Spades.png';
import icon_diamonds from '../assets/Cards_Icon_Diamonds.png';

function PlayingCard(props) {
  const { card } = props;
  let displayRank;
  switch(card.rank) {
    case 'ace':
      displayRank = 'A';
      break;
    case 'jack':
      displayRank = 'J';
      break;
    case 'queen':
      displayRank = 'Q';
      break;
    case 'king':
      displayRank = 'K';
      break;
    default:
      displayRank = card.rank;
      break;
  }
  let displayIcon;
  switch(card.suit) {
    case 'hearts':
      displayIcon = icon_hearts;
      break;
    case 'diamonds':
      displayIcon = icon_diamonds;
      break;
    case 'clubs':
      displayIcon = icon_clubs;
      break;
    default:
      displayIcon = icon_spades;
      break;
  }

  return (
    <div className='card-box' onClick={props.onClick}>
      <p className='top-rank'>{displayRank}</p>
      <div className='icon'>
        <img src={displayIcon} alt={card.suit} />
      </div>
      <p className='bottom-rank'>{displayRank}</p>
    </div>
  );
}

export default PlayingCard;
