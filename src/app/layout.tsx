import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

export const metadata: Metadata = {
  title: 'Prioritize Now - Eisenhower Matrix',
  description: 'Manage your tasks effectively with the Eisenhower Matrix.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Use GeistSans.variable for the font class */}
      <body className={`${GeistSans.variable} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}
