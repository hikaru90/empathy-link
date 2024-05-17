import { writable, derived } from 'svelte/store';
import {
	CalendarDate,
	DateFormatter,
	type DateValue,
	getLocalTimeZone
} from '@internationalized/date';

const todayDate = new Date();
console.log('todayDate',todayDate);

export let startDate = writable(
	new CalendarDate(todayDate.getFullYear(), todayDate.getMonth()+1, todayDate.getDate()).subtract({
		days: 14
	})
);
export let endDate = writable(
	new CalendarDate(todayDate.getFullYear(), todayDate.getMonth()+1, todayDate.getDate())
);

startDate.subscribe((value) => {
	console.log('startDate changed', value);
});
endDate.subscribe((value) => {
	console.log('endDate changed', value);
});
