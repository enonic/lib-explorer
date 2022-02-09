export const uniqueFilter = <Value>(
	value :Value,
	index :number,
	self :Array<Value>
) =>
	self.indexOf(value) === index;
