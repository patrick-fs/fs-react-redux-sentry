import { SAVE_QUERY, LOAD_QUERY } from '../constants/actionTypes';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const doSaveQuery = query => {
  history.push(`/?query=${query}`);
  return {
    type: SAVE_QUERY,
    query,
  };
};

const doLoadQuery = () => {
  const qString = history.location.search;
  const qParams = qString.split('&');
  const maybeQuery = qParams.filter(p => p.toLowerCase().indexOf('query=') > -1);
  const query = decodeURIComponent(maybeQuery.length > 0 ? maybeQuery[0].split('=')[1] : '');
  return { 
    type: LOAD_QUERY,
    query,
  };
};

export {
  doSaveQuery,
  doLoadQuery
}