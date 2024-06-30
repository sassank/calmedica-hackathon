import { cn } from '@/lib/utils';

type Message = {
	role: 'ASSISTANT' | 'PATIENT';
	message: string;
};

type ChatProps = {
	messages: Message[];
};

const Chat = ({ messages }: ChatProps) => {
	return (
		<div className='flex-1 flex flex-col gap-2 overflow-y-auto'>
			{messages.map((message, index) => (
				<div
					key={index}
					className={cn('p-3 text-sm rounded-xl', {
						'text-white bg-primary rounded-br-none ml-6':
							message.role === 'ASSISTANT',
						'text-black bg-gray-200 rounded-tl-none mr-6':
							message.role === 'PATIENT',
					})}
				>
					{message.message}
				</div>
			))}
		</div>
	);
};

export { Chat };
