import { Head, Link } from '@inertiajs/react';
import { Button } from '@/client/components/ui/button';
import Layout from '@/client/layouts/Layout';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card';

export default function About() {
  return (
    <Layout>
      <Head title="About" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">About</h1>
          <p className="text-muted-foreground">
            Learn more about this application.
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is an example of client-side navigation using Inertia.js.
              The page transition happens without a full browser reload.
            </p>
            <p className="text-sm text-muted-foreground">
              It features a Fastify backend, React frontend, Shadcn UI components,
              and Tailwind CSS for styling.
            </p>
            <div className="pt-4">
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
