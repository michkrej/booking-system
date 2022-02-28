export const sortAlphabetically = (elem) =>
  elem.sort((a, b) => ('' + a.text).localeCompare(b.text, 'sv', { numeric: true }))
