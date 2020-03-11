(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


var protocols = {
  previewImage: previewImage };

var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 14:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ 15:
/*!************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/store/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 16));
var _user = _interopRequireDefault(__webpack_require__(/*! ./modules/user */ 17));
var _getters = _interopRequireDefault(__webpack_require__(/*! ./getters */ 26));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  modules: {
    user: _user.default },

  getters: _getters.default });var _default =


store;exports.default = _default;

/***/ }),

/***/ 16:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 17:
/*!*******************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/store/modules/user.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _login = __webpack_require__(/*! @/api/login */ 18);






var _auth = __webpack_require__(/*! @/utils/auth */ 25);










var user = {
  state: {
    ltabbar: 'home',
    token: (0, _auth.getToken)(),
    member: (0, _auth.getMember)(),
    address: (0, _auth.getAddress)() ? (0, _auth.getAddress)() : {
      province: null,
      city: null,
      area: null,
      citys: '全国' },

    register: false,
    audit: false },


  mutations: {
    SET_TOKEN: function SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_LTABBAR: function SET_LTABBAR(state, ltabbar) {
      state.ltabbar = ltabbar;
    },
    SET_MEMBER: function SET_MEMBER(state, member) {
      state.member = member;
      (0, _auth.setMember)(member);
    },
    SET_ADDRESS: function SET_ADDRESS(state, address) {
      state.address = address;
      (0, _auth.setAddress)(address);
    },
    SET_AUDIT: function SET_AUDIT(state, audit) {
      state.audit = audit;
    },
    SET_REGISTER: function SET_REGISTER(state, register) {
      state.register = register;
    } },


  actions: {
    // 微信用户自动登录
    Login: function Login(_ref, wx) {var commit = _ref.commit;
      return new Promise(function (resolve, reject) {
        (0, _login.login)(wx).then(function (response) {
          var data = response.data;
          if (data.token) {
            (0, _auth.setToken)(data.token);
            commit('SET_TOKEN', data.token);
          }
          if (data.member) {
            commit('SET_MEMBER', data.member);
          }
          if (data.register) {
            commit('SET_REGISTER', data.register);
          }
          resolve(data);
        }).catch(function (error) {
          reject(error);
        });
      });
    },
    Logins: function Logins(_ref2) {var commit = _ref2.commit;
      return new Promise(function (resolve, reject) {
        (0, _login.logins)().then(function (response) {
          var data = response.data;
          if (data.token) {
            (0, _auth.setToken)(data.token);
            commit('SET_TOKEN', data.token);
          }
          if (data.member) {
            commit('SET_MEMBER', data.member);
          }
          if (data.register) {
            commit('SET_REGISTER', data.register);
          }
          resolve(data);
        }).catch(function (error) {
          reject(error);
        });
      });
    },
    // app用户登录
    appLogin: function appLogin(_ref3, app) {var commit = _ref3.commit;
      return new Promise(function (resolve) {
        (0, _auth.setToken)(app.token);
        if (app.member) {
          (0, _auth.setMember)(app.member);
          commit('SET_MEMBER', app.member);
        }
        commit('SET_TOKEN', app.token);
        commit('SET_REGISTER', app.register);
        resolve();
      });
    },
    appLogins: function appLogins(_ref4) {var commit = _ref4.commit;
      return new Promise(function (resolve, reject) {
        (0, _login.applogins)().then(function (response) {
          var data = response.data;
          (0, _auth.setToken)(data.token);
          if (data.member) {
            (0, _auth.setMember)(data.member);
            commit('SET_MEMBER', data.member);
          }
          commit('SET_TOKEN', data.token);
          commit('SET_REGISTER', data.register);
          resolve();
        }).catch(function (error) {
          reject(error);
        });
      });
    },

    MemberAC: function MemberAC(_ref5) {var _this = this;var commit = _ref5.commit;
      // 修改军人认证
      return new Promise(function (resolve, reject) {
        (0, _login.getMemberAc)().then(function (response) {
          var r = response.data;
          var m = _this.getters.member;
          m.ac = r.detail.ac;
          commit('SET_MEMBER', m);
          resolve();
        }).catch(function (error) {
          reject(error);
        });
      });
    },

    upKey: function upKey(_ref6, wx) {var commit = _ref6.commit;
      return new Promise(function (resolve, reject) {
        (0, _login.upkey)(wx).then(function (response) {
          resolve(data);
        }).catch(function (error) {
          reject(error);
        });
      });
    },
    // 销毁本地TOKEN
    FedLogOut: function FedLogOut(_ref7) {var commit = _ref7.commit;
      return new Promise(function (resolve) {
        commit('SET_TOKEN', '');
        commit('SET_REGISTER', false);
        (0, _auth.removeToken)();
        (0, _auth.removeMember)();
        resolve();
      });
    } } };var _default =



user;exports.default = _default;

/***/ }),

/***/ 18:
/*!**********************************************!*\
  !*** C:/Users/Admin/Desktop/归档/api/login.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.login = login;exports.logins = logins;exports.applogin = applogin;exports.upLoginPwd = upLoginPwd;exports.upkey = upkey;exports.getLoginCode = getLoginCode;exports.getPwdCode = getPwdCode;exports.applogins = applogins;exports.getMemberAc = getMemberAc;var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 19));
var _requests = _interopRequireDefault(__webpack_require__(/*! @/utils/requests */ 24));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
function login(wx) {
  return _requests.default.post('/job/login', wx);
}

function logins(wx) {
  return _request.default.post('/job/login', wx);
}

function applogin(app) {
  return _requests.default.post('/job/login/app', app);
}

function upLoginPwd(app) {
  return _requests.default.post('/job/login/pwd', app);
}

function upkey(wx) {
  return _request.default.post('/job/sessionkey/update', wx);
}

function getLoginCode(wx) {
  return _requests.default.get('/job/login/code', wx);
}

function getPwdCode(wx) {
  return _requests.default.get('/job/pwd/code', wx);
}

function applogins(app) {
  return _request.default.post('/job/login/app', app);
}

function getMemberAc(wx) {
  return _request.default.get('/job/member/ac', wx);
}

/***/ }),

/***/ 19:
/*!**************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/request.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _regenerator = _interopRequireDefault(__webpack_require__(/*! ./node_modules/@babel/runtime/regenerator */ 20));var _store = _interopRequireDefault(__webpack_require__(/*! @/store */ 15));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}
// import { getToken } from '@/utils/auth'
var Fly = __webpack_require__(/*! flyio/dist/npm/wx */ 23);
var fly = new Fly();
fly.config.baseURL = 'https://jy.baifanapi.com';
// fly.config.baseURL = 'http://127.0.0.1:7001'
fly.interceptors.request.use(function (request) {
  if (!_store.default.getters.token) {






    if (_store.default.getters.register) {
      fly.lock();
      var wxsys;
      uni.getSystemInfo({
        success: function success(res) {
          wxsys = res;
        } });

      var code = new Promise(function (resolve, reject) {
        uni.login({
          provider: 'weixin',
          success: function success(res) {
            resolve(res.code.trim());
          } });

      });
      return code.then( /*#__PURE__*/function () {var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee(codes) {return _regenerator.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                    _store.default.dispatch('Login', {
                      code: codes,
                      systemInfo: wxsys }).
                    then(function (res) {
                      request.headers['X-Token'] = res.token;
                    }));case 2:return _context.abrupt("return",
                  request);case 3:case "end":return _context.stop();}}}, _callee, this);}));return function (_x) {return _ref.apply(this, arguments);};}()).
      finally(function () {
        fly.unlock();
      });
    } else {
      // 跳转授权注册页面
      uni.navigateTo({
        url: '/pages/login/wx' });

    }

  } else {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    request.headers['X-Token'] = _store.default.getters.token;

    // uni.checkSession({
    // 	fail: () => {
    // 		uni.login({
    // 			provider: 'weixin',
    // 			success: res => {
    // 				store.dispatch('upKey', {
    // 					code: res.code.trim(),
    // 				})
    // 			}
    // 		});
    // 	}
    // });

  }
});
// response 拦截器
fly.interceptors.response.use(
function (response) {
  /**
                      * code为非20000是抛错 可结合自己业务进行修改
                      */
  var res = response.data;
  if (res.code !== 20000 && res.code === 40000) {






    // 销毁本地Token

    console.log(_store.default.getters);
    if (_store.default.getters.register) {
      fly.lock();
      var wxsys;
      uni.getSystemInfo({
        success: function success(res) {
          wxsys = res;
        } });

      var code = new Promise(function (resolve, reject) {
        uni.login({
          provider: 'weixin',
          success: function success(res) {
            resolve(res.code.trim());
          } });

      });
      return code.then( /*#__PURE__*/function () {var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator.default.mark(function _callee2(codes) {return _regenerator.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                    _store.default.dispatch('FedLogOut'));case 2:_context2.next = 4;return (
                    _store.default.dispatch('Login', {
                      code: codes,
                      systemInfo: wxsys }).
                    then(function (res) {
                      response.request.headers['X-Token'] = res.token;
                    }));case 4:case "end":return _context2.stop();}}}, _callee2, this);}));return function (_x2) {return _ref2.apply(this, arguments);};}()).
      finally(function () {
        fly.unlock();
      }).then(function () {
        console.log(response);
        return fly.request(response.request);
      });
    } else {
      _store.default.dispatch('FedLogOut');
    }

  } else if (res.code === 20000) {
    return response.data;
  } else {
    return Promise.reject('error');
  }
},
function (error) {
  return Promise.reject(error);
});var _default =

fly;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"NODE_ENV":"development","VUE_APP_PLATFORM":"mp-weixin","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 20:
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 21);


/***/ }),

/***/ 21:
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 22);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 22:
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ 23:
/*!*******************************************!*\
  !*** ./node_modules/flyio/dist/npm/wx.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else { var i, a; }
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = {
    type: function type(ob) {
        return Object.prototype.toString.call(ob).slice(8, -1).toLowerCase();
    },
    isObject: function isObject(ob, real) {
        if (real) {
            return this.type(ob) === "object";
        } else {
            return ob && (typeof ob === 'undefined' ? 'undefined' : _typeof(ob)) === 'object';
        }
    },
    isFormData: function isFormData(val) {
        return typeof FormData !== 'undefined' && val instanceof FormData;
    },
    trim: function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    encode: function encode(val) {
        return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
    },
    formatParams: function formatParams(data) {
        var str = "";
        var first = true;
        var that = this;
        if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != "object") {
            return data;
        }
        function _encode(sub, path) {
            var encode = that.encode;
            var type = that.type(sub);
            if (type == "array") {
                sub.forEach(function (e, i) {
                    _encode(e, path + "%5B%5D");
                });
            } else if (type == "object") {
                for (var key in sub) {
                    if (path) {
                        _encode(sub[key], path + "%5B" + encode(key) + "%5D");
                    } else {
                        _encode(sub[key], encode(key));
                    }
                }
            } else {
                if (!first) {
                    str += "&";
                }
                first = false;
                str += path + "=" + encode(sub);
            }
        }

        _encode(data, "");
        return str;
    },

    // Do not overwrite existing attributes
    merge: function merge(a, b) {
        for (var key in b) {
            if (!a.hasOwnProperty(key)) {
                a[key] = b[key];
            } else if (this.isObject(b[key], 1) && this.isObject(a[key], 1)) {
                this.merge(a[key], b[key]);
            }
        }
        return a;
    }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * author: wendu
 * email: 824783146@qq.com
 **/

var util = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

//EngineWrapper can help  generating  a  http engine quickly through a adapter
function EngineWrapper(adapter) {
    var AjaxEngine = function () {
        function AjaxEngine() {
            _classCallCheck(this, AjaxEngine);

            this.requestHeaders = {};
            this.readyState = 0;
            this.timeout = 0; // 0 stands for no timeout
            this.responseURL = "";
            this.responseHeaders = {};
        }

        _createClass(AjaxEngine, [{
            key: "_call",
            value: function _call(name) {
                this[name] && this[name].apply(this, [].splice.call(arguments, 1));
            }
        }, {
            key: "_changeReadyState",
            value: function _changeReadyState(state) {
                this.readyState = state;
                this._call("onreadystatechange");
            }
        }, {
            key: "open",
            value: function open(method, url) {
                this.method = method;
                if (!url) {
                    url = location.href;
                } else {
                    url = util.trim(url);
                    if (url.indexOf("http") !== 0) {
                        // Normalize the request url
                        if (isBrowser) {
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }
                }
                this.responseURL = url;
                this._changeReadyState(1);
            }
        }, {
            key: "send",
            value: function send(arg) {
                var _this = this;

                arg = arg || null;
                var self = this;
                if (adapter) {
                    var request = {
                        method: self.method,
                        url: self.responseURL,
                        headers: self.requestHeaders || {},
                        body: arg
                    };
                    util.merge(request, self._options || {});
                    if (request.method === "GET") {
                        request.body = null;
                    }
                    self._changeReadyState(3);
                    var timer;
                    self.timeout = self.timeout || 0;
                    if (self.timeout > 0) {
                        timer = setTimeout(function () {
                            if (self.readyState === 3) {
                                _this._call("onloadend");
                                self._changeReadyState(0);
                                self._call("ontimeout");
                            }
                        }, self.timeout);
                    }
                    request.timeout = self.timeout;
                    adapter(request, function (response) {

                        function getAndDelete(key) {
                            var t = response[key];
                            delete response[key];
                            return t;
                        }

                        // If the request has already timeout, return
                        if (self.readyState !== 3) return;
                        clearTimeout(timer);

                        // Make sure the type of status is integer
                        self.status = getAndDelete("statusCode") - 0;

                        var responseText = getAndDelete("responseText");
                        var statusMessage = getAndDelete("statusMessage");

                        // Network error, set the status code 0
                        if (!self.status) {
                            self.statusText = responseText;
                            self._call("onerror", { msg: statusMessage });
                        } else {
                            // Parsing the response headers to array in a object,  because
                            // there may be multiple values with the same header name
                            var responseHeaders = getAndDelete("headers");
                            var headers = {};
                            for (var field in responseHeaders) {
                                var value = responseHeaders[field];
                                var key = field.toLowerCase();
                                // Is array
                                if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
                                    headers[key] = value;
                                } else {
                                    headers[key] = headers[key] || [];
                                    headers[key].push(value);
                                }
                            }
                            var cookies = headers["set-cookie"];
                            if (isBrowser && cookies) {
                                cookies.forEach(function (e) {
                                    // Remove the http-Only property of the  cookie
                                    // so that JavaScript can operate it.
                                    document.cookie = e.replace(/;\s*httpOnly/ig, "");
                                });
                            }
                            self.responseHeaders = headers;
                            // Set the fields of engine from response
                            self.statusText = statusMessage || "";
                            self.response = self.responseText = responseText;
                            self._response = response;
                            self._changeReadyState(4);
                            self._call("onload");
                        }
                        self._call("onloadend");
                    });
                } else {
                    console.error("Ajax require adapter");
                }
            }
        }, {
            key: "setRequestHeader",
            value: function setRequestHeader(key, value) {
                this.requestHeaders[util.trim(key)] = value;
            }
        }, {
            key: "getResponseHeader",
            value: function getResponseHeader(key) {
                return (this.responseHeaders[key.toLowerCase()] || "").toString() || null;
            }
        }, {
            key: "getAllResponseHeaders",
            value: function getAllResponseHeaders() {
                var str = "";
                for (var key in this.responseHeaders) {
                    str += key + ":" + this.getResponseHeader(key) + "\r\n";
                }
                return str || null;
            }
        }, {
            key: "abort",
            value: function abort(msg) {
                this._changeReadyState(0);
                this._call("onerror", { msg: msg });
                this._call("onloadend");
            }
        }], [{
            key: "setAdapter",
            value: function setAdapter(requestAdapter) {
                adapter = requestAdapter;
            }
        }]);

        return AjaxEngine;
    }();

    return AjaxEngine;
}

// learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = EngineWrapper;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

function KEEP(_,cb){cb();}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils = __webpack_require__(0);
var isBrowser = typeof document !== "undefined";

var Fly = function () {
    function Fly(engine) {
        _classCallCheck(this, Fly);

        this.engine = engine || XMLHttpRequest;

        this.default = this; //For typeScript

        /**
         * Add  lock/unlock API for interceptor.
         *
         * Once an request/response interceptor is locked, the incoming request/response
         * will be added to a queue before they enter the interceptor, they will not be
         * continued  until the interceptor is unlocked.
         *
         * @param [interceptor] either is interceptors.request or interceptors.response
         */
        function wrap(interceptor) {
            var resolve;
            var reject;

            function _clear() {
                interceptor.p = resolve = reject = null;
            }

            utils.merge(interceptor, {
                lock: function lock() {
                    if (!resolve) {
                        interceptor.p = new Promise(function (_resolve, _reject) {
                            resolve = _resolve;
                            reject = _reject;
                        });
                    }
                },
                unlock: function unlock() {
                    if (resolve) {
                        resolve();
                        _clear();
                    }
                },
                clear: function clear() {
                    if (reject) {
                        reject("cancel");
                        _clear();
                    }
                }
            });
        }

        var interceptors = this.interceptors = {
            response: {
                use: function use(handler, onerror) {
                    this.handler = handler;
                    this.onerror = onerror;
                }
            },
            request: {
                use: function use(handler) {
                    this.handler = handler;
                }
            }
        };

        var irq = interceptors.request;
        var irp = interceptors.response;
        wrap(irp);
        wrap(irq);

        this.config = {
            method: "GET",
            baseURL: "",
            headers: {},
            timeout: 0,
            params: {}, // Default Url params
            parseJson: true, // Convert response data to JSON object automatically.
            withCredentials: false
        };
    }

    _createClass(Fly, [{
        key: "request",
        value: function request(url, data, options) {
            var _this = this;

            var engine = new this.engine();
            var contentType = "Content-Type";
            var contentTypeLowerCase = contentType.toLowerCase();
            var interceptors = this.interceptors;
            var requestInterceptor = interceptors.request;
            var responseInterceptor = interceptors.response;
            var requestInterceptorHandler = requestInterceptor.handler;
            var promise = new Promise(function (resolve, reject) {
                if (utils.isObject(url)) {
                    options = url;
                    url = options.url;
                }
                options = options || {};
                options.headers = options.headers || {};

                function isPromise(p) {
                    // some  polyfill implementation of Promise may be not standard,
                    // so, we test by duck-typing
                    return p && p.then && p.catch;
                }

                /**
                 * If the request/response interceptor has been locked，
                 * the new request/response will enter a queue. otherwise, it will be performed directly.
                 * @param [promise] if the promise exist, means the interceptor is  locked.
                 * @param [callback]
                 */
                function enqueueIfLocked(promise, callback) {
                    if (promise) {
                        promise.then(function () {
                            callback();
                        });
                    } else {
                        callback();
                    }
                }

                // make the http request
                function makeRequest(options) {
                    data = options.body;
                    // Normalize the request url
                    url = utils.trim(options.url);
                    var baseUrl = utils.trim(options.baseURL || "");
                    if (!url && isBrowser && !baseUrl) url = location.href;
                    if (url.indexOf("http") !== 0) {
                        var isAbsolute = url[0] === "/";
                        if (!baseUrl && isBrowser) {
                            var arr = location.pathname.split("/");
                            arr.pop();
                            baseUrl = location.protocol + "//" + location.host + (isAbsolute ? "" : arr.join("/"));
                        }
                        if (baseUrl[baseUrl.length - 1] !== "/") {
                            baseUrl += "/";
                        }
                        url = baseUrl + (isAbsolute ? url.substr(1) : url);
                        if (isBrowser) {

                            // Normalize the url which contains the ".." or ".", such as
                            // "http://xx.com/aa/bb/../../xx" to "http://xx.com/xx" .
                            var t = document.createElement("a");
                            t.href = url;
                            url = t.href;
                        }
                    }

                    var responseType = utils.trim(options.responseType || "");
                    var isGet = options.method === "GET";
                    var dataType = utils.type(data);
                    var params = options.params || {};

                    // merge url params when the method is "GET" (data is object)
                    if (isGet && dataType === "object") {
                        params = utils.merge(data, params);
                    }
                    // encode params to String
                    params = utils.formatParams(params);

                    // save url params
                    var _params = [];
                    if (params) {
                        _params.push(params);
                    }
                    // Add data to url params when the method is "GET" (data is String)
                    if (isGet && data && dataType === "string") {
                        _params.push(data);
                    }

                    // make the final url
                    if (_params.length > 0) {
                        url += (url.indexOf("?") === -1 ? "?" : "&") + _params.join("&");
                    }

                    engine.open(options.method, url);

                    // try catch for ie >=9
                    try {
                        engine.withCredentials = !!options.withCredentials;
                        engine.timeout = options.timeout || 0;
                        if (responseType !== "stream") {
                            engine.responseType = responseType;
                        }
                    } catch (e) {}

                    var customContentType = options.headers[contentType] || options.headers[contentTypeLowerCase];

                    // default content type
                    var _contentType = "application/x-www-form-urlencoded";
                    // If the request data is json object, transforming it  to json string,
                    // and set request content-type to "json". In browser,  the data will
                    // be sent as RequestBody instead of FormData
                    if (utils.trim((customContentType || "").toLowerCase()) === _contentType) {
                        data = utils.formatParams(data);
                    } else if (!utils.isFormData(data) && ["object", "array"].indexOf(utils.type(data)) !== -1) {
                        _contentType = 'application/json;charset=utf-8';
                        data = JSON.stringify(data);
                    }
                    //If user doesn't set content-type, set default.
                    if (!(customContentType || isGet)) {
                        options.headers[contentType] = _contentType;
                    }

                    for (var k in options.headers) {
                        if (k === contentType && utils.isFormData(data)) {
                            // Delete the content-type, Let the browser set it
                            delete options.headers[k];
                        } else {
                            try {
                                // In browser environment, some header fields are readonly,
                                // write will cause the exception .
                                engine.setRequestHeader(k, options.headers[k]);
                            } catch (e) {}
                        }
                    }

                    function onresult(handler, data, type) {
                        enqueueIfLocked(responseInterceptor.p, function () {
                            if (handler) {
                                //如果失败，添加请求信息
                                if (type) {
                                    data.request = options;
                                }
                                var ret = handler.call(responseInterceptor, data, Promise);
                                data = ret === undefined ? data : ret;
                            }
                            if (!isPromise(data)) {
                                data = Promise[type === 0 ? "resolve" : "reject"](data);
                            }
                            data.then(function (d) {
                                resolve(d);
                            }).catch(function (e) {
                                reject(e);
                            });
                        });
                    }

                    function onerror(e) {
                        e.engine = engine;
                        onresult(responseInterceptor.onerror, e, -1);
                    }

                    function Err(msg, status) {
                        this.message = msg;
                        this.status = status;
                    }

                    engine.onload = function () {
                        // The xhr of IE9 has not response field
                        var response = engine.response || engine.responseText;
                        if (response && options.parseJson && (engine.getResponseHeader(contentType) || "").indexOf("json") !== -1
                        // Some third engine implementation may transform the response text to json object automatically,
                        // so we should test the type of response before transforming it
                        && !utils.isObject(response)) {
                            response = JSON.parse(response);
                        }

                        var headers = engine.responseHeaders;
                        // In browser
                        if (!headers) {
                            headers = {};
                            var items = (engine.getAllResponseHeaders() || "").split("\r\n");
                            items.pop();
                            items.forEach(function (e) {
                                if (!e) return;
                                var key = e.split(":")[0];
                                headers[key] = engine.getResponseHeader(key);
                            });
                        }
                        var status = engine.status;
                        var statusText = engine.statusText;
                        var data = { data: response, headers: headers, status: status, statusText: statusText };
                        // The _response filed of engine is set in  adapter which be called in engine-wrapper.js
                        utils.merge(data, engine._response);
                        if (status >= 200 && status < 300 || status === 304) {
                            data.engine = engine;
                            data.request = options;
                            onresult(responseInterceptor.handler, data, 0);
                        } else {
                            var e = new Err(statusText, status);
                            e.response = data;
                            onerror(e);
                        }
                    };

                    engine.onerror = function (e) {
                        onerror(new Err(e.msg || "Network Error", 0));
                    };

                    engine.ontimeout = function () {
                        onerror(new Err("timeout [ " + engine.timeout + "ms ]", 1));
                    };
                    engine._options = options;
                    setTimeout(function () {
                        engine.send(isGet ? null : data);
                    }, 0);
                }

                enqueueIfLocked(requestInterceptor.p, function () {
                    utils.merge(options, _this.config);
                    var headers = options.headers;
                    headers[contentType] = headers[contentType] || headers[contentTypeLowerCase] || "";
                    delete headers[contentTypeLowerCase];
                    options.body = data || options.body;
                    url = utils.trim(url || "");
                    options.method = options.method.toUpperCase();
                    options.url = url;
                    var ret = options;
                    if (requestInterceptorHandler) {
                        ret = requestInterceptorHandler.call(requestInterceptor, options, Promise) || options;
                    }
                    if (!isPromise(ret)) {
                        ret = Promise.resolve(ret);
                    }
                    ret.then(function (d) {
                        //if options continue
                        if (d === options) {
                            makeRequest(d);
                        } else {
                            resolve(d);
                        }
                    }, function (err) {
                        reject(err);
                    });
                });
            });
            promise.engine = engine;
            return promise;
        }
    }, {
        key: "all",
        value: function all(promises) {
            return Promise.all(promises);
        }
    }, {
        key: "spread",
        value: function spread(callback) {
            return function (arr) {
                return callback.apply(null, arr);
            };
        }
    }]);

    return Fly;
}();

//For typeScript


Fly.default = Fly;

["get", "post", "put", "patch", "head", "delete"].forEach(function (e) {
    Fly.prototype[e] = function (url, data, option) {
        return this.request(url, data, utils.merge({ method: e }, option));
    };
});
        ["lock", "unlock", "clear"].forEach(function (e) {
            Fly.prototype[e] = function () {
                this.interceptors.request[e]();
            };
        });
// Learn more about keep-loader: https://github.com/wendux/keep-loader
;
module.exports = Fly;

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//微信小程序适配器
module.exports = function (request, responseCallback) {
    var con = {
        method: request.method,
        url: request.url,
        dataType: request.dataType || undefined,
        header: request.headers,
        data: request.body || {},
        success: function success(res) {
            responseCallback({
                statusCode: res.statusCode,
                responseText: res.data,
                headers: res.header,
                statusMessage: res.errMsg
            });
        },
        fail: function fail(res) {
            responseCallback({
                statusCode: res.statusCode || 0,
                statusMessage: res.errMsg
            });
        }
    };
    wx.request(con);
};

/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//微信小程序入口
var Fly = __webpack_require__(2);
var EngineWrapper = __webpack_require__(1);
var adapter = __webpack_require__(6);
var wxEngine = EngineWrapper(adapter);
module.exports = function (engine) {
    return new Fly(engine || wxEngine);
};

/***/ })
/******/ ]);
});

/***/ }),

/***/ 24:
/*!***************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/requests.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;

var _store = _interopRequireDefault(__webpack_require__(/*! @/store */ 15));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // Uni-app fly 接口封装
// import { getToken } from '@/utils/auth'

var Fly = __webpack_require__(/*! flyio/dist/npm/wx */ 23);
var tokenFly = new Fly();
tokenFly.config.baseURL = 'https://jy.baifanapi.com';

//添加请求拦截器
tokenFly.interceptors.request.use(function (config, promise) {
  config.headers['X-Token'] = 'job';
  return config;
});

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
// response 拦截器
tokenFly.interceptors.response.use(
function (response) {
  var res = response.data;
  if (res.code !== 20000) {
    return Promise.reject('error');
  } else {
    return response.data;
  }
},
function (error) {
  return Promise.reject(error);
});var _default =

tokenFly;exports.default = _default;

/***/ }),

/***/ 246:
/*!**********************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/industrys.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = {
  '互联网/IT/电子/通信': [{
    text: '计算机软件',
    value: '1' },

  {
    text: '计算机硬件',
    value: '2' },

  {
    text: '企业服务',
    value: '3' },

  {
    text: '人工智能',
    value: '4' },

  {
    text: '通信/网络设备',
    value: '5' },

  {
    text: '网络/信息安全',
    value: '6' },

  {
    text: '新媒体',
    value: '7' },

  {
    text: '游戏',
    value: '8' },

  {
    text: '云计算/大数据',
    value: '9' }],


  '房地产': [{
    text: '房地产开发与经营',
    value: '10' },

  {
    text: '房地产中介',
    value: '11' },

  {
    text: '土地与公共设施管理',
    value: '12' },

  {
    text: '物业服务',
    value: '13' }],


  '金融业': [{
    text: '保险业',
    value: '14' },

  {
    text: '典当',
    value: '15' },

  {
    text: '互联网金融/小额贷款',
    value: '16' },

  {
    text: '基金/风投',
    value: '17' },

  {
    text: '汽车金融服务',
    value: '18' },

  {
    text: '信托投资',
    value: '19' },

  {
    text: '银行',
    value: '20' },

  {
    text: '证券/期货',
    value: '21' }],


  '建筑业': [{
    text: '房屋建筑/建筑设备安装',
    value: '22' },

  {
    text: '公共建筑装饰装修',
    value: '23' },

  {
    text: '土木工程建筑',
    value: '24' },

  {
    text: '住宅装饰装修',
    value: '25' }],


  '制造业': [{
    text: '船舶/航空/航天/火车制造',
    value: '26' },

  {
    text: '电气机械/器材制造',
    value: '27' },

  {
    text: '电子设备制造',
    value: '28' },

  {
    text: '纺织业/服饰产品加工制造',
    value: '29' },

  {
    text: '非金属矿物制品业',
    value: '30' },

  {
    text: '钢铁和有色金属冶炼及加工',
    value: '31' },

  {
    text: '化学纤维制造业',
    value: '32' },

  {
    text: '化学原来/化学制品',
    value: '33' },

  {
    text: '金属制品业',
    value: '34' },

  {
    text: '农副产品加工制造',
    value: '35' },

  {
    text: '汽车制造',
    value: '36' },

  {
    text: '燃料资源加工制造',
    value: '37' },

  {
    text: '日化产品制造',
    value: '38' },

  {
    text: '通用设备制造',
    value: '39' },

  {
    text: '橡胶和塑料制品',
    value: '40' },

  {
    text: '医药制造',
    value: '41' },

  {
    text: '仪器仪表制造',
    value: '42' },

  {
    text: '印刷/文体用品制造',
    value: '43' },

  {
    text: '造纸/家具制造',
    value: '44' },

  {
    text: '专用设备制造',
    value: '45' },

  {
    text: '医疗设备/器械',
    value: '46' }],


  '农林牧渔': [{
    text: '农林牧渔',
    value: '47' }],

  '批发/零售/贸易': [{
    text: '快速消费品',
    value: '48' },
  {
    text: '贸易/进出口代理/拍卖',
    value: '49' },
  {
    text: '耐用消费品',
    value: '50' },
  {
    text: '零售/皮肤',
    value: '51' }],

  '专业服务': [{
    text: '财务/审计/税务',
    value: '52' },
  {
    text: '法律服务',
    value: '53' },
  {
    text: '工程技术与设计服务',
    value: '54' },
  {
    text: '广告业',
    value: '55' },
  {
    text: '会议/展览服务',
    value: '56' },
  {
    text: '检测/认证',
    value: '57' },
  {
    text: '景区/商业/市场等综合管理',
    value: '58' },
  {
    text: '人力资源服务',
    value: '59' },
  {
    text: '商业代理服务',
    value: '60' },
  {
    text: '专利/商标/知识产权',
    value: '61' },
  {
    text: '专业技术服务',
    value: '62' },
  {
    text: '咨询服务',
    value: '63' },
  {
    text: '租聘服务',
    value: '64' }],

  '文化/体育/娱乐': [{
    text: '广播/电视/电影/录音制作',
    value: '65' },
  {
    text: '体育',
    value: '66' },
  {
    text: '文化艺术/娱乐',
    value: '67' },
  {
    text: '新闻/出版',
    value: '68' }],

  '交通运输/仓储/物流': [{
    text: '火车站/港口/汽车站/路政',
    value: '69' },
  {
    text: '货运/物流仓储',
    value: '70' },
  {
    text: '民航/铁路/公路/水路客运',
    value: '71' },
  {
    text: '邮政/快递',
    value: '72' }],

  '能源/环保/矿产': [{
    text: '电力/水利/热力/燃气',
    value: '73' },
  {
    text: '环保',
    value: '74' },
  {
    text: '矿产/采掘',
    value: '75' },
  {
    text: '石油/石化',
    value: '76' },
  {
    text: '新能源',
    value: '77' }],

  '教育培训/科研': [{
    text: '科学技术推广服务业',
    value: '78' },
  {
    text: '培训/课外教育/教育辅助',
    value: '79' },
  {
    text: '学术/科研',
    value: '80' },
  {
    text: '学校教育',
    value: '81' }],

  '卫生及社会工作': [{
    text: '卫生服务',
    value: '82' },
  {
    text: '养老/孤儿/看护等社会服务',
    value: '83' },
  {
    text: '医院',
    value: '84' }],

  '公共管理/社会保障': [{
    text: '国家机构',
    value: '85' },
  {
    text: '社团/组织/社会保障',
    value: '86' }],

  '生活服务': [{
    text: '餐饮业',
    value: '87' },
  {
    text: '酒店/民宿',
    value: '88' },
  {
    text: '居民服务',
    value: '89' },
  {
    text: '旅游业',
    value: '90' }] };exports.default = _default;

/***/ }),

/***/ 25:
/*!***********************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/auth.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.getToken = getToken;exports.setToken = setToken;exports.getMember = getMember;exports.setMember = setMember;exports.getAddress = getAddress;exports.setAddress = setAddress;exports.removeToken = removeToken;exports.removeMember = removeMember;var TokenKey = 'Token';
var MemberKey = 'member';
var AddressKey = 'address';

function getToken() {
  return uni.getStorageSync(TokenKey);
}

// 缓存token
function setToken(token) {
  return uni.setStorage({
    key: TokenKey,
    data: token });

}

function getMember() {
  return uni.getStorageSync(MemberKey);
}

// 缓存退伍军人认证
function setMember(member) {
  return uni.setStorage({
    key: MemberKey,
    data: member });

}

function getAddress() {
  return uni.getStorageSync(AddressKey);
}

// 缓存地址
function setAddress(address) {
  return uni.setStorage({
    key: AddressKey,
    data: address });

}

function removeToken() {
  return uni.removeStorageSync(TokenKey);
}

function removeMember() {
  return uni.removeStorageSync(MemberKey);
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 26:
/*!**************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/store/getters.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var getters = {

  token: function token(state) {return state.user.token;},
  ltabbar: function ltabbar(state) {return state.user.ltabbar;}, //底部导航
  member: function member(state) {return state.user.member;}, //军人认证
  address: function address(state) {return state.user.address;}, //地址
  audit: function audit(state) {return state.user.audit;},
  register: function register(state) {return state.user.register;} };var _default =

getters;exports.default = _default;

/***/ }),

/***/ 27:
/*!**************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/filters/index.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.timeAgo = timeAgo;exports.parseTime = parseTime;exports.formatTime = formatTime;exports.timesAgo = timesAgo;exports.nFormatter = nFormatter;exports.html2Text = html2Text;exports.toThousandslsFilter = toThousandslsFilter;exports.numFilter = numFilter;exports.nature = nature;exports.salary = salary;exports.prefType = prefType;exports.arrival = arrival;exports.size = size;exports.working = working;exports.workings = workings;exports.schooling = schooling;exports.schooling2 = schooling2;exports.schoolings = schoolings;exports.degree = degree;exports.publish = publish;exports.gender = gender;exports.trainingType = trainingType;exports.trainingTime = trainingTime;exports.jobstate = jobstate;exports.resumestate = resumestate;exports.marital = marital;exports.political = political;exports.idtype = idtype;exports.applyState = applyState;exports.applyClass = applyClass;exports.applyIcon = applyIcon;exports.ac = ac;exports.industry = industry; // 过滤器
function pluralize(time, label) {
  if (time === 1) {
    return time + label;
  }
  return time + label + 's';
}

function timeAgo(time) {
  var between = Date.now() / 1000 - Number(time);
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute');
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour');
  } else {
    return pluralize(~~(between / 86400), ' day');
  }
}

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }

  time = +time * 1000;

  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  var date;
  if (typeof time === 'object') {
    date = time;
  } else {
    date = new Date(parseInt(time));
  }
  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay() };

  var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
    var value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

function formatTime(time, option) {
  time = +time * 1000;
  var d = new Date(time);
  var now = Date.now();

  var diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {// less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
}

function timesAgo(time) {
  var times = Date.parse(new Date());
  return Math.floor((times - time * 1000) / 31536000000);
}


/* 数字 格式化*/
function nFormatter(num, digits) {
  var si = [{
    value: 1E18,
    symbol: 'E' },

  {
    value: 1E15,
    symbol: 'P' },

  {
    value: 1E12,
    symbol: 'T' },

  {
    value: 1E9,
    symbol: 'G' },

  {
    value: 1E6,
    symbol: 'M' },

  {
    value: 1E3,
    symbol: 'k' }];


  for (var i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol;
    }
  }
  return num.toString();
}

function html2Text(val) {
  var div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, function (m) {return m.replace(/(?=(?!\b)(\d{3})+$)/g, ',');});
}

function numFilter(value) {
  var realVal = '';
  if (value) {
    // 截取当前数据到小数点后三位
    var tempVal = parseFloat(value).toFixed(2);
    realVal = tempVal.substring(0, tempVal.length - 1);
  } else {
    realVal = '--';
  }
  return realVal;
}

function nature(state) {
  var num = {
    0: '公司性质',
    1: '国企',
    2: '外资（欧美）',
    3: '外资（非欧美）',
    4: '上市公司',
    5: '合资',
    6: '民营公司',
    7: '外企代表处',
    8: '政府机关',
    9: '事业单位',
    10: '非营利组织',
    11: '创业公司' };

  return num[state];
}

function salary(state) {
  var num = {
    0: '未选择',
    1: '2千以下',
    2: '2-3千',
    3: '3-4.5千',
    4: '4.5-6千',
    5: '6-8千',
    6: '0.8-1万',
    7: '1-1.5万',
    8: '1.5-2万',
    9: '3-4万',
    10: '4-5万',
    11: '5万以上' };

  return num[state];
}

function prefType(state) {
  var num = {
    0: '未选择',
    1: '全职',
    2: '兼职',
    3: '实习' };

  return num[state];
}

function arrival(state) {
  var num = {
    1: '随时',
    2: '1周内',
    3: '1个月内',
    4: '3个月内',
    5: '待定' };

  return num[state];
}

function size(state) {
  var num = {
    0: '公司规模',
    1: '少于50人',
    2: '50-150人',
    3: '150-500人',
    4: '500-1000人',
    5: '1000-5000人',
    6: '5000-10000人',
    7: '10000人以上' };

  return num[state];
}

function working(state) {
  var num = {
    1: '1-3年',
    2: '3-5年',
    3: '5-10年',
    4: '10年以上' };

  return num[state];
}



function workings(state) {
  var num = {
    0: '不限',
    1: '无经验',
    2: '1-3年',
    3: '3-5年',
    4: '5-10年',
    5: '10年以上' };

  return num[state];
}

function schooling(state) {
  var num = {
    1: '初中及以下',
    2: '高中',
    3: '大专',
    4: '本科',
    5: '硕士',
    6: '博士' };

  return num[state];
}

function schooling2(state) {
  var num = {
    0: '无学历要求',
    1: '初中及以下',
    2: '高中',
    3: '大专',
    4: '本科',
    5: '硕士',
    6: '博士' };

  return num[state];
}

function schoolings(state) {
  var num = {
    0: '不限',
    1: '初中及以下',
    2: '高中',
    3: '大专',
    4: '本科',
    5: '硕士',
    6: '博士' };

  return num[state];
}

function degree(state) {
  var num = {
    1: '初中及以下',
    2: '高中',
    3: '中技',
    4: '中专',
    5: '大专',
    6: '本科',
    7: '硕士',
    8: 'MBA',
    9: '博士' };

  return num[state];
}

function publish(state) {
  var num = {
    0: '发布时间',
    1: '24小时内',
    3: '近三天',
    7: '近一周',
    30: '近一月' };

  return num[state];
}

function gender(state) {
  var num = {
    0: '未知',
    1: '男性',
    2: '女性' };

  return num[state];
}

function trainingType(state) {
  var num = {
    0: '培训性质',
    1: '上岗培训',
    2: '就业培训',
    3: '学历培训' };

  return num[state];
}

function trainingTime(state) {
  var num = {
    3: '近三天',
    7: '近一周',
    30: '近一月',
    0: '培训时间' };

  return num[state];
}

function jobstate(state) {
  var num = {
    1: '目前正在找工作',
    2: '观望有好机会会考虑',
    3: '我目前不想换工作' };

  return num[state];
}

function resumestate(state) {
  var num = {
    1: '军优公开',
    2: '完全公开',
    3: '完全保密' };

  return num[state];
}

function marital(state) {
  var num = {
    1: '未婚',
    2: '已婚',
    3: '保密' };

  return num[state];
}

function political(state) {
  var num = {
    1: '中共党员',
    2: '共青团员',
    3: '民主党派人士',
    4: '无党派人士',
    5: '普通公民' };

  return num[state];
}

function idtype(state) {
  var num = {
    1: '身份证',
    2: '护照',
    3: '军人证',
    4: '港澳居民来往内地通行证',
    5: '外国人永久居留身份证',
    6: '其他' };

  return num[state];
}

function applyState(state) {
  var num = {
    1: '已投递',
    2: '已查阅',
    3: '感兴趣',
    4: '邀面试',
    5: '未通过' };

  return num[state];
}

function applyClass(state) {
  var num = {
    1: 'title-color-positive',
    2: 'title-color-warning',
    3: 'title-color-assertive',
    4: 'title-color-assertive',
    5: '' };

  return num[state];
}

function applyIcon(state) {
  var num = {
    1: 'exchange',
    2: 'eye-o',
    3: 'warn-o',
    4: 'like-o',
    5: 'phone-o' };

  return num[state];
}

function ac(state) {
  var num = {
    0: '未认证',
    1: '认证中',
    2: '军人认证',
    3: '军属认证' };

  return num[state];
}

function industry(state) {
  var num = {
    1: '计算机软件',
    2: '计算机硬件',
    3: '企业服务',
    4: '人工智能',
    5: '通信/网络设备',
    6: '网络/信息安全',
    7: '新媒体',
    8: '游戏',
    9: '云计算/大数据',
    10: '房地产开发与经营',
    11: '房地产中介',
    12: '土地与公共设施管理',
    13: '物业服务',
    14: '保险业',
    15: '典当',
    16: '互联网金融/小额贷款',
    17: '基金/风投',
    18: '汽车金融服务',
    19: '信托投资',
    20: '银行',
    21: '证券/期货',
    22: '房屋建筑/建筑设备安装',
    23: '公共建筑装饰装修',
    24: '土木工程建筑',
    25: '住宅装饰装修',
    26: '船舶/航空/航天/火车制造',
    27: '电气机械/器材制造',
    28: '电子设备制造',
    29: '纺织业/服饰产品加工制造',
    30: '非金属矿物制品业',
    31: '钢铁和有色金属冶炼及加工',
    32: '化学纤维制造业',
    33: '化学原来/化学制品',
    34: '金属制品业',
    35: '农副产品加工制造',
    36: '汽车制造',
    37: '燃料资源加工制造',
    38: '日化产品制造',
    39: '通用设备制造',
    40: '橡胶和塑料制品',
    41: '医药制造',
    42: '仪器仪表制造',
    43: '印刷/文体用品制造',
    44: '造纸/家具制造',
    45: '专用设备制造',
    46: '医疗设备/器械',
    47: '农林牧渔',
    48: '快速消费品',
    49: '贸易/进出口代理/拍卖',
    50: '耐用消费品',
    51: '零售/皮肤',
    52: '财务/审计/税务',
    53: '法律服务',
    54: '工程技术与设计服务',
    55: '广告业',
    56: '会议/展览服务',
    57: '检测/认证',
    58: '景区/商业/市场等综合管理',
    59: '人力资源服务',
    60: '商业代理服务',
    61: '专利/商标/知识产权',
    62: '专业技术服务',
    63: '咨询服务',
    64: '租聘服务',
    65: '广播/电视/电影/录音制作',
    66: '体育',
    67: '文化艺术/娱乐',
    68: '新闻/出版',
    69: '火车站/港口/汽车站/路政',
    70: '货运/物流仓储',
    71: '民航/铁路/公路/水路客运',
    72: '邮政/快递',
    73: '电力/水利/热力/燃气',
    74: '环保',
    75: '矿产/采掘',
    76: '石油/石化',
    77: '新能源',
    78: '科学技术推广服务业',
    79: '培训/课外教育/教育辅助',
    80: '学术/科研',
    81: '学校教育',
    82: '卫生服务',
    83: '养老/孤儿/看护等社会服务',
    84: '医院',
    85: '国家机构',
    86: '社团/组织/社会保障',
    87: '餐饮业',
    88: '酒店/民宿',
    89: '居民服务',
    90: '旅游业' };


  return num[state];
}

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 34:
/*!********************************************!*\
  !*** C:/Users/Admin/Desktop/归档/api/job.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.getJob = getJob;exports.getWxsh = getWxsh;exports.getTraining = getTraining;exports.getJobDetail = getJobDetail;exports.getTrainingDetail = getTrainingDetail;exports.getCompany = getCompany;exports.getCompanyDetail = getCompanyDetail;exports.getArchives = getArchives;exports.getArchivesDetail = getArchivesDetail;exports.getAdvertising = getAdvertising;exports.addCollection = addCollection;exports.delCollection = delCollection;exports.getCollection = getCollection;exports.addFocus = addFocus;exports.getFocus = getFocus;exports.delFocus = delFocus;exports.getApply = getApply;exports.addApply = addApply;exports.upRasumeBasic = upRasumeBasic;exports.getRasumeBasic = getRasumeBasic;exports.upRasumePubdate = upRasumePubdate;exports.upRasumePref = upRasumePref;exports.getRasumePref = getRasumePref;exports.getRasumeSetting = getRasumeSetting;exports.upRasumeSetting = upRasumeSetting;exports.addRasumeWork = addRasumeWork;exports.getRasumeWork = getRasumeWork;exports.getRasumeWorkDetail = getRasumeWorkDetail;exports.upRasumeWorkDetail = upRasumeWorkDetail;exports.delRasumeWorkDetail = delRasumeWorkDetail;exports.addRasumeProject = addRasumeProject;exports.getRasumeProject = getRasumeProject;exports.getRasumeProjectDetail = getRasumeProjectDetail;exports.upRasumeProjectDetail = upRasumeProjectDetail;exports.delRasumeProjectDetail = delRasumeProjectDetail;exports.addRasumeEdu = addRasumeEdu;exports.getRasumeEdu = getRasumeEdu;exports.getRasumeEduDetail = getRasumeEduDetail;exports.upRasumeEduDetail = upRasumeEduDetail;exports.delRasumeEduDetail = delRasumeEduDetail;exports.addRasumeHonor = addRasumeHonor;exports.getRasumeHonor = getRasumeHonor;exports.getRasumeHonorDetail = getRasumeHonorDetail;exports.upRasumeHonorDetail = upRasumeHonorDetail;exports.delRasumeHonorDetail = delRasumeHonorDetail;exports.getRasume = getRasume;exports.getRasumePreview = getRasumePreview;exports.getJobApply = getJobApply;exports.getJobCollection = getJobCollection;exports.getJobFocus = getJobFocus;exports.stsToken = stsToken;exports.getSecurity = getSecurity;exports.getSecurityCode = getSecurityCode;exports.upMember = upMember;exports.getInvite = getInvite;exports.getTrainingApply = getTrainingApply;exports.getTrainingApplys = getTrainingApplys;exports.addTrainingApply = addTrainingApply;exports.updateMemberAc = updateMemberAc;exports.getMemberAc = getMemberAc;var _requests = _interopRequireDefault(__webpack_require__(/*! @/utils/requests */ 24));
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 19));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

// 以下为api 接口
// 为你精选好的职位
function getJob(wx) {
  return _requests.default.get('/job', wx);
}

function getWxsh(wx) {
  return _requests.default.get('/job/wxsh', wx);
}

function getTraining(wx) {
  return _requests.default.get('/job/training', wx);
}

function getJobDetail(wx) {
  return _requests.default.get('/job/detail', wx);
}

function getTrainingDetail(wx) {
  return _requests.default.get('/job/training/detail', wx);
}

// 热门企业
function getCompany(wx) {
  return _requests.default.get('/job/company', wx);
}

function getCompanyDetail(wx) {
  return _requests.default.get('/job/company/detail', wx);
}

// 求职攻略
function getArchives(wx) {
  return _requests.default.get('/job/archives', wx);
}

// 请求文章
function getArchivesDetail(wx) {
  return _requests.default.get('/job/archives/detail', wx);
}

// 头部轮播图
function getAdvertising(wx) {
  return _requests.default.get('/job/advertising', wx);
}

function addCollection(wx) {
  return _request.default.post('/job/collection/add', wx);
}

function delCollection(wx) {
  return _request.default.post('/job/collection/del', wx);
}

function getCollection(wx) {
  return _request.default.get('/job/collection', wx);
}

function addFocus(wx) {
  return _request.default.post('/job/company/focus/add', wx);
}

function getFocus(wx) {
  return _request.default.get('/job/company/focus', wx);
}

function delFocus(wx) {
  return _request.default.post('/job/company/focus/del', wx);
}

function getApply(wx) {
  return _request.default.get('/job/apply', wx);
}

function addApply(wx) {
  return _request.default.post('/job/apply/add', wx);
}

function upRasumeBasic(wx) {
  return _request.default.post('/job/rasume/basic/update', wx);
}

function getRasumeBasic(wx) {
  return _request.default.get('/job/rasume/basic', wx);
}

function upRasumePubdate(wx) {
  return _request.default.post('/job/rasume/pubdate/update', wx);
}

function upRasumePref(wx) {
  return _request.default.post('/job/rasume/pref/update', wx);
}

function getRasumePref(wx) {
  return _request.default.get('/job/rasume/pref', wx);
}

function getRasumeSetting(wx) {
  return _request.default.get('/job/rasume/setting', wx);
}

function upRasumeSetting(wx) {
  return _request.default.post('/job/rasume/setting/update', wx);
}

function addRasumeWork(wx) {
  return _request.default.post('/job/rasume/work/add', wx);
}

function getRasumeWork(wx) {
  return _request.default.get('/job/rasume/work', wx);
}

function getRasumeWorkDetail(wx) {
  return _request.default.get('/job/rasume/work/detail', wx);
}

function upRasumeWorkDetail(wx) {
  return _request.default.post('/job/rasume/work/detail/update', wx);
}

function delRasumeWorkDetail(wx) {
  return _request.default.post('/job/rasume/work/detail/del', wx);
}

function addRasumeProject(wx) {
  return _request.default.post('/job/rasume/project/add', wx);
}

function getRasumeProject(wx) {
  return _request.default.get('/job/rasume/project', wx);
}

function getRasumeProjectDetail(wx) {
  return _request.default.get('/job/rasume/project/detail', wx);
}

function upRasumeProjectDetail(wx) {
  return _request.default.post('/job/rasume/project/detail/update', wx);
}

function delRasumeProjectDetail(wx) {
  return _request.default.post('/job/rasume/project/detail/del', wx);
}

function addRasumeEdu(wx) {
  return _request.default.post('/job/rasume/edu/add', wx);
}

function getRasumeEdu(wx) {
  return _request.default.get('/job/rasume/edu', wx);
}

function getRasumeEduDetail(wx) {
  return _request.default.get('/job/rasume/edu/detail', wx);
}

function upRasumeEduDetail(wx) {
  return _request.default.post('/job/rasume/edu/detail/update', wx);
}

function delRasumeEduDetail(wx) {
  return _request.default.post('/job/rasume/edu/detail/del', wx);
}

function addRasumeHonor(wx) {
  return _request.default.post('/job/rasume/honor/add', wx);
}

function getRasumeHonor(wx) {
  return _request.default.get('/job/rasume/honor', wx);
}

function getRasumeHonorDetail(wx) {
  return _request.default.get('/job/rasume/honor/detail', wx);
}

function upRasumeHonorDetail(wx) {
  return _request.default.post('/job/rasume/honor/detail/update', wx);
}

function delRasumeHonorDetail(wx) {
  return _request.default.post('/job/rasume/honor/detail/del', wx);
}

function getRasume(wx) {
  return _request.default.get('/job/rasume', wx);
}

function getRasumePreview(wx) {
  return _request.default.get('/job/rasume/preview', wx);
}

function getJobApply(wx) {
  return _request.default.get('/job/apply/list', wx);
}

function getJobCollection(wx) {
  return _request.default.get('/job/collection/list', wx);
}

function getJobFocus(wx) {
  return _request.default.get('/job/company/focus/list', wx);
}

function stsToken(wx) {
  return _request.default.get('/job/sts', wx);
}

function getSecurity(wx) {
  return _request.default.get('/job/security', wx);
}

function getSecurityCode(wx) {
  return _request.default.get('job/security/code', wx);
}

function upMember(wx) {
  return _request.default.post('/job/member/update', wx);
}

function getInvite(wx) {
  return _request.default.get('/job/invite', wx);
}

function getTrainingApply(wx) {
  return _request.default.get('/job/training/apply', wx);
}

function getTrainingApplys(wx) {
  return _request.default.get('/job/training/applys', wx);
}

function addTrainingApply(wx) {
  return _request.default.post('/job/training/apply/add', wx);
}

function updateMemberAc(wx) {
  return _request.default.post('/job/member/ac/update', wx);
}

function getMemberAc(wx) {
  return _request.default.get('/job/member/ac', wx);
}

/***/ }),

/***/ 35:
/*!***********************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/wxcomponents/wux/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 }), Object.defineProperty(exports, "$wuxCountDown", { enumerable: !0, get: function get() {return _index.default;} }), Object.defineProperty(exports, "$wuxCountUp", { enumerable: !0, get: function get() {return _index2.default;} }), exports.$stopWuxLoader = exports.$stopWuxRefresher = exports.$startWuxRefresher = exports.$wuxCalendar = exports.$wuxSelect = exports.$wuxKeyBoard = exports.$wuxNotification = exports.$wuxGallery = exports.$wuxToptips = exports.$wuxForm = exports.$wuxDialog = exports.$wuxLoading = exports.$wuxToast = exports.$wuxBackdrop = exports.$wuxActionSheet = void 0;var _index = _interopRequireDefault(__webpack_require__(/*! ./countdown/index */ 36)),_index2 = _interopRequireDefault(__webpack_require__(/*! ./countup/index */ 37));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}var getCtx = function getCtx(e, t) {var r = (1 < arguments.length && void 0 !== t ? t : getCurrentPages()[getCurrentPages().length - 1]).selectComponent(e);if (!r) throw new Error("无法找到对应的组件，请按文档说明使用组件");return r;},$wuxActionSheet = function $wuxActionSheet(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-actionsheet", 1 < arguments.length ? t : void 0);};exports.$wuxActionSheet = $wuxActionSheet;var $wuxBackdrop = function $wuxBackdrop(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-backdrop", 1 < arguments.length ? t : void 0);};exports.$wuxBackdrop = $wuxBackdrop;var $wuxToast = function $wuxToast(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-toast", 1 < arguments.length ? t : void 0);};exports.$wuxToast = $wuxToast;var $wuxLoading = function $wuxLoading(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-loading", 1 < arguments.length ? t : void 0);};exports.$wuxLoading = $wuxLoading;var $wuxDialog = function $wuxDialog(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-dialog", 1 < arguments.length ? t : void 0);};exports.$wuxDialog = $wuxDialog;var $wuxForm = function $wuxForm(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-form", 1 < arguments.length ? t : void 0);};exports.$wuxForm = $wuxForm;var $wuxToptips = function $wuxToptips(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-toptips", 1 < arguments.length ? t : void 0);};exports.$wuxToptips = $wuxToptips;var $wuxGallery = function $wuxGallery(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-gallery", 1 < arguments.length ? t : void 0);};exports.$wuxGallery = $wuxGallery;var $wuxNotification = function $wuxNotification(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-notification", 1 < arguments.length ? t : void 0);};exports.$wuxNotification = $wuxNotification;var $wuxKeyBoard = function $wuxKeyBoard(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-keyboard", 1 < arguments.length ? t : void 0);};exports.$wuxKeyBoard = $wuxKeyBoard;var $wuxSelect = function $wuxSelect(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-select", 1 < arguments.length ? t : void 0);};exports.$wuxSelect = $wuxSelect;var $wuxCalendar = function $wuxCalendar(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-calendar", 1 < arguments.length ? t : void 0);};exports.$wuxCalendar = $wuxCalendar;var $startWuxRefresher = function $startWuxRefresher(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-refresher", 1 < arguments.length ? t : void 0).triggerRefresh();};exports.$startWuxRefresher = $startWuxRefresher;var $stopWuxRefresher = function $stopWuxRefresher(e, t) {return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-refresher", 1 < arguments.length ? t : void 0).finishPullToRefresh();};exports.$stopWuxRefresher = $stopWuxRefresher;var $stopWuxLoader = function $stopWuxLoader(e, t, r) {var o = 2 < arguments.length ? r : void 0;return getCtx(0 < arguments.length && void 0 !== e ? e : "#wux-refresher", 1 < arguments.length ? t : void 0).finishLoadmore(o);};exports.$stopWuxLoader = $stopWuxLoader;

/***/ }),

/***/ 359:
/*!************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.parseTime = parseTime;exports.formatTime = formatTime;exports.getQueryObject = getQueryObject;exports.getByteLen = getByteLen;exports.cleanArray = cleanArray;exports.param = param;exports.param2Obj = param2Obj;exports.html2Text = html2Text;exports.objectMerge = objectMerge;exports.toggleClass = toggleClass;exports.getTime = getTime;exports.debounce = debounce;exports.deepClone = deepClone;exports.uniqueArr = uniqueArr;exports.createUniqueString = createUniqueString;exports.pickerOptions = void 0; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by jiachenpan on 16/11/18.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  var date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay() };

  var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, function (result, key) {
    var value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {return ['日', '一', '二', '三', '四', '五', '六'][value];}
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}

function formatTime(time, option) {
  time = +time * 1000;
  var d = new Date(time);
  var now = Date.now();

  var diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分');

  }
}

// 格式化时间
function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  var search = url.substring(url.lastIndexOf('?') + 1);
  var obj = {};
  var reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, function (rs, $1, $2) {
    var name = decodeURIComponent($1);
    var val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
   *get getByteLen
   * @param {Sting} val input value
   * @returns {number} output value
   */
function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1;
    } else {
      len += 0.5;
    }
  }
  return Math.floor(len);
}

function cleanArray(actual) {
  var newArray = [];
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

function param(json) {
  if (!json) return '';
  return cleanArray(
  Object.keys(json).map(function (key) {
    if (json[key] === undefined) return '';
    return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
  })).
  join('&');
}

function param2Obj(url) {
  var search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
  '{"' +
  decodeURIComponent(search).
  replace(/"/g, '\\"').
  replace(/&/g, '","').
  replace(/=/g, '":"') +
  '"}');

}

function html2Text(val) {
  var div = document.createElement('div');
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

function objectMerge(target, source) {
  /* Merges two  objects,
                                         giving the last one precedence */

  if (typeof target !== 'object') {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  Object.keys(source).forEach(function (property) {
    var sourceProperty = source[property];
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty);
    } else {
      target[property] = sourceProperty;
    }
  });
  return target;
}

function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  var classString = element.className;
  var nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += '' + className;
  } else {
    classString =
    classString.substr(0, nameIndex) +
    classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

var pickerOptions = [
{
  text: '今天',
  onClick: function onClick(picker) {
    var end = new Date();
    var start = new Date(new Date().toDateString());
    end.setTime(start.getTime());
    picker.$emit('pick', [start, end]);
  } },

{
  text: '最近一周',
  onClick: function onClick(picker) {
    var end = new Date(new Date().toDateString());
    var start = new Date();
    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
    picker.$emit('pick', [start, end]);
  } },

{
  text: '最近一个月',
  onClick: function onClick(picker) {
    var end = new Date(new Date().toDateString());
    var start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    picker.$emit('pick', [start, end]);
  } },

{
  text: '最近三个月',
  onClick: function onClick(picker) {
    var end = new Date(new Date().toDateString());
    var start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
    picker.$emit('pick', [start, end]);
  } }];exports.pickerOptions = pickerOptions;



function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

function debounce(func, wait, immediate) {
  var timeout, args, context, timestamp, result;

  var later = function later() {
    // 据上一次触发时间间隔
    var last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
    context = this;
    timestamp = +new Date();
    var callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
   * This is just a simple version of deep copy
   * Has a lot of edge cases bug
   * If you want to use a perfect deep copy, use lodash's _.cloneDeep
   */
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone');
  }
  var targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(function (keys) {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

function uniqueArr(arr) {
  return Array.from(new Set(arr));
}

function createUniqueString() {
  var timestamp = +new Date() + '';
  var randomNum = parseInt((1 + Math.random()) * 65536) + '';
  return (+(randomNum + timestamp)).toString(32);
}

/***/ }),

/***/ 36:
/*!*********************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/wxcomponents/wux/countdown/index.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(t, e) {if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");}function _defineProperties(t, e) {for (var n = 0; n < e.length; n++) {var i = e[n];i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(t, i.key, i);}}function _createClass(t, e, n) {return e && _defineProperties(t.prototype, e), n && _defineProperties(t, n), t;}Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = void 0;var Countdown = function () {function n() {var t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : getCurrentPages()[getCurrentPages().length - 1];_classCallCheck(this, n), Object.assign(this, { page: e, options: t }), this.__init();}return _createClass(n, [{ key: "__init", value: function value() {this.setData = this.page.setData.bind(this.page), this.restart(this.options);} }, { key: "setDefaults", value: function value() {return { date: "June 7, 2087 15:03:25", refresh: 1e3, offset: 0, onEnd: function onEnd() {}, render: function render(t) {} };} }, { key: "mergeOptions", value: function value(t) {var e = this.setDefaults();for (var n in e) {e.hasOwnProperty(n) && (this.options[n] = void 0 !== t[n] ? t[n] : e[n], "date" === n && "object" != typeof this.options.date && (this.options.date = new Date(this.options.date)), "function" == typeof this.options[n] && (this.options[n] = this.options[n].bind(this)));}"object" != typeof this.options.date && (this.options.date = new Date(this.options.date));} }, { key: "getDiffDate", value: function value() {var t = (this.options.date.getTime() - Date.now() + this.options.offset) / 1e3,e = { years: 0, days: 0, hours: 0, min: 0, sec: 0, millisec: 0 };return t <= 0 ? this.interval && (this.stop(), this.options.onEnd()) : (31557600 <= t && (e.years = Math.floor(t / 31557600), t -= 365.25 * e.years * 86400), 86400 <= t && (e.days = Math.floor(t / 86400), t -= 86400 * e.days), 3600 <= t && (e.hours = Math.floor(t / 3600), t -= 3600 * e.hours), 60 <= t && (e.min = Math.floor(t / 60), t -= 60 * e.min), e.sec = Math.round(t), e.millisec = t % 1 * 1e3), e;} }, { key: "leadingZeros", value: function value(t, e) {var n = 1 < arguments.length && void 0 !== e ? e : 2;return (t = String(t)).length > n ? t : (Array(n + 1).join("0") + t).substr(-n);} }, { key: "update", value: function value(t) {return this.options.date = "object" != typeof t ? new Date(t) : t, this.render(), this;} }, { key: "stop", value: function value() {return this.interval && (clearInterval(this.interval), this.interval = !1), this;} }, { key: "render", value: function value() {return this.options.render(this.getDiffDate()), this;} }, { key: "start", value: function value() {var t = this;return !this.interval && (this.render(), this.options.refresh && (this.interval = setInterval(function () {t.render();}, this.options.refresh)), this);} }, { key: "updateOffset", value: function value(t) {return this.options.offset = t, this;} }, { key: "restart", value: function value(t) {var e = 0 < arguments.length && void 0 !== t ? t : {};return this.mergeOptions(e), this.interval = !1, this.start(), this;} }]), n;}(),_default = Countdown;exports.default = _default;

/***/ }),

/***/ 37:
/*!*******************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/wxcomponents/wux/countup/index.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(t, i) {if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function");}function _defineProperties(t, i) {for (var s = 0; s < i.length; s++) {var a = i[s];a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(t, a.key, a);}}function _createClass(t, i, s) {return i && _defineProperties(t.prototype, i), s && _defineProperties(t, s), t;}Object.defineProperty(exports, "__esModule", { value: !0 }), exports.default = void 0;var CountUp = function () {function r(t, i, s, a) {var e = 4 < arguments.length && void 0 !== arguments[4] ? arguments[4] : {},n = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : getCurrentPages()[getCurrentPages().length - 1];_classCallCheck(this, r), Object.assign(this, { page: n, startVal: t, endVal: i, decimals: s, duration: a, options: e }), this.__init();}return _createClass(r, [{ key: "__init", value: function value() {this.setData = this.page.setData.bind(this.page), this.lastTime = 0, this.mergeOptions(this.options), this.startVal = Number(this.startVal), this.cacheVal = this.startVal, this.endVal = Number(this.endVal), this.countDown = this.startVal > this.endVal, this.frameVal = this.startVal, this.decimals = Math.max(0, this.decimals || 0), this.dec = Math.pow(10, this.decimals), this.duration = 1e3 * Number(this.duration) || 2e3, this.printValue(this.formattingFn(this.startVal));} }, { key: "setDefaultOptions", value: function value() {return { useEasing: !0, useGrouping: !0, separator: ",", decimal: ".", easingFn: null, formattingFn: null, printValue: function printValue(t) {} };} }, { key: "mergeOptions", value: function value(t) {var i = this.setDefaultOptions();for (var s in i) {i.hasOwnProperty(s) && (this.options[s] = void 0 !== t[s] ? t[s] : i[s], "function" == typeof this.options[s] && (this.options[s] = this.options[s].bind(this)));}"" === this.options.separator && (this.options.useGrouping = !1), this.options.prefix || (this.options.prefix = ""), this.options.suffix || (this.options.suffix = ""), this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo, this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber, this.printValue = this.options.printValue ? this.options.printValue : function () {};} }, { key: "requestAnimationFrame", value: function value(t) {var i = this,s = new Date().getTime(),a = Math.max(0, 16 - (s - this.lastTime)),e = setTimeout(function () {t.bind(i)(s + a);}, a);return this.lastTime = s + a, e;} }, { key: "cancelAnimationFrame", value: function value(t) {clearTimeout(t);} }, { key: "formatNumber", value: function value(t) {var i, s, a, e;if (t = t.toFixed(this.decimals), s = (i = (t += "").split("."))[0], a = 1 < i.length ? this.options.decimal + i[1] : "", e = /(\d+)(\d{3})/, this.options.useGrouping) for (; e.test(s);) {s = s.replace(e, "$1" + this.options.separator + "$2");}return this.options.prefix + s + a + this.options.suffix;} }, { key: "easeOutExpo", value: function value(t, i, s, a) {return s * (1 - Math.pow(2, -10 * t / a)) * 1024 / 1023 + i;} }, { key: "count", value: function value(t) {this.startTime || (this.startTime = t);var i = (this.timestamp = t) - this.startTime;this.remaining = this.duration - i, this.options.useEasing ? this.countDown ? this.frameVal = this.startVal - this.easingFn(i, 0, this.startVal - this.endVal, this.duration) : this.frameVal = this.easingFn(i, this.startVal, this.endVal - this.startVal, this.duration) : this.countDown ? this.frameVal = this.startVal - (this.startVal - this.endVal) * (i / this.duration) : this.frameVal = this.startVal + (this.endVal - this.startVal) * (i / this.duration), this.countDown ? this.frameVal = this.frameVal < this.endVal ? this.endVal : this.frameVal : this.frameVal = this.frameVal > this.endVal ? this.endVal : this.frameVal, this.frameVal = Math.round(this.frameVal * this.dec) / this.dec, this.printValue(this.formattingFn(this.frameVal)), i < this.duration ? this.rAF = this.requestAnimationFrame(this.count) : this.callback && this.callback();} }, { key: "start", value: function value(t) {return this.callback = t, this.rAF = this.requestAnimationFrame(this.count), !1;} }, { key: "pauseResume", value: function value() {this.paused ? (this.paused = !1, delete this.startTime, this.duration = this.remaining, this.startVal = this.frameVal, this.requestAnimationFrame(this.count)) : (this.paused = !0, this.cancelAnimationFrame(this.rAF));} }, { key: "reset", value: function value() {this.paused = !1, delete this.startTime, this.startVal = this.cacheVal, this.cancelAnimationFrame(this.rAF), this.printValue(this.formattingFn(this.startVal));} }, { key: "update", value: function value(t) {this.cancelAnimationFrame(this.rAF), this.paused = !1, delete this.startTime, this.startVal = this.frameVal, this.endVal = Number(t), this.countDown = this.startVal > this.endVal, this.rAF = this.requestAnimationFrame(this.count);} }]), r;}(),_default = CountUp;exports.default = _default;

/***/ }),

/***/ 38:
/*!***********************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/data.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  'label': '北京',
  'value': '110000',
  'children': [{
    'label': '北京市',
    'value': '110000',
    'children': [{
      'label': '东城区',
      'value': '110101' },

    {
      'label': '西城区',
      'value': '110102' },

    {
      'label': '朝阳区',
      'value': '110105' },

    {
      'label': '丰台区',
      'value': '110106' },

    {
      'label': '石景山区',
      'value': '110107' },

    {
      'label': '海淀区',
      'value': '110108' },

    {
      'label': '门头沟区',
      'value': '110109' },

    {
      'label': '房山区',
      'value': '110111' },

    {
      'label': '通州区',
      'value': '110112' },

    {
      'label': '顺义区',
      'value': '110113' },

    {
      'label': '昌平区',
      'value': '110114' },

    {
      'label': '大兴区',
      'value': '110115' },

    {
      'label': '怀柔区',
      'value': '110116' },

    {
      'label': '平谷区',
      'value': '110117' },

    {
      'label': '密云县',
      'value': '110228' },

    {
      'label': '延庆县',
      'value': '110229' }] }] },



{
  'label': '天津',
  'value': '120000',
  'children': [{
    'label': '天津市',
    'value': '120000',
    'children': [{
      'label': '和平区',
      'value': '120101' },

    {
      'label': '河东区',
      'value': '120102' },

    {
      'label': '河西区',
      'value': '120103' },

    {
      'label': '南开区',
      'value': '120104' },

    {
      'label': '河北区',
      'value': '120105' },

    {
      'label': '红桥区',
      'value': '120106' },

    {
      'label': '东丽区',
      'value': '120110' },

    {
      'label': '西青区',
      'value': '120111' },

    {
      'label': '津南区',
      'value': '120112' },

    {
      'label': '北辰区',
      'value': '120113' },

    {
      'label': '武清区',
      'value': '120114' },

    {
      'label': '宝坻区',
      'value': '120115' },

    {
      'label': '滨海新区',
      'value': '120116' },

    {
      'label': '宁河县',
      'value': '120221' },

    {
      'label': '静海县',
      'value': '120223' },

    {
      'label': '蓟县',
      'value': '120225' }] }] },



{
  'label': '河北省',
  'value': '130000',
  'children': [{
    'label': '石家庄市',
    'value': '130100',
    'children': [{
      'label': '市辖区',
      'value': '130101' },

    {
      'label': '长安区',
      'value': '130102' },

    {
      'label': '桥西区',
      'value': '130104' },

    {
      'label': '新华区',
      'value': '130105' },

    {
      'label': '井陉矿区',
      'value': '130107' },

    {
      'label': '裕华区',
      'value': '130108' },

    {
      'label': '藁城区',
      'value': '130109' },

    {
      'label': '鹿泉区',
      'value': '130110' },

    {
      'label': '栾城区',
      'value': '130111' },

    {
      'label': '井陉县',
      'value': '130121' },

    {
      'label': '正定县',
      'value': '130123' },

    {
      'label': '行唐县',
      'value': '130125' },

    {
      'label': '灵寿县',
      'value': '130126' },

    {
      'label': '高邑县',
      'value': '130127' },

    {
      'label': '深泽县',
      'value': '130128' },

    {
      'label': '赞皇县',
      'value': '130129' },

    {
      'label': '无极县',
      'value': '130130' },

    {
      'label': '平山县',
      'value': '130131' },

    {
      'label': '元氏县',
      'value': '130132' },

    {
      'label': '赵县',
      'value': '130133' },

    {
      'label': '辛集市',
      'value': '130181' },

    {
      'label': '晋州市',
      'value': '130183' },

    {
      'label': '新乐市',
      'value': '130184' }] },


  {
    'label': '唐山市',
    'value': '130200',
    'children': [{
      'label': '市辖区',
      'value': '130201' },

    {
      'label': '路南区',
      'value': '130202' },

    {
      'label': '路北区',
      'value': '130203' },

    {
      'label': '古冶区',
      'value': '130204' },

    {
      'label': '开平区',
      'value': '130205' },

    {
      'label': '丰南区',
      'value': '130207' },

    {
      'label': '丰润区',
      'value': '130208' },

    {
      'label': '曹妃甸区',
      'value': '130209' },

    {
      'label': '滦县',
      'value': '130223' },

    {
      'label': '滦南县',
      'value': '130224' },

    {
      'label': '乐亭县',
      'value': '130225' },

    {
      'label': '迁西县',
      'value': '130227' },

    {
      'label': '玉田县',
      'value': '130229' },

    {
      'label': '遵化市',
      'value': '130281' },

    {
      'label': '迁安市',
      'value': '130283' }] },


  {
    'label': '秦皇岛市',
    'value': '130300',
    'children': [{
      'label': '市辖区',
      'value': '130301' },

    {
      'label': '海港区',
      'value': '130302' },

    {
      'label': '山海关区',
      'value': '130303' },

    {
      'label': '北戴河区',
      'value': '130304' },

    {
      'label': '青龙满族自治县',
      'value': '130321' },

    {
      'label': '昌黎县',
      'value': '130322' },

    {
      'label': '抚宁县',
      'value': '130323' },

    {
      'label': '卢龙县',
      'value': '130324' }] },


  {
    'label': '邯郸市',
    'value': '130400',
    'children': [{
      'label': '市辖区',
      'value': '130401' },

    {
      'label': '邯山区',
      'value': '130402' },

    {
      'label': '丛台区',
      'value': '130403' },

    {
      'label': '复兴区',
      'value': '130404' },

    {
      'label': '峰峰矿区',
      'value': '130406' },

    {
      'label': '邯郸县',
      'value': '130421' },

    {
      'label': '临漳县',
      'value': '130423' },

    {
      'label': '成安县',
      'value': '130424' },

    {
      'label': '大名县',
      'value': '130425' },

    {
      'label': '涉县',
      'value': '130426' },

    {
      'label': '磁县',
      'value': '130427' },

    {
      'label': '肥乡县',
      'value': '130428' },

    {
      'label': '永年县',
      'value': '130429' },

    {
      'label': '邱县',
      'value': '130430' },

    {
      'label': '鸡泽县',
      'value': '130431' },

    {
      'label': '广平县',
      'value': '130432' },

    {
      'label': '馆陶县',
      'value': '130433' },

    {
      'label': '魏县',
      'value': '130434' },

    {
      'label': '曲周县',
      'value': '130435' },

    {
      'label': '武安市',
      'value': '130481' }] },


  {
    'label': '邢台市',
    'value': '130500',
    'children': [{
      'label': '市辖区',
      'value': '130501' },

    {
      'label': '桥东区',
      'value': '130502' },

    {
      'label': '桥西区',
      'value': '130503' },

    {
      'label': '邢台县',
      'value': '130521' },

    {
      'label': '临城县',
      'value': '130522' },

    {
      'label': '内丘县',
      'value': '130523' },

    {
      'label': '柏乡县',
      'value': '130524' },

    {
      'label': '隆尧县',
      'value': '130525' },

    {
      'label': '任县',
      'value': '130526' },

    {
      'label': '南和县',
      'value': '130527' },

    {
      'label': '宁晋县',
      'value': '130528' },

    {
      'label': '巨鹿县',
      'value': '130529' },

    {
      'label': '新河县',
      'value': '130530' },

    {
      'label': '广宗县',
      'value': '130531' },

    {
      'label': '平乡县',
      'value': '130532' },

    {
      'label': '威县',
      'value': '130533' },

    {
      'label': '清河县',
      'value': '130534' },

    {
      'label': '临西县',
      'value': '130535' },

    {
      'label': '南宫市',
      'value': '130581' },

    {
      'label': '沙河市',
      'value': '130582' }] },


  {
    'label': '保定市',
    'value': '130600',
    'children': [{
      'label': '市辖区',
      'value': '130601' },

    {
      'label': '新市区',
      'value': '130602' },

    {
      'label': '北市区',
      'value': '130603' },

    {
      'label': '南市区',
      'value': '130604' },

    {
      'label': '满城县',
      'value': '130621' },

    {
      'label': '清苑县',
      'value': '130622' },

    {
      'label': '涞水县',
      'value': '130623' },

    {
      'label': '阜平县',
      'value': '130624' },

    {
      'label': '徐水县',
      'value': '130625' },

    {
      'label': '定兴县',
      'value': '130626' },

    {
      'label': '唐县',
      'value': '130627' },

    {
      'label': '高阳县',
      'value': '130628' },

    {
      'label': '容城县',
      'value': '130629' },

    {
      'label': '涞源县',
      'value': '130630' },

    {
      'label': '望都县',
      'value': '130631' },

    {
      'label': '安新县',
      'value': '130632' },

    {
      'label': '易县',
      'value': '130633' },

    {
      'label': '曲阳县',
      'value': '130634' },

    {
      'label': '蠡县',
      'value': '130635' },

    {
      'label': '顺平县',
      'value': '130636' },

    {
      'label': '博野县',
      'value': '130637' },

    {
      'label': '雄县',
      'value': '130638' },

    {
      'label': '涿州市',
      'value': '130681' },

    {
      'label': '定州市',
      'value': '130682' },

    {
      'label': '安国市',
      'value': '130683' },

    {
      'label': '高碑店市',
      'value': '130684' }] },


  {
    'label': '张家口市',
    'value': '130700',
    'children': [{
      'label': '市辖区',
      'value': '130701' },

    {
      'label': '桥东区',
      'value': '130702' },

    {
      'label': '桥西区',
      'value': '130703' },

    {
      'label': '宣化区',
      'value': '130705' },

    {
      'label': '下花园区',
      'value': '130706' },

    {
      'label': '宣化县',
      'value': '130721' },

    {
      'label': '张北县',
      'value': '130722' },

    {
      'label': '康保县',
      'value': '130723' },

    {
      'label': '沽源县',
      'value': '130724' },

    {
      'label': '尚义县',
      'value': '130725' },

    {
      'label': '蔚县',
      'value': '130726' },

    {
      'label': '阳原县',
      'value': '130727' },

    {
      'label': '怀安县',
      'value': '130728' },

    {
      'label': '万全县',
      'value': '130729' },

    {
      'label': '怀来县',
      'value': '130730' },

    {
      'label': '涿鹿县',
      'value': '130731' },

    {
      'label': '赤城县',
      'value': '130732' },

    {
      'label': '崇礼县',
      'value': '130733' }] },


  {
    'label': '承德市',
    'value': '130800',
    'children': [{
      'label': '市辖区',
      'value': '130801' },

    {
      'label': '双桥区',
      'value': '130802' },

    {
      'label': '双滦区',
      'value': '130803' },

    {
      'label': '鹰手营子矿区',
      'value': '130804' },

    {
      'label': '承德县',
      'value': '130821' },

    {
      'label': '兴隆县',
      'value': '130822' },

    {
      'label': '平泉县',
      'value': '130823' },

    {
      'label': '滦平县',
      'value': '130824' },

    {
      'label': '隆化县',
      'value': '130825' },

    {
      'label': '丰宁满族自治县',
      'value': '130826' },

    {
      'label': '宽城满族自治县',
      'value': '130827' },

    {
      'label': '围场满族蒙古族自治县',
      'value': '130828' }] },


  {
    'label': '沧州市',
    'value': '130900',
    'children': [{
      'label': '市辖区',
      'value': '130901' },

    {
      'label': '新华区',
      'value': '130902' },

    {
      'label': '运河区',
      'value': '130903' },

    {
      'label': '沧县',
      'value': '130921' },

    {
      'label': '青县',
      'value': '130922' },

    {
      'label': '东光县',
      'value': '130923' },

    {
      'label': '海兴县',
      'value': '130924' },

    {
      'label': '盐山县',
      'value': '130925' },

    {
      'label': '肃宁县',
      'value': '130926' },

    {
      'label': '南皮县',
      'value': '130927' },

    {
      'label': '吴桥县',
      'value': '130928' },

    {
      'label': '献县',
      'value': '130929' },

    {
      'label': '孟村回族自治县',
      'value': '130930' },

    {
      'label': '泊头市',
      'value': '130981' },

    {
      'label': '任丘市',
      'value': '130982' },

    {
      'label': '黄骅市',
      'value': '130983' },

    {
      'label': '河间市',
      'value': '130984' }] },


  {
    'label': '廊坊市',
    'value': '131000',
    'children': [{
      'label': '市辖区',
      'value': '131001' },

    {
      'label': '安次区',
      'value': '131002' },

    {
      'label': '广阳区',
      'value': '131003' },

    {
      'label': '固安县',
      'value': '131022' },

    {
      'label': '永清县',
      'value': '131023' },

    {
      'label': '香河县',
      'value': '131024' },

    {
      'label': '大城县',
      'value': '131025' },

    {
      'label': '文安县',
      'value': '131026' },

    {
      'label': '大厂回族自治县',
      'value': '131028' },

    {
      'label': '霸州市',
      'value': '131081' },

    {
      'label': '三河市',
      'value': '131082' }] },


  {
    'label': '衡水市',
    'value': '131100',
    'children': [{
      'label': '市辖区',
      'value': '131101' },

    {
      'label': '桃城区',
      'value': '131102' },

    {
      'label': '枣强县',
      'value': '131121' },

    {
      'label': '武邑县',
      'value': '131122' },

    {
      'label': '武强县',
      'value': '131123' },

    {
      'label': '饶阳县',
      'value': '131124' },

    {
      'label': '安平县',
      'value': '131125' },

    {
      'label': '故城县',
      'value': '131126' },

    {
      'label': '景县',
      'value': '131127' },

    {
      'label': '阜城县',
      'value': '131128' },

    {
      'label': '冀州市',
      'value': '131181' },

    {
      'label': '深州市',
      'value': '131182' }] }] },



{
  'label': '山西省',
  'value': '140000',
  'children': [{
    'label': '太原市',
    'value': '140100',
    'children': [{
      'label': '市辖区',
      'value': '140101' },

    {
      'label': '小店区',
      'value': '140105' },

    {
      'label': '迎泽区',
      'value': '140106' },

    {
      'label': '杏花岭区',
      'value': '140107' },

    {
      'label': '尖草坪区',
      'value': '140108' },

    {
      'label': '万柏林区',
      'value': '140109' },

    {
      'label': '晋源区',
      'value': '140110' },

    {
      'label': '清徐县',
      'value': '140121' },

    {
      'label': '阳曲县',
      'value': '140122' },

    {
      'label': '娄烦县',
      'value': '140123' },

    {
      'label': '古交市',
      'value': '140181' }] },


  {
    'label': '大同市',
    'value': '140200',
    'children': [{
      'label': '市辖区',
      'value': '140201' },

    {
      'label': '城区',
      'value': '140202' },

    {
      'label': '矿区',
      'value': '140203' },

    {
      'label': '南郊区',
      'value': '140211' },

    {
      'label': '新荣区',
      'value': '140212' },

    {
      'label': '阳高县',
      'value': '140221' },

    {
      'label': '天镇县',
      'value': '140222' },

    {
      'label': '广灵县',
      'value': '140223' },

    {
      'label': '灵丘县',
      'value': '140224' },

    {
      'label': '浑源县',
      'value': '140225' },

    {
      'label': '左云县',
      'value': '140226' },

    {
      'label': '大同县',
      'value': '140227' }] },


  {
    'label': '阳泉市',
    'value': '140300',
    'children': [{
      'label': '市辖区',
      'value': '140301' },

    {
      'label': '城区',
      'value': '140302' },

    {
      'label': '矿区',
      'value': '140303' },

    {
      'label': '郊区',
      'value': '140311' },

    {
      'label': '平定县',
      'value': '140321' },

    {
      'label': '盂县',
      'value': '140322' }] },


  {
    'label': '长治市',
    'value': '140400',
    'children': [{
      'label': '市辖区',
      'value': '140401' },

    {
      'label': '城区',
      'value': '140402' },

    {
      'label': '郊区',
      'value': '140411' },

    {
      'label': '长治县',
      'value': '140421' },

    {
      'label': '襄垣县',
      'value': '140423' },

    {
      'label': '屯留县',
      'value': '140424' },

    {
      'label': '平顺县',
      'value': '140425' },

    {
      'label': '黎城县',
      'value': '140426' },

    {
      'label': '壶关县',
      'value': '140427' },

    {
      'label': '长子县',
      'value': '140428' },

    {
      'label': '武乡县',
      'value': '140429' },

    {
      'label': '沁县',
      'value': '140430' },

    {
      'label': '沁源县',
      'value': '140431' },

    {
      'label': '潞城市',
      'value': '140481' }] },


  {
    'label': '晋城市',
    'value': '140500',
    'children': [{
      'label': '市辖区',
      'value': '140501' },

    {
      'label': '城区',
      'value': '140502' },

    {
      'label': '沁水县',
      'value': '140521' },

    {
      'label': '阳城县',
      'value': '140522' },

    {
      'label': '陵川县',
      'value': '140524' },

    {
      'label': '泽州县',
      'value': '140525' },

    {
      'label': '高平市',
      'value': '140581' }] },


  {
    'label': '朔州市',
    'value': '140600',
    'children': [{
      'label': '市辖区',
      'value': '140601' },

    {
      'label': '朔城区',
      'value': '140602' },

    {
      'label': '平鲁区',
      'value': '140603' },

    {
      'label': '山阴县',
      'value': '140621' },

    {
      'label': '应县',
      'value': '140622' },

    {
      'label': '右玉县',
      'value': '140623' },

    {
      'label': '怀仁县',
      'value': '140624' }] },


  {
    'label': '晋中市',
    'value': '140700',
    'children': [{
      'label': '市辖区',
      'value': '140701' },

    {
      'label': '榆次区',
      'value': '140702' },

    {
      'label': '榆社县',
      'value': '140721' },

    {
      'label': '左权县',
      'value': '140722' },

    {
      'label': '和顺县',
      'value': '140723' },

    {
      'label': '昔阳县',
      'value': '140724' },

    {
      'label': '寿阳县',
      'value': '140725' },

    {
      'label': '太谷县',
      'value': '140726' },

    {
      'label': '祁县',
      'value': '140727' },

    {
      'label': '平遥县',
      'value': '140728' },

    {
      'label': '灵石县',
      'value': '140729' },

    {
      'label': '介休市',
      'value': '140781' }] },


  {
    'label': '运城市',
    'value': '140800',
    'children': [{
      'label': '市辖区',
      'value': '140801' },

    {
      'label': '盐湖区',
      'value': '140802' },

    {
      'label': '临猗县',
      'value': '140821' },

    {
      'label': '万荣县',
      'value': '140822' },

    {
      'label': '闻喜县',
      'value': '140823' },

    {
      'label': '稷山县',
      'value': '140824' },

    {
      'label': '新绛县',
      'value': '140825' },

    {
      'label': '绛县',
      'value': '140826' },

    {
      'label': '垣曲县',
      'value': '140827' },

    {
      'label': '夏县',
      'value': '140828' },

    {
      'label': '平陆县',
      'value': '140829' },

    {
      'label': '芮城县',
      'value': '140830' },

    {
      'label': '永济市',
      'value': '140881' },

    {
      'label': '河津市',
      'value': '140882' }] },


  {
    'label': '忻州市',
    'value': '140900',
    'children': [{
      'label': '市辖区',
      'value': '140901' },

    {
      'label': '忻府区',
      'value': '140902' },

    {
      'label': '定襄县',
      'value': '140921' },

    {
      'label': '五台县',
      'value': '140922' },

    {
      'label': '代县',
      'value': '140923' },

    {
      'label': '繁峙县',
      'value': '140924' },

    {
      'label': '宁武县',
      'value': '140925' },

    {
      'label': '静乐县',
      'value': '140926' },

    {
      'label': '神池县',
      'value': '140927' },

    {
      'label': '五寨县',
      'value': '140928' },

    {
      'label': '岢岚县',
      'value': '140929' },

    {
      'label': '河曲县',
      'value': '140930' },

    {
      'label': '保德县',
      'value': '140931' },

    {
      'label': '偏关县',
      'value': '140932' },

    {
      'label': '原平市',
      'value': '140981' }] },


  {
    'label': '临汾市',
    'value': '141000',
    'children': [{
      'label': '市辖区',
      'value': '141001' },

    {
      'label': '尧都区',
      'value': '141002' },

    {
      'label': '曲沃县',
      'value': '141021' },

    {
      'label': '翼城县',
      'value': '141022' },

    {
      'label': '襄汾县',
      'value': '141023' },

    {
      'label': '洪洞县',
      'value': '141024' },

    {
      'label': '古县',
      'value': '141025' },

    {
      'label': '安泽县',
      'value': '141026' },

    {
      'label': '浮山县',
      'value': '141027' },

    {
      'label': '吉县',
      'value': '141028' },

    {
      'label': '乡宁县',
      'value': '141029' },

    {
      'label': '大宁县',
      'value': '141030' },

    {
      'label': '隰县',
      'value': '141031' },

    {
      'label': '永和县',
      'value': '141032' },

    {
      'label': '蒲县',
      'value': '141033' },

    {
      'label': '汾西县',
      'value': '141034' },

    {
      'label': '侯马市',
      'value': '141081' },

    {
      'label': '霍州市',
      'value': '141082' }] },


  {
    'label': '吕梁市',
    'value': '141100',
    'children': [{
      'label': '市辖区',
      'value': '141101' },

    {
      'label': '离石区',
      'value': '141102' },

    {
      'label': '文水县',
      'value': '141121' },

    {
      'label': '交城县',
      'value': '141122' },

    {
      'label': '兴县',
      'value': '141123' },

    {
      'label': '临县',
      'value': '141124' },

    {
      'label': '柳林县',
      'value': '141125' },

    {
      'label': '石楼县',
      'value': '141126' },

    {
      'label': '岚县',
      'value': '141127' },

    {
      'label': '方山县',
      'value': '141128' },

    {
      'label': '中阳县',
      'value': '141129' },

    {
      'label': '交口县',
      'value': '141130' },

    {
      'label': '孝义市',
      'value': '141181' },

    {
      'label': '汾阳市',
      'value': '141182' }] }] },



{
  'label': '内蒙古自治区',
  'value': '150000',
  'children': [{
    'label': '呼和浩特市',
    'value': '150100',
    'children': [{
      'label': '市辖区',
      'value': '150101' },

    {
      'label': '新城区',
      'value': '150102' },

    {
      'label': '回民区',
      'value': '150103' },

    {
      'label': '玉泉区',
      'value': '150104' },

    {
      'label': '赛罕区',
      'value': '150105' },

    {
      'label': '土默特左旗',
      'value': '150121' },

    {
      'label': '托克托县',
      'value': '150122' },

    {
      'label': '和林格尔县',
      'value': '150123' },

    {
      'label': '清水河县',
      'value': '150124' },

    {
      'label': '武川县',
      'value': '150125' }] },


  {
    'label': '包头市',
    'value': '150200',
    'children': [{
      'label': '市辖区',
      'value': '150201' },

    {
      'label': '东河区',
      'value': '150202' },

    {
      'label': '昆都仑区',
      'value': '150203' },

    {
      'label': '青山区',
      'value': '150204' },

    {
      'label': '石拐区',
      'value': '150205' },

    {
      'label': '白云鄂博矿区',
      'value': '150206' },

    {
      'label': '九原区',
      'value': '150207' },

    {
      'label': '土默特右旗',
      'value': '150221' },

    {
      'label': '固阳县',
      'value': '150222' },

    {
      'label': '达尔罕茂明安联合旗',
      'value': '150223' }] },


  {
    'label': '乌海市',
    'value': '150300',
    'children': [{
      'label': '市辖区',
      'value': '150301' },

    {
      'label': '海勃湾区',
      'value': '150302' },

    {
      'label': '海南区',
      'value': '150303' },

    {
      'label': '乌达区',
      'value': '150304' }] },


  {
    'label': '赤峰市',
    'value': '150400',
    'children': [{
      'label': '市辖区',
      'value': '150401' },

    {
      'label': '红山区',
      'value': '150402' },

    {
      'label': '元宝山区',
      'value': '150403' },

    {
      'label': '松山区',
      'value': '150404' },

    {
      'label': '阿鲁科尔沁旗',
      'value': '150421' },

    {
      'label': '巴林左旗',
      'value': '150422' },

    {
      'label': '巴林右旗',
      'value': '150423' },

    {
      'label': '林西县',
      'value': '150424' },

    {
      'label': '克什克腾旗',
      'value': '150425' },

    {
      'label': '翁牛特旗',
      'value': '150426' },

    {
      'label': '喀喇沁旗',
      'value': '150428' },

    {
      'label': '宁城县',
      'value': '150429' },

    {
      'label': '敖汉旗',
      'value': '150430' }] },


  {
    'label': '通辽市',
    'value': '150500',
    'children': [{
      'label': '市辖区',
      'value': '150501' },

    {
      'label': '科尔沁区',
      'value': '150502' },

    {
      'label': '科尔沁左翼中旗',
      'value': '150521' },

    {
      'label': '科尔沁左翼后旗',
      'value': '150522' },

    {
      'label': '开鲁县',
      'value': '150523' },

    {
      'label': '库伦旗',
      'value': '150524' },

    {
      'label': '奈曼旗',
      'value': '150525' },

    {
      'label': '扎鲁特旗',
      'value': '150526' },

    {
      'label': '霍林郭勒市',
      'value': '150581' }] },


  {
    'label': '鄂尔多斯市',
    'value': '150600',
    'children': [{
      'label': '市辖区',
      'value': '150601' },

    {
      'label': '东胜区',
      'value': '150602' },

    {
      'label': '达拉特旗',
      'value': '150621' },

    {
      'label': '准格尔旗',
      'value': '150622' },

    {
      'label': '鄂托克前旗',
      'value': '150623' },

    {
      'label': '鄂托克旗',
      'value': '150624' },

    {
      'label': '杭锦旗',
      'value': '150625' },

    {
      'label': '乌审旗',
      'value': '150626' },

    {
      'label': '伊金霍洛旗',
      'value': '150627' }] },


  {
    'label': '呼伦贝尔市',
    'value': '150700',
    'children': [{
      'label': '市辖区',
      'value': '150701' },

    {
      'label': '海拉尔区',
      'value': '150702' },

    {
      'label': '扎赉诺尔区',
      'value': '150703' },

    {
      'label': '阿荣旗',
      'value': '150721' },

    {
      'label': '莫力达瓦达斡尔族自治旗',
      'value': '150722' },

    {
      'label': '鄂伦春自治旗',
      'value': '150723' },

    {
      'label': '鄂温克族自治旗',
      'value': '150724' },

    {
      'label': '陈巴尔虎旗',
      'value': '150725' },

    {
      'label': '新巴尔虎左旗',
      'value': '150726' },

    {
      'label': '新巴尔虎右旗',
      'value': '150727' },

    {
      'label': '满洲里市',
      'value': '150781' },

    {
      'label': '牙克石市',
      'value': '150782' },

    {
      'label': '扎兰屯市',
      'value': '150783' },

    {
      'label': '额尔古纳市',
      'value': '150784' },

    {
      'label': '根河市',
      'value': '150785' }] },


  {
    'label': '巴彦淖尔市',
    'value': '150800',
    'children': [{
      'label': '市辖区',
      'value': '150801' },

    {
      'label': '临河区',
      'value': '150802' },

    {
      'label': '五原县',
      'value': '150821' },

    {
      'label': '磴口县',
      'value': '150822' },

    {
      'label': '乌拉特前旗',
      'value': '150823' },

    {
      'label': '乌拉特中旗',
      'value': '150824' },

    {
      'label': '乌拉特后旗',
      'value': '150825' },

    {
      'label': '杭锦后旗',
      'value': '150826' }] },


  {
    'label': '乌兰察布市',
    'value': '150900',
    'children': [{
      'label': '市辖区',
      'value': '150901' },

    {
      'label': '集宁区',
      'value': '150902' },

    {
      'label': '卓资县',
      'value': '150921' },

    {
      'label': '化德县',
      'value': '150922' },

    {
      'label': '商都县',
      'value': '150923' },

    {
      'label': '兴和县',
      'value': '150924' },

    {
      'label': '凉城县',
      'value': '150925' },

    {
      'label': '察哈尔右翼前旗',
      'value': '150926' },

    {
      'label': '察哈尔右翼中旗',
      'value': '150927' },

    {
      'label': '察哈尔右翼后旗',
      'value': '150928' },

    {
      'label': '四子王旗',
      'value': '150929' },

    {
      'label': '丰镇市',
      'value': '150981' }] },


  {
    'label': '兴安盟',
    'value': '152200',
    'children': [{
      'label': '乌兰浩特市',
      'value': '152201' },

    {
      'label': '阿尔山市',
      'value': '152202' },

    {
      'label': '科尔沁右翼前旗',
      'value': '152221' },

    {
      'label': '科尔沁右翼中旗',
      'value': '152222' },

    {
      'label': '扎赉特旗',
      'value': '152223' },

    {
      'label': '突泉县',
      'value': '152224' }] },


  {
    'label': '锡林郭勒盟',
    'value': '152500',
    'children': [{
      'label': '二连浩特市',
      'value': '152501' },

    {
      'label': '锡林浩特市',
      'value': '152502' },

    {
      'label': '阿巴嘎旗',
      'value': '152522' },

    {
      'label': '苏尼特左旗',
      'value': '152523' },

    {
      'label': '苏尼特右旗',
      'value': '152524' },

    {
      'label': '东乌珠穆沁旗',
      'value': '152525' },

    {
      'label': '西乌珠穆沁旗',
      'value': '152526' },

    {
      'label': '太仆寺旗',
      'value': '152527' },

    {
      'label': '镶黄旗',
      'value': '152528' },

    {
      'label': '正镶白旗',
      'value': '152529' },

    {
      'label': '正蓝旗',
      'value': '152530' },

    {
      'label': '多伦县',
      'value': '152531' }] },


  {
    'label': '阿拉善盟',
    'value': '152900',
    'children': [{
      'label': '阿拉善左旗',
      'value': '152921' },

    {
      'label': '阿拉善右旗',
      'value': '152922' },

    {
      'label': '额济纳旗',
      'value': '152923' }] }] },



{
  'label': '辽宁省',
  'value': '210000',
  'children': [{
    'label': '沈阳市',
    'value': '210100',
    'children': [{
      'label': '市辖区',
      'value': '210101' },

    {
      'label': '和平区',
      'value': '210102' },

    {
      'label': '沈河区',
      'value': '210103' },

    {
      'label': '大东区',
      'value': '210104' },

    {
      'label': '皇姑区',
      'value': '210105' },

    {
      'label': '铁西区',
      'value': '210106' },

    {
      'label': '苏家屯区',
      'value': '210111' },

    {
      'label': '浑南区',
      'value': '210112' },

    {
      'label': '沈北新区',
      'value': '210113' },

    {
      'label': '于洪区',
      'value': '210114' },

    {
      'label': '辽中县',
      'value': '210122' },

    {
      'label': '康平县',
      'value': '210123' },

    {
      'label': '法库县',
      'value': '210124' },

    {
      'label': '新民市',
      'value': '210181' }] },


  {
    'label': '大连市',
    'value': '210200',
    'children': [{
      'label': '市辖区',
      'value': '210201' },

    {
      'label': '中山区',
      'value': '210202' },

    {
      'label': '西岗区',
      'value': '210203' },

    {
      'label': '沙河口区',
      'value': '210204' },

    {
      'label': '甘井子区',
      'value': '210211' },

    {
      'label': '旅顺口区',
      'value': '210212' },

    {
      'label': '金州区',
      'value': '210213' },

    {
      'label': '长海县',
      'value': '210224' },

    {
      'label': '瓦房店市',
      'value': '210281' },

    {
      'label': '普兰店市',
      'value': '210282' },

    {
      'label': '庄河市',
      'value': '210283' }] },


  {
    'label': '鞍山市',
    'value': '210300',
    'children': [{
      'label': '市辖区',
      'value': '210301' },

    {
      'label': '铁东区',
      'value': '210302' },

    {
      'label': '铁西区',
      'value': '210303' },

    {
      'label': '立山区',
      'value': '210304' },

    {
      'label': '千山区',
      'value': '210311' },

    {
      'label': '台安县',
      'value': '210321' },

    {
      'label': '岫岩满族自治县',
      'value': '210323' },

    {
      'label': '海城市',
      'value': '210381' }] },


  {
    'label': '抚顺市',
    'value': '210400',
    'children': [{
      'label': '市辖区',
      'value': '210401' },

    {
      'label': '新抚区',
      'value': '210402' },

    {
      'label': '东洲区',
      'value': '210403' },

    {
      'label': '望花区',
      'value': '210404' },

    {
      'label': '顺城区',
      'value': '210411' },

    {
      'label': '抚顺县',
      'value': '210421' },

    {
      'label': '新宾满族自治县',
      'value': '210422' },

    {
      'label': '清原满族自治县',
      'value': '210423' }] },


  {
    'label': '本溪市',
    'value': '210500',
    'children': [{
      'label': '市辖区',
      'value': '210501' },

    {
      'label': '平山区',
      'value': '210502' },

    {
      'label': '溪湖区',
      'value': '210503' },

    {
      'label': '明山区',
      'value': '210504' },

    {
      'label': '南芬区',
      'value': '210505' },

    {
      'label': '本溪满族自治县',
      'value': '210521' },

    {
      'label': '桓仁满族自治县',
      'value': '210522' }] },


  {
    'label': '丹东市',
    'value': '210600',
    'children': [{
      'label': '市辖区',
      'value': '210601' },

    {
      'label': '元宝区',
      'value': '210602' },

    {
      'label': '振兴区',
      'value': '210603' },

    {
      'label': '振安区',
      'value': '210604' },

    {
      'label': '宽甸满族自治县',
      'value': '210624' },

    {
      'label': '东港市',
      'value': '210681' },

    {
      'label': '凤城市',
      'value': '210682' }] },


  {
    'label': '锦州市',
    'value': '210700',
    'children': [{
      'label': '市辖区',
      'value': '210701' },

    {
      'label': '古塔区',
      'value': '210702' },

    {
      'label': '凌河区',
      'value': '210703' },

    {
      'label': '太和区',
      'value': '210711' },

    {
      'label': '黑山县',
      'value': '210726' },

    {
      'label': '义县',
      'value': '210727' },

    {
      'label': '凌海市',
      'value': '210781' },

    {
      'label': '北镇市',
      'value': '210782' }] },


  {
    'label': '营口市',
    'value': '210800',
    'children': [{
      'label': '市辖区',
      'value': '210801' },

    {
      'label': '站前区',
      'value': '210802' },

    {
      'label': '西市区',
      'value': '210803' },

    {
      'label': '鲅鱼圈区',
      'value': '210804' },

    {
      'label': '老边区',
      'value': '210811' },

    {
      'label': '盖州市',
      'value': '210881' },

    {
      'label': '大石桥市',
      'value': '210882' }] },


  {
    'label': '阜新市',
    'value': '210900',
    'children': [{
      'label': '市辖区',
      'value': '210901' },

    {
      'label': '海州区',
      'value': '210902' },

    {
      'label': '新邱区',
      'value': '210903' },

    {
      'label': '太平区',
      'value': '210904' },

    {
      'label': '清河门区',
      'value': '210905' },

    {
      'label': '细河区',
      'value': '210911' },

    {
      'label': '阜新蒙古族自治县',
      'value': '210921' },

    {
      'label': '彰武县',
      'value': '210922' }] },


  {
    'label': '辽阳市',
    'value': '211000',
    'children': [{
      'label': '市辖区',
      'value': '211001' },

    {
      'label': '白塔区',
      'value': '211002' },

    {
      'label': '文圣区',
      'value': '211003' },

    {
      'label': '宏伟区',
      'value': '211004' },

    {
      'label': '弓长岭区',
      'value': '211005' },

    {
      'label': '太子河区',
      'value': '211011' },

    {
      'label': '辽阳县',
      'value': '211021' },

    {
      'label': '灯塔市',
      'value': '211081' }] },


  {
    'label': '盘锦市',
    'value': '211100',
    'children': [{
      'label': '市辖区',
      'value': '211101' },

    {
      'label': '双台子区',
      'value': '211102' },

    {
      'label': '兴隆台区',
      'value': '211103' },

    {
      'label': '大洼县',
      'value': '211121' },

    {
      'label': '盘山县',
      'value': '211122' }] },


  {
    'label': '铁岭市',
    'value': '211200',
    'children': [{
      'label': '市辖区',
      'value': '211201' },

    {
      'label': '银州区',
      'value': '211202' },

    {
      'label': '清河区',
      'value': '211204' },

    {
      'label': '铁岭县',
      'value': '211221' },

    {
      'label': '西丰县',
      'value': '211223' },

    {
      'label': '昌图县',
      'value': '211224' },

    {
      'label': '调兵山市',
      'value': '211281' },

    {
      'label': '开原市',
      'value': '211282' }] },


  {
    'label': '朝阳市',
    'value': '211300',
    'children': [{
      'label': '市辖区',
      'value': '211301' },

    {
      'label': '双塔区',
      'value': '211302' },

    {
      'label': '龙城区',
      'value': '211303' },

    {
      'label': '朝阳县',
      'value': '211321' },

    {
      'label': '建平县',
      'value': '211322' },

    {
      'label': '喀喇沁左翼蒙古族自治县',
      'value': '211324' },

    {
      'label': '北票市',
      'value': '211381' },

    {
      'label': '凌源市',
      'value': '211382' }] },


  {
    'label': '葫芦岛市',
    'value': '211400',
    'children': [{
      'label': '市辖区',
      'value': '211401' },

    {
      'label': '连山区',
      'value': '211402' },

    {
      'label': '龙港区',
      'value': '211403' },

    {
      'label': '南票区',
      'value': '211404' },

    {
      'label': '绥中县',
      'value': '211421' },

    {
      'label': '建昌县',
      'value': '211422' },

    {
      'label': '兴城市',
      'value': '211481' }] }] },



{
  'label': '吉林省',
  'value': '220000',
  'children': [{
    'label': '长春市',
    'value': '220100',
    'children': [{
      'label': '市辖区',
      'value': '220101' },

    {
      'label': '南关区',
      'value': '220102' },

    {
      'label': '宽城区',
      'value': '220103' },

    {
      'label': '朝阳区',
      'value': '220104' },

    {
      'label': '二道区',
      'value': '220105' },

    {
      'label': '绿园区',
      'value': '220106' },

    {
      'label': '双阳区',
      'value': '220112' },

    {
      'label': '九台区',
      'value': '220113' },

    {
      'label': '农安县',
      'value': '220122' },

    {
      'label': '榆树市',
      'value': '220182' },

    {
      'label': '德惠市',
      'value': '220183' }] },


  {
    'label': '吉林市',
    'value': '220200',
    'children': [{
      'label': '市辖区',
      'value': '220201' },

    {
      'label': '昌邑区',
      'value': '220202' },

    {
      'label': '龙潭区',
      'value': '220203' },

    {
      'label': '船营区',
      'value': '220204' },

    {
      'label': '丰满区',
      'value': '220211' },

    {
      'label': '永吉县',
      'value': '220221' },

    {
      'label': '蛟河市',
      'value': '220281' },

    {
      'label': '桦甸市',
      'value': '220282' },

    {
      'label': '舒兰市',
      'value': '220283' },

    {
      'label': '磐石市',
      'value': '220284' }] },


  {
    'label': '四平市',
    'value': '220300',
    'children': [{
      'label': '市辖区',
      'value': '220301' },

    {
      'label': '铁西区',
      'value': '220302' },

    {
      'label': '铁东区',
      'value': '220303' },

    {
      'label': '梨树县',
      'value': '220322' },

    {
      'label': '伊通满族自治县',
      'value': '220323' },

    {
      'label': '公主岭市',
      'value': '220381' },

    {
      'label': '双辽市',
      'value': '220382' }] },


  {
    'label': '辽源市',
    'value': '220400',
    'children': [{
      'label': '市辖区',
      'value': '220401' },

    {
      'label': '龙山区',
      'value': '220402' },

    {
      'label': '西安区',
      'value': '220403' },

    {
      'label': '东丰县',
      'value': '220421' },

    {
      'label': '东辽县',
      'value': '220422' }] },


  {
    'label': '通化市',
    'value': '220500',
    'children': [{
      'label': '市辖区',
      'value': '220501' },

    {
      'label': '东昌区',
      'value': '220502' },

    {
      'label': '二道江区',
      'value': '220503' },

    {
      'label': '通化县',
      'value': '220521' },

    {
      'label': '辉南县',
      'value': '220523' },

    {
      'label': '柳河县',
      'value': '220524' },

    {
      'label': '梅河口市',
      'value': '220581' },

    {
      'label': '集安市',
      'value': '220582' }] },


  {
    'label': '白山市',
    'value': '220600',
    'children': [{
      'label': '市辖区',
      'value': '220601' },

    {
      'label': '浑江区',
      'value': '220602' },

    {
      'label': '江源区',
      'value': '220605' },

    {
      'label': '抚松县',
      'value': '220621' },

    {
      'label': '靖宇县',
      'value': '220622' },

    {
      'label': '长白朝鲜族自治县',
      'value': '220623' },

    {
      'label': '临江市',
      'value': '220681' }] },


  {
    'label': '松原市',
    'value': '220700',
    'children': [{
      'label': '市辖区',
      'value': '220701' },

    {
      'label': '宁江区',
      'value': '220702' },

    {
      'label': '前郭尔罗斯蒙古族自治县',
      'value': '220721' },

    {
      'label': '长岭县',
      'value': '220722' },

    {
      'label': '乾安县',
      'value': '220723' },

    {
      'label': '扶余市',
      'value': '220781' }] },


  {
    'label': '白城市',
    'value': '220800',
    'children': [{
      'label': '市辖区',
      'value': '220801' },

    {
      'label': '洮北区',
      'value': '220802' },

    {
      'label': '镇赉县',
      'value': '220821' },

    {
      'label': '通榆县',
      'value': '220822' },

    {
      'label': '洮南市',
      'value': '220881' },

    {
      'label': '大安市',
      'value': '220882' }] },


  {
    'label': '延边朝鲜族自治州',
    'value': '222400',
    'children': [{
      'label': '延吉市',
      'value': '222401' },

    {
      'label': '图们市',
      'value': '222402' },

    {
      'label': '敦化市',
      'value': '222403' },

    {
      'label': '珲春市',
      'value': '222404' },

    {
      'label': '龙井市',
      'value': '222405' },

    {
      'label': '和龙市',
      'value': '222406' },

    {
      'label': '汪清县',
      'value': '222424' },

    {
      'label': '安图县',
      'value': '222426' }] }] },



{
  'label': '黑龙江省',
  'value': '230000',
  'children': [{
    'label': '哈尔滨市',
    'value': '230100',
    'children': [{
      'label': '市辖区',
      'value': '230101' },

    {
      'label': '道里区',
      'value': '230102' },

    {
      'label': '南岗区',
      'value': '230103' },

    {
      'label': '道外区',
      'value': '230104' },

    {
      'label': '平房区',
      'value': '230108' },

    {
      'label': '松北区',
      'value': '230109' },

    {
      'label': '香坊区',
      'value': '230110' },

    {
      'label': '呼兰区',
      'value': '230111' },

    {
      'label': '阿城区',
      'value': '230112' },

    {
      'label': '双城区',
      'value': '230113' },

    {
      'label': '依兰县',
      'value': '230123' },

    {
      'label': '方正县',
      'value': '230124' },

    {
      'label': '宾县',
      'value': '230125' },

    {
      'label': '巴彦县',
      'value': '230126' },

    {
      'label': '木兰县',
      'value': '230127' },

    {
      'label': '通河县',
      'value': '230128' },

    {
      'label': '延寿县',
      'value': '230129' },

    {
      'label': '尚志市',
      'value': '230183' },

    {
      'label': '五常市',
      'value': '230184' }] },


  {
    'label': '齐齐哈尔市',
    'value': '230200',
    'children': [{
      'label': '市辖区',
      'value': '230201' },

    {
      'label': '龙沙区',
      'value': '230202' },

    {
      'label': '建华区',
      'value': '230203' },

    {
      'label': '铁锋区',
      'value': '230204' },

    {
      'label': '昂昂溪区',
      'value': '230205' },

    {
      'label': '富拉尔基区',
      'value': '230206' },

    {
      'label': '碾子山区',
      'value': '230207' },

    {
      'label': '梅里斯达斡尔族区',
      'value': '230208' },

    {
      'label': '龙江县',
      'value': '230221' },

    {
      'label': '依安县',
      'value': '230223' },

    {
      'label': '泰来县',
      'value': '230224' },

    {
      'label': '甘南县',
      'value': '230225' },

    {
      'label': '富裕县',
      'value': '230227' },

    {
      'label': '克山县',
      'value': '230229' },

    {
      'label': '克东县',
      'value': '230230' },

    {
      'label': '拜泉县',
      'value': '230231' },

    {
      'label': '讷河市',
      'value': '230281' }] },


  {
    'label': '鸡西市',
    'value': '230300',
    'children': [{
      'label': '市辖区',
      'value': '230301' },

    {
      'label': '鸡冠区',
      'value': '230302' },

    {
      'label': '恒山区',
      'value': '230303' },

    {
      'label': '滴道区',
      'value': '230304' },

    {
      'label': '梨树区',
      'value': '230305' },

    {
      'label': '城子河区',
      'value': '230306' },

    {
      'label': '麻山区',
      'value': '230307' },

    {
      'label': '鸡东县',
      'value': '230321' },

    {
      'label': '虎林市',
      'value': '230381' },

    {
      'label': '密山市',
      'value': '230382' }] },


  {
    'label': '鹤岗市',
    'value': '230400',
    'children': [{
      'label': '市辖区',
      'value': '230401' },

    {
      'label': '向阳区',
      'value': '230402' },

    {
      'label': '工农区',
      'value': '230403' },

    {
      'label': '南山区',
      'value': '230404' },

    {
      'label': '兴安区',
      'value': '230405' },

    {
      'label': '东山区',
      'value': '230406' },

    {
      'label': '兴山区',
      'value': '230407' },

    {
      'label': '萝北县',
      'value': '230421' },

    {
      'label': '绥滨县',
      'value': '230422' }] },


  {
    'label': '双鸭山市',
    'value': '230500',
    'children': [{
      'label': '市辖区',
      'value': '230501' },

    {
      'label': '尖山区',
      'value': '230502' },

    {
      'label': '岭东区',
      'value': '230503' },

    {
      'label': '四方台区',
      'value': '230505' },

    {
      'label': '宝山区',
      'value': '230506' },

    {
      'label': '集贤县',
      'value': '230521' },

    {
      'label': '友谊县',
      'value': '230522' },

    {
      'label': '宝清县',
      'value': '230523' },

    {
      'label': '饶河县',
      'value': '230524' }] },


  {
    'label': '大庆市',
    'value': '230600',
    'children': [{
      'label': '市辖区',
      'value': '230601' },

    {
      'label': '萨尔图区',
      'value': '230602' },

    {
      'label': '龙凤区',
      'value': '230603' },

    {
      'label': '让胡路区',
      'value': '230604' },

    {
      'label': '红岗区',
      'value': '230605' },

    {
      'label': '大同区',
      'value': '230606' },

    {
      'label': '肇州县',
      'value': '230621' },

    {
      'label': '肇源县',
      'value': '230622' },

    {
      'label': '林甸县',
      'value': '230623' },

    {
      'label': '杜尔伯特蒙古族自治县',
      'value': '230624' }] },


  {
    'label': '伊春市',
    'value': '230700',
    'children': [{
      'label': '市辖区',
      'value': '230701' },

    {
      'label': '伊春区',
      'value': '230702' },

    {
      'label': '南岔区',
      'value': '230703' },

    {
      'label': '友好区',
      'value': '230704' },

    {
      'label': '西林区',
      'value': '230705' },

    {
      'label': '翠峦区',
      'value': '230706' },

    {
      'label': '新青区',
      'value': '230707' },

    {
      'label': '美溪区',
      'value': '230708' },

    {
      'label': '金山屯区',
      'value': '230709' },

    {
      'label': '五营区',
      'value': '230710' },

    {
      'label': '乌马河区',
      'value': '230711' },

    {
      'label': '汤旺河区',
      'value': '230712' },

    {
      'label': '带岭区',
      'value': '230713' },

    {
      'label': '乌伊岭区',
      'value': '230714' },

    {
      'label': '红星区',
      'value': '230715' },

    {
      'label': '上甘岭区',
      'value': '230716' },

    {
      'label': '嘉荫县',
      'value': '230722' },

    {
      'label': '铁力市',
      'value': '230781' }] },


  {
    'label': '佳木斯市',
    'value': '230800',
    'children': [{
      'label': '市辖区',
      'value': '230801' },

    {
      'label': '向阳区',
      'value': '230803' },

    {
      'label': '前进区',
      'value': '230804' },

    {
      'label': '东风区',
      'value': '230805' },

    {
      'label': '郊区',
      'value': '230811' },

    {
      'label': '桦南县',
      'value': '230822' },

    {
      'label': '桦川县',
      'value': '230826' },

    {
      'label': '汤原县',
      'value': '230828' },

    {
      'label': '抚远县',
      'value': '230833' },

    {
      'label': '同江市',
      'value': '230881' },

    {
      'label': '富锦市',
      'value': '230882' }] },


  {
    'label': '七台河市',
    'value': '230900',
    'children': [{
      'label': '市辖区',
      'value': '230901' },

    {
      'label': '新兴区',
      'value': '230902' },

    {
      'label': '桃山区',
      'value': '230903' },

    {
      'label': '茄子河区',
      'value': '230904' },

    {
      'label': '勃利县',
      'value': '230921' }] },


  {
    'label': '牡丹江市',
    'value': '231000',
    'children': [{
      'label': '市辖区',
      'value': '231001' },

    {
      'label': '东安区',
      'value': '231002' },

    {
      'label': '阳明区',
      'value': '231003' },

    {
      'label': '爱民区',
      'value': '231004' },

    {
      'label': '西安区',
      'value': '231005' },

    {
      'label': '东宁县',
      'value': '231024' },

    {
      'label': '林口县',
      'value': '231025' },

    {
      'label': '绥芬河市',
      'value': '231081' },

    {
      'label': '海林市',
      'value': '231083' },

    {
      'label': '宁安市',
      'value': '231084' },

    {
      'label': '穆棱市',
      'value': '231085' }] },


  {
    'label': '黑河市',
    'value': '231100',
    'children': [{
      'label': '市辖区',
      'value': '231101' },

    {
      'label': '爱辉区',
      'value': '231102' },

    {
      'label': '嫩江县',
      'value': '231121' },

    {
      'label': '逊克县',
      'value': '231123' },

    {
      'label': '孙吴县',
      'value': '231124' },

    {
      'label': '北安市',
      'value': '231181' },

    {
      'label': '五大连池市',
      'value': '231182' }] },


  {
    'label': '绥化市',
    'value': '231200',
    'children': [{
      'label': '市辖区',
      'value': '231201' },

    {
      'label': '北林区',
      'value': '231202' },

    {
      'label': '望奎县',
      'value': '231221' },

    {
      'label': '兰西县',
      'value': '231222' },

    {
      'label': '青冈县',
      'value': '231223' },

    {
      'label': '庆安县',
      'value': '231224' },

    {
      'label': '明水县',
      'value': '231225' },

    {
      'label': '绥棱县',
      'value': '231226' },

    {
      'label': '安达市',
      'value': '231281' },

    {
      'label': '肇东市',
      'value': '231282' },

    {
      'label': '海伦市',
      'value': '231283' }] },


  {
    'label': '大兴安岭地区',
    'value': '232700',
    'children': [{
      'label': '呼玛县',
      'value': '232721' },

    {
      'label': '塔河县',
      'value': '232722' },

    {
      'label': '漠河县',
      'value': '232723' }] }] },



{
  'label': '上海',
  'value': '310000',
  'children': [{
    'label': '上海市',
    'value': '310000',
    'children': [{
      'label': '黄浦区',
      'value': '310101' },

    {
      'label': '徐汇区',
      'value': '310104' },

    {
      'label': '长宁区',
      'value': '310105' },

    {
      'label': '静安区',
      'value': '310106' },

    {
      'label': '普陀区',
      'value': '310107' },

    {
      'label': '闸北区',
      'value': '310108' },

    {
      'label': '虹口区',
      'value': '310109' },

    {
      'label': '杨浦区',
      'value': '310110' },

    {
      'label': '闵行区',
      'value': '310112' },

    {
      'label': '宝山区',
      'value': '310113' },

    {
      'label': '嘉定区',
      'value': '310114' },

    {
      'label': '浦东新区',
      'value': '310115' },

    {
      'label': '金山区',
      'value': '310116' },

    {
      'label': '松江区',
      'value': '310117' },

    {
      'label': '青浦区',
      'value': '310118' },

    {
      'label': '奉贤区',
      'value': '310120' },

    {
      'label': '崇明县',
      'value': '310230' }] }] },



{
  'label': '江苏省',
  'value': '320000',
  'children': [{
    'label': '南京市',
    'value': '320100',
    'children': [{
      'label': '市辖区',
      'value': '320101' },

    {
      'label': '玄武区',
      'value': '320102' },

    {
      'label': '秦淮区',
      'value': '320104' },

    {
      'label': '建邺区',
      'value': '320105' },

    {
      'label': '鼓楼区',
      'value': '320106' },

    {
      'label': '浦口区',
      'value': '320111' },

    {
      'label': '栖霞区',
      'value': '320113' },

    {
      'label': '雨花台区',
      'value': '320114' },

    {
      'label': '江宁区',
      'value': '320115' },

    {
      'label': '六合区',
      'value': '320116' },

    {
      'label': '溧水区',
      'value': '320117' },

    {
      'label': '高淳区',
      'value': '320118' }] },


  {
    'label': '无锡市',
    'value': '320200',
    'children': [{
      'label': '市辖区',
      'value': '320201' },

    {
      'label': '崇安区',
      'value': '320202' },

    {
      'label': '南长区',
      'value': '320203' },

    {
      'label': '北塘区',
      'value': '320204' },

    {
      'label': '锡山区',
      'value': '320205' },

    {
      'label': '惠山区',
      'value': '320206' },

    {
      'label': '滨湖区',
      'value': '320211' },

    {
      'label': '江阴市',
      'value': '320281' },

    {
      'label': '宜兴市',
      'value': '320282' }] },


  {
    'label': '徐州市',
    'value': '320300',
    'children': [{
      'label': '市辖区',
      'value': '320301' },

    {
      'label': '鼓楼区',
      'value': '320302' },

    {
      'label': '云龙区',
      'value': '320303' },

    {
      'label': '贾汪区',
      'value': '320305' },

    {
      'label': '泉山区',
      'value': '320311' },

    {
      'label': '铜山区',
      'value': '320312' },

    {
      'label': '丰县',
      'value': '320321' },

    {
      'label': '沛县',
      'value': '320322' },

    {
      'label': '睢宁县',
      'value': '320324' },

    {
      'label': '新沂市',
      'value': '320381' },

    {
      'label': '邳州市',
      'value': '320382' }] },


  {
    'label': '常州市',
    'value': '320400',
    'children': [{
      'label': '市辖区',
      'value': '320401' },

    {
      'label': '天宁区',
      'value': '320402' },

    {
      'label': '钟楼区',
      'value': '320404' },

    {
      'label': '戚墅堰区',
      'value': '320405' },

    {
      'label': '新北区',
      'value': '320411' },

    {
      'label': '武进区',
      'value': '320412' },

    {
      'label': '溧阳市',
      'value': '320481' },

    {
      'label': '金坛市',
      'value': '320482' }] },


  {
    'label': '苏州市',
    'value': '320500',
    'children': [{
      'label': '市辖区',
      'value': '320501' },

    {
      'label': '虎丘区',
      'value': '320505' },

    {
      'label': '吴中区',
      'value': '320506' },

    {
      'label': '相城区',
      'value': '320507' },

    {
      'label': '姑苏区',
      'value': '320508' },

    {
      'label': '吴江区',
      'value': '320509' },

    {
      'label': '常熟市',
      'value': '320581' },

    {
      'label': '张家港市',
      'value': '320582' },

    {
      'label': '昆山市',
      'value': '320583' },

    {
      'label': '太仓市',
      'value': '320585' }] },


  {
    'label': '南通市',
    'value': '320600',
    'children': [{
      'label': '市辖区',
      'value': '320601' },

    {
      'label': '崇川区',
      'value': '320602' },

    {
      'label': '港闸区',
      'value': '320611' },

    {
      'label': '通州区',
      'value': '320612' },

    {
      'label': '海安县',
      'value': '320621' },

    {
      'label': '如东县',
      'value': '320623' },

    {
      'label': '启东市',
      'value': '320681' },

    {
      'label': '如皋市',
      'value': '320682' },

    {
      'label': '海门市',
      'value': '320684' }] },


  {
    'label': '连云港市',
    'value': '320700',
    'children': [{
      'label': '市辖区',
      'value': '320701' },

    {
      'label': '连云区',
      'value': '320703' },

    {
      'label': '海州区',
      'value': '320706' },

    {
      'label': '赣榆区',
      'value': '320707' },

    {
      'label': '东海县',
      'value': '320722' },

    {
      'label': '灌云县',
      'value': '320723' },

    {
      'label': '灌南县',
      'value': '320724' }] },


  {
    'label': '淮安市',
    'value': '320800',
    'children': [{
      'label': '市辖区',
      'value': '320801' },

    {
      'label': '清河区',
      'value': '320802' },

    {
      'label': '淮安区',
      'value': '320803' },

    {
      'label': '淮阴区',
      'value': '320804' },

    {
      'label': '清浦区',
      'value': '320811' },

    {
      'label': '涟水县',
      'value': '320826' },

    {
      'label': '洪泽县',
      'value': '320829' },

    {
      'label': '盱眙县',
      'value': '320830' },

    {
      'label': '金湖县',
      'value': '320831' }] },


  {
    'label': '盐城市',
    'value': '320900',
    'children': [{
      'label': '市辖区',
      'value': '320901' },

    {
      'label': '亭湖区',
      'value': '320902' },

    {
      'label': '盐都区',
      'value': '320903' },

    {
      'label': '响水县',
      'value': '320921' },

    {
      'label': '滨海县',
      'value': '320922' },

    {
      'label': '阜宁县',
      'value': '320923' },

    {
      'label': '射阳县',
      'value': '320924' },

    {
      'label': '建湖县',
      'value': '320925' },

    {
      'label': '东台市',
      'value': '320981' },

    {
      'label': '大丰市',
      'value': '320982' }] },


  {
    'label': '扬州市',
    'value': '321000',
    'children': [{
      'label': '市辖区',
      'value': '321001' },

    {
      'label': '广陵区',
      'value': '321002' },

    {
      'label': '邗江区',
      'value': '321003' },

    {
      'label': '江都区',
      'value': '321012' },

    {
      'label': '宝应县',
      'value': '321023' },

    {
      'label': '仪征市',
      'value': '321081' },

    {
      'label': '高邮市',
      'value': '321084' }] },


  {
    'label': '镇江市',
    'value': '321100',
    'children': [{
      'label': '市辖区',
      'value': '321101' },

    {
      'label': '京口区',
      'value': '321102' },

    {
      'label': '润州区',
      'value': '321111' },

    {
      'label': '丹徒区',
      'value': '321112' },

    {
      'label': '丹阳市',
      'value': '321181' },

    {
      'label': '扬中市',
      'value': '321182' },

    {
      'label': '句容市',
      'value': '321183' }] },


  {
    'label': '泰州市',
    'value': '321200',
    'children': [{
      'label': '市辖区',
      'value': '321201' },

    {
      'label': '海陵区',
      'value': '321202' },

    {
      'label': '高港区',
      'value': '321203' },

    {
      'label': '姜堰区',
      'value': '321204' },

    {
      'label': '兴化市',
      'value': '321281' },

    {
      'label': '靖江市',
      'value': '321282' },

    {
      'label': '泰兴市',
      'value': '321283' }] },


  {
    'label': '宿迁市',
    'value': '321300',
    'children': [{
      'label': '市辖区',
      'value': '321301' },

    {
      'label': '宿城区',
      'value': '321302' },

    {
      'label': '宿豫区',
      'value': '321311' },

    {
      'label': '沭阳县',
      'value': '321322' },

    {
      'label': '泗阳县',
      'value': '321323' },

    {
      'label': '泗洪县',
      'value': '321324' }] }] },



{
  'label': '浙江省',
  'value': '330000',
  'children': [{
    'label': '杭州市',
    'value': '330100',
    'children': [{
      'label': '市辖区',
      'value': '330101' },

    {
      'label': '上城区',
      'value': '330102' },

    {
      'label': '下城区',
      'value': '330103' },

    {
      'label': '江干区',
      'value': '330104' },

    {
      'label': '拱墅区',
      'value': '330105' },

    {
      'label': '西湖区',
      'value': '330106' },

    {
      'label': '滨江区',
      'value': '330108' },

    {
      'label': '萧山区',
      'value': '330109' },

    {
      'label': '余杭区',
      'value': '330110' },

    {
      'label': '富阳区',
      'value': '330111' },

    {
      'label': '桐庐县',
      'value': '330122' },

    {
      'label': '淳安县',
      'value': '330127' },

    {
      'label': '建德市',
      'value': '330182' },

    {
      'label': '临安市',
      'value': '330185' }] },


  {
    'label': '宁波市',
    'value': '330200',
    'children': [{
      'label': '市辖区',
      'value': '330201' },

    {
      'label': '海曙区',
      'value': '330203' },

    {
      'label': '江东区',
      'value': '330204' },

    {
      'label': '江北区',
      'value': '330205' },

    {
      'label': '北仑区',
      'value': '330206' },

    {
      'label': '镇海区',
      'value': '330211' },

    {
      'label': '鄞州区',
      'value': '330212' },

    {
      'label': '象山县',
      'value': '330225' },

    {
      'label': '宁海县',
      'value': '330226' },

    {
      'label': '余姚市',
      'value': '330281' },

    {
      'label': '慈溪市',
      'value': '330282' },

    {
      'label': '奉化市',
      'value': '330283' }] },


  {
    'label': '温州市',
    'value': '330300',
    'children': [{
      'label': '市辖区',
      'value': '330301' },

    {
      'label': '鹿城区',
      'value': '330302' },

    {
      'label': '龙湾区',
      'value': '330303' },

    {
      'label': '瓯海区',
      'value': '330304' },

    {
      'label': '洞头县',
      'value': '330322' },

    {
      'label': '永嘉县',
      'value': '330324' },

    {
      'label': '平阳县',
      'value': '330326' },

    {
      'label': '苍南县',
      'value': '330327' },

    {
      'label': '文成县',
      'value': '330328' },

    {
      'label': '泰顺县',
      'value': '330329' },

    {
      'label': '瑞安市',
      'value': '330381' },

    {
      'label': '乐清市',
      'value': '330382' }] },


  {
    'label': '嘉兴市',
    'value': '330400',
    'children': [{
      'label': '市辖区',
      'value': '330401' },

    {
      'label': '南湖区',
      'value': '330402' },

    {
      'label': '秀洲区',
      'value': '330411' },

    {
      'label': '嘉善县',
      'value': '330421' },

    {
      'label': '海盐县',
      'value': '330424' },

    {
      'label': '海宁市',
      'value': '330481' },

    {
      'label': '平湖市',
      'value': '330482' },

    {
      'label': '桐乡市',
      'value': '330483' }] },


  {
    'label': '湖州市',
    'value': '330500',
    'children': [{
      'label': '市辖区',
      'value': '330501' },

    {
      'label': '吴兴区',
      'value': '330502' },

    {
      'label': '南浔区',
      'value': '330503' },

    {
      'label': '德清县',
      'value': '330521' },

    {
      'label': '长兴县',
      'value': '330522' },

    {
      'label': '安吉县',
      'value': '330523' }] },


  {
    'label': '绍兴市',
    'value': '330600',
    'children': [{
      'label': '市辖区',
      'value': '330601' },

    {
      'label': '越城区',
      'value': '330602' },

    {
      'label': '柯桥区',
      'value': '330603' },

    {
      'label': '上虞区',
      'value': '330604' },

    {
      'label': '新昌县',
      'value': '330624' },

    {
      'label': '诸暨市',
      'value': '330681' },

    {
      'label': '嵊州市',
      'value': '330683' }] },


  {
    'label': '金华市',
    'value': '330700',
    'children': [{
      'label': '市辖区',
      'value': '330701' },

    {
      'label': '婺城区',
      'value': '330702' },

    {
      'label': '金东区',
      'value': '330703' },

    {
      'label': '武义县',
      'value': '330723' },

    {
      'label': '浦江县',
      'value': '330726' },

    {
      'label': '磐安县',
      'value': '330727' },

    {
      'label': '兰溪市',
      'value': '330781' },

    {
      'label': '义乌市',
      'value': '330782' },

    {
      'label': '东阳市',
      'value': '330783' },

    {
      'label': '永康市',
      'value': '330784' }] },


  {
    'label': '衢州市',
    'value': '330800',
    'children': [{
      'label': '市辖区',
      'value': '330801' },

    {
      'label': '柯城区',
      'value': '330802' },

    {
      'label': '衢江区',
      'value': '330803' },

    {
      'label': '常山县',
      'value': '330822' },

    {
      'label': '开化县',
      'value': '330824' },

    {
      'label': '龙游县',
      'value': '330825' },

    {
      'label': '江山市',
      'value': '330881' }] },


  {
    'label': '舟山市',
    'value': '330900',
    'children': [{
      'label': '市辖区',
      'value': '330901' },

    {
      'label': '定海区',
      'value': '330902' },

    {
      'label': '普陀区',
      'value': '330903' },

    {
      'label': '岱山县',
      'value': '330921' },

    {
      'label': '嵊泗县',
      'value': '330922' }] },


  {
    'label': '台州市',
    'value': '331000',
    'children': [{
      'label': '市辖区',
      'value': '331001' },

    {
      'label': '椒江区',
      'value': '331002' },

    {
      'label': '黄岩区',
      'value': '331003' },

    {
      'label': '路桥区',
      'value': '331004' },

    {
      'label': '玉环县',
      'value': '331021' },

    {
      'label': '三门县',
      'value': '331022' },

    {
      'label': '天台县',
      'value': '331023' },

    {
      'label': '仙居县',
      'value': '331024' },

    {
      'label': '温岭市',
      'value': '331081' },

    {
      'label': '临海市',
      'value': '331082' }] },


  {
    'label': '丽水市',
    'value': '331100',
    'children': [{
      'label': '市辖区',
      'value': '331101' },

    {
      'label': '莲都区',
      'value': '331102' },

    {
      'label': '青田县',
      'value': '331121' },

    {
      'label': '缙云县',
      'value': '331122' },

    {
      'label': '遂昌县',
      'value': '331123' },

    {
      'label': '松阳县',
      'value': '331124' },

    {
      'label': '云和县',
      'value': '331125' },

    {
      'label': '庆元县',
      'value': '331126' },

    {
      'label': '景宁畲族自治县',
      'value': '331127' },

    {
      'label': '龙泉市',
      'value': '331181' }] }] },



{
  'label': '安徽省',
  'value': '340000',
  'children': [{
    'label': '合肥市',
    'value': '340100',
    'children': [{
      'label': '市辖区',
      'value': '340101' },

    {
      'label': '瑶海区',
      'value': '340102' },

    {
      'label': '庐阳区',
      'value': '340103' },

    {
      'label': '蜀山区',
      'value': '340104' },

    {
      'label': '包河区',
      'value': '340111' },

    {
      'label': '长丰县',
      'value': '340121' },

    {
      'label': '肥东县',
      'value': '340122' },

    {
      'label': '肥西县',
      'value': '340123' },

    {
      'label': '庐江县',
      'value': '340124' },

    {
      'label': '巢湖市',
      'value': '340181' }] },


  {
    'label': '芜湖市',
    'value': '340200',
    'children': [{
      'label': '市辖区',
      'value': '340201' },

    {
      'label': '镜湖区',
      'value': '340202' },

    {
      'label': '弋江区',
      'value': '340203' },

    {
      'label': '鸠江区',
      'value': '340207' },

    {
      'label': '三山区',
      'value': '340208' },

    {
      'label': '芜湖县',
      'value': '340221' },

    {
      'label': '繁昌县',
      'value': '340222' },

    {
      'label': '南陵县',
      'value': '340223' },

    {
      'label': '无为县',
      'value': '340225' }] },


  {
    'label': '蚌埠市',
    'value': '340300',
    'children': [{
      'label': '市辖区',
      'value': '340301' },

    {
      'label': '龙子湖区',
      'value': '340302' },

    {
      'label': '蚌山区',
      'value': '340303' },

    {
      'label': '禹会区',
      'value': '340304' },

    {
      'label': '淮上区',
      'value': '340311' },

    {
      'label': '怀远县',
      'value': '340321' },

    {
      'label': '五河县',
      'value': '340322' },

    {
      'label': '固镇县',
      'value': '340323' }] },


  {
    'label': '淮南市',
    'value': '340400',
    'children': [{
      'label': '市辖区',
      'value': '340401' },

    {
      'label': '大通区',
      'value': '340402' },

    {
      'label': '田家庵区',
      'value': '340403' },

    {
      'label': '谢家集区',
      'value': '340404' },

    {
      'label': '八公山区',
      'value': '340405' },

    {
      'label': '潘集区',
      'value': '340406' },

    {
      'label': '凤台县',
      'value': '340421' }] },


  {
    'label': '马鞍山市',
    'value': '340500',
    'children': [{
      'label': '市辖区',
      'value': '340501' },

    {
      'label': '花山区',
      'value': '340503' },

    {
      'label': '雨山区',
      'value': '340504' },

    {
      'label': '博望区',
      'value': '340506' },

    {
      'label': '当涂县',
      'value': '340521' },

    {
      'label': '含山县',
      'value': '340522' },

    {
      'label': '和县',
      'value': '340523' }] },


  {
    'label': '淮北市',
    'value': '340600',
    'children': [{
      'label': '市辖区',
      'value': '340601' },

    {
      'label': '杜集区',
      'value': '340602' },

    {
      'label': '相山区',
      'value': '340603' },

    {
      'label': '烈山区',
      'value': '340604' },

    {
      'label': '濉溪县',
      'value': '340621' }] },


  {
    'label': '铜陵市',
    'value': '340700',
    'children': [{
      'label': '市辖区',
      'value': '340701' },

    {
      'label': '铜官山区',
      'value': '340702' },

    {
      'label': '狮子山区',
      'value': '340703' },

    {
      'label': '郊区',
      'value': '340711' },

    {
      'label': '铜陵县',
      'value': '340721' }] },


  {
    'label': '安庆市',
    'value': '340800',
    'children': [{
      'label': '市辖区',
      'value': '340801' },

    {
      'label': '迎江区',
      'value': '340802' },

    {
      'label': '大观区',
      'value': '340803' },

    {
      'label': '宜秀区',
      'value': '340811' },

    {
      'label': '怀宁县',
      'value': '340822' },

    {
      'label': '枞阳县',
      'value': '340823' },

    {
      'label': '潜山县',
      'value': '340824' },

    {
      'label': '太湖县',
      'value': '340825' },

    {
      'label': '宿松县',
      'value': '340826' },

    {
      'label': '望江县',
      'value': '340827' },

    {
      'label': '岳西县',
      'value': '340828' },

    {
      'label': '桐城市',
      'value': '340881' }] },


  {
    'label': '黄山市',
    'value': '341000',
    'children': [{
      'label': '市辖区',
      'value': '341001' },

    {
      'label': '屯溪区',
      'value': '341002' },

    {
      'label': '黄山区',
      'value': '341003' },

    {
      'label': '徽州区',
      'value': '341004' },

    {
      'label': '歙县',
      'value': '341021' },

    {
      'label': '休宁县',
      'value': '341022' },

    {
      'label': '黟县',
      'value': '341023' },

    {
      'label': '祁门县',
      'value': '341024' }] },


  {
    'label': '滁州市',
    'value': '341100',
    'children': [{
      'label': '市辖区',
      'value': '341101' },

    {
      'label': '琅琊区',
      'value': '341102' },

    {
      'label': '南谯区',
      'value': '341103' },

    {
      'label': '来安县',
      'value': '341122' },

    {
      'label': '全椒县',
      'value': '341124' },

    {
      'label': '定远县',
      'value': '341125' },

    {
      'label': '凤阳县',
      'value': '341126' },

    {
      'label': '天长市',
      'value': '341181' },

    {
      'label': '明光市',
      'value': '341182' }] },


  {
    'label': '阜阳市',
    'value': '341200',
    'children': [{
      'label': '市辖区',
      'value': '341201' },

    {
      'label': '颍州区',
      'value': '341202' },

    {
      'label': '颍东区',
      'value': '341203' },

    {
      'label': '颍泉区',
      'value': '341204' },

    {
      'label': '临泉县',
      'value': '341221' },

    {
      'label': '太和县',
      'value': '341222' },

    {
      'label': '阜南县',
      'value': '341225' },

    {
      'label': '颍上县',
      'value': '341226' },

    {
      'label': '界首市',
      'value': '341282' }] },


  {
    'label': '宿州市',
    'value': '341300',
    'children': [{
      'label': '市辖区',
      'value': '341301' },

    {
      'label': '埇桥区',
      'value': '341302' },

    {
      'label': '砀山县',
      'value': '341321' },

    {
      'label': '萧县',
      'value': '341322' },

    {
      'label': '灵璧县',
      'value': '341323' },

    {
      'label': '泗县',
      'value': '341324' }] },


  {
    'label': '六安市',
    'value': '341500',
    'children': [{
      'label': '市辖区',
      'value': '341501' },

    {
      'label': '金安区',
      'value': '341502' },

    {
      'label': '裕安区',
      'value': '341503' },

    {
      'label': '寿县',
      'value': '341521' },

    {
      'label': '霍邱县',
      'value': '341522' },

    {
      'label': '舒城县',
      'value': '341523' },

    {
      'label': '金寨县',
      'value': '341524' },

    {
      'label': '霍山县',
      'value': '341525' }] },


  {
    'label': '亳州市',
    'value': '341600',
    'children': [{
      'label': '市辖区',
      'value': '341601' },

    {
      'label': '谯城区',
      'value': '341602' },

    {
      'label': '涡阳县',
      'value': '341621' },

    {
      'label': '蒙城县',
      'value': '341622' },

    {
      'label': '利辛县',
      'value': '341623' }] },


  {
    'label': '池州市',
    'value': '341700',
    'children': [{
      'label': '市辖区',
      'value': '341701' },

    {
      'label': '贵池区',
      'value': '341702' },

    {
      'label': '东至县',
      'value': '341721' },

    {
      'label': '石台县',
      'value': '341722' },

    {
      'label': '青阳县',
      'value': '341723' }] },


  {
    'label': '宣城市',
    'value': '341800',
    'children': [{
      'label': '市辖区',
      'value': '341801' },

    {
      'label': '宣州区',
      'value': '341802' },

    {
      'label': '郎溪县',
      'value': '341821' },

    {
      'label': '广德县',
      'value': '341822' },

    {
      'label': '泾县',
      'value': '341823' },

    {
      'label': '绩溪县',
      'value': '341824' },

    {
      'label': '旌德县',
      'value': '341825' },

    {
      'label': '宁国市',
      'value': '341881' }] }] },



{
  'label': '福建省',
  'value': '350000',
  'children': [{
    'label': '福州市',
    'value': '350100',
    'children': [{
      'label': '市辖区',
      'value': '350101' },

    {
      'label': '鼓楼区',
      'value': '350102' },

    {
      'label': '台江区',
      'value': '350103' },

    {
      'label': '仓山区',
      'value': '350104' },

    {
      'label': '马尾区',
      'value': '350105' },

    {
      'label': '晋安区',
      'value': '350111' },

    {
      'label': '闽侯县',
      'value': '350121' },

    {
      'label': '连江县',
      'value': '350122' },

    {
      'label': '罗源县',
      'value': '350123' },

    {
      'label': '闽清县',
      'value': '350124' },

    {
      'label': '永泰县',
      'value': '350125' },

    {
      'label': '平潭县',
      'value': '350128' },

    {
      'label': '福清市',
      'value': '350181' },

    {
      'label': '长乐市',
      'value': '350182' }] },


  {
    'label': '厦门市',
    'value': '350200',
    'children': [{
      'label': '市辖区',
      'value': '350201' },

    {
      'label': '思明区',
      'value': '350203' },

    {
      'label': '海沧区',
      'value': '350205' },

    {
      'label': '湖里区',
      'value': '350206' },

    {
      'label': '集美区',
      'value': '350211' },

    {
      'label': '同安区',
      'value': '350212' },

    {
      'label': '翔安区',
      'value': '350213' }] },


  {
    'label': '莆田市',
    'value': '350300',
    'children': [{
      'label': '市辖区',
      'value': '350301' },

    {
      'label': '城厢区',
      'value': '350302' },

    {
      'label': '涵江区',
      'value': '350303' },

    {
      'label': '荔城区',
      'value': '350304' },

    {
      'label': '秀屿区',
      'value': '350305' },

    {
      'label': '仙游县',
      'value': '350322' }] },


  {
    'label': '三明市',
    'value': '350400',
    'children': [{
      'label': '市辖区',
      'value': '350401' },

    {
      'label': '梅列区',
      'value': '350402' },

    {
      'label': '三元区',
      'value': '350403' },

    {
      'label': '明溪县',
      'value': '350421' },

    {
      'label': '清流县',
      'value': '350423' },

    {
      'label': '宁化县',
      'value': '350424' },

    {
      'label': '大田县',
      'value': '350425' },

    {
      'label': '尤溪县',
      'value': '350426' },

    {
      'label': '沙县',
      'value': '350427' },

    {
      'label': '将乐县',
      'value': '350428' },

    {
      'label': '泰宁县',
      'value': '350429' },

    {
      'label': '建宁县',
      'value': '350430' },

    {
      'label': '永安市',
      'value': '350481' }] },


  {
    'label': '泉州市',
    'value': '350500',
    'children': [{
      'label': '市辖区',
      'value': '350501' },

    {
      'label': '鲤城区',
      'value': '350502' },

    {
      'label': '丰泽区',
      'value': '350503' },

    {
      'label': '洛江区',
      'value': '350504' },

    {
      'label': '泉港区',
      'value': '350505' },

    {
      'label': '惠安县',
      'value': '350521' },

    {
      'label': '安溪县',
      'value': '350524' },

    {
      'label': '永春县',
      'value': '350525' },

    {
      'label': '德化县',
      'value': '350526' },

    {
      'label': '金门县',
      'value': '350527' },

    {
      'label': '石狮市',
      'value': '350581' },

    {
      'label': '晋江市',
      'value': '350582' },

    {
      'label': '南安市',
      'value': '350583' }] },


  {
    'label': '漳州市',
    'value': '350600',
    'children': [{
      'label': '市辖区',
      'value': '350601' },

    {
      'label': '芗城区',
      'value': '350602' },

    {
      'label': '龙文区',
      'value': '350603' },

    {
      'label': '云霄县',
      'value': '350622' },

    {
      'label': '漳浦县',
      'value': '350623' },

    {
      'label': '诏安县',
      'value': '350624' },

    {
      'label': '长泰县',
      'value': '350625' },

    {
      'label': '东山县',
      'value': '350626' },

    {
      'label': '南靖县',
      'value': '350627' },

    {
      'label': '平和县',
      'value': '350628' },

    {
      'label': '华安县',
      'value': '350629' },

    {
      'label': '龙海市',
      'value': '350681' }] },


  {
    'label': '南平市',
    'value': '350700',
    'children': [{
      'label': '市辖区',
      'value': '350701' },

    {
      'label': '延平区',
      'value': '350702' },

    {
      'label': '建阳区',
      'value': '350703' },

    {
      'label': '顺昌县',
      'value': '350721' },

    {
      'label': '浦城县',
      'value': '350722' },

    {
      'label': '光泽县',
      'value': '350723' },

    {
      'label': '松溪县',
      'value': '350724' },

    {
      'label': '政和县',
      'value': '350725' },

    {
      'label': '邵武市',
      'value': '350781' },

    {
      'label': '武夷山市',
      'value': '350782' },

    {
      'label': '建瓯市',
      'value': '350783' }] },


  {
    'label': '龙岩市',
    'value': '350800',
    'children': [{
      'label': '市辖区',
      'value': '350801' },

    {
      'label': '新罗区',
      'value': '350802' },

    {
      'label': '永定区',
      'value': '350803' },

    {
      'label': '长汀县',
      'value': '350821' },

    {
      'label': '上杭县',
      'value': '350823' },

    {
      'label': '武平县',
      'value': '350824' },

    {
      'label': '连城县',
      'value': '350825' },

    {
      'label': '漳平市',
      'value': '350881' }] },


  {
    'label': '宁德市',
    'value': '350900',
    'children': [{
      'label': '市辖区',
      'value': '350901' },

    {
      'label': '蕉城区',
      'value': '350902' },

    {
      'label': '霞浦县',
      'value': '350921' },

    {
      'label': '古田县',
      'value': '350922' },

    {
      'label': '屏南县',
      'value': '350923' },

    {
      'label': '寿宁县',
      'value': '350924' },

    {
      'label': '周宁县',
      'value': '350925' },

    {
      'label': '柘荣县',
      'value': '350926' },

    {
      'label': '福安市',
      'value': '350981' },

    {
      'label': '福鼎市',
      'value': '350982' }] }] },



{
  'label': '江西省',
  'value': '360000',
  'children': [{
    'label': '南昌市',
    'value': '360100',
    'children': [{
      'label': '市辖区',
      'value': '360101' },

    {
      'label': '东湖区',
      'value': '360102' },

    {
      'label': '西湖区',
      'value': '360103' },

    {
      'label': '青云谱区',
      'value': '360104' },

    {
      'label': '湾里区',
      'value': '360105' },

    {
      'label': '青山湖区',
      'value': '360111' },

    {
      'label': '南昌县',
      'value': '360121' },

    {
      'label': '新建县',
      'value': '360122' },

    {
      'label': '安义县',
      'value': '360123' },

    {
      'label': '进贤县',
      'value': '360124' }] },


  {
    'label': '景德镇市',
    'value': '360200',
    'children': [{
      'label': '市辖区',
      'value': '360201' },

    {
      'label': '昌江区',
      'value': '360202' },

    {
      'label': '珠山区',
      'value': '360203' },

    {
      'label': '浮梁县',
      'value': '360222' },

    {
      'label': '乐平市',
      'value': '360281' }] },


  {
    'label': '萍乡市',
    'value': '360300',
    'children': [{
      'label': '市辖区',
      'value': '360301' },

    {
      'label': '安源区',
      'value': '360302' },

    {
      'label': '湘东区',
      'value': '360313' },

    {
      'label': '莲花县',
      'value': '360321' },

    {
      'label': '上栗县',
      'value': '360322' },

    {
      'label': '芦溪县',
      'value': '360323' }] },


  {
    'label': '九江市',
    'value': '360400',
    'children': [{
      'label': '市辖区',
      'value': '360401' },

    {
      'label': '庐山区',
      'value': '360402' },

    {
      'label': '浔阳区',
      'value': '360403' },

    {
      'label': '九江县',
      'value': '360421' },

    {
      'label': '武宁县',
      'value': '360423' },

    {
      'label': '修水县',
      'value': '360424' },

    {
      'label': '永修县',
      'value': '360425' },

    {
      'label': '德安县',
      'value': '360426' },

    {
      'label': '星子县',
      'value': '360427' },

    {
      'label': '都昌县',
      'value': '360428' },

    {
      'label': '湖口县',
      'value': '360429' },

    {
      'label': '彭泽县',
      'value': '360430' },

    {
      'label': '瑞昌市',
      'value': '360481' },

    {
      'label': '共青城市',
      'value': '360482' }] },


  {
    'label': '新余市',
    'value': '360500',
    'children': [{
      'label': '市辖区',
      'value': '360501' },

    {
      'label': '渝水区',
      'value': '360502' },

    {
      'label': '分宜县',
      'value': '360521' }] },


  {
    'label': '鹰潭市',
    'value': '360600',
    'children': [{
      'label': '市辖区',
      'value': '360601' },

    {
      'label': '月湖区',
      'value': '360602' },

    {
      'label': '余江县',
      'value': '360622' },

    {
      'label': '贵溪市',
      'value': '360681' }] },


  {
    'label': '赣州市',
    'value': '360700',
    'children': [{
      'label': '市辖区',
      'value': '360701' },

    {
      'label': '章贡区',
      'value': '360702' },

    {
      'label': '南康区',
      'value': '360703' },

    {
      'label': '赣县',
      'value': '360721' },

    {
      'label': '信丰县',
      'value': '360722' },

    {
      'label': '大余县',
      'value': '360723' },

    {
      'label': '上犹县',
      'value': '360724' },

    {
      'label': '崇义县',
      'value': '360725' },

    {
      'label': '安远县',
      'value': '360726' },

    {
      'label': '龙南县',
      'value': '360727' },

    {
      'label': '定南县',
      'value': '360728' },

    {
      'label': '全南县',
      'value': '360729' },

    {
      'label': '宁都县',
      'value': '360730' },

    {
      'label': '于都县',
      'value': '360731' },

    {
      'label': '兴国县',
      'value': '360732' },

    {
      'label': '会昌县',
      'value': '360733' },

    {
      'label': '寻乌县',
      'value': '360734' },

    {
      'label': '石城县',
      'value': '360735' },

    {
      'label': '瑞金市',
      'value': '360781' }] },


  {
    'label': '吉安市',
    'value': '360800',
    'children': [{
      'label': '市辖区',
      'value': '360801' },

    {
      'label': '吉州区',
      'value': '360802' },

    {
      'label': '青原区',
      'value': '360803' },

    {
      'label': '吉安县',
      'value': '360821' },

    {
      'label': '吉水县',
      'value': '360822' },

    {
      'label': '峡江县',
      'value': '360823' },

    {
      'label': '新干县',
      'value': '360824' },

    {
      'label': '永丰县',
      'value': '360825' },

    {
      'label': '泰和县',
      'value': '360826' },

    {
      'label': '遂川县',
      'value': '360827' },

    {
      'label': '万安县',
      'value': '360828' },

    {
      'label': '安福县',
      'value': '360829' },

    {
      'label': '永新县',
      'value': '360830' },

    {
      'label': '井冈山市',
      'value': '360881' }] },


  {
    'label': '宜春市',
    'value': '360900',
    'children': [{
      'label': '市辖区',
      'value': '360901' },

    {
      'label': '袁州区',
      'value': '360902' },

    {
      'label': '奉新县',
      'value': '360921' },

    {
      'label': '万载县',
      'value': '360922' },

    {
      'label': '上高县',
      'value': '360923' },

    {
      'label': '宜丰县',
      'value': '360924' },

    {
      'label': '靖安县',
      'value': '360925' },

    {
      'label': '铜鼓县',
      'value': '360926' },

    {
      'label': '丰城市',
      'value': '360981' },

    {
      'label': '樟树市',
      'value': '360982' },

    {
      'label': '高安市',
      'value': '360983' }] },


  {
    'label': '抚州市',
    'value': '361000',
    'children': [{
      'label': '市辖区',
      'value': '361001' },

    {
      'label': '临川区',
      'value': '361002' },

    {
      'label': '南城县',
      'value': '361021' },

    {
      'label': '黎川县',
      'value': '361022' },

    {
      'label': '南丰县',
      'value': '361023' },

    {
      'label': '崇仁县',
      'value': '361024' },

    {
      'label': '乐安县',
      'value': '361025' },

    {
      'label': '宜黄县',
      'value': '361026' },

    {
      'label': '金溪县',
      'value': '361027' },

    {
      'label': '资溪县',
      'value': '361028' },

    {
      'label': '东乡县',
      'value': '361029' },

    {
      'label': '广昌县',
      'value': '361030' }] },


  {
    'label': '上饶市',
    'value': '361100',
    'children': [{
      'label': '市辖区',
      'value': '361101' },

    {
      'label': '信州区',
      'value': '361102' },

    {
      'label': '上饶县',
      'value': '361121' },

    {
      'label': '广丰县',
      'value': '361122' },

    {
      'label': '玉山县',
      'value': '361123' },

    {
      'label': '铅山县',
      'value': '361124' },

    {
      'label': '横峰县',
      'value': '361125' },

    {
      'label': '弋阳县',
      'value': '361126' },

    {
      'label': '余干县',
      'value': '361127' },

    {
      'label': '鄱阳县',
      'value': '361128' },

    {
      'label': '万年县',
      'value': '361129' },

    {
      'label': '婺源县',
      'value': '361130' },

    {
      'label': '德兴市',
      'value': '361181' }] }] },



{
  'label': '山东省',
  'value': '370000',
  'children': [{
    'label': '济南市',
    'value': '370100',
    'children': [{
      'label': '市辖区',
      'value': '370101' },

    {
      'label': '历下区',
      'value': '370102' },

    {
      'label': '市中区',
      'value': '370103' },

    {
      'label': '槐荫区',
      'value': '370104' },

    {
      'label': '天桥区',
      'value': '370105' },

    {
      'label': '历城区',
      'value': '370112' },

    {
      'label': '长清区',
      'value': '370113' },

    {
      'label': '平阴县',
      'value': '370124' },

    {
      'label': '济阳县',
      'value': '370125' },

    {
      'label': '商河县',
      'value': '370126' },

    {
      'label': '章丘市',
      'value': '370181' }] },


  {
    'label': '青岛市',
    'value': '370200',
    'children': [{
      'label': '市辖区',
      'value': '370201' },

    {
      'label': '市南区',
      'value': '370202' },

    {
      'label': '市北区',
      'value': '370203' },

    {
      'label': '黄岛区',
      'value': '370211' },

    {
      'label': '崂山区',
      'value': '370212' },

    {
      'label': '李沧区',
      'value': '370213' },

    {
      'label': '城阳区',
      'value': '370214' },

    {
      'label': '胶州市',
      'value': '370281' },

    {
      'label': '即墨市',
      'value': '370282' },

    {
      'label': '平度市',
      'value': '370283' },

    {
      'label': '莱西市',
      'value': '370285' }] },


  {
    'label': '淄博市',
    'value': '370300',
    'children': [{
      'label': '市辖区',
      'value': '370301' },

    {
      'label': '淄川区',
      'value': '370302' },

    {
      'label': '张店区',
      'value': '370303' },

    {
      'label': '博山区',
      'value': '370304' },

    {
      'label': '临淄区',
      'value': '370305' },

    {
      'label': '周村区',
      'value': '370306' },

    {
      'label': '桓台县',
      'value': '370321' },

    {
      'label': '高青县',
      'value': '370322' },

    {
      'label': '沂源县',
      'value': '370323' }] },


  {
    'label': '枣庄市',
    'value': '370400',
    'children': [{
      'label': '市辖区',
      'value': '370401' },

    {
      'label': '市中区',
      'value': '370402' },

    {
      'label': '薛城区',
      'value': '370403' },

    {
      'label': '峄城区',
      'value': '370404' },

    {
      'label': '台儿庄区',
      'value': '370405' },

    {
      'label': '山亭区',
      'value': '370406' },

    {
      'label': '滕州市',
      'value': '370481' }] },


  {
    'label': '东营市',
    'value': '370500',
    'children': [{
      'label': '市辖区',
      'value': '370501' },

    {
      'label': '东营区',
      'value': '370502' },

    {
      'label': '河口区',
      'value': '370503' },

    {
      'label': '垦利县',
      'value': '370521' },

    {
      'label': '利津县',
      'value': '370522' },

    {
      'label': '广饶县',
      'value': '370523' }] },


  {
    'label': '烟台市',
    'value': '370600',
    'children': [{
      'label': '市辖区',
      'value': '370601' },

    {
      'label': '芝罘区',
      'value': '370602' },

    {
      'label': '福山区',
      'value': '370611' },

    {
      'label': '牟平区',
      'value': '370612' },

    {
      'label': '莱山区',
      'value': '370613' },

    {
      'label': '长岛县',
      'value': '370634' },

    {
      'label': '龙口市',
      'value': '370681' },

    {
      'label': '莱阳市',
      'value': '370682' },

    {
      'label': '莱州市',
      'value': '370683' },

    {
      'label': '蓬莱市',
      'value': '370684' },

    {
      'label': '招远市',
      'value': '370685' },

    {
      'label': '栖霞市',
      'value': '370686' },

    {
      'label': '海阳市',
      'value': '370687' }] },


  {
    'label': '潍坊市',
    'value': '370700',
    'children': [{
      'label': '市辖区',
      'value': '370701' },

    {
      'label': '潍城区',
      'value': '370702' },

    {
      'label': '寒亭区',
      'value': '370703' },

    {
      'label': '坊子区',
      'value': '370704' },

    {
      'label': '奎文区',
      'value': '370705' },

    {
      'label': '临朐县',
      'value': '370724' },

    {
      'label': '昌乐县',
      'value': '370725' },

    {
      'label': '青州市',
      'value': '370781' },

    {
      'label': '诸城市',
      'value': '370782' },

    {
      'label': '寿光市',
      'value': '370783' },

    {
      'label': '安丘市',
      'value': '370784' },

    {
      'label': '高密市',
      'value': '370785' },

    {
      'label': '昌邑市',
      'value': '370786' }] },


  {
    'label': '济宁市',
    'value': '370800',
    'children': [{
      'label': '市辖区',
      'value': '370801' },

    {
      'label': '任城区',
      'value': '370811' },

    {
      'label': '兖州区',
      'value': '370812' },

    {
      'label': '微山县',
      'value': '370826' },

    {
      'label': '鱼台县',
      'value': '370827' },

    {
      'label': '金乡县',
      'value': '370828' },

    {
      'label': '嘉祥县',
      'value': '370829' },

    {
      'label': '汶上县',
      'value': '370830' },

    {
      'label': '泗水县',
      'value': '370831' },

    {
      'label': '梁山县',
      'value': '370832' },

    {
      'label': '曲阜市',
      'value': '370881' },

    {
      'label': '邹城市',
      'value': '370883' }] },


  {
    'label': '泰安市',
    'value': '370900',
    'children': [{
      'label': '市辖区',
      'value': '370901' },

    {
      'label': '泰山区',
      'value': '370902' },

    {
      'label': '岱岳区',
      'value': '370911' },

    {
      'label': '宁阳县',
      'value': '370921' },

    {
      'label': '东平县',
      'value': '370923' },

    {
      'label': '新泰市',
      'value': '370982' },

    {
      'label': '肥城市',
      'value': '370983' }] },


  {
    'label': '威海市',
    'value': '371000',
    'children': [{
      'label': '市辖区',
      'value': '371001' },

    {
      'label': '环翠区',
      'value': '371002' },

    {
      'label': '文登市',
      'value': '371081' },

    {
      'label': '荣成市',
      'value': '371082' },

    {
      'label': '乳山市',
      'value': '371083' }] },


  {
    'label': '日照市',
    'value': '371100',
    'children': [{
      'label': '市辖区',
      'value': '371101' },

    {
      'label': '东港区',
      'value': '371102' },

    {
      'label': '岚山区',
      'value': '371103' },

    {
      'label': '五莲县',
      'value': '371121' },

    {
      'label': '莒县',
      'value': '371122' }] },


  {
    'label': '莱芜市',
    'value': '371200',
    'children': [{
      'label': '市辖区',
      'value': '371201' },

    {
      'label': '莱城区',
      'value': '371202' },

    {
      'label': '钢城区',
      'value': '371203' }] },


  {
    'label': '临沂市',
    'value': '371300',
    'children': [{
      'label': '市辖区',
      'value': '371301' },

    {
      'label': '兰山区',
      'value': '371302' },

    {
      'label': '罗庄区',
      'value': '371311' },

    {
      'label': '河东区',
      'value': '371312' },

    {
      'label': '沂南县',
      'value': '371321' },

    {
      'label': '郯城县',
      'value': '371322' },

    {
      'label': '沂水县',
      'value': '371323' },

    {
      'label': '兰陵县',
      'value': '371324' },

    {
      'label': '费县',
      'value': '371325' },

    {
      'label': '平邑县',
      'value': '371326' },

    {
      'label': '莒南县',
      'value': '371327' },

    {
      'label': '蒙阴县',
      'value': '371328' },

    {
      'label': '临沭县',
      'value': '371329' }] },


  {
    'label': '德州市',
    'value': '371400',
    'children': [{
      'label': '市辖区',
      'value': '371401' },

    {
      'label': '德城区',
      'value': '371402' },

    {
      'label': '陵城区',
      'value': '371403' },

    {
      'label': '宁津县',
      'value': '371422' },

    {
      'label': '庆云县',
      'value': '371423' },

    {
      'label': '临邑县',
      'value': '371424' },

    {
      'label': '齐河县',
      'value': '371425' },

    {
      'label': '平原县',
      'value': '371426' },

    {
      'label': '夏津县',
      'value': '371427' },

    {
      'label': '武城县',
      'value': '371428' },

    {
      'label': '乐陵市',
      'value': '371481' },

    {
      'label': '禹城市',
      'value': '371482' }] },


  {
    'label': '聊城市',
    'value': '371500',
    'children': [{
      'label': '市辖区',
      'value': '371501' },

    {
      'label': '东昌府区',
      'value': '371502' },

    {
      'label': '阳谷县',
      'value': '371521' },

    {
      'label': '莘县',
      'value': '371522' },

    {
      'label': '茌平县',
      'value': '371523' },

    {
      'label': '东阿县',
      'value': '371524' },

    {
      'label': '冠县',
      'value': '371525' },

    {
      'label': '高唐县',
      'value': '371526' },

    {
      'label': '临清市',
      'value': '371581' }] },


  {
    'label': '滨州市',
    'value': '371600',
    'children': [{
      'label': '市辖区',
      'value': '371601' },

    {
      'label': '滨城区',
      'value': '371602' },

    {
      'label': '沾化区',
      'value': '371603' },

    {
      'label': '惠民县',
      'value': '371621' },

    {
      'label': '阳信县',
      'value': '371622' },

    {
      'label': '无棣县',
      'value': '371623' },

    {
      'label': '博兴县',
      'value': '371625' },

    {
      'label': '邹平县',
      'value': '371626' }] },


  {
    'label': '菏泽市',
    'value': '371700',
    'children': [{
      'label': '市辖区',
      'value': '371701' },

    {
      'label': '牡丹区',
      'value': '371702' },

    {
      'label': '曹县',
      'value': '371721' },

    {
      'label': '单县',
      'value': '371722' },

    {
      'label': '成武县',
      'value': '371723' },

    {
      'label': '巨野县',
      'value': '371724' },

    {
      'label': '郓城县',
      'value': '371725' },

    {
      'label': '鄄城县',
      'value': '371726' },

    {
      'label': '定陶县',
      'value': '371727' },

    {
      'label': '东明县',
      'value': '371728' }] }] },



{
  'label': '河南省',
  'value': '410000',
  'children': [{
    'label': '郑州市',
    'value': '410100',
    'children': [{
      'label': '市辖区',
      'value': '410101' },

    {
      'label': '中原区',
      'value': '410102' },

    {
      'label': '二七区',
      'value': '410103' },

    {
      'label': '管城回族区',
      'value': '410104' },

    {
      'label': '金水区',
      'value': '410105' },

    {
      'label': '上街区',
      'value': '410106' },

    {
      'label': '惠济区',
      'value': '410108' },

    {
      'label': '中牟县',
      'value': '410122' },

    {
      'label': '巩义市',
      'value': '410181' },

    {
      'label': '荥阳市',
      'value': '410182' },

    {
      'label': '新密市',
      'value': '410183' },

    {
      'label': '新郑市',
      'value': '410184' },

    {
      'label': '登封市',
      'value': '410185' }] },


  {
    'label': '开封市',
    'value': '410200',
    'children': [{
      'label': '市辖区',
      'value': '410201' },

    {
      'label': '龙亭区',
      'value': '410202' },

    {
      'label': '顺河回族区',
      'value': '410203' },

    {
      'label': '鼓楼区',
      'value': '410204' },

    {
      'label': '禹王台区',
      'value': '410205' },

    {
      'label': '祥符区',
      'value': '410212' },

    {
      'label': '杞县',
      'value': '410221' },

    {
      'label': '通许县',
      'value': '410222' },

    {
      'label': '尉氏县',
      'value': '410223' },

    {
      'label': '兰考县',
      'value': '410225' }] },


  {
    'label': '洛阳市',
    'value': '410300',
    'children': [{
      'label': '市辖区',
      'value': '410301' },

    {
      'label': '老城区',
      'value': '410302' },

    {
      'label': '西工区',
      'value': '410303' },

    {
      'label': '瀍河回族区',
      'value': '410304' },

    {
      'label': '涧西区',
      'value': '410305' },

    {
      'label': '吉利区',
      'value': '410306' },

    {
      'label': '洛龙区',
      'value': '410311' },

    {
      'label': '孟津县',
      'value': '410322' },

    {
      'label': '新安县',
      'value': '410323' },

    {
      'label': '栾川县',
      'value': '410324' },

    {
      'label': '嵩县',
      'value': '410325' },

    {
      'label': '汝阳县',
      'value': '410326' },

    {
      'label': '宜阳县',
      'value': '410327' },

    {
      'label': '洛宁县',
      'value': '410328' },

    {
      'label': '伊川县',
      'value': '410329' },

    {
      'label': '偃师市',
      'value': '410381' }] },


  {
    'label': '平顶山市',
    'value': '410400',
    'children': [{
      'label': '市辖区',
      'value': '410401' },

    {
      'label': '新华区',
      'value': '410402' },

    {
      'label': '卫东区',
      'value': '410403' },

    {
      'label': '石龙区',
      'value': '410404' },

    {
      'label': '湛河区',
      'value': '410411' },

    {
      'label': '宝丰县',
      'value': '410421' },

    {
      'label': '叶县',
      'value': '410422' },

    {
      'label': '鲁山县',
      'value': '410423' },

    {
      'label': '郏县',
      'value': '410425' },

    {
      'label': '舞钢市',
      'value': '410481' },

    {
      'label': '汝州市',
      'value': '410482' }] },


  {
    'label': '安阳市',
    'value': '410500',
    'children': [{
      'label': '市辖区',
      'value': '410501' },

    {
      'label': '文峰区',
      'value': '410502' },

    {
      'label': '北关区',
      'value': '410503' },

    {
      'label': '殷都区',
      'value': '410505' },

    {
      'label': '龙安区',
      'value': '410506' },

    {
      'label': '安阳县',
      'value': '410522' },

    {
      'label': '汤阴县',
      'value': '410523' },

    {
      'label': '滑县',
      'value': '410526' },

    {
      'label': '内黄县',
      'value': '410527' },

    {
      'label': '林州市',
      'value': '410581' }] },


  {
    'label': '鹤壁市',
    'value': '410600',
    'children': [{
      'label': '市辖区',
      'value': '410601' },

    {
      'label': '鹤山区',
      'value': '410602' },

    {
      'label': '山城区',
      'value': '410603' },

    {
      'label': '淇滨区',
      'value': '410611' },

    {
      'label': '浚县',
      'value': '410621' },

    {
      'label': '淇县',
      'value': '410622' }] },


  {
    'label': '新乡市',
    'value': '410700',
    'children': [{
      'label': '市辖区',
      'value': '410701' },

    {
      'label': '红旗区',
      'value': '410702' },

    {
      'label': '卫滨区',
      'value': '410703' },

    {
      'label': '凤泉区',
      'value': '410704' },

    {
      'label': '牧野区',
      'value': '410711' },

    {
      'label': '新乡县',
      'value': '410721' },

    {
      'label': '获嘉县',
      'value': '410724' },

    {
      'label': '原阳县',
      'value': '410725' },

    {
      'label': '延津县',
      'value': '410726' },

    {
      'label': '封丘县',
      'value': '410727' },

    {
      'label': '长垣县',
      'value': '410728' },

    {
      'label': '卫辉市',
      'value': '410781' },

    {
      'label': '辉县市',
      'value': '410782' }] },


  {
    'label': '焦作市',
    'value': '410800',
    'children': [{
      'label': '市辖区',
      'value': '410801' },

    {
      'label': '解放区',
      'value': '410802' },

    {
      'label': '中站区',
      'value': '410803' },

    {
      'label': '马村区',
      'value': '410804' },

    {
      'label': '山阳区',
      'value': '410811' },

    {
      'label': '修武县',
      'value': '410821' },

    {
      'label': '博爱县',
      'value': '410822' },

    {
      'label': '武陟县',
      'value': '410823' },

    {
      'label': '温县',
      'value': '410825' },

    {
      'label': '沁阳市',
      'value': '410882' },

    {
      'label': '孟州市',
      'value': '410883' }] },


  {
    'label': '濮阳市',
    'value': '410900',
    'children': [{
      'label': '市辖区',
      'value': '410901' },

    {
      'label': '华龙区',
      'value': '410902' },

    {
      'label': '清丰县',
      'value': '410922' },

    {
      'label': '南乐县',
      'value': '410923' },

    {
      'label': '范县',
      'value': '410926' },

    {
      'label': '台前县',
      'value': '410927' },

    {
      'label': '濮阳县',
      'value': '410928' }] },


  {
    'label': '许昌市',
    'value': '411000',
    'children': [{
      'label': '市辖区',
      'value': '411001' },

    {
      'label': '魏都区',
      'value': '411002' },

    {
      'label': '许昌县',
      'value': '411023' },

    {
      'label': '鄢陵县',
      'value': '411024' },

    {
      'label': '襄城县',
      'value': '411025' },

    {
      'label': '禹州市',
      'value': '411081' },

    {
      'label': '长葛市',
      'value': '411082' }] },


  {
    'label': '漯河市',
    'value': '411100',
    'children': [{
      'label': '市辖区',
      'value': '411101' },

    {
      'label': '源汇区',
      'value': '411102' },

    {
      'label': '郾城区',
      'value': '411103' },

    {
      'label': '召陵区',
      'value': '411104' },

    {
      'label': '舞阳县',
      'value': '411121' },

    {
      'label': '临颍县',
      'value': '411122' }] },


  {
    'label': '三门峡市',
    'value': '411200',
    'children': [{
      'label': '市辖区',
      'value': '411201' },

    {
      'label': '湖滨区',
      'value': '411202' },

    {
      'label': '渑池县',
      'value': '411221' },

    {
      'label': '陕县',
      'value': '411222' },

    {
      'label': '卢氏县',
      'value': '411224' },

    {
      'label': '义马市',
      'value': '411281' },

    {
      'label': '灵宝市',
      'value': '411282' }] },


  {
    'label': '南阳市',
    'value': '411300',
    'children': [{
      'label': '市辖区',
      'value': '411301' },

    {
      'label': '宛城区',
      'value': '411302' },

    {
      'label': '卧龙区',
      'value': '411303' },

    {
      'label': '南召县',
      'value': '411321' },

    {
      'label': '方城县',
      'value': '411322' },

    {
      'label': '西峡县',
      'value': '411323' },

    {
      'label': '镇平县',
      'value': '411324' },

    {
      'label': '内乡县',
      'value': '411325' },

    {
      'label': '淅川县',
      'value': '411326' },

    {
      'label': '社旗县',
      'value': '411327' },

    {
      'label': '唐河县',
      'value': '411328' },

    {
      'label': '新野县',
      'value': '411329' },

    {
      'label': '桐柏县',
      'value': '411330' },

    {
      'label': '邓州市',
      'value': '411381' }] },


  {
    'label': '商丘市',
    'value': '411400',
    'children': [{
      'label': '市辖区',
      'value': '411401' },

    {
      'label': '梁园区',
      'value': '411402' },

    {
      'label': '睢阳区',
      'value': '411403' },

    {
      'label': '民权县',
      'value': '411421' },

    {
      'label': '睢县',
      'value': '411422' },

    {
      'label': '宁陵县',
      'value': '411423' },

    {
      'label': '柘城县',
      'value': '411424' },

    {
      'label': '虞城县',
      'value': '411425' },

    {
      'label': '夏邑县',
      'value': '411426' },

    {
      'label': '永城市',
      'value': '411481' }] },


  {
    'label': '信阳市',
    'value': '411500',
    'children': [{
      'label': '市辖区',
      'value': '411501' },

    {
      'label': '浉河区',
      'value': '411502' },

    {
      'label': '平桥区',
      'value': '411503' },

    {
      'label': '罗山县',
      'value': '411521' },

    {
      'label': '光山县',
      'value': '411522' },

    {
      'label': '新县',
      'value': '411523' },

    {
      'label': '商城县',
      'value': '411524' },

    {
      'label': '固始县',
      'value': '411525' },

    {
      'label': '潢川县',
      'value': '411526' },

    {
      'label': '淮滨县',
      'value': '411527' },

    {
      'label': '息县',
      'value': '411528' }] },


  {
    'label': '周口市',
    'value': '411600',
    'children': [{
      'label': '市辖区',
      'value': '411601' },

    {
      'label': '川汇区',
      'value': '411602' },

    {
      'label': '扶沟县',
      'value': '411621' },

    {
      'label': '西华县',
      'value': '411622' },

    {
      'label': '商水县',
      'value': '411623' },

    {
      'label': '沈丘县',
      'value': '411624' },

    {
      'label': '郸城县',
      'value': '411625' },

    {
      'label': '淮阳县',
      'value': '411626' },

    {
      'label': '太康县',
      'value': '411627' },

    {
      'label': '鹿邑县',
      'value': '411628' },

    {
      'label': '项城市',
      'value': '411681' }] },


  {
    'label': '驻马店市',
    'value': '411700',
    'children': [{
      'label': '市辖区',
      'value': '411701' },

    {
      'label': '驿城区',
      'value': '411702' },

    {
      'label': '西平县',
      'value': '411721' },

    {
      'label': '上蔡县',
      'value': '411722' },

    {
      'label': '平舆县',
      'value': '411723' },

    {
      'label': '正阳县',
      'value': '411724' },

    {
      'label': '确山县',
      'value': '411725' },

    {
      'label': '泌阳县',
      'value': '411726' },

    {
      'label': '汝南县',
      'value': '411727' },

    {
      'label': '遂平县',
      'value': '411728' },

    {
      'label': '新蔡县',
      'value': '411729' }] },


  {
    'label': '济源市',
    'value': '419001' }] },


{
  'label': '湖北省',
  'value': '420000',
  'children': [{
    'label': '武汉市',
    'value': '420100',
    'children': [{
      'label': '市辖区',
      'value': '420101' },

    {
      'label': '江岸区',
      'value': '420102' },

    {
      'label': '江汉区',
      'value': '420103' },

    {
      'label': '硚口区',
      'value': '420104' },

    {
      'label': '汉阳区',
      'value': '420105' },

    {
      'label': '武昌区',
      'value': '420106' },

    {
      'label': '青山区',
      'value': '420107' },

    {
      'label': '洪山区',
      'value': '420111' },

    {
      'label': '东西湖区',
      'value': '420112' },

    {
      'label': '汉南区',
      'value': '420113' },

    {
      'label': '蔡甸区',
      'value': '420114' },

    {
      'label': '江夏区',
      'value': '420115' },

    {
      'label': '黄陂区',
      'value': '420116' },

    {
      'label': '新洲区',
      'value': '420117' }] },


  {
    'label': '黄石市',
    'value': '420200',
    'children': [{
      'label': '市辖区',
      'value': '420201' },

    {
      'label': '黄石港区',
      'value': '420202' },

    {
      'label': '西塞山区',
      'value': '420203' },

    {
      'label': '下陆区',
      'value': '420204' },

    {
      'label': '铁山区',
      'value': '420205' },

    {
      'label': '阳新县',
      'value': '420222' },

    {
      'label': '大冶市',
      'value': '420281' }] },


  {
    'label': '十堰市',
    'value': '420300',
    'children': [{
      'label': '市辖区',
      'value': '420301' },

    {
      'label': '茅箭区',
      'value': '420302' },

    {
      'label': '张湾区',
      'value': '420303' },

    {
      'label': '郧阳区',
      'value': '420304' },

    {
      'label': '郧西县',
      'value': '420322' },

    {
      'label': '竹山县',
      'value': '420323' },

    {
      'label': '竹溪县',
      'value': '420324' },

    {
      'label': '房县',
      'value': '420325' },

    {
      'label': '丹江口市',
      'value': '420381' }] },


  {
    'label': '宜昌市',
    'value': '420500',
    'children': [{
      'label': '市辖区',
      'value': '420501' },

    {
      'label': '西陵区',
      'value': '420502' },

    {
      'label': '伍家岗区',
      'value': '420503' },

    {
      'label': '点军区',
      'value': '420504' },

    {
      'label': '猇亭区',
      'value': '420505' },

    {
      'label': '夷陵区',
      'value': '420506' },

    {
      'label': '远安县',
      'value': '420525' },

    {
      'label': '兴山县',
      'value': '420526' },

    {
      'label': '秭归县',
      'value': '420527' },

    {
      'label': '长阳土家族自治县',
      'value': '420528' },

    {
      'label': '五峰土家族自治县',
      'value': '420529' },

    {
      'label': '宜都市',
      'value': '420581' },

    {
      'label': '当阳市',
      'value': '420582' },

    {
      'label': '枝江市',
      'value': '420583' }] },


  {
    'label': '襄阳市',
    'value': '420600',
    'children': [{
      'label': '市辖区',
      'value': '420601' },

    {
      'label': '襄城区',
      'value': '420602' },

    {
      'label': '樊城区',
      'value': '420606' },

    {
      'label': '襄州区',
      'value': '420607' },

    {
      'label': '南漳县',
      'value': '420624' },

    {
      'label': '谷城县',
      'value': '420625' },

    {
      'label': '保康县',
      'value': '420626' },

    {
      'label': '老河口市',
      'value': '420682' },

    {
      'label': '枣阳市',
      'value': '420683' },

    {
      'label': '宜城市',
      'value': '420684' }] },


  {
    'label': '鄂州市',
    'value': '420700',
    'children': [{
      'label': '市辖区',
      'value': '420701' },

    {
      'label': '梁子湖区',
      'value': '420702' },

    {
      'label': '华容区',
      'value': '420703' },

    {
      'label': '鄂城区',
      'value': '420704' }] },


  {
    'label': '荆门市',
    'value': '420800',
    'children': [{
      'label': '市辖区',
      'value': '420801' },

    {
      'label': '东宝区',
      'value': '420802' },

    {
      'label': '掇刀区',
      'value': '420804' },

    {
      'label': '京山县',
      'value': '420821' },

    {
      'label': '沙洋县',
      'value': '420822' },

    {
      'label': '钟祥市',
      'value': '420881' }] },


  {
    'label': '孝感市',
    'value': '420900',
    'children': [{
      'label': '市辖区',
      'value': '420901' },

    {
      'label': '孝南区',
      'value': '420902' },

    {
      'label': '孝昌县',
      'value': '420921' },

    {
      'label': '大悟县',
      'value': '420922' },

    {
      'label': '云梦县',
      'value': '420923' },

    {
      'label': '应城市',
      'value': '420981' },

    {
      'label': '安陆市',
      'value': '420982' },

    {
      'label': '汉川市',
      'value': '420984' }] },


  {
    'label': '荆州市',
    'value': '421000',
    'children': [{
      'label': '市辖区',
      'value': '421001' },

    {
      'label': '沙市区',
      'value': '421002' },

    {
      'label': '荆州区',
      'value': '421003' },

    {
      'label': '公安县',
      'value': '421022' },

    {
      'label': '监利县',
      'value': '421023' },

    {
      'label': '江陵县',
      'value': '421024' },

    {
      'label': '石首市',
      'value': '421081' },

    {
      'label': '洪湖市',
      'value': '421083' },

    {
      'label': '松滋市',
      'value': '421087' }] },


  {
    'label': '黄冈市',
    'value': '421100',
    'children': [{
      'label': '市辖区',
      'value': '421101' },

    {
      'label': '黄州区',
      'value': '421102' },

    {
      'label': '团风县',
      'value': '421121' },

    {
      'label': '红安县',
      'value': '421122' },

    {
      'label': '罗田县',
      'value': '421123' },

    {
      'label': '英山县',
      'value': '421124' },

    {
      'label': '浠水县',
      'value': '421125' },

    {
      'label': '蕲春县',
      'value': '421126' },

    {
      'label': '黄梅县',
      'value': '421127' },

    {
      'label': '麻城市',
      'value': '421181' },

    {
      'label': '武穴市',
      'value': '421182' }] },


  {
    'label': '咸宁市',
    'value': '421200',
    'children': [{
      'label': '市辖区',
      'value': '421201' },

    {
      'label': '咸安区',
      'value': '421202' },

    {
      'label': '嘉鱼县',
      'value': '421221' },

    {
      'label': '通城县',
      'value': '421222' },

    {
      'label': '崇阳县',
      'value': '421223' },

    {
      'label': '通山县',
      'value': '421224' },

    {
      'label': '赤壁市',
      'value': '421281' }] },


  {
    'label': '随州市',
    'value': '421300',
    'children': [{
      'label': '市辖区',
      'value': '421301' },

    {
      'label': '曾都区',
      'value': '421303' },

    {
      'label': '随县',
      'value': '421321' },

    {
      'label': '广水市',
      'value': '421381' }] },


  {
    'label': '恩施土家族苗族自治州',
    'value': '422800',
    'children': [{
      'label': '恩施市',
      'value': '422801' },

    {
      'label': '利川市',
      'value': '422802' },

    {
      'label': '建始县',
      'value': '422822' },

    {
      'label': '巴东县',
      'value': '422823' },

    {
      'label': '宣恩县',
      'value': '422825' },

    {
      'label': '咸丰县',
      'value': '422826' },

    {
      'label': '来凤县',
      'value': '422827' },

    {
      'label': '鹤峰县',
      'value': '422828' }] },


  {
    'label': '仙桃市',
    'value': '429004' },

  {
    'label': '潜江市',
    'value': '429005' },

  {
    'label': '天门市',
    'value': '429006' },

  {
    'label': '神农架林区',
    'value': '429021' }] },


{
  'label': '湖南省',
  'value': '430000',
  'children': [{
    'label': '长沙市',
    'value': '430100',
    'children': [{
      'label': '市辖区',
      'value': '430101' },

    {
      'label': '芙蓉区',
      'value': '430102' },

    {
      'label': '天心区',
      'value': '430103' },

    {
      'label': '岳麓区',
      'value': '430104' },

    {
      'label': '开福区',
      'value': '430105' },

    {
      'label': '雨花区',
      'value': '430111' },

    {
      'label': '望城区',
      'value': '430112' },

    {
      'label': '长沙县',
      'value': '430121' },

    {
      'label': '宁乡县',
      'value': '430124' },

    {
      'label': '浏阳市',
      'value': '430181' }] },


  {
    'label': '株洲市',
    'value': '430200',
    'children': [{
      'label': '市辖区',
      'value': '430201' },

    {
      'label': '荷塘区',
      'value': '430202' },

    {
      'label': '芦淞区',
      'value': '430203' },

    {
      'label': '石峰区',
      'value': '430204' },

    {
      'label': '天元区',
      'value': '430211' },

    {
      'label': '株洲县',
      'value': '430221' },

    {
      'label': '攸县',
      'value': '430223' },

    {
      'label': '茶陵县',
      'value': '430224' },

    {
      'label': '炎陵县',
      'value': '430225' },

    {
      'label': '醴陵市',
      'value': '430281' }] },


  {
    'label': '湘潭市',
    'value': '430300',
    'children': [{
      'label': '市辖区',
      'value': '430301' },

    {
      'label': '雨湖区',
      'value': '430302' },

    {
      'label': '岳塘区',
      'value': '430304' },

    {
      'label': '湘潭县',
      'value': '430321' },

    {
      'label': '湘乡市',
      'value': '430381' },

    {
      'label': '韶山市',
      'value': '430382' }] },


  {
    'label': '衡阳市',
    'value': '430400',
    'children': [{
      'label': '市辖区',
      'value': '430401' },

    {
      'label': '珠晖区',
      'value': '430405' },

    {
      'label': '雁峰区',
      'value': '430406' },

    {
      'label': '石鼓区',
      'value': '430407' },

    {
      'label': '蒸湘区',
      'value': '430408' },

    {
      'label': '南岳区',
      'value': '430412' },

    {
      'label': '衡阳县',
      'value': '430421' },

    {
      'label': '衡南县',
      'value': '430422' },

    {
      'label': '衡山县',
      'value': '430423' },

    {
      'label': '衡东县',
      'value': '430424' },

    {
      'label': '祁东县',
      'value': '430426' },

    {
      'label': '耒阳市',
      'value': '430481' },

    {
      'label': '常宁市',
      'value': '430482' }] },


  {
    'label': '邵阳市',
    'value': '430500',
    'children': [{
      'label': '市辖区',
      'value': '430501' },

    {
      'label': '双清区',
      'value': '430502' },

    {
      'label': '大祥区',
      'value': '430503' },

    {
      'label': '北塔区',
      'value': '430511' },

    {
      'label': '邵东县',
      'value': '430521' },

    {
      'label': '新邵县',
      'value': '430522' },

    {
      'label': '邵阳县',
      'value': '430523' },

    {
      'label': '隆回县',
      'value': '430524' },

    {
      'label': '洞口县',
      'value': '430525' },

    {
      'label': '绥宁县',
      'value': '430527' },

    {
      'label': '新宁县',
      'value': '430528' },

    {
      'label': '城步苗族自治县',
      'value': '430529' },

    {
      'label': '武冈市',
      'value': '430581' }] },


  {
    'label': '岳阳市',
    'value': '430600',
    'children': [{
      'label': '市辖区',
      'value': '430601' },

    {
      'label': '岳阳楼区',
      'value': '430602' },

    {
      'label': '云溪区',
      'value': '430603' },

    {
      'label': '君山区',
      'value': '430611' },

    {
      'label': '岳阳县',
      'value': '430621' },

    {
      'label': '华容县',
      'value': '430623' },

    {
      'label': '湘阴县',
      'value': '430624' },

    {
      'label': '平江县',
      'value': '430626' },

    {
      'label': '汨罗市',
      'value': '430681' },

    {
      'label': '临湘市',
      'value': '430682' }] },


  {
    'label': '常德市',
    'value': '430700',
    'children': [{
      'label': '市辖区',
      'value': '430701' },

    {
      'label': '武陵区',
      'value': '430702' },

    {
      'label': '鼎城区',
      'value': '430703' },

    {
      'label': '安乡县',
      'value': '430721' },

    {
      'label': '汉寿县',
      'value': '430722' },

    {
      'label': '澧县',
      'value': '430723' },

    {
      'label': '临澧县',
      'value': '430724' },

    {
      'label': '桃源县',
      'value': '430725' },

    {
      'label': '石门县',
      'value': '430726' },

    {
      'label': '津市市',
      'value': '430781' }] },


  {
    'label': '张家界市',
    'value': '430800',
    'children': [{
      'label': '市辖区',
      'value': '430801' },

    {
      'label': '永定区',
      'value': '430802' },

    {
      'label': '武陵源区',
      'value': '430811' },

    {
      'label': '慈利县',
      'value': '430821' },

    {
      'label': '桑植县',
      'value': '430822' }] },


  {
    'label': '益阳市',
    'value': '430900',
    'children': [{
      'label': '市辖区',
      'value': '430901' },

    {
      'label': '资阳区',
      'value': '430902' },

    {
      'label': '赫山区',
      'value': '430903' },

    {
      'label': '南县',
      'value': '430921' },

    {
      'label': '桃江县',
      'value': '430922' },

    {
      'label': '安化县',
      'value': '430923' },

    {
      'label': '沅江市',
      'value': '430981' }] },


  {
    'label': '郴州市',
    'value': '431000',
    'children': [{
      'label': '市辖区',
      'value': '431001' },

    {
      'label': '北湖区',
      'value': '431002' },

    {
      'label': '苏仙区',
      'value': '431003' },

    {
      'label': '桂阳县',
      'value': '431021' },

    {
      'label': '宜章县',
      'value': '431022' },

    {
      'label': '永兴县',
      'value': '431023' },

    {
      'label': '嘉禾县',
      'value': '431024' },

    {
      'label': '临武县',
      'value': '431025' },

    {
      'label': '汝城县',
      'value': '431026' },

    {
      'label': '桂东县',
      'value': '431027' },

    {
      'label': '安仁县',
      'value': '431028' },

    {
      'label': '资兴市',
      'value': '431081' }] },


  {
    'label': '永州市',
    'value': '431100',
    'children': [{
      'label': '市辖区',
      'value': '431101' },

    {
      'label': '零陵区',
      'value': '431102' },

    {
      'label': '冷水滩区',
      'value': '431103' },

    {
      'label': '祁阳县',
      'value': '431121' },

    {
      'label': '东安县',
      'value': '431122' },

    {
      'label': '双牌县',
      'value': '431123' },

    {
      'label': '道县',
      'value': '431124' },

    {
      'label': '江永县',
      'value': '431125' },

    {
      'label': '宁远县',
      'value': '431126' },

    {
      'label': '蓝山县',
      'value': '431127' },

    {
      'label': '新田县',
      'value': '431128' },

    {
      'label': '江华瑶族自治县',
      'value': '431129' }] },


  {
    'label': '怀化市',
    'value': '431200',
    'children': [{
      'label': '市辖区',
      'value': '431201' },

    {
      'label': '鹤城区',
      'value': '431202' },

    {
      'label': '中方县',
      'value': '431221' },

    {
      'label': '沅陵县',
      'value': '431222' },

    {
      'label': '辰溪县',
      'value': '431223' },

    {
      'label': '溆浦县',
      'value': '431224' },

    {
      'label': '会同县',
      'value': '431225' },

    {
      'label': '麻阳苗族自治县',
      'value': '431226' },

    {
      'label': '新晃侗族自治县',
      'value': '431227' },

    {
      'label': '芷江侗族自治县',
      'value': '431228' },

    {
      'label': '靖州苗族侗族自治县',
      'value': '431229' },

    {
      'label': '通道侗族自治县',
      'value': '431230' },

    {
      'label': '洪江市',
      'value': '431281' }] },


  {
    'label': '娄底市',
    'value': '431300',
    'children': [{
      'label': '市辖区',
      'value': '431301' },

    {
      'label': '娄星区',
      'value': '431302' },

    {
      'label': '双峰县',
      'value': '431321' },

    {
      'label': '新化县',
      'value': '431322' },

    {
      'label': '冷水江市',
      'value': '431381' },

    {
      'label': '涟源市',
      'value': '431382' }] },


  {
    'label': '湘西土家族苗族自治州',
    'value': '433100',
    'children': [{
      'label': '吉首市',
      'value': '433101' },

    {
      'label': '泸溪县',
      'value': '433122' },

    {
      'label': '凤凰县',
      'value': '433123' },

    {
      'label': '花垣县',
      'value': '433124' },

    {
      'label': '保靖县',
      'value': '433125' },

    {
      'label': '古丈县',
      'value': '433126' },

    {
      'label': '永顺县',
      'value': '433127' },

    {
      'label': '龙山县',
      'value': '433130' }] }] },



{
  'label': '广东省',
  'value': '440000',
  'children': [{
    'label': '广州市',
    'value': '440100',
    'children': [{
      'label': '市辖区',
      'value': '440101' },

    {
      'label': '荔湾区',
      'value': '440103' },

    {
      'label': '越秀区',
      'value': '440104' },

    {
      'label': '海珠区',
      'value': '440105' },

    {
      'label': '天河区',
      'value': '440106' },

    {
      'label': '白云区',
      'value': '440111' },

    {
      'label': '黄埔区',
      'value': '440112' },

    {
      'label': '番禺区',
      'value': '440113' },

    {
      'label': '花都区',
      'value': '440114' },

    {
      'label': '南沙区',
      'value': '440115' },

    {
      'label': '从化区',
      'value': '440117' },

    {
      'label': '增城区',
      'value': '440118' }] },


  {
    'label': '韶关市',
    'value': '440200',
    'children': [{
      'label': '市辖区',
      'value': '440201' },

    {
      'label': '武江区',
      'value': '440203' },

    {
      'label': '浈江区',
      'value': '440204' },

    {
      'label': '曲江区',
      'value': '440205' },

    {
      'label': '始兴县',
      'value': '440222' },

    {
      'label': '仁化县',
      'value': '440224' },

    {
      'label': '翁源县',
      'value': '440229' },

    {
      'label': '乳源瑶族自治县',
      'value': '440232' },

    {
      'label': '新丰县',
      'value': '440233' },

    {
      'label': '乐昌市',
      'value': '440281' },

    {
      'label': '南雄市',
      'value': '440282' }] },


  {
    'label': '深圳市',
    'value': '440300',
    'children': [{
      'label': '市辖区',
      'value': '440301' },

    {
      'label': '罗湖区',
      'value': '440303' },

    {
      'label': '福田区',
      'value': '440304' },

    {
      'label': '南山区',
      'value': '440305' },

    {
      'label': '宝安区',
      'value': '440306' },

    {
      'label': '龙岗区',
      'value': '440307' },

    {
      'label': '盐田区',
      'value': '440308' }] },


  {
    'label': '珠海市',
    'value': '440400',
    'children': [{
      'label': '市辖区',
      'value': '440401' },

    {
      'label': '香洲区',
      'value': '440402' },

    {
      'label': '斗门区',
      'value': '440403' },

    {
      'label': '金湾区',
      'value': '440404' }] },


  {
    'label': '汕头市',
    'value': '440500',
    'children': [{
      'label': '市辖区',
      'value': '440501' },

    {
      'label': '龙湖区',
      'value': '440507' },

    {
      'label': '金平区',
      'value': '440511' },

    {
      'label': '濠江区',
      'value': '440512' },

    {
      'label': '潮阳区',
      'value': '440513' },

    {
      'label': '潮南区',
      'value': '440514' },

    {
      'label': '澄海区',
      'value': '440515' },

    {
      'label': '南澳县',
      'value': '440523' }] },


  {
    'label': '佛山市',
    'value': '440600',
    'children': [{
      'label': '市辖区',
      'value': '440601' },

    {
      'label': '禅城区',
      'value': '440604' },

    {
      'label': '南海区',
      'value': '440605' },

    {
      'label': '顺德区',
      'value': '440606' },

    {
      'label': '三水区',
      'value': '440607' },

    {
      'label': '高明区',
      'value': '440608' }] },


  {
    'label': '江门市',
    'value': '440700',
    'children': [{
      'label': '市辖区',
      'value': '440701' },

    {
      'label': '蓬江区',
      'value': '440703' },

    {
      'label': '江海区',
      'value': '440704' },

    {
      'label': '新会区',
      'value': '440705' },

    {
      'label': '台山市',
      'value': '440781' },

    {
      'label': '开平市',
      'value': '440783' },

    {
      'label': '鹤山市',
      'value': '440784' },

    {
      'label': '恩平市',
      'value': '440785' }] },


  {
    'label': '湛江市',
    'value': '440800',
    'children': [{
      'label': '市辖区',
      'value': '440801' },

    {
      'label': '赤坎区',
      'value': '440802' },

    {
      'label': '霞山区',
      'value': '440803' },

    {
      'label': '坡头区',
      'value': '440804' },

    {
      'label': '麻章区',
      'value': '440811' },

    {
      'label': '遂溪县',
      'value': '440823' },

    {
      'label': '徐闻县',
      'value': '440825' },

    {
      'label': '廉江市',
      'value': '440881' },

    {
      'label': '雷州市',
      'value': '440882' },

    {
      'label': '吴川市',
      'value': '440883' }] },


  {
    'label': '茂名市',
    'value': '440900',
    'children': [{
      'label': '市辖区',
      'value': '440901' },

    {
      'label': '茂南区',
      'value': '440902' },

    {
      'label': '电白区',
      'value': '440904' },

    {
      'label': '高州市',
      'value': '440981' },

    {
      'label': '化州市',
      'value': '440982' },

    {
      'label': '信宜市',
      'value': '440983' }] },


  {
    'label': '肇庆市',
    'value': '441200',
    'children': [{
      'label': '市辖区',
      'value': '441201' },

    {
      'label': '端州区',
      'value': '441202' },

    {
      'label': '鼎湖区',
      'value': '441203' },

    {
      'label': '广宁县',
      'value': '441223' },

    {
      'label': '怀集县',
      'value': '441224' },

    {
      'label': '封开县',
      'value': '441225' },

    {
      'label': '德庆县',
      'value': '441226' },

    {
      'label': '高要市',
      'value': '441283' },

    {
      'label': '四会市',
      'value': '441284' }] },


  {
    'label': '惠州市',
    'value': '441300',
    'children': [{
      'label': '市辖区',
      'value': '441301' },

    {
      'label': '惠城区',
      'value': '441302' },

    {
      'label': '惠阳区',
      'value': '441303' },

    {
      'label': '博罗县',
      'value': '441322' },

    {
      'label': '惠东县',
      'value': '441323' },

    {
      'label': '龙门县',
      'value': '441324' }] },


  {
    'label': '梅州市',
    'value': '441400',
    'children': [{
      'label': '市辖区',
      'value': '441401' },

    {
      'label': '梅江区',
      'value': '441402' },

    {
      'label': '梅县区',
      'value': '441403' },

    {
      'label': '大埔县',
      'value': '441422' },

    {
      'label': '丰顺县',
      'value': '441423' },

    {
      'label': '五华县',
      'value': '441424' },

    {
      'label': '平远县',
      'value': '441426' },

    {
      'label': '蕉岭县',
      'value': '441427' },

    {
      'label': '兴宁市',
      'value': '441481' }] },


  {
    'label': '汕尾市',
    'value': '441500',
    'children': [{
      'label': '市辖区',
      'value': '441501' },

    {
      'label': '城区',
      'value': '441502' },

    {
      'label': '海丰县',
      'value': '441521' },

    {
      'label': '陆河县',
      'value': '441523' },

    {
      'label': '陆丰市',
      'value': '441581' }] },


  {
    'label': '河源市',
    'value': '441600',
    'children': [{
      'label': '市辖区',
      'value': '441601' },

    {
      'label': '源城区',
      'value': '441602' },

    {
      'label': '紫金县',
      'value': '441621' },

    {
      'label': '龙川县',
      'value': '441622' },

    {
      'label': '连平县',
      'value': '441623' },

    {
      'label': '和平县',
      'value': '441624' },

    {
      'label': '东源县',
      'value': '441625' }] },


  {
    'label': '阳江市',
    'value': '441700',
    'children': [{
      'label': '市辖区',
      'value': '441701' },

    {
      'label': '江城区',
      'value': '441702' },

    {
      'label': '阳东区',
      'value': '441704' },

    {
      'label': '阳西县',
      'value': '441721' },

    {
      'label': '阳春市',
      'value': '441781' }] },


  {
    'label': '清远市',
    'value': '441800',
    'children': [{
      'label': '市辖区',
      'value': '441801' },

    {
      'label': '清城区',
      'value': '441802' },

    {
      'label': '清新区',
      'value': '441803' },

    {
      'label': '佛冈县',
      'value': '441821' },

    {
      'label': '阳山县',
      'value': '441823' },

    {
      'label': '连山壮族瑶族自治县',
      'value': '441825' },

    {
      'label': '连南瑶族自治县',
      'value': '441826' },

    {
      'label': '英德市',
      'value': '441881' },

    {
      'label': '连州市',
      'value': '441882' }] },


  {
    'label': '东莞市',
    'value': '441900',
    'children': [] },



  {
    'label': '中山市',
    'value': '442000',
    'children': [] },



  {
    'label': '潮州市',
    'value': '445100',
    'children': [{
      'label': '市辖区',
      'value': '445101' },

    {
      'label': '湘桥区',
      'value': '445102' },

    {
      'label': '潮安区',
      'value': '445103' },

    {
      'label': '饶平县',
      'value': '445122' }] },


  {
    'label': '揭阳市',
    'value': '445200',
    'children': [{
      'label': '市辖区',
      'value': '445201' },

    {
      'label': '榕城区',
      'value': '445202' },

    {
      'label': '揭东区',
      'value': '445203' },

    {
      'label': '揭西县',
      'value': '445222' },

    {
      'label': '惠来县',
      'value': '445224' },

    {
      'label': '普宁市',
      'value': '445281' }] },


  {
    'label': '云浮市',
    'value': '445300',
    'children': [{
      'label': '市辖区',
      'value': '445301' },

    {
      'label': '云城区',
      'value': '445302' },

    {
      'label': '云安区',
      'value': '445303' },

    {
      'label': '新兴县',
      'value': '445321' },

    {
      'label': '郁南县',
      'value': '445322' },

    {
      'label': '罗定市',
      'value': '445381' }] }] },



{
  'label': '广西壮族自治区',
  'value': '450000',
  'children': [{
    'label': '南宁市',
    'value': '450100',
    'children': [{
      'label': '市辖区',
      'value': '450101' },

    {
      'label': '兴宁区',
      'value': '450102' },

    {
      'label': '青秀区',
      'value': '450103' },

    {
      'label': '江南区',
      'value': '450105' },

    {
      'label': '西乡塘区',
      'value': '450107' },

    {
      'label': '良庆区',
      'value': '450108' },

    {
      'label': '邕宁区',
      'value': '450109' },

    {
      'label': '武鸣县',
      'value': '450122' },

    {
      'label': '隆安县',
      'value': '450123' },

    {
      'label': '马山县',
      'value': '450124' },

    {
      'label': '上林县',
      'value': '450125' },

    {
      'label': '宾阳县',
      'value': '450126' },

    {
      'label': '横县',
      'value': '450127' }] },


  {
    'label': '柳州市',
    'value': '450200',
    'children': [{
      'label': '市辖区',
      'value': '450201' },

    {
      'label': '城中区',
      'value': '450202' },

    {
      'label': '鱼峰区',
      'value': '450203' },

    {
      'label': '柳南区',
      'value': '450204' },

    {
      'label': '柳北区',
      'value': '450205' },

    {
      'label': '柳江县',
      'value': '450221' },

    {
      'label': '柳城县',
      'value': '450222' },

    {
      'label': '鹿寨县',
      'value': '450223' },

    {
      'label': '融安县',
      'value': '450224' },

    {
      'label': '融水苗族自治县',
      'value': '450225' },

    {
      'label': '三江侗族自治县',
      'value': '450226' }] },


  {
    'label': '桂林市',
    'value': '450300',
    'children': [{
      'label': '市辖区',
      'value': '450301' },

    {
      'label': '秀峰区',
      'value': '450302' },

    {
      'label': '叠彩区',
      'value': '450303' },

    {
      'label': '象山区',
      'value': '450304' },

    {
      'label': '七星区',
      'value': '450305' },

    {
      'label': '雁山区',
      'value': '450311' },

    {
      'label': '临桂区',
      'value': '450312' },

    {
      'label': '阳朔县',
      'value': '450321' },

    {
      'label': '灵川县',
      'value': '450323' },

    {
      'label': '全州县',
      'value': '450324' },

    {
      'label': '兴安县',
      'value': '450325' },

    {
      'label': '永福县',
      'value': '450326' },

    {
      'label': '灌阳县',
      'value': '450327' },

    {
      'label': '龙胜各族自治县',
      'value': '450328' },

    {
      'label': '资源县',
      'value': '450329' },

    {
      'label': '平乐县',
      'value': '450330' },

    {
      'label': '荔浦县',
      'value': '450331' },

    {
      'label': '恭城瑶族自治县',
      'value': '450332' }] },


  {
    'label': '梧州市',
    'value': '450400',
    'children': [{
      'label': '市辖区',
      'value': '450401' },

    {
      'label': '万秀区',
      'value': '450403' },

    {
      'label': '长洲区',
      'value': '450405' },

    {
      'label': '龙圩区',
      'value': '450406' },

    {
      'label': '苍梧县',
      'value': '450421' },

    {
      'label': '藤县',
      'value': '450422' },

    {
      'label': '蒙山县',
      'value': '450423' },

    {
      'label': '岑溪市',
      'value': '450481' }] },


  {
    'label': '北海市',
    'value': '450500',
    'children': [{
      'label': '市辖区',
      'value': '450501' },

    {
      'label': '海城区',
      'value': '450502' },

    {
      'label': '银海区',
      'value': '450503' },

    {
      'label': '铁山港区',
      'value': '450512' },

    {
      'label': '合浦县',
      'value': '450521' }] },


  {
    'label': '防城港市',
    'value': '450600',
    'children': [{
      'label': '市辖区',
      'value': '450601' },

    {
      'label': '港口区',
      'value': '450602' },

    {
      'label': '防城区',
      'value': '450603' },

    {
      'label': '上思县',
      'value': '450621' },

    {
      'label': '东兴市',
      'value': '450681' }] },


  {
    'label': '钦州市',
    'value': '450700',
    'children': [{
      'label': '市辖区',
      'value': '450701' },

    {
      'label': '钦南区',
      'value': '450702' },

    {
      'label': '钦北区',
      'value': '450703' },

    {
      'label': '灵山县',
      'value': '450721' },

    {
      'label': '浦北县',
      'value': '450722' }] },


  {
    'label': '贵港市',
    'value': '450800',
    'children': [{
      'label': '市辖区',
      'value': '450801' },

    {
      'label': '港北区',
      'value': '450802' },

    {
      'label': '港南区',
      'value': '450803' },

    {
      'label': '覃塘区',
      'value': '450804' },

    {
      'label': '平南县',
      'value': '450821' },

    {
      'label': '桂平市',
      'value': '450881' }] },


  {
    'label': '玉林市',
    'value': '450900',
    'children': [{
      'label': '市辖区',
      'value': '450901' },

    {
      'label': '玉州区',
      'value': '450902' },

    {
      'label': '福绵区',
      'value': '450903' },

    {
      'label': '容县',
      'value': '450921' },

    {
      'label': '陆川县',
      'value': '450922' },

    {
      'label': '博白县',
      'value': '450923' },

    {
      'label': '兴业县',
      'value': '450924' },

    {
      'label': '北流市',
      'value': '450981' }] },


  {
    'label': '百色市',
    'value': '451000',
    'children': [{
      'label': '市辖区',
      'value': '451001' },

    {
      'label': '右江区',
      'value': '451002' },

    {
      'label': '田阳县',
      'value': '451021' },

    {
      'label': '田东县',
      'value': '451022' },

    {
      'label': '平果县',
      'value': '451023' },

    {
      'label': '德保县',
      'value': '451024' },

    {
      'label': '靖西县',
      'value': '451025' },

    {
      'label': '那坡县',
      'value': '451026' },

    {
      'label': '凌云县',
      'value': '451027' },

    {
      'label': '乐业县',
      'value': '451028' },

    {
      'label': '田林县',
      'value': '451029' },

    {
      'label': '西林县',
      'value': '451030' },

    {
      'label': '隆林各族自治县',
      'value': '451031' }] },


  {
    'label': '贺州市',
    'value': '451100',
    'children': [{
      'label': '市辖区',
      'value': '451101' },

    {
      'label': '八步区',
      'value': '451102' },

    {
      'label': '平桂管理区',
      'value': '451119' },

    {
      'label': '昭平县',
      'value': '451121' },

    {
      'label': '钟山县',
      'value': '451122' },

    {
      'label': '富川瑶族自治县',
      'value': '451123' }] },


  {
    'label': '河池市',
    'value': '451200',
    'children': [{
      'label': '市辖区',
      'value': '451201' },

    {
      'label': '金城江区',
      'value': '451202' },

    {
      'label': '南丹县',
      'value': '451221' },

    {
      'label': '天峨县',
      'value': '451222' },

    {
      'label': '凤山县',
      'value': '451223' },

    {
      'label': '东兰县',
      'value': '451224' },

    {
      'label': '罗城仫佬族自治县',
      'value': '451225' },

    {
      'label': '环江毛南族自治县',
      'value': '451226' },

    {
      'label': '巴马瑶族自治县',
      'value': '451227' },

    {
      'label': '都安瑶族自治县',
      'value': '451228' },

    {
      'label': '大化瑶族自治县',
      'value': '451229' },

    {
      'label': '宜州市',
      'value': '451281' }] },


  {
    'label': '来宾市',
    'value': '451300',
    'children': [{
      'label': '市辖区',
      'value': '451301' },

    {
      'label': '兴宾区',
      'value': '451302' },

    {
      'label': '忻城县',
      'value': '451321' },

    {
      'label': '象州县',
      'value': '451322' },

    {
      'label': '武宣县',
      'value': '451323' },

    {
      'label': '金秀瑶族自治县',
      'value': '451324' },

    {
      'label': '合山市',
      'value': '451381' }] },


  {
    'label': '崇左市',
    'value': '451400',
    'children': [{
      'label': '市辖区',
      'value': '451401' },

    {
      'label': '江州区',
      'value': '451402' },

    {
      'label': '扶绥县',
      'value': '451421' },

    {
      'label': '宁明县',
      'value': '451422' },

    {
      'label': '龙州县',
      'value': '451423' },

    {
      'label': '大新县',
      'value': '451424' },

    {
      'label': '天等县',
      'value': '451425' },

    {
      'label': '凭祥市',
      'value': '451481' }] }] },



{
  'label': '海南省',
  'value': '460000',
  'children': [{
    'label': '海口市',
    'value': '460100',
    'children': [{
      'label': '市辖区',
      'value': '460101' },

    {
      'label': '秀英区',
      'value': '460105' },

    {
      'label': '龙华区',
      'value': '460106' },

    {
      'label': '琼山区',
      'value': '460107' },

    {
      'label': '美兰区',
      'value': '460108' }] },


  {
    'label': '三亚市',
    'value': '460200',
    'children': [{
      'label': '市辖区',
      'value': '460201' },

    {
      'label': '海棠区',
      'value': '460202' },

    {
      'label': '吉阳区',
      'value': '460203' },

    {
      'label': '天涯区',
      'value': '460204' },

    {
      'label': '崖州区',
      'value': '460205' }] },


  {
    'label': '三沙市',
    'value': '460300',
    'children': [{
      'label': '西沙群岛',
      'value': '460321' },

    {
      'label': '南沙群岛',
      'value': '460322' },

    {
      'label': '中沙群岛的岛礁及其海域',
      'value': '460323' }] },


  {
    'label': '五指山市',
    'value': '469001' },

  {
    'label': '琼海市',
    'value': '469002' },

  {
    'label': '儋州市',
    'value': '469003' },

  {
    'label': '文昌市',
    'value': '469005' },

  {
    'label': '万宁市',
    'value': '469006' },

  {
    'label': '东方市',
    'value': '469007' },

  {
    'label': '定安县',
    'value': '469021' },

  {
    'label': '屯昌县',
    'value': '469022' },

  {
    'label': '澄迈县',
    'value': '469023' },

  {
    'label': '临高县',
    'value': '469024' },

  {
    'label': '白沙黎族自治县',
    'value': '469025' },

  {
    'label': '昌江黎族自治县',
    'value': '469026' },

  {
    'label': '乐东黎族自治县',
    'value': '469027' },

  {
    'label': '陵水黎族自治县',
    'value': '469028' },

  {
    'label': '保亭黎族苗族自治县',
    'value': '469029' },

  {
    'label': '琼中黎族苗族自治县',
    'value': '469030' }] },


{
  'label': '重庆',
  'value': '500000',
  'children': [{
    'label': '重庆市',
    'value': '500000',
    'children': [{
      'label': '万州区',
      'value': '500101' },

    {
      'label': '涪陵区',
      'value': '500102' },

    {
      'label': '渝中区',
      'value': '500103' },

    {
      'label': '大渡口区',
      'value': '500104' },

    {
      'label': '江北区',
      'value': '500105' },

    {
      'label': '沙坪坝区',
      'value': '500106' },

    {
      'label': '九龙坡区',
      'value': '500107' },

    {
      'label': '南岸区',
      'value': '500108' },

    {
      'label': '北碚区',
      'value': '500109' },

    {
      'label': '綦江区',
      'value': '500110' },

    {
      'label': '大足区',
      'value': '500111' },

    {
      'label': '渝北区',
      'value': '500112' },

    {
      'label': '巴南区',
      'value': '500113' },

    {
      'label': '黔江区',
      'value': '500114' },

    {
      'label': '长寿区',
      'value': '500115' },

    {
      'label': '江津区',
      'value': '500116' },

    {
      'label': '合川区',
      'value': '500117' },

    {
      'label': '永川区',
      'value': '500118' },

    {
      'label': '南川区',
      'value': '500119' },

    {
      'label': '璧山区',
      'value': '500120' },

    {
      'label': '铜梁区',
      'value': '500151' },

    {
      'label': '潼南县',
      'value': '500223' },

    {
      'label': '荣昌县',
      'value': '500226' },

    {
      'label': '梁平县',
      'value': '500228' },

    {
      'label': '城口县',
      'value': '500229' },

    {
      'label': '丰都县',
      'value': '500230' },

    {
      'label': '垫江县',
      'value': '500231' },

    {
      'label': '武隆县',
      'value': '500232' },

    {
      'label': '忠县',
      'value': '500233' },

    {
      'label': '开县',
      'value': '500234' },

    {
      'label': '云阳县',
      'value': '500235' },

    {
      'label': '奉节县',
      'value': '500236' },

    {
      'label': '巫山县',
      'value': '500237' },

    {
      'label': '巫溪县',
      'value': '500238' },

    {
      'label': '石柱土家族自治县',
      'value': '500240' },

    {
      'label': '秀山土家族苗族自治县',
      'value': '500241' },

    {
      'label': '酉阳土家族苗族自治县',
      'value': '500242' },

    {
      'label': '彭水苗族土家族自治县',
      'value': '500243' }] }] },



{
  'label': '四川省',
  'value': '510000',
  'children': [{
    'label': '成都市',
    'value': '510100',
    'children': [{
      'label': '市辖区',
      'value': '510101' },

    {
      'label': '锦江区',
      'value': '510104' },

    {
      'label': '青羊区',
      'value': '510105' },

    {
      'label': '金牛区',
      'value': '510106' },

    {
      'label': '武侯区',
      'value': '510107' },

    {
      'label': '成华区',
      'value': '510108' },

    {
      'label': '龙泉驿区',
      'value': '510112' },

    {
      'label': '青白江区',
      'value': '510113' },

    {
      'label': '新都区',
      'value': '510114' },

    {
      'label': '温江区',
      'value': '510115' },

    {
      'label': '金堂县',
      'value': '510121' },

    {
      'label': '双流县',
      'value': '510122' },

    {
      'label': '郫县',
      'value': '510124' },

    {
      'label': '大邑县',
      'value': '510129' },

    {
      'label': '蒲江县',
      'value': '510131' },

    {
      'label': '新津县',
      'value': '510132' },

    {
      'label': '都江堰市',
      'value': '510181' },

    {
      'label': '彭州市',
      'value': '510182' },

    {
      'label': '邛崃市',
      'value': '510183' },

    {
      'label': '崇州市',
      'value': '510184' }] },


  {
    'label': '自贡市',
    'value': '510300',
    'children': [{
      'label': '市辖区',
      'value': '510301' },

    {
      'label': '自流井区',
      'value': '510302' },

    {
      'label': '贡井区',
      'value': '510303' },

    {
      'label': '大安区',
      'value': '510304' },

    {
      'label': '沿滩区',
      'value': '510311' },

    {
      'label': '荣县',
      'value': '510321' },

    {
      'label': '富顺县',
      'value': '510322' }] },


  {
    'label': '攀枝花市',
    'value': '510400',
    'children': [{
      'label': '市辖区',
      'value': '510401' },

    {
      'label': '东区',
      'value': '510402' },

    {
      'label': '西区',
      'value': '510403' },

    {
      'label': '仁和区',
      'value': '510411' },

    {
      'label': '米易县',
      'value': '510421' },

    {
      'label': '盐边县',
      'value': '510422' }] },


  {
    'label': '泸州市',
    'value': '510500',
    'children': [{
      'label': '市辖区',
      'value': '510501' },

    {
      'label': '江阳区',
      'value': '510502' },

    {
      'label': '纳溪区',
      'value': '510503' },

    {
      'label': '龙马潭区',
      'value': '510504' },

    {
      'label': '泸县',
      'value': '510521' },

    {
      'label': '合江县',
      'value': '510522' },

    {
      'label': '叙永县',
      'value': '510524' },

    {
      'label': '古蔺县',
      'value': '510525' }] },


  {
    'label': '德阳市',
    'value': '510600',
    'children': [{
      'label': '市辖区',
      'value': '510601' },

    {
      'label': '旌阳区',
      'value': '510603' },

    {
      'label': '中江县',
      'value': '510623' },

    {
      'label': '罗江县',
      'value': '510626' },

    {
      'label': '广汉市',
      'value': '510681' },

    {
      'label': '什邡市',
      'value': '510682' },

    {
      'label': '绵竹市',
      'value': '510683' }] },


  {
    'label': '绵阳市',
    'value': '510700',
    'children': [{
      'label': '市辖区',
      'value': '510701' },

    {
      'label': '涪城区',
      'value': '510703' },

    {
      'label': '游仙区',
      'value': '510704' },

    {
      'label': '三台县',
      'value': '510722' },

    {
      'label': '盐亭县',
      'value': '510723' },

    {
      'label': '安县',
      'value': '510724' },

    {
      'label': '梓潼县',
      'value': '510725' },

    {
      'label': '北川羌族自治县',
      'value': '510726' },

    {
      'label': '平武县',
      'value': '510727' },

    {
      'label': '江油市',
      'value': '510781' }] },


  {
    'label': '广元市',
    'value': '510800',
    'children': [{
      'label': '市辖区',
      'value': '510801' },

    {
      'label': '利州区',
      'value': '510802' },

    {
      'label': '昭化区',
      'value': '510811' },

    {
      'label': '朝天区',
      'value': '510812' },

    {
      'label': '旺苍县',
      'value': '510821' },

    {
      'label': '青川县',
      'value': '510822' },

    {
      'label': '剑阁县',
      'value': '510823' },

    {
      'label': '苍溪县',
      'value': '510824' }] },


  {
    'label': '遂宁市',
    'value': '510900',
    'children': [{
      'label': '市辖区',
      'value': '510901' },

    {
      'label': '船山区',
      'value': '510903' },

    {
      'label': '安居区',
      'value': '510904' },

    {
      'label': '蓬溪县',
      'value': '510921' },

    {
      'label': '射洪县',
      'value': '510922' },

    {
      'label': '大英县',
      'value': '510923' }] },


  {
    'label': '内江市',
    'value': '511000',
    'children': [{
      'label': '市辖区',
      'value': '511001' },

    {
      'label': '市中区',
      'value': '511002' },

    {
      'label': '东兴区',
      'value': '511011' },

    {
      'label': '威远县',
      'value': '511024' },

    {
      'label': '资中县',
      'value': '511025' },

    {
      'label': '隆昌县',
      'value': '511028' }] },


  {
    'label': '乐山市',
    'value': '511100',
    'children': [{
      'label': '市辖区',
      'value': '511101' },

    {
      'label': '市中区',
      'value': '511102' },

    {
      'label': '沙湾区',
      'value': '511111' },

    {
      'label': '五通桥区',
      'value': '511112' },

    {
      'label': '金口河区',
      'value': '511113' },

    {
      'label': '犍为县',
      'value': '511123' },

    {
      'label': '井研县',
      'value': '511124' },

    {
      'label': '夹江县',
      'value': '511126' },

    {
      'label': '沐川县',
      'value': '511129' },

    {
      'label': '峨边彝族自治县',
      'value': '511132' },

    {
      'label': '马边彝族自治县',
      'value': '511133' },

    {
      'label': '峨眉山市',
      'value': '511181' }] },


  {
    'label': '南充市',
    'value': '511300',
    'children': [{
      'label': '市辖区',
      'value': '511301' },

    {
      'label': '顺庆区',
      'value': '511302' },

    {
      'label': '高坪区',
      'value': '511303' },

    {
      'label': '嘉陵区',
      'value': '511304' },

    {
      'label': '南部县',
      'value': '511321' },

    {
      'label': '营山县',
      'value': '511322' },

    {
      'label': '蓬安县',
      'value': '511323' },

    {
      'label': '仪陇县',
      'value': '511324' },

    {
      'label': '西充县',
      'value': '511325' },

    {
      'label': '阆中市',
      'value': '511381' }] },


  {
    'label': '眉山市',
    'value': '511400',
    'children': [{
      'label': '市辖区',
      'value': '511401' },

    {
      'label': '东坡区',
      'value': '511402' },

    {
      'label': '彭山区',
      'value': '511403' },

    {
      'label': '仁寿县',
      'value': '511421' },

    {
      'label': '洪雅县',
      'value': '511423' },

    {
      'label': '丹棱县',
      'value': '511424' },

    {
      'label': '青神县',
      'value': '511425' }] },


  {
    'label': '宜宾市',
    'value': '511500',
    'children': [{
      'label': '市辖区',
      'value': '511501' },

    {
      'label': '翠屏区',
      'value': '511502' },

    {
      'label': '南溪区',
      'value': '511503' },

    {
      'label': '宜宾县',
      'value': '511521' },

    {
      'label': '江安县',
      'value': '511523' },

    {
      'label': '长宁县',
      'value': '511524' },

    {
      'label': '高县',
      'value': '511525' },

    {
      'label': '珙县',
      'value': '511526' },

    {
      'label': '筠连县',
      'value': '511527' },

    {
      'label': '兴文县',
      'value': '511528' },

    {
      'label': '屏山县',
      'value': '511529' }] },


  {
    'label': '广安市',
    'value': '511600',
    'children': [{
      'label': '市辖区',
      'value': '511601' },

    {
      'label': '广安区',
      'value': '511602' },

    {
      'label': '前锋区',
      'value': '511603' },

    {
      'label': '岳池县',
      'value': '511621' },

    {
      'label': '武胜县',
      'value': '511622' },

    {
      'label': '邻水县',
      'value': '511623' },

    {
      'label': '华蓥市',
      'value': '511681' }] },


  {
    'label': '达州市',
    'value': '511700',
    'children': [{
      'label': '市辖区',
      'value': '511701' },

    {
      'label': '通川区',
      'value': '511702' },

    {
      'label': '达川区',
      'value': '511703' },

    {
      'label': '宣汉县',
      'value': '511722' },

    {
      'label': '开江县',
      'value': '511723' },

    {
      'label': '大竹县',
      'value': '511724' },

    {
      'label': '渠县',
      'value': '511725' },

    {
      'label': '万源市',
      'value': '511781' }] },


  {
    'label': '雅安市',
    'value': '511800',
    'children': [{
      'label': '市辖区',
      'value': '511801' },

    {
      'label': '雨城区',
      'value': '511802' },

    {
      'label': '名山区',
      'value': '511803' },

    {
      'label': '荥经县',
      'value': '511822' },

    {
      'label': '汉源县',
      'value': '511823' },

    {
      'label': '石棉县',
      'value': '511824' },

    {
      'label': '天全县',
      'value': '511825' },

    {
      'label': '芦山县',
      'value': '511826' },

    {
      'label': '宝兴县',
      'value': '511827' }] },


  {
    'label': '巴中市',
    'value': '511900',
    'children': [{
      'label': '市辖区',
      'value': '511901' },

    {
      'label': '巴州区',
      'value': '511902' },

    {
      'label': '恩阳区',
      'value': '511903' },

    {
      'label': '通江县',
      'value': '511921' },

    {
      'label': '南江县',
      'value': '511922' },

    {
      'label': '平昌县',
      'value': '511923' }] },


  {
    'label': '资阳市',
    'value': '512000',
    'children': [{
      'label': '市辖区',
      'value': '512001' },

    {
      'label': '雁江区',
      'value': '512002' },

    {
      'label': '安岳县',
      'value': '512021' },

    {
      'label': '乐至县',
      'value': '512022' },

    {
      'label': '简阳市',
      'value': '512081' }] },


  {
    'label': '阿坝藏族羌族自治州',
    'value': '513200',
    'children': [{
      'label': '汶川县',
      'value': '513221' },

    {
      'label': '理县',
      'value': '513222' },

    {
      'label': '茂县',
      'value': '513223' },

    {
      'label': '松潘县',
      'value': '513224' },

    {
      'label': '九寨沟县',
      'value': '513225' },

    {
      'label': '金川县',
      'value': '513226' },

    {
      'label': '小金县',
      'value': '513227' },

    {
      'label': '黑水县',
      'value': '513228' },

    {
      'label': '马尔康县',
      'value': '513229' },

    {
      'label': '壤塘县',
      'value': '513230' },

    {
      'label': '阿坝县',
      'value': '513231' },

    {
      'label': '若尔盖县',
      'value': '513232' },

    {
      'label': '红原县',
      'value': '513233' }] },


  {
    'label': '甘孜藏族自治州',
    'value': '513300',
    'children': [{
      'label': '康定县',
      'value': '513321' },

    {
      'label': '泸定县',
      'value': '513322' },

    {
      'label': '丹巴县',
      'value': '513323' },

    {
      'label': '九龙县',
      'value': '513324' },

    {
      'label': '雅江县',
      'value': '513325' },

    {
      'label': '道孚县',
      'value': '513326' },

    {
      'label': '炉霍县',
      'value': '513327' },

    {
      'label': '甘孜县',
      'value': '513328' },

    {
      'label': '新龙县',
      'value': '513329' },

    {
      'label': '德格县',
      'value': '513330' },

    {
      'label': '白玉县',
      'value': '513331' },

    {
      'label': '石渠县',
      'value': '513332' },

    {
      'label': '色达县',
      'value': '513333' },

    {
      'label': '理塘县',
      'value': '513334' },

    {
      'label': '巴塘县',
      'value': '513335' },

    {
      'label': '乡城县',
      'value': '513336' },

    {
      'label': '稻城县',
      'value': '513337' },

    {
      'label': '得荣县',
      'value': '513338' }] },


  {
    'label': '凉山彝族自治州',
    'value': '513400',
    'children': [{
      'label': '西昌市',
      'value': '513401' },

    {
      'label': '木里藏族自治县',
      'value': '513422' },

    {
      'label': '盐源县',
      'value': '513423' },

    {
      'label': '德昌县',
      'value': '513424' },

    {
      'label': '会理县',
      'value': '513425' },

    {
      'label': '会东县',
      'value': '513426' },

    {
      'label': '宁南县',
      'value': '513427' },

    {
      'label': '普格县',
      'value': '513428' },

    {
      'label': '布拖县',
      'value': '513429' },

    {
      'label': '金阳县',
      'value': '513430' },

    {
      'label': '昭觉县',
      'value': '513431' },

    {
      'label': '喜德县',
      'value': '513432' },

    {
      'label': '冕宁县',
      'value': '513433' },

    {
      'label': '越西县',
      'value': '513434' },

    {
      'label': '甘洛县',
      'value': '513435' },

    {
      'label': '美姑县',
      'value': '513436' },

    {
      'label': '雷波县',
      'value': '513437' }] }] },



{
  'label': '贵州省',
  'value': '520000',
  'children': [{
    'label': '贵阳市',
    'value': '520100',
    'children': [{
      'label': '市辖区',
      'value': '520101' },

    {
      'label': '南明区',
      'value': '520102' },

    {
      'label': '云岩区',
      'value': '520103' },

    {
      'label': '花溪区',
      'value': '520111' },

    {
      'label': '乌当区',
      'value': '520112' },

    {
      'label': '白云区',
      'value': '520113' },

    {
      'label': '观山湖区',
      'value': '520115' },

    {
      'label': '开阳县',
      'value': '520121' },

    {
      'label': '息烽县',
      'value': '520122' },

    {
      'label': '修文县',
      'value': '520123' },

    {
      'label': '清镇市',
      'value': '520181' }] },


  {
    'label': '六盘水市',
    'value': '520200',
    'children': [{
      'label': '钟山区',
      'value': '520201' },

    {
      'label': '六枝特区',
      'value': '520203' },

    {
      'label': '水城县',
      'value': '520221' },

    {
      'label': '盘县',
      'value': '520222' }] },


  {
    'label': '遵义市',
    'value': '520300',
    'children': [{
      'label': '市辖区',
      'value': '520301' },

    {
      'label': '红花岗区',
      'value': '520302' },

    {
      'label': '汇川区',
      'value': '520303' },

    {
      'label': '遵义县',
      'value': '520321' },

    {
      'label': '桐梓县',
      'value': '520322' },

    {
      'label': '绥阳县',
      'value': '520323' },

    {
      'label': '正安县',
      'value': '520324' },

    {
      'label': '道真仡佬族苗族自治县',
      'value': '520325' },

    {
      'label': '务川仡佬族苗族自治县',
      'value': '520326' },

    {
      'label': '凤冈县',
      'value': '520327' },

    {
      'label': '湄潭县',
      'value': '520328' },

    {
      'label': '余庆县',
      'value': '520329' },

    {
      'label': '习水县',
      'value': '520330' },

    {
      'label': '赤水市',
      'value': '520381' },

    {
      'label': '仁怀市',
      'value': '520382' }] },


  {
    'label': '安顺市',
    'value': '520400',
    'children': [{
      'label': '市辖区',
      'value': '520401' },

    {
      'label': '西秀区',
      'value': '520402' },

    {
      'label': '平坝区',
      'value': '520403' },

    {
      'label': '普定县',
      'value': '520422' },

    {
      'label': '镇宁布依族苗族自治县',
      'value': '520423' },

    {
      'label': '关岭布依族苗族自治县',
      'value': '520424' },

    {
      'label': '紫云苗族布依族自治县',
      'value': '520425' }] },


  {
    'label': '毕节市',
    'value': '520500',
    'children': [{
      'label': '市辖区',
      'value': '520501' },

    {
      'label': '七星关区',
      'value': '520502' },

    {
      'label': '大方县',
      'value': '520521' },

    {
      'label': '黔西县',
      'value': '520522' },

    {
      'label': '金沙县',
      'value': '520523' },

    {
      'label': '织金县',
      'value': '520524' },

    {
      'label': '纳雍县',
      'value': '520525' },

    {
      'label': '威宁彝族回族苗族自治县',
      'value': '520526' },

    {
      'label': '赫章县',
      'value': '520527' }] },


  {
    'label': '铜仁市',
    'value': '520600',
    'children': [{
      'label': '市辖区',
      'value': '520601' },

    {
      'label': '碧江区',
      'value': '520602' },

    {
      'label': '万山区',
      'value': '520603' },

    {
      'label': '江口县',
      'value': '520621' },

    {
      'label': '玉屏侗族自治县',
      'value': '520622' },

    {
      'label': '石阡县',
      'value': '520623' },

    {
      'label': '思南县',
      'value': '520624' },

    {
      'label': '印江土家族苗族自治县',
      'value': '520625' },

    {
      'label': '德江县',
      'value': '520626' },

    {
      'label': '沿河土家族自治县',
      'value': '520627' },

    {
      'label': '松桃苗族自治县',
      'value': '520628' }] },


  {
    'label': '黔西南布依族苗族自治州',
    'value': '522300',
    'children': [{
      'label': '兴义市',
      'value': '522301' },

    {
      'label': '兴仁县',
      'value': '522322' },

    {
      'label': '普安县',
      'value': '522323' },

    {
      'label': '晴隆县',
      'value': '522324' },

    {
      'label': '贞丰县',
      'value': '522325' },

    {
      'label': '望谟县',
      'value': '522326' },

    {
      'label': '册亨县',
      'value': '522327' },

    {
      'label': '安龙县',
      'value': '522328' }] },


  {
    'label': '黔东南苗族侗族自治州',
    'value': '522600',
    'children': [{
      'label': '凯里市',
      'value': '522601' },

    {
      'label': '黄平县',
      'value': '522622' },

    {
      'label': '施秉县',
      'value': '522623' },

    {
      'label': '三穗县',
      'value': '522624' },

    {
      'label': '镇远县',
      'value': '522625' },

    {
      'label': '岑巩县',
      'value': '522626' },

    {
      'label': '天柱县',
      'value': '522627' },

    {
      'label': '锦屏县',
      'value': '522628' },

    {
      'label': '剑河县',
      'value': '522629' },

    {
      'label': '台江县',
      'value': '522630' },

    {
      'label': '黎平县',
      'value': '522631' },

    {
      'label': '榕江县',
      'value': '522632' },

    {
      'label': '从江县',
      'value': '522633' },

    {
      'label': '雷山县',
      'value': '522634' },

    {
      'label': '麻江县',
      'value': '522635' },

    {
      'label': '丹寨县',
      'value': '522636' }] },


  {
    'label': '黔南布依族苗族自治州',
    'value': '522700',
    'children': [{
      'label': '都匀市',
      'value': '522701' },

    {
      'label': '福泉市',
      'value': '522702' },

    {
      'label': '荔波县',
      'value': '522722' },

    {
      'label': '贵定县',
      'value': '522723' },

    {
      'label': '瓮安县',
      'value': '522725' },

    {
      'label': '独山县',
      'value': '522726' },

    {
      'label': '平塘县',
      'value': '522727' },

    {
      'label': '罗甸县',
      'value': '522728' },

    {
      'label': '长顺县',
      'value': '522729' },

    {
      'label': '龙里县',
      'value': '522730' },

    {
      'label': '惠水县',
      'value': '522731' },

    {
      'label': '三都水族自治县',
      'value': '522732' }] }] },



{
  'label': '云南省',
  'value': '530000',
  'children': [{
    'label': '昆明市',
    'value': '530100',
    'children': [{
      'label': '市辖区',
      'value': '530101' },

    {
      'label': '五华区',
      'value': '530102' },

    {
      'label': '盘龙区',
      'value': '530103' },

    {
      'label': '官渡区',
      'value': '530111' },

    {
      'label': '西山区',
      'value': '530112' },

    {
      'label': '东川区',
      'value': '530113' },

    {
      'label': '呈贡区',
      'value': '530114' },

    {
      'label': '晋宁县',
      'value': '530122' },

    {
      'label': '富民县',
      'value': '530124' },

    {
      'label': '宜良县',
      'value': '530125' },

    {
      'label': '石林彝族自治县',
      'value': '530126' },

    {
      'label': '嵩明县',
      'value': '530127' },

    {
      'label': '禄劝彝族苗族自治县',
      'value': '530128' },

    {
      'label': '寻甸回族彝族自治县',
      'value': '530129' },

    {
      'label': '安宁市',
      'value': '530181' }] },


  {
    'label': '曲靖市',
    'value': '530300',
    'children': [{
      'label': '市辖区',
      'value': '530301' },

    {
      'label': '麒麟区',
      'value': '530302' },

    {
      'label': '马龙县',
      'value': '530321' },

    {
      'label': '陆良县',
      'value': '530322' },

    {
      'label': '师宗县',
      'value': '530323' },

    {
      'label': '罗平县',
      'value': '530324' },

    {
      'label': '富源县',
      'value': '530325' },

    {
      'label': '会泽县',
      'value': '530326' },

    {
      'label': '沾益县',
      'value': '530328' },

    {
      'label': '宣威市',
      'value': '530381' }] },


  {
    'label': '玉溪市',
    'value': '530400',
    'children': [{
      'label': '市辖区',
      'value': '530401' },

    {
      'label': '红塔区',
      'value': '530402' },

    {
      'label': '江川县',
      'value': '530421' },

    {
      'label': '澄江县',
      'value': '530422' },

    {
      'label': '通海县',
      'value': '530423' },

    {
      'label': '华宁县',
      'value': '530424' },

    {
      'label': '易门县',
      'value': '530425' },

    {
      'label': '峨山彝族自治县',
      'value': '530426' },

    {
      'label': '新平彝族傣族自治县',
      'value': '530427' },

    {
      'label': '元江哈尼族彝族傣族自治县',
      'value': '530428' }] },


  {
    'label': '保山市',
    'value': '530500',
    'children': [{
      'label': '市辖区',
      'value': '530501' },

    {
      'label': '隆阳区',
      'value': '530502' },

    {
      'label': '施甸县',
      'value': '530521' },

    {
      'label': '腾冲县',
      'value': '530522' },

    {
      'label': '龙陵县',
      'value': '530523' },

    {
      'label': '昌宁县',
      'value': '530524' }] },


  {
    'label': '昭通市',
    'value': '530600',
    'children': [{
      'label': '市辖区',
      'value': '530601' },

    {
      'label': '昭阳区',
      'value': '530602' },

    {
      'label': '鲁甸县',
      'value': '530621' },

    {
      'label': '巧家县',
      'value': '530622' },

    {
      'label': '盐津县',
      'value': '530623' },

    {
      'label': '大关县',
      'value': '530624' },

    {
      'label': '永善县',
      'value': '530625' },

    {
      'label': '绥江县',
      'value': '530626' },

    {
      'label': '镇雄县',
      'value': '530627' },

    {
      'label': '彝良县',
      'value': '530628' },

    {
      'label': '威信县',
      'value': '530629' },

    {
      'label': '水富县',
      'value': '530630' }] },


  {
    'label': '丽江市',
    'value': '530700',
    'children': [{
      'label': '市辖区',
      'value': '530701' },

    {
      'label': '古城区',
      'value': '530702' },

    {
      'label': '玉龙纳西族自治县',
      'value': '530721' },

    {
      'label': '永胜县',
      'value': '530722' },

    {
      'label': '华坪县',
      'value': '530723' },

    {
      'label': '宁蒗彝族自治县',
      'value': '530724' }] },


  {
    'label': '普洱市',
    'value': '530800',
    'children': [{
      'label': '市辖区',
      'value': '530801' },

    {
      'label': '思茅区',
      'value': '530802' },

    {
      'label': '宁洱哈尼族彝族自治县',
      'value': '530821' },

    {
      'label': '墨江哈尼族自治县',
      'value': '530822' },

    {
      'label': '景东彝族自治县',
      'value': '530823' },

    {
      'label': '景谷傣族彝族自治县',
      'value': '530824' },

    {
      'label': '镇沅彝族哈尼族拉祜族自治县',
      'value': '530825' },

    {
      'label': '江城哈尼族彝族自治县',
      'value': '530826' },

    {
      'label': '孟连傣族拉祜族佤族自治县',
      'value': '530827' },

    {
      'label': '澜沧拉祜族自治县',
      'value': '530828' },

    {
      'label': '西盟佤族自治县',
      'value': '530829' }] },


  {
    'label': '临沧市',
    'value': '530900',
    'children': [{
      'label': '市辖区',
      'value': '530901' },

    {
      'label': '临翔区',
      'value': '530902' },

    {
      'label': '凤庆县',
      'value': '530921' },

    {
      'label': '云县',
      'value': '530922' },

    {
      'label': '永德县',
      'value': '530923' },

    {
      'label': '镇康县',
      'value': '530924' },

    {
      'label': '双江拉祜族佤族布朗族傣族自治县',
      'value': '530925' },

    {
      'label': '耿马傣族佤族自治县',
      'value': '530926' },

    {
      'label': '沧源佤族自治县',
      'value': '530927' }] },


  {
    'label': '楚雄彝族自治州',
    'value': '532300',
    'children': [{
      'label': '楚雄市',
      'value': '532301' },

    {
      'label': '双柏县',
      'value': '532322' },

    {
      'label': '牟定县',
      'value': '532323' },

    {
      'label': '南华县',
      'value': '532324' },

    {
      'label': '姚安县',
      'value': '532325' },

    {
      'label': '大姚县',
      'value': '532326' },

    {
      'label': '永仁县',
      'value': '532327' },

    {
      'label': '元谋县',
      'value': '532328' },

    {
      'label': '武定县',
      'value': '532329' },

    {
      'label': '禄丰县',
      'value': '532331' }] },


  {
    'label': '红河哈尼族彝族自治州',
    'value': '532500',
    'children': [{
      'label': '个旧市',
      'value': '532501' },

    {
      'label': '开远市',
      'value': '532502' },

    {
      'label': '蒙自市',
      'value': '532503' },

    {
      'label': '弥勒市',
      'value': '532504' },

    {
      'label': '屏边苗族自治县',
      'value': '532523' },

    {
      'label': '建水县',
      'value': '532524' },

    {
      'label': '石屏县',
      'value': '532525' },

    {
      'label': '泸西县',
      'value': '532527' },

    {
      'label': '元阳县',
      'value': '532528' },

    {
      'label': '红河县',
      'value': '532529' },

    {
      'label': '金平苗族瑶族傣族自治县',
      'value': '532530' },

    {
      'label': '绿春县',
      'value': '532531' },

    {
      'label': '河口瑶族自治县',
      'value': '532532' }] },


  {
    'label': '文山壮族苗族自治州',
    'value': '532600',
    'children': [{
      'label': '文山市',
      'value': '532601' },

    {
      'label': '砚山县',
      'value': '532622' },

    {
      'label': '西畴县',
      'value': '532623' },

    {
      'label': '麻栗坡县',
      'value': '532624' },

    {
      'label': '马关县',
      'value': '532625' },

    {
      'label': '丘北县',
      'value': '532626' },

    {
      'label': '广南县',
      'value': '532627' },

    {
      'label': '富宁县',
      'value': '532628' }] },


  {
    'label': '西双版纳傣族自治州',
    'value': '532800',
    'children': [{
      'label': '景洪市',
      'value': '532801' },

    {
      'label': '勐海县',
      'value': '532822' },

    {
      'label': '勐腊县',
      'value': '532823' }] },


  {
    'label': '大理白族自治州',
    'value': '532900',
    'children': [{
      'label': '大理市',
      'value': '532901' },

    {
      'label': '漾濞彝族自治县',
      'value': '532922' },

    {
      'label': '祥云县',
      'value': '532923' },

    {
      'label': '宾川县',
      'value': '532924' },

    {
      'label': '弥渡县',
      'value': '532925' },

    {
      'label': '南涧彝族自治县',
      'value': '532926' },

    {
      'label': '巍山彝族回族自治县',
      'value': '532927' },

    {
      'label': '永平县',
      'value': '532928' },

    {
      'label': '云龙县',
      'value': '532929' },

    {
      'label': '洱源县',
      'value': '532930' },

    {
      'label': '剑川县',
      'value': '532931' },

    {
      'label': '鹤庆县',
      'value': '532932' }] },


  {
    'label': '德宏傣族景颇族自治州',
    'value': '533100',
    'children': [{
      'label': '瑞丽市',
      'value': '533102' },

    {
      'label': '芒市',
      'value': '533103' },

    {
      'label': '梁河县',
      'value': '533122' },

    {
      'label': '盈江县',
      'value': '533123' },

    {
      'label': '陇川县',
      'value': '533124' }] },


  {
    'label': '怒江傈僳族自治州',
    'value': '533300',
    'children': [{
      'label': '泸水县',
      'value': '533321' },

    {
      'label': '福贡县',
      'value': '533323' },

    {
      'label': '贡山独龙族怒族自治县',
      'value': '533324' },

    {
      'label': '兰坪白族普米族自治县',
      'value': '533325' }] },


  {
    'label': '迪庆藏族自治州',
    'value': '533400',
    'children': [{
      'label': '香格里拉市',
      'value': '533401' },

    {
      'label': '德钦县',
      'value': '533422' },

    {
      'label': '维西傈僳族自治县',
      'value': '533423' }] }] },



{
  'label': '西藏自治区',
  'value': '540000',
  'children': [{
    'label': '拉萨市',
    'value': '540100',
    'children': [{
      'label': '市辖区',
      'value': '540101' },

    {
      'label': '城关区',
      'value': '540102' },

    {
      'label': '林周县',
      'value': '540121' },

    {
      'label': '当雄县',
      'value': '540122' },

    {
      'label': '尼木县',
      'value': '540123' },

    {
      'label': '曲水县',
      'value': '540124' },

    {
      'label': '堆龙德庆县',
      'value': '540125' },

    {
      'label': '达孜县',
      'value': '540126' },

    {
      'label': '墨竹工卡县',
      'value': '540127' }] },


  {
    'label': '日喀则市',
    'value': '540200',
    'children': [{
      'label': '市辖区',
      'value': '540201' },

    {
      'label': '桑珠孜区',
      'value': '540202' },

    {
      'label': '南木林县',
      'value': '540221' },

    {
      'label': '江孜县',
      'value': '540222' },

    {
      'label': '定日县',
      'value': '540223' },

    {
      'label': '萨迦县',
      'value': '540224' },

    {
      'label': '拉孜县',
      'value': '540225' },

    {
      'label': '昂仁县',
      'value': '540226' },

    {
      'label': '谢通门县',
      'value': '540227' },

    {
      'label': '白朗县',
      'value': '540228' },

    {
      'label': '仁布县',
      'value': '540229' },

    {
      'label': '康马县',
      'value': '540230' },

    {
      'label': '定结县',
      'value': '540231' },

    {
      'label': '仲巴县',
      'value': '540232' },

    {
      'label': '亚东县',
      'value': '540233' },

    {
      'label': '吉隆县',
      'value': '540234' },

    {
      'label': '聂拉木县',
      'value': '540235' },

    {
      'label': '萨嘎县',
      'value': '540236' },

    {
      'label': '岗巴县',
      'value': '540237' }] },


  {
    'label': '昌都市',
    'value': '540300',
    'children': [{
      'label': '市辖区',
      'value': '540301' },

    {
      'label': '卡若区',
      'value': '540302' },

    {
      'label': '江达县',
      'value': '540321' },

    {
      'label': '贡觉县',
      'value': '540322' },

    {
      'label': '类乌齐县',
      'value': '540323' },

    {
      'label': '丁青县',
      'value': '540324' },

    {
      'label': '察雅县',
      'value': '540325' },

    {
      'label': '八宿县',
      'value': '540326' },

    {
      'label': '左贡县',
      'value': '540327' },

    {
      'label': '芒康县',
      'value': '540328' },

    {
      'label': '洛隆县',
      'value': '540329' },

    {
      'label': '边坝县',
      'value': '540330' }] },


  {
    'label': '山南地区',
    'value': '542200',
    'children': [{
      'label': '乃东县',
      'value': '542221' },

    {
      'label': '扎囊县',
      'value': '542222' },

    {
      'label': '贡嘎县',
      'value': '542223' },

    {
      'label': '桑日县',
      'value': '542224' },

    {
      'label': '琼结县',
      'value': '542225' },

    {
      'label': '曲松县',
      'value': '542226' },

    {
      'label': '措美县',
      'value': '542227' },

    {
      'label': '洛扎县',
      'value': '542228' },

    {
      'label': '加查县',
      'value': '542229' },

    {
      'label': '隆子县',
      'value': '542231' },

    {
      'label': '错那县',
      'value': '542232' },

    {
      'label': '浪卡子县',
      'value': '542233' }] },


  {
    'label': '那曲地区',
    'value': '542400',
    'children': [{
      'label': '那曲县',
      'value': '542421' },

    {
      'label': '嘉黎县',
      'value': '542422' },

    {
      'label': '比如县',
      'value': '542423' },

    {
      'label': '聂荣县',
      'value': '542424' },

    {
      'label': '安多县',
      'value': '542425' },

    {
      'label': '申扎县',
      'value': '542426' },

    {
      'label': '索县',
      'value': '542427' },

    {
      'label': '班戈县',
      'value': '542428' },

    {
      'label': '巴青县',
      'value': '542429' },

    {
      'label': '尼玛县',
      'value': '542430' },

    {
      'label': '双湖县',
      'value': '542431' }] },


  {
    'label': '阿里地区',
    'value': '542500',
    'children': [{
      'label': '普兰县',
      'value': '542521' },

    {
      'label': '札达县',
      'value': '542522' },

    {
      'label': '噶尔县',
      'value': '542523' },

    {
      'label': '日土县',
      'value': '542524' },

    {
      'label': '革吉县',
      'value': '542525' },

    {
      'label': '改则县',
      'value': '542526' },

    {
      'label': '措勤县',
      'value': '542527' }] },


  {
    'label': '林芝地区',
    'value': '542600',
    'children': [{
      'label': '林芝县',
      'value': '542621' },

    {
      'label': '工布江达县',
      'value': '542622' },

    {
      'label': '米林县',
      'value': '542623' },

    {
      'label': '墨脱县',
      'value': '542624' },

    {
      'label': '波密县',
      'value': '542625' },

    {
      'label': '察隅县',
      'value': '542626' },

    {
      'label': '朗县',
      'value': '542627' }] }] },



{
  'label': '陕西省',
  'value': '610000',
  'children': [{
    'label': '西安市',
    'value': '610100',
    'children': [{
      'label': '市辖区',
      'value': '610101' },

    {
      'label': '新城区',
      'value': '610102' },

    {
      'label': '碑林区',
      'value': '610103' },

    {
      'label': '莲湖区',
      'value': '610104' },

    {
      'label': '灞桥区',
      'value': '610111' },

    {
      'label': '未央区',
      'value': '610112' },

    {
      'label': '雁塔区',
      'value': '610113' },

    {
      'label': '阎良区',
      'value': '610114' },

    {
      'label': '临潼区',
      'value': '610115' },

    {
      'label': '长安区',
      'value': '610116' },

    {
      'label': '高陵区',
      'value': '610117' },

    {
      'label': '蓝田县',
      'value': '610122' },

    {
      'label': '周至县',
      'value': '610124' },

    {
      'label': '户县',
      'value': '610125' }] },


  {
    'label': '铜川市',
    'value': '610200',
    'children': [{
      'label': '市辖区',
      'value': '610201' },

    {
      'label': '王益区',
      'value': '610202' },

    {
      'label': '印台区',
      'value': '610203' },

    {
      'label': '耀州区',
      'value': '610204' },

    {
      'label': '宜君县',
      'value': '610222' }] },


  {
    'label': '宝鸡市',
    'value': '610300',
    'children': [{
      'label': '市辖区',
      'value': '610301' },

    {
      'label': '渭滨区',
      'value': '610302' },

    {
      'label': '金台区',
      'value': '610303' },

    {
      'label': '陈仓区',
      'value': '610304' },

    {
      'label': '凤翔县',
      'value': '610322' },

    {
      'label': '岐山县',
      'value': '610323' },

    {
      'label': '扶风县',
      'value': '610324' },

    {
      'label': '眉县',
      'value': '610326' },

    {
      'label': '陇县',
      'value': '610327' },

    {
      'label': '千阳县',
      'value': '610328' },

    {
      'label': '麟游县',
      'value': '610329' },

    {
      'label': '凤县',
      'value': '610330' },

    {
      'label': '太白县',
      'value': '610331' }] },


  {
    'label': '咸阳市',
    'value': '610400',
    'children': [{
      'label': '市辖区',
      'value': '610401' },

    {
      'label': '秦都区',
      'value': '610402' },

    {
      'label': '杨陵区',
      'value': '610403' },

    {
      'label': '渭城区',
      'value': '610404' },

    {
      'label': '三原县',
      'value': '610422' },

    {
      'label': '泾阳县',
      'value': '610423' },

    {
      'label': '乾县',
      'value': '610424' },

    {
      'label': '礼泉县',
      'value': '610425' },

    {
      'label': '永寿县',
      'value': '610426' },

    {
      'label': '彬县',
      'value': '610427' },

    {
      'label': '长武县',
      'value': '610428' },

    {
      'label': '旬邑县',
      'value': '610429' },

    {
      'label': '淳化县',
      'value': '610430' },

    {
      'label': '武功县',
      'value': '610431' },

    {
      'label': '兴平市',
      'value': '610481' }] },


  {
    'label': '渭南市',
    'value': '610500',
    'children': [{
      'label': '市辖区',
      'value': '610501' },

    {
      'label': '临渭区',
      'value': '610502' },

    {
      'label': '华县',
      'value': '610521' },

    {
      'label': '潼关县',
      'value': '610522' },

    {
      'label': '大荔县',
      'value': '610523' },

    {
      'label': '合阳县',
      'value': '610524' },

    {
      'label': '澄城县',
      'value': '610525' },

    {
      'label': '蒲城县',
      'value': '610526' },

    {
      'label': '白水县',
      'value': '610527' },

    {
      'label': '富平县',
      'value': '610528' },

    {
      'label': '韩城市',
      'value': '610581' },

    {
      'label': '华阴市',
      'value': '610582' }] },


  {
    'label': '延安市',
    'value': '610600',
    'children': [{
      'label': '市辖区',
      'value': '610601' },

    {
      'label': '宝塔区',
      'value': '610602' },

    {
      'label': '延长县',
      'value': '610621' },

    {
      'label': '延川县',
      'value': '610622' },

    {
      'label': '子长县',
      'value': '610623' },

    {
      'label': '安塞县',
      'value': '610624' },

    {
      'label': '志丹县',
      'value': '610625' },

    {
      'label': '吴起县',
      'value': '610626' },

    {
      'label': '甘泉县',
      'value': '610627' },

    {
      'label': '富县',
      'value': '610628' },

    {
      'label': '洛川县',
      'value': '610629' },

    {
      'label': '宜川县',
      'value': '610630' },

    {
      'label': '黄龙县',
      'value': '610631' },

    {
      'label': '黄陵县',
      'value': '610632' }] },


  {
    'label': '汉中市',
    'value': '610700',
    'children': [{
      'label': '市辖区',
      'value': '610701' },

    {
      'label': '汉台区',
      'value': '610702' },

    {
      'label': '南郑县',
      'value': '610721' },

    {
      'label': '城固县',
      'value': '610722' },

    {
      'label': '洋县',
      'value': '610723' },

    {
      'label': '西乡县',
      'value': '610724' },

    {
      'label': '勉县',
      'value': '610725' },

    {
      'label': '宁强县',
      'value': '610726' },

    {
      'label': '略阳县',
      'value': '610727' },

    {
      'label': '镇巴县',
      'value': '610728' },

    {
      'label': '留坝县',
      'value': '610729' },

    {
      'label': '佛坪县',
      'value': '610730' }] },


  {
    'label': '榆林市',
    'value': '610800',
    'children': [{
      'label': '市辖区',
      'value': '610801' },

    {
      'label': '榆阳区',
      'value': '610802' },

    {
      'label': '神木县',
      'value': '610821' },

    {
      'label': '府谷县',
      'value': '610822' },

    {
      'label': '横山县',
      'value': '610823' },

    {
      'label': '靖边县',
      'value': '610824' },

    {
      'label': '定边县',
      'value': '610825' },

    {
      'label': '绥德县',
      'value': '610826' },

    {
      'label': '米脂县',
      'value': '610827' },

    {
      'label': '佳县',
      'value': '610828' },

    {
      'label': '吴堡县',
      'value': '610829' },

    {
      'label': '清涧县',
      'value': '610830' },

    {
      'label': '子洲县',
      'value': '610831' }] },


  {
    'label': '安康市',
    'value': '610900',
    'children': [{
      'label': '市辖区',
      'value': '610901' },

    {
      'label': '汉阴县',
      'value': '610921' },

    {
      'label': '石泉县',
      'value': '610922' },

    {
      'label': '宁陕县',
      'value': '610923' },

    {
      'label': '紫阳县',
      'value': '610924' },

    {
      'label': '岚皋县',
      'value': '610925' },

    {
      'label': '平利县',
      'value': '610926' },

    {
      'label': '镇坪县',
      'value': '610927' },

    {
      'label': '旬阳县',
      'value': '610928' },

    {
      'label': '白河县',
      'value': '610929' }] },


  {
    'label': '商洛市',
    'value': '611000',
    'children': [{
      'label': '市辖区',
      'value': '611001' },

    {
      'label': '商州区',
      'value': '611002' },

    {
      'label': '洛南县',
      'value': '611021' },

    {
      'label': '丹凤县',
      'value': '611022' },

    {
      'label': '商南县',
      'value': '611023' },

    {
      'label': '山阳县',
      'value': '611024' },

    {
      'label': '镇安县',
      'value': '611025' },

    {
      'label': '柞水县',
      'value': '611026' }] }] },



{
  'label': '甘肃省',
  'value': '620000',
  'children': [{
    'label': '兰州市',
    'value': '620100',
    'children': [{
      'label': '市辖区',
      'value': '620101' },

    {
      'label': '城关区',
      'value': '620102' },

    {
      'label': '七里河区',
      'value': '620103' },

    {
      'label': '西固区',
      'value': '620104' },

    {
      'label': '安宁区',
      'value': '620105' },

    {
      'label': '红古区',
      'value': '620111' },

    {
      'label': '永登县',
      'value': '620121' },

    {
      'label': '皋兰县',
      'value': '620122' },

    {
      'label': '榆中县',
      'value': '620123' }] },


  {
    'label': '嘉峪关市',
    'value': '620200',
    'children': [{
      'label': '市辖区',
      'value': '620201' }] },


  {
    'label': '金昌市',
    'value': '620300',
    'children': [{
      'label': '市辖区',
      'value': '620301' },

    {
      'label': '金川区',
      'value': '620302' },

    {
      'label': '永昌县',
      'value': '620321' }] },


  {
    'label': '白银市',
    'value': '620400',
    'children': [{
      'label': '市辖区',
      'value': '620401' },

    {
      'label': '白银区',
      'value': '620402' },

    {
      'label': '平川区',
      'value': '620403' },

    {
      'label': '靖远县',
      'value': '620421' },

    {
      'label': '会宁县',
      'value': '620422' },

    {
      'label': '景泰县',
      'value': '620423' }] },


  {
    'label': '天水市',
    'value': '620500',
    'children': [{
      'label': '市辖区',
      'value': '620501' },

    {
      'label': '秦州区',
      'value': '620502' },

    {
      'label': '麦积区',
      'value': '620503' },

    {
      'label': '清水县',
      'value': '620521' },

    {
      'label': '秦安县',
      'value': '620522' },

    {
      'label': '甘谷县',
      'value': '620523' },

    {
      'label': '武山县',
      'value': '620524' },

    {
      'label': '张家川回族自治县',
      'value': '620525' }] },


  {
    'label': '武威市',
    'value': '620600',
    'children': [{
      'label': '市辖区',
      'value': '620601' },

    {
      'label': '凉州区',
      'value': '620602' },

    {
      'label': '民勤县',
      'value': '620621' },

    {
      'label': '古浪县',
      'value': '620622' },

    {
      'label': '天祝藏族自治县',
      'value': '620623' }] },


  {
    'label': '张掖市',
    'value': '620700',
    'children': [{
      'label': '市辖区',
      'value': '620701' },

    {
      'label': '甘州区',
      'value': '620702' },

    {
      'label': '肃南裕固族自治县',
      'value': '620721' },

    {
      'label': '民乐县',
      'value': '620722' },

    {
      'label': '临泽县',
      'value': '620723' },

    {
      'label': '高台县',
      'value': '620724' },

    {
      'label': '山丹县',
      'value': '620725' }] },


  {
    'label': '平凉市',
    'value': '620800',
    'children': [{
      'label': '市辖区',
      'value': '620801' },

    {
      'label': '崆峒区',
      'value': '620802' },

    {
      'label': '泾川县',
      'value': '620821' },

    {
      'label': '灵台县',
      'value': '620822' },

    {
      'label': '崇信县',
      'value': '620823' },

    {
      'label': '华亭县',
      'value': '620824' },

    {
      'label': '庄浪县',
      'value': '620825' },

    {
      'label': '静宁县',
      'value': '620826' }] },


  {
    'label': '酒泉市',
    'value': '620900',
    'children': [{
      'label': '市辖区',
      'value': '620901' },

    {
      'label': '肃州区',
      'value': '620902' },

    {
      'label': '金塔县',
      'value': '620921' },

    {
      'label': '瓜州县',
      'value': '620922' },

    {
      'label': '肃北蒙古族自治县',
      'value': '620923' },

    {
      'label': '阿克塞哈萨克族自治县',
      'value': '620924' },

    {
      'label': '玉门市',
      'value': '620981' },

    {
      'label': '敦煌市',
      'value': '620982' }] },


  {
    'label': '庆阳市',
    'value': '621000',
    'children': [{
      'label': '市辖区',
      'value': '621001' },

    {
      'label': '西峰区',
      'value': '621002' },

    {
      'label': '庆城县',
      'value': '621021' },

    {
      'label': '环县',
      'value': '621022' },

    {
      'label': '华池县',
      'value': '621023' },

    {
      'label': '合水县',
      'value': '621024' },

    {
      'label': '正宁县',
      'value': '621025' },

    {
      'label': '宁县',
      'value': '621026' },

    {
      'label': '镇原县',
      'value': '621027' }] },


  {
    'label': '定西市',
    'value': '621100',
    'children': [{
      'label': '市辖区',
      'value': '621101' },

    {
      'label': '安定区',
      'value': '621102' },

    {
      'label': '通渭县',
      'value': '621121' },

    {
      'label': '陇西县',
      'value': '621122' },

    {
      'label': '渭源县',
      'value': '621123' },

    {
      'label': '临洮县',
      'value': '621124' },

    {
      'label': '漳县',
      'value': '621125' },

    {
      'label': '岷县',
      'value': '621126' }] },


  {
    'label': '陇南市',
    'value': '621200',
    'children': [{
      'label': '市辖区',
      'value': '621201' },

    {
      'label': '武都区',
      'value': '621202' },

    {
      'label': '成县',
      'value': '621221' },

    {
      'label': '文县',
      'value': '621222' },

    {
      'label': '宕昌县',
      'value': '621223' },

    {
      'label': '康县',
      'value': '621224' },

    {
      'label': '西和县',
      'value': '621225' },

    {
      'label': '礼县',
      'value': '621226' },

    {
      'label': '徽县',
      'value': '621227' },

    {
      'label': '两当县',
      'value': '621228' }] },


  {
    'label': '临夏回族自治州',
    'value': '622900',
    'children': [{
      'label': '临夏市',
      'value': '622901' },

    {
      'label': '临夏县',
      'value': '622921' },

    {
      'label': '康乐县',
      'value': '622922' },

    {
      'label': '永靖县',
      'value': '622923' },

    {
      'label': '广河县',
      'value': '622924' },

    {
      'label': '和政县',
      'value': '622925' },

    {
      'label': '东乡族自治县',
      'value': '622926' },

    {
      'label': '积石山保安族东乡族撒拉族自治县',
      'value': '622927' }] },


  {
    'label': '甘南藏族自治州',
    'value': '623000',
    'children': [{
      'label': '合作市',
      'value': '623001' },

    {
      'label': '临潭县',
      'value': '623021' },

    {
      'label': '卓尼县',
      'value': '623022' },

    {
      'label': '舟曲县',
      'value': '623023' },

    {
      'label': '迭部县',
      'value': '623024' },

    {
      'label': '玛曲县',
      'value': '623025' },

    {
      'label': '碌曲县',
      'value': '623026' },

    {
      'label': '夏河县',
      'value': '623027' }] }] },



{
  'label': '青海省',
  'value': '630000',
  'children': [{
    'label': '西宁市',
    'value': '630100',
    'children': [{
      'label': '市辖区',
      'value': '630101' },

    {
      'label': '城东区',
      'value': '630102' },

    {
      'label': '城中区',
      'value': '630103' },

    {
      'label': '城西区',
      'value': '630104' },

    {
      'label': '城北区',
      'value': '630105' },

    {
      'label': '大通回族土族自治县',
      'value': '630121' },

    {
      'label': '湟中县',
      'value': '630122' },

    {
      'label': '湟源县',
      'value': '630123' }] },


  {
    'label': '海东市',
    'value': '630200',
    'children': [{
      'label': '市辖区',
      'value': '630201' },

    {
      'label': '乐都区',
      'value': '630202' },

    {
      'label': '平安县',
      'value': '630221' },

    {
      'label': '民和回族土族自治县',
      'value': '630222' },

    {
      'label': '互助土族自治县',
      'value': '630223' },

    {
      'label': '化隆回族自治县',
      'value': '630224' },

    {
      'label': '循化撒拉族自治县',
      'value': '630225' }] },


  {
    'label': '海北藏族自治州',
    'value': '632200',
    'children': [{
      'label': '门源回族自治县',
      'value': '632221' },

    {
      'label': '祁连县',
      'value': '632222' },

    {
      'label': '海晏县',
      'value': '632223' },

    {
      'label': '刚察县',
      'value': '632224' }] },


  {
    'label': '黄南藏族自治州',
    'value': '632300',
    'children': [{
      'label': '同仁县',
      'value': '632321' },

    {
      'label': '尖扎县',
      'value': '632322' },

    {
      'label': '泽库县',
      'value': '632323' },

    {
      'label': '河南蒙古族自治县',
      'value': '632324' }] },


  {
    'label': '海南藏族自治州',
    'value': '632500',
    'children': [{
      'label': '共和县',
      'value': '632521' },

    {
      'label': '同德县',
      'value': '632522' },

    {
      'label': '贵德县',
      'value': '632523' },

    {
      'label': '兴海县',
      'value': '632524' },

    {
      'label': '贵南县',
      'value': '632525' }] },


  {
    'label': '果洛藏族自治州',
    'value': '632600',
    'children': [{
      'label': '玛沁县',
      'value': '632621' },

    {
      'label': '班玛县',
      'value': '632622' },

    {
      'label': '甘德县',
      'value': '632623' },

    {
      'label': '达日县',
      'value': '632624' },

    {
      'label': '久治县',
      'value': '632625' },

    {
      'label': '玛多县',
      'value': '632626' }] },


  {
    'label': '玉树藏族自治州',
    'value': '632700',
    'children': [{
      'label': '玉树市',
      'value': '632701' },

    {
      'label': '杂多县',
      'value': '632722' },

    {
      'label': '称多县',
      'value': '632723' },

    {
      'label': '治多县',
      'value': '632724' },

    {
      'label': '囊谦县',
      'value': '632725' },

    {
      'label': '曲麻莱县',
      'value': '632726' }] },


  {
    'label': '海西蒙古族藏族自治州',
    'value': '632800',
    'children': [{
      'label': '格尔木市',
      'value': '632801' },

    {
      'label': '德令哈市',
      'value': '632802' },

    {
      'label': '乌兰县',
      'value': '632821' },

    {
      'label': '都兰县',
      'value': '632822' },

    {
      'label': '天峻县',
      'value': '632823' }] }] },



{
  'label': '宁夏回族自治区',
  'value': '640000',
  'children': [{
    'label': '银川市',
    'value': '640100',
    'children': [{
      'label': '市辖区',
      'value': '640101' },

    {
      'label': '兴庆区',
      'value': '640104' },

    {
      'label': '西夏区',
      'value': '640105' },

    {
      'label': '金凤区',
      'value': '640106' },

    {
      'label': '永宁县',
      'value': '640121' },

    {
      'label': '贺兰县',
      'value': '640122' },

    {
      'label': '灵武市',
      'value': '640181' }] },


  {
    'label': '石嘴山市',
    'value': '640200',
    'children': [{
      'label': '市辖区',
      'value': '640201' },

    {
      'label': '大武口区',
      'value': '640202' },

    {
      'label': '惠农区',
      'value': '640205' },

    {
      'label': '平罗县',
      'value': '640221' }] },


  {
    'label': '吴忠市',
    'value': '640300',
    'children': [{
      'label': '市辖区',
      'value': '640301' },

    {
      'label': '利通区',
      'value': '640302' },

    {
      'label': '红寺堡区',
      'value': '640303' },

    {
      'label': '盐池县',
      'value': '640323' },

    {
      'label': '同心县',
      'value': '640324' },

    {
      'label': '青铜峡市',
      'value': '640381' }] },


  {
    'label': '固原市',
    'value': '640400',
    'children': [{
      'label': '市辖区',
      'value': '640401' },

    {
      'label': '原州区',
      'value': '640402' },

    {
      'label': '西吉县',
      'value': '640422' },

    {
      'label': '隆德县',
      'value': '640423' },

    {
      'label': '泾源县',
      'value': '640424' },

    {
      'label': '彭阳县',
      'value': '640425' }] },


  {
    'label': '中卫市',
    'value': '640500',
    'children': [{
      'label': '市辖区',
      'value': '640501' },

    {
      'label': '沙坡头区',
      'value': '640502' },

    {
      'label': '中宁县',
      'value': '640521' },

    {
      'label': '海原县',
      'value': '640522' }] }] },



{
  'label': '新疆维吾尔自治区',
  'value': '650000',
  'children': [{
    'label': '乌鲁木齐市',
    'value': '650100',
    'children': [{
      'label': '市辖区',
      'value': '650101' },

    {
      'label': '天山区',
      'value': '650102' },

    {
      'label': '沙依巴克区',
      'value': '650103' },

    {
      'label': '新市区',
      'value': '650104' },

    {
      'label': '水磨沟区',
      'value': '650105' },

    {
      'label': '头屯河区',
      'value': '650106' },

    {
      'label': '达坂城区',
      'value': '650107' },

    {
      'label': '米东区',
      'value': '650109' },

    {
      'label': '乌鲁木齐县',
      'value': '650121' }] },


  {
    'label': '克拉玛依市',
    'value': '650200',
    'children': [{
      'label': '市辖区',
      'value': '650201' },

    {
      'label': '独山子区',
      'value': '650202' },

    {
      'label': '克拉玛依区',
      'value': '650203' },

    {
      'label': '白碱滩区',
      'value': '650204' },

    {
      'label': '乌尔禾区',
      'value': '650205' }] },


  {
    'label': '吐鲁番地区',
    'value': '652100',
    'children': [{
      'label': '吐鲁番市',
      'value': '652101' },

    {
      'label': '鄯善县',
      'value': '652122' },

    {
      'label': '托克逊县',
      'value': '652123' }] },


  {
    'label': '哈密地区',
    'value': '652200',
    'children': [{
      'label': '哈密市',
      'value': '652201' },

    {
      'label': '巴里坤哈萨克自治县',
      'value': '652222' },

    {
      'label': '伊吾县',
      'value': '652223' }] },


  {
    'label': '昌吉回族自治州',
    'value': '652300',
    'children': [{
      'label': '昌吉市',
      'value': '652301' },

    {
      'label': '阜康市',
      'value': '652302' },

    {
      'label': '呼图壁县',
      'value': '652323' },

    {
      'label': '玛纳斯县',
      'value': '652324' },

    {
      'label': '奇台县',
      'value': '652325' },

    {
      'label': '吉木萨尔县',
      'value': '652327' },

    {
      'label': '木垒哈萨克自治县',
      'value': '652328' }] },


  {
    'label': '博尔塔拉蒙古自治州',
    'value': '652700',
    'children': [{
      'label': '博乐市',
      'value': '652701' },

    {
      'label': '阿拉山口市',
      'value': '652702' },

    {
      'label': '精河县',
      'value': '652722' },

    {
      'label': '温泉县',
      'value': '652723' }] },


  {
    'label': '巴音郭楞蒙古自治州',
    'value': '652800',
    'children': [{
      'label': '库尔勒市',
      'value': '652801' },

    {
      'label': '轮台县',
      'value': '652822' },

    {
      'label': '尉犁县',
      'value': '652823' },

    {
      'label': '若羌县',
      'value': '652824' },

    {
      'label': '且末县',
      'value': '652825' },

    {
      'label': '焉耆回族自治县',
      'value': '652826' },

    {
      'label': '和静县',
      'value': '652827' },

    {
      'label': '和硕县',
      'value': '652828' },

    {
      'label': '博湖县',
      'value': '652829' }] },


  {
    'label': '阿克苏地区',
    'value': '652900',
    'children': [{
      'label': '阿克苏市',
      'value': '652901' },

    {
      'label': '温宿县',
      'value': '652922' },

    {
      'label': '库车县',
      'value': '652923' },

    {
      'label': '沙雅县',
      'value': '652924' },

    {
      'label': '新和县',
      'value': '652925' },

    {
      'label': '拜城县',
      'value': '652926' },

    {
      'label': '乌什县',
      'value': '652927' },

    {
      'label': '阿瓦提县',
      'value': '652928' },

    {
      'label': '柯坪县',
      'value': '652929' }] },


  {
    'label': '克孜勒苏柯尔克孜自治州',
    'value': '653000',
    'children': [{
      'label': '阿图什市',
      'value': '653001' },

    {
      'label': '阿克陶县',
      'value': '653022' },

    {
      'label': '阿合奇县',
      'value': '653023' },

    {
      'label': '乌恰县',
      'value': '653024' }] },


  {
    'label': '喀什地区',
    'value': '653100',
    'children': [{
      'label': '喀什市',
      'value': '653101' },

    {
      'label': '疏附县',
      'value': '653121' },

    {
      'label': '疏勒县',
      'value': '653122' },

    {
      'label': '英吉沙县',
      'value': '653123' },

    {
      'label': '泽普县',
      'value': '653124' },

    {
      'label': '莎车县',
      'value': '653125' },

    {
      'label': '叶城县',
      'value': '653126' },

    {
      'label': '麦盖提县',
      'value': '653127' },

    {
      'label': '岳普湖县',
      'value': '653128' },

    {
      'label': '伽师县',
      'value': '653129' },

    {
      'label': '巴楚县',
      'value': '653130' },

    {
      'label': '塔什库尔干塔吉克自治县',
      'value': '653131' }] },


  {
    'label': '和田地区',
    'value': '653200',
    'children': [{
      'label': '和田市',
      'value': '653201' },

    {
      'label': '和田县',
      'value': '653221' },

    {
      'label': '墨玉县',
      'value': '653222' },

    {
      'label': '皮山县',
      'value': '653223' },

    {
      'label': '洛浦县',
      'value': '653224' },

    {
      'label': '策勒县',
      'value': '653225' },

    {
      'label': '于田县',
      'value': '653226' },

    {
      'label': '民丰县',
      'value': '653227' }] },


  {
    'label': '伊犁哈萨克自治州',
    'value': '654000',
    'children': [{
      'label': '伊宁市',
      'value': '654002' },

    {
      'label': '奎屯市',
      'value': '654003' },

    {
      'label': '霍尔果斯市',
      'value': '654004' },

    {
      'label': '伊宁县',
      'value': '654021' },

    {
      'label': '察布查尔锡伯自治县',
      'value': '654022' },

    {
      'label': '霍城县',
      'value': '654023' },

    {
      'label': '巩留县',
      'value': '654024' },

    {
      'label': '新源县',
      'value': '654025' },

    {
      'label': '昭苏县',
      'value': '654026' },

    {
      'label': '特克斯县',
      'value': '654027' },

    {
      'label': '尼勒克县',
      'value': '654028' },

    {
      'label': '塔城地区',
      'value': '654200' },

    {
      'label': '塔城市',
      'value': '654201' },

    {
      'label': '乌苏市',
      'value': '654202' },

    {
      'label': '额敏县',
      'value': '654221' },

    {
      'label': '沙湾县',
      'value': '654223' },

    {
      'label': '托里县',
      'value': '654224' },

    {
      'label': '裕民县',
      'value': '654225' },

    {
      'label': '和布克赛尔蒙古自治县',
      'value': '654226' },

    {
      'label': '阿勒泰地区',
      'value': '654300' },

    {
      'label': '阿勒泰市',
      'value': '654301' },

    {
      'label': '布尔津县',
      'value': '654321' },

    {
      'label': '富蕴县',
      'value': '654322' },

    {
      'label': '福海县',
      'value': '654323' },

    {
      'label': '哈巴河县',
      'value': '654324' },

    {
      'label': '青河县',
      'value': '654325' },

    {
      'label': '吉木乃县',
      'value': '654326' }] },


  {
    'label': '自治区直辖县级行政区划',
    'value': '659000',
    'children': [{
      'label': '石河子市',
      'value': '659001' },

    {
      'label': '阿拉尔市',
      'value': '659002' },

    {
      'label': '图木舒克市',
      'value': '659003' },

    {
      'label': '五家渠市',
      'value': '659004' },

    {
      'label': '北屯市',
      'value': '659005' },

    {
      'label': '铁门关市',
      'value': '659006' },

    {
      'label': '双河市',
      'value': '659007' }] }] },



{
  'label': '台湾省',
  'value': '710000',
  'children': [{
    'label': '台北市',
    'value': '710100',
    'children': [{
      'label': '松山区',
      'value': '710101' },

    {
      'label': '信义区',
      'value': '710102' },

    {
      'label': '大安区',
      'value': '710103' },

    {
      'label': '中山区',
      'value': '710104' },

    {
      'label': '中正区',
      'value': '710105' },

    {
      'label': '大同区',
      'value': '710106' },

    {
      'label': '万华区',
      'value': '710107' },

    {
      'label': '文山区',
      'value': '710108' },

    {
      'label': '南港区',
      'value': '710109' },

    {
      'label': '内湖区',
      'value': '710110' },

    {
      'label': '士林区',
      'value': '710111' },

    {
      'label': '北投区',
      'value': '710112' }] },


  {
    'label': '高雄市',
    'value': '710200',
    'children': [{
      'label': '盐埕区',
      'value': '710201' },

    {
      'label': '鼓山区',
      'value': '710202' },

    {
      'label': '左营区',
      'value': '710203' },

    {
      'label': '楠梓区',
      'value': '710204' },

    {
      'label': '三民区',
      'value': '710205' },

    {
      'label': '新兴区',
      'value': '710206' },

    {
      'label': '前金区',
      'value': '710207' },

    {
      'label': '苓雅区',
      'value': '710208' },

    {
      'label': '前镇区',
      'value': '710209' },

    {
      'label': '旗津区',
      'value': '710210' },

    {
      'label': '小港区',
      'value': '710211' },

    {
      'label': '凤山区',
      'value': '710212' },

    {
      'label': '林园区',
      'value': '710213' },

    {
      'label': '大寮区',
      'value': '710214' },

    {
      'label': '大树区',
      'value': '710215' },

    {
      'label': '大社区',
      'value': '710216' },

    {
      'label': '仁武区',
      'value': '710217' },

    {
      'label': '鸟松区',
      'value': '710218' },

    {
      'label': '冈山区',
      'value': '710219' },

    {
      'label': '桥头区',
      'value': '710220' },

    {
      'label': '燕巢区',
      'value': '710221' },

    {
      'label': '田寮区',
      'value': '710222' },

    {
      'label': '阿莲区',
      'value': '710223' },

    {
      'label': '路竹区',
      'value': '710224' },

    {
      'label': '湖内区',
      'value': '710225' },

    {
      'label': '茄萣区',
      'value': '710226' },

    {
      'label': '永安区',
      'value': '710227' },

    {
      'label': '弥陀区',
      'value': '710228' },

    {
      'label': '梓官区',
      'value': '710229' },

    {
      'label': '旗山区',
      'value': '710230' },

    {
      'label': '美浓区',
      'value': '710231' },

    {
      'label': '六龟区',
      'value': '710232' },

    {
      'label': '甲仙区',
      'value': '710233' },

    {
      'label': '杉林区',
      'value': '710234' },

    {
      'label': '内门区',
      'value': '710235' },

    {
      'label': '茂林区',
      'value': '710236' },

    {
      'label': '桃源区',
      'value': '710237' },

    {
      'label': '那玛夏区',
      'value': '710238' }] },


  {
    'label': '基隆市',
    'value': '710300',
    'children': [{
      'label': '中正区',
      'value': '710301' },

    {
      'label': '七堵区',
      'value': '710302' },

    {
      'label': '暖暖区',
      'value': '710303' },

    {
      'label': '仁爱区',
      'value': '710304' },

    {
      'label': '中山区',
      'value': '710305' },

    {
      'label': '安乐区',
      'value': '710306' },

    {
      'label': '信义区',
      'value': '710307' }] },


  {
    'label': '台中市',
    'value': '710400',
    'children': [{
      'label': '中区',
      'value': '710401' },

    {
      'label': '东区',
      'value': '710402' },

    {
      'label': '南区',
      'value': '710403' },

    {
      'label': '西区',
      'value': '710404' },

    {
      'label': '北区',
      'value': '710405' },

    {
      'label': '西屯区',
      'value': '710406' },

    {
      'label': '南屯区',
      'value': '710407' },

    {
      'label': '北屯区',
      'value': '710408' },

    {
      'label': '丰原区',
      'value': '710409' },

    {
      'label': '东势区',
      'value': '710410' },

    {
      'label': '大甲区',
      'value': '710411' },

    {
      'label': '清水区',
      'value': '710412' },

    {
      'label': '沙鹿区',
      'value': '710413' },

    {
      'label': '梧栖区',
      'value': '710414' },

    {
      'label': '后里区',
      'value': '710415' },

    {
      'label': '神冈区',
      'value': '710416' },

    {
      'label': '潭子区',
      'value': '710417' },

    {
      'label': '大雅区',
      'value': '710418' },

    {
      'label': '新社区',
      'value': '710419' },

    {
      'label': '石冈区',
      'value': '710420' },

    {
      'label': '外埔区',
      'value': '710421' },

    {
      'label': '大安区',
      'value': '710422' },

    {
      'label': '乌日区',
      'value': '710423' },

    {
      'label': '大肚区',
      'value': '710424' },

    {
      'label': '龙井区',
      'value': '710425' },

    {
      'label': '雾峰区',
      'value': '710426' },

    {
      'label': '太平区',
      'value': '710427' },

    {
      'label': '大里区',
      'value': '710428' },

    {
      'label': '和平区',
      'value': '710429' }] },


  {
    'label': '台南市',
    'value': '710500',
    'children': [{
      'label': '东区',
      'value': '710501' },

    {
      'label': '南区',
      'value': '710502' },

    {
      'label': '北区',
      'value': '710504' },

    {
      'label': '安南区',
      'value': '710506' },

    {
      'label': '安平区',
      'value': '710507' },

    {
      'label': '中西区',
      'value': '710508' },

    {
      'label': '新营区',
      'value': '710509' },

    {
      'label': '盐水区',
      'value': '710510' },

    {
      'label': '白河区',
      'value': '710511' },

    {
      'label': '柳营区',
      'value': '710512' },

    {
      'label': '后壁区',
      'value': '710513' },

    {
      'label': '东山区',
      'value': '710514' },

    {
      'label': '麻豆区',
      'value': '710515' },

    {
      'label': '下营区',
      'value': '710516' },

    {
      'label': '六甲区',
      'value': '710517' },

    {
      'label': '官田区',
      'value': '710518' },

    {
      'label': '大内区',
      'value': '710519' },

    {
      'label': '佳里区',
      'value': '710520' },

    {
      'label': '学甲区',
      'value': '710521' },

    {
      'label': '西港区',
      'value': '710522' },

    {
      'label': '七股区',
      'value': '710523' },

    {
      'label': '将军区',
      'value': '710524' },

    {
      'label': '北门区',
      'value': '710525' },

    {
      'label': '新化区',
      'value': '710526' },

    {
      'label': '善化区',
      'value': '710527' },

    {
      'label': '新市区',
      'value': '710528' },

    {
      'label': '安定区',
      'value': '710529' },

    {
      'label': '山上区',
      'value': '710530' },

    {
      'label': '玉井区',
      'value': '710531' },

    {
      'label': '楠西区',
      'value': '710532' },

    {
      'label': '南化区',
      'value': '710533' },

    {
      'label': '左镇区',
      'value': '710534' },

    {
      'label': '仁德区',
      'value': '710535' },

    {
      'label': '归仁区',
      'value': '710536' },

    {
      'label': '关庙区',
      'value': '710537' },

    {
      'label': '龙崎区',
      'value': '710538' },

    {
      'label': '永康区',
      'value': '710539' }] },


  {
    'label': '新竹市',
    'value': '710600',
    'children': [{
      'label': '东区',
      'value': '710601' },

    {
      'label': '北区',
      'value': '710602' },

    {
      'label': '香山区',
      'value': '710603' }] },


  {
    'label': '嘉义市',
    'value': '710700',
    'children': [{
      'label': '东区',
      'value': '710701' },

    {
      'label': '西区',
      'value': '710702' }] },


  {
    'label': '新北市',
    'value': '710800',
    'children': [{
      'label': '板桥区',
      'value': '710801' },

    {
      'label': '三重区',
      'value': '710802' },

    {
      'label': '中和区',
      'value': '710803' },

    {
      'label': '永和区',
      'value': '710804' },

    {
      'label': '新庄区',
      'value': '710805' },

    {
      'label': '新店区',
      'value': '710806' },

    {
      'label': '树林区',
      'value': '710807' },

    {
      'label': '莺歌区',
      'value': '710808' },

    {
      'label': '三峡区',
      'value': '710809' },

    {
      'label': '淡水区',
      'value': '710810' },

    {
      'label': '汐止区',
      'value': '710811' },

    {
      'label': '瑞芳区',
      'value': '710812' },

    {
      'label': '土城区',
      'value': '710813' },

    {
      'label': '芦洲区',
      'value': '710814' },

    {
      'label': '五股区',
      'value': '710815' },

    {
      'label': '泰山区',
      'value': '710816' },

    {
      'label': '林口区',
      'value': '710817' },

    {
      'label': '深坑区',
      'value': '710818' },

    {
      'label': '石碇区',
      'value': '710819' },

    {
      'label': '坪林区',
      'value': '710820' },

    {
      'label': '三芝区',
      'value': '710821' },

    {
      'label': '石门区',
      'value': '710822' },

    {
      'label': '八里区',
      'value': '710823' },

    {
      'label': '平溪区',
      'value': '710824' },

    {
      'label': '双溪区',
      'value': '710825' },

    {
      'label': '贡寮区',
      'value': '710826' },

    {
      'label': '金山区',
      'value': '710827' },

    {
      'label': '万里区',
      'value': '710828' },

    {
      'label': '乌来区',
      'value': '710829' }] },


  {
    'label': '宜兰县',
    'value': '712200',
    'children': [{
      'label': '宜兰市',
      'value': '712201' },

    {
      'label': '罗东镇',
      'value': '712221' },

    {
      'label': '苏澳镇',
      'value': '712222' },

    {
      'label': '头城镇',
      'value': '712223' },

    {
      'label': '礁溪乡',
      'value': '712224' },

    {
      'label': '壮围乡',
      'value': '712225' },

    {
      'label': '员山乡',
      'value': '712226' },

    {
      'label': '冬山乡',
      'value': '712227' },

    {
      'label': '五结乡',
      'value': '712228' },

    {
      'label': '三星乡',
      'value': '712229' },

    {
      'label': '大同乡',
      'value': '712230' },

    {
      'label': '南澳乡',
      'value': '712231' }] },


  {
    'label': '桃园县',
    'value': '712300',
    'children': [{
      'label': '桃园市',
      'value': '712301' },

    {
      'label': '中坜市',
      'value': '712302' },

    {
      'label': '平镇市',
      'value': '712303' },

    {
      'label': '八德市',
      'value': '712304' },

    {
      'label': '杨梅市',
      'value': '712305' },

    {
      'label': '大溪镇',
      'value': '712321' },

    {
      'label': '芦竹乡',
      'value': '712323' },

    {
      'label': '大园乡',
      'value': '712324' },

    {
      'label': '龟山乡',
      'value': '712325' },

    {
      'label': '龙潭乡',
      'value': '712327' },

    {
      'label': '新屋乡',
      'value': '712329' },

    {
      'label': '观音乡',
      'value': '712330' },

    {
      'label': '复兴乡',
      'value': '712331' }] },


  {
    'label': '新竹县',
    'value': '712400',
    'children': [{
      'label': '竹北市',
      'value': '712401' },

    {
      'label': '竹东镇',
      'value': '712421' },

    {
      'label': '新埔镇',
      'value': '712422' },

    {
      'label': '关西镇',
      'value': '712423' },

    {
      'label': '湖口乡',
      'value': '712424' },

    {
      'label': '新丰乡',
      'value': '712425' },

    {
      'label': '芎林乡',
      'value': '712426' },

    {
      'label': '橫山乡',
      'value': '712427' },

    {
      'label': '北埔乡',
      'value': '712428' },

    {
      'label': '宝山乡',
      'value': '712429' },

    {
      'label': '峨眉乡',
      'value': '712430' },

    {
      'label': '尖石乡',
      'value': '712431' },

    {
      'label': '五峰乡',
      'value': '712432' }] },


  {
    'label': '苗栗县',
    'value': '712500',
    'children': [{
      'label': '苗栗市',
      'value': '712501' },

    {
      'label': '苑里镇',
      'value': '712521' },

    {
      'label': '通霄镇',
      'value': '712522' },

    {
      'label': '竹南镇',
      'value': '712523' },

    {
      'label': '头份镇',
      'value': '712524' },

    {
      'label': '后龙镇',
      'value': '712525' },

    {
      'label': '卓兰镇',
      'value': '712526' },

    {
      'label': '大湖乡',
      'value': '712527' },

    {
      'label': '公馆乡',
      'value': '712528' },

    {
      'label': '铜锣乡',
      'value': '712529' },

    {
      'label': '南庄乡',
      'value': '712530' },

    {
      'label': '头屋乡',
      'value': '712531' },

    {
      'label': '三义乡',
      'value': '712532' },

    {
      'label': '西湖乡',
      'value': '712533' },

    {
      'label': '造桥乡',
      'value': '712534' },

    {
      'label': '三湾乡',
      'value': '712535' },

    {
      'label': '狮潭乡',
      'value': '712536' },

    {
      'label': '泰安乡',
      'value': '712537' }] },


  {
    'label': '彰化县',
    'value': '712700',
    'children': [{
      'label': '彰化市',
      'value': '712701' },

    {
      'label': '鹿港镇',
      'value': '712721' },

    {
      'label': '和美镇',
      'value': '712722' },

    {
      'label': '线西乡',
      'value': '712723' },

    {
      'label': '伸港乡',
      'value': '712724' },

    {
      'label': '福兴乡',
      'value': '712725' },

    {
      'label': '秀水乡',
      'value': '712726' },

    {
      'label': '花坛乡',
      'value': '712727' },

    {
      'label': '芬园乡',
      'value': '712728' },

    {
      'label': '员林镇',
      'value': '712729' },

    {
      'label': '溪湖镇',
      'value': '712730' },

    {
      'label': '田中镇',
      'value': '712731' },

    {
      'label': '大村乡',
      'value': '712732' },

    {
      'label': '埔盐乡',
      'value': '712733' },

    {
      'label': '埔心乡',
      'value': '712734' },

    {
      'label': '永靖乡',
      'value': '712735' },

    {
      'label': '社头乡',
      'value': '712736' },

    {
      'label': '二水乡',
      'value': '712737' },

    {
      'label': '北斗镇',
      'value': '712738' },

    {
      'label': '二林镇',
      'value': '712739' },

    {
      'label': '田尾乡',
      'value': '712740' },

    {
      'label': '埤头乡',
      'value': '712741' },

    {
      'label': '芳苑乡',
      'value': '712742' },

    {
      'label': '大城乡',
      'value': '712743' },

    {
      'label': '竹塘乡',
      'value': '712744' },

    {
      'label': '溪州乡',
      'value': '712745' }] },


  {
    'label': '南投县',
    'value': '712800',
    'children': [{
      'label': '南投市',
      'value': '712801' },

    {
      'label': '埔里镇',
      'value': '712821' },

    {
      'label': '草屯镇',
      'value': '712822' },

    {
      'label': '竹山镇',
      'value': '712823' },

    {
      'label': '集集镇',
      'value': '712824' },

    {
      'label': '名间乡',
      'value': '712825' },

    {
      'label': '鹿谷乡',
      'value': '712826' },

    {
      'label': '中寮乡',
      'value': '712827' },

    {
      'label': '鱼池乡',
      'value': '712828' },

    {
      'label': '国姓乡',
      'value': '712829' },

    {
      'label': '水里乡',
      'value': '712830' },

    {
      'label': '信义乡',
      'value': '712831' },

    {
      'label': '仁爱乡',
      'value': '712832' }] },


  {
    'label': '云林县',
    'value': '712900',
    'children': [{
      'label': '斗六市',
      'value': '712901' },

    {
      'label': '斗南镇',
      'value': '712921' },

    {
      'label': '虎尾镇',
      'value': '712922' },

    {
      'label': '西螺镇',
      'value': '712923' },

    {
      'label': '土库镇',
      'value': '712924' },

    {
      'label': '北港镇',
      'value': '712925' },

    {
      'label': '古坑乡',
      'value': '712926' },

    {
      'label': '大埤乡',
      'value': '712927' },

    {
      'label': '莿桐乡',
      'value': '712928' },

    {
      'label': '林内乡',
      'value': '712929' },

    {
      'label': '二仑乡',
      'value': '712930' },

    {
      'label': '仑背乡',
      'value': '712931' },

    {
      'label': '麦寮乡',
      'value': '712932' },

    {
      'label': '东势乡',
      'value': '712933' },

    {
      'label': '褒忠乡',
      'value': '712934' },

    {
      'label': '台西乡',
      'value': '712935' },

    {
      'label': '元长乡',
      'value': '712936' },

    {
      'label': '四湖乡',
      'value': '712937' },

    {
      'label': '口湖乡',
      'value': '712938' },

    {
      'label': '水林乡',
      'value': '712939' }] },


  {
    'label': '嘉义县',
    'value': '713000',
    'children': [{
      'label': '太保市',
      'value': '713001' },

    {
      'label': '朴子市',
      'value': '713002' },

    {
      'label': '布袋镇',
      'value': '713023' },

    {
      'label': '大林镇',
      'value': '713024' },

    {
      'label': '民雄乡',
      'value': '713025' },

    {
      'label': '溪口乡',
      'value': '713026' },

    {
      'label': '新港乡',
      'value': '713027' },

    {
      'label': '六脚乡',
      'value': '713028' },

    {
      'label': '东石乡',
      'value': '713029' },

    {
      'label': '义竹乡',
      'value': '713030' },

    {
      'label': '鹿草乡',
      'value': '713031' },

    {
      'label': '水上乡',
      'value': '713032' },

    {
      'label': '中埔乡',
      'value': '713033' },

    {
      'label': '竹崎乡',
      'value': '713034' },

    {
      'label': '梅山乡',
      'value': '713035' },

    {
      'label': '番路乡',
      'value': '713036' },

    {
      'label': '大埔乡',
      'value': '713037' },

    {
      'label': '阿里山乡',
      'value': '713038' }] },


  {
    'label': '屏东县',
    'value': '713300',
    'children': [{
      'label': '屏东市',
      'value': '713301' },

    {
      'label': '潮州镇',
      'value': '713321' },

    {
      'label': '东港镇',
      'value': '713322' },

    {
      'label': '恒春镇',
      'value': '713323' },

    {
      'label': '万丹乡',
      'value': '713324' },

    {
      'label': '长治乡',
      'value': '713325' },

    {
      'label': '麟洛乡',
      'value': '713326' },

    {
      'label': '九如乡',
      'value': '713327' },

    {
      'label': '里港乡',
      'value': '713328' },

    {
      'label': '盐埔乡',
      'value': '713329' },

    {
      'label': '高树乡',
      'value': '713330' },

    {
      'label': '万峦乡',
      'value': '713331' },

    {
      'label': '内埔乡',
      'value': '713332' },

    {
      'label': '竹田乡',
      'value': '713333' },

    {
      'label': '新埤乡',
      'value': '713334' },

    {
      'label': '枋寮乡',
      'value': '713335' },

    {
      'label': '新园乡',
      'value': '713336' },

    {
      'label': '崁顶乡',
      'value': '713337' },

    {
      'label': '林边乡',
      'value': '713338' },

    {
      'label': '南州乡',
      'value': '713339' },

    {
      'label': '佳冬乡',
      'value': '713340' },

    {
      'label': '琉球乡',
      'value': '713341' },

    {
      'label': '车城乡',
      'value': '713342' },

    {
      'label': '满州乡',
      'value': '713343' },

    {
      'label': '枋山乡',
      'value': '713344' },

    {
      'label': '三地门乡',
      'value': '713345' },

    {
      'label': '雾台乡',
      'value': '713346' },

    {
      'label': '玛家乡',
      'value': '713347' },

    {
      'label': '泰武乡',
      'value': '713348' },

    {
      'label': '来义乡',
      'value': '713349' },

    {
      'label': '春日乡',
      'value': '713350' },

    {
      'label': '狮子乡',
      'value': '713351' },

    {
      'label': '牡丹乡',
      'value': '713352' }] },


  {
    'label': '台东县',
    'value': '713400',
    'children': [{
      'label': '台东市',
      'value': '713401' },

    {
      'label': '成功镇',
      'value': '713421' },

    {
      'label': '关山镇',
      'value': '713422' },

    {
      'label': '卑南乡',
      'value': '713423' },

    {
      'label': '鹿野乡',
      'value': '713424' },

    {
      'label': '池上乡',
      'value': '713425' },

    {
      'label': '东河乡',
      'value': '713426' },

    {
      'label': '长滨乡',
      'value': '713427' },

    {
      'label': '太麻里乡',
      'value': '713428' },

    {
      'label': '大武乡',
      'value': '713429' },

    {
      'label': '绿岛乡',
      'value': '713430' },

    {
      'label': '海端乡',
      'value': '713431' },

    {
      'label': '延平乡',
      'value': '713432' },

    {
      'label': '金峰乡',
      'value': '713433' },

    {
      'label': '达仁乡',
      'value': '713434' },

    {
      'label': '兰屿乡',
      'value': '713435' }] },


  {
    'label': '花莲县',
    'value': '713500',
    'children': [{
      'label': '花莲市',
      'value': '713501' },

    {
      'label': '凤林镇',
      'value': '713521' },

    {
      'label': '玉里镇',
      'value': '713522' },

    {
      'label': '新城乡',
      'value': '713523' },

    {
      'label': '吉安乡',
      'value': '713524' },

    {
      'label': '寿丰乡',
      'value': '713525' },

    {
      'label': '光复乡',
      'value': '713526' },

    {
      'label': '丰滨乡',
      'value': '713527' },

    {
      'label': '瑞穗乡',
      'value': '713528' },

    {
      'label': '富里乡',
      'value': '713529' },

    {
      'label': '秀林乡',
      'value': '713530' },

    {
      'label': '万荣乡',
      'value': '713531' },

    {
      'label': '卓溪乡',
      'value': '713532' }] },


  {
    'label': '澎湖县',
    'value': '713600',
    'children': [{
      'label': '马公市',
      'value': '713601' },

    {
      'label': '湖西乡',
      'value': '713621' },

    {
      'label': '白沙乡',
      'value': '713622' },

    {
      'label': '西屿乡',
      'value': '713623' },

    {
      'label': '望安乡',
      'value': '713624' },

    {
      'label': '七美乡',
      'value': '713625' }] }] },



{
  'label': '香港特别行政区',
  'value': '810000',
  'children': [{
    'label': '香港岛',
    'value': '810100',
    'children': [{
      'label': '中西区',
      'value': '810101' },

    {
      'label': '湾仔区',
      'value': '810102' },

    {
      'label': '东区',
      'value': '810103' },

    {
      'label': '南区',
      'value': '810104' }] },


  {
    'label': '九龙',
    'value': '810200',
    'children': [{
      'label': '油尖旺区',
      'value': '810201' },

    {
      'label': '深水埗区',
      'value': '810202' },

    {
      'label': '九龙城区',
      'value': '810203' },

    {
      'label': '黄大仙区',
      'value': '810204' },

    {
      'label': '观塘区',
      'value': '810205' }] },


  {
    'label': '新界',
    'value': '810300',
    'children': [{
      'label': '荃湾区',
      'value': '810301' },

    {
      'label': '屯门区',
      'value': '810302' },

    {
      'label': '元朗区',
      'value': '810303' },

    {
      'label': '北区',
      'value': '810304' },

    {
      'label': '大埔区',
      'value': '810305' },

    {
      'label': '西贡区',
      'value': '810306' },

    {
      'label': '沙田区',
      'value': '810307' },

    {
      'label': '葵青区',
      'value': '810308' },

    {
      'label': '离岛区',
      'value': '810309' }] }] },



{
  'label': '澳门特别行政区',
  'value': '820000',
  'children': [{
    'label': '澳门半岛',
    'value': '820100',
    'children': [{
      'label': '花地玛堂区',
      'value': '820101' },

    {
      'label': '圣安多尼堂区',
      'value': '820102' },

    {
      'label': '大堂区',
      'value': '820103' },

    {
      'label': '望德堂区',
      'value': '820104' },

    {
      'label': '风顺堂区',
      'value': '820105' }] },


  {
    'label': '氹仔岛',
    'value': '820200',
    'children': [{
      'label': '嘉模堂区',
      'value': '820201' }] },


  {
    'label': '路环岛',
    'value': '820300',
    'children': [{
      'label': '圣方济各堂区',
      'value': '820301' }] }] }];exports.default = _default;

/***/ }),

/***/ 382:
/*!*****************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/components/jyf-Parser/Parser.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //Parser.js
var Tokenizer = __webpack_require__(/*! ./Tokenizer.js */ 383);
var DomHandler = __webpack_require__(/*! ./DomHandler.js */ 384);
var trustAttrs = {
  align: true,
  alt: true,




  author: true,
  autoplay: true,
  class: true,
  color: true,
  colspan: true,
  controls: true,
  "data-src": true,
  dir: true,
  face: true,
  height: true,
  href: true,
  id: true,
  ignore: true,
  loop: true,
  muted: true,
  name: true,
  poster: true,
  rowspan: true,
  size: true,
  span: true,
  src: true,
  start: true,
  style: true,
  type: true,

  "unit-id": true,

  width: true };









































var voidTag = {
  area: true,
  base: true,
  basefont: true,
  br: true,
  col: true,
  circle: true,
  command: true,
  ellipse: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  isindex: true,
  keygen: true,
  line: true,
  link: true,
  meta: true,
  param: true,
  path: true,
  polygon: true,
  polyline: true,
  rect: true,
  source: true,
  stop: true,
  track: true,
  use: true,
  wbr: true };


function Parser(cbs, callback) {
  this._cbs = cbs;
  this._callback = callback;
  this._tagname = "";
  this._attribname = "";
  this._attribvalue = "";
  this._attribs = null;
  this._stack = [];
  this._tokenizer = new Tokenizer(this);
}
Parser.prototype.ontext = function (data) {
  this._cbs.ontext(data);
};
Parser.prototype.onopentagname = function (name) {
  name = name.toLowerCase();
  this._tagname = name;
  this._attribs = {
    style: '' };

  if (!voidTag[name]) this._stack.push(name);
};
Parser.prototype.onopentagend = function () {
  if (this._attribs) {
    this._cbs.onopentag(this._tagname, this._attribs);
    this._attribs = null;
  }
  if (voidTag[this._tagname]) this._cbs.onclosetag(this._tagname);
  this._tagname = "";
};
Parser.prototype.onclosetag = function (name) {
  name = name.toLowerCase();
  if (this._stack.length && !voidTag[name]) {
    var pos = this._stack.lastIndexOf(name);
    if (pos !== -1) {
      pos = this._stack.length - pos;
      while (pos--) {this._cbs.onclosetag(this._stack.pop());}
    } else if (name === "p") {
      this.onopentagname(name);
      this._closeCurrentTag();
    }
  } else if (name === "br" || name === "hr" || name === "p") {
    this.onopentagname(name);
    this._closeCurrentTag();
  }
};
Parser.prototype._closeCurrentTag = function () {
  var name = this._tagname;
  this.onopentagend();
  if (this._stack[this._stack.length - 1] === name) {
    this._cbs.onclosetag(name);
    this._stack.pop();
  }
};
Parser.prototype.onattribend = function () {
  this._attribvalue = this._attribvalue.replace(/&quot;/g, '"');
  if (this._attribs && trustAttrs[this._attribname]) {
    this._attribs[this._attribname] = this._attribvalue;
  }
  this._attribname = "";
  this._attribvalue = "";
};
Parser.prototype.onend = function () {
  for (
  var i = this._stack.length; i > 0; this._cbs.onclosetag(this._stack[--i])) {
    ;}
  this._callback({
    'nodes': this._cbs.nodes,
    'title': this._cbs.title,
    'imgList': this._cbs.imgList });

};
Parser.prototype.write = function (chunk) {
  this._tokenizer.parse(chunk);
};

function html2nodes(data, tagStyle, imgMode) {
  return new Promise(function (resolve, reject) {
    try {
      var style = '';
      data = data.replace(/<style.*?>([\s\S]*?)<\/style>/gi, function () {
        style += arguments[1];
        return '';
      });
      var handler = new DomHandler(style, tagStyle, imgMode);
      new Parser(handler, function (res) {



        return resolve(res);
      }).write(data);
    } catch (err) {
      return reject(err);
    }
  });
}
module.exports = html2nodes;

/***/ }),

/***/ 383:
/*!********************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/components/jyf-Parser/Tokenizer.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //Tokenizer.js
function Tokenizer(cbs) {
  this._state = "TEXT";
  this._buffer = "";
  this._sectionStart = 0;
  this._index = 0;
  this._cbs = cbs;
}
Tokenizer.prototype.TEXT = function (c) {
  var index = this._buffer.indexOf("<", this._index);
  if (index != -1) {
    this._index = index;
    this._cbs.ontext(this._getSection());
    this._state = "BeforeTag";
    this._sectionStart = this._index;
  } else this._index = this._buffer.length;
};
Tokenizer.prototype.BeforeTag = function (c) {
  switch (c) {
    case "/":
      this._state = "BeforeCloseTag";
      break;
    case "!":
      this._state = "BeforeDeclaration";
      break;
    case "?":
      var index = this._buffer.indexOf(">", this._index);
      if (index != -1) {
        this._index = index;
        this._sectionStart = this._index + 1;
      } else this._sectionStart = this._index = this._buffer.length;
      this._state = "TEXT";
      break;
    case ">":
      this._state = "TEXT";
      break;
    case "<":
      this._cbs.ontext(this._getSection());
      this._sectionStart = this._index;
      break;
    default:
      if (/\s/.test(c)) this._state = "TEXT";else
      {
        this._state = "InTag";
        this._sectionStart = this._index;
      }}

};
Tokenizer.prototype.InTag = function (c) {
  if (c === "/" || c === ">" || /\s/.test(c)) {
    this._cbs.onopentagname(this._getSection());
    this._state = "BeforeAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.BeforeAttrsName = function (c) {
  if (c === ">") {
    this._cbs.onopentagend();
    this._state = "TEXT";
    this._sectionStart = this._index + 1;
  } else if (c === "/") {
    this._state = "InSelfCloseTag";
  } else if (!/\s/.test(c)) {
    this._state = "InAttrsName";
    this._sectionStart = this._index;
  }
};
Tokenizer.prototype.InAttrsName = function (c) {
  if (c === "=" || c === "/" || c === ">" || /\s/.test(c)) {
    this._cbs._attribname = this._getSection().toLowerCase();
    this._sectionStart = -1;
    this._state = "AfterAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.AfterAttrsName = function (c) {
  if (c === "=") {
    this._state = "BeforeAttrsValue";
  } else if (c === "/" || c === ">") {
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
    this._index--;
  } else if (!/\s/.test(c)) {
    this._cbs.onattribend();
    this._state = "InAttrsName";
    this._sectionStart = this._index;
  }
};
Tokenizer.prototype.BeforeAttrsValue = function (c) {
  if (c === '"') {
    this._state = "InAttrsValueDQ";
    this._sectionStart = this._index + 1;
  } else if (c === "'") {
    this._state = "InAttrsValueSQ";
    this._sectionStart = this._index + 1;
  } else if (!/\s/.test(c)) {
    this._state = "InAttrsValueNQ";
    this._sectionStart = this._index;
    this._index--;
  }
};
Tokenizer.prototype.InAttrsValueDQ = function (c) {
  if (c === '"') {
    this._cbs._attribvalue += this._getSection();
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
  }
};
Tokenizer.prototype.InAttrsValueSQ = function (c) {
  if (c === "'") {
    this._cbs._attribvalue += this._getSection();
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
  }
};
Tokenizer.prototype.InAttrsValueNQ = function (c) {
  if (/\s/.test(c) || c === ">") {
    this._cbs._attribvalue += this._getSection();
    this._cbs.onattribend();
    this._state = "BeforeAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.BeforeCloseTag = function (c) {
  if (/\s/.test(c)) ;else
  if (c === ">") {
    this._state = "TEXT";
  } else {
    this._state = "InCloseTag";
    this._sectionStart = this._index;
  }
};
Tokenizer.prototype.InCloseTag = function (c) {
  if (c === ">" || /\s/.test(c)) {
    this._cbs.onclosetag(this._getSection());
    this._state = "AfterCloseTag";
    this._index--;
  }
};
Tokenizer.prototype.InSelfCloseTag = function (c) {
  if (c === ">") {
    this._cbs.onopentagend();
    this._state = "TEXT";
    this._sectionStart = this._index + 1;
  } else if (!/\s/.test(c)) {
    this._state = "BeforeAttrsName";
    this._index--;
  }
};
Tokenizer.prototype.AfterCloseTag = function (c) {
  if (c === ">") {
    this._state = "TEXT";
    this._sectionStart = this._index + 1;
  }
};
Tokenizer.prototype.BeforeDeclaration = function (c) {
  if (c == '-') this._state = "InComment";else
  if (c == '[') this._state = "BeforeCDATA1";else
  this._state = "InDeclaration";
};
Tokenizer.prototype.InDeclaration = function (c) {
  var index = this._buffer.indexOf(">", this._index);
  if (index != -1) {
    this._index = index;
    this._sectionStart = index + 1;
  } else this._sectionStart = this._index = this._buffer.length;
  this._state = "TEXT";
};
Tokenizer.prototype.InComment = function (c) {
  var key = c == '-' ? '-->' : '>';
  var index = this._buffer.indexOf(key, this._index);
  if (index != -1) {
    this._index = index + key.length - 1;
    this._sectionStart = this._index + 1;
  } else this._sectionStart = this._index = this._buffer.length;
  this._state = "TEXT";
};
Tokenizer.prototype.BeforeCDATA1 = function (c) {
  if (c == 'C') this._state = "BeforeCDATA2";else
  this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA2 = function (c) {
  if (c == 'D') this._state = "BeforeCDATA3";else
  this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA3 = function (c) {
  if (c == 'A') this._state = "BeforeCDATA4";else
  this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA4 = function (c) {
  if (c == 'T') this._state = "BeforeCDATA5";else
  this._state = "InDeclaration";
};
Tokenizer.prototype.BeforeCDATA5 = function (c) {
  if (c == 'A') this._state = "InCDATA";else
  this._state = "InDeclaration";
};
Tokenizer.prototype.InCDATA = function (c) {
  var key = c == '[' ? ']]>' : '>';
  var index = this._buffer.indexOf(key, this._index);
  if (index != -1) {
    this._index = index + key.length - 1;
    this._sectionStart = this._index + 1;
  } else this._sectionStart = this._index = this._buffer.length;
  this._state = "TEXT";
};
Tokenizer.prototype.parse = function (chunk) {
  this._buffer += chunk;
  for (; this._index < this._buffer.length; this._index++) {
    this[this._state](this._buffer[this._index]);}
  if (this._state === "TEXT" && this._sectionStart !== this._index)
  this._cbs.ontext(this._buffer.substr(this._sectionStart));
  this._cbs.onend();
};
Tokenizer.prototype._getSection = function () {
  return this._buffer.substring(this._sectionStart, this._index);
};
module.exports = Tokenizer;

/***/ }),

/***/ 384:
/*!*********************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/components/jyf-Parser/DomHandler.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //DomHandler.js
var emoji;
try {
  emoji = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module './emoji.js'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
} catch (err) {}
var CssHandler = __webpack_require__(/*! ./CssHandler.js */ 385);

var CanIUse = __webpack_require__(/*! ./api.js */ 386).versionHigherThan('2.7.1');

var trustTag = {
  a: 0,
  abbr: 1,
  ad: 0,
  audio: 0,
  b: 1,
  blockquote: 1,
  br: 0,
  code: 1,
  col: 0,
  colgroup: 0,
  dd: 1,
  del: 1,
  dl: 1,
  dt: 1,
  div: 1,
  em: 1,
  fieldset: 0,
  font: 1,
  h1: 0,
  h2: 0,
  h3: 0,
  h4: 0,
  h5: 0,
  h6: 0,
  hr: 0,
  i: 1,
  img: 1,
  ins: 1,
  label: 1,
  legend: 0,
  li: 0,
  ol: 0,
  p: 1,
  q: 1,
  source: 0,
  span: 1,
  strong: 1,
  sub: 0,
  sup: 0,
  table: 0,
  tbody: 0,
  td: 0,
  tfoot: 0,
  th: 0,
  thead: 0,
  tr: 0,
  u: 1,
  ul: 0,
  video: 1 };

var blockTag = {
  address: true,
  article: true,
  aside: true,
  body: true,
  center: true,
  cite: true,
  footer: true,
  header: true,
  html: true,
  nav: true,
  pre: true,
  section: true };

var ignoreTag = {
  area: true,
  base: true,
  basefont: true,
  canvas: true,
  circle: true,
  command: true,
  ellipse: true,
  embed: true,
  frame: true,
  head: true,
  iframe: true,
  input: true,
  isindex: true,
  keygen: true,
  line: true,
  link: true,
  map: true,
  meta: true,
  param: true,
  path: true,
  polygon: true,
  polyline: true,
  rect: true,
  script: true,
  stop: true,
  textarea: true,
  title: true,
  track: true,
  use: true,
  wbr: true };


if (CanIUse) {
  trustTag.bdi = 0;
  trustTag.bdo = 0;
  trustTag.caption = 0;
  trustTag.rt = 0;
  trustTag.ruby = 0;
  ignoreTag.rp = true;
  trustTag.big = 1;
  trustTag.small = 1;
  trustTag.pre = 0;
  delete blockTag.pre;
} else blockTag.caption = true;


function randomId() {
  var res = "";
  for (var i = 0; i < 5; i++) {
    var rand = parseInt(Math.random() * 52);
    if (rand < 26)
    res = res + String.fromCharCode(65 + rand);else

    res = res + String.fromCharCode(71 + rand);
  }
  return res;
}

function DomHandler(style) {var tagStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};var imgMode = arguments.length > 2 ? arguments[2] : undefined;
  this.imgList = [];
  this.imgIndex = 0;
  this.nodes = [];
  this.title = "";
  this._CssHandler = new CssHandler(style, tagStyle);
  this._tagStack = [];
  this._videoNum = 0;



  this._whiteSpace = false;
}
DomHandler.prototype._addDomElement = function (element) {
  if (element.name == 'pre' || element.attrs && /white-space\s*:\s*pre/.test(element.attrs.style)) {
    this._whiteSpace = true;
    element.pre = true;
  }
  var parent = this._tagStack[this._tagStack.length - 1];
  var siblings = parent ? parent.children : this.nodes;
  siblings.push(element);
};
DomHandler.prototype._bubbling = function () {
  for (var i = this._tagStack.length - 1; i >= 0; i--) {
    if (trustTag[this._tagStack[i].name])
    this._tagStack[i].continue = true;else

    return this._tagStack[i].name;
  }
};
DomHandler.prototype.onopentag = function (name, attrs) {
  var element = {
    children: [] };

  var matched = this._CssHandler.match(name, attrs, element);
  //处理属性
  switch (name) {
    case 'div':
    case 'p':
      if (attrs.align) {
        attrs.style += ';text-align:' + attrs.align;
        delete attrs.align;
      }
      break;
    case 'img':
      if (attrs.width) {
        attrs.style = 'width:' + attrs.width + (/[0-9]/.test(attrs.width[attrs.width.length - 1]) ? 'px' : '') + ';' +
        attrs.style;
        delete attrs.width;
      }
      if (attrs['data-src']) {
        attrs.src = attrs.src || attrs['data-src'];
        delete attrs['data-src'];
      }
      if (!attrs.hasOwnProperty('ignore') && attrs.src) {
        if (this.imgList.indexOf(attrs.src) != -1)
        attrs.src = attrs.src + "?index=" + this.imgIndex++;
        this.imgList.push(attrs.src);
        if (this._bubbling() == 'a') attrs.ignore = "true"; // 图片在链接中不可预览
      } else
      attrs.ignore = "true";



      break;
    case 'font':
      name = 'span';
      if (attrs.color) {
        attrs.style += ';color:' + attrs.color;
        delete attrs.color;
      }
      if (attrs.face) {
        attrs.style += ";font-family:" + attrs.face;
        delete attrs.face;
      }
      if (attrs.size) {
        var size = parseInt(attrs.size);
        if (size < 1) size = 1;else
        if (size > 7) size = 7;
        var map = [10, 13, 16, 18, 24, 32, 48];
        attrs.style += ";font-size:" + map[size - 1] + "px";
        delete attrs.size;
      }
      break;
    case 'a':
    case 'ad':
      this._bubbling();
      break;
    case 'video':
    case 'audio':
      attrs.loop = attrs.hasOwnProperty('loop');
      attrs.controls = attrs.hasOwnProperty('controls');
      attrs.autoplay = attrs.hasOwnProperty('autoplay');
      if (name == 'video') {
        attrs.muted = attrs.hasOwnProperty('muted');
        if (attrs.width) {
          attrs.style = 'width:' + parseFloat(attrs.width) + 'px;' + attrs.style;
          delete attrs.width;
        }
        if (attrs.height) {
          attrs.style = 'height:' + parseFloat(attrs.height) + 'px;' + attrs.style;
          delete attrs.height;
        }
      }
      attrs.id = randomId() + (name == 'video' ? ++this._videoNum : '');
      attrs.source = [];
      if (attrs.src) attrs.source.push(attrs.src);
      if (!attrs.controls && !attrs.autoplay)
      console.warn('存在没有controls属性的' + name + '标签，可能导致无法播放', attrs);
      this._bubbling();
      break;
    case 'source':
      var parent = this._tagStack[this._tagStack.length - 1];
      if (parent && (parent.name == 'video' || parent.name == 'audio')) {
        parent.attrs.source.push(attrs.src);
        if (!parent.attrs.src) parent.attrs.src = attrs.src;
      }
      this._tagStack.push(element);
      return;}

  attrs.style = matched + attrs.style;
  if (blockTag[name]) name = 'div';else
  if (!trustTag.hasOwnProperty(name)) name = 'span';
  element.name = name;
  element.attrs = attrs;
  this._addDomElement(element);
  this._tagStack.push(element);
};
DomHandler.prototype.ontext = function (data) {
  if (!this._whiteSpace) {
    if (!/\S/.test(data))
    return;
    data = data.replace(/\s+/g, " ");
  }






































  var element = {
    type: 'text' };


  data = data.replace(/&nbsp;/g, "\xA0"); // 解决连续&nbsp;失效问题
  if (/&#*((?!sp|lt|gt).){2,8};/.test(data)) element.decode = true;

  if (emoji) data = emoji.parseEmoji(data);
  element.text = data;
  this._addDomElement(element);
};
DomHandler.prototype.onclosetag = function (name) {
  var element = this._tagStack.pop();
  var parent = this._tagStack.length ? this._tagStack[this._tagStack.length - 1].children : this.nodes;
  if (ignoreTag[name]) {
    if (name == 'title') {
      try {
        this.title = element.children[0].text;
      } catch (e) {}
    }
    parent.pop();
  }
  // 合并一些不必要的层，减小节点深度
  if (element.children.length == 1 && element.name == 'div') {
    var child = element.children[0];
    if (child.name == 'div' && !/padding/.test(element.attrs.style) && !(/margin/.test(element.attrs.style) &&
    /margin/.test(child.attrs.style)) && !/display/.test(element.attrs.style) && !/display/.test(child.attrs.style) &&
    !(element.attrs.id && child.attrs.id) && !(element.attrs.class && child.attrs.class)) {
      if (/padding/.test(child.attrs.style))
      child.attrs.style = ";box-sizing:border-box;" + child.attrs.style;
      child.attrs.style = element.attrs.style + ";" + child.attrs.style;
      child.attrs.id = (child.attrs.id || "") + (element.attrs.id || "");
      child.attrs.class = (child.attrs.class || "") + (element.attrs.class || "");
      parent[parent.indexOf(element)] = child;
    }
  }
  if (element.pre) {
    this._whiteSpace = false;var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = this._tagStack[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var ele = _step.value;
        if (ele.pre)
        this._whiteSpace = true;}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
    delete element.pre;
  }
  // 多层样式处理 
  if (this._CssHandler.pop)
  this._CssHandler.pop(element);
};
module.exports = DomHandler;

/***/ }),

/***/ 385:
/*!*********************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/components/jyf-Parser/CssHandler.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 //CssHandler.js

var CanIUse = __webpack_require__(/*! ./api.js */ 386).versionHigherThan('2.7.1');

function CssHandler(style, tagStyle) {
  this._style = new CssTokenizer(style, tagStyle).parse();
}
CssHandler.prototype.match = function (name, attrs) {
  var matched = this._style[name] ? this._style[name] + ';' : '';
  if (attrs.id)
  matched += this._style['#' + attrs.id] ? this._style['#' + attrs.id] + ';' : '';
  if (attrs.class) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
      for (var _iterator = attrs.class.split(' ')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var Class = _step.value;
        matched += this._style['.' + Class] ? this._style['.' + Class] + ';' : '';}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator.return != null) {_iterator.return();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}
  return matched;
};

function CssTokenizer() {var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';var tagStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  this.res = this.initClass(tagStyle);
  this._state = "SPACE";
  this._buffer = style;
  this._sectionStart = 0;
  this._index = 0;
  this._name = '';
  this._content = '';
  this._list = [];
  this._comma = false;
}
CssTokenizer.prototype.initClass = function (tagStyle) {
  var initStyle = JSON.parse(JSON.stringify(tagStyle));
  initStyle.a = "display:inline;color:#366092;word-break:break-all;" + (initStyle.a || "");
  initStyle.address = "font-style:italic;" + (initStyle.address || "");
  initStyle.blockquote = initStyle.blockquote ||
  'background-color:#f6f6f6;border-left:3px solid #dbdbdb;color:#6c6c6c;padding:5px 0 5px 10px;';
  initStyle.center = 'text-align:center;' + (initStyle.center || "");
  initStyle.cite = "font-style:italic;" + (initStyle.cite || "");
  initStyle.code = initStyle.code ||
  'padding:0 1px 0 1px;margin-left:2px;margin-right:2px;background-color:#f8f8f8;border:1px solid #cccccc;border-radius:3px;';
  initStyle.dd = "margin-left:40px;" + (initStyle.dd || "");
  initStyle.img = "max-width:100%;" + (initStyle.img || "");
  initStyle.mark = "display:inline;background-color:yellow;" + (initStyle.mark || "");
  initStyle.pre = "overflow:scroll;" + (initStyle.pre || 'background-color:#f6f8fa;padding:5px;border-radius:5px;');
  initStyle.s = "display:inline;text-decoration:line-through;" + (initStyle.s || "");
  initStyle.u = "display:inline;text-decoration:underline;" + (initStyle.u || "");

  //低版本兼容
  if (!CanIUse) {

    initStyle.big = "display:inline;font-size:1.2em;" + (initStyle.big || "");
    initStyle.small = "display:inline;font-size:0.8em;" + (initStyle.small || "");
    initStyle.pre = "font-family:monospace;white-space:pre;" + initStyle.pre;

  }

  return initStyle;
};
CssTokenizer.prototype.SPACE = function (c) {
  if (/[a-zA-Z.#]/.test(c)) {
    this._sectionStart = this._index;
    this._state = "InName";
  } else if (c == '@') this._state = "Ignore1";else
  if (c == '/') this._state = "BeforeComment";
};
CssTokenizer.prototype.BeforeComment = function (c) {
  if (c == '*') this._state = "InComment";else
  {
    this._index--;
    this._state = "SPACE";
  }
};
CssTokenizer.prototype.InComment = function (c) {
  if (c == '*') this._state = "AfterComment";
};
CssTokenizer.prototype.AfterComment = function (c) {
  if (c == '/') this._state = "SPACE";else
  {
    this._index--;
    this._state = "InComment";
  }
};
CssTokenizer.prototype.InName = function (c) {
  if (c == '{') {
    this._list.push(this._buffer.substring(this._sectionStart, this._index));
    this._sectionStart = this._index + 1;
    this._state = "InContent";
  } else if (c == ',') {
    this._list.push(this._buffer.substring(this._sectionStart, this._index));
    this._sectionStart = this._index + 1;
    this._comma = true;
  } else if ((c == '.' || c == '#') && !this._comma) {
    this._buffer = this._buffer.splice(this._index, 1, ' ');
  } else if (/\s/.test(c)) {
    this._name = this._buffer.substring(this._sectionStart, this._index);
    this._state = "NameSpace";
  } else if (/[>:\[]/.test(c)) {
    if (this._list.length) this._state = "IgnoreName";else
    this._state = "Ignore1";
  } else this._comma = false;
};
CssTokenizer.prototype.NameSpace = function (c) {
  if (c == '{') {
    this._list.push(this._name);
    this._sectionStart = this._index + 1;
    this._state = "InContent";
  } else if (c == ',') {
    this._comma = true;
    this._list.push(this._name);
    this._sectionStart = this._index + 1;
    this._state = "InName";
  } else if (/\S/.test(c)) {
    if (this._comma) {
      this._sectionStart = this._index;
      this._index--;
      this._state = "InName";
    } else if (this._list.length) this._state = "IgnoreName";else
    this._state = "Ignore1";
  }
};
CssTokenizer.prototype.InContent = function (c) {
  if (c == '}') {
    this._content = this._buffer.substring(this._sectionStart, this._index);var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
      for (var _iterator2 = this._list[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var item = _step2.value;
        this.res[item] = (this.res[item] || '') + ";" + this._content;}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2.return != null) {_iterator2.return();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
    this._list = [];
    this._comma = false;
    this._state = "SPACE";
  }
};
CssTokenizer.prototype.IgnoreName = function (c) {
  if (c == ',') {
    this._sectionStart = this._index + 1;
    this._state = "InName";
  } else if (c == '{') {
    this._sectionStart = this._index + 1;
    this._state = "InContent";
  }
};
CssTokenizer.prototype.Ignore1 = function (c) {
  if (c == ';') {
    this._state = "SPACE";
    this._sectionStart = this._index + 1;
  } else if (c == '{') this._state = "Ignore2";
};
CssTokenizer.prototype.Ignore2 = function (c) {
  if (c == '}') {
    this._state = "SPACE";
    this._sectionStart = this._index + 1;
  } else if (c == '{') this._state = "Ignore3";
};
CssTokenizer.prototype.Ignore3 = function (c) {
  if (c == '}') this._state = "Ignore2";
};
CssTokenizer.prototype.parse = function () {
  for (; this._index < this._buffer.length; this._index++) {
    this[this._state](this._buffer[this._index]);}
  return this.res;
};
module.exports = CssHandler;

/***/ }),

/***/ 386:
/*!**************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/components/jyf-Parser/api.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {String.prototype.splice = function () {var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;var deleteCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;var addStr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  if (start < 0) start = this.length + start;
  if (deleteCount < 0) deleteCount = 0;
  return this.substring(0, start) + addStr + this.substring(start + deleteCount);
};

var SDKVersion = uni.getSystemInfoSync().SDKVersion;

module.exports = {

  versionHigherThan: function versionHigherThan() {var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var v1 = SDKVersion.split('.');
    var v2 = version.split('.');
    var len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }
    for (var i = 0; i < len; i++) {
      var num1 = parseInt(v1[i]);
      var num2 = parseInt(v2[i]);
      if (num1 > num2) {
        return true;
      } else if (num1 < num2) {
        return false;
      }
    }
    return true;
  },

  html2nodes: function html2nodes(html, tagStyle) {
    var Parser = __webpack_require__(/*! ./Parser.js */ 382);
    return Parser(html, tagStyle);
  },
  css2object: function css2object(style, tagStyle) {
    var CssHandler = __webpack_require__(/*! ./CssHandler.js */ 385);
    return new CssHandler(style, tagStyle)._style;
  } };
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 4:
/*!********************************************!*\
  !*** C:/Users/Admin/Desktop/归档/pages.json ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25120200103005","_inBundle":false,"_integrity":"sha512-nYoIrRV2e5o/vzr6foSdWi3Rl2p0GuO+LPY3JctyY6uTKgPnuH99d7aL/QQdJ1SacQjBWO+QGK1qankN7oyrWw==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25120200103005.tgz","_shasum":"a77a63481f36474f3e86686868051219d1bb12df","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"6be187a3dfe15f95dd6146d9fec08e1f81100987","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25120200103005"};

/***/ }),

/***/ 7:
/*!*************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/pages.json?{"type":"style"} ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "军优创就业" }, "pages/login/wx": { "navigationBarTitleText": "授权登陆" }, "pages/login/app": { "navigationBarTitleText": "", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" }, "pages/login/forget": { "navigationBarTitleText": "", "navigationBarBackgroundColor": "#F8F8F8", "backgroundColor": "#F8F8F8" }, "pages/job/index": { "navigationBarTitleText": "热招职位", "enablePullDownRefresh": true }, "pages/job/detail": { "navigationBarTitleText": "职位详情" }, "pages/job/apply": { "navigationBarTitleText": "申请记录", "enablePullDownRefresh": true }, "pages/job/invite": { "navigationBarTitleText": "面试邀请" }, "pages/job/collection": { "navigationBarTitleText": "收藏记录", "enablePullDownRefresh": true }, "pages/company/index": { "navigationBarTitleText": "拥军企业", "enablePullDownRefresh": true }, "pages/training/detail": { "navigationBarTitleText": "培训详情" }, "pages/training/index": { "navigationBarTitleText": "教育培训", "enablePullDownRefresh": true }, "pages/training/apply": { "navigationBarTitleText": "培训报名记录", "enablePullDownRefresh": true }, "pages/my/index": { "navigationBarTitleText": "个人中心" }, "pages/my/ac": { "navigationBarTitleText": "军人认证", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/my/update": { "navigationBarTitleText": "账号与安全", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/my/security": { "navigationBarTitleText": "账号与安全", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/record/index": { "navigationBarTitleText": "投递反馈", "enablePullDownRefresh": true }, "pages/article/new": { "navigationBarTitleText": "新闻动态", "enablePullDownRefresh": true }, "pages/article/policy": { "navigationBarTitleText": "最新政策", "enablePullDownRefresh": true }, "pages/article/strategy": { "navigationBarTitleText": "求职攻略", "enablePullDownRefresh": true }, "pages/article/help": { "navigationBarTitleText": "帮助中心", "enablePullDownRefresh": true }, "pages/article/detail": { "navigationBarTitleText": "文章详细", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/resume/index": { "navigationBarTitleText": "简历", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/resume/preview": { "navigationBarTitleText": "预览" }, "pages/resume/basic": { "navigationBarTitleText": "基本信息", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/resume/pref": { "navigationBarTitleText": "求职意向", "navigationBarTextStyle": "white", "navigationBarBackgroundColor": "#387ef5" }, "pages/resume/work/index": { "navigationBarTitleText": "工作经验" }, "pages/resume/work/add": { "navigationBarTitleText": "新增工作经验" }, "pages/resume/work/detail": { "navigationBarTitleText": "修改工作经验" }, "pages/resume/project/index": { "navigationBarTitleText": "项目经验" }, "pages/resume/project/add": { "navigationBarTitleText": "新增项目经验" }, "pages/resume/project/detail": { "navigationBarTitleText": "修改项目经验" }, "pages/resume/edu/index": { "navigationBarTitleText": "教育经历" }, "pages/resume/edu/add": { "navigationBarTitleText": "新增教育经历" }, "pages/resume/edu/detail": { "navigationBarTitleText": "修改教育经历" }, "pages/resume/honor/index": { "navigationBarTitleText": "军旅荣誉" }, "pages/resume/honor/add": { "navigationBarTitleText": "新增军旅荣誉" }, "pages/resume/honor/detail": { "navigationBarTitleText": "修改军旅荣誉" }, "pages/resume/setting": { "navigationBarTitleText": "简历设置" }, "pages/company/detail": { "navigationBarTitleText": "企业介绍", "enablePullDownRefresh": true }, "pages/company/focus": { "navigationBarTitleText": "关注企业", "enablePullDownRefresh": true } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "军优创就业", "navigationBarBackgroundColor": "#fff", "backgroundColor": "#F8F8F8" } };exports.default = _default;

/***/ }),

/***/ 71:
/*!********************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/publish.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  text: '24小时内',
  id: 1 },

{
  text: '近三天',
  id: 3 },

{
  text: '近一周',
  id: 7 },

{
  text: '近一月',
  id: 30 },

{
  text: '不限',
  id: 0 }];exports.default = _default;

/***/ }),

/***/ 72:
/*!*********************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/industry.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  text: '互联网/IT/电子/通信',
  id: '101',
  children: [{
    text: '计算机软件',
    id: '1' },

  {
    text: '计算机硬件',
    id: '2' },

  {
    text: '企业服务',
    id: '3' },

  {
    text: '人工智能',
    id: '4' },

  {
    text: '通信/网络设备',
    id: '5' },

  {
    text: '网络/信息安全',
    id: '6' },

  {
    text: '新媒体',
    id: '7' },

  {
    text: '游戏',
    id: '8' },

  {
    text: '云计算/大数据',
    id: '9' }] },



{
  text: '房地产',
  id: '102',
  children: [{
    text: '房地产开发与经营',
    id: '10' },

  {
    text: '房地产中介',
    id: '11' },

  {
    text: '土地与公共设施管理',
    id: '12' },

  {
    text: '物业服务',
    id: '13' }] },



{
  text: '金融业',
  id: '103',
  children: [{
    text: '保险业',
    id: '14' },

  {
    text: '典当',
    id: '15' },

  {
    text: '互联网金融/小额贷款',
    id: '16' },

  {
    text: '基金/风投',
    id: '17' },

  {
    text: '汽车金融服务',
    id: '18' },

  {
    text: '信托投资',
    id: '19' },

  {
    text: '银行',
    id: '20' },

  {
    text: '证券/期货',
    id: '21' }] },



{
  text: '建筑业',
  id: '104',
  children: [{
    text: '房屋建筑/建筑设备安装',
    id: '22' },

  {
    text: '公共建筑装饰装修',
    id: '23' },

  {
    text: '土木工程建筑',
    id: '24' },

  {
    text: '住宅装饰装修',
    id: '25' }] },



{
  text: '制造业',
  id: '105',
  children: [{
    text: '船舶/航空/航天/火车制造',
    id: '26' },

  {
    text: '电气机械/器材制造',
    id: '27' },

  {
    text: '电子设备制造',
    id: '28' },

  {
    text: '纺织业/服饰产品加工制造',
    id: '29' },

  {
    text: '非金属矿物制品业',
    id: '30' },

  {
    text: '钢铁和有色金属冶炼及加工',
    id: '31' },

  {
    text: '化学纤维制造业',
    id: '32' },

  {
    text: '化学原来/化学制品',
    id: '33' },

  {
    text: '金属制品业',
    id: '34' },

  {
    text: '农副产品加工制造',
    id: '35' },

  {
    text: '汽车制造',
    id: '36' },

  {
    text: '燃料资源加工制造',
    id: '37' },

  {
    text: '日化产品制造',
    id: '38' },

  {
    text: '通用设备制造',
    id: '39' },

  {
    text: '橡胶和塑料制品',
    id: '40' },

  {
    text: '医药制造',
    id: '41' },

  {
    text: '仪器仪表制造',
    id: '42' },

  {
    text: '印刷/文体用品制造',
    id: '43' },

  {
    text: '造纸/家具制造',
    id: '44' },

  {
    text: '专用设备制造',
    id: '45' },

  {
    text: '医疗设备/器械',
    id: '46' }] },



{
  text: '农林牧渔',
  id: '106',
  children: [{
    text: '农林牧渔',
    id: '47' }] },


{
  text: '批发/零售/贸易',
  id: '107',
  children: [{
    text: '快速消费品',
    id: '48' },
  {
    text: '贸易/进出口代理/拍卖',
    id: '49' },
  {
    text: '耐用消费品',
    id: '50' },
  {
    text: '零售/皮肤',
    id: '51' }] },


{
  text: '专业服务',
  id: '108',
  children: [{
    text: '财务/审计/税务',
    id: '52' },
  {
    text: '法律服务',
    id: '53' },
  {
    text: '工程技术与设计服务',
    id: '54' },
  {
    text: '广告业',
    id: '55' },
  {
    text: '会议/展览服务',
    id: '56' },
  {
    text: '检测/认证',
    id: '57' },
  {
    text: '景区/商业/市场等综合管理',
    id: '58' },
  {
    text: '人力资源服务',
    id: '59' },
  {
    text: '商业代理服务',
    id: '60' },
  {
    text: '专利/商标/知识产权',
    id: '61' },
  {
    text: '专业技术服务',
    id: '62' },
  {
    text: '咨询服务',
    id: '63' },
  {
    text: '租聘服务',
    id: '64' }] },


{
  text: '文化/体育/娱乐',
  id: '109',
  children: [{
    text: '广播/电视/电影/录音制作',
    id: '65' },
  {
    text: '体育',
    id: '66' },
  {
    text: '文化艺术/娱乐',
    id: '67' },
  {
    text: '新闻/出版',
    id: '68' }] },


{
  text: '交通运输/仓储/物流',
  id: '110',
  children: [{
    text: '火车站/港口/汽车站/路政',
    id: '69' },
  {
    text: '货运/物流仓储',
    id: '70' },
  {
    text: '民航/铁路/公路/水路客运',
    id: '71' },
  {
    text: '邮政/快递',
    id: '72' }] },


{
  text: '能源/环保/矿产',
  id: '111',
  children: [{
    text: '电力/水利/热力/燃气',
    id: '73' },
  {
    text: '环保',
    id: '74' },
  {
    text: '矿产/采掘',
    id: '75' },
  {
    text: '石油/石化',
    id: '76' },
  {
    text: '新能源',
    id: '77' }] },


{
  text: '教育培训/科研',
  id: '112',
  children: [{
    text: '科学技术推广服务业',
    id: '78' },
  {
    text: '培训/课外教育/教育辅助',
    id: '79' },
  {
    text: '学术/科研',
    id: '80' },
  {
    text: '学校教育',
    id: '81' }] },


{
  text: '卫生及社会工作',
  id: '113',
  children: [{
    text: '卫生服务',
    id: '82' },
  {
    text: '养老/孤儿/看护等社会服务',
    id: '83' },
  {
    text: '医院',
    id: '84' }] },


{
  text: '公共管理/社会保障',
  id: '114',
  children: [{
    text: '国家机构',
    id: '85' },
  {
    text: '社团/组织/社会保障',
    id: '86' }] },


{
  text: '生活服务',
  id: '115',
  children: [{
    text: '餐饮业',
    id: '87' },
  {
    text: '酒店/民宿',
    id: '88' },
  {
    text: '居民服务',
    id: '89' },
  {
    text: '旅游业',
    id: '90' }] }];exports.default = _default;

/***/ }),

/***/ 73:
/*!**********************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/schooling.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  text: '初中及以下',
  id: 1 },
{
  text: '高中/中技/中专',
  id: 2 },
{
  text: '大专',
  id: 3 },
{
  text: '本科',
  id: 4 },
{
  text: '硕士',
  id: 5 },
{
  text: '博士',
  id: 6 },
{
  text: '不限',
  id: 0 }];exports.default = _default;

/***/ }),

/***/ 74:
/*!********************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/working.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  text: '无经验',
  id: 1 },
{
  text: '1-3年',
  id: 2 },
{
  text: '3-5年',
  id: 3 },
{
  text: '5-10年',
  id: 4 },
{
  text: '10年以上',
  id: 5 },
{
  text: '不限',
  id: 0 }];exports.default = _default;

/***/ }),

/***/ 75:
/*!*******************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/nature.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  text: '国企',
  id: '1' },
{
  text: '外资（欧美）',
  id: '2' },
{
  text: '外资（非欧美）',
  id: '3' },
{
  text: '上市公司',
  id: '4' },
{
  text: '合资',
  id: '5' },
{
  text: '民营公司',
  id: '6' },
{
  text: '外企代表处',
  id: '7' },
{
  text: '政府机关',
  id: '8' },
{
  text: '事业单位',
  id: '9' },
{
  text: '非营利组织',
  id: '10' },
{
  text: '创业公司',
  id: '11' },
{
  text: '不限',
  id: '0' }];exports.default = _default;

/***/ }),

/***/ 76:
/*!*****************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/utils/items/size.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = [{
  text: '少于50人',
  id: '1' },
{
  text: '50-150人',
  id: '2' },
{
  text: '150-500人',
  id: '3' },
{
  text: '500-1000人',
  id: '4' },
{
  text: '1000-5000人',
  id: '5' },
{
  text: '5000-10000人',
  id: '6' },
{
  text: '10000人以上',
  id: '7' },
{
  text: '不限',
  id: '0' }];exports.default = _default;

/***/ }),

/***/ 8:
/*!************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/pages.json?{"type":"stat"} ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "__UNI__4F0801A" };exports.default = _default;

/***/ }),

/***/ 85:
/*!**************************************************************!*\
  !*** C:/Users/Admin/Desktop/归档/common/qqmap-wx-jssdk.min.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var ERROR_CONF = { KEY_ERR: 311, KEY_ERR_MSG: 'key格式错误', PARAM_ERR: 310, PARAM_ERR_MSG: '请求参数信息有误', SYSTEM_ERR: 600, SYSTEM_ERR_MSG: '系统错误', WX_ERR_CODE: 1000, WX_OK_CODE: 200 };var BASE_URL = 'https://apis.map.qq.com/ws/';var URL_SEARCH = BASE_URL + 'place/v1/search';var URL_SUGGESTION = BASE_URL + 'place/v1/suggestion';var URL_GET_GEOCODER = BASE_URL + 'geocoder/v1/';var URL_CITY_LIST = BASE_URL + 'district/v1/list';var URL_AREA_LIST = BASE_URL + 'district/v1/getchildren';var URL_DISTANCE = BASE_URL + 'distance/v1/';var URL_DIRECTION = BASE_URL + 'direction/v1/';var MODE = { driving: 'driving', transit: 'transit' };var EARTH_RADIUS = 6378136.49;var Utils = { safeAdd: function safeAdd(x, y) {var lsw = (x & 0xffff) + (y & 0xffff);var msw = (x >> 16) + (y >> 16) + (lsw >> 16);return msw << 16 | lsw & 0xffff;}, bitRotateLeft: function bitRotateLeft(num, cnt) {return num << cnt | num >>> 32 - cnt;}, md5cmn: function md5cmn(q, a, b, x, s, t) {return this.safeAdd(this.bitRotateLeft(this.safeAdd(this.safeAdd(a, q), this.safeAdd(x, t)), s), b);}, md5ff: function md5ff(a, b, c, d, x, s, t) {return this.md5cmn(b & c | ~b & d, a, b, x, s, t);}, md5gg: function md5gg(a, b, c, d, x, s, t) {return this.md5cmn(b & d | c & ~d, a, b, x, s, t);}, md5hh: function md5hh(a, b, c, d, x, s, t) {return this.md5cmn(b ^ c ^ d, a, b, x, s, t);}, md5ii: function md5ii(a, b, c, d, x, s, t) {return this.md5cmn(c ^ (b | ~d), a, b, x, s, t);}, binlMD5: function binlMD5(x, len) {x[len >> 5] |= 0x80 << len % 32;x[(len + 64 >>> 9 << 4) + 14] = len;var i;var olda;var oldb;var oldc;var oldd;var a = 1732584193;var b = -271733879;var c = -1732584194;var d = 271733878;for (i = 0; i < x.length; i += 16) {olda = a;oldb = b;oldc = c;oldd = d;a = this.md5ff(a, b, c, d, x[i], 7, -680876936);d = this.md5ff(d, a, b, c, x[i + 1], 12, -389564586);c = this.md5ff(c, d, a, b, x[i + 2], 17, 606105819);b = this.md5ff(b, c, d, a, x[i + 3], 22, -1044525330);a = this.md5ff(a, b, c, d, x[i + 4], 7, -176418897);d = this.md5ff(d, a, b, c, x[i + 5], 12, 1200080426);c = this.md5ff(c, d, a, b, x[i + 6], 17, -1473231341);b = this.md5ff(b, c, d, a, x[i + 7], 22, -45705983);a = this.md5ff(a, b, c, d, x[i + 8], 7, 1770035416);d = this.md5ff(d, a, b, c, x[i + 9], 12, -1958414417);c = this.md5ff(c, d, a, b, x[i + 10], 17, -42063);b = this.md5ff(b, c, d, a, x[i + 11], 22, -1990404162);a = this.md5ff(a, b, c, d, x[i + 12], 7, 1804603682);d = this.md5ff(d, a, b, c, x[i + 13], 12, -40341101);c = this.md5ff(c, d, a, b, x[i + 14], 17, -1502002290);b = this.md5ff(b, c, d, a, x[i + 15], 22, 1236535329);a = this.md5gg(a, b, c, d, x[i + 1], 5, -165796510);d = this.md5gg(d, a, b, c, x[i + 6], 9, -1069501632);c = this.md5gg(c, d, a, b, x[i + 11], 14, 643717713);b = this.md5gg(b, c, d, a, x[i], 20, -373897302);a = this.md5gg(a, b, c, d, x[i + 5], 5, -701558691);d = this.md5gg(d, a, b, c, x[i + 10], 9, 38016083);c = this.md5gg(c, d, a, b, x[i + 15], 14, -660478335);b = this.md5gg(b, c, d, a, x[i + 4], 20, -405537848);a = this.md5gg(a, b, c, d, x[i + 9], 5, 568446438);d = this.md5gg(d, a, b, c, x[i + 14], 9, -1019803690);c = this.md5gg(c, d, a, b, x[i + 3], 14, -187363961);b = this.md5gg(b, c, d, a, x[i + 8], 20, 1163531501);a = this.md5gg(a, b, c, d, x[i + 13], 5, -1444681467);d = this.md5gg(d, a, b, c, x[i + 2], 9, -51403784);c = this.md5gg(c, d, a, b, x[i + 7], 14, 1735328473);b = this.md5gg(b, c, d, a, x[i + 12], 20, -1926607734);a = this.md5hh(a, b, c, d, x[i + 5], 4, -378558);d = this.md5hh(d, a, b, c, x[i + 8], 11, -2022574463);c = this.md5hh(c, d, a, b, x[i + 11], 16, 1839030562);b = this.md5hh(b, c, d, a, x[i + 14], 23, -35309556);a = this.md5hh(a, b, c, d, x[i + 1], 4, -1530992060);d = this.md5hh(d, a, b, c, x[i + 4], 11, 1272893353);c = this.md5hh(c, d, a, b, x[i + 7], 16, -155497632);b = this.md5hh(b, c, d, a, x[i + 10], 23, -1094730640);a = this.md5hh(a, b, c, d, x[i + 13], 4, 681279174);d = this.md5hh(d, a, b, c, x[i], 11, -358537222);c = this.md5hh(c, d, a, b, x[i + 3], 16, -722521979);b = this.md5hh(b, c, d, a, x[i + 6], 23, 76029189);a = this.md5hh(a, b, c, d, x[i + 9], 4, -640364487);d = this.md5hh(d, a, b, c, x[i + 12], 11, -421815835);c = this.md5hh(c, d, a, b, x[i + 15], 16, 530742520);b = this.md5hh(b, c, d, a, x[i + 2], 23, -995338651);a = this.md5ii(a, b, c, d, x[i], 6, -198630844);d = this.md5ii(d, a, b, c, x[i + 7], 10, 1126891415);c = this.md5ii(c, d, a, b, x[i + 14], 15, -1416354905);b = this.md5ii(b, c, d, a, x[i + 5], 21, -57434055);a = this.md5ii(a, b, c, d, x[i + 12], 6, 1700485571);d = this.md5ii(d, a, b, c, x[i + 3], 10, -1894986606);c = this.md5ii(c, d, a, b, x[i + 10], 15, -1051523);b = this.md5ii(b, c, d, a, x[i + 1], 21, -2054922799);a = this.md5ii(a, b, c, d, x[i + 8], 6, 1873313359);d = this.md5ii(d, a, b, c, x[i + 15], 10, -30611744);c = this.md5ii(c, d, a, b, x[i + 6], 15, -1560198380);b = this.md5ii(b, c, d, a, x[i + 13], 21, 1309151649);a = this.md5ii(a, b, c, d, x[i + 4], 6, -145523070);d = this.md5ii(d, a, b, c, x[i + 11], 10, -1120210379);c = this.md5ii(c, d, a, b, x[i + 2], 15, 718787259);b = this.md5ii(b, c, d, a, x[i + 9], 21, -343485551);a = this.safeAdd(a, olda);b = this.safeAdd(b, oldb);c = this.safeAdd(c, oldc);d = this.safeAdd(d, oldd);}return [a, b, c, d];}, binl2rstr: function binl2rstr(input) {var i;var output = '';var length32 = input.length * 32;for (i = 0; i < length32; i += 8) {output += String.fromCharCode(input[i >> 5] >>> i % 32 & 0xff);}return output;}, rstr2binl: function rstr2binl(input) {var i;var output = [];output[(input.length >> 2) - 1] = undefined;for (i = 0; i < output.length; i += 1) {output[i] = 0;}var length8 = input.length * 8;for (i = 0; i < length8; i += 8) {output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << i % 32;}return output;}, rstrMD5: function rstrMD5(s) {return this.binl2rstr(this.binlMD5(this.rstr2binl(s), s.length * 8));}, rstrHMACMD5: function rstrHMACMD5(key, data) {var i;var bkey = this.rstr2binl(key);var ipad = [];var opad = [];var hash;ipad[15] = opad[15] = undefined;if (bkey.length > 16) {bkey = this.binlMD5(bkey, key.length * 8);}for (i = 0; i < 16; i += 1) {ipad[i] = bkey[i] ^ 0x36363636;opad[i] = bkey[i] ^ 0x5c5c5c5c;}hash = this.binlMD5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);return this.binl2rstr(this.binlMD5(opad.concat(hash), 512 + 128));}, rstr2hex: function rstr2hex(input) {var hexTab = '0123456789abcdef';var output = '';var x;var i;for (i = 0; i < input.length; i += 1) {x = input.charCodeAt(i);output += hexTab.charAt(x >>> 4 & 0x0f) + hexTab.charAt(x & 0x0f);}return output;}, str2rstrUTF8: function str2rstrUTF8(input) {return unescape(encodeURIComponent(input));}, rawMD5: function rawMD5(s) {return this.rstrMD5(this.str2rstrUTF8(s));}, hexMD5: function hexMD5(s) {return this.rstr2hex(this.rawMD5(s));}, rawHMACMD5: function rawHMACMD5(k, d) {return this.rstrHMACMD5(this.str2rstrUTF8(k), str2rstrUTF8(d));}, hexHMACMD5: function hexHMACMD5(k, d) {return this.rstr2hex(this.rawHMACMD5(k, d));}, md5: function md5(string, key, raw) {if (!key) {if (!raw) {return this.hexMD5(string);}return this.rawMD5(string);}if (!raw) {return this.hexHMACMD5(key, string);}return this.rawHMACMD5(key, string);}, getSig: function getSig(requestParam, sk, feature, mode) {var sig = null;var requestArr = [];Object.keys(requestParam).sort().forEach(function (key) {requestArr.push(key + '=' + requestParam[key]);});if (feature == 'search') {sig = '/ws/place/v1/search?' + requestArr.join('&') + sk;}if (feature == 'suggest') {sig = '/ws/place/v1/suggestion?' + requestArr.join('&') + sk;}if (feature == 'reverseGeocoder') {sig = '/ws/geocoder/v1/?' + requestArr.join('&') + sk;}if (feature == 'geocoder') {sig = '/ws/geocoder/v1/?' + requestArr.join('&') + sk;}if (feature == 'getCityList') {sig = '/ws/district/v1/list?' + requestArr.join('&') + sk;}if (feature == 'getDistrictByCityId') {sig = '/ws/district/v1/getchildren?' + requestArr.join('&') + sk;}if (feature == 'calculateDistance') {sig = '/ws/distance/v1/?' + requestArr.join('&') + sk;}if (feature == 'direction') {sig = '/ws/direction/v1/' + mode + '?' + requestArr.join('&') + sk;}sig = this.md5(sig);return sig;}, location2query: function location2query(data) {if (typeof data == 'string') {return data;}var query = '';for (var i = 0; i < data.length; i++) {var d = data[i];if (!!query) {query += ';';}if (d.location) {query = query + d.location.lat + ',' + d.location.lng;}if (d.latitude && d.longitude) {query = query + d.latitude + ',' + d.longitude;}}return query;}, rad: function rad(d) {return d * Math.PI / 180.0;}, getEndLocation: function getEndLocation(location) {var to = location.split(';');var endLocation = [];for (var i = 0; i < to.length; i++) {endLocation.push({ lat: parseFloat(to[i].split(',')[0]), lng: parseFloat(to[i].split(',')[1]) });}return endLocation;}, getDistance: function getDistance(latFrom, lngFrom, latTo, lngTo) {var radLatFrom = this.rad(latFrom);var radLatTo = this.rad(latTo);var a = radLatFrom - radLatTo;var b = this.rad(lngFrom) - this.rad(lngTo);var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.pow(Math.sin(b / 2), 2)));distance = distance * EARTH_RADIUS;distance = Math.round(distance * 10000) / 10000;return parseFloat(distance.toFixed(0));}, getWXLocation: function getWXLocation(success, fail, complete) {wx.getLocation({ type: 'gcj02', success: success, fail: fail, complete: complete });}, getLocationParam: function getLocationParam(location) {if (typeof location == 'string') {var locationArr = location.split(',');if (locationArr.length === 2) {location = { latitude: location.split(',')[0], longitude: location.split(',')[1] };} else {location = {};}}return location;}, polyfillParam: function polyfillParam(param) {param.success = param.success || function () {};param.fail = param.fail || function () {};param.complete = param.complete || function () {};}, checkParamKeyEmpty: function checkParamKeyEmpty(param, key) {if (!param[key]) {var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + key + '参数格式有误');param.fail(errconf);param.complete(errconf);return true;}return false;}, checkKeyword: function checkKeyword(param) {return !this.checkParamKeyEmpty(param, 'keyword');}, checkLocation: function checkLocation(param) {var location = this.getLocationParam(param.location);if (!location || !location.latitude || !location.longitude) {var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误');param.fail(errconf);param.complete(errconf);return false;}return true;}, buildErrorConfig: function buildErrorConfig(errCode, errMsg) {return { status: errCode, message: errMsg };}, handleData: function handleData(param, data, feature) {if (feature == 'search') {var searchResult = data.data;var searchSimplify = [];for (var i = 0; i < searchResult.length; i++) {searchSimplify.push({ id: searchResult[i].id || null, title: searchResult[i].title || null, latitude: searchResult[i].location && searchResult[i].location.lat || null, longitude: searchResult[i].location && searchResult[i].location.lng || null, address: searchResult[i].address || null, category: searchResult[i].category || null, tel: searchResult[i].tel || null, adcode: searchResult[i].ad_info && searchResult[i].ad_info.adcode || null, city: searchResult[i].ad_info && searchResult[i].ad_info.city || null, district: searchResult[i].ad_info && searchResult[i].ad_info.district || null, province: searchResult[i].ad_info && searchResult[i].ad_info.province || null });}param.success(data, { searchResult: searchResult, searchSimplify: searchSimplify });} else if (feature == 'suggest') {var suggestResult = data.data;var suggestSimplify = [];for (var i = 0; i < suggestResult.length; i++) {suggestSimplify.push({ adcode: suggestResult[i].adcode || null, address: suggestResult[i].address || null, category: suggestResult[i].category || null, city: suggestResult[i].city || null, district: suggestResult[i].district || null, id: suggestResult[i].id || null, latitude: suggestResult[i].location && suggestResult[i].location.lat || null, longitude: suggestResult[i].location && suggestResult[i].location.lng || null, province: suggestResult[i].province || null, title: suggestResult[i].title || null, type: suggestResult[i].type || null });}param.success(data, { suggestResult: suggestResult, suggestSimplify: suggestSimplify });} else if (feature == 'reverseGeocoder') {var reverseGeocoderResult = data.result;var reverseGeocoderSimplify = { address: reverseGeocoderResult.address || null, latitude: reverseGeocoderResult.location && reverseGeocoderResult.location.lat || null, longitude: reverseGeocoderResult.location && reverseGeocoderResult.location.lng || null, adcode: reverseGeocoderResult.ad_info && reverseGeocoderResult.ad_info.adcode || null, city: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.city || null, district: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.district || null, nation: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.nation || null, province: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.province || null, street: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.street || null, street_number: reverseGeocoderResult.address_component && reverseGeocoderResult.address_component.street_number || null, recommend: reverseGeocoderResult.formatted_addresses && reverseGeocoderResult.formatted_addresses.recommend || null, rough: reverseGeocoderResult.formatted_addresses && reverseGeocoderResult.formatted_addresses.rough || null };if (reverseGeocoderResult.pois) {var pois = reverseGeocoderResult.pois;var poisSimplify = [];for (var i = 0; i < pois.length; i++) {poisSimplify.push({ id: pois[i].id || null, title: pois[i].title || null, latitude: pois[i].location && pois[i].location.lat || null, longitude: pois[i].location && pois[i].location.lng || null, address: pois[i].address || null, category: pois[i].category || null, adcode: pois[i].ad_info && pois[i].ad_info.adcode || null, city: pois[i].ad_info && pois[i].ad_info.city || null, district: pois[i].ad_info && pois[i].ad_info.district || null, province: pois[i].ad_info && pois[i].ad_info.province || null });}param.success(data, { reverseGeocoderResult: reverseGeocoderResult, reverseGeocoderSimplify: reverseGeocoderSimplify, pois: pois, poisSimplify: poisSimplify });} else {param.success(data, { reverseGeocoderResult: reverseGeocoderResult, reverseGeocoderSimplify: reverseGeocoderSimplify });}} else if (feature == 'geocoder') {var geocoderResult = data.result;var geocoderSimplify = { title: geocoderResult.title || null, latitude: geocoderResult.location && geocoderResult.location.lat || null, longitude: geocoderResult.location && geocoderResult.location.lng || null, adcode: geocoderResult.ad_info && geocoderResult.ad_info.adcode || null, province: geocoderResult.address_components && geocoderResult.address_components.province || null, city: geocoderResult.address_components && geocoderResult.address_components.city || null, district: geocoderResult.address_components && geocoderResult.address_components.district || null, street: geocoderResult.address_components && geocoderResult.address_components.street || null, street_number: geocoderResult.address_components && geocoderResult.address_components.street_number || null, level: geocoderResult.level || null };param.success(data, { geocoderResult: geocoderResult, geocoderSimplify: geocoderSimplify });} else if (feature == 'getCityList') {var provinceResult = data.result[0];var cityResult = data.result[1];var districtResult = data.result[2];param.success(data, { provinceResult: provinceResult, cityResult: cityResult, districtResult: districtResult });} else if (feature == 'getDistrictByCityId') {var districtByCity = data.result[0];param.success(data, districtByCity);} else if (feature == 'calculateDistance') {var calculateDistanceResult = data.result.elements;var distance = [];for (var i = 0; i < calculateDistanceResult.length; i++) {distance.push(calculateDistanceResult[i].distance);}param.success(data, { calculateDistanceResult: calculateDistanceResult, distance: distance });} else if (feature == 'direction') {var direction = data.result.routes;param.success(data, direction);} else {param.success(data);}}, buildWxRequestConfig: function buildWxRequestConfig(param, options, feature) {var that = this;options.header = { "content-type": "application/json" };options.method = 'GET';options.success = function (res) {var data = res.data;if (data.status === 0) {that.handleData(param, data, feature);} else {param.fail(data);}};options.fail = function (res) {res.statusCode = ERROR_CONF.WX_ERR_CODE;param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));};options.complete = function (res) {var statusCode = +res.statusCode;switch (statusCode) {case ERROR_CONF.WX_ERR_CODE:{param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));break;}case ERROR_CONF.WX_OK_CODE:{var data = res.data;if (data.status === 0) {param.complete(data);} else {param.complete(that.buildErrorConfig(data.status, data.message));}break;}default:{param.complete(that.buildErrorConfig(ERROR_CONF.SYSTEM_ERR, ERROR_CONF.SYSTEM_ERR_MSG));}}};return options;}, locationProcess: function locationProcess(param, locationsuccess, locationfail, locationcomplete) {var that = this;locationfail = locationfail || function (res) {res.statusCode = ERROR_CONF.WX_ERR_CODE;param.fail(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));};locationcomplete = locationcomplete || function (res) {if (res.statusCode == ERROR_CONF.WX_ERR_CODE) {param.complete(that.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));}};if (!param.location) {that.getWXLocation(locationsuccess, locationfail, locationcomplete);} else if (that.checkLocation(param)) {var location = Utils.getLocationParam(param.location);locationsuccess(location);}} };var QQMapWX = /*#__PURE__*/function () {function QQMapWX(options) {_classCallCheck(this, QQMapWX);if (!options.key) {throw Error('key值不能为空');}this.key = options.key;}_createClass(QQMapWX, [{ key: "search", value: function search(options) {var that = this;options = options || {};Utils.polyfillParam(options);if (!Utils.checkKeyword(options)) {return;}var requestParam = { keyword: options.keyword, orderby: options.orderby || '_distance', page_size: options.page_size || 10, page_index: options.page_index || 1, output: 'json', key: that.key };if (options.address_format) {requestParam.address_format = options.address_format;}if (options.filter) {requestParam.filter = options.filter;}var distance = options.distance || "1000";var auto_extend = options.auto_extend || 1;var region = null;var rectangle = null;if (options.region) {region = options.region;}if (options.rectangle) {rectangle = options.rectangle;}var locationsuccess = function locationsuccess(result) {if (region && !rectangle) {requestParam.boundary = "region(" + region + "," + auto_extend + "," + result.latitude + "," + result.longitude + ")";if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'search');}} else if (rectangle && !region) {requestParam.boundary = "rectangle(" + rectangle + ")";if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'search');}} else {requestParam.boundary = "nearby(" + result.latitude + "," + result.longitude + "," + distance + "," + auto_extend + ")";if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'search');}}wx.request(Utils.buildWxRequestConfig(options, { url: URL_SEARCH, data: requestParam }, 'search'));};Utils.locationProcess(options, locationsuccess);} }, { key: "getSuggestion", value: function getSuggestion(options) {var that = this;options = options || {};Utils.polyfillParam(options);if (!Utils.checkKeyword(options)) {return;}var requestParam = { keyword: options.keyword, region: options.region || '全国', region_fix: options.region_fix || 0, policy: options.policy || 0, page_size: options.page_size || 10, page_index: options.page_index || 1, get_subpois: options.get_subpois || 0, output: 'json', key: that.key };if (options.address_format) {requestParam.address_format = options.address_format;}if (options.filter) {requestParam.filter = options.filter;}if (options.location) {var locationsuccess = function locationsuccess(result) {requestParam.location = result.latitude + ',' + result.longitude;if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'suggest');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_SUGGESTION, data: requestParam }, "suggest"));};Utils.locationProcess(options, locationsuccess);} else {if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'suggest');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_SUGGESTION, data: requestParam }, "suggest"));}} }, { key: "reverseGeocoder", value: function reverseGeocoder(options) {var that = this;options = options || {};Utils.polyfillParam(options);var requestParam = { coord_type: options.coord_type || 5, get_poi: options.get_poi || 0, output: 'json', key: that.key };if (options.poi_options) {requestParam.poi_options = options.poi_options;}var locationsuccess = function locationsuccess(result) {requestParam.location = result.latitude + ',' + result.longitude;if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'reverseGeocoder');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_GET_GEOCODER, data: requestParam }, 'reverseGeocoder'));};Utils.locationProcess(options, locationsuccess);} }, { key: "geocoder", value: function geocoder(options) {var that = this;options = options || {};Utils.polyfillParam(options);if (Utils.checkParamKeyEmpty(options, 'address')) {return;}var requestParam = { address: options.address, output: 'json', key: that.key };if (options.region) {requestParam.region = options.region;}if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'geocoder');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_GET_GEOCODER, data: requestParam }, 'geocoder'));} }, { key: "getCityList", value: function getCityList(options) {var that = this;options = options || {};Utils.polyfillParam(options);var requestParam = { output: 'json', key: that.key };if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'getCityList');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_CITY_LIST, data: requestParam }, 'getCityList'));} }, { key: "getDistrictByCityId", value: function getDistrictByCityId(options) {var that = this;options = options || {};Utils.polyfillParam(options);if (Utils.checkParamKeyEmpty(options, 'id')) {return;}var requestParam = { id: options.id || '', output: 'json', key: that.key };if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'getDistrictByCityId');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_AREA_LIST, data: requestParam }, 'getDistrictByCityId'));} }, { key: "calculateDistance", value: function calculateDistance(options) {var that = this;options = options || {};Utils.polyfillParam(options);if (Utils.checkParamKeyEmpty(options, 'to')) {return;}var requestParam = { mode: options.mode || 'walking', to: Utils.location2query(options.to), output: 'json', key: that.key };if (options.from) {options.location = options.from;}if (requestParam.mode == 'straight') {var locationsuccess = function locationsuccess(result) {var locationTo = Utils.getEndLocation(requestParam.to);var data = { message: "query ok", result: { elements: [] }, status: 0 };for (var i = 0; i < locationTo.length; i++) {data.result.elements.push({ distance: Utils.getDistance(result.latitude, result.longitude, locationTo[i].lat, locationTo[i].lng), duration: 0, from: { lat: result.latitude, lng: result.longitude }, to: { lat: locationTo[i].lat, lng: locationTo[i].lng } });}var calculateResult = data.result.elements;var distanceResult = [];for (var i = 0; i < calculateResult.length; i++) {distanceResult.push(calculateResult[i].distance);}return options.success(data, { calculateResult: calculateResult, distanceResult: distanceResult });};Utils.locationProcess(options, locationsuccess);} else {var locationsuccess = function locationsuccess(result) {requestParam.from = result.latitude + ',' + result.longitude;if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'calculateDistance');}wx.request(Utils.buildWxRequestConfig(options, { url: URL_DISTANCE, data: requestParam }, 'calculateDistance'));};Utils.locationProcess(options, locationsuccess);}} }, { key: "direction", value: function direction(options) {var that = this;options = options || {};Utils.polyfillParam(options);if (Utils.checkParamKeyEmpty(options, 'to')) {return;}var requestParam = { output: 'json', key: that.key };if (typeof options.to == 'string') {requestParam.to = options.to;} else {requestParam.to = options.to.latitude + ',' + options.to.longitude;}var SET_URL_DIRECTION = null;options.mode = options.mode || MODE.driving;SET_URL_DIRECTION = URL_DIRECTION + options.mode;if (options.from) {options.location = options.from;}if (options.mode == MODE.driving) {if (options.from_poi) {requestParam.from_poi = options.from_poi;}if (options.heading) {requestParam.heading = options.heading;}if (options.speed) {requestParam.speed = options.speed;}if (options.accuracy) {requestParam.accuracy = options.accuracy;}if (options.road_type) {requestParam.road_type = options.road_type;}if (options.to_poi) {requestParam.to_poi = options.to_poi;}if (options.from_track) {requestParam.from_track = options.from_track;}if (options.waypoints) {requestParam.waypoints = options.waypoints;}if (options.policy) {requestParam.policy = options.policy;}if (options.plate_number) {requestParam.plate_number = options.plate_number;}}if (options.mode == MODE.transit) {if (options.departure_time) {requestParam.departure_time = options.departure_time;}if (options.policy) {requestParam.policy = options.policy;}}var locationsuccess = function locationsuccess(result) {requestParam.from = result.latitude + ',' + result.longitude;if (options.sig) {requestParam.sig = Utils.getSig(requestParam, options.sig, 'direction', options.mode);}wx.request(Utils.buildWxRequestConfig(options, { url: SET_URL_DIRECTION, data: requestParam }, 'direction'));};Utils.locationProcess(options, locationsuccess);} }]);return QQMapWX;}();;module.exports = QQMapWX;

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map