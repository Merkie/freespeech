import { SkinTones } from '$ts/common/opensymbols';
import { json } from '@sveltejs/kit';

export const GET = async ({ fetch, url }) => {
	const query = url.searchParams.get('q');
	if (!query) return json({ results: [] });

	const skin = url.searchParams.get('skin');
	if (!skin) return json({ results: [] });

	const isSkinToneValid = !!SkinTones.find((skinTone) => skinTone.name === skin);
	if (!isSkinToneValid) return json({ results: [] });

	const responseJson = await fetch(
		'https://www.opensymbols.org/api/v1/symbols/search?q=' + encodeURIComponent(query)
	).then((response: Response) => response.json());

	const results = responseJson.map((item: { name: string; image_url: string }) => {
		const urlWithModifiedSkin = item.image_url.replace('varianted-skin', `variant-${skin}`);

		return {
			alt: item.name,
			image_url: urlWithModifiedSkin,
			thumbnail_url: urlWithModifiedSkin
		};
	});

	return json({
		results
	});
};
