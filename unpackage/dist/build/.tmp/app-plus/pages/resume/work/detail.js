(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/resume/work/detail"],{2395:function(t,e,n){"use strict";var a=n("9a03"),i=n.n(a);i.a},"80f0":function(t,e,n){"use strict";n.r(e);var a=n("e70d"),i=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,function(){return a[t]})}(o);e["default"]=i.a},8961:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=(t._self._c,t._f("parseTime")(t.form.start?t.form.start:0,"{y}-{m}")),a=t._f("parseTime")(t.form.end?t.form.end:0,"{y}-{m}"),i=t._f("size")(t.form.size),o=t._f("nature")(t.form.nature),u=t._f("industry")(t.form.industry),s=t._f("prefType")(t.form.type);t._isMounted||(t.e0=function(e){t.show.industry=!1},t.e1=function(e){t.show.industry=!1},t.e2=function(e){t.show.type=!1},t.e3=function(e){t.show.type=!1},t.e4=function(e){t.show.size=!1},t.e5=function(e){t.show.size=!1},t.e6=function(e){t.show.nature=!1},t.e7=function(e){t.show.nature=!1},t.e8=function(e){t.show.start=!1},t.e9=function(e){t.show.start=!1},t.e10=function(e){t.show.end=!1},t.e11=function(e){t.show.end=!1}),t.$mp.data=Object.assign({},{$root:{f0:n,f1:a,f2:i,f3:o,f4:u,f5:s}})},i=[];n.d(e,"a",function(){return a}),n.d(e,"b",function(){return i})},"9a03":function(t,e,n){},"9f11":function(t,e,n){"use strict";(function(t){n("dc02"),n("921b");a(n("66fd"));var e=a(n("acf3"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("6e42")["createPage"])},acf3:function(t,e,n){"use strict";n.r(e);var a=n("8961"),i=n("80f0");for(var o in i)"default"!==o&&function(t){n.d(e,t,function(){return i[t]})}(o);n("2395");var u=n("2877"),s=Object(u["a"])(i["default"],a["a"],a["b"],!1,null,"5e905732",null);e["default"]=s.exports},e70d:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=r(n("cd8a")),i=r(n("34b4")),o=r(n("031e")),u=n("b86b"),s=n("73ad");function r(t){return t&&t.__esModule?t:{default:t}}var d={data:function(){return{id:null,ready:!1,options:{start:1573026683e3,end:1573026683e3,size:null,nature:null,industry:[{values:["互联网/IT/电子/通信","房地产","金融业","建筑业","制造业","农林牧渔","批发/零售/贸易","专业服务","文化/体育/娱乐","交通运输/仓储/物流","能源/环保/矿产","教育培训/科研","卫生及社会工作","公共管理/社会保障","生活服务"],className:"column1"},{values:[{text:"计算机软件",value:"1"},{text:"计算机硬件",value:"2"},{text:"企业服务",value:"3"},{text:"人工智能",value:"4"},{text:"通信/网络设备",value:"5"},{text:"网络/信息安全",value:"6"},{text:"新媒体",value:"7"},{text:"游戏",value:"8"},{text:"云计算/大数据",value:"9"}],className:"column2"}],type:[{value:"1",label:"全职"},{value:"2",label:"兼职"},{value:"3",label:"实习"}]},show:{start:!1,end:!1,size:!1,nature:!1,type:!1,industry:!1},form:{start:null,end:null,company:null,position:null,description:null,size:null,nature:null,industry:null,type:null}}},onReady:function(){this.ready=!0},onLoad:function(t){var e=this.options;a.default.pop(),e.size=a.default,i.default.pop(),e.nature=i.default,t.id&&(this.getRasumeWorkDetail(t.id),this.id=t.id)},methods:{onPickerChange:function(t){var e=t.detail,n=e.picker,a=e.value;e.index;n.setColumnValues(1,o.default[a[0]])},onChange:function(t){var e=this.form,n=t.target.id,a=t.detail,i=/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;"company"===n?e.company=a.replace(i,""):"position"===n?e.position=a.replace(i,""):"description"===n&&(e.description=a.replace(i,""))},onOptionsChange:function(t){var e=t.target.id,n=t.detail,a=this.form,i=this.show;"start"===e?(a.start=n/1e3,i.start=!1):"end"===e?(a.end=n/1e3,i.end=!1):"size"===e?(a.size=parseFloat(n.value.id),i.size=!1):"nature"===e?(a.nature=parseFloat(n.value.id),i.nature=!1):"type"===e?(a.type=parseFloat(n.value.value),i.type=!1):"industry"===e&&(a.industry=parseFloat(n.value[1].value),i.industry=!1)},onPicker:function(t){var e=this.show;"start"===t?e.start=!0:"end"===t?e.end=!0:"size"===t?e.size=!0:"nature"===t?e.nature=!0:"type"===t?e.type=!0:"industry"===t&&(e.industry=!0)},onSubmit:function(){var e=this;setTimeout(function(){var n=e.form;if(!n.start)return e.forbiddenToast("开始时间未选"),!1;if(!n.end)return e.forbiddenToast("结束时间未选"),!1;if(!n.company)return e.forbiddenToast("公司未填写"),!1;if(!n.position)return e.forbiddenToast("职位未填写"),!1;if(!n.description)return e.forbiddenToast("工作描述未填"),!1;var a=Object.assign({},{id:e.id},n.start?{start:n.start}:{},n.end?{end:n.end}:{},n.company?{company:n.company}:{},n.position?{position:n.position}:{},n.description?{description:n.description}:{},n.industry?{industry:n.industry}:{},n.size?{size:n.size}:{},n.nature?{nature:n.nature}:{},n.type?{type:n.type}:{});(0,u.upRasumeWorkDetail)(a).then(function(e){var n=e.data;2e4===e.code?n.up?((0,s.$wuxToast)().show({type:"success",text:"保存成功"}),setTimeout(function(){t.navigateBack()},1e3)):(0,s.$wuxToast)().show({type:"forbidden",text:"保存失败"}):(0,s.$wuxToast)().show({type:"forbidden",text:"请求异常"})})},500)},getRasumeWorkDetail:function(e){var n=this;(0,u.getRasumeWorkDetail)({id:e}).then(function(e){var a=e.data;2e4===e.code?n.form=a.detail:((0,s.$wuxToast)().show({type:"forbidden",text:"请求异常"}),setTimeout(function(){t.navigateBack()},1e3))})},delRasumeWorkDetail:function(){(0,u.delRasumeWorkDetail)({id:this.id}).then(function(e){var n=e.data;2e4===e.code?n.del&&((0,s.$wuxToast)().show({type:"success",text:"删除成功"}),setTimeout(function(){t.navigateBack({delta:2})},1e3)):((0,s.$wuxToast)().show({type:"forbidden",text:"请求异常"}),setTimeout(function(){t.navigateBack()},1e3))})},forbiddenToast:function(t){(0,s.$wuxToast)().show({type:"forbidden",text:t})},Back:function(){t.navigateBack()}}};e.default=d}).call(this,n("6e42")["default"])}},[["9f11","common/runtime","common/vendor"]]]);