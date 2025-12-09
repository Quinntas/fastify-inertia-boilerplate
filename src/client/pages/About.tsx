import { Head, Link } from '@inertiajs/react';
import { Button } from '@/client/components/ui/button';

export default function About() {
  return (
    <>
      <Head title="About" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">About Page</h1>
          <p className="mb-6 text-gray-600">
            This is an example of client-side navigation using Inertia.js.
            The page transition happens without a full browser reload.
          </p>

          <div className="flex gap-4">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
