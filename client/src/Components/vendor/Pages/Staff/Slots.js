export const slots = []

for (let i = 1; i <= 24; i++) {
	slots.push({
		label: `${i}:00`,
		value: `${i}:00`,
	})
}


export function get15Interval(shopTiming) {
	const stARR = shopTiming.split('-');
	const startTime = stARR[0].slice(1, 5);
	const endTime = stARR[1].slice(0,5);
	const quarterHours = ['00', '15', '30', '45'];
	const times = [];
	for(let i = 0; i < 24; i++){
		for(let j = 0; j < 4; j++){
			times.push(i + ":" + quarterHours[j]);
		}
	}
	console.log(times)
	const startIndex = times.indexOf(startTime)
	const endIndex = times.indexOf(endTime);

	const arr = times.slice(startIndex, endIndex + 1);
	const option = arr.map((slot) => {
		return {
			label: slot,
			value: slot
		}
	})
	return option;
}

export function get30Interval(shopTiming) {
	const stARR = shopTiming.split('-');
	const startTime = stARR[0].slice(1, 5);
	const endTime = stARR[1].slice(0,5);
	const quarterHours = ['00', '30'];
	const times = [];
	for(let i = 0; i < 24; i++){
		for(let j = 0; j < 2; j++){
			times.push(i + ":" + quarterHours[j]);
		}
	}


	const startIndex = times.indexOf(startTime)
	const endIndex = times.indexOf(endTime);
	const arr = times.slice(startIndex, endIndex + 1);

	const option = arr.map((slot) => {
		return {
			label: slot,
			value: slot
		}
	})
	return option;
}

export function getInterval(shopTiming) {
	const stARR = shopTiming.split('-');
	const startTime = stARR[0].slice(1, 5);
	const endTime = stARR[1].slice(0,5);
	const quarterHours = ['00', '45'];
	const times = [];
	for(let i = 0; i < 24; i++){
		times.push(i + ":00");
	}


	const startIndex = times.indexOf(startTime)
	const endIndex = times.indexOf(endTime);
	const arr = times.slice(startIndex, endIndex + 1);

	const option = arr.map((slot) => {
		return {
			label: slot,
			value: slot
		}
	})
	return option;
}

export function get60Interval(interval) {
	const quarterHours = [];
	quarterHours.push('15');
	const times = [];
	for(let i = 0; i < 24; i++){
		for(let j = 0; j < 1; j++){
			times.push(i + ":" + quarterHours[j]);
		}
	}
	return times;
}

export function getFull30Interval(shopTiming) {
	const quarterHours = ['00', '30'];
	const times = [];
	for(let i = 0; i < 24; i++){
		for(let j = 0; j < 2; j++){
			if(i > 9) {
				times.push(i + ":" + quarterHours[j]);
			} else {
				times.push("0" + i + ":" + quarterHours[j]);
			}

		}
	}

	const option = times.map((slot) => {
		return {
			label: slot,
			value: slot
		}
	})
	return option;
}