import { ExchangeCreateForm } from '@/components/business/exchange-create-form';
import { ExchangeList } from '@/components/business/exchange-list';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
	params: { id: string };
}

const Page = async ({ params }: PageProps) => {
	const patient = await prisma.patient.findUnique({
		where: {
			id: params.id,
		},
		select: {
			id: true,
			ppi: true,
			firstName: true,
			lastName: true,
			phoneNumber: true,
			exchanges: true,
		},
	});

	if (!patient) notFound();

	return (
		<>
			<Tabs defaultValue='tab-1'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='tab-1'>Patient</TabsTrigger>
					<TabsTrigger value='tab-2'>Échanges</TabsTrigger>
				</TabsList>
				<TabsContent value='tab-1'>
					<Card className='p-6'>
						<table>
							<tbody>
								<tr>
									<td className='text-sm font-medium'>PPI</td>
									<td className='text-sm pl-6'>{patient.ppi}</td>
								</tr>
								<tr>
									<td className='text-sm font-medium'>Prénom</td>
									<td className='text-sm pl-6'>{patient.firstName}</td>
								</tr>
								<tr>
									<td className='text-sm font-medium'>Nom</td>
									<td className='text-sm pl-6'>{patient.lastName}</td>
								</tr>
								<tr>
									<td className='text-sm font-medium'>Numéro du téléphone</td>
									<td className='text-sm pl-6'>{patient.phoneNumber}</td>
								</tr>
							</tbody>
						</table>
					</Card>
				</TabsContent>
				<TabsContent value='tab-2'>
					<Card className='p-6'>
						<div className='flex justify-end mb-4'>
							<ExchangeCreateForm patientId={patient.id} />
						</div>
						<ExchangeList exchanges={patient.exchanges} />
					</Card>
				</TabsContent>
			</Tabs>
		</>
	);
};

export default Page;
