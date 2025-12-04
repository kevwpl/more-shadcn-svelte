<script lang="ts">
	import { cn } from '$lib/utils';
	import { setWheelContext } from './ctx.svelte';
	import type { Snippet } from 'svelte';
	import { onMount, tick } from 'svelte';

	let {
		value = $bindable(),
		class: className,
		children,
		onValueChange,
		loop = false
	}: {
		value?: string;
		class?: string;
		children: Snippet;
		onValueChange?: (val: string) => void;
		loop?: boolean;
	} = $props();

	const ITEM_HEIGHT = 32;

	let containerRef: HTMLElement | undefined = $state();
	let contentRef: HTMLElement | undefined = $state();

	let scrollPos = $state(0);
	let isDragging = $state(false);
	let itemCount = $state(0);

	let lastY = 0;
	let velocity = 0;
	let lastFrameTime = 0;
	let animFrame: number;
	let snapTimeout: ReturnType<typeof setTimeout>;
	let wheelSnapTimeout: ReturnType<typeof setTimeout>;

	const ctxState = setWheelContext({
		selectedValue: () => value,
		onSelect: (val) => scrollToItem(val),
		register: () => itemCount++,
		unregister: () => itemCount--
	});

	$effect(() => {
		ctxState.loop = loop;
	});
	$effect(() => {
		ctxState.totalCount = itemCount;
	});

	function getMinScroll() {
		if (loop) return -Infinity;
		if (!contentRef) return 0;
		return -(contentRef.offsetHeight - ITEM_HEIGHT);
	}

	function getMaxScroll() {
		if (loop) return Infinity;
		return 0;
	}

	function updateContext() {
		ctxState.translateY = scrollPos;
		ctxState.isDragging = isDragging;
	}

	function setScroll(y: number) {
		scrollPos = y;
		updateContext();
	}

	function getCurrentIndex() {
		let rawIdx = Math.round(-scrollPos / ITEM_HEIGHT);
		if (loop && itemCount > 0) {
			const m = itemCount;
			return ((rawIdx % m) + m) % m;
		}
		return rawIdx;
	}

	function scrollToItem(val: string) {
		if (!contentRef) return;
		const node = contentRef.querySelector(`[data-value="${CSS.escape(val)}"]`) as HTMLElement;
		if (node) {
			if (loop) {
				const targetIndex = Array.from(contentRef.children).indexOf(node);
				const currentIndex = getCurrentIndex();
				let diff = targetIndex - currentIndex;
				if (diff > itemCount / 2) diff -= itemCount;
				if (diff < -itemCount / 2) diff += itemCount;

				const targetScroll = scrollPos - diff * ITEM_HEIGHT;
				snapTo(targetScroll);
			} else {
				snapTo(-node.offsetTop);
			}
		}
	}

	function handleStart(y: number) {
		isDragging = true;
		lastY = y;
		lastFrameTime = Date.now();
		velocity = 0;
		cancelAnimationFrame(animFrame);
		clearTimeout(snapTimeout);
		clearTimeout(wheelSnapTimeout);
		updateContext();
		document.body.style.cursor = 'grabbing';
		document.body.style.userSelect = 'none';
	}

	function handleMove(y: number) {
		if (!isDragging) return;
		const now = Date.now();
		const dt = now - lastFrameTime;
		lastFrameTime = now;
		const delta = y - lastY;
		lastY = y;
		if (dt > 0) {
			const v = delta / dt;
			velocity = 0.7 * v + 0.3 * velocity;
		}
		let nextPos = scrollPos + delta;
		const min = getMinScroll();
		const max = getMaxScroll();

		if (!loop) {
			if (nextPos > max) nextPos = max + (nextPos - max) * 0.3;
			if (nextPos < min) nextPos = min + (nextPos - min) * 0.3;
		}

		setScroll(nextPos);
	}

	function handleEnd() {
		if (!isDragging) return;
		isDragging = false;
		updateContext();
		document.body.style.cursor = '';
		document.body.style.userSelect = '';

		const loopFrame = () => {
			if (isDragging) return;
			const friction = 0.94;
			velocity *= friction;
			let nextPos = scrollPos + velocity * 16;
			const min = getMinScroll();
			const max = getMaxScroll();

			if (!loop) {
				if (nextPos > max || nextPos < min) {
					snapToNearest();
					return;
				}
			}

			if (Math.abs(velocity) < 0.05) {
				snapToNearest();
				return;
			}
			setScroll(nextPos);
			animFrame = requestAnimationFrame(loopFrame);
		};
		loopFrame();
	}

	function snapToNearest() {
		const rawIdx = Math.round(scrollPos / ITEM_HEIGHT);
		snapTo(rawIdx * ITEM_HEIGHT);
	}

	function snapTo(targetY: number) {
		if (!loop) {
			const min = getMinScroll();
			const max = getMaxScroll();
			targetY = Math.max(min, Math.min(max, targetY));
		}

		const startY = scrollPos;
		const diff = targetY - startY;

		if (Math.abs(diff) < 1) {
			setScroll(targetY);
			commitValue();
			return;
		}

		const startTime = Date.now();
		const duration = 400;

		const animate = () => {
			if (isDragging) return;
			const now = Date.now();
			const elapsed = now - startTime;
			const t = Math.min(1, elapsed / duration);
			const ease = 1 - Math.pow(1 - t, 5);

			setScroll(startY + diff * ease);

			if (t < 1) {
				animFrame = requestAnimationFrame(animate);
			} else {
				commitValue();
			}
		};
		animFrame = requestAnimationFrame(animate);
	}

	function commitValue() {
		if (!contentRef) return;
		const idx = getCurrentIndex();
		const child = contentRef.children[idx] as HTMLElement;
		if (child) {
			const val = child.getAttribute('data-value');
			if (val && val !== value) {
				value = val;
				onValueChange?.(val);
			}
		}
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();
		if (isDragging) return;

		const dir = Math.sign(e.deltaY);
		const step = ITEM_HEIGHT;
		let nextY = scrollPos - dir * step;

		if (!loop) {
			const min = getMinScroll();
			const max = getMaxScroll();
			nextY = Math.max(min, Math.min(max, nextY));
		}

		setScroll(nextY);

		clearTimeout(wheelSnapTimeout);
		cancelAnimationFrame(animFrame);

		wheelSnapTimeout = setTimeout(() => {
			snapToNearest();
		}, 200);
	}

	onMount(() => {
		tick().then(() => {
			if (value) scrollToItem(value);
		});
		const onMove = (e: MouseEvent) => handleMove(e.clientY);
		const onUp = () => handleEnd();
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onUp);
		return () => {
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseup', onUp);
			cancelAnimationFrame(animFrame);
			clearTimeout(wheelSnapTimeout);
			clearTimeout(snapTimeout);
		};
	});
</script>

<div
	bind:this={containerRef}
	class={cn(
		'relative flex-1 h-full min-w-0 cursor-grab active:cursor-grabbing touch-none z-30',
		className
	)}
	onmousedown={(e) => handleStart(e.clientY)}
	ontouchstart={(e) => {
		e.preventDefault();
		handleStart(e.touches[0].clientY);
	}}
	ontouchmove={(e) => {
		e.preventDefault();
		handleMove(e.touches[0].clientY);
	}}
	ontouchend={handleEnd}
	onwheel={onWheel}
	role="listbox"
	tabindex="0"
>
	<div
		bind:this={contentRef}
		class="absolute left-0 right-0 top-1/2 w-full -mt-[16px] transform-style-3d will-change-transform"
		style="transform: translate3d(0, {scrollPos}px, 0);"
	>
		{@render children()}
	</div>
</div>
