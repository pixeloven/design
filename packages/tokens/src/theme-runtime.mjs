/** Pure runtime: no browser globals, preference storage or environment reads. */
export function createThemeAPI(themeTokens, defaults, appearanceNames) {
  const freeze = (value) => {
    if (value && typeof value === "object") {
      for (const child of Object.values(value)) freeze(child);
      Object.freeze(value);
    }
    return value;
  };
  freeze(themeTokens);
  const themeNames = Object.freeze(Object.keys(themeTokens));
  const accentNames = Object.freeze(Object.keys(themeTokens[themeNames[0]]));
  const appearances = Object.freeze([...appearanceNames]);
  const defaultThemeSettings = Object.freeze({ ...defaults });

  function normalizeThemeSettings(settings) {
    const input = settings && typeof settings === "object" && !Array.isArray(settings) ? settings : {};
    const choice = (key, values) =>
      Object.hasOwn(input, key) && values.includes(input[key]) ? input[key] : defaultThemeSettings[key];
    return Object.freeze({
      theme: choice("theme", themeNames),
      accent: choice("accent", accentNames),
      appearance: choice("appearance", appearances),
    });
  }

  function resolveAppearance(appearance, systemScheme = "dark") {
    if (appearance === "dark" || appearance === "light") return appearance;
    return systemScheme === "light" ? "light" : "dark";
  }

  function resolveTheme(settings = {}, systemScheme = "dark") {
    const normalized = normalizeThemeSettings(settings);
    const scheme = resolveAppearance(normalized.appearance, systemScheme);
    return Object.freeze({
      ...normalized,
      scheme,
      tokens: themeTokens[normalized.theme][normalized.accent][scheme],
    });
  }

  return Object.freeze({
    themeNames, accentNames, appearances, defaultThemeSettings, themeTokens,
    normalizeThemeSettings, resolveAppearance, resolveTheme,
  });
}
