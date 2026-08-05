import { info } from '@jared/info';
import { WindowsWrapper } from '@wrapper/windows';

// Direct route to the Windows desktop. A static segment outranks app/[...slug], so this
// survives the catch-all redirect to /links.
//
// Stopgap until the corner peel ships (Phase 3) — without it Windows mode is unreachable.
export default function WindowsPage() {
  return <WindowsWrapper info={info} />;
}
