/**
 * Only calls fn at most every delay ms
 *
 * Usefull for resize, mousemove, etc. events
 */
export function throttledHandler(delay, fn) {
  let lastCall = 0;
  return function throttled(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    fn(...args);
  };
}

/**
 * Calls fn when there has not been an mouseup event in time ms
 *
 * Usefull for functions that need to run on holding down the mouse button
 */
export function onNoMouseUp(time, fn) {
  const timeout = setTimeout(() => { fn(); }, time);

  function onMouseUp() {
    clearTimeout(timeout);
    document.removeEventListener('mouseup', onMouseUp);
  }
  document.addEventListener('mouseup', onMouseUp);
}

/**
 * Routes to the path the user got redirected from, if that was not the case, redirect to path
 *
 * @param {string} path redirect fallback
 */
export function redirectedFromOr(path, router) {
  // check redirect to param
  const redirectedFrom = router.currentRoute.value.redirectedFrom?.fullPath;
  if (redirectedFrom) {
    // redirect there
    router.push(redirectedFrom);
    return;
  }

  // redirect to path
  router.push(path);
}
