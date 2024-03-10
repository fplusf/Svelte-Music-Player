export interface Track {
	id?: string;
	src?: string;
	attachments: string | Blob;
	title: string;
	artist: string;
}
