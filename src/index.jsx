/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import './index.css';
import Home from './routes/Home';
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
    <Route path="/decklist" component={DeckList} />
  </Router>
), document.getElementById('root')); // Ensure your HTML has an element with id="root"
