import { writable, type Writable } from 'svelte/store';
import type { Track } from '../models/types';
import { db } from '../db/db';

export let tracks: Writable<Track[]> = writable([]);
export let currentTrack: Writable<Track | null> = writable(null);

export async function loadTracksToMemory() {
	try {
		const tracksList = await db.tracks.toArray();

		if (tracksList.length === 0) {
			return;
		}

		const parsedTracksList = tracksList.map((track) => {
			return {
				...track,
				src: URL.createObjectURL(track.file)
			};
		});

		tracks.set(parsedTracksList);
	} catch (err) {
		throw new Error('Error loading tracks to memory');
	}
}
