require("page.home",function(e,t,n){var a=function(){function t(){return a(n,arguments)}var n={en:{},fr:{}},a=e("$").intl;return t.all=n,t}(),i=e("dom"),o=e("x-widget").getById,r=(e("tfw.data-binding"),e("$").config),s=e("tfw.message").error,c=e("tfw.message").info,d=(e("form"),e("wdg.icon")),u=e("wdg.text"),l=(e("node://path"),e("files")),v=e("wdg.modal"),f=e("tfw.storage").local,w=e("node://child_process").spawn,g=(e("format"),e("wdg.button")),p=e("patients"),h=(e("structure"),e("input.search")),m=e("modal.patient");e("tfw.local-download");n.onPage=function(){var e=new h;i.clear("search",e),e.focus=!0,i("version").textContent="Version "+r.version+" - "+r.date.substr(0,10)+" "+r.date.substr(11,8);var t=o("patients-count");t.visible=!1,p.count().then(function(e){t.visible=e>0,t.text=e+" patient"+(e<2?"":"s")})},n.onExport=function(){var e=p.export(),t=i.tag("input",{type:"file",nwsaveas:"data.tgz"});i.css(t,{display:"none"});var n=new d({button:!0,content:"search",size:"1.5rem"});n.on(function(){t.click()});var a=new u({label:"Enregistrer sous",wide:!0,width:"320px",value:f.get("saveas","")}),o=new g({icon:"export",text:"Enregistrer sous"});t.addEventListener("change",function(e){a.value=this.value},!1);var r=new u({label:"Adresse mail du destinataire",wide:!0,value:f.get("email","")}),h=new g({icon:"mail",text:"Envoyer par mail"}),m=v.alert(i.div([t,i.div("table",[i.div([i.div([a]),i.div([n]),i.div([o])]),i.div([i.div([r]),i.div(),i.div([h])])])]));o.on(function(){o.wait=!0,e.then(function(e){var t=a.value;l.copy(e,t).then(function(){m.detach(),c("Sauvegarde réussie !"),f.set("saveas",t)},function(e){o.wait=!1,s(e)})})}),h.on(function(){m.detach(),e.then(function(e){f.set("email",r.value);var t=["-compose","to="+r.value+",subject=Sauvegarde de la base des patients,format=1,attachment="+e];console.info("[page.home] args=",t),w("thunderbird",t)})})},n.onAdmin=function(){location="admin.html"},n.onNewPatient=function(){m("Nouveau patient",function(e){p.create(e).then(function(e){location.hash="Patient/"+e.id})})},t.exports._=a});
//# sourceMappingURL=page.home.js.map