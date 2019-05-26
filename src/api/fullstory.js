// TODO: host an official FullStory package in npm so FS that defines these functions so they can be imported as a module

const FS = () => window[window['_fs_namespace']];

const hasFullStoryWithFunction = (...testNames) => {
  const snippetLoaded = !!FS();
  const functionsCreated = testNames.reduce((acc, current) => { return acc && window.FS[current] }, true);
  return snippetLoaded && functionsCreated;
};

const wrapFunction = name => (...params) => {
  if (hasFullStoryWithFunction(name)) {
    return FS()[name](...params);
  }
  console.log(`FS.${name} not ready`);
};

const wrappedFS = ['event', 'log', 'getCurrentSessionURL', 'identify', 'setUserVars', 'consent', 'shutdown', 'restart'].reduce((acc, current) => {
  acc[current] = wrapFunction(current)
  return acc;
}, {});

const event = wrappedFS.event;
const log = wrappedFS.log;
const getCurrentSessionURL = wrappedFS.getCurrentSessionURL;
const identify = wrappedFS.identify;
const setUserVars = wrappedFS.setUserVars;
const consent = wrappedFS.consent;
const shutdown = wrappedFS.shutdown;
const restart = wrappedFS.restart;


export {
  event,
  log,
  getCurrentSessionURL,
  identify,
  setUserVars,
  consent,
  shutdown,
  restart,
};