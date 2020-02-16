import { combineReducers } from 'redux';

export const SET_VOICES = 'SET_VOICES';
export const GET_VOICES = 'GET_VOICES';
export const SET_USED_VOICE = 'SET_USED_VOICE';
export const GET_USED_VOICES = 'GET_USED_VOICES';

function voiceReducer(state = { available_voices: [], used_voice: "com.apple.speech.synthesis.voice.Fred" }, action) {
    switch (action.type) {
        case SET_VOICES:
            return { ...state, available_voices: action.payload };
        case SET_USED_VOICE:
            return { ...state, used_voice: action.payload };
        default:
            return state;
    }
}

export function setVoices(voices) {
    return {
        type: SET_VOICES,
        payload: voices
    }
}

export function setUsedVoice(voice) {
    return {
        type: SET_USED_VOICE,
        payload: voice
    }
}

export default combineReducers({
    voices: voiceReducer
});