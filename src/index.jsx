/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import './index.css';
import Home from './routes/Home';
import DeckEditor from './routes/DeckEditor'
import StyleGuide from './routes/StyleGuide';
import Login from './routes/Login';
import About from './routes/About';
import PokemonSearchTest from './components/PokemonSearchTest';
import SetDisplayPage from './routes/SetDisplayPage';
import DeckList from './routes/Decklist';
import profile from './routes/profile'
import NotFound from './routes/error'
import Layout from './components/Layout'
import CardLists from './routes/CardLists';
import CardDetails from './routes/CardDetails';

// const root = document.getElementById('root');

// if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
//   throw new Error(
//     'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
//   );
// }

// render(() => <App />, root);

render(() => (
  <Router root={Layout} fallbackElement={<div>Loading...</div>}> 
    <Route path="/" component={Home} />
    <Route path="/deckeditor" component={DeckEditor} />
    <Route path="/profile" component={profile} />
    <Route path="/style-guide" component={StyleGuide} />
    <Route path="/login" component={Login} />
    <Route path="/about" component={About} />
    <Route path="/pokemon-test" component={PokemonSearchTest} />
    <Route path="/set/:setId" component={SetDisplayPage} />
    <Route path="/decklist" component={DeckList} />
    <Route path="/card-details" component={CardDetails}/>
    <Route path="/cardlist" component={CardLists}/>
    {/* catch all weird access page */}
    <Route path="*" component={NotFound} />
  </Router>
), document.getElementById('root')); // Ensure your HTML has an element with id="root"
