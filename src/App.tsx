import Shell from './shell/Shell';
import { flows } from './flows';

export default function App() {
  return <Shell flows={flows} />;
}
