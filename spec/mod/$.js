require("$",function(n,r,o){o.config={name:'"cameroun"',description:'"Cameroun"',author:'"tolokoban"',version:'"0.0.4"',major:"0",minor:"0",revision:"4",date:"2017-01-05T10:34:26.000Z",consts:{tfw:"http://localhost/www/Cameroun"}};var t=null;o.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),t=n,window.localStorage&&window.localStorage.setItem("Language",n),n},o.intl=function(n,r){var t,a,e,i,g,u,l,w=n[o.lang()],s=r[0];for(l in n)break;if(!l)return s;if(!w&&(w=n[l],!w))return s;if(t=w[s],t||(w=n[l],t=w[s]),!t)return s;if(r.length>1){for(a="",g=0,e=0;e<t.length;e++)i=t.charAt(e),"$"===i?(a+=t.substring(g,e),e++,u=t.charCodeAt(e)-48,a+=u<0||u>=r.length?"$"+t.charAt(e):r[u],g=e+1):"\\"===i&&(a+=t.substring(g,e),e++,a+=t.charAt(e),g=e+1);a+=t.substr(g),t=a}return t}});
//# sourceMappingURL=$.js.map