export const accurateInterval = function (fn, time) {
  let cancel, nextAt, timeout, wrapper, timeoutID;
  nextAt = new Date().getTime() + time;
  timeout = null;
  wrapper = function () {
    nextAt += time;
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return fn();
  };
  cancel = function () {
    return clearTimeout(timeout);
  };
  // eslint-disable-next-line
  timeoutID = function () {
    return timeout;
  };
  timeout = setTimeout(wrapper, nextAt - new Date().getTime());
  return {
    cancel: cancel,
    timeoutID : timeout
  };
};