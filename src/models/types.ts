export interface Track {
	id?: number;
	src?: string;
	file: File;
	title: string;
	artist: string;
	lastPlayedTime?: number;
	isPlaying?: boolean;
}
