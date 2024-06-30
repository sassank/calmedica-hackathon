'use client';

import { addPatientSchema } from '@/lib/validation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { addPatient } from '@/actions/add-patient';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { useState } from 'react';

type FormData = z.infer<typeof addPatientSchema>;

const PatientCreateForm = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(addPatientSchema),
	});

	const { execute, status } = useAction(addPatient, {
		onSuccess: () => {
			reset();
			toast('Patient created successfully.');
			setIsOpen(false);
		},
		onError: (error) => {
			console.log('error', error);
			toast('Something went wrong!');
		},
	});

	function onSubmit(data: FormData) {
		execute(data);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Ajouter un patient</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Ajouter un patient</DialogTitle>
					<DialogDescription>This is the dialog description</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} id='patient-create-form'>
					<div className='flex flex-col gap-2'>
						<div>
							<Label>PPI</Label>
							<Input type='text' {...register('ppi')} />
							{errors.ppi && <span>{errors.ppi.message}</span>}
						</div>
						<div>
							<Label>Prénom</Label>
							<Input type='text' {...register('firstName')} />
							{errors.firstName && <span>{errors.firstName.message}</span>}
						</div>
						<div>
							<Label>Nom</Label>
							<Input type='text' {...register('lastName')} />
							{errors.lastName && <span>{errors.lastName.message}</span>}
						</div>
						<div>
							<Label>Numéro de téléphone</Label>
							<Input type='text' {...register('phoneNumber')} />
							{errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
						</div>
					</div>
				</form>
				<DialogFooter>
					<Button
						type='submit'
						disabled={status === 'executing'}
						form='patient-create-form'
					>
						{status === 'executing' ? 'En cours...' : 'Enregistrer'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export { PatientCreateForm };
