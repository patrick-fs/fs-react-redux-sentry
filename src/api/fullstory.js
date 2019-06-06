// TODO: host an official FullStory package in npm that defines this module

const FS = () => window[window['_fs_namespace']];

const ensureFSLoaded = () => {
  const snippetLoaded = !!FS();
  if (!snippetLoaded) {
    throw Error('FullStory is not loaded, please ensure the FullStory snippet is executed before calling FullStory API functions')
  }
  return true;
}

const hasFullStoryWithFunction = (...testNames) => {
  const functionsCreated = () => testNames.reduce((acc, current) => { return acc && FS()[current] }, true);
  return ensureFSLoaded() && functionsCreated();
};

const wrapFunction = name => (...params) => {
  if (hasFullStoryWithFunction(name)) {
    return FS()[name](...params);
  }
  console.warn(`FS.${name} not ready`);
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
