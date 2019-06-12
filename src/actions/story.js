import { STORIES_ADD } from '../constants/actionTypes';
import { doBeginLoad, doEndLoad } from './loader';
import { doError } from './error';
import fetchStories from '../api/storys';

const doAddStories = stories => ({
  type: STORIES_ADD,
  stories,
});

const doFetchStoriesAsync = query => async dispatch => {
  dispatch(doBeginLoad());
  try {
    if (query === 'break it') throw new Error('Broken on demand!');
    const response = await fetchStories(query);
    dispatch(doAddStories(response.hits));
  } catch (err) {
    dispatch(doError(err));
  }
  dispatch(doEndLoad());  
};

export {
  doAddStories,
  doFetchStoriesAsync,
};