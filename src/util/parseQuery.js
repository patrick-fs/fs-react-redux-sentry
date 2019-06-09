const parseQuery = locationSearch => {
  const qString = locationSearch;
  const qParams = qString.split('&');
  const maybeQuery = qParams.filter(p => p.toLowerCase().indexOf('query=') > -1);
  const query = decodeURIComponent(maybeQuery.length > 0 ? maybeQuery[0].split('=')[1] : '');
  return query;
}

export default parseQuery;