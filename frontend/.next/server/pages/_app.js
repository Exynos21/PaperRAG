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

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils_trpc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/trpc */ \"./utils/trpc.ts\");\n/* harmony import */ var _trpc_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @trpc/client */ \"@trpc/client\");\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_trpc__WEBPACK_IMPORTED_MODULE_1__, _trpc_client__WEBPACK_IMPORTED_MODULE_2__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__]);\n([_utils_trpc__WEBPACK_IMPORTED_MODULE_1__, _trpc_client__WEBPACK_IMPORTED_MODULE_2__, _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n// frontend/pages/_app.tsx\n\n\n\n\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClient();\nconst trpcClient = _utils_trpc__WEBPACK_IMPORTED_MODULE_1__.trpc.createClient({\n    links: [\n        (0,_trpc_client__WEBPACK_IMPORTED_MODULE_2__.httpBatchLink)({\n            url: \"/api/trpc\"\n        })\n    ]\n});\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_utils_trpc__WEBPACK_IMPORTED_MODULE_1__.trpc.Provider, {\n        client: trpcClient,\n        queryClient: queryClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.QueryClientProvider, {\n            client: queryClient,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"D:\\\\Projects\\\\PaperRAG\\\\PaperRAG\\\\frontend\\\\pages\\\\_app.tsx\",\n                lineNumber: 20,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"D:\\\\Projects\\\\PaperRAG\\\\PaperRAG\\\\frontend\\\\pages\\\\_app.tsx\",\n            lineNumber: 19,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"D:\\\\Projects\\\\PaperRAG\\\\PaperRAG\\\\frontend\\\\pages\\\\_app.tsx\",\n        lineNumber: 18,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSwwQkFBMEI7O0FBRVc7QUFDUTtBQUM0QjtBQUV6RSxNQUFNSSxjQUFjLElBQUlGLDhEQUFXQTtBQUNuQyxNQUFNRyxhQUFhTCw2Q0FBSUEsQ0FBQ00sWUFBWSxDQUFDO0lBQ25DQyxPQUFPO1FBQ0xOLDJEQUFhQSxDQUFDO1lBQ1pPLEtBQUs7UUFDUDtLQUNEO0FBQ0g7QUFFZSxTQUFTQyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQzVELHFCQUNFLDhEQUFDWCw2Q0FBSUEsQ0FBQ1ksUUFBUTtRQUFDQyxRQUFRUjtRQUFZRCxhQUFhQTtrQkFDOUMsNEVBQUNELHNFQUFtQkE7WUFBQ1UsUUFBUVQ7c0JBQzNCLDRFQUFDTTtnQkFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7O0FBSWhDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFwZXItcmFnLWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBmcm9udGVuZC9wYWdlcy9fYXBwLnRzeFxyXG5pbXBvcnQgdHlwZSB7IEFwcFByb3BzIH0gZnJvbSBcIm5leHQvYXBwXCI7XHJcbmltcG9ydCB7IHRycGMgfSBmcm9tIFwiLi4vdXRpbHMvdHJwY1wiO1xyXG5pbXBvcnQgeyBodHRwQmF0Y2hMaW5rIH0gZnJvbSBcIkB0cnBjL2NsaWVudFwiO1xyXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gXCJAdGFuc3RhY2svcmVhY3QtcXVlcnlcIjtcclxuXHJcbmNvbnN0IHF1ZXJ5Q2xpZW50ID0gbmV3IFF1ZXJ5Q2xpZW50KCk7XHJcbmNvbnN0IHRycGNDbGllbnQgPSB0cnBjLmNyZWF0ZUNsaWVudCh7XHJcbiAgbGlua3M6IFtcclxuICAgIGh0dHBCYXRjaExpbmsoe1xyXG4gICAgICB1cmw6IFwiL2FwaS90cnBjXCIsXHJcbiAgICB9KSxcclxuICBdLFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDx0cnBjLlByb3ZpZGVyIGNsaWVudD17dHJwY0NsaWVudH0gcXVlcnlDbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cclxuICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XHJcbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxyXG4gICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XHJcbiAgICA8L3RycGMuUHJvdmlkZXI+XHJcbiAgKTtcclxufVxyXG4iXSwibmFtZXMiOlsidHJwYyIsImh0dHBCYXRjaExpbmsiLCJRdWVyeUNsaWVudCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJxdWVyeUNsaWVudCIsInRycGNDbGllbnQiLCJjcmVhdGVDbGllbnQiLCJsaW5rcyIsInVybCIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsIlByb3ZpZGVyIiwiY2xpZW50Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./utils/trpc.ts":
/*!***********************!*\
  !*** ./utils/trpc.ts ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   trpc: () => (/* binding */ trpc)\n/* harmony export */ });\n/* harmony import */ var _trpc_react_query__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @trpc/react-query */ \"@trpc/react-query\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_trpc_react_query__WEBPACK_IMPORTED_MODULE_0__]);\n_trpc_react_query__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// frontend/utils/trpc.ts\n\nconst trpc = (0,_trpc_react_query__WEBPACK_IMPORTED_MODULE_0__.createTRPCReact)();\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi91dGlscy90cnBjLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEseUJBQXlCO0FBQzJCO0FBRzdDLE1BQU1DLE9BQU9ELGtFQUFlQSxHQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGFwZXItcmFnLWZyb250ZW5kLy4vdXRpbHMvdHJwYy50cz9iZGQ2Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIGZyb250ZW5kL3V0aWxzL3RycGMudHNcclxuaW1wb3J0IHsgY3JlYXRlVFJQQ1JlYWN0IH0gZnJvbSBcIkB0cnBjL3JlYWN0LXF1ZXJ5XCI7XHJcbmltcG9ydCB0eXBlIHsgQXBwUm91dGVyIH0gZnJvbSBcIi4uL3NlcnZlci90cnBjXCI7XHJcblxyXG5leHBvcnQgY29uc3QgdHJwYyA9IGNyZWF0ZVRSUENSZWFjdDxBcHBSb3V0ZXI+KCk7XHJcbiJdLCJuYW1lcyI6WyJjcmVhdGVUUlBDUmVhY3QiLCJ0cnBjIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./utils/trpc.ts\n");

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