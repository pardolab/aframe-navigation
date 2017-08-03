/* global AFRAME */
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

window.request = require('./node_modules/superagent/lib/superagent');
require('./src/nav-layout.js');
require('./src/nav-panel.js');
require('./src/nav-button.js');
require('./src/nav-breadcrumbs.js');