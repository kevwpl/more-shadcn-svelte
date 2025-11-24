<script lang="ts">
	import { cn } from '$lib/utils';
	import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
    import {Slider} from "$lib/components/ui/slider";

	let {
		src,
		poster,
		class: className,
		autoplay = false,
		loop = false,
		muted = false
	} = $props<{
		src: string;
		poster?: string;
		class?: string;
		autoplay?: boolean;
		loop?: boolean;
		muted?: boolean;
	}>();

	let video: HTMLVideoElement;
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(1);
	let isMuted = $state(muted);
	let isFullscreen = $state(false);
	let showControls = $state(false);
	let controlsTimeout: number;
	let isLoading = $state(true);
    let lastVolume = $state(1);

	function togglePlay() {
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	}

	function handlePlay() {
		isPlaying = true;
		isLoading = false;
		showControlsTemporarily();
	}

	function handlePause() {
		isPlaying = false;
		showControls = true;
	}

	function handleTimeUpdate() {
		currentTime = video.currentTime;
	}

	function handleDurationChange() {
		duration = video.duration;
	}

	function handleSeek(e: Event) {
		const target = e.target as HTMLInputElement;
		const time = parseFloat(target.value);
		video.currentTime = time;
		currentTime = time;
	}

    function handleVolumeChange(val: number) {
        const newVolume = val;
        volume = newVolume;
        video.volume = newVolume;
        isMuted = newVolume === 0;
        if (newVolume > 0) lastVolume = newVolume;
    }

    function toggleMute() {
        if (isMuted) {
            isMuted = false;
            volume = lastVolume > 0 ? lastVolume : 1;
            video.muted = false;
            video.volume = volume;
        } else {
            isMuted = true;
            lastVolume = volume;
            volume = 0;
            video.muted = true;
            video.volume = 0;
        }
    }

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			video.parentElement?.requestFullscreen();
			isFullscreen = true;
		} else {
			document.exitFullscreen();
			isFullscreen = false;
		}
	}

	function formatTime(seconds: number) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function showControlsTemporarily() {
		showControls = true;
		clearTimeout(controlsTimeout);
		controlsTimeout = setTimeout(() => {
            showControls = false;
		}, 2500);
	}

	function handleMouseMove() {
		showControlsTemporarily();
	}

	function handleWaiting() {
		isLoading = true;
	}

	function handleCanPlay() {
		isLoading = false;
	}

    onMount(() => {
        video.volume = volume;
        video.muted = isMuted;

        if (autoplay) {
            video.play().catch(() => {
                isMuted = true;
                video.muted = true;
                video.play();
            });
        }
    });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn(
		'group relative flex aspect-video w-full min-w-[300px] items-center justify-center overflow-hidden rounded-xl bg-black shadow-lg',
		className
	)}
	onmousemove={handleMouseMove}
	onmouseleave={() => isPlaying && (showControls = false)}
>
	<!-- Video Element -->
	<!-- svelte-ignore a11y_media_has_caption -->
	<video
		bind:this={video}
		{src}
		{poster}
		{loop}
		class="h-full w-full object-cover"
		onplay={handlePlay}
		onpause={handlePause}
		ontimeupdate={handleTimeUpdate}
		ondurationchange={handleDurationChange}
		onwaiting={handleWaiting}
		oncanplay={handleCanPlay}
		onclick={togglePlay}
	></video>

	<!-- Loading Spinner -->
	{#if isLoading}
		<div class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
			<Loader2 class="h-10 w-10 animate-spin text-white/80" />
		</div>
	{/if}

	<!-- Big Play Button (Initial or Paused) -->
	{#if !isPlaying && !isLoading}
		<button
			onclick={togglePlay}
			class="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity hover:bg-black/20"
		>
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-110"
			>
				<Play class="ml-1 h-8 w-8 fill-white" />
			</div>
		</button>
	{/if}

	<!-- Controls Overlay -->
	<div
		class={cn(
			'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300',
			showControls ? 'opacity-100' : 'opacity-0'
		)}
	>
		<!-- Progress Bar -->
		<div class="group/slider relative mb-4 flex h-4 w-full items-center">
            <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    bind:value={currentTime}
                    oninput={(e) => {
                        const el = e.currentTarget as HTMLInputElement;
                        const t = parseFloat(el.value);
                        currentTime = t;
                        video.currentTime = t;
                      }}
                    class="absolute z-20 h-full w-full cursor-pointer opacity-0"
            />
			<!-- Track Background -->
			<div class="absolute h-1 w-full rounded-full bg-white/20 transition-all group-hover/slider:h-1.5"></div>
			<!-- Progress Fill -->
			<div
				class="absolute h-1 rounded-full bg-white group-hover/slider:h-1.5"
				style="width: {(currentTime / duration) * 100}%"
			></div>
			<!-- Thumb (Visual only) -->
			<div
				class="absolute h-3 w-3 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/slider:opacity-100"
				style="left: {(currentTime / duration) * 100}%; transform: translateX(-50%)"
			></div>
		</div>

		<div class="flex items-center justify-between gap-4">
			<div class="flex items-center gap-4">
				<!-- Play/Pause -->
				<button
					onclick={togglePlay}
					class="text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				>
					{#if isPlaying}
						<Pause class="h-5 w-5 fill-white/90" />
					{:else}
						<Play class="h-5 w-5 fill-white/90" />
					{/if}
				</button>

				<!-- Volume -->
				<div class="group/volume flex items-center gap-2">
					<button
						onclick={toggleMute}
						class="text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					>
						{#if isMuted || volume === 0}
							<VolumeX class="h-5 w-5" />
						{:else}
							<Volume2 class="h-5 w-5" />
						{/if}
					</button>
					<div class="flex items-center justify-center w-0 h-10 p-2 overflow-hidden transition-all duration-300 group-hover/volume:w-20">
                        <div class="group/slider relative flex h-4 w-full items-center">
                            <input
                                    type="range"
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    bind:value={volume}
                                    oninput={(e) => {
                                      const el = e.currentTarget as HTMLInputElement;
                                      handleVolumeChange(parseFloat(el.value));
                                    }}
                                    class="absolute z-20 h-full w-full cursor-pointer opacity-0"
                            />
                            <!-- Track Background -->
                            <div class="absolute h-1 w-full rounded-full bg-white/20 transition-all group-hover/slider:h-1.5"></div>
                            <!-- Progress Fill -->
                            <div
                                    class="absolute h-1 rounded-full bg-white group-hover/slider:h-1.5"
                                    style="width: {(volume / 1) * 100}%"
                            ></div>
                            <!-- Thumb (Visual only) -->
                            <div
                                    class="absolute h-3 w-3 rounded-full bg-white opacity-0 shadow transition-opacity group-hover/slider:opacity-100"
                                    style="left: {(volume / 1) * 100}%; transform: translateX(-50%)"
                            ></div>
                        </div>					</div>
				</div>

				<!-- Time -->
				<div class="text-xs font-medium text-white/90">
					{formatTime(currentTime)} / {formatTime(duration || 0)}
				</div>
			</div>

			<!-- Fullscreen -->
			<button
				onclick={toggleFullscreen}
				class="text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
			>
				{#if isFullscreen}
					<Minimize class="h-5 w-5" />
				{:else}
					<Maximize class="h-5 w-5" />
				{/if}
			</button>
		</div>
	</div>
</div>

<style>
    input[type="range"] {
        appearance: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        height: 0;
        width: 0;
        border: none;
    }

    input[type="range"]::-moz-range-thumb {
        height: 0;
        width: 0;
        border: none;
        background: transparent;
    }
</style>