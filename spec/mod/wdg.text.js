require("wdg.text",function(t,e){function i(){return l(a,arguments)}var a={en:{}},l=require("$").intl,o=require("dom"),n=require("tfw.data-binding"),s=require("tfw.timer").laterAction,r=function(t){var e=this,i=!1,a=[],l=0,r=o.div("theme-label","theme-color-bg-1"),d=o.tag("input"),u=o.div("datalist","theme-elevation-12");this._input=d;var v=o.elem(this,"div","wdg-text","theme-elevation-2",[r,d,u]);n.propString(this,"value")(function(t){d.value=t,e.validate()}),n.propEnum(["text","button","checkbox","color","date","datetime","email","file","hidden","image","month","password","radio","range","reset","search","submit","tel","time","url","week"])(this,"type")(function(t){o.att(d,{type:t})}),n.propStringArray(this,"list")(function(t){o.clear(u),o.removeClass(v,"list"),Array.isArray(t)&&(t.forEach(function(t){o.add(u,o.div([t]))}),t.length>0&&o.att(v,"list"))}),n.propValidator(this,"validator")(this.validate.bind(this)),n.propBoolean(this,"valid")(function(t){null!==t&&e.validator?t?(o.addClass(v,"valid"),o.removeClass(v,"no-valid")):(o.removeClass(v,"valid"),o.addClass(v,"no-valid")):o.removeClass(v,"valid","no-valid")}),n.propBoolean(this,"enabled")(function(t){t?o.removeAtt(d,"disabled"):o.att(d,{disabled:t})}),n.propInteger(this,"size")(function(t){t<1?o.removeAtt(d,"size"):o.att(d,{size:t})}),n.propString(this,"label")(function(t){null===t||"string"==typeof t&&""==t.trim()?o.addClass(v,"no-label"):(o.removeClass(v,"no-label"),o.textOrHtml(r,t),"<html>"==t.substr(0,6)?o.att(r,{title:""}):o.att(r,{title:t}))}),n.propString(this,"placeholder")(function(t){o.att(d,{placeholder:t})}),n.propString(this,"width")(function(t){v.style.width=t}),n.propBoolean(this,"focus")(function(t){t?d.focus():d.blur()}),n.propInteger(this,"action",""),n.propAddClass(this,"wide"),n.propRemoveClass(this,"visible","hide"),t=n.extend({value:"",type:"text",placeholder:"",enabled:!0,validator:null,valid:!0,list:null,label:"",placeholder:"",size:10,width:"auto",focus:!1,wide:!1,visible:!0},t,this);var c=function(){if(o.removeClass(v,"list"),e.list&&0!=e.list.length){o.clear(u);var t=e.list.map(String.toLowerCase),n=d.value.trim().toLowerCase();t=n.length>0?t.map(function(t,e){return[e,t.indexOf(n)]}).filter(function(t){return t[1]>-1}).sort(function(t,i){var a=t[1]-i[1];if(0!=a)return a;var l=e.list[t[0]],o=e.list[i[0]];return l<o?-1:l>o?1:0}).map(function(t){var i=e.list[t[0]],a=t[1];return i.substr(0,a)+"<b>"+i.substr(a,n.length)+"</b>"+i.substr(a+n.length)}):t.sort(),l>0&&(t=t.slice(l).concat(t.slice(0,l))),a=t,t.forEach(function(a,l){var n=o.div();n.innerHTML=a,t[l]=n.textContent.trim(),o.add(u,n),o.on(n,{down:function(){i=!0},up:function(){i=!1,e.focus=!0},tap:function(){e.value=n.textContent.trim(),console.info("[wdg.text] div=...",n),o.removeClass(v,"list")}})}),t.length>0?o.addClass(v,"list"):o.removeClass(v,"list")}},p=s(function(){e.value=d.value},300);d.addEventListener("keyup",function(t){13==t.keyCode?(t.preventDefault(),t.stopPropagation(),o.hasClass(v,"list")?(o.removeClass(v,"list"),e.value=a[0]):e.valid!==!1&&(n.fire(e,"value",d.value),n.fire(e,"action",d.value))):27==t.keyCode?(o.removeClass(v,"list"),l=0,t.preventDefault(),t.stopPropagation()):40==t.keyCode&&o.hasClass(v,"list")?(l=(l+1)%a.length,c(),t.preventDefault(),t.stopPropagation()):38==t.keyCode&&o.hasClass(v,"list")?(l=(l+a.length-1)%a.length,c(),t.preventDefault(),t.stopPropagation()):(l=0,c(),p.fire())}),d.addEventListener("blur",function(){e.value=d.value,i||o.removeClass(v,"list"),o.addClass(v,"theme-elevation-2"),o.removeClass(v,"theme-elevation-8"),o.removeClass(d,"theme-color-bg-A1")}),d.addEventListener("focus",function(){e.selectAll(),o.removeClass(v,"theme-elevation-2"),o.addClass(v,"theme-elevation-8"),o.addClass(d,"theme-color-bg-A1")}),d.addEventListener("keydown",function(t){}),this.validate()};r.prototype.validate=function(){var t=this.validator;if(t)try{this.valid=t(this.value)}catch(e){console.error("[wdg.text:validate] Exception = ",e),console.error("[wdg.text:validate] Validator = ",t)}},r.prototype.selectAll=function(){var t=this._input;return t.setSelectionRange(0,t.value.length),!0},e.exports=r,e.exports._=i});
//# sourceMappingURL=wdg.text.js.map