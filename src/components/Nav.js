import { NavLink } from 'react-router-dom';
import './Nav.css';

function Nav() {
  return (
    <nav>
      <NavLink to='/game' activeClassName='active'>Game</NavLink>
      <NavLink to='/about' activeClassName='active'>About</NavLink>
    </nav>
  );
}

export default Nav;