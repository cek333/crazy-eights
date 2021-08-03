import { useSelector } from 'react-redux';
import { countCards } from '../store/slices/computerSlice';
import EmptyPlayingCard from '../components/EmptyPlayingCard';

function Computer() {
  const cardCnt = useSelector(countCards);
  
  return (
    <div>
      <h3>Computer</h3>
      <EmptyPlayingCard />
      <p>Computer has {cardCnt} card(s).</p>
    </div>
  );
}

export default Computer;
