import { useSelector } from 'react-redux';
import { getComputerMove, getGuide } from '../store/slices/infoSlice';

function Info() {
  const computerMove = useSelector(getComputerMove);
  const guide = useSelector(getGuide);

  return (
    <div>
      <h3>Guide</h3>
      <p>{computerMove}</p>
      <p>{guide}</p>
      {guide && <p>Click on a card to select it.</p>}
    </div>
  );
}

export default Info;