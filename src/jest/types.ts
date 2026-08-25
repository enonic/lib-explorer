export interface JavaLangSystem {
	currentTimeMillis: () => number;
}

export interface JavaUtilLocale {
	forLanguageTag: (locale: string) => string;
}

export interface JavaPackages {
	'java.lang.System': JavaLangSystem;
	'java.util.Locale': JavaUtilLocale;
}

export type JavaPackage = keyof JavaPackages;

export interface Java {
	type: (javaPackage: JavaPackage) => JavaPackages[JavaPackage];
}
