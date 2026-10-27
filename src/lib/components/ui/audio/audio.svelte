<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { setAudioPlayerContext } from './ctx';
	import type { Snippet } from 'svelte';

	let {
		src,
		class: className,
		children
	}: {
		src: string;
		class?: string;
		children: Snippet;
	} = $props();

	let audio: HTMLAudioElement;

	let isPaused = $state(true);
	let duration = $state(0);
	let currentTime = $state(0);
	let volume = $state(1);
	let isMuted = $state(false);

	function togglePlay() {
		if (!audio) return;
		if (audio.paused) {
			audio.play();
		} else {
			audio.pause();
		}
	}

	function seek(time: number) {
		if (!audio) return;
		audio.currentTime = time;
		currentTime = time;
	}

	function setVolume(v: number) {
		if (!audio) return;
		audio.volume = v;
		volume = v;
	}

	function toggleMute() {
		isMuted = !isMuted;
	}

	setAudioPlayerContext({
		get isPlaying() {
			return { value: !isPaused };
		},
		get duration() {
			return { value: duration };
		},
		get currentTime() {
			return { value: currentTime };
		},
		get volume() {
			return { value: volume };
		},
		get isMuted() {
			return { value: isMuted };
		},
		togglePlay,
		seek,
		setVolume,
		toggleMute
	});
</script>

<div
	class={cn(
		'relative overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm',
		className
	)}
>
	<audio
		bind:this={audio}
		{src}
		bind:paused={isPaused}
		bind:currentTime
		bind:duration
		bind:volume
		bind:muted={isMuted}
	></audio>
	{@render children()}
</div>
