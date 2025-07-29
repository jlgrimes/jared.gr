import { redirect } from 'next/navigation';

export default function CatchAllPage() {
  // Redirect to /links
  redirect('/links');
}
