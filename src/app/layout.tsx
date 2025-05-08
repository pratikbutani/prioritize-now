
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'; // Import GoogleAnalytics

const APP_NAME = 'Prioritize Now - Eisenhower Matrix';
const APP_DESCRIPTION = 'Boost productivity by organizing tasks with the Urgent-Important Eisenhower Matrix. Add, prioritize, and manage your to-do list effectively. Works offline as a PWA.';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s - ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
    // startUpImage: [], // Can add startup images if needed
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    url: 'https://prioritize-now.vercel.app', // Replace with your actual deployed URL
    images: [
      {
        url: '/icons/og-image.png', // Replace with your actual OG image path
        width: 1200,
        height: 630,
        alt: 'Prioritize Now - Eisenhower Matrix Application',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: APP_NAME,
      template: `%s - ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    images: ['/icons/og-image.png'], // Replace with your actual Twitter image path
    // creator: "@yourtwitterhandle", // Add your Twitter handle if you have one
  },
  keywords: ['Eisenhower Matrix', 'Task Management', 'Productivity', 'To-Do List', 'Prioritization', 'Urgent Important Matrix', 'PWA'],
  authors: [{ name: 'Pratik Butani', url: 'https://linkedin.com/in/pratikbutani' }],
  creator: 'Pratik Butani',
  publisher: 'Pratik Butani',
};

export const viewport: Viewport = {
  themeColor: '#3498db', // Calm Blue from globals.css --primary HSL(207, 70%, 40%) approx #2471A3. Updated to match manifest.
  width: 'device-width',
  initialScale: 1,
  // minimumScale: 1, // Optional
  // maximumScale: 1, // Optional
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
         {/* theme-color is now in viewport, but can be kept here as fallback if needed */}
         {/* <meta name="theme-color" content="#3498db" /> */}
         <GoogleAnalytics /> {/* Add Google Analytics script */}
      </head>
      {/* Use GeistSans.variable for the font class */}
      <body className={`${GeistSans.variable} antialiased`}>
        {children}
        <Toaster /> {/* Add Toaster here */}
      </body>
    </html>
  );
}

