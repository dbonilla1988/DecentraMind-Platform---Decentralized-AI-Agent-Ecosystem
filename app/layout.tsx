import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { WalletProvider } from './providers/WalletProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ReduxProvider } from './providers/ReduxProvider';
import { ToastProvider } from './components/ToastNotifications';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'DecentraMind',
  description: 'Decentralized AI Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <body className="m-0 p-0 bg-gray-900 text-white min-h-screen">
                        <ReduxProvider>
                  <ThemeProvider>
                    <WalletProvider>
                      <ToastProvider>
                      {children}
                      </ToastProvider>
                    </WalletProvider>
                  </ThemeProvider>
                </ReduxProvider>
      </body>
    </html>
  );
} 