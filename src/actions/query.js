import { SAVE_QUERY, LOAD_QUERY } from '../constants/actionTypes';

const doSaveQuery = query => ({
  type: SAVE_QUERY,
  query,
});

const doLoadQuery = () => ({
  type: LOAD_QUERY,
});

export {
  doSaveQuery,
  doLoadQuery
}