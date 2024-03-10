import { writable, type Writable } from 'svelte/store';
import type { Track } from '../models/types';
import { db } from '../db/db';
import type { RxAttachment } from 'rxdb';

export let tracks: Writable<Track[]> = writable([]);

export async function loadTracksToMemory() {
	try {
		const tracksList = await db.queryTracksList();

		if (tracksList.length === 0) {
			return;
		}

		const parsedTracksList = tracksList.map((track) => {
			return {
				...track,
				// TODO: Figure why it's not playing?
				src: URL.createObjectURL(track.attachments as Blob)
			};
		});

		console.log('parsedTracksList: ', parsedTracksList);

		tracks.set(parsedTracksList);
		// Update your Svelte store or component state with the loaded tracks
	} catch (err) {
		console.error('Error loading tracks:', err);
	}
}

export async function loadLastTrack() {
	try {
		const lastTrack = await db.audioTrackCollection.tracks
			.findOne({ sort: [{ id: 'desc' }] })
			.exec();

		console.log('lastTrack:', lastTrack);

		const parsedLastTrack = {
			...lastTrack.toJSON(),
			attachments: await lastTrack.getAttachment(lastTrack.get('title') as string)?.getData()
		};

		tracks.update((currentTracks) => {
			return [...currentTracks, parsedLastTrack];
		});
	} catch (err) {
		console.error('Error loading last track:', err);
	}
}
