(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/my/ac"],{"4a6d":function(e,t,n){"use strict";var a=n("92c6"),o=n.n(a);o.a},"4b33":function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement;e._self._c},o=[];n.d(t,"a",function(){return a}),n.d(t,"b",function(){return o})},"92c6":function(e,t,n){},be64:function(e,t,n){"use strict";n.r(t);var a=n("4b33"),o=n("c4b9");for(var u in o)"default"!==u&&function(e){n.d(t,e,function(){return o[e]})}(u);n("4a6d");var i=n("2877"),r=Object(i["a"])(o["default"],a["a"],a["b"],!1,null,"a112abe2",null);t["default"]=r.exports},c4b9:function(e,t,n){"use strict";n.r(t);var a=n("f834"),o=n.n(a);for(var u in a)"default"!==u&&function(e){n.d(t,e,function(){return a[e]})}(u);t["default"]=o.a},eb8f:function(e,t,n){"use strict";(function(e){n("dc02"),n("921b");a(n("66fd"));var t=a(n("be64"));function a(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("6e42")["createPage"])},f834:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n("b86b"),o=n("73ad"),u={data:function(){return{fileList:[],url:"https://gw-1300511476.cos.ap-guangzhou.myqcloud.com/",cos:null,ac:0,form:{idname:null,idnumber:null,acUrl:null}}},onLoad:function(){this.getMemberAc()},methods:{getMemberAc:function(){var e=this;(0,a.getMemberAc)().then(function(t){var n=t.data;if(2e4===t.code){e.form=n.detail.info,e.ac=n.detail.ac,e.fileList=[{uid:1,status:"done",url:""+n.detail.info.acUrl}];var a=e.$store.getters.member;n.detail.ac>1&&(a.ac=n.detail.ac,e.$store.commit("SET_MEMBER",a))}else(0,o.$wuxToast)().show({type:"forbidden",text:"请求异常"})})},stsToken:function(){var e=this;(0,a.stsToken)().then(function(t){var n=t.data;if(2e4===t.code){var a=new Date,u=a.getFullYear(),i=a.getMonth()+1,r=a.getDate(),c=Math.random().toString(36).substr(2,6)+".png",s="ac/"+u+"/"+i+"/"+r+"/";e.cos=n,e.cos.key=s+c,t.url&&(e.url=t.url)}else(0,o.$wuxToast)().show({type:"forbidden",text:"请求异常"})})},onChange:function(e){var t=this.form,n=e.target.id,a=e.detail,o=/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g;"idname"===n?t.idname=a.replace(o,""):"idnumber"===n&&(t.idnumber=a.replace(o,""))},uploadSuccess:function(){var e="https://gw-1300511476.cos.ap-guangzhou.myqcloud.com/"+this.cos.key;this.form.acUrl=e},removeFile:function(){this.fileList=[]},onSubmit:function(){var t=this;setTimeout(function(){var n=t.form;if(!n.idname)return t.forbiddenToast("真实姓名未填写"),!1;if(!n.idnumber)return t.forbiddenToast("身份证未填写"),!1;if(!n.acUrl)return t.forbiddenToast("退伍证明未上传"),!1;var u=Object.assign({},n.idname?{idname:n.idname}:{},n.idnumber?{idnumber:n.idnumber}:{},n.acUrl?{acUrl:n.acUrl}:{});(0,a.updateMemberAc)(u).then(function(n){var a=n.data;2e4===n.code?a.update?(t.$store.dispatch("MemberAC"),(0,o.$wuxToast)().show({type:"success",text:"已提交"}),setTimeout(function(){e.navigateBack()},1e3)):(0,o.$wuxToast)().show({type:"forbidden",text:"提交失败"}):(0,o.$wuxToast)().show({type:"forbidden",text:"请求异常"})})},500)},forbiddenToast:function(e){(0,o.$wuxToast)().show({type:"forbidden",text:e})},Back:function(){e.navigateBack()}}};t.default=u}).call(this,n("6e42")["default"])}},[["eb8f","common/runtime","common/vendor"]]]);