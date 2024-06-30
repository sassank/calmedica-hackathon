'use client';

import { useRouter } from 'next/navigation';
import { Button, ButtonProps } from '../ui/button';

const LinkButton = ({
	href,
	...buttonProps
}: ButtonProps & { href: string }) => {
	const router = useRouter();
	return <Button {...buttonProps} onClick={() => router.push(href)} />;
};

export { LinkButton };
