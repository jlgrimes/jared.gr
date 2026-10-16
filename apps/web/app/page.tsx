import { info } from '@jared/info';
import { WindowsWrapper } from '@wrapper/windows';

// The wrapper renders the info. Content changes only ever touch packages/info/src/data.ts.
export default function Home() {
  return <WindowsWrapper info={info} />;
}
