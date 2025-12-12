import { Head, Link, router } from '@inertiajs/react';
import Layout from '@/client/layouts/Layout';
import { HomeProps } from '@/shared/inertia';
import { Button } from '@/client/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card';

export default function Home({
  name = 'World',
  timestamp,
}: HomeProps) {
  const refreshTime = () => {
    router.reload({ only: ['timestamp'] });
  };

  return (
    <Layout>
      <Head title="Home" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to your dashboard.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hello, {name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Welcome</div>
              <p className="text-xs text-muted-foreground">
                To your Fastify + Inertia app
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-mono">{timestamp}</div>
              <Button
                onClick={refreshTime}
                variant="outline"
                size="sm"
                className="mt-4 w-full"
              >
                Partial Reload
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Navigate through the application</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">About Page</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
