import { Exchange } from '@prisma/client';
import { Badge } from '../ui/badge';

type ExchangeBadgeProps = {
	type: Exchange['type'];
};

const ExchangeBadge = ({ type }: ExchangeBadgeProps) => {
	const label = type === 'CALL' ? 'Appel téléphonique' : 'SMS';
	return <Badge>{label}</Badge>;
};

export { ExchangeBadge };
