import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jet Dashboard - Kanban & Second Brain',
  description: 'A modern dashboard combining Kanban board and Second Brain features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}