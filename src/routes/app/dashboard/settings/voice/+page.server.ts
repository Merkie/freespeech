/* eslint-disable @typescript-eslint/no-explicit-any */
import { ELEVEN_LABS_KEY } from '$env/static/private';

export const load = async () => {
	const { voices } = await fetch('https://api.elevenlabs.io/v1/voices', {
		headers: {
			'xi-api-key': ELEVEN_LABS_KEY
		}
	}).then((res) => res.json());

	// const accents = Array.from(new Set(voices.map((voice: any) => voice.labels.accent))).filter(
	// 	Boolean
	// );
	// const descriptions = Array.from(
	// 	new Set(voices.map((voice: any) => voice.labels.description))
	// ).filter(Boolean);
	// const ages = Array.from(new Set(voices.map((voice: any) => voice.labels.age))).filter(Boolean);
	// const genders = Array.from(new Set(voices.map((voice: any) => voice.labels.gender))).filter(
	// 	Boolean
	// );

	// console.log({
	// 	accents,
	// 	descriptions,
	// 	ages,
	// 	genders
	// });

	return { voices };
};

// {
//   voice_id: '21m00Tcm4TlvDq8ikWAM',
//   name: 'Rachel',
//   samples: null,
//   category: 'premade',
//   fine_tuning: {
//     is_allowed_to_fine_tune: false,
//     finetuning_state: 'not_started',
//     verification_failures: [],
//     verification_attempts_count: 0,
//     manual_verification_requested: false,
//     language: null,
//     finetuning_progress: {},
//     message: null,
//     dataset_duration_seconds: null,
//     verification_attempts: null,
//     slice_ids: null,
//     manual_verification: null
//   },
//   labels: {
//     accent: 'american',
//     description: 'calm',
//     age: 'young',
//     gender: 'female',
//     'use case': 'narration'
//   },
//   description: null,
//   preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3',
//   available_for_tiers: [],
//   settings: null,
//   sharing: null,
//   high_quality_base_model_ids: [],
//   safety_control: null,
//   voice_verification: {
//     requires_verification: false,
//     is_verified: false,
//     verification_failures: [],
//     verification_attempts_count: 0,
//     language: null,
//     verification_attempts: null
//   },
//   owner_id: null,
//   permission_on_resource: null
// }
