import { onUnmounted, ref } from 'vue';
import { throttledHandler } from '@/helpers';

/**
 * Returns a reactive x and y position of the mouse.
 * Updates at most every updateDelay ms.
 * Call listen before using it or after a break with stopListen.
 * Call stopListen when you don't need updated values for some time.
 *
 * @param {number} updateDelay The amount of millis to wait before updating the value
 */
export default function useMousePosition(updateDelay = 75) {
  const x = ref(0);
  const y = ref(0);

  const update = throttledHandler(updateDelay, ({ clientX, clientY }) => {
    x.value = clientX;
    y.value = clientY;
  });

  const listen = () => {
    // Remove first so there are never multiple listeners
    window.removeEventListener('mousemove', update);
    window.addEventListener('mousemove', update);
  };

  const stopListen = () => {
    window.removeEventListener('mousemove', update);
  };

  onUnmounted(stopListen);

  return {
    x,
    y,
    listen,
    stopListen,
  };
}
