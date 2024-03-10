<script lang="ts">
	import { db } from '../db/db.js';
	import { tick } from 'svelte';
	import type { Track } from '../models/types.js';
	import { createBlob } from 'rxdb';
	import { loadLastTrack, loadTracksToMemory } from '../stores/tracks.js';

	const uuid = () => Math.random().toString(36).slice(2);

	async function handleFileUpload(e: any) {
		let files = e.target.files;

		if (files.length === 0) {
			console.log('No files selected');
			return;
		}

		for (const file of files) {
			const reader = new FileReader();

			reader.onload = () => {
				if (!reader.result) return;

				// Prepare the track data
				const trackData: Track = {
					id: uuid(),
					title: file.name,
					artist: 'Local File',
					attachments: reader.result.toString()
				};

				// Save the track data to RxDB
				db.saveTrack(trackData);

				// Load the tracks to memory
				requestAnimationFrame(loadLastTrack);
			};

			reader.onerror = () => {
				console.error('Error reading file:', file);
			};

			reader.readAsDataURL(file);
		}

		files = []; // Reset the files array
	}
</script>

<input type="file" multiple accept="audio/*" on:change={handleFileUpload} />
