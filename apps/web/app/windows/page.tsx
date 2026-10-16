import { redirect } from 'next/navigation';

// The desktop used to live here while Flow held the home page. It's the home page now, so
// keep old links working. A static segment outranks app/[...slug], which would send this
// to /links instead.
export default function WindowsPage() {
  redirect('/');
}
