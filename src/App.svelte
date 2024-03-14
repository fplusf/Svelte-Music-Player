<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { db } from './db/db';
	import AudioPlayer from './lib/AudioPlayer.svelte';
	import FileUploader from './lib/FileReader.svelte';
	import { currentTrack, loadTracksToMemory, tracks } from './stores/tracks';

	let modal: HTMLDialogElement;

	onMount(async () => {
		await loadTracksToMemory();
	});

	onDestroy(revokeObjectURLs);

	function revokeObjectURLs() {
		$tracks.forEach((track) => {
			if (track.src) URL.revokeObjectURL(track.src);
		});
	}

	function deleteTrack(e: CustomEvent<{ id: number }>) {
		if (!e.detail.id) return;

		if (!window.confirm('Are you sure you want to delete this track?')) return;

		db.tracks
			.delete(e.detail.id)
			.then(() => {
				tracks.update((tracks) => {
					return tracks.filter((track) => track.id !== e.detail.id);
				});
			})
			.catch((err) => {
				console.error('Error deleting track:', err);
			});
	}
</script>

<dialog bind:this={modal} id="info-modal">
	<div class="info-dialog">
		<p>Upload and listen your tracks 🎵</p>
		<p>Do delete use triple click or swipe left on mobile 🟥</p>
		<small class="forma-info">Supported format are: [.mp3', '.wav', '.ogg']</small>
	</div>

	<button
		id="closeModal"
		on:click={() => {
			modal.close();
		}}>Close</button
	>
</dialog>

<button
	id="info-modal"
	on:click={() => {
		modal.translate = true;
		modal.showModal();
	}}
>
	ℹ️
</button>

{#if $tracks.length === 0}
	<p class="list">No tracks found. Upload some tracks to get started...</p>
{:else}
	<p class="list">Your tracks 🎧</p>
{/if}

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
	#info-modal {
		background-color: rgba(0, 0, 0, 0.817);
		border: none;
		border-radius: 10px;
	}
	.info-dialog {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		padding-bottom: 20px;
	}

	.list {
		margin-bottom: 1em;
	}

	main {
		height: 80vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		width: 100%;
	}
</style>
