require("page.visit",function(i,e){function t(){return o(a,arguments)}function n(i,e){if("undefined"!=typeof e){var t,a,o,d;for(t in e)a=e[t],"#"==t.charAt(0)?o=new u({def:a,patient:s}):(d=r.div(),o=new h({label:a.caption,content:[d],simple:!0,value:!1}),n(d,a.children)),r.add(i,o)}}var s,a={en:{},fr:{}},o=require("$").intl,r=require("dom"),d=require("data"),u=(require("form"),require("wdg.modal"),require("input")),l=require("format"),h=require("wdg.showhide"),c=require("structure");i.onPage=function(){var i=location.hash.split("/"),e=i[1];s=d.getPatient(e),document.getElementById("visit.title").textContent=l.getPatientCaption(s);var t=document.getElementById("visit.data");r.clear(t),n(t,c.forms)},i.onClose=function(){var i=d.getLastVisit(s);i.exit=Date.now(),d.save(),location.hash="#Home"},i.onNewVisit=function(){console.info("[page.patient] g_patient=...",s);var i=s.$admissions[s.$admissions.length-1];i?i.exit?(i={enter:Date.now(),visits:[{date:Date.now()}]},s.$admissions.push(i),location.hash="#Visit/"+s.id+"/"+(s.$admissions.length-1)+"/0"):(i=s.$admissions[s.$admissions.length-1],location.hash="#Visit/"+s.id+"/"+(s.$admissions.length-1)+"/"+(i.visits.length-1)):(i={enter:Date.now(),visits:[{date:Date.now()}]},s.$admissions.push(i),location.hash="#Visit/"+s.id+"/0/0")},e.exports._=t});
//# sourceMappingURL=page.visit.js.map