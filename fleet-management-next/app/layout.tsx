import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Box from '@mui/material/Box';
import Sidebar from '@/components/Sidebar';
import ThemeRegistry from '@/components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fleet Management System',
  description: 'A comprehensive fleet management solution',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <Box sx={{ display: 'flex' }}>
              <Sidebar />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
                  backgroundColor: 'background.default',
                }}
              >
                {children}
              </Box>
            </Box>
            <Toaster position="top-right" />
          </ThemeRegistry>
        </AppRouterCacheProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
