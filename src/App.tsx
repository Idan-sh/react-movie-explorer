/**
 * App Component
 *
 * Root application component.
 * Currently renders HomePage directly.
 * Will add routing when movie details page is implemented.
 */

import { HomePage } from '@/pages/HomePage';

function App(): React.JSX.Element {
  return <HomePage />;
}

export default App;
