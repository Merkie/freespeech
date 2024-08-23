import auth from './endpoints/auth';
import media from './endpoints/media';
import tts from './endpoints/tts';
import user from './endpoints/user';
import project from './endpoints/project';

const api = {
	auth,
	media,
	user,
	tts,
	project
};

export default api;
