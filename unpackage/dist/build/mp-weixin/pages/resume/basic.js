(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/resume/basic"],{"084b":function(t,e,a){"use strict";a.r(e);var i=a("0d62"),o=a.n(i);for(var n in i)"default"!==n&&function(t){a.d(e,t,function(){return i[t]})}(n);e["default"]=o.a},"0b82":function(t,e,a){"use strict";a.r(e);var i=a("644d"),o=a("084b");for(var n in o)"default"!==n&&function(t){a.d(e,t,function(){return o[t]})}(n);a("6cec");var r=a("2877"),l=Object(r["a"])(o["default"],i["a"],i["b"],!1,null,"560b7be8",null);e["default"]=l.exports},"0d62":function(t,e,a){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=r(a("ff47")),o=a("b86b"),n=a("73ad");function r(t){return t&&t.__esModule?t:{default:t}}var l={data:function(){return{ready:!1,city:{show:!1,options:i.default},options:{gender:[{value:"1",label:"男性"},{value:"2",label:"女性"}],birthdate:6311232e5,startjob:12622752e5,jobstate:[{value:"1",label:"目前正在找工作"},{value:"2",label:"观望有好机会会考虑"},{value:"3",label:"我目前不想换工作"}],marital:[{value:"1",label:"未婚"},{value:"2",label:"已婚"},{value:"3",label:"保密"}],political:[{value:"1",label:"中共党员"},{value:"2",label:"共青团员"},{value:"3",label:"民主党派人士"},{value:"4",label:"无党派人士"},{value:"5",label:"普通公民"}],idtype:[{value:"1",label:"身份证"},{value:"2",label:"护照"},{value:"3",label:"军人证"},{value:"4",label:"港澳居民来往内地通行证"},{value:"5",label:"外国人永久居留身份证"},{value:"6",label:"其他"}]},show:{gender:!1,birthdate:!1,jobstate:!1,startjob:!1,marital:!1,political:!1,idtype:!1},form:{name:null,gender:null,birthdate:null,phone:null,jobstate:null,startjob:null,habitation:null,province:null,city:null,area:null,emall:null,idtype:null,idnumber:null,income:null,marital:!1,political:!1}}},onReady:function(){this.ready=!0},onLoad:function(t){this.$store.getters.member.resume&&this.getRasumeBasic()},methods:{onChange:function(t){var e=this.form,a=t.target.id,i=t.detail,o=/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;"name"===a?e.name=i.replace(o,""):"phone"===a?e.phone=parseFloat(i.replace(o,"")):"habitation"===a?e.habitation=i.replace(o,""):"emall"===a?e.emall=i.replace(o,""):"idnumber"===a?e.idnumber=i.replace(o,""):"income"===a&&(e.income=parseFloat(i.replace(o,"")))},cityChange:function(t){var e=t.detail.options.map(function(t){return t.label});this.form.habitation=e.join("/");var a=this.form;3===e.length?(a.province=e[0],a.city=e[1],a.area=e[2]):2===e.length?(a.province=e[0],a.city=e[1]):1===e.length&&(a.province=e[0])},onOptionsChange:function(t){var e=t.target.id,a=t.detail,i=this.form,o=this.show;"gender"===e?(i.gender=parseFloat(a.value.value),o.gender=!1):"birthdate"===e?(i.birthdate=a/1e3,o.birthdate=!1):"jobstate"===e?(i.jobstate=parseFloat(a.value.value),o.jobstate=!1):"startjob"===e?(i.startjob=a/1e3,o.startjob=!1):"marital"===e?(i.marital=parseFloat(a.value.value),o.marital=!1):"political"===e?(i.political=parseFloat(a.value.value),o.political=!1):"idtype"===e&&(i.idtype=parseFloat(a.value.value),o.idtype=!1)},onPicker:function(t){var e=this.show;"gender"===t?e.gender=!0:"birthdate"===t?e.birthdate=!0:"jobstate"===t?e.jobstate=!0:"startjob"===t?e.startjob=!0:"marital"===t?e.marital=!0:"political"===t?e.political=!0:"idtype"===t&&(e.idtype=!0)},onSubmit:function(){var e=this,a=this.form;if(!a.name)return this.forbiddenToast("姓名未填写"),!1;if(!a.gender)return this.forbiddenToast("性别未选择"),!1;if(!a.birthdate)return this.forbiddenToast("出生日期未选择"),!1;if(!a.phone)return this.forbiddenToast("手机号未填写"),!1;if(!a.jobstate)return this.forbiddenToast("求职状态未选择"),!1;if(!a.startjob)return this.forbiddenToast("工作年份未选择"),!1;if(!a.habitation)return this.forbiddenToast("居住地未填写"),!1;var i=Object.assign({},a.name?{name:a.name}:{},a.gender?{gender:a.gender}:{},a.birthdate?{birthdate:a.birthdate}:{},a.phone?{phone:parseFloat(a.phone)}:{},a.jobstate?{jobstate:a.jobstate}:{},a.startjob?{startjob:a.startjob}:{},a.habitation?{habitation:a.habitation}:{},a.province?{province:a.province}:{},a.city?{city:a.city}:{},a.area?{area:a.area}:{},a.emall?{emall:a.emall}:{},a.idtype?{idtype:a.idtype}:{},a.idnumber?{idnumber:a.idnumber}:{},a.income?{income:a.income}:{},a.marital?{marital:a.marital}:{},a.political?{political:a.political}:{});(0,o.upRasumeBasic)(i).then(function(a){var i=a.data;if(2e4===a.code)if(i.up){(0,n.$wuxToast)().show({type:"success",text:"保存成功"});var o=e.$store.getters.member;o.resume=!0,e.$store.commit("SET_MEMBER",o),setTimeout(function(){t.navigateBack()},1e3)}else(0,n.$wuxToast)().show({type:"forbidden",text:"保存失败"});else(0,n.$wuxToast)().show({type:"forbidden",text:"请求异常"})})},getRasumeBasic:function(){var e=this;(0,o.getRasumeBasic)().then(function(a){var i=a.data;if(2e4===a.code){var o=e.form,r=i.detail;o.name=r.name,o.gender=r.gender,o.birthdate=r.birthdate,o.phone=r.phone,o.jobstate=r.jobstate,o.startjob=r.startjob,o.habitation=r.habitation,o.emall=r.emall,o.idtype=r.info.idtype,o.idnumber=r.info.idnumber,o.income=r.info.income,o.marital=r.info.marital,o.political=r.info.political}else(0,n.$wuxToast)().show({type:"forbidden",text:"请求异常"}),setTimeout(function(){t.navigateBack()},1e3)})},forbiddenToast:function(t){(0,n.$wuxToast)().show({type:"forbidden",text:t})},Back:function(){t.navigateBack()}}};e.default=l}).call(this,a("543d")["default"])},3447:function(t,e,a){},"644d":function(t,e,a){"use strict";var i=function(){var t=this,e=t.$createElement,a=(t._self._c,t._f("gender")(t.form.gender)),i=t._f("parseTime")(t.form.birthdate?t.form.birthdate:0,"{y}-{m}-{d}"),o=t._f("jobstate")(t.form.jobstate),n=t._f("parseTime")(t.form.startjob?t.form.startjob:0,"{y}-{m}-{d}"),r=t._f("idtype")(t.form.idtype),l=t._f("marital")(t.form.marital),u=t._f("political")(t.form.political);t._isMounted||(t.e0=function(e){t.city.show=!0},t.e1=function(e){t.show.gender=!1},t.e2=function(e){t.show.gender=!1},t.e3=function(e){t.show.jobstate=!1},t.e4=function(e){t.show.jobstate=!1},t.e5=function(e){t.show.marital=!1},t.e6=function(e){t.show.marital=!1},t.e7=function(e){t.show.political=!1},t.e8=function(e){t.show.political=!1},t.e9=function(e){t.show.idtype=!1},t.e10=function(e){t.show.idtype=!1},t.e11=function(e){t.show.birthdate=!1},t.e12=function(e){t.show.birthdate=!1},t.e13=function(e){t.show.startjob=!1},t.e14=function(e){t.show.startjob=!1},t.e15=function(e){t.city.show=!1}),t.$mp.data=Object.assign({},{$root:{f0:a,f1:i,f2:o,f3:n,f4:r,f5:l,f6:u}})},o=[];a.d(e,"a",function(){return i}),a.d(e,"b",function(){return o})},"6cec":function(t,e,a){"use strict";var i=a("3447"),o=a.n(i);o.a},dc74:function(t,e,a){"use strict";(function(t){a("dc02"),a("921b");i(a("66fd"));var e=i(a("0b82"));function i(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,a("543d")["createPage"])}},[["dc74","common/runtime","common/vendor"]]]);