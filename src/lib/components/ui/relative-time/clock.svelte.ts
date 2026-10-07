/**
 * One timer for every RelativeTime on the page, running only as often as the
 * most demanding one needs: every second for "12 seconds ago", far less for
 * "3 days ago", and not at all when nothing is live.
 */
let now = $state(Date.now());

const demands = new Map<symbol, number>();
let timer: ReturnType<typeof setInterval> | undefined;
let interval = 0;
let watchingVisibility = false;

function schedule() {
	const next = demands.size > 0 ? Math.min(...demands.values()) : 0;
	if (next === interval) return;

	clearInterval(timer);
	timer = undefined;
	interval = next;

	if (next > 0) timer = setInterval(() => (now = Date.now()), next);
}

/** Background tabs throttle timers, so catch up the moment the tab is visible again. */
function watchVisibility() {
	if (watchingVisibility || typeof document === 'undefined') return;
	watchingVisibility = true;
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') now = Date.now();
	});
}

export const clock = {
	get now() {
		return now;
	},
	/** Ask for updates at least every `ms`. Re-demanding with the same id replaces it. */
	demand(id: symbol, ms: number) {
		demands.set(id, ms);
		now = Date.now();
		watchVisibility();
		schedule();
	},
	release(id: symbol) {
		demands.delete(id);
		schedule();
	},
	/** Refresh immediately — the clock may have been idle while nothing was live. */
	sync() {
		now = Date.now();
	}
};
