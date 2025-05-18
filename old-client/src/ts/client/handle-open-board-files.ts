import type { OBFPage } from '$ts/common/openboardformat';
import JSZip from 'jszip';

export async function getOpenBoardFileData(file: File) {
	if (file.name.endsWith('.obz')) {
		const zip = new JSZip();

		const obzDirectory = await zip.loadAsync(file);
		const manifestFile = await obzDirectory.file('manifest.json')?.async('string');
		if (!manifestFile) return;

		const manifest = JSON.parse(manifestFile);
		if (!manifest || !manifest.root) return;

		const obfFiles = Object.keys(obzDirectory.files).filter((fileName) =>
			fileName.endsWith('.obf')
		);

		const obfFilesWithContent = await Promise.all(
			obfFiles.map(async (fileName) => {
				const file = obzDirectory.file(fileName);
				if (!file) return;
				const data = await file.async('string');
				return { fileName, data: JSON.parse(data) as unknown };
			})
		);

		return {
			type: 'obz',
			data: {
				manifest,
				obfFiles: obfFilesWithContent
			}
		};
	} else if (file.name.endsWith('.obf')) {
		const fileContent = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});

		const obfPage = JSON.parse(fileContent) as OBFPage;

		return {
			type: 'obf',
			data: obfPage
		};
	}
}
