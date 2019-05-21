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
   dispatch(doAction(BEGIN_LOAD));
   const response = await doFetchStories(query);
   dispatch(doAction(END_LOAD));
   dispatch(doAddStories(response.hits));
 };
  
  export {
    doAddStories,
    doFetchStoriesAsync,
  };