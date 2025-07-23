import { browser } from '$app/environment';
import { getLocale } from '$src/paraglide/runtime';

export const getScrollbarWidth = () => {
	const scrollDiv = document.createElement('div');

	// Apply styles to ensure it has a scrollbar
	scrollDiv.style.visibility = 'hidden';
	scrollDiv.style.overflow = 'scroll'; // Force a scrollbar
	scrollDiv.style.position = 'absolute'; // Remove from document flow
	scrollDiv.style.top = '-9999px'; // Position off-screen

	// Add a child div inside the scrollDiv
	scrollDiv.style.width = '100px';
	scrollDiv.style.height = '100px';
	document.body.appendChild(scrollDiv);

	const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

	// Remove the div after measuring
	document.body.removeChild(scrollDiv);

	return scrollbarWidth;
}

const animateScrollTo = (container: HTMLElement, to: number, duration: number) => {
	var start = container.scrollTop;
	var change = to - start;
	var startTime = performance.now();

	console.log('start',start);
	console.log('change',change);

	function updateScrollPosition(currentTime: number) {
		var elapsed = currentTime - startTime;
		var progress = elapsed / duration;

		container.scrollTop = start + change * easeInOutQuad(progress);

		if (elapsed < duration) {
			requestAnimationFrame(updateScrollPosition);
		}
	}

	const easeInOutQuad = (t: number) => {
		return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	};

	requestAnimationFrame(updateScrollPosition);
};
export const scrollToElement = (element: HTMLElement, duration: number = 1000) => {
  if (!element) return;

  const scrollContainer = document.documentElement || document.body;
  const elementRect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || scrollContainer.scrollTop;
  const targetPosition = scrollTop + elementRect.top - 100; // Subtract 100px to give some space at the top

  const startTime = performance.now();
  const startPosition = scrollContainer.scrollTop;
  const distance = targetPosition - startPosition;

  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const easeProgress = easeInOutQuad(progress);

    window.scrollTo(0, startPosition + distance * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export const serializeNonPOJOs = (obj: object) => {
	return structuredClone(obj);
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const daysAgo = (date: string | Date) => {
	const locale = getLocale();
	const now = new Date();
	const past = new Date(date);

	// Calculate the difference in milliseconds
	const diffInMilliseconds = now.getTime() - past.getTime();

	// Convert milliseconds to days
	const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

	if (locale === 'en') {
		if (diffInDays === 0) {
			return 'today';
		} else if (diffInDays === 1) {
			return '1 day ago';
		} else {
			return `${diffInDays} days ago`;
		}
	} else {
		if (diffInDays === 0) {
			return 'heute';
		} else if (diffInDays === 1) {
			return 'vor einem Tag';
		} else {
			return `vor ${diffInDays} Tagen`;
		}
	}
};

export const copyToClipboard = (text: string) => {
	const input = document.createElement('input');
	input.setAttribute('value', text);
	document.body.appendChild(input);
	input.select();

	try {
		const success = document.execCommand('copy');
		if (success) {
			console.log('Text copied to clipboard');
			// Optionally, you can notify the user that the text was copied successfully.
		} else {
			console.error('Could not copy text');
			// Handle error, such as displaying a message to the user that the copy operation failed.
		}
	} catch (err) {
		console.error('Error copying text: ', err);
		// Handle error, such as displaying a message to the user that the copy operation failed.
	}

	document.body.removeChild(input);
};

export const generateHslaColors = (hue: number, saturation: number, lightness: number, length: number) => {
	const colors: string[] = [];

	for (let i = 1; i < length + 1; i++) {
		// Calculate the opacity value
		let opacity = i / (length - 1);
		if(length===1) opacity = 1

		// Create the HSLA color string
		const hslaColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;

		// Add the color to the array
		colors.push(hslaColor);
	}

	colors.reverse();
	console.log('colors',colors);
	return colors;
};

export const groupBy = (array: any[], key: string) =>
	Object.entries(
		array.reduce((result: Record<string, any[]>, currentValue: any) => {
			const groupKey = currentValue[key];
			result[groupKey] = result[groupKey] || [];
			result[groupKey].push(currentValue);
			return result;
		}, {})
	).map(([category, content]) => ({ category, content }));

export const sortByKey = (array: any[], key: string) => {
	return array.sort((a: any, b: any) => {
		if (a[key] < b[key]) {
			return 1;
		}
		if (a[key] > b[key]) {
			return -1;
		}
		return 0; // a must be equal to b
	});
};

export const setCookie = (name: string, value: string, days?: number) => {
	if (!import.meta.env.SSR) {
		let expires = '';
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = name + '=' + value + expires + '; path=/';
	}
};

export const deleteCookie = (name: string) => {
	if (!import.meta.env.SSR) {
		document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
};


export const getCookie = (name: string) => {
	if (!import.meta.env.SSR) {
		let cname = name + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(cname) == 0) {
				return c.substring(cname.length, c.length);
			}
		}
		return undefined;
	}
	return undefined;
};

export const debounce = <T extends (...args: any[]) => void>(
	func: T,
	delay: number
): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout>;
	return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
};

export const getQueryParam = (paramName: string): string | null => {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get(paramName);
};

/**
 * Get the full PocketBase URL for a media file
 * @param collection - The PocketBase collection name (e.g., 'topicVersions')
 * @param recordId - The record ID
 * @param filename - The filename from the media field
 * @param baseUrl - The PocketBase base URL
 * @returns The full URL to the media file, or empty string if invalid
 */
export const getMediaUrl = (
	collection: string, 
	recordId: string, 
	filename: string, 
	baseUrl: string
): string => {
	if (!collection || !recordId || !filename || !baseUrl) {
		return '';
	}
	
	// Handle full URLs that are already constructed
	if (filename.startsWith('http://') || filename.startsWith('https://')) {
		return filename;
	}
	
	return `${baseUrl}/api/files/${collection}/${recordId}/${filename}`;
};
