// While the stylus writes (and a moment after, see PenRecorder.writing), fingers and the wrist
// press nothing on the page: no buttons, sliders or scrolling. The pen itself still works.
// Listeners on window in the capture phase run before the page's own (Qwik) handlers.
export function guardTouches(isBlocked: () => boolean) {
  let lastType = '';

  // Safari sends the Apple Pencil as touches too, with touchType 'stylus'
  const onTouchStart = (e: TouchEvent) => {
    const finger = [...e.changedTouches].every(
      (t) => (t as Touch & { touchType?: string }).touchType !== 'stylus',
    );
    if (finger && isBlocked() && e.cancelable) e.preventDefault(); // no tap, no scroll
  };
  const onPointerDown = (e: PointerEvent) => {
    lastType = e.pointerType;
    if (e.pointerType === 'touch' && isBlocked()) e.stopPropagation();
  };
  const onClick = (e: MouseEvent) => {
    if (lastType !== 'touch' || !isBlocked()) return;
    e.preventDefault();
    e.stopPropagation();
  };

  window.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
  window.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('click', onClick, true);
  return () => {
    window.removeEventListener('touchstart', onTouchStart, true);
    window.removeEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('click', onClick, true);
  };
}
