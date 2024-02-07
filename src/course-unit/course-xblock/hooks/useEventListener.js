import { useEffect, useRef } from 'react';

/**
 * Custom React hook for managing event listeners with automatic cleanup on component unmount.
 *
 * @param {string} type - The type of the event to listen for (e.g., 'click', 'keydown', etc.).
 * @param {Function} handler - The callback function to be executed when the specified event occurs.
*/
function useEventListener(type, handler) {
  // We use this ref so that we can hold a reference to the currently active event listener.
  const eventListenerRef = useRef(null);
  useEffect(() => {
    // If we currently have an event listener, remove it.
    if (eventListenerRef.current !== null) {
      global.removeEventListener(type, eventListenerRef.current);
      eventListenerRef.current = null;
    }
    // Now add our new handler as the event listener.
    global.addEventListener(type, handler);
    // And then save it to our ref for next time.
    eventListenerRef.current = handler;
    // When the component finally unmounts, use the ref to remove the correct handler.
    return () => global.removeEventListener(type, eventListenerRef.current);
  }, [type, handler]);
}

export default useEventListener;