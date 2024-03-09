export type VoiceGenerator = 'elevenlabs' | 'offline';

export type ElevenLabsVoice = {
	voice_id: string;
	name: string;
	premade: boolean;
	accent: string;
	description: string;
	age: string;
	gender: string;
};

export type LocalSettings = {
	offlineVoice: string;
	elevenLabsVoice: string;
	voiceGenerator: VoiceGenerator;
	speakOnTap: boolean;
	sentenceBuilder: boolean;
	skinTone: SkinTone;
	lastVisitedProjectId: string;
};

export type SkinTone = 'dark' | 'medium-dark' | 'medium' | 'medium-light' | 'light';
