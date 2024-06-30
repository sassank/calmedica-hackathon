'use server';

import prisma from '@/lib/prisma';
import { addPatientSchema } from '@/lib/validation';
import { revalidatePath } from 'next/cache';
import { action } from '@/lib/safe-action';

const addPatient = action
	.schema(addPatientSchema)
	.action(async ({ parsedInput }) => {
		await prisma.patient.create({
			data: {
				ppi: parsedInput.ppi,
				firstName: parsedInput.firstName,
				lastName: parsedInput.lastName,
				phoneNumber: parsedInput.phoneNumber,
			},
		});

		revalidatePath('/');
	});

export { addPatient };
