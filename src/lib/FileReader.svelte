<script lang="ts">
	import { db } from '../db/db.js';
	import { tracks } from '../stores/tracks.js';
	import type { Track } from '../models/types.js';

	let fileInput: HTMLInputElement;

	/**
	 * Use file picker if supported, otherwise use file input as a fallback
	 * file picker could proivde better UX and more control for future features
	 */
	async function openFilePicker() {
		try {
			const fileHandles = await window.showOpenFilePicker({
				types: [
					{
						description: 'Audio Files',
						accept: {
							'audio/*': ['.mp3', '.wav', '.ogg']
						}
					}
				],
				multiple: true
			});

			for (const fileHandle of fileHandles) {
				const file = await fileHandle.getFile();
				const track: Track = {
					title: file.name,
					artist: '-',
					file
				};

				// Save the track data to the Local Database
				updateDB(track, file);
			}
		} catch (err) {
			console.warn('Your browser does not support file picker:', err);
		} finally {
			// use file input as a fallback for browsers that don't support showOpenFilePicker
			fileInput.click();

			fileInput.onchange = async () => {
				if (!fileInput.files) {
					throw new Error('No file selected');
				}

				for (const file of fileInput.files) {
					const track: Track = {
						title: file.name,
						artist: 'Local File',
						file
					};

					// Save the track data to the Local Database
					updateDB(track, file);
				}
			};
		}
	}

	function updateDB(track: Track, file: File) {
		db.tracks
			.add(track)
			.then((doc) => {
				track.id = doc.id;
				track.src = URL.createObjectURL(file);

				// Update the tracks store to udpate the UI without extra DB call
				tracks.update((tracks) => {
					return [...tracks, track];
				});
			})
			.catch((err) => {
				console.error('Error adding track to DB:', err);
			});
	}
</script>

<button class="add-song" on:click={openFilePicker}>+</button>
<!-- fallback option for uploading files -->
<input bind:this={fileInput} type="file" style="visibility: hidden;" multiple />

<style>
	.add-song {
		display: flex;
		justify-content: center;
		align-items: center;
		/* padding: 1em; */
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 50px;
		height: 50px;
		border-radius: 999px;
		background: var(--color-primary-light);
		color: white;
		font-size: 1rem;
		border: none;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		cursor: pointer;
	}
</style>
