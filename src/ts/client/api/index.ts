import auth from './endpoints/auth';
import media from './endpoints/media';
import tts from './endpoints/tts';
import user from './endpoints/user';
import project from './endpoints/project';
import page from './endpoints/page';
import tile from './endpoints/tile';
import marketplace from './endpoints/marketplace';

const api = {
	auth,
	media,
	user,
	tts,
	project,
	page,
	tile,
	marketplace
};

export default api;
