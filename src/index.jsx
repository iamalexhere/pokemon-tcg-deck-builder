/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Route } from "@solidjs/router";
import './index.css';
import profile from './routes/profile'

import './index.css';
import App from './App';

// const root = document.getElementById('root');

// if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
//   throw new Error(
//     'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
//   );
// }

// render(() => <App />, root);

render(() => (
  <Router fallbackElement={<div>Loading...</div>}> 
    <Route path="/profile" component={profile} />
  </Router>
), document.getElementById('root')); // Ensure your HTML has an element with id="root"
