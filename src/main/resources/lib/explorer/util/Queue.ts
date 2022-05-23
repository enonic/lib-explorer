const ITEMS = '_items';


export class Queue<Item = unknown> {
	constructor(...items :Array<Item>) {
		this[ITEMS] = [...items];
	}
	add(...args :Array<unknown>) :number {
		return this[ITEMS].push(...args);
	}
	poll(...args :Array<unknown>) {
		return this[ITEMS].shift(...args) as Item;
	}
	get length() :number {
		return this[ITEMS].length;
	}
	/*set length(length) {
		return this[ITEMS].length = length;
	}*/
}
