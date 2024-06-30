import { openai } from '@/lib/openai';
import { Exchange } from '@prisma/client';
import { Transcription } from 'openai/resources/audio/transcriptions.mjs';

const transcribeAudio = async (audio: File) => {
	const transcription = await openai.audio.transcriptions.create({
		file: audio,
		model: 'whisper-1',
		response_format: 'text',
	});

	return transcription;
};

const identifySpeaker = async (transcription: Transcription) => {
	const prompt = `Transform a transcription of a conversation between a nurse and a patient into a JSON format. Separate each line of dialogue with the corresponding role ('ASSISTANT' for Nurse and 'PATIENT' for Patient) and return the entire exchange in the following JSON format: [{ "role": "ASSISTANT"|"PATIENT", "message": string }]. Here is the transcription: ${transcription}. Return JSON format of the exchange.`;
	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content:
					'You are an assistant that helps to identify speakers in a transcription. Your responses must be in JSON format.',
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		response_format: { type: 'json_object' },
	});

	return response.choices[0].message.content!;
};

const summarizeText = async (text: string) => {
	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content:
					'You are an assistant that summarizes conversations. You will receive a JSON object containing a conversation and you need to provide a concise summary of the important points. The summary should be in French and should be a paragraph of 3 or 4 lines.',
			},
			{
				role: 'user',
				content: text,
			},
		],
		response_format: { type: 'text' },
	});

	return response.choices[0].message.content!;
};

const getKeywordsFromText = async (text: string) => {
	const prompt = `Extract the important health-related keywords from the following JSON conversation between a nurse and a patient. Provide the response in JSON format as a list of key-value pairs, where the key is a specific category in French (e.g., "symptômes", "diagnostic", "traitement", "médicaments", "antécédents médicaux", "recommandations") and the value is a string of keywords separated by commas. Make sure to accurately reflect the presence or absence of symptoms, treatments, or other relevant details as mentioned in the conversation. Ensure the response is a valid JSON object with the specified keys.
  Conversation: ${text}`;
	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content:
					'You are an assistant that extracts health-related keywords from a conversation, ensuring accuracy and taking into account negations or absence of symptoms as mentioned.',
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		response_format: { type: 'json_object' },
	});

	return response.choices[0].message.content!;
};

const getDepartmentAndEmergencyState = async (text: string) => {
	const prompt = `Based on the following conversation between a nurse and a patient, identify the concerned department and the emergency state. Provide the response in JSON format with two keys: "department" and "emergencyState". The department should be one of the following: "Chirurgie Main", "Otoplastie", "Chirurgie Buccale", "Ambulatoire". The emergency state should be one of the following: "RED" (Critique), "YELLOW" (Urgent), "BLUE" (Suivi), "GREEN" (Traité). Ensure the response is a valid JSON object.
  Conversation: ${text}`;
	const response = await openai.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content:
					'You are an assistant that identifies the concerned department and the emergency state based on a medical conversation.',
			},
			{
				role: 'user',
				content: prompt,
			},
		],
		response_format: { type: 'json_object' },
	});
	const responseString = response.choices[0].message.content;

	return JSON.parse(responseString!) as {
		department: string;
		emergencyState: Exchange['status'];
	};
};

export {
	transcribeAudio,
	identifySpeaker,
	summarizeText,
	getKeywordsFromText,
	getDepartmentAndEmergencyState,
};
