require("wdg.button",function(e,t,n){function i(e,t){"undefined"==typeof t&&(t="standard");var n=e,i=e;"yes"==i&&(n="ok"),"no"==i&&(n="cancel");var a=new d({text:o(i),icon:n,value:e,type:t});return a}var o=function(){function t(){return i(n,arguments)}var n={en:{cancel:"Cancel",close:"Close",delete:"Delete",edit:"Edit",no:"No",ok:"OK",save:"Save",yes:"Yes"},fr:{cancel:"Annuler",close:"Fermer",delete:"Supprimer",edit:"Editer",no:"Non",ok:"Valider",save:"Sauver",yes:"Oui"}},i=e("$").intl;return t.all=n,t}(),a=e("dom"),r=e("tfw.data-binding"),s=e("wdg.icon"),l=e("tfw.touchable"),c=["standard","simple","warning","shadow","special"],d=function(e){var t=this,n=a.elem(this,"button","wdg-button","theme-elevation-2");"string"==typeof e.href&&e.href.length>0&&a.att(n,"href",e.href),"string"==typeof e.target&&e.target.length>0&&a.att(n,"target",e.target);var i=null,o=function(){a.clear(n),i?(a.add(n,i.element,t.text),t._icon=i):(n.textContent=t.text,delete t._icon)};r.prop(this,"value"),r.propEnum(c)(this,"type")(function(e){c.forEach(function(e){a.removeClass(n,e)}),a.addClass(n,e)}),r.prop(this,"icon")(function(e){i=!e||"string"==typeof e&&0==e.trim().length?null:e.element?e.element:new s({content:e,size:"1.2em"}),o()}),r.propString(this,"text")(function(e){o()});var d=new l(n,{classToAdd:"theme-elevation-8"});r.propBoolean(this,"enabled")(function(e){d.enabled=d,e?a.removeAtt(n,"disabled"):a.att(n,"disabled","yes")}),r.propBoolean(this,"small")(function(e){e?a.addClass(n,"small"):a.removeClass(n,"small")}),r.prop(this,"action",0),r.propAddClass(this,"wide"),r.propRemoveClass(this,"visible","hide"),e=r.extend({text:"OK",href:null,target:null,value:"action",action:0,icon:"",small:!1,enabled:!0,wide:!1,visible:!0,type:"standard"},e,this),a.on(this.element,{keydown:function(e){13!=e.keyCode&&32!=e.keyCode||(e.preventDefault(),e.stopPropagation(),t.fire())}}),d.tap.add(t.fire.bind(t))};d.prototype.on=function(e){return r.bind(this,"action",e),this},d.prototype.fire=function(){if(this.enabled){var e=this.href;"string"!=typeof e||0==e.trim().length?r.fire(this,"action",this.value):window.location=e}},d.prototype.waitOn=function(e){"undefined"==typeof this._backup&&(this._backup={text:this.text,icon:this.icon,enabled:this.enabled}),"string"==typeof e&&(this.text=e),this.enabled=!1,this.icon="wait",this._icon&&(this._icon.rotate=!0)},d.prototype.waitOff=function(){this.text=this._backup.text,this.icon=this._backup.icon,this.enabled=this._backup.enabled,this._icon&&(this._icon.rotate=!1),delete this._backup},d.Cancel=function(e){return i("cancel",e||"simple")},d.Close=function(e){return i("close",e||"simple")},d.Delete=function(e){return i("delete",e||"warning")},d.No=function(e){return i("no")},d.Ok=function(e){return i("ok",e||"default")},d.Edit=function(e){return i("edit")},d.Save=function(e){return i("save",e||"special")},d.Yes=function(e){return i("yes",e||"default")},d.default={caption:"OK",type:"default"},t.exports=d,t.exports._=o});
//# sourceMappingURL=wdg.button.js.map