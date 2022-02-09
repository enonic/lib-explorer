import traverse from 'traverse';


export function getPaths(obj) {
	return traverse(obj).paths();
}
