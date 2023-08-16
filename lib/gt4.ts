/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-rest-params */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck GeeTest typescript sucks

// "v4.1.4 Geetest Inc.";

interface CaptchaOptions {
    captchaId: string;
    product?: string;
    nativeButton?: string;
    rem?: number;
    language?: string;
    protocol?: string;
    timeout?: number;
    hideBar?: string[];
    mask?: {
        outside: boolean;
        bgColor: string;
    };
    apiServers?: string[];
    nextWidth?: string;
    riskType?: string;
    offlineCb?: () => void;
    onError?: () => void;
    hideSuccess?: boolean;
    userInfo?: string;
}

export function GT4Init() {
    "use strict";
    if (typeof window === "undefined") {
        throw new Error("Geetest requires browser environment");
    }

    const { document } = window;
    const { Math } = window;
    const head = document.getElementsByTagName("head")[0];
    const TIMEOUT = 10000;

    function _Object(obj) {
        this._obj = obj;
    }

    _Object.prototype = {
        _each: function (process) {
            const { _obj } = this;
            for (const k in _obj) {
                if (Object.prototype.hasOwnProperty.call(_obj, k)) {
                    process(k, _obj[k]);
                }
            }
            return this;
        },
        _extend: function (obj) {
            const self = this;
            new _Object(obj)._each(function (key, value) {
                self._obj[key] = value;
            });
        }
    };

    const uuid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };

    function Config(config: CaptchaOptions): CaptchaOptions {
        const self = this;
        new _Object(config)._each(function (key, value) {
            self[key] = value;
        });
    }

    Config.prototype = {
        apiServers: ["gcaptcha4.geetest.com", "gcaptcha4.geevisit.com", "gcaptcha4.gsensebot.com"],
        staticServers: ["static.geetest.com", "static.geevisit.com", "dn-staticdown.qbox.me"],
        protocol: "http://",
        typePath: "/load",
        fallback_config: {
            bypass: {
                staticServers: ["static.geetest.com", "static.geevisit.com", "dn-staticdown.qbox.me"],
                type: "bypass",
                bypass: "/v4/bypass.js"
            }
        },
        _get_fallback_config: function () {
            const self = this;
            if (isString(self.type)) {
                return self.fallback_config[self.type];
            } else {
                return self.fallback_config.bypass;
            }
        },
        _extend: function (obj) {
            const self = this;
            new _Object(obj)._each(function (key, value) {
                self[key] = value;
            });
        }
    };
    const isNumber = function (value) {
        return typeof value === "number";
    };
    const isString = function (value) {
        return typeof value === "string";
    };
    const isBoolean = function (value) {
        return typeof value === "boolean";
    };
    const isObject = function (value) {
        return typeof value === "object" && value !== null;
    };
    const isFunction = function (value) {
        return typeof value === "function";
    };
    const MOBILE = /Mobi/i.test(navigator.userAgent);

    const callbacks = {};
    const status = {};

    const random = function () {
        return parseInt(Math.random() * 10000) + new Date().valueOf();
    };

    // bind å‡½æ•°polify, ä¸å¸¦newåŠŸèƒ½çš„bind

    const bind = function (target, context) {
        if (typeof target !== "function") {
            return;
        }
        const args = Array.prototype.slice.call(arguments, 2);

        if (Function.prototype.bind) {
            return target.bind(context, args);
        } else {
            return function () {
                const _args = Array.prototype.slice.call(arguments);
                return target.apply(context, args.concat(_args));
            };
        }
    };

    const { toString } = Object.prototype;

    const _isFunction = function (obj) {
        return typeof obj === "function";
    };
    const _isObject = function (obj) {
        return obj === Object(obj);
    };
    const _isArray = function (obj) {
        return toString.call(obj) === "[object Array]";
    };
    const _isDate = function (obj) {
        return toString.call(obj) === "[object Date]";
    };
    const _isRegExp = function (obj) {
        return toString.call(obj) === "[object RegExp]";
    };
    const _isBoolean = function (obj) {
        return toString.call(obj) === "[object Boolean]";
    };

    function resolveKey(input) {
        return input.replace(/(\S)(_([a-zA-Z]))/g, function (match, $1, $2, $3) {
            return $1 + $3.toUpperCase() || "";
        });
    }

    function camelizeKeys(input, convert) {
        if (!_isObject(input) || _isDate(input) || _isRegExp(input) || _isBoolean(input) || _isFunction(input)) {
            return convert ? resolveKey(input) : input;
        }
        let temp = undefined;

        if (_isArray(input)) {
            temp = [];
            for (let i = 0; i < input.length; i++) {
                temp.push(camelizeKeys(input[i]));
            }
        } else {
            temp = {};
            for (const prop in input) {
                if (Object.prototype.hasOwnProperty.call(input, prop)) {
                    temp[camelizeKeys(prop, true)] = camelizeKeys(input[prop]);
                }
            }
        }
        return temp;
    }

    const loadScript = function (url: string, cb: (_: boolean) => void, timeout: number) {
        const script = document.createElement("script");
        script.charset = "UTF-8";
        script.async = true;

        // å¯¹geetestçš„é™æ€èµ„æºæ·»åŠ  crossOrigin
        if (/static\.geetest\.com/g.test(url)) {
            script.crossOrigin = "anonymous";
        }

        script.onerror = function () {
            cb(true);
            // é”™è¯¯è§¦å‘äº†ï¼Œè¶…æ—¶é€»è¾‘å°±ä¸ç”¨äº†
            loaded = true;
        };
        let loaded = false;
        script.onload = script.onreadystatechange = function () {
            if (!loaded && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
                loaded = true;
                setTimeout(function () {
                    cb(false);
                }, 0);
            }
        };
        script.src = url;
        head.appendChild(script);

        setTimeout(function () {
            if (!loaded) {
                script.onerror = script.onload = null;
                script.remove && script.remove();
                cb(true);
            }
        }, timeout || TIMEOUT);
    };

    const normalizeDomain = function (domain) {
        // special domain: uems.sysu.edu.cn/jwxt/geetest/
        // return domain.replace(/^https?:\/\/|\/.*$/g, ''); uems.sysu.edu.cn
        return domain.replace(/^https?:\/\/|\/$/g, ""); // uems.sysu.edu.cn/jwxt/geetest
    };
    const normalizePath = function (path) {
        path = path.replace(/\/+/g, "/");
        if (path.indexOf("/") !== 0) {
            path = "/" + path;
        }
        return path;
    };
    const normalizeQuery = function (query) {
        if (!query) {
            return "";
        }
        let q = "?";
        new _Object(query)._each(function (key, value) {
            if (isString(value) || isNumber(value) || isBoolean(value)) {
                q = q + encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
            }
        });
        if (q === "?") {
            q = "";
        }
        return q.replace(/&$/, "");
    };
    const makeURL = function (protocol, domain, path, query) {
        domain = normalizeDomain(domain);

        let url = normalizePath(path) + normalizeQuery(query);
        if (domain) {
            url = protocol + domain + url;
        }

        return url;
    };

    const load = function (config: CaptchaOptions, protocol: "http://" | "https://", domains: string[], path: string, query, cb: (_: boolean) => void, handleCb: (_: boolean) => void) {
        const tryRequest = function (at) {
            let cbName = undefined;
            // å¤„ç†jsonpå›žè°ƒï¼Œè¿™é‡Œä¸ºäº†ä¿è¯æ¯ä¸ªä¸åŒjsonpéƒ½æœ‰å”¯ä¸€çš„å›žè°ƒå‡½æ•°
            if (handleCb) {
                cbName = "geetest_" + random();
                // éœ€è¦ä¸Žé¢„å…ˆå®šä¹‰å¥½cbnameå‚æ•°ï¼Œåˆ é™¤å¯¹è±¡
                window[cbName] = bind(handleCb, null, cbName);
                query.callback = cbName;
            }
            const url = makeURL(protocol, domains[at], path, query);
            loadScript(
                url,
                function (err) {
                    if (err) {
                        // è¶…æ—¶æˆ–è€…å‡ºé”™çš„æ—¶å€™ ç§»é™¤å›žè°ƒ
                        if (cbName) {
                            try {
                                window[cbName] = function () {
                                    window[cbName] = null;
                                };
                            } catch (e) { return; }
                        }

                        if (at >= domains.length - 1) {
                            cb(true);
                            // report gettype error
                        } else {
                            tryRequest(at + 1);
                        }
                    } else {
                        cb(false);
                    }
                },
                config.timeout
            );
        };
        tryRequest(0);
    };

    const jsonp = function (domains: string[], path: string, config: CaptchaOptions, callback: () => void) {
        const handleCb = function (cbName, data) {
            // ä¿è¯åªæ‰§è¡Œä¸€æ¬¡ï¼Œå…¨éƒ¨è¶…æ—¶çš„æƒ…å†µä¸‹ä¸ä¼šå†è§¦å‘;

            if (data.status === "success") {
                callback(data.data);
            } else if (!data.status) {
                callback(data);
            } else {
                // æŽ¥å£æœ‰è¿”å›žï¼Œä½†æ˜¯è¿”å›žäº†é”™è¯¯çŠ¶æ€ï¼Œè¿›å…¥æŠ¥é”™é€»è¾‘
                callback(data);
            }
            window[cbName] = undefined;
            try {
                delete window[cbName];
            } catch (e) { return; }
        };

        load(
            config,
            config.protocol,
            domains,
            path,
            {
                captcha_id: config.captchaId,
                challenge: config.challenge || uuid(),
                client_type: MOBILE ? "h5" : "web",
                risk_type: config.riskType,
                call_type: config.callType,
                lang: config.language
                    ? config.language
                    : navigator.appName === "Netscape"
                        ? navigator.language.toLowerCase()
                        : navigator.userLanguage.toLowerCase()
            },
            function (err) {
                // ç½‘ç»œé—®é¢˜æŽ¥å£æ²¡æœ‰è¿”å›žï¼Œç›´æŽ¥ä½¿ç”¨æœ¬åœ°éªŒè¯ç ï¼Œèµ°å®•æœºæ¨¡å¼
                // è¿™é‡Œå¯ä»¥æ·»åŠ ç”¨æˆ·çš„é€»è¾‘
                if (err && typeof config.offlineCb === "function") {
                    // æ‰§è¡Œè‡ªå·±çš„å®•æœº
                    config.offlineCb();
                    return;
                }

                if (err) {
                    callback(config._get_fallback_config());
                }
            },
            handleCb
        );
    };

    const throwError = function (errorType, config, errObj) {
        const errors = {
            networkError: "ç½‘ç»œé”™è¯¯",
            gtTypeError: "gtå­—æ®µä¸æ˜¯å­—ç¬¦ä¸²ç±»åž‹"
        };
        if (typeof config.onError === "function") {
            config.onError({
                desc: errObj.desc,
                msg: errObj.msg,
                code: errObj.code
            });
        } else {
            throw new Error(errors[errorType]);
        }
    };

    const detect = function () {
        return window.Geetest || document.getElementById("gt_lib");
    };

    if (detect()) {
        status.slide = "loaded";
    }
    const GeetestIsLoad = function (fname: string) {
        let GeetestIsLoad = false;
        const tags = { js: "script", css: "link" };
        const tagname = tags[fname.split(".").pop()];
        if (tagname !== undefined) {
            const elts = document.getElementsByTagName(tagname);
            for (const i in elts) {
                if ((elts[i].href && elts[i].href.toString().indexOf(fname) > 0) || (elts[i].src && elts[i].src.toString().indexOf(fname) > 0)) {
                    GeetestIsLoad = true;
                }
            }
        }
        return GeetestIsLoad;
    };

    const init = function (userConfig, callback: (c) => void) {
        const config = new Config(userConfig) as CaptchaOptions;
        if (userConfig.https) {
            config.protocol = "https://";
        } else if (!userConfig.protocol) {
            config.protocol = window.location.protocol + "//";
        }

        if (isObject(userConfig.getType)) {
            config._extend(userConfig.getType);
        }

        jsonp(config.apiServers, config.typePath, config, function (newConfig) {
            // é”™è¯¯æ•èŽ·ï¼Œç¬¬ä¸€ä¸ªloadè¯·æ±‚å¯èƒ½ç›´æŽ¥æŠ¥é”™
            newConfig = camelizeKeys(newConfig);

            if (newConfig.status === "error") {
                return throwError("networkError", config, newConfig);
            }

            const { type } = newConfig;

            if (config.debug) {
                new _Object(newConfig)._extend(config.debug);
            }
            const init = function () {
                config._extend(newConfig);
                callback(new window.Geetest4(config));
            };

            callbacks[type] = callbacks[type] || [];

            const s = status[type] || "init";
            if (s === "init") {
                status[type] = "loading";

                callbacks[type].push(init);

                if (newConfig.gctPath) {
                    load(
                        config,
                        config.protocol,
                        Object.hasOwnProperty.call(config, "staticServers") ? config.staticServers : newConfig.staticServers || config.staticServers,
                        newConfig.gctPath,
                        null,
                        function (err) {
                            if (err) {
                                throwError("networkError", config, {
                                    code: "60205",
                                    msg: "Network failure",
                                    desc: {
                                        detail: "gct resource load timeout"
                                    }
                                });
                            }
                        }
                    );
                }

                load(
                    config,
                    config.protocol,
                    Object.hasOwnProperty.call(config, "staticServers") ? config.staticServers : newConfig.staticServers || config.staticServers,
                    newConfig.bypass || newConfig.staticPath + newConfig.js,
                    null,
                    function (err) {
                        if (err) {
                            status[type] = "fail";
                            throwError("networkError", config, {
                                code: "60204",
                                msg: "Network failure",
                                desc: {
                                    detail: "js resource load timeout"
                                }
                            });
                        } else {
                            status[type] = "loaded";
                            const cbs = callbacks[type];
                            for (let i = 0, len = cbs.length; i < len; i += 1) {
                                const cb = cbs[i];
                                if (isFunction(cb)) {
                                    cb();
                                }
                            }
                            callbacks[type] = [];
                        }
                    }
                );
            } else if (s === "loaded") {
                // åˆ¤æ–­gctæ˜¯å¦éœ€è¦é‡æ–°åŠ è½½
                if (!GeetestIsLoad(newConfig.gctPath)) {
                    load(
                        config,
                        config.protocol,
                        Object.hasOwnProperty.call(config, "staticServers") ? config.staticServers : newConfig.staticServers || config.staticServers,
                        newConfig.gctPath,
                        null,
                        function (err) {
                            if (err) {
                                throwError("networkError", config, {
                                    code: "60205",
                                    msg: "Network failure",
                                    desc: {
                                        detail: "gct resource load timeout"
                                    }
                                });
                            }
                        }
                    );
                }
                return init();
            } else if (s === "fail") {
                throwError("networkError", config, {
                    code: "60204",
                    msg: "Network failure",
                    desc: {
                        detail: "js resource load timeout"
                    }
                });
            } else if (s === "loading") {
                callbacks[type].push(init);
            }
        });
    };

    return { init };

}