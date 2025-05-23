/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import './index.css';
import Home from './routes/Home';
import StyleGuide from './routes/StyleGuide';
import Login from './routes/Login';
import About from './routes/About';
import PokemonSearchTest from './components/PokemonSearchTest';
import SetDisplayPage from './routes/SetDisplayPage';
import DeckList from './routes/Decklist';

// const root = document.getElementById('root');

// if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
//   throw new Error(
//     'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
//   );
// }

render(() => (
  <Router fallbackElement={<div>Loading...</div>}> 
    <Route path="/" component={Home} />
    <Route path="/style-guide" component={StyleGuide} />
    <Route path="/login" component={Login} />
    <Route path="/about" component={About} />
    <Route path="/pokemon-test" component={PokemonSearchTest} />
    <Route path="/set/:setId" component={SetDisplayPage} />
    <Route path="/decklist" component={DeckList} />
  </Router>
), document.getElementById('root')); // Ensure your HTML has an element with id="root"
