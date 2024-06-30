'use client';

import { ChevronLeftIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BackLink = () => {
	const pathname = usePathname();

	if (pathname === '/') return null;

	return (
		<Link href='/' className='absolute left-0 inline-flex items-center gap-2'>
			<ChevronLeftIcon className='w-4 h-4' />
			<span className='text-sm'>Patients</span>
		</Link>
	);
};

export { BackLink };
