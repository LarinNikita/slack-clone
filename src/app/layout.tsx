import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';

import './globals.css';

import { Modals } from '@/components/modals';
import { Toaster } from '@/components/ui/sonner';
import { JotaiProvider } from '@/components/jotai-provider';
import { ConvexClientProvider } from '@/components/convex-client-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Slack',
    description: 'Real-Time Slack Clone',
    icons: {
        icon: '/logo.png',
    },
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
                    <ConvexClientProvider>
                        <JotaiProvider>
                            <Toaster />
                            <Modals />
                            {children}
                        </JotaiProvider>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
