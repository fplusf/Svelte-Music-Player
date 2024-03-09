<script lang="ts">
 export let src;
 export let title = 'ttitle';
 export let artist;

let time = 0;
let duration = 0;
let paused = true;


function format(time) {
	if(isNaN(time)) return '...';

	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);

	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function onSliderMove(e) {
  const div = e.currentTarget;

  function seek(e) {
    const { left, width } = div.getBoundingClientRect();

    let pointer = (e.clientX - left) / width;
    if(pointer < 0) pointer = 0;
    if(pointer > 1) pointer = 1;

    time = pointer * duration;
  }

  seek(e);

  window.addEventListener('pointermove', seek);
  window.addEventListener('pointerup', () => {
    window.removeEventListener('pointermove', seek);
  }, { once: true })
}
</script>

<div class="player" class:paused>
  <audio
    {src}
    bind:currentTime={time}
    bind:duration
    bind:paused
  />

  <button 
    class="play"
    aria-label={paused ? 'play' : 'pause'}
    on:click={() => paused = !paused} 
    />

  <div class="info">
    <div class="description">
      <strong>{title}</strong>
      <span>{artist}</span>
    </div>

    <div class="time">
      <span>{format(time)}</span>
      <div class="slider" on:pointerdown={onSliderMove}>
        <div class="progress" style="--progress: {time / duration}%"/>
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
		border-radius: 2em;
		background: #333333;
		transition: filter 0.2s;
		color: white;
		user-select: none;
		margin: 10px 0;
	}

	.player:not(.paused) {
		color: white;
		filter: drop-shadow(0.5em 0.5em 1em rgba(0,0,0,0.1));
		background: #064e3b;
	}
	
	button {
		width: 100%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-position: 50% 50%;
		border-radius: 50%;
	}
	
	[aria-label="pause"] {
		background-image: url(../assets/pause.svg);
	}

	[aria-label="play"] {
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
		background: #16a34a;
	}

	.progress:after {
		content: '🟢';
	}
</style>