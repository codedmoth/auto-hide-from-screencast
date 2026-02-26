
// Match to window.resourceClass
// Set window.excludeFromCapture
function getSettings() {
  // Read as strings and split into arrays
  const hideOnLaunchStr = readConfig("hideOnLaunch", "");
  const hideOnFocusStr = readConfig("hideOnFocus", "");
  const hideAlwaysStr = readConfig("hideAlways", "");
  // Convert comma-separated strings to arrays, trim whitespace, filter empty
  function parseList(str) {
    return str.split(',')
              .map(s => s.trim())
              .filter(s => s.length > 0);
  }

  return {
    hideOnLaunch: parseList(hideOnLaunchStr),
    hideOnFocus: parseList(hideOnFocusStr),
    hideAlways: parseList(hideAlwaysStr)
  };
}

function onEFCChange(window) {
  if (!window.excludeFromCapture) {
    window.excludeFromCapture = true;
  }
}

function onLaunch(window) {
  const settings = getSettings();
  if (!window) { // prayge this doesn't ever trigger :D
    return
  }

  const windowClass = window.resourceClass.toString();

  if ( settings.hideOnLaunch.includes(windowClass) ) {
    onEFCChange(window)
  }
  if (settings.hideOnFocus.includes(windowClass)) {
    onEFCChange(window)
  }
  if ( settings.hideAlways.includes(windowClass) ) {
    onEFCChange(window)
    window.excludeFromCaptureChanged.connect(() => { onEFCChange(window) });
  }
}

function onFocus(window) {
  const settings = getSettings();
  if (!window) {
    return
  }
  const windowClass = window.resourceClass.toString()

  if (settings.hideOnFocus.includes(windowClass) || settings.hideAlways.includes(windowClass)) {
    onEFCChange(window)
  }
}

workspace.windowAdded.connect(onLaunch);
workspace.windowActivated.connect(onFocus);

workspace.windowList().forEach(onLaunch);
