export const selectHelpUrlsByNames = (names) => (state) => {
  const urlsDictionary = {};

  names.forEach(name => {
    urlsDictionary[name] = state.helpTokens.pages[name] || null;
  });

  return urlsDictionary;
};

export const selectHelpUrlLocaleByLanguage = (language) => (state) => (
  state.helpTokens.locales[language] || null
);

export const getLoadingHelpTokensStatus = (state) => state.helpTokens.loadingHelpTokensStatus;
