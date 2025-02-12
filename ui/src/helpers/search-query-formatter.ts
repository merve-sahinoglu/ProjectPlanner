function formatSearchQuery(searchQuery: string | null) {
  if (!searchQuery) return '';

  return searchQuery
    .trim()
    .replace(/\s/g, '')
    .replace(/-/g, '')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/,/g, "")
    .replace(/\./g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace(/%/g, "")
    .replace(/\+/g, "")
    .replace(/\//g, '')
    .toLocaleUpperCase('en-US');
  
  
  /*  search query değiştirildi.
  .toLocaleLowerCase().trim().replace('-', '')
    .replace(/\s/g, '')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o').toLocaleUpperCase('en-US'); */
}

export default formatSearchQuery;
