require("wdg.text",function(t,e,l){var i=function(){function e(){return i(l,arguments)}var l={en:{}},i=t("$").intl;return e.all=l,e}(),a=t("dom"),n=t("tfw.data-binding"),o=t("wdg.lang"),s=t("tfw.timer").laterAction,r=function(t){var e=this,l=!1,i=[],r=0,u=a.div("theme-label","theme-color-bg-1"),v=a.tag("input"),d=new o({small:!0,visible:!0}),c=a.div("nowrap",[v,d]),p=a.div("datalist","theme-elevation-12");this._input=v;var f=a.elem(this,"div","wdg-text","theme-elevation-2",[u,c,p]);n.bind(d,"value",function(t){v.value=e.value[t]||"",v.focus()}),n.prop(this,"value")(function(t){if(null!==t&&"undefined"!=typeof t||(t=""),"number"!=typeof t&&"boolean"!=typeof t||(t=""+t),"string"!=typeof t){v.value=t[d.value];var l,i=[];for(l in t)i.push(l);d.subset=i,e.intl=!0}else v.value=t,e.intl=!1;e.validate()}),n.propBoolean(this,"intl")(function(t){d.visible=t}),n.propEnum(["text","button","checkbox","color","date","datetime","email","file","hidden","image","month","password","radio","range","reset","search","submit","tel","time","url","week"])(this,"type")(function(t){a.att(v,{type:t})}),n.propStringArray(this,"list")(function(t){console.info("[wdg.text] v=...",t),a.clear(p),a.removeClass(f,"list"),Array.isArray(t)&&(t.forEach(function(t){a.add(p,a.div([t]))}),t.length>0&&a.att(f,"list"))}),n.propValidator(this,"validator")(this.validate.bind(this)),n.propBoolean(this,"valid")(function(t){null!==t&&e.validator?t?(a.addClass(f,"valid"),a.removeClass(f,"no-valid")):(a.removeClass(f,"valid"),a.addClass(f,"no-valid")):a.removeClass(f,"valid","no-valid")}),n.propBoolean(this,"enabled")(function(t){t?a.removeAtt(v,"disabled"):a.att(v,{disabled:t})}),n.propInteger(this,"size")(function(t){t<1?a.removeAtt(v,"size"):a.att(v,{size:t})}),n.propString(this,"label")(function(t){null===t||"string"==typeof t&&""==t.trim()?a.addClass(f,"no-label"):(a.removeClass(f,"no-label"),a.textOrHtml(u,t),"<html>"==t.substr(0,6)?a.att(u,{title:""}):a.att(u,{title:t}))}),n.propString(this,"placeholder")(function(t){a.att(v,{placeholder:t})}),n.propString(this,"width")(function(t){f.style.width=t}),n.propBoolean(this,"focus")(function(t){t?v.focus():v.blur()}),n.propInteger(this,"action",""),n.propAddClass(this,"wide"),n.propRemoveClass(this,"visible","hide"),t=n.extend({intl:!1,value:"",type:"text",placeholder:"",enabled:!0,validator:null,valid:!0,list:null,label:"",placeholder:"",size:10,width:"auto",focus:!1,wide:!1,visible:!0},t,this),console.info("[wdg.text] that.list=...",e.list);var h=function(){if(a.removeClass(f,"list"),e.list&&0!=e.list.length){console.info("[wdg.text] that.list=...",e.list),a.clear(p);var t=e.list.map(String.toLowerCase),n=v.value.trim().toLowerCase();t=n.length>0?t.map(function(t,e){return[e,t.indexOf(n)]}).filter(function(t){return t[1]>-1}).sort(function(t,l){var i=t[1]-l[1];if(0!=i)return i;var a=e.list[t[0]],n=e.list[l[0]];return a<n?-1:a>n?1:0}).map(function(t){var l=e.list[t[0]],i=t[1];return l.substr(0,i)+"<b>"+l.substr(i,n.length)+"</b>"+l.substr(i+n.length)}):t.sort(),r>0&&(t=t.slice(r).concat(t.slice(0,r))),i=t,t.forEach(function(i,n){var o=a.div();o.innerHTML=i,t[n]=o.textContent.trim(),a.add(p,o),a.on(o,{down:function(){l=!0},up:function(){l=!1,e.focus=!0},tap:function(){e.value=o.textContent.trim(),console.info("[wdg.text] div=...",o),a.removeClass(f,"list")}})}),t.length>0?a.addClass(f,"list"):a.removeClass(f,"list")}},m=s(function(){e.intl?(e.value[d.value]=v.value,n.fire(e,"value",e.value)):e.value=v.value},300);v.addEventListener("keyup",function(t){13==t.keyCode?(t.preventDefault(),t.stopPropagation(),a.hasClass(f,"list")?(a.removeClass(f,"list"),e.value=i[0]):e.valid!==!1&&(n.fire(e,"value",v.value),n.fire(e,"action",v.value))):27==t.keyCode?(a.removeClass(f,"list"),r=0,t.preventDefault(),t.stopPropagation()):40==t.keyCode&&a.hasClass(f,"list")?(r=(r+1)%i.length,h(),t.preventDefault(),t.stopPropagation()):38==t.keyCode&&a.hasClass(f,"list")?(r=(r+i.length-1)%i.length,h(),t.preventDefault(),t.stopPropagation()):(r=0,h(),m.fire())}),v.addEventListener("blur",function(){e.intl?(e.value[d.value]=v.value,n.fire(e,"value",e.value)):e.value=v.value,l||a.removeClass(f,"list"),a.addClass(f,"theme-elevation-2"),a.removeClass(f,"theme-elevation-8"),a.removeClass(v,"theme-color-bg-A1"),e.focus=!1}),v.addEventListener("focus",function(){e.selectAll(),a.removeClass(f,"theme-elevation-2"),a.addClass(f,"theme-elevation-8"),a.addClass(v,"theme-color-bg-A1"),e.focus=!0}),v.addEventListener("keydown",function(t){}),this.validate()};r.prototype.validate=function(){var t=this.validator;if(t)try{this.valid=t(this.value)}catch(e){console.error("[wdg.text:validate] Exception = ",e),console.error("[wdg.text:validate] Validator = ",t)}},r.prototype.selectAll=function(){var t=this._input;return t.setSelectionRange(0,t.value.length),!0},e.exports=r,e.exports._=i});
//# sourceMappingURL=wdg.text.js.map