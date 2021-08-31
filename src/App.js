import { HashRouter as Router, Route } from 'react-router-dom';
import CreateSecret from './CreateSecret';
import DisplaySecret from './DisplaySecret';
export default function App() {
  return (
    <Router>
      <Route path="/" exact={true} component={CreateSecret} />
      <Route
        exact={true}
        path="/:format(s|f)/:key/:password?"
        component={DisplaySecret}
      />
    </Router>
  );
}