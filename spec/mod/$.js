require("$",function(n,o,r){r.config={name:'"cameroun"',description:'"Cameroun"',author:'"tolokoban"',version:'"0.0.4"',major:"0",minor:"0",revision:"4",date:"2016-11-25T19:02:38.000Z",consts:{tfw:"http://tolokoban.org/Cameroun/"}};var t=null;r.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),t=n,window.localStorage&&window.localStorage.setItem("Language",n),n},r.intl=function(n,o){var t,a,e,i,g,u,l=n[r.lang()],s=o[0];if(!l)return s;if(t=l[s],!t)return s;if(o.length>1){for(a="",g=0,e=0;e<t.length;e++)i=t.charAt(e),"$"===i?(a+=t.substring(g,e),e++,u=t.charCodeAt(e)-48,a+=u<0||u>=o.length?"$"+t.charAt(e):o[u],g=e+1):"\\"===i&&(a+=t.substring(g,e),e++,a+=t.charAt(e),g=e+1);a+=t.substr(g),t=a}return t}});
//# sourceMappingURL=$.js.map