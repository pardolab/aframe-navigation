## aframe-navigation-component

[![Version](http://img.shields.io/npm/v/aframe-navigation-component.svg?style=flat-square)](https://npmjs.org/package/aframe-navigation)
[![License](http://img.shields.io/npm/l/aframe-navigation-component.svg?style=flat-square)](https://npmjs.org/package/aframe-navigation)

Highly Customizable Navigation System

For [A-Frame](https://aframe.io).

### [DEMO](https://pardolab.github.io/aframe-navigation/)
### [API](https://github.com/pardolab/aframe-navigation/wiki/Components)

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-navigation/dist/aframe-navigation.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity nav-layout="navMapUrl:URL_HERE; layoutView:LAYOUT_VIEW_NAME_HERE"></a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .interactive"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-navigation
```

Then require and use.

```js
require('aframe');
require('aframe-navigation');
```
