require("page.visit",function(t,i,n){function e(){return d(o,arguments)}function s(t,i){if("undefined"!=typeof i){var n,e,o,d;for(n in i)e=i[n],"#"==n.charAt(0)?o=new h({def:e,patient:a}):(d=l.div(),o=new m({label:e.caption,content:[d],simple:!0,value:!1}),s(d,e.children)),l.add(t,o)}}var a,o={en:{},fr:{}},d=t("$").intl,l=t("dom"),r=t("data"),h=(t("form"),t("wdg.modal"),t("input")),c=t("format"),m=t("wdg.showhide"),u=t("structure");n.onPage=function(){var t=location.hash.split("/"),i=t[1];a=r.getPatient(i),document.getElementById("visit.title").textContent=c.getPatientCaption(a);var n=document.getElementById("visit.data");l.clear(n),s(n,u.forms)},n.onClose=function(){var t=r.getLastVisit(a);t.exit=Date.now(),r.save(),location.hash="#Home"},n.onNewVisit=function(){console.info("[page.patient] g_patient=...",a);var t=a.$admissions[a.$admissions.length-1];t?t.exit?(t={enter:Date.now(),visits:[{date:Date.now()}]},a.$admissions.push(t),location.hash="#Visit/"+a.id+"/"+(a.$admissions.length-1)+"/0"):(t=a.$admissions[a.$admissions.length-1],location.hash="#Visit/"+a.id+"/"+(a.$admissions.length-1)+"/"+(t.visits.length-1)):(t={enter:Date.now(),visits:[{date:Date.now()}]},a.$admissions.push(t),location.hash="#Visit/"+a.id+"/0/0")},i.exports._=e});
//# sourceMappingURL=page.visit.js.map