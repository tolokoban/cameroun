require("wdg.modal",function(t,e){function n(){return r(o,arguments)}function i(t){var e=d.div("theme-elevation-24","theme-color-bg-B3"),n=d.div([e]);d.elem(this,"div","wdg-modal",[n]);s.prop(this,"content")(function(t){d.clear(e),Array.isArray(t)?t.forEach(function(t){d.add(e,t)}):"undefined"!=typeof t&&null!==t&&d.add(e,t)}),s.propAddClass(this,"padding"),s.propAddClass(this,"scroll"),s.propAddClass(this,"wide"),s.propRemoveClass(this,"visible","hide"),t=s.extend({visible:!1,content:[],padding:!1,scroll:!0},t,this)}var o={en:{}},r=require("$").intl,d=require("dom"),s=require("tfw.data-binding"),a=require("wdg.flex"),c=require("wdg.button");i.prototype.refresh=function(){return s.fire(this,"content"),this},i.prototype.attach=function(){document.body.appendChild(this.element),this.visible=!0},i.prototype.detach=function(){this.visible=!1,document.body.removeChild(this.element)},i.confirm=function(t,e,n){var o=c.No(),r=c.Yes("warning"),s=d.div([d.tag("hr"),new a({content:[o,r]})]);if("string"==typeof t&&"<html>"==t.substr(0,6)){var u=t.substr(6);t=d.div(),t.innerHTML=u}var h=new i({content:d.div([t,s]),padding:!0});h.attach(),o.on(function(){h.detach(),"function"==typeof n&&n()}),r.on(function(){h.detach(),"function"==typeof e&&e()})},e.exports=i,e.exports._=n});
//# sourceMappingURL=wdg.modal.js.map