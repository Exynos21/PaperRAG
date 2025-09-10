"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_trpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/trpc */ \"./utils/trpc.ts\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var _trpc_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @trpc/client */ \"@trpc/client\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_trpc__WEBPACK_IMPORTED_MODULE_1__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__, _trpc_client__WEBPACK_IMPORTED_MODULE_3__]);\n([_utils_trpc__WEBPACK_IMPORTED_MODULE_1__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__, _trpc_client__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClient();\nconst trpcClient = _utils_trpc__WEBPACK_IMPORTED_MODULE_1__.trpc.createClient({\n    links: [\n        (0,_trpc_client__WEBPACK_IMPORTED_MODULE_3__.httpBatchLink)({\n            url: \"/api/trpc\"\n        })\n    ]\n});\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_utils_trpc__WEBPACK_IMPORTED_MODULE_1__.trpc.Provider, {\n        client: trpcClient,\n        queryClient: queryClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.QueryClientProvider, {\n            client: queryClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"D:\\\\Projects\\\\PaperRAG\\\\PaperRAG\\\\frontend\\\\pages\\\\_app.tsx\",\n                lineNumber: 19,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"D:\\\\Projects\\\\PaperRAG\\\\PaperRAG\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 18,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\Projects\\\\PaperRAG\\\\PaperRAG\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 17,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQXFDO0FBQ29DO0FBQzVCO0FBRzdDLE1BQU1JLGNBQWMsSUFBSUgsOERBQVdBO0FBQ25DLE1BQU1JLGFBQWFMLDZDQUFJQSxDQUFDTSxZQUFZLENBQUM7SUFDbkNDLE9BQU87UUFDTEosMkRBQWFBLENBQUM7WUFDWkssS0FBSztRQUNQO0tBQ0Q7QUFDSDtBQUVlLFNBQVNDLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDOUQscUJBQ0UsOERBQUNYLDZDQUFJQSxDQUFDWSxRQUFRO1FBQUNDLFFBQVFSO1FBQVlELGFBQWFBO2tCQUM5Qyw0RUFBQ0Ysc0VBQW1CQTtZQUFDVyxRQUFRVDtzQkFDM0IsNEVBQUNNO2dCQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJaEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wYXBlci1yYWctZnJvbnRlbmQvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRycGMgfSBmcm9tIFwiLi4vdXRpbHMvdHJwY1wiO1xyXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIjtcclxuaW1wb3J0IHsgaHR0cEJhdGNoTGluayB9IGZyb20gXCJAdHJwYy9jbGllbnRcIjtcclxuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gXCJuZXh0L2FwcFwiO1xyXG5cclxuY29uc3QgcXVlcnlDbGllbnQgPSBuZXcgUXVlcnlDbGllbnQoKTtcclxuY29uc3QgdHJwY0NsaWVudCA9IHRycGMuY3JlYXRlQ2xpZW50KHtcclxuICBsaW5rczogW1xyXG4gICAgaHR0cEJhdGNoTGluayh7XHJcbiAgICAgIHVybDogXCIvYXBpL3RycGNcIixcclxuICAgIH0pLFxyXG4gIF0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9OiBBcHBQcm9wcykge1xyXG4gIHJldHVybiAoXHJcbiAgICA8dHJwYy5Qcm92aWRlciBjbGllbnQ9e3RycGNDbGllbnR9IHF1ZXJ5Q2xpZW50PXtxdWVyeUNsaWVudH0+XHJcbiAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxyXG4gICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cclxuICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPlxyXG4gICAgPC90cnBjLlByb3ZpZGVyPlxyXG4gICk7XHJcbn1cclxuIl0sIm5hbWVzIjpbInRycGMiLCJRdWVyeUNsaWVudCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJodHRwQmF0Y2hMaW5rIiwicXVlcnlDbGllbnQiLCJ0cnBjQ2xpZW50IiwiY3JlYXRlQ2xpZW50IiwibGlua3MiLCJ1cmwiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsIlByb3ZpZGVyIiwiY2xpZW50Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./utils/trpc.ts":
/*!***********************!*\
  !*** ./utils/trpc.ts ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   trpc: () => (/* binding */ trpc)\n/* harmony export */ });\n/* harmony import */ var _trpc_react_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @trpc/react-query */ \"@trpc/react-query\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_trpc_react_query__WEBPACK_IMPORTED_MODULE_0__]);\n_trpc_react_query__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst trpc = (0,_trpc_react_query__WEBPACK_IMPORTED_MODULE_0__.createTRPCReact)();\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi91dGlscy90cnBjLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQW9EO0FBRzdDLE1BQU1DLE9BQU9ELGtFQUFlQSxHQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFwZXItcmFnLWZyb250ZW5kLy4vdXRpbHMvdHJwYy50cz9iZGQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVRSUENSZWFjdCB9IGZyb20gXCJAdHJwYy9yZWFjdC1xdWVyeVwiO1xyXG5pbXBvcnQgdHlwZSB7IEFwcFJvdXRlciB9IGZyb20gXCIuLi9zZXJ2ZXIvdHJwY1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IHRycGMgPSBjcmVhdGVUUlBDUmVhY3Q8QXBwUm91dGVyPigpO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlVFJQQ1JlYWN0IiwidHJwYyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./utils/trpc.ts\n");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "@trpc/client":
/*!*******************************!*\
  !*** external "@trpc/client" ***!
  \*******************************/
/***/ ((module) => {

module.exports = import("@trpc/client");;

/***/ }),

/***/ "@trpc/react-query":
/*!************************************!*\
  !*** external "@trpc/react-query" ***!
  \************************************/
/***/ ((module) => {

module.exports = import("@trpc/react-query");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();