import { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Layout from '@/client/layouts/Layout';
import { UsersProps } from '@/shared/inertia';
import { Input } from '@/client/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/client/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/client/components/ui/select';
import { Button } from '@/client/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/client/components/ui/pagination';
import { Skeleton } from '@/client/components/ui/skeleton';
import { Search, ChevronRight } from 'lucide-react';

export default function Users({ users, filters, meta }: UsersProps) {
  const [search, setSearch] = useState(filters.q || '');
  const [role, setRole] = useState(filters.role || 'all');
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Debounce search and sync with URL
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      router.get(
        '/users',
        { q: search, role: role === 'all' ? undefined : role },
        {
          preserveState: true,
          replace: true,
          onStart: () => setIsLoading(true),
          onFinish: () => setIsLoading(false),
        }
      );
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, role]);

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  const getPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.role && filters.role !== 'all') params.set('role', filters.role);
    params.set('page', pageNumber.toString());
    return `/users?${params.toString()}`;
  };

  const userRows = [];

  if (isLoading) {
    for (let i = 0; i < 5; i++) {
      userRows.push(
        <TableRow key={`skeleton-${i}`}>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-9 w-24" />
          </TableCell>
        </TableRow>
      );
    }
  } else {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      userRows.push(
        <TableRow key={user.id}>
          <TableCell className="font-medium">{user.id}</TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <span className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              {user.role}
            </span>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/users/${user.id}`} prefetch>
                Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      );
    }
  }

  return (
    <Layout>
      <Head title="Users" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage users and their roles. Hover over "Details" to prefetch the data.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRows.length > 0 ? (
                userRows
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {meta.lastPage > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={meta.page > 1 ? getPageUrl(meta.page - 1) : '#'}
                  aria-disabled={meta.page <= 1}
                  className={
                    meta.page <= 1 ? 'pointer-events-none opacity-50' : ''
                  }
                  prefetch
                  onStart={() => setIsLoading(true)}
                  onFinish={() => setIsLoading(false)}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="flex h-9 items-center justify-center px-4 text-sm text-muted-foreground">
                  Page {meta.page} of {meta.lastPage}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={
                    meta.page < meta.lastPage
                      ? getPageUrl(meta.page + 1)
                      : '#'
                  }
                  aria-disabled={meta.page >= meta.lastPage}
                  className={
                    meta.page >= meta.lastPage
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                  prefetch
                  onStart={() => setIsLoading(true)}
                  onFinish={() => setIsLoading(false)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Layout>
  );
}
