// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"index.js":[function(require,module,exports) {
const isServer =
  Object.prototype.toString.call(
    typeof process !== 'undefined' ? process : 0,
  ) === '[object process]';
const isProduction = process.env.NODE_ENV === 'production';

module.exports = { isServer, isProduction };

},{}],"react-server.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _server = require("react-dom/server");

var _reactRouter = require("react-router");

var _reactRouterConfig = require("react-router-config");

var _reactHelmetAsync = require("react-helmet-async");

var _styledComponents = require("styled-components");

var _reactApollo = require("react-apollo");

var _reactTreeWalker = _interopRequireDefault(require("react-tree-walker"));

var _apolloClient = require("apollo-client");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloLink = require("apollo-link");

var _index = require("./index.js");

var _apolloLinkHttp = require("apollo-link-http");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class EmptyResultLink extends _apolloLink.ApolloLink {
  request(operation, forward) {
    return new _apolloLink.Observable(observer => {
      observer.next({
        data: {}
      });
      return () => {};
    });
  }

}

var _default = async ({
  config,
  app
}) => {
  const {
    createLink,
    createFragmentTypes,
    shouldPrefetch,
    ssrMode,
    outFile,
    name,
    version,
    graphqlUrl
  } = config;
  const containerElementName = `${name}${version}`;
  const fragmentTypesConfig = Object.assign({}, config, {
    isServer: _index.isServer,
    isProduction: _index.isProduction
  });
  const introspectionQueryResultData = createFragmentTypes && (await createFragmentTypes(fragmentTypesConfig));
  const cache = introspectionQueryResultData ? new _apolloCacheInmemory.InMemoryCache({
    fragmentMatcher: new _apolloCacheInmemory.IntrospectionFragmentMatcher({
      introspectionQueryResultData
    })
  }) : new _apolloCacheInmemory.InMemoryCache();
  const apolloLinkConfig = Object.assign({}, config, {
    cache,
    isServer: _index.isServer,
    isProduction: _index.isProduction
  });
  const link = createLink && (await createLink(apolloLinkConfig)) || graphqlUrl && new _apolloLinkHttp.HttpLink({
    uri: graphqlUrl
  });
  const client = new _apolloClient.ApolloClient({
    queryDeduplication: true,
    ssrMode: _index.isServer,
    link: shouldPrefetch ? link : new EmptyResultLink(),
    cache
  });
  return async (request, res, next) => {
    const helmetContext = {};
    const routerContext = {};
    const sheet = new _styledComponents.ServerStyleSheet();
    const componentConfig = Object.assign({}, config, {
      request,
      isServer: _index.isServer,
      isProduction: _index.isProduction
    });
    const components = app && (await app(componentConfig));

    const ServerApp = _react.default.createElement(_reactHelmetAsync.HelmetProvider, {
      context: helmetContext
    }, _react.default.createElement(_reactApollo.ApolloProvider, {
      client
    }, _react.default.createElement(_reactRouter.StaticRouter, {
      location: request.url,
      context: routerContext
    }, Array.isArray(components) ? (0, _reactRouterConfig.renderRoutes)(components) : components)));

    if (shouldPrefetch) await (0, _reactApollo.getDataFromTree)(ServerApp);else await (0, _reactTreeWalker.default)(ServerApp, (element, instance) => ({}));
    const {
      body,
      helmet,
      data = {}
    } = {
      body: sheet.interleaveWithNodeStream((0, _server.renderToNodeStream)(ServerApp)),
      helmet: helmetContext.helmet,
      data: client.extract()
    };
    res.write(`<!doctype html>
<html ${helmet.htmlAttributes}>
  <head>
    ${helmet.title}
    ${helmet.meta}
    ${helmet.link}
    ${helmet.noscript}
    ${helmet.script}
    ${helmet.style}
    ${ssrMode ? '' : `<script src="/${outFile}" defer></script>`}
  </head>
  <body ${helmet.bodyAttributes}>
    <div id="${containerElementName || 'root'}">`);
    body.pipe(res, {
      end: false
    });
    body.on('end', () => {
      res.end(`
    </div>
    ${!ssrMode && data && Object.keys(data).length > 0 ? `<script>window.DATA=${JSON.stringify(data)};</script>` : ''}
  </body>
</html>`);
      next();
    });
  };
};

exports.default = _default;
},{"./index.js":"index.js"}]},{},["react-server.js"], null)
//# sourceMappingURL=/react-server.map