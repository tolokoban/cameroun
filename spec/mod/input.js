require("input",function(e,t){function n(){return f(o,arguments)}function i(e,t,n,i){if(t.type&&"+"==t.type.charAt(t.type.length-1))return void r(t,n,i);var a=v.getValue(n,t.id),d=u(t.type),o=new c({wide:!0,list:d.list,placeholder:s.expand(a.old,t.type),value:s.expand(a.new,t.type)});l.bind(o,"value",function(e){if("string"==typeof e){if(e=e.trim(),0==e.length)delete i.data[t.id];else{var n=d.map[e.toLowerCase()];i.data[t.id]=n||e}v.save()}}),p.add(e,p.div([p.div([t.caption]),p.div([o])])),r(e,o,t,n,i)}function r(e,t,n,i,r){for(var u=n,o=n,f=0;null!=(o=d(u));)f++,a(e,t,i,n,o,f),u=o}function a(e,t,n,i,r,a){var d=y.types[i.type],u=v.getValue(n,r.id),o=new c({wide:!0,placeholder:s.expand(u.old,d,a),value:s.expand(u.new,d,a)});l.bind(o,"focus",function(e){e&&(o.value=t.value)}),p.add(e,p.div([p.div([r.caption]),p.div([o])]))}function d(e){if("undefined"==typeof e.children)return null;var t;for(t in e.children)return e.children[t];return null}function u(e){if("undefined"==typeof e)return w;if(e=y.types[e],"undefined"==typeof e)return w;if(e=e.children,"undefined"==typeof e)return w;var t,n,i=[],r={};for(t in e)n=e[t],i.push(n.caption),r[n.caption.toLowerCase()]=t;return i.sort(),{list:i,map:r}}var o={en:{},fr:{}},f=require("$").intl,p=require("dom"),l=require("tfw.data-binding"),v=require("data"),c=require("wdg.text"),s=require("format"),y=require("structure"),h=function(e){var t,n=p.elem(this,"div","input");if("undefined"==typeof e.patient)throw Error("[input] Missing mandatory argument: `patient`!");var r=e.patient;t=v.getLastVisit(r);var a=e.def;i(n,a,r,t)},w={list:[],map:{}};t.exports=h,t.exports._=n});
//# sourceMappingURL=input.js.map