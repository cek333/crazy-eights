import { useSelector } from 'react-redux';
import { selectTopCard } from '../store/slices/pileSlice';
import PlayingCard from './PlayingCard';

function Pile() {
  const topCard = useSelector(selectTopCard);

  return (
    <div>
      <h3>Pile</h3>
      {topCard && <PlayingCard card={topCard} />}
    </div>
  );
}

export default Pile;