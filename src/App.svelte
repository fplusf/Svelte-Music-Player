<script lang="ts">
	import { db } from './db/db';
	import AudioPlayer from './lib/AudioPlayer.svelte';
	import FileUploader from './lib/FileUploader.svelte';
	import { loadTracksToMemory, tracks } from './stores/tracks';
	import { onDestroy, onMount } from 'svelte';

	onMount(async () => {
		await loadTracksToMemory();
	});

	onDestroy(revokeObjectURLs);

	function revokeObjectURLs() {
		console.log('revokeObjectURLs');
		$tracks.forEach((track) => {
			if (track.src) URL.revokeObjectURL(track.src);
		});
	}

	function deleteTrack(e: CustomEvent<{ id: string }>) {
		console.log(e.detail.id);
		db.audioTrackCollection.tracks
			.findOne(e.detail.id)
			.exec()
			.then((track) => {
				console.log('track to delete', track);
				if (track) {
					track.remove();

					// Remove the track from the store
					tracks.update((tracks) => {
						return tracks.filter((t) => t.id !== e.detail.id);
					});
				}
			});
	}

	console.log($tracks);
</script>

<header class="header">
	<h1 class="title">Potify</h1>
	<div class="info">
		<small>Upload and listen your tracks 🎵</small>
		<small>Do delete use double click or swipe left on mobile 🟥</small>
	</div>
</header>
<main>
	{#each $tracks as track}
		<AudioPlayer
			id={track.id}
			src={track.src}
			artist={track.artist}
			title={track.title}
			on:delete={deleteTrack}
		/>
	{/each}

	<FileUploader />
</main>

<style>
	.header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background-color: rgb(48, 48, 48);
		padding: 1em;
		width: 100%;
	}
	.title {
		text-align: center;
		font-size: 2em;
		margin: 0;
		color: cadetblue;
	}
	.info {
		background-color: rgb(48, 48, 48);
		padding: 10px;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		text-align: center;
		margin-bottom: 1em;
	}
	main {
		padding-top: 130px;
		height: 80vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
