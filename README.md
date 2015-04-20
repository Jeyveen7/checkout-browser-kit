**Browserify install**

*npm install checkout-browser-kit*

## Ajax

**CORS and JSONP**

```js
function ajax(url, params, successCallback, errorCallback, options);
```

**Constants**

```js
ajaxConstants: {
    defaults: {
        TYPE: 'get',
        TIMEOUT_MS: 60000,
        CANCEL_PREVIOUS: true
    },
    REQUEST_SOURCE: 'JS',
    CKO_SCRIPT_ID: '__checkoutJSONP',
    states: {
        DONE: 4
    },
    statuses: {
        TIMEOUT: 0,
        OK: 200,
        GENERAL_ERROR: 500
    },
    headers: {
        AUTHORIZATION: 'Authorization',
        ACCEPT: 'Accept',
        CONTENT_TYPE: 'Content-Type',
        CKO_ACTION: 'X-CKO-Action',
        CKO_REQUEST_SOURCE: 'X-CKO-REQUEST-SOURCE'
    },
    headerValues: {
        JSON_TYPE: 'application/json',
        PLAIN_TEXT_TYPE: 'text/plain'
    }
}
```

## DOM

DOM manipulation and helper functions

```js
function ready(callback);
function createElement(tag, options);
function hasClass(element, cls);
function addClass(element, cls);
function removeClass(element, cls);
function enableElement(element);
function disableElement(element);
function addEventListener(target, eventName, callback);
function isElement(element);
function isJqueryLoaded();
function isJqueryElement(element);
function getElement(selector, fallbackElement);
```

## Utils

```js
function isValidJSON(jsonString);
function toQueryString(url, params);
function extend(target, ...);
function getIEVersion();
```
