import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';

import '@/styles/globals.css';
import { BackLink } from '@/components/business/back-link';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: 'CalMedica',
	icons: {
		icon: '/favicon.ico',
	},
};

type LayoutProps = Readonly<{
	children: React.ReactNode;
}>;

const Layout = ({ children }: LayoutProps) => {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable,
				)}
			>
				<div className='flex min-h-screen w-full flex-col bg-muted/40'>
					<div className='flex flex-col sm:gap-4 sm:py-4'>
						<main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
							<div className='max-w-5xl container'>
								<div className='relative flex items-center justify-center py-8'>
									<BackLink />
									<img src='/logo.png' alt='calmedica logo' />
								</div>
								<div>{children}</div>
							</div>
						</main>
					</div>
				</div>

				<Toaster />
			</body>
		</html>
	);
};

export default Layout;
