import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';

import './globals.css';

import { ConvexClientProvider } from '@/components/convex-client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Slack',
    description: 'Real-Time Slack Clone',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
