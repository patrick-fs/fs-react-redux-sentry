import { doError } from '../actions/error';

const crashReporter = store => next => action => {
  // we got a thunk
  if (typeof action === 'function') {
    // wrap it in a function to try/catch the downstream invocation
    const wrapAction = fn => async (dispatch, getState, extraArgument) => {
      try {
        await fn(dispatch, getState, extraArgument);
      } catch (e) {
        dispatch(doError(e));
      }
    }
    // send wrapped function to the next middleware
    // this should be upstrem from redux-thunk middleware
    return next(wrapAction(action));
  }
  
  try {
    return next(action);
  } catch (e) {
      store.dispatch(doError(e));
  }
};

export default crashReporter;