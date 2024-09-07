import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Price Wizard',
  description: 'Accorder les valeurs, estimations relatives ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="antialiased" lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
