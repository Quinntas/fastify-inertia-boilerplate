import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Layout from '@/client/layouts/Layout';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { Label } from '@/client/components/ui/label';
import { contactSchema, type ContactForm } from '@/shared/contactSchema';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/client/components/ui/card';

export default function Contact() {
  const { data, setData, post, processing, errors, reset, setError, clearErrors } =
    useForm<ContactForm>({
      name: '',
      email: '',
      message: '',
    });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const result = contactSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path[0] as keyof ContactForm, issue.message);
      });
      return;
    }

    post('/contact', {
      onSuccess: () => reset(),
    });
  };

  return (
    <Layout>
      <Head title="Contact Us" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
          <p className="text-muted-foreground">
            Get in touch with us.
          </p>
        </div>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              Send us a message and we'll get back to you.
            </CardDescription>
          </CardHeader>
          <form onSubmit={submit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm font-medium text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={data.message}
                  onChange={(e) => setData('message', e.target.value)}
                  placeholder="Your message..."
                />
                {errors.message && (
                  <p className="text-sm font-medium text-red-500">{errors.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={processing}>
                {processing ? 'Sending...' : 'Send Message'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
