const parseQuery = queryString => {
  const qParams = queryString.split('&');
  const maybeQuery = qParams.filter(p => p.toLowerCase().indexOf('query=') > -1);
  const query = decodeURIComponent(maybeQuery.length > 0 ? maybeQuery[0].split('=')[1] : '');
  return query;
}

export default parseQuery;