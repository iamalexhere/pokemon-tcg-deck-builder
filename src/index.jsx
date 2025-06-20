/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import './index.css';
import Home from './routes/Home';
import DeckEditor from './routes/DeckEditor'
import Login from './routes/Login';
import Register from './routes/Register';
import About from './routes/About';
import DeckList from './routes/Decklist';
import Profile from './routes/profile'
import NotFound from './routes/error'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute';
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
    <Route path="/deckeditor/:deckId" component={() => (
      <ProtectedRoute>
        <DeckEditor />
      </ProtectedRoute>
    )} />
    <Route path="/profile" component={() => (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
    <Route path="/about" component={About} />
    <Route path="/decklist" component={DeckList} />
    <Route path="/card-details/:cardId" component={CardDetails}/>
    <Route path="/cardlist" component={CardLists}/>
    {/* catch all weird access page */}
    <Route path="*" component={NotFound} />
  </Router>
), document.getElementById('root')); // Ensure your HTML has an element with id="root"
