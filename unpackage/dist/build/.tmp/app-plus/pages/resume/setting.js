(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/resume/setting"],{"1c04":function(t,e,n){"use strict";n.r(e);var a=n("a7b9"),o=n("2334");for(var u in o)"default"!==u&&function(t){n.d(e,t,function(){return o[t]})}(u);n("eec3");var i=n("2877"),r=Object(i["a"])(o["default"],a["a"],a["b"],!1,null,"c961ad3e",null);e["default"]=r.exports},2334:function(t,e,n){"use strict";n.r(e);var a=n("50f8"),o=n.n(a);for(var u in a)"default"!==u&&function(t){n.d(e,t,function(){return a[t]})}(u);e["default"]=o.a},"50f8":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n("b86b"),o=n("73ad"),u=n("2f62");function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},a=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(a=a.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),a.forEach(function(e){r(t,e,n[e])})}return t}function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s={computed:i({},(0,u.mapGetters)(["member"])),data:function(){return{options:{state:[{value:"1",label:"军优公开"},{value:"2",label:"完全公开"},{value:"3",label:"完全保密"}]},show:{state:!1},form:{title:null,state:null}}},onLoad:function(t){this.getRasumeSetting()},methods:{onChange:function(t){var e=this.form,n=t.target.id,a=t.detail,o=/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;"title"===n&&(e.title=a.replace(o,""))},onOptionsChange:function(t){var e=t.target.id,n=t.detail.value.value,a=this.form,o=this.show;"state"===e&&(a.state=parseFloat(n),o.state=!1)},onPicker:function(t){var e=this.show;"state"===t&&(e.state=!0)},onSubmit:function(){var e=this;setTimeout(function(){var n=e.form;if(!n.title)return e.forbiddenToast("简历名称未填"),!1;if(!n.state)return e.forbiddenToast("公开程度未选"),!1;var u=Object.assign({},n.title?{title:n.title}:{},n.state?{state:n.state}:{});(0,a.upRasumeSetting)(u).then(function(e){var n=e.data;2e4===e.code?n.up?((0,o.$wuxToast)().show({type:"success",text:"保存成功"}),setTimeout(function(){t.navigateBack()},1e3)):(0,o.$wuxToast)().show({type:"forbidden",text:"保存失败"}):(0,o.$wuxToast)().show({type:"forbidden",text:"请求异常"})})},500)},forbiddenToast:function(t){(0,o.$wuxToast)().show({type:"forbidden",text:t})},getRasumeSetting:function(){var e=this;(0,a.getRasumeSetting)().then(function(n){var a=n.data;2e4===n.code?e.form=a.detail:((0,o.$wuxToast)().show({type:"forbidden",text:"请求异常"}),setTimeout(function(){t.navigateBack()},1e3))})},acTo:function(){t.navigateTo({url:"/pages/my/ac"})},Back:function(){t.navigateBack()}}};e.default=s}).call(this,n("6e42")["default"])},"56e1":function(t,e,n){"use strict";(function(t){n("dc02"),n("921b");a(n("66fd"));var e=a(n("1c04"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},"7f33":function(t,e,n){},a7b9:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=(t._self._c,t._f("resumestate")(t.form.state));t._isMounted||(t.e0=function(e){t.show.state=!1},t.e1=function(e){t.show.state=!1}),t.$mp.data=Object.assign({},{$root:{f0:n}})},o=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return o})},eec3:function(t,e,n){"use strict";var a=n("7f33"),o=n.n(a);o.a}},[["56e1","common/runtime","common/vendor"]]]);