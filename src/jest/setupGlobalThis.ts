import type { Java } from './types';

declare global {
    interface GlobalThis {
        Java: Java;
    }
}

globalThis.Java = <Java>{
	type: (javaPackage) => {
		if (javaPackage === 'java.lang.System') return {
			currentTimeMillis: () => Date.now(),
		};
		if (javaPackage === 'java.util.Locale') return {
			forLanguageTag: (locale: string) => 'no',
		};
		throw new Error(`Unmocked Java package: ${javaPackage}`);
	}
};

// (This is required for `declare global` to work without throwing another error)
export {};
