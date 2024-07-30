import { browser } from '$app/environment';
import { t, locale } from '$lib/translations';
import { get } from 'svelte/store';

export const serializeNonPOJOs = (obj: object) => {
	return structuredClone(obj);
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const daysAgo = (date) => {
  const now = new Date();
  const past = new Date(date);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = now - past;

  // Convert milliseconds to days
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

console.log('daysAgo', get(locale));

	if(get(locale) === 'en'){
		if (diffInDays === 0) {
			return "today";
		} else if (diffInDays === 1) {
			return "1 day ago";
		} else {
			return `${diffInDays} days ago`;
		}
	}else{
		if (diffInDays === 0) {
			return "heute";
		} else if (diffInDays === 1) {
			return "vor einem Tag";
		} else {
			return `vor ${diffInDays} Tagen`;
		}
	}
}

export const copyToClipboard = (text) => {
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

export const generateHslaColors = (hue, saturation, lightness, length) => {
	const colors = [];

	for (let i = 1; i < length + 1; i++) {
		// Calculate the opacity value
		const opacity = i / (length - 1);

		// Create the HSLA color string
		const hslaColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;

		// Add the color to the array
		colors.push(hslaColor);
	}
	
	colors.reverse();
	return colors;
};

export const groupBy = (array: object[], key: string) =>
	Object.entries(
		array.reduce((result, currentValue) => {
			const groupKey = currentValue[key];
			result[groupKey] = result[groupKey] || [];
			result[groupKey].push(currentValue);
			return result;
		}, {})
	).map(([category, content]) => ({ category, content }));

export const sortByKey = (array: object[], key: string) => {
	return array.sort((a, b) => {
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
