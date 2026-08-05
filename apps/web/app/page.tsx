import { info } from '@jared/info';
import { SiteShell } from './SiteShell';

// The shell picks a wrapper; the wrappers render the same info. Content changes only ever
// touch packages/info/src/data.ts.
export default function Home() {
  return <SiteShell info={info} />;
}
