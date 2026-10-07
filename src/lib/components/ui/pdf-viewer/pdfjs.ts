import type * as PdfJs from 'pdfjs-dist';

let loader: Promise<typeof PdfJs> | null = null;

/**
 * pdf.js touches browser globals at import time, so it is only ever loaded
 * lazily on the client. The promise is shared so every viewer on the page
 * reuses one module and one worker setup.
 */
export function loadPdfjs() {
	loader ??= Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
		.then(([lib, worker]) => {
			lib.GlobalWorkerOptions.workerSrc = worker.default;
			return lib;
		})
		.catch((error) => {
			// Don't cache a failure — a later viewer should be able to retry.
			loader = null;
			throw error;
		});

	return loader;
}

/**
 * pdf.js keeps fonts, character maps and image decoders as separate assets.
 * They default to the CDN copy matching the installed version; pass your own
 * URLs to the viewer to self-host them.
 */
export function cdnAssets(version: string) {
	const base = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}`;
	return {
		standardFontDataUrl: `${base}/standard_fonts/`,
		cMapUrl: `${base}/cmaps/`,
		wasmUrl: `${base}/wasm/`
	};
}
