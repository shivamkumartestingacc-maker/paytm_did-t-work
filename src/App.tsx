import ErrorBoundary from './shell/ErrorBoundary';
import Shell from './shell/Shell';
import { flows } from './flows';

export default function App() {
  return (
    <ErrorBoundary>
      <Shell flows={flows} />
    </ErrorBoundary>
  );
}
