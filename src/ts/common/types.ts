export type IVoiceGenerator = 'elevenlabs' | 'offline';
export type IElevenLabsVoice =
	| 'Rachel'
	| 'Domi'
	| 'Bella'
	| 'Antoni'
	| 'Elli'
	| 'Josh'
	| 'Arnold'
	| 'Adam'
	| 'Sam';

export type LocalSettings = {
	offlineVoice: string;
	elevenLabsVoice: IElevenLabsVoice;
	voiceGenerator: IVoiceGenerator;
	speakOnTap: boolean;
	sentenceBuilder: boolean;
	skinTone: SkinTone;
	lastVisitedProjectId: string;
};

export type SkinTone = 'dark' | 'medium-dark' | 'medium' | 'medium-light' | 'light';
