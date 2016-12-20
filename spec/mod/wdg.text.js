require("wdg.text",function(t,e,i){var a=function(){function e(){return a(i,arguments)}var i={en:{}},a=t("$").intl;return e.all=i,e}(),l=t("dom"),o=t("tfw.data-binding"),n=t("tfw.timer").laterAction,s=function(t){var e=this,i=!1,a=[],s=0,r=l.div("theme-label","theme-color-bg-1"),d=l.tag("input"),u=l.div("datalist","theme-elevation-12");this._input=d;var v=l.elem(this,"div","wdg-text","theme-elevation-2",[r,d,u]);o.propString(this,"value")(function(t){d.value=t,e.validate()}),o.propEnum(["text","button","checkbox","color","date","datetime","email","file","hidden","image","month","password","radio","range","reset","search","submit","tel","time","url","week"])(this,"type")(function(t){l.att(d,{type:t})}),o.propStringArray(this,"list")(function(t){l.clear(u),l.removeClass(v,"list"),Array.isArray(t)&&(t.forEach(function(t){l.add(u,l.div([t]))}),t.length>0&&l.att(v,"list"))}),o.propValidator(this,"validator")(this.validate.bind(this)),o.propBoolean(this,"valid")(function(t){null!==t&&e.validator?t?(l.addClass(v,"valid"),l.removeClass(v,"no-valid")):(l.removeClass(v,"valid"),l.addClass(v,"no-valid")):l.removeClass(v,"valid","no-valid")}),o.propBoolean(this,"enabled")(function(t){t?l.removeAtt(d,"disabled"):l.att(d,{disabled:t})}),o.propInteger(this,"size")(function(t){t<1?l.removeAtt(d,"size"):l.att(d,{size:t})}),o.propString(this,"label")(function(t){null===t||"string"==typeof t&&""==t.trim()?l.addClass(v,"no-label"):(l.removeClass(v,"no-label"),l.textOrHtml(r,t),"<html>"==t.substr(0,6)?l.att(r,{title:""}):l.att(r,{title:t}))}),o.propString(this,"placeholder")(function(t){l.att(d,{placeholder:t})}),o.propString(this,"width")(function(t){v.style.width=t}),o.propBoolean(this,"focus")(function(t){t?window.setTimeout(d.focus.bind(d)):window.setTimeout(d.blur.bind(d))}),o.propInteger(this,"action",""),o.propAddClass(this,"wide"),o.propRemoveClass(this,"visible","hide"),t=o.extend({value:"",type:"text",placeholder:"",enabled:!0,validator:null,valid:!0,list:null,label:"",placeholder:"",size:10,width:"auto",focus:!1,wide:!1,visible:!0},t,this);var c=function(){if(l.removeClass(v,"list"),e.list&&0!=e.list.length){l.clear(u);var t=e.list.map(String.toLowerCase),o=d.value.trim().toLowerCase();t=o.length>0?t.map(function(t,e){return[e,t.indexOf(o)]}).filter(function(t){return t[1]>-1}).sort(function(t,i){var a=t[1]-i[1];if(0!=a)return a;var l=e.list[t[0]],o=e.list[i[0]];return l<o?-1:l>o?1:0}).map(function(t){var i=e.list[t[0]],a=t[1];return i.substr(0,a)+"<b>"+i.substr(a,o.length)+"</b>"+i.substr(a+o.length)}):t.sort(),s>0&&(t=t.slice(s).concat(t.slice(0,s))),a=t,t.forEach(function(a,o){var n=l.div();n.innerHTML=a,t[o]=n.textContent.trim(),l.add(u,n),l.on(n,{down:function(){i=!0},up:function(){i=!1,e.focus=!0},tap:function(){e.value=n.textContent.trim(),console.info("[wdg.text] div=...",n),l.removeClass(v,"list")}})}),t.length>0?l.addClass(v,"list"):l.removeClass(v,"list")}},p=n(function(){e.value=d.value},300);d.addEventListener("keyup",function(t){13==t.keyCode?(t.preventDefault(),t.stopPropagation(),l.hasClass(v,"list")?(l.removeClass(v,"list"),e.value=a[0]):e.valid!==!1&&(o.fire(e,"value",d.value),o.fire(e,"action",d.value))):27==t.keyCode?(l.removeClass(v,"list"),s=0,t.preventDefault(),t.stopPropagation()):40==t.keyCode&&l.hasClass(v,"list")?(s=(s+1)%a.length,c(),t.preventDefault(),t.stopPropagation()):38==t.keyCode&&l.hasClass(v,"list")?(s=(s+a.length-1)%a.length,c(),t.preventDefault(),t.stopPropagation()):(s=0,c(),p.fire())}),d.addEventListener("blur",function(){e.value=d.value,i||l.removeClass(v,"list"),l.addClass(v,"theme-elevation-2"),l.removeClass(v,"theme-elevation-8"),l.removeClass(d,"theme-color-bg-A1"),e.focus=!1}),d.addEventListener("focus",function(){e.selectAll(),l.removeClass(v,"theme-elevation-2"),l.addClass(v,"theme-elevation-8"),l.addClass(d,"theme-color-bg-A1"),e.focus=!0}),d.addEventListener("keydown",function(t){}),this.validate()};s.prototype.validate=function(){var t=this.validator;if(t)try{this.valid=t(this.value)}catch(e){console.error("[wdg.text:validate] Exception = ",e),console.error("[wdg.text:validate] Validator = ",t)}},s.prototype.selectAll=function(){var t=this._input;return t.setSelectionRange(0,t.value.length),!0},e.exports=s,e.exports._=a});
//# sourceMappingURL=wdg.text.js.map