export const extractOrgFromContentId = (contentId) => contentId.split('+')[0].split(':')[1];

/**
 * Retrieves the array of open collapsibles names from localStorage.
 * @returns {Array} The array of open collapsibles names.
 */
export const getOpenCollapsibles = () => JSON.parse(localStorage.getItem('openCollapsibles')) || [];

/**
   * Adds a collapsible name to the localStorage.
   * @param {string} name The name of the collapsible to open.
   */
export const openCollapsible = (name) => {
  const openCollapsibles = getOpenCollapsibles();
  if (!openCollapsibles.includes(name)) {
    localStorage.setItem('openCollapsibles', JSON.stringify([...openCollapsibles, name]));
  }
};

/**
   * Removes a collapsibles name from the localStorage.
   * @param {string} name The name of the collapsible to close.
   */
export const closeCollapsible = (name) => {
  const openCollapsibles = getOpenCollapsibles();
  const updatedOpenCollapsibles = openCollapsibles.filter(itemName => itemName !== name);
  localStorage.setItem('openCollapsibles', JSON.stringify(updatedOpenCollapsibles));
};
