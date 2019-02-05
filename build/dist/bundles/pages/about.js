module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 94);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports) {

module.exports = require("semantic-ui-react");

/***/ }),

/***/ 30:
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_semantic_ui_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var dropdownStyle = {
    background: 'black !important',
    color: 'white !important',
    textTransform: 'capitalize !important'
};

var HeaderMenu = function (_React$Component) {
    _inherits(HeaderMenu, _React$Component);

    function HeaderMenu(props) {
        var _ref;

        _classCallCheck(this, HeaderMenu);

        var _this = _possibleConstructorReturn(this, (HeaderMenu.__proto__ || Object.getPrototypeOf(HeaderMenu)).call(this, props));

        var topics = [];
        if (props.topics) {
            topics = props.topics.map(function (topic) {
                return {
                    key: topic.name_id,
                    name: topic.name,
                    href: '/topics/' + topic.name_id
                };
            });
        }

        var homeTab = { key: 'home', name: 'Home', as: 'a', href: '/' };
        // let aboutTab = {key: 'about', name: 'about', as: 'a', href: '/about'};
        var items = (_ref = [homeTab]).concat.apply(_ref, _toConsumableArray(topics));

        if (props.addItems) {
            items = items.concat(props.addItems);
        }

        var activeIndex;
        if (props.activeItem) {
            var keys = items.map(function (item) {
                return item.key;
            });
            activeIndex = keys.indexOf(props.activeItem);
        }

        _this.state = {
            activeIndex: activeIndex || 0,
            items: items,
            topics: topics
        };
        return _this;
    }

    _createClass(HeaderMenu, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            var children = this.props.children;


            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                'div',
                null,
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__["Menu"], {
                    className: 'desktop-menu',
                    fixed: 'top',
                    inverted: true,
                    pointing: true,
                    items: this.state.items,
                    activeIndex: this.state.activeIndex }),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__["Menu"],
                    {
                        className: 'mobile-menu',
                        fixed: 'top',
                        inverted: true,
                        icon: true },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__["Dropdown"],
                        { item: true, icon: 'bars', className: 'left', style: dropdownStyle },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__["Dropdown"].Menu,
                            { style: dropdownStyle },
                            this.state.items.map(function (item, index) {
                                if (_this2.state.activeIndex !== index) {
                                    return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__["Dropdown"].Item, {
                                        key: item.key,
                                        text: item.name,
                                        as: 'a',
                                        href: item.href,
                                        style: dropdownStyle
                                    });
                                }
                            })
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_1_semantic_ui_react__["Menu"].Menu,
                        { position: 'right', className: 'right' },
                        children
                    )
                )
            );
        }
    }]);

    return HeaderMenu;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

;

/* harmony default export */ __webpack_exports__["a"] = (HeaderMenu);

/***/ }),

/***/ 45:
/***/ (function(module, exports) {

module.exports = require("isomorphic-unfetch");

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(95);


/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: external "babel-runtime/regenerator"
var regenerator_ = __webpack_require__(30);
var regenerator__default = /*#__PURE__*/__webpack_require__.n(regenerator_);

// EXTERNAL MODULE: external "react"
var external__react_ = __webpack_require__(7);
var external__react__default = /*#__PURE__*/__webpack_require__.n(external__react_);

// EXTERNAL MODULE: external "semantic-ui-react"
var external__semantic_ui_react_ = __webpack_require__(12);
var external__semantic_ui_react__default = /*#__PURE__*/__webpack_require__.n(external__semantic_ui_react_);

// CONCATENATED MODULE: ./components/SimpleLayout.js



var containerStyle = {
    position: 'absolute',
    top: '40px'
};

var SimpleLayout_SimpleLayout = function SimpleLayout(props) {
    return external__react__default.a.createElement(
        'div',
        null,
        external__react__default.a.createElement(
            external__semantic_ui_react_["Container"],
            { style: containerStyle },
            props.children
        )
    );
};

/* harmony default export */ var components_SimpleLayout = (SimpleLayout_SimpleLayout);
// EXTERNAL MODULE: ./components/HeaderMenu.js
var HeaderMenu = __webpack_require__(37);

// EXTERNAL MODULE: external "isomorphic-unfetch"
var external__isomorphic_unfetch_ = __webpack_require__(45);
var external__isomorphic_unfetch__default = /*#__PURE__*/__webpack_require__.n(external__isomorphic_unfetch_);

// CONCATENATED MODULE: ./pages/about.js


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var about_AboutPage = function (_React$PureComponent) {
    _inherits(AboutPage, _React$PureComponent);

    function AboutPage() {
        _classCallCheck(this, AboutPage);

        return _possibleConstructorReturn(this, (AboutPage.__proto__ || Object.getPrototypeOf(AboutPage)).apply(this, arguments));
    }

    _createClass(AboutPage, [{
        key: 'render',
        value: function render() {
            return external__react__default.a.createElement(
                'div',
                null,
                external__react__default.a.createElement(HeaderMenu["a" /* default */], { topics: this.props.topics, activeItem: 'about' }),
                external__react__default.a.createElement(
                    components_SimpleLayout,
                    null,
                    external__react__default.a.createElement(
                        'p',
                        null,
                        'This is the about page'
                    )
                )
            );
        }
    }], [{
        key: 'getInitialProps',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regenerator__default.a.mark(function _callee(ctx) {
                var topics, req, baseUrl, res;
                return regenerator__default.a.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                topics = ctx.query ? ctx.query.topics : null;

                                if (topics) {
                                    _context.next = 10;
                                    break;
                                }

                                req = ctx.req;
                                baseUrl = req && req.protocol && req.headers && req.headers.host ? req.protocol + '://' + req.headers.host : '';
                                _context.next = 6;
                                return external__isomorphic_unfetch__default()(baseUrl + '/api/v2/topics?format=json');

                            case 6:
                                res = _context.sent;
                                _context.next = 9;
                                return res.json();

                            case 9:
                                topics = _context.sent;

                            case 10:
                                return _context.abrupt('return', {
                                    topics: topics
                                });

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getInitialProps(_x) {
                return _ref.apply(this, arguments);
            }

            return getInitialProps;
        }()
    }]);

    return AboutPage;
}(external__react__default.a.PureComponent);

/* harmony default export */ var about = __webpack_exports__["default"] = (about_AboutPage);

/***/ })

/******/ });