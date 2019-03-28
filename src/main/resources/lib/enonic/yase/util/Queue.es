const ITEMS = '_items';


export class Queue {
	constructor(...items) {
		this[ITEMS] = [...items];
	}
	add(...args) {
		return this[ITEMS].push(...args);
	}
	poll(...args) {
		return this[ITEMS].shift(...args);
	}
	get length() {
		return this[ITEMS].length;
	}
	/*set length(length) {
		return this[ITEMS].length = length;
	}*/
}
