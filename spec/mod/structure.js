require("structure",function(t,r,n){var e=function(){function r(){return e(n,arguments)}var n={en:{},fr:{}},e=t("$").intl;return r.all=n,r}();t("polyfill.promise");var o=t("dom"),i=(t("tfw.web-service"),t("files")),u=t("wdg.modal"),s=t("structure.parser"),a=(t("tfw.storage").session,t("node://fs")),c="data/structure.json",f="https://tolokoban.org/Cameroun/tfw/svc.php?s=GetOrg";n.load=function(){return new Promise(function(t,r){i.mkdir("data").then(function(){return fetch(f)}).then(function(t){if(0==t.ok)throw"Error "+t.status+" - "+t.statusText;return t.json()}).then(function(e){var i,f;for(i in e){f=e[i],"string"!=typeof f&&(f="");try{n[i]=s.parse(f)}catch(t){return u.alert(o.div(["Error in structure `"+i+"` at line "+t.lineNumber,o.tag("code",[t.message])])),void r()}}a.writeFile(c,JSON.stringify(e,null,"    ")),t()}).catch(function(n){a.existsSync(c)?a.readFile(c,function(n,e){n?r("Unable to read backup file for structure!\n"+n):t(JSON.parse(e.toString()))}):r("No connection and no structure in cache!")})})},n.getForm=function(){var t,r,e=[];for(t=0;t<arguments.length;t++)r=arguments[t],e.push(r);return s.get(n.forms,e)},r.exports._=e});
//# sourceMappingURL=structure.js.map