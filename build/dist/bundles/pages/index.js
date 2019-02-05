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
/******/ 	return __webpack_require__(__webpack_require__.s = 96);
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

/***/ 96:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(97);


/***/ }),

/***/ 97:
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

// EXTERNAL MODULE: ./components/HeaderMenu.js
var HeaderMenu = __webpack_require__(37);

// CONCATENATED MODULE: ./components/TopicCards.js



var TopicCards_TopicCards = function TopicCards(props) {
    return external__react__default.a.createElement(
        "div",
        null,
        external__react__default.a.createElement(
            external__semantic_ui_react_["Card"].Group,
            { centered: true },
            props.topics.map(function (topic) {
                return external__react__default.a.createElement(
                    external__semantic_ui_react_["Card"],
                    { key: topic.name_id, className: "card", as: "a", href: 'topics/' + topic.name_id },
                    external__react__default.a.createElement(external__semantic_ui_react_["Image"], { src: 'static/mc/images/' + topic.name_id + '.jpg' }),
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["Card"].Content,
                        null,
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["Card"].Header,
                            { style: { textAlign: 'center', textTransform: 'uppercase' } },
                            topic.name
                        )
                    )
                );
            })
        )
    );
};

/* harmony default export */ var components_TopicCards = (TopicCards_TopicCards);
// CONCATENATED MODULE: ./components/HomepageLayout.js
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var HomepageLayout_HomepageHeading = function HomepageHeading(_ref) {
    var mobile = _ref.mobile;
    return external__react__default.a.createElement(
        external__semantic_ui_react_["Container"],
        { text: true },
        external__react__default.a.createElement(external__semantic_ui_react_["Header"], {
            as: 'h1',
            content: 'GIS4DIS',
            inverted: true,
            style: {
                fontSize: mobile ? '2em' : '4em',
                fontWeight: 'bold',
                marginBottom: 0,
                marginTop: mobile ? '2em' : '3em'
            }
        }),
        external__react__default.a.createElement(external__semantic_ui_react_["Header"], {
            as: 'h2',
            content: 'Dynamic mapping methods oriented to risk and disaster management in the era of big data',
            inverted: true,
            style: {
                fontSize: mobile ? '1.5em' : '1.7em',
                fontWeight: 'normal',
                marginTop: mobile ? '0.5em' : '1.5em',
                marginBottom: mobile ? '0.5em' : '1.5em'
            }
        })
    );
};

var HomepageLayout_DesktopContainer = function (_Component) {
    _inherits(DesktopContainer, _Component);

    function DesktopContainer() {
        _classCallCheck(this, DesktopContainer);

        return _possibleConstructorReturn(this, (DesktopContainer.__proto__ || Object.getPrototypeOf(DesktopContainer)).apply(this, arguments));
    }

    _createClass(DesktopContainer, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                topics = _props.topics;


            return external__react__default.a.createElement(
                'div',
                { className: 'desktop-homepage' },
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Segment"],
                    {
                        inverted: true,
                        color: 'blue',
                        textAlign: 'center',
                        style: { padding: '1em 0em' },
                        vertical: true
                    },
                    external__react__default.a.createElement(HeaderMenu["a" /* default */], { topics: topics }),
                    external__react__default.a.createElement(HomepageLayout_HomepageHeading, null)
                ),
                children
            );
        }
    }]);

    return DesktopContainer;
}(external__react_["Component"]);

var HomepageLayout_MobileContainer = function (_Component2) {
    _inherits(MobileContainer, _Component2);

    function MobileContainer() {
        _classCallCheck(this, MobileContainer);

        return _possibleConstructorReturn(this, (MobileContainer.__proto__ || Object.getPrototypeOf(MobileContainer)).apply(this, arguments));
    }

    _createClass(MobileContainer, [{
        key: 'render',
        value: function render() {
            var _props2 = this.props,
                children = _props2.children,
                topics = _props2.topics;


            return external__react__default.a.createElement(
                'div',
                { className: 'mobile-homepage' },
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Segment"],
                    {
                        inverted: true,
                        color: 'blue',
                        textAlign: 'center',
                        style: { padding: '1em 0em' },
                        vertical: true },
                    external__react__default.a.createElement(HeaderMenu["a" /* default */], { topics: topics }),
                    external__react__default.a.createElement(HomepageLayout_HomepageHeading, { mobile: true })
                ),
                children
            );
        }
    }]);

    return MobileContainer;
}(external__react_["Component"]);

var HomepageLayout_ResponsiveContainer = function ResponsiveContainer(props) {
    return external__react__default.a.createElement(
        'div',
        null,
        external__react__default.a.createElement(
            HomepageLayout_DesktopContainer,
            { topics: props.topics },
            props.children
        ),
        external__react__default.a.createElement(
            HomepageLayout_MobileContainer,
            { topics: props.topics },
            props.children
        )
    );
};

var HomepageLayout_HomepageLayout = function HomepageLayout(props) {
    return external__react__default.a.createElement(
        HomepageLayout_ResponsiveContainer,
        { topics: props.topics },
        external__react__default.a.createElement(
            external__semantic_ui_react_["Segment"],
            { style: { padding: 'var(--segment-top-bottom-padding, 4em) var(--segment-side-padding, 0em)' }, vertical: true },
            external__react__default.a.createElement(
                external__semantic_ui_react_["Grid"],
                { container: true, stackable: true, verticalAlign: 'top', divided: true },
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Grid"].Column,
                    { width: 8, style: { padding: '1em' } },
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["Header"],
                        { as: 'h3', style: { fontSize: '2em' } },
                        'Project goals'
                    ),
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["List"],
                        { bulleted: true, style: { fontSize: '1.33em' } },
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'efficient methods for gathering, processing, integration and sharing of spatial data'
                        ),
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'collecting and processing data from different sources'
                        ),
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'cartographic presentation in real time (ie. rapid mapping) for crisis management'
                        )
                    ),
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["Container"],
                        { textAlign: 'center' },
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["Button"],
                            { primary: true, size: 'huge', href: 'http://geogr.muni.cz/gis4dis' },
                            'Find out more',
                            external__react__default.a.createElement(external__semantic_ui_react_["Icon"], { name: 'right arrow' })
                        )
                    )
                ),
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Grid"].Column,
                    { width: 8, style: { padding: '1em' } },
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["List"],
                        { style: { fontSize: '1em' } },
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'Acronym:',
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["List"].List,
                                { style: { fontSize: '1.33em', color: 'blue' } },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"].Item,
                                    null,
                                    'GIS4DIS'
                                )
                            )
                        ),
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'Project Period:',
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["List"].List,
                                { style: { fontSize: '1.33em', color: 'blue' } },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"].Item,
                                    null,
                                    '1. 4. 2017 - 31. 12. 2019'
                                )
                            )
                        ),
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'Code and investor of project:',
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["List"].List,
                                { style: { fontSize: '1.33em', color: 'blue' } },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"].Item,
                                    null,
                                    'LTACH-17002'
                                ),
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"].Item,
                                    null,
                                    'Ministry of Education, Youth and Sports (Czech Republic)'
                                )
                            )
                        ),
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["List"].Item,
                            null,
                            'Programme:',
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["List"].List,
                                { style: { fontSize: '1.33em', color: 'blue' } },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"].Item,
                                    null,
                                    'INTER-EXCELLENCE, INTER-ACTION'
                                )
                            )
                        )
                    )
                )
            )
        ),
        external__react__default.a.createElement(
            external__semantic_ui_react_["Segment"],
            { style: { padding: '2em var(--segment-side-padding, 0em)' }, vertical: true },
            external__react__default.a.createElement(
                external__semantic_ui_react_["Container"],
                null,
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Header"],
                    { as: 'h3', style: { fontSize: '2em' } },
                    'Topics'
                ),
                external__react__default.a.createElement(components_TopicCards, { topics: props.topics })
            )
        ),
        external__react__default.a.createElement(
            external__semantic_ui_react_["Segment"],
            { style: { padding: '2em var(--segment-side-padding, 0em)' }, vertical: true },
            external__react__default.a.createElement(
                external__semantic_ui_react_["Container"],
                null,
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Header"],
                    { as: 'h3', style: { fontSize: '2em' } },
                    'Partners'
                ),
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Grid"],
                    { container: true, stackable: true, verticalAlign: 'top' },
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["Grid"].Column,
                        { width: 8 },
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["Grid"],
                            { container: true, verticalAlign: 'top' },
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["Grid"].Column,
                                { mobile: 16, tablet: 6, computer: 6 },
                                external__react__default.a.createElement(external__semantic_ui_react_["Image"], { src: 'static/mc/logo/muni-lg-white.png', style: { background: 'rgb(0, 0, 200)' } })
                            ),
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["Grid"].Column,
                                { mobile: 16, tablet: 10, computer: 10 },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"],
                                    { style: { fontSize: '1.33em', fontWeight: 'bold' } },
                                    external__react__default.a.createElement(
                                        external__semantic_ui_react_["List"].Item,
                                        null,
                                        external__react__default.a.createElement(
                                            'a',
                                            { href: 'https://www.muni.cz/en' },
                                            'Masaryk university'
                                        ),
                                        external__react__default.a.createElement(
                                            external__semantic_ui_react_["List"].List,
                                            { style: { fontSize: '1em', fontWeight: 'normal' } },
                                            external__react__default.a.createElement(
                                                external__semantic_ui_react_["List"].Item,
                                                null,
                                                external__react__default.a.createElement(
                                                    'a',
                                                    { href: 'http://geogr.muni.cz/lgc' },
                                                    'Laboratory on Geoinformatics and Cartography'
                                                ),
                                                external__react__default.a.createElement(
                                                    external__semantic_ui_react_["List"].List,
                                                    { style: { fontSize: '0.8em' } },
                                                    external__react__default.a.createElement(
                                                        external__semantic_ui_react_["List"].Item,
                                                        { as: 'a', href: 'http://geogr.muni.cz/about-institute' },
                                                        'Department of Geography'
                                                    ),
                                                    external__react__default.a.createElement(
                                                        external__semantic_ui_react_["List"].Item,
                                                        { as: 'a', href: 'http://www.sci.muni.cz/en/SCI/' },
                                                        'Faculty of Science'
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["Grid"].Column,
                        { width: 8 },
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["Grid"],
                            { container: true, verticalAlign: 'top' },
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["Grid"].Column,
                                { mobile: 16, tablet: 6, computer: 6 },
                                external__react__default.a.createElement(external__semantic_ui_react_["Image"], { src: 'static/mc/logo/Nanjing_Normal_University_logo.png' })
                            ),
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["Grid"].Column,
                                { mobile: 16, tablet: 10, computer: 10 },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"],
                                    { style: { fontSize: '1.33em', fontWeight: 'bold' } },
                                    external__react__default.a.createElement(
                                        external__semantic_ui_react_["List"].Item,
                                        null,
                                        external__react__default.a.createElement(
                                            'a',
                                            { href: 'http://en.njnu.edu.cn/' },
                                            'Nanjing Normal University'
                                        ),
                                        external__react__default.a.createElement(
                                            external__semantic_ui_react_["List"].List,
                                            { style: { fontSize: '1em', fontWeight: 'normal' } },
                                            external__react__default.a.createElement(
                                                external__semantic_ui_react_["List"].Item,
                                                null,
                                                external__react__default.a.createElement(
                                                    'a',
                                                    { href: 'http://schools.njnu.edu.cn/geog/research/key-laboratory-of-virtual-geographic-environment-nanjing-normal-university-ministry-of' },
                                                    'Key Laboratory of Virtual Geographic Environment'
                                                ),
                                                external__react__default.a.createElement(
                                                    external__semantic_ui_react_["List"].List,
                                                    { style: { fontSize: '0.8em' } },
                                                    external__react__default.a.createElement(
                                                        external__semantic_ui_react_["List"].Item,
                                                        { as: 'a', href: 'http://schools.njnu.edu.cn/geog/' },
                                                        'School of Geography Science'
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ),
        external__react__default.a.createElement(
            external__semantic_ui_react_["Segment"],
            { inverted: true, vertical: true, style: { padding: '5em var(--segment-side-padding, 0em)' } },
            external__react__default.a.createElement(
                external__semantic_ui_react_["Container"],
                null,
                external__react__default.a.createElement(
                    external__semantic_ui_react_["Grid"],
                    { divided: true, inverted: true, stackable: true },
                    external__react__default.a.createElement(
                        external__semantic_ui_react_["Grid"].Row,
                        null,
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["Grid"].Column,
                            { width: 4 },
                            external__react__default.a.createElement(external__semantic_ui_react_["Header"], { inverted: true, as: 'h4', content: 'About' }),
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["List"],
                                { link: true, inverted: true },
                                external__react__default.a.createElement(
                                    external__semantic_ui_react_["List"].Item,
                                    { as: 'a', href: 'http://geogr.muni.cz/gis4dis' },
                                    'Project site on MUNI'
                                )
                            )
                        ),
                        external__react__default.a.createElement(
                            external__semantic_ui_react_["Grid"].Column,
                            { width: 12 },
                            external__react__default.a.createElement(
                                external__semantic_ui_react_["Header"],
                                { as: 'h4', inverted: true },
                                'GIS4DIS'
                            ),
                            external__react__default.a.createElement(
                                'p',
                                null,
                                'Dynamic mapping methods oriented to risk and disaster management in the era of big data'
                            )
                        )
                    )
                )
            )
        )
    );
};

/* harmony default export */ var components_HomepageLayout = (HomepageLayout_HomepageLayout);
// EXTERNAL MODULE: external "isomorphic-unfetch"
var external__isomorphic_unfetch_ = __webpack_require__(45);
var external__isomorphic_unfetch__default = /*#__PURE__*/__webpack_require__.n(external__isomorphic_unfetch_);

// CONCATENATED MODULE: ./pages/index.js


var pages__createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function pages__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function pages__possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function pages__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var pages_HomePage = function (_React$PureComponent) {
    pages__inherits(HomePage, _React$PureComponent);

    pages__createClass(HomePage, null, [{
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
                                    _context.next = 11;
                                    break;
                                }

                                req = ctx.req;
                                baseUrl = req && req.protocol && req.headers && req.headers.host ? req.protocol + '://' + req.headers.host : '';


                                console.log(baseUrl);
                                _context.next = 7;
                                return external__isomorphic_unfetch__default()(baseUrl + '/api/v2/topics?format=json');

                            case 7:
                                res = _context.sent;
                                _context.next = 10;
                                return res.json();

                            case 10:
                                topics = _context.sent;

                            case 11:
                                return _context.abrupt('return', {
                                    topics: topics
                                });

                            case 12:
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

    function HomePage(props) {
        pages__classCallCheck(this, HomePage);

        return pages__possibleConstructorReturn(this, (HomePage.__proto__ || Object.getPrototypeOf(HomePage)).call(this, props));
    }

    pages__createClass(HomePage, [{
        key: 'render',
        value: function render() {

            return external__react__default.a.createElement(components_HomepageLayout, { topics: this.props.topics });
        }
    }]);

    return HomePage;
}(external__react__default.a.PureComponent);

/* harmony default export */ var pages = __webpack_exports__["default"] = (pages_HomePage);

/***/ })

/******/ });