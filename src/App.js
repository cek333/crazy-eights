import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import Nav from './components/Nav';
import Game from './pages/Game';
import About from './pages/About';
import './App.css';

function App() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path='/game' component={Game} />
        <Route path='/about' component={About} />
        <Redirect to='/about' />
      </Switch>
    </Router>
  );
}
export default App;
