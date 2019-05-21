import {
    STORIES_ADD,
    STORIES_FETCH,
    BEGIN_LOAD,
    END_LOAD
  } from '../constants/actionTypes';

  import fetchStories from '../api/storys';
  
  const doAddStories = stories => ({
    type: STORIES_ADD,
    stories,
  });

  const doAction = type => ({
    type,
  });
  /*
  const doFetchStories = query => ({
    type: STORIES_FETCH,
    query,
  });
  */

  // NOTE: injecting fetchStories for testability
  const doFetchStoriesAsync = (query, doFetchStories = fetchStories) => async dispatch => {
    //TODO: throw error if query == 'break it'
    dispatch(doAction(BEGIN_LOAD));
    const response = await doFetchStories(query);
    dispatch(doAddStories(response.hits));
    dispatch(doAction(END_LOAD));
 };
  
  export {
    doAddStories,
    doFetchStoriesAsync,
  };