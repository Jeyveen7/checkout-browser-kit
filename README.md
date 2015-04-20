**Browserify install**
*npm install checkout-browser-kit*

# Ajax

**CORS and JSONP**

```js
ajax(function(url, params, successCallback, errorCallback, options);
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

# DOM

DOM manipulation and helper functions

```js
DOM.ready(callback);
DOM.createElement(tag, options);
DOM.hasClass(element, cls);
DOM.addClass(element, cls);
DOM.removeClass(element, cls);
DOM.enableElement(element);
DOM.disableElement(element);
DOM.addEventListener(target, eventName, callback);
DOM.isElement(element);
DOM.isJqueryLoaded();
DOM.isJqueryElement(element);
DOM.getElement(selector, fallbackElement);
```

# Utils

```js
isValidJSON(jsonString);
toQueryString(url, params);
extend(target, ...);
getIEVersion();
```
