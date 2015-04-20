/******* Polyfills ********/
(function() {
    // Define window.console - IE bug if Developer Tools is not open
    if (typeof window.console === 'undefined') {
        // silently fails
        window.console = {
            log: function() {},
            debug: function() {},
            warn: function() {},
            error: function() {}
        };
    }

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            if (isNaN(fromIndex)) {
                fromIndex = 0;
            }
            for (var i = fromIndex; i < this.length; i++) {
                if (this[i] === searchElement) return i;
            }
            return -1;
        };
    }

    Function.prototype.bind = (function() {}).bind || function(b) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        function c() {}
        var a = [].slice,
            f = a.call(arguments, 1),
            e = this,
            d = function() {
                return e.apply(this instanceof c ? this : b || window, f.concat(a.call(arguments)));
            };
        c.prototype = this.prototype;
        d.prototype = new c();
        return d;
    };
})();

/*!
 * DOM Ready (modified slightly)
 * https://code.google.com/p/domready/
 */
/* jshint ignore:start */
var DomReady = (function() {
    var DomReady = {};

    // Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery.

    var userAgent = navigator.userAgent.toLowerCase();

    // Figure out what browser is being used
    var browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: (/msie/.test(userAgent)) && (!/opera/.test(userAgent)),
        mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
    };

    var readyBound = false;
    var isReady = false;
    var readyList = [];

    // Handle when the DOM is ready
    function domReady() {
        // Make sure that the DOM is not already loaded
        if (!isReady) {
            // Remember that the DOM is ready
            isReady = true;

            if (readyList) {
                for (var fn = 0; fn < readyList.length; fn++) {
                    readyList[fn].call(window, []);
                }

                readyList = [];
            }
        }
    };

    // From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
    function addLoadEvent(func) {
        var oldonload = window.onload;
        if (typeof window.onload != 'function') {
            window.onload = func;
        } else {
            window.onload = function() {
                if (oldonload) {
                    oldonload();
                }
                func();
            }
        }
    };

    // does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
    function bindReady() {
        if (readyBound) {
            return;
        }

        readyBound = true;

        // Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
        if (document.addEventListener && !browser.opera) {
            // Use the handy event callback
            document.addEventListener("DOMContentLoaded", domReady, false);
        }

        // If IE is used and is not in a frame
        // Continually check to see if the document is ready
        if (browser.msie && window == top)(function Func() {
            if (isReady) return;
            try {
                // If IE is used, use the trick by Diego Perini
                // http://javascript.nwbox.com/IEContentLoaded/
                document.documentElement.doScroll("left");
            } catch (error) {
                setTimeout(Func, 0);
                return;
            }
            // and execute any waiting functions
            domReady();
        })();

        if (browser.opera) {
            document.addEventListener("DOMContentLoaded", function Func() {
                if (isReady) return;
                for (var i = 0; i < document.styleSheets.length; i++)
                    if (document.styleSheets[i].disabled) {
                        setTimeout(Func, 0);
                        return;
                    }
                    // and execute any waiting functions
                domReady();
            }, false);
        }

        if (browser.safari) {
            var numStyles;
            (function Func() {
                if (isReady) return;
                if (document.readyState != "loaded" && document.readyState != "complete") {
                    setTimeout(Func, 0);
                    return;
                }
                if (numStyles === undefined) {
                    var links = document.getElementsByTagName("link");
                    for (var i = 0; i < links.length; i++) {
                        if (links[i].getAttribute('rel') == 'stylesheet') {
                            numStyles++;
                        }
                    }
                    var styles = document.getElementsByTagName("style");
                    numStyles += styles.length;
                }
                if (document.styleSheets.length != numStyles) {
                    setTimeout(Func, 0);
                    return;
                }

                // and execute any waiting functions
                domReady();
            })();
        }

        // A fallback to window.onload, that will always work
        addLoadEvent(domReady);
    };

    // This is the public function that people can use to hook up ready.
    DomReady.ready = function(fn, args) {
        // Attach the listeners
        bindReady();

        // If the DOM is already ready
        if (isReady) {
            // Execute the function immediately
            fn.call(window, []);
        } else {
            // Add the function to the wait list
            readyList.push(function() {
                return fn.call(window, []);
            });
        }
    };

    bindReady();

    return DomReady;
})();
/* jshint ignore: end */

/******* BrowserKit *******/
var BrowserKit = {
    /**
     * Empty/Dummy function.
     */
    noop: function() {},

    /**
     * Removes spaces from both sides of a string.
     */
    trimString: function(str) {
        if (!str || typeof str !== 'string') return '';
        return str.replace(/^\s+|\s+$/g, '');
    },

    /**
     * Return IE version or 'false'.
     */
    getIEVersion: function() {
        var version = false,
            myNav = navigator.userAgent.toLowerCase();
        if (~myNav.indexOf('msie')) {
            var arr = myNav.split('msie');
            if (arr.length > 1) {
                version = parseInt(myNav.split('msie')[1], 10);
            }
        }
        var getIEVersion = function() {
            return isNaN(version) ? false : version;
        };
        // rewrite the function on return to avoid further processing
        BrowserKit.getIEVersion = getIEVersion;

        return getIEVersion();
    },

    /**
     * Returns true if IE and IE version V is 6 <= V <= 9.
     */
    isIE6to9: function() {
        var ieVersion = BrowserKit.getIEVersion();
        return !!ieVersion && ieVersion >= 6 && ieVersion <= 9;
    },

    /**
     * Copies all properties of all objects passed in the arguments list to the 'target' object.
     */
    extend: function(target) {
        target = target || {};
        for (var i = 1; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) continue;
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    target[key] = arg[key];
                }
            }
        }
        return target;
    },

    /**
     * Flattens a parameter object into a querystring added to a URL.
     */
    toQueryString: function(url, params) {
        var str = '';
        if (!params || typeof params !== 'object') return str;
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                str += (str === '' && !~url.indexOf('?') ? '?' : '&') + encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }
        }
        return str;
    },

    /**
     * Test if string is valid JSON via RegEx
     * Ref:  line 450 in https://github.com/douglascrockford/JSON-js/blob/master/json2.js
     *
     * Note: Amended to return false for null | undefined | empty string
     */
    isValidJSON: function(jsonString) {
        var testStr = BrowserKit.trimString(jsonString);
        return !!testStr && (/^[\],:{}\s]*$/.test(testStr.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '')));
    },

    /**
     * Ajax dependency constants.
     */
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
        headers: { // matching HTTP header names for header keys
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
    },

    /**
     * Ajax Helper - will use JSONP if CORS not supported on browser.
     *
     * Note: JSONP enforced for IE8 + 9, due to broken implementations.
     */
    ajax: (function() {
        // keep track of active requests via URLs as keys (without querystring)
        // the value is a cancel function for that request
        var activeRequests = {};

        var getSanitizedUrl = function(url) {
            return url ? String(url).split('?')[0] : null;
        };

        // Count used when creating JSONP SCRIPT tags to avoid duplication
        var jsonpCount = 0;

        function buildErrorObject(status, err) {
            return {
                status: status,
                error: err
            };
        }

        return function(url, params, successCallback, errorCallback, options) {
            var constants = BrowserKit.ajaxConstants;

            function buildTimeoutErrorObject() {
                return buildErrorObject(constants.statuses.GENERAL_ERROR, {
                    errorCode: constants.statuses.GENERAL_ERROR,
                    message: 'timed out'
                });
            }

            params = params || {};
            params.requestSource = constants.REQUEST_SOURCE;

            options = options || {};
            options.type = options.type || constants.defaults.TYPE;
            options.cancelPrevious = typeof options.cancelPrevious !== 'undefined' ? !!options.cancelPrevious : constants.defaults.CANCEL_PREVIOUS;

            // initialise headers
            options.headers = options.headers || {};
            options.headers.ACCEPT = constants.headerValues.JSON_TYPE; // very unlikely to ever change

            var useJSONP = options.forceJSONP ||
                (typeof XMLHttpRequest === 'undefined' || BrowserKit.isIE6to9());

            // if we're using JSONP, check if a separate URL has been provided
            // also, we pass everything in a 'data' property if JSONP
            if (useJSONP) {
                url = (options.jsonpUrl ? String(options.jsonpUrl) : url);

                params = BrowserKit.extend({
                    jsonp: true,
                    authorization: options.headers.AUTHORIZATION
                }, options.type === 'get' ? params : {
                    data: JSON.stringify(params)
                });
            }

            // cancel any previously running request on same URL
            var urlKey = getSanitizedUrl(url);
            if (urlKey && options.cancelPrevious && activeRequests[urlKey]) {
                activeRequests[urlKey]();
                delete activeRequests[urlKey];
            }

            if (options.type === 'get' || useJSONP) {
                url += BrowserKit.toQueryString(url, params);
            }

            if (!useJSONP) {
                var xhr = new XMLHttpRequest();
                // we need to open the connection before we can set headers etc.
                xhr.open(options.type, url, true);

                // assign headers
                options.headers.CONTENT_TYPE =
                    options.type === 'get' ?
                    constants.headerValues.PLAIN_TEXT_TYPE :
                    constants.headerValues.JSON_TYPE;

                for (var key in options.headers) {
                    if (constants.headers[key]) {
                        xhr.setRequestHeader(constants.headers[key], options.headers[key]);
                    }
                }

                xhr.timeout = options.timeout || constants.defaults.TIMEOUT_MS;
                xhr.onreadystatechange = function() {
                    var status, data;
                    // http://xhr.spec.whatwg.org/#dom-xmlhttprequest-readystate
                    if (xhr.readyState == constants.states.DONE) { // `DONE`
                        delete activeRequests[urlKey];
                        status = xhr.status;
                        if (status == constants.statuses.OK) {
                            data = JSON.parse(xhr.responseText);
                            if (typeof successCallback === 'function') {
                                successCallback(data);
                            }
                        } else if (status == constants.statuses.TIMEOUT) {
                            if (typeof errorCallback === 'function') {
                                errorCallback(buildTimeoutErrorObject());
                            }
                        } else {
                            if (typeof errorCallback === 'function') {
                                errorCallback(buildErrorObject(status, JSON.parse(xhr.responseText)));
                            }
                        }
                    }
                };

                if (options.type === 'get') {
                    xhr.send();
                } else {
                    xhr.send(JSON.stringify(params));
                }
                // function to cancel the request
                activeRequests[urlKey] = function() {
                    xhr.abort();
                };
            } else {
                var param = 'callback',
                    target = document.getElementsByTagName('script')[0] || document.head,
                    script,
                    timer,
                    scriptId = options.jsonpCallback || constants.CKO_SCRIPT_ID + (jsonpCount++),
                    cleanup = function(callback, data, safeMode) {
                        delete activeRequests[urlKey];
                        if (script && script.parentNode) {
                            script.parentNode.removeChild(script);
                        }
                        // in safemode (or IE8/9), we just reassign window[scriptId], in case it gets run!
                        if (safeMode) {
                            window[scriptId] = BrowserKit.noop;
                        } else {
                            // in the event of a bad browser implementation.
                            try {
                                delete window[scriptId];
                            } catch (e) {
                                window[scriptId] = void 0;
                            }
                        }
                        if (typeof callback === 'function') {
                            callback(data);
                        }
                    };

                timer = setTimeout(function() {
                    // cleanup safely
                    cleanup(errorCallback, buildTimeoutErrorObject());
                }, options.timeout || constants.defaults.TIMEOUT_MS);

                window[scriptId] = function(data) {
                    if (timer) clearTimeout(timer);
                    // the only way to work out which callback to trigger is by checking for the existence of the errorCode property in the response payload
                    if (typeof data.errorCode === 'undefined') {
                        cleanup(successCallback, data);
                    } else {
                        cleanup(errorCallback, buildErrorObject(constants.statuses.GENERAL_ERROR, data));
                    }
                };

                // add callback to url
                url += (~url.indexOf('?') ? '&' : '?') + param + '=' + encodeURIComponent(scriptId);
                url = url.replace('?&', '?');

                // create script and insert into DOM
                script = document.createElement('script');
                script.src = url;
                target.parentNode.insertBefore(script, target);
                // function to cancel the request
                activeRequests[urlKey] = function() {
                    // we can't quite cancel the request here cleanly
                    // we just cleanup safely!
                    cleanup(null, null, true);
                };
            }
        };
    })(),

    /**
     * DOM Helper to manipulate HTML elements.
     */
    DOM: {
        /**
         * Triggered when DOM is ready
         */
        ready: DomReady.ready,
        /**
         * Helper function to create a DOM element and optionally add it to a parent element and/or decorate with attributes,styling, events and HTML content.
         *
         * options = {
         *     parent: parentElement,
         *     classNames: 'className', // or [className1, className2]
         *     attributes: {
         *         attrib: 'val1',
         *         'another-attrib': 'val2'
         *     },
         *     innerHTML: 'text', // or '<span>text</span'
         *     styling: {
         *         backgroundColor: '#999'
         *     },
         *     // or
         *     styling: 'background-color: #999; color: #fff;',
         *     events: {
         *         'eventName': function(event) {
         *
         *         }
         *     }
         * }
         */
        createElement: function(tag, options) {
            var element = document.createElement(tag);
            if (options && typeof options === 'object') {
                if (typeof options.classNames === 'string') {
                    BrowserKit.DOM.addClass(element, options.classNames);
                } else if (Object.prototype.toString.call(options.classNames) === '[object Array]') {
                    for (var c = 0; c < options.classNames.length; c++) {
                        BrowserKit.DOM.addClass(element, options.classNames[c]);
                    }
                }
                if (typeof options.id === 'string') {
                    element.setAttribute('id', options.id);
                }
                if (options.attributes && typeof options.attributes === 'object') {
                    for (var attrKey in options.attributes) {
                        if (options.attributes.hasOwnProperty(attrKey)) {
                            element.setAttribute(attrKey, options.attributes[attrKey]);
                        }
                    }
                }
                if (options.styling) {
                    if (typeof options.styling === 'string') {
                        element.setAttribute('styling', options.styling);
                    } else if (typeof options.styling === 'object') {
                        for (var stylingKey in options.styling) {
                            if (options.styling.hasOwnProperty(stylingKey)) {
                                element.style[stylingKey] = options.styling[stylingKey];
                            }
                        }
                    }
                }
                if (typeof options.innerHTML === 'string') {
                    element.innerHTML = options.innerHTML;
                }
                if (options.events && typeof options.events === 'object') {
                    for (var eventKey in options.events) {
                        if (options.events.hasOwnProperty(eventKey)) {
                            BrowserKit.DOM.addEventListener(element, eventKey, options.events[eventKey]);
                        }
                    }
                }
                if (options.parent && options.parent.appendChild) {
                    options.parent.appendChild(element);
                }
            }

            return element;
        },
        /**
         * Classname manipulation
         */
        hasClass: function(element, cls) {
            return element.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
        },
        addClass: function(element, cls) {
            if (!this.hasClass(element, cls)) {
                element.className += (!!element.className ? ' ' : '') + cls;
            }
        },
        removeClass: function(element, cls) {
            if (this.hasClass(element, cls)) {
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                element.className = element.className.replace(reg, ' ');
            }
        },
        enableElement: function(element) {
            element.removeAttribute('disabled');
        },
        disableElement: function(element) {
            element.setAttribute('disabled', 'disabled');
        },
        /**
         * Cross browser way to add an event handler
         */
        addEventListener: function(target, eventName, callback) {
            if (typeof callback !== 'function') {
                throw new Error('Callback must be a function');
            }

            // treats event object for IE
            function ieCheckEvent(event) {
                if (!event.preventDefault) {
                    event.preventDefault = function() {
                        event.returnValue = false;
                    };
                }
                if (!event.stopPropagation) {
                    event.stopPropagation = function() {
                        event.cancelBubble = true;
                    };
                }
            }

            if (target.attachEvent) { //Internet Explorer
                target.attachEvent('on' + eventName, function(event) {
                    ieCheckEvent(event);
                    callback(event);
                });
            } else if (target.addEventListener) {
                target.addEventListener(eventName, function(event) {
                    ieCheckEvent(event);
                    callback(event);
                }, false);
            }
        },
        /**
         * Returns true if element is a HTML element
         */
        isElement: function(element) {
            if (typeof element !== 'object') {
                return false;
            } else {
                return this.isJqueryElement(element) || element.nodeType === 1;
            }
        },
        /**
         * Returns true if JQuery is loaded
         */
        isJqueryLoaded: function() {
            return typeof jQuery !== 'undefined' && jQuery !== null;
        },
        /**
         * Returns true if element is wrapped by JQuery
         */
        isJqueryElement: function(element) {
            return this.isJqueryLoaded() && element instanceof jQuery;
        },
        // selectors
        DOM_ID_SELECTOR: '#',
        DOM_CLASS_SELECTOR: '.',
        DOM_SELECTORS_REGEX: /#?\.?/g,
        /**
         * Returns a DOM element via the selector (ID or Class).
         * @param  {[type]} selector        ID or Class (eg: #container or .container)
         * @param  {[type]} fallbackElement A DOM Element to return if no matches
         */
        getElement: function(selector, fallbackElement) {
            var element;

            if (selector && typeof selector === 'string') {
                // assign default selector
                var hasIdSelector = ~selector.indexOf(this.DOM_ID_SELECTOR);
                var hasClassSelector = !hasIdSelector && ~selector.indexOf(this.DOM_CLASS_SELECTOR);
                var ieVersion = BrowserKit.getIEVersion();

                selector = selector.replace(this.DOM_SELECTORS_REGEX, '');

                // if none specified, by default the selector is an ID
                // this is also valid for IE6/7 (we force ID)
                if (hasIdSelector || (!hasIdSelector && !hasClassSelector) || (ieVersion >= 6 && ieVersion <= 7)) {
                    element = document.getElementById(selector);
                } else { // has class selector
                    var selResult;
                    // IE8
                    if (ieVersion === 8 && document.querySelectorAll) {
                        selector = this.DOM_CLASS_SELECTOR + selector;
                        selResult = document.querySelectorAll(selector);
                    } else if (document.getElementsByClassName) {
                        selResult = document.getElementsByClassName(selector);
                    }
                    if (selResult && selResult.length > 0) {
                        element = selResult[0];
                    }
                }
            }

            return element || fallbackElement;
        }
    }
};

module.exports = BrowserKit;
