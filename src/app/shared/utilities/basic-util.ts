export const fuzzy = (searchString: string, searchText: string) => {
  let i = 0;
  let n = -1;
  let l;
  for (; l = searchText.toLowerCase()[i++] ;) if (!~(n = searchString.toLowerCase().indexOf(l, n + 1))) return false;
  return true;
}

// function for dynamic sorting
export function compareValues<T>(key: keyof T, order: 'asc' | 'desc' = 'asc') {
  return function(a: any, b: any) {

    let varA!: any;
    let varB!: any;

    const possibleDateA = new Date(a[key]).toString();
    const possibleDateB = new Date(b[key]).toString();

    if (possibleDateA !== 'Invalid Date' && possibleDateB !== 'Invalid Date') {
      varA = new Date(a[key]);
      varB = new Date(b[key]);
    } else if (!isNaN(a[key]) && !isNaN(b[key])) {
      varA = +a[key];
      varB = +b[key];
    } else  {
      varA = a[key].toLocaleLowerCase();
      varB = b[key].toLocaleLowerCase();
    }

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (order === 'desc') ? (comparison * -1) : comparison;
  };
}

export function titleCase(str: any) {
  const changedBySpace = str.split(' ').map(function (word: string) {
                            return (word.charAt(0).toUpperCase() + word.slice(1));
                          }).join(' ');
  const changedByHyphen = changedBySpace.split('-').map(function (word: string) {
                            return (word.charAt(0).toUpperCase() + word.slice(1));
                          }).join('-');

  return changedByHyphen;
}
