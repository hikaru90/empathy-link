import { browser } from '$app/environment';

export const serializeNonPOJOs = (obj:object) => {
  return structuredClone(obj)
}

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