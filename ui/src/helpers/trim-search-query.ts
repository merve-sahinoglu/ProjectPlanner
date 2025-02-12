function formatSearchQuery(searchQuery: string | null) {
  if (!searchQuery) return '';

  return searchQuery
    .toLocaleLowerCase()
    .trim()
    .replace('-', '')
    .replace(/\s/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .toLocaleUpperCase('en-US');
}

export default formatSearchQuery;
