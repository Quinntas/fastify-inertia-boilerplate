import { Head, Link } from '@inertiajs/react';

import { Button } from '@/client/components/ui/button';

export default function Home({ name = 'World' }: { name?: string }) {
  return (
    <>
      <Head title="Home" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800">Hello, {name}!</h1>
          <p className="mt-4 text-gray-600">
            Welcome to your Fastify + Inertia + React + Tailwind v4 app.
          </p>
          <div className="mt-6 flex gap-4">
            <Button>Get Started</Button>
            <Button variant="outline" asChild>
              <Link href="/about">About Page</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
