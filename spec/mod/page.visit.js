require("page.visit",function(t,i,n){function e(t,i){if("undefined"!=typeof i){var n,a,d,l;for(n in i)a=i[n],"#"==n.charAt(0)?d=new r({def:a,patient:s}):(l=o.div(),d=new h({label:a.caption,content:[l],simple:!0,value:!1}),e(l,a.children)),o.add(t,d)}}var s,a=function(){function i(){return e(n,arguments)}var n={en:{},fr:{}},e=t("$").intl;return i.all=n,i}(),o=t("dom"),d=t("data"),r=(t("form"),t("wdg.modal"),t("input")),l=t("format"),h=t("wdg.showhide"),c=t("structure");n.onPage=function(){var t=location.hash.split("/"),i=t[1];s=d.getPatient(i),document.getElementById("visit.title").textContent=l.getPatientCaption(s);var n=document.getElementById("visit.data");o.clear(n),e(n,c.forms)},n.onClose=function(){var t=d.getLastVisit(s);t.exit=Date.now(),d.save(),location.hash="#Home"},n.onNewVisit=function(){var t=s.$admissions[s.$admissions.length-1];t?t.exit?(t={enter:Date.now(),visits:[{date:Date.now()}]},s.$admissions.push(t),location.hash="#Visit/"+s.id+"/"+(s.$admissions.length-1)+"/0"):(t=s.$admissions[s.$admissions.length-1],location.hash="#Visit/"+s.id+"/"+(s.$admissions.length-1)+"/"+(t.visits.length-1)):(t={enter:Date.now(),visits:[{date:Date.now()}]},s.$admissions.push(t),location.hash="#Visit/"+s.id+"/0/0")},i.exports._=a});
//# sourceMappingURL=page.visit.js.map