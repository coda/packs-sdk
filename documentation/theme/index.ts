// Client-side JavaScript to include in the documentation.
// Compiled using esbuild into docs/assets/bundle.js.

import mediumZoom from 'medium-zoom';

document.addEventListener('DOMContentLoaded', () => {
  // Screenshots used in tutorials that aren't wrapped in anchors.
  mediumZoom('.tutorial-row .screenshot:not(a .screenshot)');
});
