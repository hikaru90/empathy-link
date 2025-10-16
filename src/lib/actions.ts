import { browser } from '$app/environment';

/**
 * Svelte action for visibility tracking
 * Usage: <div use:checkVisibility={{ offset: 100, threshold: 0.2 }}>
 * Adds 'is-visible' class when element enters viewport
 */
export function checkVisibility(
	node: HTMLElement,
	options?: { offset?: number; threshold?: number; once?: boolean }
) {
	if (!browser) return {};

	const offset = options?.offset ?? 0;
	const threshold = options?.threshold ?? 0.1;
	const once = options?.once ?? false;

	const observerOptions = {
		root: null,
		rootMargin: `${offset}px`,
		threshold: threshold
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				(entry.target as HTMLElement).dataset.visible = 'true';
				if (once) {
					observer.unobserve(entry.target);
				}
			} else {
				if (!once) {
					delete (entry.target as HTMLElement).dataset.visible;
				}
			}
		});
	}, observerOptions);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
