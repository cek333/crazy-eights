import './About.css';
import screenshot from '../assets/crazy_eights_screenshot.png';
import draw_pic from '../assets/crazy_eights_draw_button.png';
import suit_sel_pic from '../assets/crazy_eights_suit_selection.png';

const img_border = {
  border: '1px solid gray'
};

function About() {
  return (
    <div>
      <h2>Crazy Eights Card Game</h2>
      <p className='sub-heading'>by Cecil King</p>

      <p>This card game app was built as part of the <a href='https://mintbean.io/' target='_blank' rel='noopener noreferrer'>Mintbean</a> 'Hiring Hackathon for Jr Web Devs' (Jul 27, 2021 to Aug 3, 2021). The front-end react/redux app implements a modified version of the Crazy Eights card game.</p>

      <h3>GAME RULES</h3>

      <p>The goal of the game is to get rid of all your cards.</p>

      <p>For each card played, the other player must match either the rank or suit of the card. On your turn, you can either draw a card from the deck or play a card.</p>

      <p>You can play an '8' card on top of any card. The person who plays the '8' can then select the next suit that needs to be played.</p>

      <p>Playing a '2' forces the other player to draw two cards. Alternatively, the other player can counter with another '2' increasing the draw penalty to 4 cards. Players can continue to play '2's, increasing the draw penalty by 2 each time, until one player is out of '2's and forced to draw.</p>

      <p>(In the <a href='https://www.pagat.com/eights/crazy8s.html' target='_blank' rel='noopener noreferrer'>2-player version of crazy eights</a>, the queen card can be used to force the other player to skip a turn, but that was not implemented as part of this hackaton.)</p>

      <h3>HOW TO PLAY</h3>

      <img src={screenshot} alt='screenshot of game' style={img_border} />

      <p>Click on the 'New Game' button to start a new game.</p>

      <p>To play, click on the card icons in the 'Player Cards' section or click on the draw button to draw a card.</p>

      <img src={draw_pic} alt='draw button' />

      <p>If you play an eight, you'll be presented with a group of buttons to select the next suit.</p>

      <img src={suit_sel_pic} alt='suit selection buttons' />

      <p>Each card played will be displayed on top of the 'Pile'. After you draw or play a card, all your cards will be grayed-out for about 2-3 seconds until the Computer has finished playing. After the computer plays, the 'Guide' section will be updated to indicate what the Computer played, as well as instructions on what you can play next.</p>

      <p>The Computer's card count is indicated under the Computer's deck.</p>

      <p>When either player gets to 0 cards the game ends. The winner will be indicated in the 'Guide' section.</p>

      <h3>TRY IT</h3>

      <p>Click on the 'Game' tab to try the game. Enjoy!</p>

      <h3>ABOUT ME</h3>
    
      <p>Hi. I'm Cecil King. I’m a full stack web developer with a background in ASIC verification. In Dec 2020, I obtained a certificate in web development from the UofT SCS Coding bootcamp. I'm transitioning into web development because I'm energized by the creative aspect of crafting and building applications.</p>

      <p>Here are the technologies I currently know (but I'm a quick learner so there's no limit to what I can potentially achieve).
        <ul>
          <li><strong>Languages</strong>: Javascript, jQuery, C, Perl</li>
          <li><strong>Databases</strong>: MySQL, Sequelize, MongoDB, Mongoose</li>
          <li><strong>Frontend</strong>:  HTML, CSS, Bootstrap, React, Redux</li>
          <li><strong>Backend</strong>: Node.js, Express, Handlebars, REST APIs</li>
          <li><strong>Version Control</strong>: Git, Github, CVS, Mercurial</li>
          <li><strong>Deployment</strong>: Heroku</li>
        </ul>
      </p>

      <p>Here are some of my links:
        <ul>
          <li><a href='https://www.linkedin.com/in/cecil-e-king/' target='_blank' rel='noopener noreferrer'>Linkedin</a></li>
          <li><a href='https://github.com/cek333' target='_blank' rel='noopener noreferrer'>Github</a></li>
          <li><a href='https://cek333.github.io/Responsive_Portfolio/portfolio.html' target='_blank' rel='noopener noreferrer'>Portfolio</a></li>
        </ul>
      </p>
    </div>
  );
}

export default About;