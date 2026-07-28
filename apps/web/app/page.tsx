import { info } from '@jared/info';
import { WindowsWrapper } from '@wrapper/windows';

// Swap the wrapper to redesign the whole site — the info stays the same.
export default function Home() {
  return <WindowsWrapper info={info} />;
}
