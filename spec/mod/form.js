require("form",function(t,e,i){function n(t,e){var i,n,r,f,d,s=this,p=[],v=function(t){if(!s._lockValueGet){var e={};p.forEach(function(t){var i,n=t.value;"string"==typeof n&&void 0!==(i=t.$map[n.trim().toLowerCase()])&&(n=i),""!=n&&(e[t.$id]=n)}),s._lockValueSet=!0,s.value=e,s._lockValueSet=!1}},h=0;for(i in e)0==(1&h)&&(r&&a.add(t,r),r=a.div()),h++,n=e[i],d=o(n.type),f="#DATE"==n.type?new c({label:n.caption,wide:!0}):new l({label:n.caption,wide:!0,list:d.list}),f.$id=i,f.$map=d.map,f.$type=n.type,p.push(f),u.bind(f,"value",v),a.add(r,a.div([f]));a.add(t,r);var m;for(m=0;m<p.length-1;m++)u.bind(p[m],"action",p[m+1],"focus",{value:!0});return p}function o(t){if(void 0===t)return p;if(void 0===(t=d.value.types[t]))return p;if(void 0===(t=t.children))return p;var e,i,n=[],o={};for(e in t)i=t[e],n.push(i.caption),o[i.caption.toLowerCase()]=e;return n.sort(),{list:n,map:o}}var r=function(){function e(){return n(i,arguments)}var i={en:{},fr:{}},n=t("$").intl;return e.all=i,e}(),a=t("dom"),u=t("tfw.data-binding"),l=t("wdg.text"),c=t("wdg.date2"),f=t("format"),d=t("structure"),s=function(t){var e=this,i=a.elem(this,"div","form"),o=a.div("table");a.add(i,o);var r=n.call(this,o,t);this._lockValueSet=!1,this._lockValueGet=!1,u.prop(this,"value")(function(t){e._lockValueSet||(e._lockValueGet=!0,r.forEach(function(e){e.value=f.expand(t[e.$id]||"",e.$type)}),e._lockValueGet=!1)}),u.propInteger(this,"level")(function(t){a.css(i,{"margin-left":t+"rem"})}),u.propBoolean(this,"focus")(function(t){t?window.setTimeout(function(){r[0].focus=!0}):r.forEach(function(t){t.focus=!1})}),Object.defineProperty(s.prototype,"keys",{get:function(){var t=[];return r.forEach(function(e){t.push(e.$id)}),t},set:function(t){},configurable:!0,enumerable:!0})},p={list:[],map:{}};e.exports=s,e.exports._=r});
//# sourceMappingURL=form.js.map