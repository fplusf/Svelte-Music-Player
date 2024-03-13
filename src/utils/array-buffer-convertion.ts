export function base64ToArrayBuffer(base64String: string): ArrayBuffer {
	const binaryString = atob(base64String);
	const binaryArray = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		binaryArray[i] = binaryString.charCodeAt(i);
	}
	return binaryArray.buffer;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const binary = String.fromCharCode(...new Uint8Array(buffer));
	return btoa(binary);
}
