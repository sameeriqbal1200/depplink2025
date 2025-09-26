import "server-only";

type Locale = "en" | "ar";

const dictionaries: Record<Locale, () => Promise<any>> = {
    en: () => import("./dictionaries/en.json").then((m) => m.default),
    ar: () => import("./dictionaries/ar.json").then((m) => m.default),
};

export const getDictionary = async (locale: Locale) => {
    const loadDictionary = dictionaries[locale];
    if (!loadDictionary) {
        throw new Error(`❌ Unsupported locale: ${locale}`);
    }
    return await loadDictionary();
};