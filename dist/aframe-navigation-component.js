/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* global AFRAME */
	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	window.request = __webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.superagent = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	/**
	 * Check if `fn` is a function.
	 *
	 * @param {Function} fn
	 * @return {Boolean}
	 * @api private
	 */
	var isObject = require('./is-object');

	function isFunction(fn) {
	  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
	  return tag === '[object Function]';
	}

	module.exports = isFunction;

	},{"./is-object":2}],2:[function(require,module,exports){
	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}

	module.exports = isObject;

	},{}],3:[function(require,module,exports){
	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = require('./is-object');

	/**
	 * Expose `RequestBase`.
	 */

	module.exports = RequestBase;

	/**
	 * Initialize a new `RequestBase`.
	 *
	 * @api public
	 */

	function RequestBase(obj) {
	  if (obj) return mixin(obj);
	}

	/**
	 * Mixin the prototype properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in RequestBase.prototype) {
	    obj[key] = RequestBase.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.clearTimeout = function _clearTimeout(){
	  clearTimeout(this._timer);
	  clearTimeout(this._responseTimeoutTimer);
	  delete this._timer;
	  delete this._responseTimeoutTimer;
	  return this;
	};

	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */

	RequestBase.prototype.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Set format of binary response body.
	 * In browser valid formats are 'blob' and 'arraybuffer',
	 * which return Blob and ArrayBuffer, respectively.
	 *
	 * In Node all values result in Buffer.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */

	RequestBase.prototype.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};

	/**
	 * Set timeouts.
	 *
	 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
	 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
	 *
	 * Value of 0 or false means no timeout.
	 *
	 * @param {Number|Object} ms or {response, read, deadline}
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.timeout = function timeout(options){
	  if (!options || 'object' !== typeof options) {
	    this._timeout = options;
	    this._responseTimeout = 0;
	    return this;
	  }

	  for(var option in options) {
	    switch(option) {
	      case 'deadline':
	        this._timeout = options.deadline;
	        break;
	      case 'response':
	        this._responseTimeout = options.response;
	        break;
	      default:
	        console.warn("Unknown timeout option", option);
	    }
	  }
	  return this;
	};

	/**
	 * Set number of retry attempts on error.
	 *
	 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
	 *
	 * @param {Number} count
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.retry = function retry(count){
	  // Default to 1 if no count passed or true
	  if (arguments.length === 0 || count === true) count = 1;
	  if (count <= 0) count = 0;
	  this._maxRetries = count;
	  this._retries = 0;
	  return this;
	};

	/**
	 * Retry request
	 *
	 * @return {Request} for chaining
	 * @api private
	 */

	RequestBase.prototype._retry = function() {
	  this.clearTimeout();

	  // node
	  if (this.req) {
	    this.req = null;
	    this.req = this.request();
	  }

	  this._aborted = false;
	  this.timedout = false;

	  return this._end();
	};

	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} [reject]
	 * @return {Request}
	 */

	RequestBase.prototype.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    if (this._endCalled) {
	      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
	    }
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}

	RequestBase.prototype.catch = function(cb) {
	  return this.then(undefined, cb);
	};

	/**
	 * Allow for extension
	 */

	RequestBase.prototype.use = function use(fn) {
	  fn(this);
	  return this;
	}

	RequestBase.prototype.ok = function(cb) {
	  if ('function' !== typeof cb) throw Error("Callback required");
	  this._okCallback = cb;
	  return this;
	};

	RequestBase.prototype._isResponseOK = function(res) {
	  if (!res) {
	    return false;
	  }

	  if (this._okCallback) {
	    return this._okCallback(res);
	  }

	  return res.status >= 200 && res.status < 300;
	};


	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	RequestBase.prototype.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	RequestBase.prototype.getHeader = RequestBase.prototype.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	RequestBase.prototype.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	RequestBase.prototype.field = function(name, val) {

	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }

	  if (this._data) {
	    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
	  }

	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }

	  if (Array.isArray(val)) {
	    for (var i in val) {
	      this.field(name, val[i]);
	    }
	    return this;
	  }

	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  if ('boolean' === typeof val) {
	    val = '' + val;
	  }
	  this._getFormData().append(name, val);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	RequestBase.prototype.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	RequestBase.prototype.withCredentials = function(on){
	  // This is browser-only functionality. Node side is no-op.
	  if(on==undefined) on = true;
	  this._withCredentials = on;
	  return this;
	};

	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};

	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */

	RequestBase.prototype.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};


	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.send = function(data){
	  var isObj = isObject(data);
	  var type = this._header['content-type'];

	  if (this._formData) {
	    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
	  }

	  if (isObj && !this._data) {
	    if (Array.isArray(data)) {
	      this._data = [];
	    } else if (!this._isHost(data)) {
	      this._data = {};
	    }
	  } else if (data && this._data && this._isHost(this._data)) {
	    throw Error("Can't merge these send calls");
	  }

	  // merge
	  if (isObj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!isObj || this._isHost(data)) {
	    return this;
	  }

	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


	/**
	 * Sort `querystring` by the sort function
	 *
	 *
	 * Examples:
	 *
	 *       // default order
	 *       request.get('/user')
	 *         .query('name=Nick')
	 *         .query('search=Manny')
	 *         .sortQuery()
	 *         .end(callback)
	 *
	 *       // customized sort function
	 *       request.get('/user')
	 *         .query('name=Nick')
	 *         .query('search=Manny')
	 *         .sortQuery(function(a, b){
	 *           return a.length - b.length;
	 *         })
	 *         .end(callback)
	 *
	 *
	 * @param {Function} sort
	 * @return {Request} for chaining
	 * @api public
	 */

	RequestBase.prototype.sortQuery = function(sort) {
	  // _sort default to true but otherwise can be a function or boolean
	  this._sort = typeof sort === 'undefined' ? true : sort;
	  return this;
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	RequestBase.prototype._timeoutError = function(reason, timeout, errno){
	  if (this._aborted) {
	    return;
	  }
	  var err = new Error(reason + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  err.code = 'ECONNABORTED';
	  err.errno = errno;
	  this.timedout = true;
	  this.abort();
	  this.callback(err);
	};

	RequestBase.prototype._setTimeouts = function() {
	  var self = this;

	  // deadline
	  if (this._timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
	    }, this._timeout);
	  }
	  // response timeout
	  if (this._responseTimeout && !this._responseTimeoutTimer) {
	    this._responseTimeoutTimer = setTimeout(function(){
	      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
	    }, this._responseTimeout);
	  }
	}

	},{"./is-object":2}],4:[function(require,module,exports){

	/**
	 * Module dependencies.
	 */

	var utils = require('./utils');

	/**
	 * Expose `ResponseBase`.
	 */

	module.exports = ResponseBase;

	/**
	 * Initialize a new `ResponseBase`.
	 *
	 * @api public
	 */

	function ResponseBase(obj) {
	  if (obj) return mixin(obj);
	}

	/**
	 * Mixin the prototype properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in ResponseBase.prototype) {
	    obj[key] = ResponseBase.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	ResponseBase.prototype.get = function(field){
	    return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	ResponseBase.prototype._setHeaderProperties = function(header){
	    // TODO: moar!
	    // TODO: make this a util

	    // content-type
	    var ct = header['content-type'] || '';
	    this.type = utils.type(ct);

	    // params
	    var params = utils.params(ct);
	    for (var key in params) this[key] = params[key];

	    this.links = {};

	    // links
	    try {
	        if (header.link) {
	            this.links = utils.parseLinks(header.link);
	        }
	    } catch (err) {
	        // ignore
	    }
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	ResponseBase.prototype._setStatusProperties = function(status){
	    var type = status / 100 | 0;

	    // status / class
	    this.status = this.statusCode = status;
	    this.statusType = type;

	    // basics
	    this.info = 1 == type;
	    this.ok = 2 == type;
	    this.redirect = 3 == type;
	    this.clientError = 4 == type;
	    this.serverError = 5 == type;
	    this.error = (4 == type || 5 == type)
	        ? this.toError()
	        : false;

	    // sugar
	    this.accepted = 202 == status;
	    this.noContent = 204 == status;
	    this.badRequest = 400 == status;
	    this.unauthorized = 401 == status;
	    this.notAcceptable = 406 == status;
	    this.forbidden = 403 == status;
	    this.notFound = 404 == status;
	};

	},{"./utils":6}],5:[function(require,module,exports){
	var ERROR_CODES = [
	  'ECONNRESET',
	  'ETIMEDOUT',
	  'EADDRINFO',
	  'ESOCKETTIMEDOUT'
	];

	/**
	 * Determine if a request should be retried.
	 * (Borrowed from segmentio/superagent-retry)
	 *
	 * @param {Error} err
	 * @param {Response} [res]
	 * @returns {Boolean}
	 */
	module.exports = function shouldRetry(err, res) {
	  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
	  if (res && res.status && res.status >= 500) return true;
	  // Superagent timeout
	  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
	  if (err && 'crossDomain' in err) return true;
	  return false;
	};

	},{}],6:[function(require,module,exports){

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	exports.type = function(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	exports.params = function(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */);
	    var key = parts.shift();
	    var val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Parse Link header fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	exports.parseLinks = function(str){
	  return str.split(/ *, */).reduce(function(obj, str){
	    var parts = str.split(/ *; */);
	    var url = parts[0].slice(1, -1);
	    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
	    obj[rel] = url;
	    return obj;
	  }, {});
	};

	/**
	 * Strip content related fields from `header`.
	 *
	 * @param {Object} header
	 * @return {Object} header
	 * @api private
	 */

	exports.cleanHeader = function(header, shouldStripCookie){
	  delete header['content-type'];
	  delete header['content-length'];
	  delete header['transfer-encoding'];
	  delete header['host'];
	  if (shouldStripCookie) {
	    delete header['cookie'];
	  }
	  return header;
	};
	},{}],7:[function(require,module,exports){

	/**
	 * Expose `Emitter`.
	 */

	if (typeof module !== 'undefined') {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};

	},{}],8:[function(require,module,exports){
	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}

	var Emitter = require('component-emitter');
	var RequestBase = require('./request-base');
	var isObject = require('./is-object');
	var isFunction = require('./is-function');
	var ResponseBase = require('./response-base');
	var shouldRetry = require('./should-retry');

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Expose `request`.
	 */

	var request = exports = module.exports = function(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new exports.Request('GET', method).end(url);
	  }

	  // url first
	  if (1 == arguments.length) {
	    return new exports.Request('GET', method);
	  }

	  return new exports.Request(method, url);
	}

	exports.Request = Request;

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req) {
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  var status = this.xhr.status;
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	      status = 204;
	  }
	  this._setStatusProperties(status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);

	  if (null === this.text && req._responseType) {
	    this.body = this.xhr.response;
	  } else {
	    this.body = this.req.method != 'HEAD'
	      ? this._parseBody(this.text ? this.text : this.xhr.response)
	      : null;
	  }
	}

	ResponseBase(Response.prototype);

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if(this.req._parser) {
	    return this.req._parser(this, str);
	  }
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      if (self.xhr) {
	        // ie9 doesn't have 'response' property
	        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
	        // issue #876: return the http status code if the response parsing fails
	        err.status = self.xhr.status ? self.xhr.status : null;
	        err.statusCode = err.status; // backwards-compat only
	      } else {
	        err.rawResponse = null;
	        err.status = null;
	      }

	      return self.callback(err);
	    }

	    self.emit('response', res);

	    var new_err;
	    try {
	      if (!self._isResponseOK(res)) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }

	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}

	/**
	 * Mixin `Emitter` and `RequestBase`.
	 */

	Emitter(Request.prototype);
	RequestBase(Request.prototype);

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} [pass] optional in case of using 'bearer' as type
	 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
	    options = pass;
	  }
	  if (!options) {
	    options = {
	      type: 'function' === typeof btoa ? 'basic' : 'auto',
	    }
	  }

	  switch (options.type) {
	    case 'basic':
	      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
	    break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	      
	    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
	      this.set('Authorization', 'Bearer ' + user);
	    break;  
	  }
	  return this;
	};

	/**
	 * Add query-string `val`.
	 *
	 * Examples:
	 *
	 *   request.get('/shoes')
	 *     .query('size=10')
	 *     .query({ color: 'blue' })
	 *
	 * @param {Object|String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `options` (or filename).
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String|Object} options
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, options){
	  if (file) {
	    if (this._data) {
	      throw Error("superagent can't mix .send() and .attach()");
	    }

	    this._getFormData().append(field, file, options || file.name);
	  }
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  // console.log(this._retries, this._maxRetries)
	  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
	    return this._retry();
	  }

	  var fn = this._callback;
	  this.clearTimeout();

	  if (err) {
	    if (this._maxRetries) err.retries = this._retries - 1;
	    this.emit('error', err);
	  }

	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	// This only warns, because the request is still likely to work
	Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
	  console.warn("This is not supported in browser version of superagent");
	  return this;
	};

	// This throws, because it can't send/receive data as expected
	Request.prototype.pipe = Request.prototype.write = function(){
	  throw Error("Streaming is not supported in browser version of superagent");
	};

	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */

	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
	  }

	  if (this._sort) {
	    var index = this.url.indexOf('?');
	    if (index >= 0) {
	      var queryArr = this.url.substring(index + 1).split('&');
	      if (isFunction(this._sort)) {
	        queryArr.sort(this._sort);
	      } else {
	        queryArr.sort();
	      }
	      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
	    }
	  }
	};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */
	Request.prototype._isHost = function _isHost(obj) {
	  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
	  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
	}

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  if (this._endCalled) {
	    console.warn("Warning: .end() was called twice. This is not supported in superagent");
	  }
	  this._endCalled = true;

	  // store callback
	  this._callback = fn || noop;

	  // querystring
	  this._appendQueryString();

	  return this._end();
	};

	Request.prototype._end = function() {
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var data = this._formData || this._data;

	  this._setTimeouts();

	  // state change
	  xhr.onreadystatechange = function(){
	    var readyState = xhr.readyState;
	    if (readyState >= 2 && self._responseTimeoutTimer) {
	      clearTimeout(self._responseTimeoutTimer);
	    }
	    if (4 != readyState) {
	      return;
	    }

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (!status) {
	      if (self.timedout || self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }

	  // initiate request
	  try {
	    if (this.username && this.password) {
	      xhr.open(this.method, this.url, true, this.username, this.password);
	    } else {
	      xhr.open(this.method, this.url, true);
	    }
	  } catch (err) {
	    // see #1149
	    return this.callback(err);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) {
	      serialize = request.serialize['application/json'];
	    }
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;

	    if (this.header.hasOwnProperty(field))
	      xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	function del(url, data, fn){
	  var req = request('DELETE', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	},{"./is-function":1,"./is-object":2,"./request-base":3,"./response-base":4,"./should-retry":5,"component-emitter":7}]},{},[8])(8)
	});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = AFRAME.registerComponent('nav-layout', {
	  multiple: true,
	  schema: {
	    opacity: {type: "number", default: 0.8},
	    hoverOpacity: {type: "number", default: 0.3},
	    color: {type: "color", default: "#010101"},
	    edgeColor: {type: "color", default: "#010101"},
	    textColor: {type: "color", default: "#fefefe"},
	    label: {type: "string", default: "Menu"},
	    distanceAway: {type: "number", default: 5},      // Distance away from user in meters
	    layoutView: {type: "string", default: ''},
	    navMapUrl: {type: 'string', default: ''},
	    cameraEl: {type: 'selector', default: ''},
	    name: {type: "string", default: "default"}
	  },
	  init: function () {

	    this.currentlayoutView = this.data.layoutView;
	    this.viewMap = undefined;
	    this.staticHtml = "";
	    let viewMapRequest = this.getViewMap();
	    this.id = this.el.getAttribute('id');
	    

	    viewMapRequest.end((err, res) => {
	      if (err) {console.error('No view map found', err); return}
	      
	      this.viewMap = res.body;
	      this.getNavHtml('static-nav', (html) => {
	        this.staticHtml = html;
	        this.goToView(this.currentlayoutView);
	      })     
	    });

	    // Allows for immediate opening of nav
	    // setTimeout(() => {
	    //   console.log(this.viewMap);
	    // }, 1000);
	    

	    this.cameraQuat = new THREE.Quaternion();
	    this.cameraAngles = new THREE.Euler();

	    // SET Camera direction vector
	    this.cameraDir = new THREE.Vector3();     // Camera direction
	    this.cameraPos = new THREE.Vector3();     // Camera direction
	    this.newMenuPos = new THREE.Vector3();    // New menu position
	    this.newMenuRot = new THREE.Vector3();    // New menu rotation

	    
	// Position
	    this.setPosition();

	// Style event listeners

	    const EVENTS = {
	      onenter: (e) => {          // When raycaster is on button
	        console.log("Layout onEnter");
	      },
	      onactivate: (e) => {       // When raycaster is clicked on the button
	        console.log("Layout onActivate");
	      },
	      onrelease: (e) => {        // When raycaster releases the click
	        console.log("Layout onRelease");
	      },
	      onleave: (e) => {          // When raycaster leaves button
	        console.log("Layout onLeave");
	      },
	    }

	    this.el.emit('onready', {
	      id: this.id,
	      name: this.data.name,
	      data: this.data,
	      target: this.el
	    });

	  },
	  update: function (oldData) {
	    //console.log('Setting new data', this.data);
	    //uiPanelGroupData.setData(this.data);
	    // On change reset view
	    if (oldData.layoutView !== this.data.layoutView) {
	      this.currentlayoutView = this.data.layoutView;
	      this.goToView(this.currentlayoutView);
	    }
	  },
	  tick: function () {},
	  remove: function () {
	    this.el.removeObject3D('plane');
	    this.el.removeObject3D('highlighter', this.meshHighlighter);
	  },
	  pause: function () {},
	  play: function () {},

	  // Sets the nav position 
	  setPosition: function() {
	    if (this.data.cameraEl == undefined) {
	      // Set position at {x:0, y:0, z:0}
	      this.el.setAttribute('position', `0 0.8 -2`);
	      this.el.setAttribute('rotation', `0 0 0`);
	      return '';
	    } else {
	      let cameraPos = this.data.cameraEl.getAttribute('position');
	      let camera = this.data.cameraEl.getObject3D('camera');

	      let theta = Math.atan2(this.cameraDir.x, this.cameraDir.z);  // Get Theta for XZ Plane

	      this.newMenuPos.x = (this.data.distanceAway * Math.sin(theta)) + cameraPos.x - 4;
	      this.newMenuPos.z = (this.data.distanceAway * Math.cos(theta)) + cameraPos.z + 3.8;
	      this.newMenuPos.y = cameraPos.y + 0.3;

	      let degrees = (theta * 180/Math.PI) + 180;
	      this.newMenuRot.y = degrees; // y rotation

	      this.el.setAttribute('position', `${this.newMenuPos.x} ${this.newMenuPos.y} ${this.newMenuPos.z}`);
	      this.el.setAttribute('rotation', `0 ${this.newMenuRot.y} 0`);
	    }
	    
	  },

	  // Saves the positions of all panels
	  saveNavLayout: function() {

	  },

	  // A nav setup
	  goToView: function(view) {

	    this.getNavHtml(view, (html) => {
	      if (html === "") {
	        console.log('View Change Failed');
	        this.el.innerHTML = this.staticHtml;
	        return;
	      }

	      this.el.innerHTML = (this.staticHtml + html);
	      this.currentlayoutView = view;
	    });
	    
	  },

	  /**
	   * Returns the view map as a javascript object
	   */
	  getViewMap() {
	    return request.get(this.data.navMapUrl)
	      .set('Accept', 'application/json');
	  },

	  getNavHtml(viewName, callback) {
	    if (!this.viewMap) {
	      console.warn('View Map Undefined');
	      callback('');
	    }
	    try {
	      let viewDir = this.viewMap.layoutViews[viewName];
	      if (!viewDir) {
	        console.warn('View Directory Undefined');
	        callback('');
	        return;
	      }

	      let url = this.viewMap.baseDir + viewDir;
	      request.get(url)
	      .end((err, res) => {
	        if (res.status >= 400) {
	          console.warn('Status', res.status, res);
	          callback('');
	          return;
	        } else {
	          callback(res.text);
	          return;
	        }
	      });

	    } catch(e) {
	      console.log(e);
	      callback('');
	      return;
	    }
	  }

	});


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	//let ColorHelper = require('/helper/ColorHelper');

	module.exports = AFRAME.registerComponent('nav-panel', {
	  multiple: true,
	  schema: {
	    width: {type: "number", default: 3.0},
	    height: {type: "number", default: 1.3},
	    opacity: {type: "number", default: 0.8},
	    borderOpacity: {type: "number", default: 0.3},
	    color: {type: "color", default: "#010101"},
	    borderColor: {type: "color", default: "#55eeFF"},
	    textColor: {type: "color", default: "#fefefe"},
	    label: {type: "string", default: "Panel"},
	    name: {type: "string", default: "default"},
	    panel: {type: "string", default: "default"},
	    active: {type: "boolean", default: "true"},         // This is changed by child components to toggle click events on this panel
	    hoverState: {type: "boolean", default: "false"}     // This hover state for this panel
	  },
	  init: function () {

	    // Get parent nav map url
	    this.navMapUrl = this.el.parentEl.components['nav-layout'].data.navMapUrl;
	    this.id = this.el.getAttribute('id');

	// Set View
	    this.currentPanel = this.data.panel;
	    this.viewMap = undefined;
	    let viewMapRequest = this.getViewMap();
	    viewMapRequest.end((err, res) => {
	      if (err) {console.error('No view map found', err); return}
	      
	      this.viewMap = res.body;
	      this.goToPanel(this.currentPanel);
	    });

	// SET VAR     
	     
	    this.initPos = (new THREE.Vector3()).copy(this.el.getAttribute('position'));
	    //this.id = uuidv4();
	    this.tickIndex = 0;
	    this.dragEnable = false;
	    this.ctrlInitPos = new THREE.Vector3();
	    this.panelInitPos = new THREE.Vector3();
	    this.deltaPos = new THREE.Vector3();
	    this.updatedPos = new THREE.Vector3();

	    this.PUSH_BACK_DISTANCE = -0.02;

	    this.initIntersectionPos = new THREE.Vector3();
	    this.ctrlAngle = new THREE.Vector3();

	    const BUTTON_SEGMENTS = 30;
	    const DEPTH = 0.001;
	    const borderSize = 0.3;
	    const borderDepthOffset = DEPTH + 0.005;

	    // Colors
	    this.color = new THREE.Color(this.data.color);
	    this.borderColor = new THREE.Color(this.data.borderColor);
	    this.textColor = new THREE.Color(this.data.textColor);

	    
	    // All of the controllerElements - Map
	    this.controllerElements = new Map();
	    this.controllerElements.set('ctrlRight', document.getElementById('ctrlRight'));
	    this.controllerElements.set('ctrlLeft', document.getElementById('ctrlLeft'));


	    // Set To be Interactive; Able to be detected by the raycaster/controller
	    this.el.setAttribute('class', 'interactive');

	// SET LAYOUT



	    this.geometry = new THREE.BoxBufferGeometry(this.data.width, this.data.height, DEPTH, BUTTON_SEGMENTS);
	    // Border
	    this.borderGeo = new THREE.EdgesGeometry( this.geometry );


	    // Background Material
	    this.material = new THREE.MeshBasicMaterial({
	      color: `#${this.color.getHexString()}`,
	      side: 'double'
	      }
	    );

	    this.material.transparent = true;
	    this.material.opacity = this.data.opacity;

	    // Border Material
	    this.borderMaterial = new THREE.LineBasicMaterial({
	        color: `#${this.borderColor.getHexString()}`,
	        side: 'double'
	      }
	    );

	    this.borderMaterial.transparent = true;
	    this.borderMaterial.opacity = this.data.borderOpacity;


	    // Create mesh.
	    this.mesh = new THREE.Mesh(this.geometry, this.material);
	    this.borderMesh = new THREE.LineSegments( this.borderGeo, this.borderMaterial);

	    this.el.setObject3D('plane', this.mesh);

	    
	// Text
	    this.textEl = document.createElement('a-text');
	    this.textEl.setAttribute('value', this.data.label);
	    this.textEl.setAttribute('position', `${this.data.width/-2 - 0.04} ${this.data.height/2 + 0.1} ${DEPTH}`);
	    this.textEl.setAttribute('align', 'left');

	// All Text

	    //this.dimText();

	// Style event listeners

	    this.data.EVENTS = {
	      onenter: (e) => {          // When raycaster is on button

	        if (!this.el.is('hover')) {
	          // Cursor True
	          this.el.addState('hover')
	          console.log("onEnter");

	          console.log("Panel onEnter");
	          this.el.setObject3D('border', this.borderMesh);

	          this.el.setAttribute('position', {
	            x: this.initPos.x,
	            y: this.initPos.y,
	            z: this.initPos.z + this.PUSH_BACK_DISTANCE
	          });

	          this.el.emit('onenter', {
	            id: this.id,
	            name: this.data.name,
	            data: this.data,
	            target: this.el,
	            event: e
	          });
	          //if (this.textEl) {this.el.appendChild(this.textEl)}
	          //this.unDimText();
	        }

	      },

	      // When raycaster is clicked on the button
	      onactivate: (e) => {
	        if (this.el.is('hover') && !this.el.is('active')) {
	          this.el.addState('active');

	          this.el.emit('onactivate', {
	            id: this.id,
	            name: this.data.name,
	            data: this.data,
	            target: this.el,
	            event: e
	          });

	          let childHovering = this.isHoverOnChild();
	          if (childHovering === undefined) {
	            console.log("Panel onActivate");
	            console.log('hover on children: ', false);
	            
	          } else {
	            this.emitOnChild(childHovering, 'mousedown', e);
	          }
	        }
	      },

	      // When raycaster releases the click
	      onrelease: (e) => {
	        if (this.el.is('hover') && this.el.is('active')) {
	          console.log("Panel onRelease");
	          this.el.removeState('active');

	          this.el.emit('onrelease', {
	            id: this.id,
	            name: this.data.name,
	            data: this.data,
	            target: this.el,
	            event: e
	          });

	          // Child Hover
	          let childHovering = this.isHoverOnChild();
	          if (childHovering) {
	            this.emitOnChild(childHovering, 'mouseup', e);
	          }
	        }
	      },

	      // When raycaster leaves button
	      onleave: (e) => {          

	        if (this.el.is('hover')) {
	          console.log("Panel onLeave");

	          this.el.emit('onleave', {
	            id: this.id,
	            name: this.data.name,
	            data: this.data,
	            target: this.el,
	            event: e
	          });

	          try {
	            this.el.removeObject3D('border', this.borderMesh);
	            this.el.setAttribute('position', this.initPos);
	          } catch(e) {
	            console.error(e);
	          }

	          
	          // Shrink Border
	          if (this.el.is('active')) {this.el.removeState('active')};
	          this.el.removeState('hover');
	          //this.dimText();
	        }
	        
	      },
	    }

	    this.addAllEventListeners();

	    // Send ready event
	    this.el.emit('onready', {
	      id: this.id,
	      name: this.data.name,
	      data: this.data,
	      target: this.el
	    });
	  },
	  update: function (oldData) {

	  },
	  tick: function () {},
	  remove: function () {
	    this.el.removeObject3D('plane');
	    this.el.removeObject3D('border');
	    this.removeAllEventListeners();
	  },
	  pause: function () {},
	  play: function () {},
	  
	  addAllEventListeners: function() {
	    // Setup Controller Callbacks

	    this.el.addEventListener('mouseup', this.data.EVENTS.onrelease.bind(this));
	    this.el.addEventListener('mousedown', this.data.EVENTS.onactivate.bind(this));
	    this.el.addEventListener("raycaster-intersected", this.data.EVENTS.onenter.bind(this));
	    this.el.addEventListener("raycaster-intersected-cleared", this.data.EVENTS.onleave.bind(this));
	  },

	  removeAllEventListeners: function() {
	    // Setup Controller Callbacks

	    this.el.removeEventListener('mouseup', this.data.EVENTS.onrelease.bind(this));
	    this.el.removeEventListener('mousedown', this.data.EVENTS.onactivate.bind(this));
	    this.el.removeEventListener("raycaster-intersected", this.data.EVENTS.onenter.bind(this));
	    this.el.removeEventListener("raycaster-intersected-cleared", this.data.EVENTS.onleave.bind(this));
	  },

	  // Moves this panel in the same x,y,z as the controller
	  // Moves the panel around the controller in the shape of a sphere when turing.
	  /**
	   * @param ctrl - Controller element
	   */
	  controllerDrag: function(ctrl) {
	    //console.log(ctrl);
	    this.deltaPos.copy(this.ctrlInitPos);
	    this.deltaPos.sub(ctrl.getAttribute('position'));

	    //let panelPos = this.el.getAttribute('position');

	    this.updatedPos.copy(this.panelInitPos);
	    this.updatedPos.sub(this.deltaPos);

	    this.el.setAttribute('position', `${this.updatedPos.x} ${this.updatedPos.y} ${this.updatedPos.z}`)
	    //this.


	    //console.log("Position: ", rightHand.getAttribute('position'));

	    // Limit the Console log only every half a second
	    if (this.tickIndex <= 40) {
	      console.log('Position: ', this.deltaPos);
	      this.tickIndex = 0;
	    }

	    this.tickIndex ++;
	  },
	  initControllerDrag: function(ctrl) { 
	    let posCtrl = ctrl.getAttribute('position');
	    let posPanel = this.el.getAttribute('position');
	    if (posCtrl && posPanel) {
	      this.ctrlInitPos.copy(posCtrl);
	      this.panelInitPos.copy(posPanel);

	      let angle = this.ctrlInitPos.angleTo(this.initIntersectionPos);

	      console.log('ctrl Init Pos', this.ctrlInitPos);
	      console.log('intersection init Pos', this.initIntersectionPos);

	      console.log('ctrl Angle: ', angle);
	      //console.log("init ", this.ctrlInitPos);
	      this.dragEnable = true;
	    }
	  },
	  endControllerDrag: function () {
	    this.dragEnable = false;
	  },
	  /**
	   * @return child object node - Returns object of a child element 
	   * of this panel if any has the state "hover". Else returns undefined
	   */
	  isHoverOnChild: function () {
	    let children = [...this.el.childNodes];
	    let childHovering = undefined;

	    children.forEach((child) => {
	      let valid = child && child.is;
	      if (valid) {
	        if (child.is('hover')) {childHovering = child}
	      }
	    });

	    return childHovering;
	  },
	  /**
	   * Dims all text children elements color 
	   */
	  // TODO find way to reference ColorHelper class
	  // dimText() {
	  //   let textEls = [...this.el.children];
	  //   textEls.forEach((el) => {
	  //     if (el.nodeName == 'A-TEXT') {
	  //       let dimColor = colorHelper.dim(`#${this.textColor.getHexString()}`, 3);
	  //       el.setAttribute('color', dimColor);
	  //     }
	  //   });
	  // },
	  // /**
	  //  * Un dims all text children elements color 
	  //  */
	  // unDimText() {
	  //   let textEls = [...this.el.children];
	  //   textEls.forEach((el) => {
	  //     if (el.nodeName == 'A-TEXT') {
	  //       el.setAttribute('color', `#${this.textColor.getHexString()}`);
	  //     }
	  //   });
	  // },
	  /**
	   * Emits the event on a child
	   * @param {ChildNode} child
	   * @param {String} eventName - The event name ex: mousedown
	   * @param {Event} e 
	   */
	  emitOnChild(child, eventName, e) {
	    let event = new MouseEvent(eventName, e);
	    child.dispatchEvent(event);
	  },

	  /**
	   * If UIBreadCrumbs exist. Find it and set the width and height, and any initial breadcrumbs.
	   * This will stop creating breadcrumbs when it find the currentPanelName
	   * @param currentPanelName - The current panel name.
	   * 
	   */
	  initUIBreadCrumbs(currentPanelName, options = {}) {
	    console.log('compoenets before', this.el.components);
	    let breadcrumbs = this.el.components['nav-breadcrumbs'];

	    // If breadcrumbs have crumbs -> Add them


	    if (breadcrumbs != undefined) {
	      breadcrumbs.data.width = this.data.width;
	      breadcrumbs.data.height = this.data.height / 2;
	      // If existing bread crumbs. Add them up to the current one being added.
	        let tempCrumbs = breadcrumbs.crumbs;
	        let indexReached = -1;
	        breadcrumbs.resetBreadcrumbs();

	          for(let i=0; i<tempCrumbs.length; i++) {
	            breadcrumbs.addBreadCrumb(tempCrumbs[i].label, tempCrumbs[i].panelName);
	            if (tempCrumbs[i].panelName === currentPanelName) {return};
	            indexReached = i;
	            // Add new breadcrumb if current panel isn't already one
	            
	          };

	          if (indexReached === tempCrumbs.length-1 || tempCrumbs.length === 0) {
	            if (options.panelName) {breadcrumbs.addBreadCrumb(options.panelName, currentPanelName)}
	            else {breadcrumbs.addBreadCrumb(currentPanelName, currentPanelName)}
	          }
	    } else {
	      console.warn('breadcrumbs not defined on panel', this.el);
	    }
	  },

	  /**
	   * @param panel - Actual name of panel found in panel.js
	   * @param options - Options for goToPanel and UIBreadCrumbs
	   * {
	   *   panelName: {String} Custom name of the panel. Kinda like a hyperlink.
	   * 
	   * }
	   */
	  goToPanel: function(panel, options) {

	    this.getPanelHtml(panel, (html) => {
	      if (html === "") {
	        console.log('Panel Change Failed');
	        return;
	      }

	      this.el.innerHTML = html;
	      this.initUIBreadCrumbs(panel, options);
	    });
	    
	  },

	  /**
	   * Returns the view map as a javascript object
	   */
	  getViewMap() {
	    //console.log('NavURL', this.navMapUrl);
	    return request.get(this.navMapUrl)
	      .set('Accept', 'application/json');
	  },

	  getPanelHtml(panelName, callback) {
	    if (!this.viewMap) {
	      console.warn('View Map Undefined');
	      callback('');
	      return;
	    }
	    try {
	      let viewDir = this.viewMap.panelViews[panelName];
	      if (!viewDir) {
	        console.warn('Access Failed to panel name: ', panelName, 'on element', this.el);
	        callback('');
	        return;
	      }

	      let url = this.viewMap.baseDir + viewDir;
	      request.get(url)
	      .end((err, res) => {
	        if (res.status >= 400) {
	          console.warn('Status', res.status, res);
	          callback('');
	          return;
	        } else {
	          callback(res.text);
	          return;
	        }
	      });
	      
	    } catch(e) {
	      console.log(e);
	      callback('');
	      return;
	    }
	  }
	});


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	




	module.exports = AFRAME.registerComponent('nav-button', {

	  multiple: true, 
	  schema: {
	    radius: {type: "number", default: 0.0},
	    width: {type: "number", default: 0.0},
	    height:{type: "number", default: 0.0},
	    shape: {type: "string", default: 'square'},         // Can be square or circle
	    opacity: {type: "number", default: 0.8},
	    color: {type: "color", default: "#25daf9"},
	    hoverColor: {type: "color", default: "#8affff"},
	    borderColor: {type: "color", default: "#fefefe"},   // Color of border
	    textColor: {type: "color", default: "#010101"},
	    textAlign: {type: 'string', default: 'center'},     // left, right, center
	    textOnHover: {type: 'boolean', default: 'false'},
	    textOffset: {type: 'number', default: '0'},
	    label: {type: "string", default: ""},
	    image: {type: "string", default: ""},
	    textWidth: {type: "number", default: 4},
	    textHeight: {type: "number", default: 4},
	    textLineHeight: {type: "number", default: 0},
	    name: {type: "string", default: "default"},
	    mixinObj: {type: 'string', default: "none"},
	    toolName: {type: 'string', default: ''},
	    link: {type: "string", default: ""},
	    linkName: {type: "string", default: ""},
	    rayClass: {type: "string", default: "interactive"}
	    // mesh: undefined
	  },
	  init: function () {

	    //As of AirBnB suggestion: https://github.com/airbnb/javascript#objects--prototype-builtins
	      //This caches the general Object, so that's why it's a constant and not 'this';
	      const has = Object.prototype.hasOwnProperty;
	      this.id = this.el.getAttribute('id');

	// Definitions
	    this.BUTTON_SEGMENTS = 30;
	    this.dragOffButton = false;
	    this.BORDER_OFFSET = this.data.radius + 0.02;
	    this.BORDER_OPACITY = 1;
	    this.DEPTH = 0.001;
	    this.currentPos = this.el.getAttribute('position');
	    this.hDistance = (this.data.width) ? this.data.width : this.data.radius;   // Horizontal Distance
	    this.vDistance = (this.data.height) ? this.data.height : this.data.radius;   // Vertical Distance

	    this.color = new THREE.Color(this.data.color);
	    this.hoverColor = new THREE.Color(this.data.hoverColor);
	    this.borderColor = new THREE.Color(this.data.borderColor);
	    this.textColor = new THREE.Color(this.data.textColor);

	    // All of the controllerElements - Map
	    this.controllerElements = new Map();
	    this.controllerElements.set('ctrl', document.querySelector('[laser-controls]'));

	    // Set To be Interactive; Able to be detected by the raycaster/controller
	    this.el.setAttribute('class', this.data.rayClass);
	    
	    // TODO: Only uses objectPlacement when tool is available
	    // if (this.data.toolName.length > 0) 
	    //   this.listenForObjectPlacement();

	    // Set Position
	    if (this.currentPos) {
	      let x = (this.currentPos.x) ? this.currentPos.x : 0,
	          y = (this.currentPos.y) ? this.currentPos.y : 0,
	          z = (this.currentPos.z) ? this.currentPos.z : 0;
	      this.el.setAttribute('position', `${x} ${y} ${z + this.DEPTH}`);
	    } else {
	      this.el.setAttribute('position', `0 0 ${this.DEPTH}`);
	    }
	    

	    this.EVENTS = {
	      onenter: (e) => {          // When raycaster is on button

	          if (!this.el.is('hover')) {
	            this.el.addState('hover');
	            // Border
	            this.el.setObject3D('border', this.borderMesh);

	            this.el.emit('onenter', {
	              id: this.id,
	              name: this.data.name,
	              data: this.data,
	              target: this.el,
	              event: e
	            });
	            console.log('button hovering');

	            if (this.data.textOnHover) {
	              this.el.appendChild(this.textEl);
	            }
	          }
	      },
	      onactivate: (e) => {

	          if (this.el.is('hover') && !this.el.is('active')) {
	            this.el.addState('active');

	            // Todo: Color Change
	            console.log('Hover Color', this.hoverColor.getHex())
	            this.mesh.material.color.set(this.hoverColor);

	            // Button Events
	            this.el.emit('onactivate', {
	              id: this.id,
	              name: this.data.name,
	              data: this.data,
	              target: this.el,
	              event: e
	            });
	            console.log('button active');
	          }
	      },
	      onrelease: (e) => {        // When raycaster releases the click

	        if (!this.el.is('hover') && this.el.is('active')) return;

	        // Todo: Color Change
	        this.mesh.material.color.set(this.color);

	        if (this.el.is('active')) {
	          this.mapToControllers();
	        }
	        this.el.removeState('active');

	        this.el.emit('onrelease', {
	          id: this.id,
	          name: this.data.name,
	          data: this.data,
	          target: this.el,
	          event: e
	        });
	        console.log('button release');
	        
	      },
	        // When raycaster leaves button
	      onleave: (e) => {

	        // in case the use leaves the button without releasing
	        if (!this.el.is('hover')) return;

	        try {
	          this.el.removeObject3D('border');
	        } catch (e) {}

	        // Text only appears when hovering, if the value is true
	        if (this.data.textOnHover) {
	            this.el.removeChild(this.textEl);
	        }

	        if (this.el.is('active')) {
	          // Todo: Color Change
	          this.mesh.material.color.set(this.color);
	          // Cursor Off
	          this.el.removeState('active')
	        };

	        this.el.removeState('hover');
	        this.el.emit('onleave', {
	          id: this.id,
	          name: this.data.name,
	          data: this.data,
	          target: this.el,
	          event: e
	        });
	        console.log('button leave');
	      }
	    }

	      // Create Shape
	      switch (this.data.shape) {
	        case "circle":
	          this.createCircle();
	          break;
	        case "square":
	          this.createRect();
	          break;
	      }


	    // Button Text Component
	    this.textEl = document.createElement('a-text');
	    
	    let textValue = "";
	    if (this.data.label !== "") {

	    } else {

	    }
	    this.textEl.setAttribute("value", this.data.label);
	    this.textEl.setAttribute("color", this.textColor.getHex());
	    this.textEl.setAttribute("width", this.data.textWidth);
	    this.textEl.setAttribute("height", this.data.textHeight);
	    
	    if (this.data.lineHeight !== 0) {
	      this.textEl.setAttribute("lineHeight", this.data.lineHeight);
	    }

	      this.textEl.setAttribute("align", "center");

	    const TEXT_LENGTH_DIVISOR = 20;
	    const TEXT_X_OFFSET = 0.1 + this.data.textOffset;
	    const TEXT_Y_MULTIPLYER = 1.8;

	    // Aligning Text
	    switch(this.data.textAlign) {
	      case 'center':
	        this.textEl.setAttribute("position", "0 0 0.001");
	      break;
	      case 'left':
	        this.textEl.setAttribute("position", `${-this.hDistance/2 - TEXT_X_OFFSET - (this.data.label.length/TEXT_LENGTH_DIVISOR)} 0 0.001`);
	      break;
	      case 'right':
	        this.textEl.setAttribute("position", `${this.hDistance/2 + TEXT_X_OFFSET + (this.data.label.length/TEXT_LENGTH_DIVISOR)} 0 0.001`);
	      break;
	      case 'above':
	        this.textEl.setAttribute("position", `0 ${this.vDistance * TEXT_Y_MULTIPLYER} 0.001`);
	      break;
	      case 'below':
	        this.textEl.setAttribute("position", `0 ${-this.vDistance * TEXT_Y_MULTIPLYER} 0.001`);
	      break;
	      default:
	        console.log(`Text alignment of button ${this.el} is broken`);
	    }

	    // Appening Text
	    if (!this.data.textOnHover) {
	      this.el.appendChild(this.textEl);
	    }

	    this.el.emit('onready', {
	      id: this.id,
	      name: this.data.name,
	      data: this.data,
	      target: this.el
	    });

	  },
	  update: function (oldData) {

	      // Setup Controller Callbacks
	      this.addAllEventListeners();

	    // Button Events
	    if ( oldData.label !== this.data.label ) {
	      this.textEl.setAttribute('value', this.data.label);
	    }

	    if (oldData.opacity !== this.data.opacity) {
	      this.mesh.material.opacity = this.data.opacity;
	      this.borderMesh.material.opacity = this.data.opacity;
	    }

	  },
	  tick: function () {},
	  remove: function () {
	    this.el.removeObject3D('plane');
	    this.el.removeObject3D('border');

	    this.removeAllEventListeners();
	  },
	  pause: function () {
	    this.removeAllEventListeners();
	  },
	  play: function () {
	    this.addAllEventListeners();
	  },

	/**
	* Gets all 3D Objects on the element
	* @param element - the aframe element
	* @returns Array of objects
	**/
	  getAll3DObjects: function (element) {
	    let a = [];
	    let plane = undefined;
	    let border = undefined;

	    plane = element.getObject3D('plane');
	    border = element.getObject3D('border');

	    if (plane) {a.push(plane)}
	    if (plane) {a.push(border)}

	    return a;
	  },

	  addAllEventListeners: function () {
	    // Setup Controller Callbacks

	    this.el.addEventListener('mouseup', this.EVENTS.onrelease.bind(this));
	    this.el.addEventListener('mousedown', this.EVENTS.onactivate.bind(this));
	    this.el.addEventListener("raycaster-intersected", this.EVENTS.onenter.bind(this));
	    this.el.addEventListener("raycaster-intersected-cleared", this.EVENTS.onleave.bind(this));

	  },

	  removeAllEventListeners: function () {
	    // Setup Controller Callbacks

	    this.el.removeEventListener('mouseup', this.EVENTS.onrelease.bind(this));
	    this.el.removeEventListener('mousedown', this.EVENTS.onactivate.bind(this));
	    this.el.removeEventListener("raycaster-intersected", this.EVENTS.onenter.bind(this));
	    this.el.removeEventListener("raycaster-intersected-cleared", this.EVENTS.onleave.bind(this));
	  },

	  /**
	   * Creates a circle geometry with the corisponding materials.
	   */
	  createCircle() {
	     // Create geometry.
	    this.geometry = new THREE.CircleBufferGeometry(this.hDistance, this.BUTTON_SEGMENTS);
	    // Create material.

	    let imageLoader = new THREE.TextureLoader();
	    imageLoader.setCrossOrigin('anonomous');

	    const planeMaterialConfig = {
	      color: this.color.getHex(),
	      side: 'double',
	    }

	      // Add image if available
	      try {
	        if (this.data.image != "") {
	          let map = imageLoader.load(this.data.image);
	          planeMaterialConfig.map = map;
	        }
	      } catch(e) {
	        console.warn('Image Load Failed', e)
	      }
	      

	    this.material = new THREE.MeshBasicMaterial(planeMaterialConfig);
	    this.material.transparent = true;
	    this.material.opacity = this.data.opacity;

	      //this.planeMaterials.push(this.planeMaterials);


	      // Create mesh.
	      this.mesh = new AFRAME.THREE.Mesh(this.geometry, this.material);
	      this.el.setObject3D('plane', this.mesh);



	// Border
	    this.borderGeo = new THREE.RingBufferGeometry(this.hDistance, this.BORDER_OFFSET, this.BUTTON_SEGMENTS);
	    // Create material.
	    this.borderMaterial = new THREE.MeshBasicMaterial({
	        color: this.borderColor.getHex(),
	        side: 'double'
	      }
	    );
	    this.borderMaterial.transparent = true;
	    this.borderMaterial.opacity = this.BORDER_OPACITY;
	    this.borderMesh = new THREE.Mesh(this.borderGeo, this.borderMaterial);
	  },
	  /**
	   * Creates rectangle button. Includes geometry, mesh, background overlays.
	   */
	  createRect() {
	    const DEPTH = 0.002;
	    const BORDER_SIZE = 0.0001;
	    const TRANSLATE_OFFSET = BORDER_SIZE/2;
	    this.geometry = new THREE.BoxBufferGeometry(this.data.width, this.data.height, DEPTH, this.BUTTON_SEGMENTS);

	    // Border
	    this.borderGeo = new THREE.EdgesGeometry( this.geometry );


	    // Background Material
	    this.material = new THREE.MeshBasicMaterial({
	        color: this.color.getHex(),
	        side: 'double'
	      });

	    this.material.transparent = true;
	    this.material.opacity = this.data.opacity;

	    // Border Material
	    this.borderMaterial = new THREE.MeshBasicMaterial({color: this.borderColor.getHex()});

	    this.borderMaterial.transparent = true;
	    this.borderMaterial.opacity = this.BORDER_OPACITY;

	    // Create mesh.
	    this.mesh = new THREE.Mesh(this.geometry, this.material);
	    this.borderMesh = new THREE.LineSegments( this.borderGeo, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

	    this.el.setObject3D('plane', this.mesh);
	  },
	  
	  mapToControllers() {
	    if (this.data.toolName.length === 0) return;

	    this.controllerElements.forEach((ctrl) => {
	      //Added as a safeguard. 
	      if (ctrl === null) return;
	      console.log("Controllers mapped");
	      ctrl.setAttribute('object-placement', {
	        toolName: this.data.toolName
	      });
	    });
	    },

	    removeObjectPlacement(ctrl) {
	      ctrl.removeAttribute('object-placement');
	    },

	    listenForObjectPlacement : function() {
	      this.controllerElements.forEach((ctrl) => {
	        //Added as a safeguard. 
	        if (ctrl === null) return;
	        const __this = this;
	        ctrl.addEventListener('objectPlaced', function(e) {
	          __this.removeObjectPlacement(ctrl)
	        });
	      });
	    }
	});


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = AFRAME.registerComponent('nav-breadcrumbs', {
	  schema: {
	    width: {type: 'number', default: 1},
	    height: {type: 'number', default: 0.2},
	    maxCrumbs: {type: 'number', default: 8},
	  },

	  init: function() {
	    this.crumbs = [];
	    this.breadcrumbsAmount = 0;                // Current amount of breadcrumbs
	    this.breadcrumbOffset = 0.1;               // How far away breadcrumbs are from each other.
	    this.breadcrumbHeight = 0.2;

	  },
	  update: function(oldData) {
	    // Resize Crumbs
	    this.breadcrumbs = this.getBreadcrumbElements();

	    // Sets important values that need to be updated often
	    this.updateValue();


	    if (oldData.width !== this.data.width) {
	      //this.updateBreadcrumbs();
	    }

	    if (oldData.height !== this.data.height) {
	      
	    }
	  },
	  /**
	   * 
	   * @param {*} label - label to be displayed on the breadcrumb button
	   * @param {*} panelName - The exact panel name (reference panel.js). Acts as a link when clicked.
	   */
	  addBreadCrumb: function(label, panelName) {

	    this.updateValue();


	    console.log('breadcrumb: ', label);
	    let el = document.createElement('a-entity');
	    el.setAttribute('nav-button', {
	      width: this.breadcrumbWidth,
	      height: this.breadcrumbHeight,
	      label: label,
	      color: '#555588',
	      textWidth: 2,
	      name: 'link',
	      link: panelName
	    });

	    console.log('bread width:', this.breadcrumbWidth, 'offset', this.breadcrumbOffset, 'initPos', this.breadcrumbInitPosOffset);
	    let nextXPos = this.getNextXPosByIndex(this.breadcrumbsAmount, this.breadcrumbWidth, this.breadcrumbOffset, this.breadcrumbInitPosOffset);
	    let height = this.data.height;

	    el.setAttribute('position', `${nextXPos} ${height + this.breadcrumbHeight} 0`);
	    el.setAttribute('id', this.getNewId(this.breadcrumbsAmount));
	    this.breadcrumbsAmount += 1;

	    // Inserts a crumb object
	    this.crumbs.push({
	      label: label,
	      panelName: panelName
	    });

	    this.el.appendChild(el);
	  },
	  
	  updateBreadcrumbs: function() {
	    //  this.breadcrumbs.forEach((el, i) => {
	    //     el.setAttribute('ui-push-button', {
	    //       width: this.breadcrumbWidth,
	    //       height: this.breadcrumbHeight
	    //     });
	    //     let xPos = getNextXPosByIndex(i, this.breadcrumbWidth, this.breadcrumbOffset, this.breadcrumbInitPosOffset);
	    //     el.setAttribute('position', `${xPos} 0 0`);
	    //  });

	    //  console.log('updated breadcrumb', this.breadcrumbs);
	  },

	  resetBreadcrumbs: function() {
	    this.crumbs = [];
	    this.breadcrumbsAmount = 0;
	  },

	  /**
	   * Returns new breadcrumb ID
	   * Based on breadcrumb amount
	   * @param amount - The amount of currently active breadcrumbs
	   */
	  getNewId: function(amount) {
	    return `crumb${this.breadcrumbsAmount.length}`;
	  },

	  
	  getBreadcrumbElements: function(amount) {
	    let elementArray = []
	    for(let i=0; i<amount; ++i) {
	      let el = this.el.querySelector(`#crumb${i}`);
	      if (el !== undefined) elementArray.push(el);
	    }

	    return elementArray;
	  },

	  
	  /**
	   * Returns the next X Position
	   * @param {*} breadcrumbs - array of active breadcrumb names
	   * @param {*} width - breadcrumb width
	   * @param {*} offset - breadcrumb offset to another breadcrumb
	   * @param {*} initPos - Inital position of all breadcrumbs
	   */
	  getNextXPos: function(breadcrumbs, width, offset, initPos) {
	    let nextPos = breadcrumbs.length * (width + offset) - initPos;
	    return nextPos;
	  },


	  /**
	   * Returns the next X Position
	   * @param {*} index - indexOfBreadcrumb
	   * @param {*} width - breadcrumb width
	   * @param {*} offset - breadcrumb offset to another breadcrumb
	   * @param {*} initPos - Inital position of all breadcrumbs
	   */
	  getNextXPosByIndex: function(index, width, offset, initPos) {
	    let nextPos = index * (width + offset) - initPos;
	    return nextPos;
	  },

	  updateValue: function() {
	    this.breadcrumbWidth = this.data.width / this.data.maxCrumbs;
	    let randomOffset = 1.32;
	    this.breadcrumbInitPosOffset = (this.data.width / 2) - (this.breadcrumbWidth / 2);
	  }
	});

/***/ })
/******/ ]);