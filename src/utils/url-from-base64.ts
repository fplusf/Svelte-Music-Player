import { base64ToArrayBuffer } from './array-buffer-convertion';

export function createUrlFromBase64(base64: string) {
	if (!base64) {
		throw new Error('No base64 provided');
	}

	if (base64.length % 4 !== 0) {
		throw new Error('Invalid base64');
	}

	const blob = new Blob([base64ToArrayBuffer(base64)], { type: 'audio/mpeg' });
	const url = URL.createObjectURL(blob);
	return url;
}
