var B = Object.defineProperty;
var G = (t, e, n) => e in t ? B(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var A = (t, e, n) => (G(t, typeof e != "symbol" ? e + "" : e, n), n);
import W from "axios";
import { createAction as X } from "redux-actions";
import H from "memoize-state";
let T;
const J = (t = "http://localhost:3000") => {
  T = W.create({
    baseURL: t,
    headers: {
      "Content-Type": "application/json"
    },
    method: "get"
  });
}, q = (t) => {
  if (typeof T > "u")
    throw new Error("need init axios instance");
  {
    const { data: e, token: n } = t;
    return T({ ...e }).then((r) => r).catch((r) => {
      const { statusText: o, status: a } = r.response || {};
      throw {
        statusText: o,
        status: a,
        response: r.response
      };
    });
  }
}, je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  axios: q,
  init: J
}, Symbol.toStringTag, { value: "Module" })), Y = function(t, e) {
  e = Object.assign({}, {
    responseDataPrepare: void 0,
    preventSuccess: !1,
    preventFailure: !1,
    postSaveToStoreCallback: !1
  }, e);
  const r = X(t);
  return (o, a) => {
    const s = r(o);
    return typeof s < "u" && typeof a < "u" && (s.onFailure = a.onFailure, s.onSuccess = a.onSuccess, s.key = a.key, s.preventSuccess = a.preventSuccess, s.preventFailure = a.preventFailure, s.postSaveToStoreCallback = a.postSaveToStoreCallback), s.responseDataPrepare = e.responseDataPrepare, s;
  };
};
function L(t) {
  const e = t.replace("_REQUEST", "_SUCCESS"), n = t.replace("_REQUEST", "_FAILED");
  return {
    successAction: e,
    failedAction: n
  };
}
const Z = H(function(t, e) {
  const r = {
    onlyResultObject: !0,
    filter: "success",
    resultPrepareCallback: void 0,
    key: void 0,
    initialData: (() => {
      const a = [];
      return a.loaded = !1, a;
    })()
  }, o = Object.assign({}, r, e);
  if (/^.*_REQUEST$/.test(t)) {
    const a = t.split("_REQUEST")[0];
    return function(s) {
      let u = {
        status: !1
      };
      const f = `${a}_FAILED${o.key ? o.key : ""}`, l = `${a}_SUCCESS${o.key ? o.key : ""}`;
      let c = 0;
      f in s.api && (c = s.api[f].timestamp || 0, u = Object.assign(u, s.api[f]), u.status = "failed"), l in s.api && c < (s.api[l].timestamp || 0) && (u = Object.assign(u, s.api[l]), u.status = "success");
      let d = u;
      switch (o.onlyResultObject && (typeof u.responseData < "u" ? d = u.responseData : d = o.initialData), !0) {
        case o.filter === u.status: {
          typeof d == "object" && d !== null && (d.loaded = !0);
          break;
        }
        case o.filter === !1: {
          typeof d == "object" && d !== null && (d.loaded = !0);
          break;
        }
        default:
          d = o.initialData;
      }
      return typeof o.resultPrepareCallback == "function" ? o.resultPrepareCallback(d) : d;
    };
  } else
    throw new Error("Action Name incorrect! Check: " + t);
}), ee = (t, e = "/") => {
  const n = t.split("_REQUEST")[0], r = n + "_FAILED", o = n + "_SUCCESS", a = {};
  return a[o.split(e)[1]] = o, a[r.split(e)[1]] = r, a[t.split(e)[1]] = t, a;
}, Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  actionCreator: Y,
  apiSelector: Z,
  getConstantsFromRequestConstant: ee,
  responseActionsTypes: L
}, Symbol.toStringTag, { value: "Module" }));
class te {
  constructor() {
    A(this, "routes", {});
    A(this, "add", (e, n) => {
      if (typeof n == "function")
        e in this.routes && console.warn("Check your key! This key is already in use."), this.routes[e] = n;
      else
        throw new Error("Check your arguments");
    });
  }
}
const x = (() => {
  let t;
  return function() {
    return t || (t = new te()), t;
  };
})(), ne = x();
var O = function(e) {
  return "@@redux-saga/" + e;
}, re = /* @__PURE__ */ O("CANCEL_PROMISE"), P = /* @__PURE__ */ O("IO"), oe = /* @__PURE__ */ O("MULTICAST"), ae = function(e) {
  return e == null;
}, y = function(e) {
  return e != null;
}, v = function(e) {
  return typeof e == "function";
}, F = function(e) {
  return typeof e == "string";
}, b = Array.isArray, se = function(e) {
  return e && !b(e) && typeof e == "object";
}, $ = function t(e) {
  return e && (F(e) || ie(e) || v(e) || b(e) && e.every(t));
}, k = function(e) {
  return e && v(e.take) && v(e.close);
}, ue = function(e) {
  return v(e) && e.hasOwnProperty("toString");
}, ie = function(e) {
  return !!e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype;
}, fe = function(e) {
  return k(e) && e[oe];
}, le = function(e) {
  return e && e[P];
}, w = 2147483647;
function ce(t, e) {
  if (e === void 0 && (e = !0), process.env.NODE_ENV !== "production" && t > w)
    throw new Error("delay only supports a maximum value of " + w + "ms");
  var n, r = new Promise(function(o) {
    n = setTimeout(o, Math.min(w, t), e);
  });
  return r[re] = function() {
    clearTimeout(n);
  }, r;
}
process.env.NODE_ENV !== "production" && typeof Proxy < "u";
function i(t, e, n) {
  if (!e(t))
    throw new Error(n);
}
var de = function(e) {
  throw e;
}, pe = function(e) {
  return {
    value: e,
    done: !0
  };
};
function ye(t, e, n) {
  e === void 0 && (e = de), n === void 0 && (n = "iterator");
  var r = {
    meta: {
      name: n
    },
    next: t,
    throw: e,
    return: pe,
    isSagaIterator: !0
  };
  return typeof Symbol < "u" && (r[Symbol.iterator] = function() {
    return r;
  }), r;
}
var h = "TAKE", ve = "PUT", me = "CALL", Se = "FORK", m = function(e, n) {
  var r;
  return r = {}, r[P] = !0, r.combinator = !1, r.type = e, r.payload = n, r;
};
function Ee(t, e) {
  if (t === void 0 && (t = "*"), process.env.NODE_ENV !== "production" && arguments.length && i(arguments[0], y, "take(patternOrChannel): patternOrChannel is undefined"), $(t))
    return y(e) && console.warn("take(pattern) takes one argument but two were provided. Consider passing an array for listening to several action types"), m(h, {
      pattern: t
    });
  if (fe(t) && y(e) && $(e))
    return m(h, {
      channel: t,
      pattern: e
    });
  if (k(t))
    return y(e) && console.warn("take(channel) takes one argument but two were provided. Second argument is ignored."), m(h, {
      channel: t
    });
  if (process.env.NODE_ENV !== "production")
    throw new Error("take(patternOrChannel): argument " + t + " is not valid channel or a valid pattern");
}
function ge(t, e) {
  return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? (i(t, y, "put(channel, action): argument channel is undefined"), i(t, k, "put(channel, action): argument " + t + " is not a valid channel"), i(e, y, "put(channel, action): argument action is undefined")) : i(t, y, "put(action): argument action is undefined")), ae(e) && (e = t, t = void 0), m(ve, {
    channel: t,
    action: e
  });
}
var M = function(e, n) {
  if (i(n, y, e + ": argument fn is undefined or null"), !v(n)) {
    var r = null, o;
    if (b(n))
      r = n[0], o = n[1], i(o, y, e + ": argument of type [context, fn] has undefined or null `fn`");
    else if (se(n))
      r = n.context, o = n.fn, i(o, y, e + ": argument of type {context, fn} has undefined or null `fn`");
    else {
      i(n, v, e + ": argument fn is not function");
      return;
    }
    if (r && F(o)) {
      i(r[o], v, e + ': context arguments has no such method - "' + o + '"');
      return;
    }
    i(o, v, e + ": unpacked fn argument (from [context, fn] or {context, fn}) is not a function");
  }
};
function V(t, e) {
  var n = null, r;
  return v(t) ? r = t : (b(t) ? (n = t[0], r = t[1]) : (n = t.context, r = t.fn), n && F(r) && v(n[r]) && (r = n[r])), {
    context: n,
    fn: r,
    args: e
  };
}
var be = function(e) {
  return e !== ke;
};
function Q(t) {
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
    n[r - 1] = arguments[r];
  if (process.env.NODE_ENV !== "production") {
    var o = typeof n[0] == "number" ? n[0] : "ms";
    i(t, be, "instead of writing `yield call(delay, " + o + ")` where delay is an effect from `redux-saga/effects` you should write `yield delay(" + o + ")`"), M("call", t);
  }
  return m(me, V(t, n));
}
function z(t) {
  process.env.NODE_ENV !== "production" && (M("fork", t), i(t, function(o) {
    return !le(o);
  }, "fork: argument must not be an effect"));
  for (var e = arguments.length, n = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
    n[r - 1] = arguments[r];
  return m(Se, V(t, n));
}
var ke = /* @__PURE__ */ Q.bind(null, ce), D = function(e) {
  return {
    done: !0,
    value: e
  };
}, C = {};
function Ae(t) {
  return k(t) ? "channel" : ue(t) ? String(t) : v(t) ? t.name : String(t);
}
function we(t, e, n) {
  var r, o, a, s = e;
  function u(f, l) {
    if (s === C)
      return D(f);
    if (l && !o)
      throw s = C, l;
    r && r(f);
    var c = l ? t[o](l) : t[s]();
    return s = c.nextState, a = c.effect, r = c.stateUpdater, o = c.errorState, s === C ? D(f) : a;
  }
  return ye(u, function(f) {
    return u(null, f);
  }, n);
}
function he(t, e) {
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
    r[o - 2] = arguments[o];
  var a = {
    done: !1,
    value: Ee(t)
  }, s = function(c) {
    return {
      done: !1,
      value: z.apply(void 0, [e].concat(r, [c]))
    };
  }, u, f = function(c) {
    return u = c;
  };
  return we({
    q1: function() {
      return {
        nextState: "q2",
        effect: a,
        stateUpdater: f
      };
    },
    q2: function() {
      return {
        nextState: "q1",
        effect: s(u)
      };
    }
  }, "q1", "takeEvery(" + Ae(t) + ", " + e.name + ")");
}
var Ce = function(e, n, r) {
  i(n, y, e.name + " requires a pattern or channel"), i(r, y, e.name + " requires a saga parameter");
};
function K(t, e) {
  process.env.NODE_ENV !== "production" && Ce(K, t, e);
  for (var n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
    r[o - 2] = arguments[o];
  return z.apply(void 0, [he, t, e].concat(r));
}
const I = x();
function* Te(t, e, n) {
  const o = { ...{
    apiService: q,
    additiveCallback: null,
    successCallback: null,
    failedCallback: null,
    stopRequest: () => !1,
    preventSuccessAction: !1,
    preventFailedAction: !1,
    call: Q,
    put: ge
  }, ...n }, {
    additiveCallback: a,
    apiService: s,
    successCallback: u,
    failedCallback: f,
    stopRequest: l,
    preventSuccessAction: c,
    preventFailedAction: d,
    call: S,
    put: N
  } = o, _ = e[t.type];
  if (typeof _ == "function") {
    let E = _(t.payload);
    typeof a == "function" && (E = yield S(a, E));
    const j = L(t.type);
    try {
      if (!l(E)) {
        typeof t.beforeRequestCallback == "function" && t.beforeRequestCallback(E);
        let p = yield S(s, {
          data: E
        });
        typeof t.onSuccess == "function" && t.onSuccess(p), typeof u == "function" && (yield S(u, p)), typeof t.responseDataPrepare == "function" && (p = t.responseDataPrepare(p)), c || t.preventSuccess || (yield N({
          response: p,
          type: j.successAction,
          payload: t.payload,
          key: t.key
        })), typeof t.postSaveToStoreCallback == "function" && (yield S(t.postSaveToStoreCallback, p));
      }
    } catch (p) {
      console.error(p);
      const U = {
        type: j.failedAction,
        payload: t.payload,
        message: p.statusText,
        status: p.status,
        response: p.response,
        key: t.key
      };
      typeof t.onFailure == "function" && t.onFailure(p), typeof f == "function" && (yield S(f, U)), d || t.preventFailure || (yield N(U));
    }
  } else
    throw new Error(
      `Api method: [${t.type}]() isn't defined. Please, create it! Or use another name of action!`
    );
}
function* Re(t = {}, e = K) {
  yield e("*", function* (n) {
    /^.*_REQUEST$/.test(n.type) && I.routes[n.type] && (yield Te(n, I.routes, t));
  });
}
const R = {}, g = function(t = R, e, n) {
  const r = { ...t };
  return r[e] = n, r;
};
function xe(t = R, e) {
  var a, s;
  const n = /^.*_REQUEST$/.test(e.type), r = /^.*_CLEAR$/.test(e.type), o = e.type === "FORCE_CLEAR_ALL_API";
  if (typeof e.response < "u" && typeof e.response.data < "u" || n || r || o)
    switch (!0) {
      case n:
        return g(
          t,
          `${e.type}${e.key ? e.key : ""}`,
          Object.assign({}, e, { loading: !0 })
        );
      case /^.*_SUCCESS$/.test(e.type):
        return g(
          t,
          `${e.type}${e.key ? e.key : ""}`,
          Object.assign(
            {},
            { responseData: (a = e.response) == null ? void 0 : a.data },
            { loading: !1, loaded: !0, timestamp: Date.now() }
          )
        );
      case /^.*_FAILED$/.test(e.type):
        return g(
          t,
          `${e.type}${e.key ? e.key : ""}`,
          Object.assign(
            {},
            { responseData: (s = e.response) == null ? void 0 : s.data },
            {
              loading: !1,
              loaded: !1,
              timestamp: Date.now()
            }
          )
        );
      case r:
        return g(
          t,
          `${e.type.replace("CLEAR", "SUCCESS")}${e.key ? e.key : ""}`,
          {}
        );
      case o:
        return R;
      default:
        return t;
    }
  else
    return t;
}
const $e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ApiRoutes: x,
  apiDefaultReducer: xe,
  apiRoutes: ne,
  apiWatchRequest: Re
}, Symbol.toStringTag, { value: "Module" }));
export {
  je as axios,
  Ue as helpers,
  $e as modules
};
