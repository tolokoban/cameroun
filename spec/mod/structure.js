require("structure",function(t,r,n){function e(t){n.data=t;var r,e;for(r in t){e=t[r],"string"!=typeof e&&(e="");try{n[r]=a.parse(e),console.info("[structure] exports[",r,"]=",n[r])}catch(t){return s.alert(u.div(["Error in structure `"+r+"` at line "+t.lineNumber,u.tag("code",[t.message])])),!1}}return!0}var o=function(){function r(){return e(n,arguments)}var n={en:{},fr:{}},e=t("$").intl;return r.all=n,r}();t("polyfill.promise");var u=t("dom"),i=(t("tfw.web-service"),t("files")),s=t("wdg.modal"),a=t("structure.parser"),c=(t("tfw.storage").session,t("node://fs")),f="data/structure.json",l="https://tolokoban.org/Cameroun/tfw/svc.php?s=GetOrg";n.load=function(){return new Promise(function(t,r){i.mkdir("data").then(function(){return fetch(l)}).then(function(t){if(0==t.ok)throw"Error "+t.status+" - "+t.statusText;return t.json()}).then(function(r){if(!e(r))throw"Unparsable JSON!";c.writeFile(f,JSON.stringify(r,null,"    ")),t()}).catch(function(n){c.existsSync(f)?c.readFile(f,function(n,o){n?r("Unable to read backup file for structure!\n"+n):(e(JSON.parse(o.toString())),t())}):r("No connection and no structure in cache!")})})},n.getForm=function(){var t,r,e=[];for(t=0;t<arguments.length;t++)r=arguments[t],e.push(r);return a.get(n.forms,e)},r.exports._=o});
//# sourceMappingURL=structure.js.map