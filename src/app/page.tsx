import prisma from '@/lib/prisma';
import { LinkButton } from '@/components/business/link-button';
import { Card } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { PatientCreateForm } from '@/components/business/patient-create-form';

const Page = async () => {
	const patients = await prisma.patient.findMany({
		orderBy: {
			ppi: 'asc',
		},
		select: {
			id: true,
			ppi: true,
			firstName: true,
			lastName: true,
			phoneNumber: true,
		},
	});

	return (
		<>
			<div className='flex justify-end mb-4'>
				<PatientCreateForm />
			</div>

			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='pl-4'>PPI</TableHead>
							<TableHead>Prénom</TableHead>
							<TableHead>Nom</TableHead>
							<TableHead>Numéro de téléphone</TableHead>
							<TableHead />
						</TableRow>
					</TableHeader>
					<TableBody>
						{patients.map((patient) => (
							<TableRow key={patient.id}>
								<TableCell className='pl-4 font-medium'>
									{patient.ppi}
								</TableCell>
								<TableCell>{patient.firstName}</TableCell>
								<TableCell>{patient.lastName}</TableCell>
								<TableCell>{patient.phoneNumber}</TableCell>
								<TableCell className='pr-4 text-right'>
									<LinkButton
										size='sm'
										variant='outline'
										href={`/patients/${patient.id}`}
									>
										<ChevronRightIcon className='w-4 h-4' />
									</LinkButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>
		</>
	);
};

export default Page;
