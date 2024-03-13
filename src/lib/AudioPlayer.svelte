<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { swipe } from 'svelte-gestures';
	import { slide } from 'svelte/transition';

	export let id: number | undefined;
	export let src: string = '';
	export let title: string;
	export let artist: string;

	let time = 0;
	let duration = 0;
	let paused = true;
	let clickCount = 0;

	const dispatch = createEventDispatcher();

	// TODO: Update the current track in the database on play / pause, so it can be played from the last played time
	// async function updateCurrentTrack() {
	// 	let nowPlayingTrack = $tracks.find((track) => track.id === id);

	// 	if (!nowPlayingTrack) return;

	// 	await db.tracks.update(nowPlayingTrack.id, {
	// 		lastPlayedTime: time,
	// 		isPlaying: !paused
	// 	});
	// }

	function onPlayPause() {
		paused = !paused;
	}

	function format(time: number) {
		if (isNaN(time)) return '...';

		let minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		const hours = Math.floor(time / 3600);

		if (hours > 0) {
			minutes = minutes - hours * 60;
			return `${hours}:${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
		}

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	function onSliderMove(e: any) {
		const div = e.currentTarget;

		function seek(e: any) {
			const { left, width } = div.getBoundingClientRect();

			let pointer = (e.clientX - left) / width;
			if (pointer < 0) pointer = 0;
			if (pointer > 1) pointer = 1;

			time = pointer * duration;
		}

		seek(e);

		window.addEventListener('pointermove', seek);
		window.addEventListener(
			'pointerup',
			() => {
				window.removeEventListener('pointermove', seek);
			},
			{ once: true }
		);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	role="button"
	tabindex="0"
	draggable="true"
	transition:slide
	use:swipe={{ timeframe: 300, minSwipeDistance: 80 }}
	on:swipe={() => dispatch('delete', { id })}
	on:click={() => {
		clickCount++;
		if (clickCount === 3) {
			dispatch('delete', { id });
			clickCount = 0;
		}
		setTimeout(() => {
			clickCount = 0;
		}, 400);
	}}
	class="player"
	class:paused
>
	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
		on:ended={() => (paused = !paused)}
	/>

	<button class="play" aria-label={paused ? 'play' : 'pause'} on:click={onPlayPause} />

	<div class="info">
		<div class="description">
			<strong>{title}</strong>
			<span>{artist}</span>
		</div>

		<div class="time">
			<span>{format(time)}</span>
			<div class="slider" on:pointerdown={onSliderMove}>
				<div class="progress" style="--progress: {time / duration}%" />
			</div>
			<span>{duration ? format(duration) : '--:--'}</span>
		</div>
	</div>
</div>

<style>
	.player {
		display: grid;
		grid-template-columns: 2.5em 1fr;
		align-items: center;
		gap: 1em;
		padding: 0.5em 1em 0.5em 0.5em;
		margin: 0.5em 0;
		border-radius: 2em;
		background: #333333;
		transition: filter 0.2s;
		color: white;
		user-select: none;
		width: -webkit-fill-available;
		min-width: 100%;
		widows: fit-content;
		max-width: 500px;
	}

	.player:not(.paused) {
		color: white;
		filter: drop-shadow(0.5em 0.5em 1em rgba(0, 0, 0, 0.1));
		background: var(--color-primary);
	}

	button {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		border-radius: 50%;
	}

	[aria-label='pause'] {
		background-image: url(../assets/pause.svg);
	}

	[aria-label='play'] {
		background-image: url(../assets/play.svg);
	}

	.info {
		overflow: hidden;
	}

	.description {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
		text-align: left;
	}

	.time {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.time span {
		font-size: 0.7em;
	}

	.slider {
		flex: 1;
		height: 0.2em;
		background: #222;
		border-radius: 0.5em;
		overflow: hidden;
	}

	.progress {
		width: calc(100 * var(--progress));
		height: 100%;
		background: var(--color-primary-light);
	}
</style>
