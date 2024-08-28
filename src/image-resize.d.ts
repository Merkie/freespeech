declare module 'image-resize' {
	interface ImageResizeOptions {
		width?: number;
		height?: number;
		format?: 'jpg' | 'png' | 'webp';
		outputType?: 'base64' | 'canvas' | 'blob';
		quality?: number;
		reSample?: number;
		sharpen?: number;
		bgColor?: string;
	}

	function imageResize(
		source: string | File | Blob | HTMLCanvasElement,
		options?: ImageResizeOptions
	): Promise<string | Blob | HTMLCanvasElement>;

	export default imageResize;
}
