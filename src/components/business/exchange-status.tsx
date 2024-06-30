import { Exchange } from '@prisma/client';
import { Badge } from '../ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '@/lib/utils';

type ExchangeStatusProps = {
	status: Exchange['status'];
};

const STATUS_COLOR_MAP: {
	[key: string]: { label: string; className: string };
} = {
	RED: {
		label: 'Critique',
		className: 'bg-red-300',
	},
	YELLOW: {
		label: 'Urgent',
		className: 'bg-yellow-300',
	},
	BLUE: {
		label: 'Suivis',
		className: 'bg-blue-300',
	},
	GREEN: {
		label: 'Traité',
		className: 'bg-green-300',
	},
	GRAY: {
		label: 'Terminé',
		className: 'bg-yellow-300',
	},
};

const ExchangeStatus = ({ status }: ExchangeStatusProps) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							'w-6 h-6 bg-red-500 rounded-md',
							STATUS_COLOR_MAP[status].className,
						)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					<span>{STATUS_COLOR_MAP[status].label}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export { ExchangeStatus };
