/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchFromAPI } from "../util";

const tts = {
  speak: {
    elevenlabs: ElevenLabsSpeak,
  },
  voices: {
    elevenlabs: ElevenLabsVoices,
  },
};

export default tts;

async function ElevenLabsSpeak(text: string) {
  const response = await fetchFromAPI({
    path: "/text-to-speech/elevenlabs/speak",
    method: "POST",
    body: {
      text,
      voiceId: "", //get(ElevenLabsVoiceId),
    },
    options: {
      parseResponseJson: false,
    },
  });

  const data = await response.blob();
  return data;
}

async function ElevenLabsVoices(token?: string) {
  const response = (await fetchFromAPI({
    path: "/text-to-speech/elevenlabs/list-voices",
    method: "GET",
    token,
  })) as {
    voices: any[];
    error: string;
  };

  return response;
}
