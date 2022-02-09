//@ts-ignore
const {forLanguageTag} = Java.type('java.util.Locale');


export const getLocales = ({
	locale = undefined,
	query = ''
} :{
	locale? :string
	query? :string
} = {}) => {
	const uniqTagObj = {};
	//@ts-ignore
	Java.from(
		//@ts-ignore
		__.newBean('com.enonic.explorer.Locales').getLocales(query)
	).forEach((l :{
		getCountry :() => string
		getDisplayCountry :(locale :string) => string
		getDisplayLanguage :(locale :string) => string
		getDisplayName :(locale :string) => string
		getDisplayVariant :(locale :string) => string
		getLanguage :() => string
		getVariant :() => string
		toLanguageTag :() => string
	}) => {
		const tag = l.toLanguageTag();
		if (!uniqTagObj[tag]) {
			uniqTagObj[tag] = {
				country: l.getCountry(),
				displayCountry: l.getDisplayCountry(locale ? forLanguageTag(locale) : l),
				displayLanguage: l.getDisplayLanguage(locale ? forLanguageTag(locale) : l),
				displayName: l.getDisplayName(locale ? forLanguageTag(locale) : l), // not null!
				displayVariant: l.getDisplayVariant(locale ? forLanguageTag(locale) : l),
				language: l.getLanguage(), // not null! uniq?
				tag, // uniq & not null!
				variant: l.getVariant()
			};
		}
	});
	return Object.keys(uniqTagObj).sort().map((k) => uniqTagObj[k]);
};
