require("app",function(e,r){function t(){return o(n,arguments)}var n={en:{"title-home":"Search / Register a patient"},fr:{"title-home":"Rechercher / Enregistrer un patient"}},o=require("$").intl,i=require("dom"),u=require("form"),c=require("structure");e.start=function(){console.info("[app] Structure.types=...",c.types),console.info("[app] Structure.forms=...",c.forms);var e=c.getForm("@PATIENT","@SEARCH"),r=new u(e),t=document.getElementById("search-form");i.add(t,r)},e.onPage=function(e){},r.exports._=t});
//# sourceMappingURL=app.js.map