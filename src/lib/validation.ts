import { z } from 'zod';

const addPatientSchema = z.object({
	ppi: z.string().min(1),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	phoneNumber: z.string().min(1),
});

export { addPatientSchema };
