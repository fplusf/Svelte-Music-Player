import Dexie, { type Table } from 'dexie';
import type { CurrentTrack, Track } from '../models/types';

export class TracksDexie extends Dexie {
	// 'tracks' is added by dexie when declaring the stores()
	// We just tell the typing system this is the case
	tracks!: Table<Track>;

	constructor() {
		super('myDatabase');
		this.version(1).stores({
			tracks: '++id, src, title' // Primary key and indexed props
		});
	}
}

export const db = new TracksDexie();
