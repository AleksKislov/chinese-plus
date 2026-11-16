import { component$ } from '@builder.io/qwik';

// 米字格: the square, its middle lines and diagonals; fills its (relative) parent
export const MiGrid = component$(() => (
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    class="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <rect
      x="0.5"
      y="0.5"
      width="99"
      height="99"
      fill="none"
      stroke="#dc2626"
      stroke-width="1.5"
      vector-effect="non-scaling-stroke"
    />
    <g stroke="#f87171" stroke-width="1" stroke-dasharray="6 5" vector-effect="non-scaling-stroke">
      <line x1="50" y1="0" x2="50" y2="100" vector-effect="non-scaling-stroke" />
      <line x1="0" y1="50" x2="100" y2="50" vector-effect="non-scaling-stroke" />
      <line x1="0" y1="0" x2="100" y2="100" vector-effect="non-scaling-stroke" />
      <line x1="100" y1="0" x2="0" y2="100" vector-effect="non-scaling-stroke" />
    </g>
  </svg>
));
