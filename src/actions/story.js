import { STORIES_ADD } from '../constants/actionTypes';
import { doBeginLoad, doEndLoad } from './loader';
import { doError } from './error';
import fetchStories from '../api/storys';

const doAddStories = stories => ({
  type: STORIES_ADD,
  stories,
});

// NOTE: injecting fetchStories for testability
const doFetchStoriesAsync = (query, doFetchStories = fetchStories) => async dispatch => {
  dispatch(doBeginLoad());
  let response;
  try {
    if (query === 'break it') throw new Error('Broken on demand!');
    response = await doFetchStories(query);
  } catch (err) {
    dispatch(doEndLoad());
    return dispatch(doError(err));
  }
  dispatch(doAddStories(response.hits));
  dispatch(doEndLoad());
};

export {
  doAddStories,
  doFetchStoriesAsync,
};