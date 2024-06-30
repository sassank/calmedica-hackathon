'use client';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { useState } from 'react';
import { addExchange } from '@/actions/add-exchange';
import { useFormState, useFormStatus } from 'react-dom';

type ExchangeCreateFormProps = {
	patientId: string;
};

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' disabled={pending} form='exchange-create-form'>
			{pending ? 'En cours...' : 'Enregistrer'}
		</Button>
	);
};

const ExchangeCreateForm = ({ patientId }: ExchangeCreateFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [state, action] = useFormState(addExchange, {
		error: '',
	});

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Ajouter un échange</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Ajouter un échange</DialogTitle>
					<DialogDescription>This is the dialog description</DialogDescription>
				</DialogHeader>
				<form id='exchange-create-form' action={action}>
					<div className='flex flex-col gap-2'>
						<input type='hidden' name='patientId' defaultValue={patientId} />
						<div className='flex flex-col gap-1'>
							<Label>Audio</Label>
							<Input type='file' name='audio' />
						</div>
					</div>
					{state?.error && (
						<p className='text-sm text-red-500 mt-1'>{state?.error}</p>
					)}

					<div className='flex justify-end mt-6'>
						<SubmitButton />
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export { ExchangeCreateForm };
