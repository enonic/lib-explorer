export function getFieldValues() {
	log.warning('field/getFieldValues was deprecated in lib-explorer-4.0.0'); // TODO Throw error in lib-explorer-5.0.0 and remove in lib-explorer-6.0.0
	return {
		count: 0,
		hits: [],
		total: 0
	};
}
