import { Head, Link } from '@inertiajs/react';
import Layout from '@/client/layouts/Layout';
import { UserDetailProps } from '@/shared/inertia';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function UserDetail({ user }: UserDetailProps) {
  return (
    <Layout>
      <Head title={`User: ${user.name}`} />
      <div className="space-y-6">
        <div>
          <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-0 hover:bg-transparent">
            <Link href="/users" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground">User Details View</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Details about the selected user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">ID</p>
                <p className="text-sm font-medium">{user.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none text-muted-foreground">Role</p>
                <div className="flex items-center">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
