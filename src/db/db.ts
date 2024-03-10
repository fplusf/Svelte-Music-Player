import type { Track } from '../models/types';
import { createBlob, createRxDatabase, type RxDocument } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBAttachmentsPlugin } from 'rxdb/plugins/attachments';

// Add the plugins to RxDB
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBAttachmentsPlugin);

const tracksdb = await createRxDatabase({
	name: 'tracksdb',
	storage: getRxStorageDexie()
});

const trackSchema = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	attachments: {
		type: 'object',
		encrypted: false
	},
	properties: {
		id: {
			type: 'string',
			maxLength: 24
		},
		src: {
			type: 'string'
		},
		title: {
			type: 'string'
		},
		artist: {
			type: 'string'
		}
	},
	required: ['src', 'title', 'artist', 'file']
};

const audioTrackCollection = await tracksdb.addCollections({
	tracks: {
		schema: trackSchema
	}
});

// TODO: Use the DB better and manage the cleanup of the attachments
async function saveTrack(trackData: Track) {
	try {
		const document = await audioTrackCollection.tracks.insert(trackData);
		await document.putAttachment({
			id: trackData.title,
			data: createBlob(trackData.attachments as string, 'audio/mpeg'),
			type: 'audio/mpeg'
		});

		console.log('Track saved successfully');
	} catch (err) {
		console.error('Error saving track:', err);
	}
}
async function queryTracksList(): Promise<Track[]> {
	const documents: RxDocument[] = await audioTrackCollection.tracks.find().exec();

	const documentsWithAttachments = await Promise.all(
		documents.map(async (track) => {
			return {
				...track.toJSON(),
				attachments: await track.getAttachment(track.get('title') as string)?.getData()
			};
		})
	);

	return documentsWithAttachments as unknown as Track[];
}

export let db = {
	audioTrackCollection,
	saveTrack,
	queryTracksList
};
