require("structure",function(r,e,t){var n=function(){function e(){return n(t,arguments)}var t={en:{},fr:{}},n=r("$").intl;return e.all=t,e}();r("polyfill.promise");var o=(r("dom"),r("tfw.web-service")),s=r("structure.parser"),i=r("tfw.storage").session,u=o.get("GetOrg");t.load=function(){return new Promise(function(r,e){u.then(function(e){t.data=e;var n,o;for(n in e){o=e[n],"string"!=typeof o&&(o="");try{t[n]=s.parse(o)}catch(r){i.set("error",{name:n,content:o,line:r.lineNumber,message:r.message}),location="error.html"}r()}},e)})},t.getForm=function(){var r,e,n=[];for(r=0;r<arguments.length;r++)e=arguments[r],n.push(e);return s.get(t.forms,n)},e.exports._=n});
//# sourceMappingURL=structure.js.map