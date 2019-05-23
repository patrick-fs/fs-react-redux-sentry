/* global FS */
const FS = window.FS;

const recordAction = () => next => action => {
  FS.log(`Redux action: ${action.type}`);
  return next(action);
};

export default recordAction;