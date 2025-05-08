
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <SearchX className="w-24 h-24 text-destructive mb-6" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Oops! Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist, might have been removed, or is temporarily unavailable.
        Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Homepage
          </Link>
        </Button>
        {/* You can add more helpful links here, e.g., contact page, sitemap, etc. */}
        {/* Example:
        <Button variant="outline" asChild>
          <Link href="/contact">
            Contact Support
          </Link>
        </Button>
        */}
      </div>
      <footer className="mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Prioritize Now. All rights reserved.</p>
      </footer>
    </div>
  );
}
