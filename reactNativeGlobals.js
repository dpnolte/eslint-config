module.exports = {
  // Map from global var to bool specifying if it can be redefined
  __DEV__: true,
  __dirname: false,
  __fbBatchedBridgeConfig: false,
  alert: false,
  cancelAnimationFrame: false,
  cancelIdleCallback: false,
  clearImmediate: true,
  clearInterval: false,
  clearTimeout: false,
  console: false,
  document: false,
  ErrorUtils: false,
  escape: false,
  Event: false,
  EventTarget: false,
  exports: false,
  fetch: false,
  FormData: false,
  global: false,
  HermesInternal: false,
  Intl: false,
  Map: true,
  module: false,
  navigator: false,
  process: false,
  Promise: true,
  requestAnimationFrame: true,
  requestIdleCallback: true,
  require: false,
  Set: true,
  setImmediate: true,
  setInterval: false,
  setTimeout: false,
  WebSocket: true,
  window: false,
  XMLHttpRequest: false,
};
