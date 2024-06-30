'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import {
	getDepartmentAndEmergencyState,
	getKeywordsFromText,
	identifySpeaker,
	summarizeText,
	transcribeAudio,
} from './utils';
import path from 'path';

const isNotAConversation = (text: string) => {
	try {
		const obj = JSON.parse(text);
		return obj && typeof obj === 'object' && 'error' in obj;
	} catch (e) {
		return true;
	}
};

const storeFile = async (file: File) => {
	const data = await file.arrayBuffer();

	const fileExtension = path.extname(file.name);
	const dateString = new Date()
		.toISOString()
		.replace(/[:T]/g, '-')
		.split('.')[0];
	const filename = `audio_${dateString}${fileExtension}`;
	const filePath = path.join(process.cwd(), 'public', 'audios', filename);

	await writeFile(filePath, Buffer.from(data));

	return `/audios/${filename}`;
};

const addExchange = async (
	prevState: { error: string },
	formData: FormData,
) => {
	const patientId = formData.get('patientId') as string;
	const audio = formData.get('audio') as File;

	if (!audio || audio.size === 0) {
		return {
			error: 'No audio file uploaded.',
		};
	}

	const audioPath = await storeFile(audio);

	const transcription = await transcribeAudio(audio);
	const prettyTranscription = await identifySpeaker(transcription);

	if (isNotAConversation(prettyTranscription)) {
		return {
			error: 'Audio is not a medical phone call.',
		};
	}

	const summary = await summarizeText(prettyTranscription);
	const keywords = await getKeywordsFromText(prettyTranscription);
	const extra = await getDepartmentAndEmergencyState(prettyTranscription);

	await prisma.exchange.create({
		data: {
			patientId: patientId,
			type: 'CALL',
			date: new Date(),
			status: extra['emergencyState'],
			body: audioPath,
			transcription: prettyTranscription,
			summary,
			keywords,
			category: extra['department'],
		},
	});

	revalidatePath('/');
	return { error: '' };
};

export { addExchange };
