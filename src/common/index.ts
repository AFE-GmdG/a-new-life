export function orThrow(message: string = "Unexpected falsy"): never {
	throw new Error(message);
}

type LocalizedStringProps = {
	readonly [lang: string]: {
		readonly [key: string]: string
	}
};

export class LocalizedStrings {

	private readonly props: LocalizedStringProps;
	private readonly defaultLanguage: string;
	private currentLanguage: string;

	/**
	 * The currently used language.
	 */
	get language(): string {
		return this.currentLanguage;
	}

	/**
	 * Can be used from ouside the class to set a particular language.
	 */
	set language(language: string) {
		this.currentLanguage = this.getBestMatchingLanguage(language);
	}

	constructor(props: LocalizedStringProps, defaultLanguage: string = "en") {
		this.props = props;
		this.defaultLanguage = defaultLanguage;
		this.language = this.getBestMatchingLanguage(
			(navigator.language && typeof navigator.language !== "undefined")
				? navigator.language
				: ((navigator as any).userLanguage && typeof (navigator as any).userLanguage !== "undefined")
					? (navigator as any).userLanguage
					: defaultLanguage
		);
	}

	private getBestMatchingLanguage(language: string) {
		// If an object with the passed language key exists return it
		if (this.props[language]) {
			return language;
		}

		// if the string is composed try to find a match with only the first language identifiers (en-US --> en)
		const index = language.indexOf("-");
		if (index >= 0) {
			language = language.substring(0, index);
			if (this.props[language]) {
				return language;
			}
		}

		// Return the default language
		return this.defaultLanguage;
	}

	/**
	 * Gets the translated string for specified key. Returns undefined if the key isn't present.
	 * @param key The key to get the translation.
	 */
	get(key: string): string | undefined {
		return this.props[this.currentLanguage][key] || this.props[this.defaultLanguage][key];
	}

	/**
	 * Gets the translated string for specified key. Returns the default value if the key isn't present.
	 * @param key The key to get the translation.
	 * @param defaultValue The default value if the key isn't present.
	 */
	getString(key: string, defaultValue: string): string {
		return this.get(key) || defaultValue;
	}

}
