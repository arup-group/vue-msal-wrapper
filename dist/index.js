/*!
 * vue-msal-wrapper v0.0.5
 * (c) Ben Hussey
 * Released under the MIT License.
 */
'use strict';

var axios = require('axios');
var msalBrowser = require('@azure/msal-browser');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

//
//
//
//
function _empty$1() {}

function _awaitIgnored$1(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty$1) : Promise.resolve();
  }
}

var _iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator")) : "@@iterator";

function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }

        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }

    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }

    pact.s = state;
    pact.v = value;
    var observer = pact.o;

    if (observer) {
      observer(pact);
    }
  }
}

var _Pact = /*#__PURE__*/function () {
  function _Pact() {}

  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;

    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;

      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }

        return result;
      } else {
        return this;
      }
    }

    this.o = function (_this) {
      try {
        var value = _this.v;

        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };

    return result;
  };

  return _Pact;
}();

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}

function _forTo(array, body, check) {
  var i = -1,
      pact,
      reject;

  function _cycle(result) {
    try {
      while (++i < array.length && (!check || !check())) {
        result = body(i);

        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.v;
          } else {
            result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
            return;
          }
        }
      }

      if (pact) {
        _settle(pact, 1, result);
      } else {
        pact = result;
      }
    } catch (e) {
      _settle(pact || (pact = new _Pact()), 2, e);
    }
  }

  _cycle();

  return pact;
}

function _forOf(target, body, check) {
  if (typeof target[_iteratorSymbol] === "function") {
    var _cycle = function _cycle(result) {
      try {
        while (!(step = iterator.next()).done && (!check || !check())) {
          result = body(step.value);

          if (result && result.then) {
            if (_isSettledPact(result)) {
              result = result.v;
            } else {
              result.then(_cycle, reject || (reject = _settle.bind(null, pact = new _Pact(), 2)));
              return;
            }
          }
        }

        if (pact) {
          _settle(pact, 1, result);
        } else {
          pact = result;
        }
      } catch (e) {
        _settle(pact || (pact = new _Pact()), 2, e);
      }
    };

    var iterator = target[_iteratorSymbol](),
        step,
        pact,
        reject;

    _cycle();

    if (iterator["return"]) {
      var _fixup = function _fixup(value) {
        try {
          if (!step.done) {
            iterator["return"]();
          }
        } catch (e) {}

        return value;
      };

      if (pact && pact.then) {
        return pact.then(_fixup, function (e) {
          throw _fixup(e);
        });
      }

      _fixup();
    }

    return pact;
  } // No support for Symbol.iterator


  // No support for Symbol.iterator
  if (!("length" in target)) {
    throw new TypeError("Object is not iterable");
  } // Handle live collections properly


  // Handle live collections properly
  var values = [];

  for (var i = 0; i < target.length; i++) {
    values.push(target[i]);
  }

  return _forTo(values, function (i) {
    return body(values[i]);
  }, check);
}

function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}

var script = {
  data: function data() {
    return {
      authenticated: false
    };
  },
  methods: {
    handleResponse: function handleResponse(resp) {
      try {
        var _this2 = this;

        if (resp !== null) {
          _this2.$msal.setUser(resp.account);
        } else {
          var currentAccounts = _this2.$msal.msalInstance.getAllAccounts();

          if (!currentAccounts || currentAccounts.length < 1) {
            _this2.$msal.msalInstance.loginRedirect(_this2.$msal.tokenTypes["login"]);
          } else if (currentAccounts.length === 1) {
            _this2.$msal.setUser(currentAccounts[0]);
          }
        }

        return _continue(_forOf(Object.keys(_this2.$msal.tokenTypes), function (tokenType) {
          return _awaitIgnored$1(_this2.$msal.getAuthToken(tokenType));
        }), function () {
          _this2.authenticated = true;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
  },
  mounted: function mounted() {
    this.$msal.msalInstance.handleRedirectPromise().then(this.handleResponse);
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.authenticated ? _c('div', [_vm._t("default")], 2) : _vm._e();
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject */

/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, undefined, undefined);

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }

  if (!value || !value.then) {
    value = Promise.resolve(value);
  }

  return then ? value.then(then) : value;
}

var msalAuthHandler = /*#__PURE__*/function () {
  function msalAuthHandler() {
    _classCallCheck(this, msalAuthHandler);

    this.tokenTypes = {};
    this.currentUser = {};
    this.tokenStore = {};
    this.msalInstance = null;
  }

  _createClass(msalAuthHandler, [{
    key: "install",
    value: function install(Vue, options) {
      Vue.msalAuthHandler = this;
      Vue.prototype.$msal = this;
      this.msalInstance = new msalBrowser.PublicClientApplication(options.msalConfig);
      this.tokenTypes = options.tokenTypes;
      Vue.component("msal-wrapper", __vue_component__);
    }
  }, {
    key: "setToken",
    value: function setToken(tokenType, response) {
      var expirationOffset = 10000000;
      var expiration = response.expiresOn.getTime() - new Date().getTime() - expirationOffset;
      this.tokenStore[tokenType] = response.accessToken;
      var that = this;
      window.setTimeout(_async(function () {
        that.getAuthToken(tokenType);
        return _await();
      }), expiration);
    }
  }, {
    key: "getAuthToken",
    value: function getAuthToken(tokenType) {
      var that = this;
      return new Promise(_async(function (resolve) {
        return _awaitIgnored(that.msalInstance.acquireTokenSilent(Object.assign({}, that.tokenTypes[tokenType], {
          account: that.msalInstance.getAllAccounts()[0]
        })).then(function (response) {
          that.setToken(tokenType, response);
          resolve();
        })["catch"](function (err) {
          if (err.name === "InteractionRequiredAuthError") {
            return that.msalInstance.acquireTokenRedirect(Object.assign({}, that.tokenTypes[tokenType], {
              account: that.msalInstance.getAllAccounts()[0]
            })).then(function (response) {
              that.setToken(tokenType, response);
              resolve();
            })["catch"](function (err) {
              console.error(err);
            });
          }
        }));
      }));
    }
  }, {
    key: "authenticatedApi",
    value: function authenticatedApi(baseURL, tokenType) {
      var additionalHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var tokenStore = this.tokenStore;
      var http = axios__default["default"].create({
        baseURL: baseURL,
        withCredentials: false,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });
      http.interceptors.request.use(function (config) {
        config.headers["Authorization"] = "Bearer ".concat(tokenStore[tokenType]);
        Object.assign(config.headers, additionalHeaders);
        return config;
      });
      http.interceptors.response.use(function (response) {
        return response;
      }, function (err) {
        return err;
      });
      return http;
    }
  }, {
    key: "getUser",
    value: function getUser() {
      return this.currentUser;
    }
  }, {
    key: "setUser",
    value: function setUser(user) {
      this.currentUser = user;
    }
  }]);

  return msalAuthHandler;
}();

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}

function _empty() {}

function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}

var index = new msalAuthHandler();

module.exports = index;
