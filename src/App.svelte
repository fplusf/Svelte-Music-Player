<script lang="ts">
	import AudioPlayer from './lib/AudioPlayer.svelte';
	import { tracks } from './assets/tracks';

	import { onMount } from 'svelte';

	// let tracks = [];
	let files = [];

	function handleFileUpload() {
		for (const file of files) {
			const reader = new FileReader();

			reader.onload = () => {
				const audioBlob = new Blob([reader.result], { type: file.type });
				const audioUrl = URL.createObjectURL(audioBlob);

				tracks.concat([
					{
						src: audioUrl,
						title: file.name,
						artist: 'Local File'
					}
				]);

				saveTracksToStorage();
			};

			reader.readAsArrayBuffer(file);
		}

		files = []; // Reset the files array
	}

	function saveTracksToStorage() {
		localStorage.setItem('tracks', JSON.stringify(tracks));
	}

	function loadTracksFromStorage() {
		const storedTracks = JSON.parse(localStorage.getItem('tracks'));
		if (storedTracks) {
			tracks = storedTracks;
		}
	}

	onMount(loadTracksFromStorage);
</script>

<main>
	{#each tracks as track}
		<AudioPlayer {...track} />
	{/each}

	<input type="file" multiple accept="audio/*" on:change={handleFileUpload} bind:files />
</main>
