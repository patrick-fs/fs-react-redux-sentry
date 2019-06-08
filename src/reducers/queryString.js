import { SAVE_QUERY, LOAD_QUERY } from '../constants/actionTypes';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function queryStringReducer(state = '', action) {
  switch (action.type) {
    case SAVE_QUERY:
      history.push(`/?query=${action.query}`);
      return action.query;
    case LOAD_QUERY:
      const qString = history.location.search;
      const qParams = qString.split('&');
      const maybeQuery = qParams.filter(p => p.toLowerCase().indexOf('query=') > -1);
      const query = maybeQuery.length > 0 ? maybeQuery[0].split('=')[1] : '';
      return decodeURIComponent(query);
    default: return state;
  }
}

export default queryStringReducer;