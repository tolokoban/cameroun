require("$",function(n,r){n.config={name:"cameroun",description:"Cameroun",author:"tolokoban",version:"0.0.1",major:0,minor:0,revision:1,date:new Date(2016,8,17,13,9,41)};var a=null;n.lang=function(n){return void 0===n&&(window.localStorage&&(n=window.localStorage.getItem("Language")),n||(n=window.navigator.language,n||(n=window.navigator.browserLanguage,n||(n="fr"))),n=n.substr(0,2).toLowerCase()),a=n,window.localStorage&&window.localStorage.setItem("Language",n),n},n.intl=function(r,a){var o,t,e,i,g,u,l=r[n.lang()],w=a[0];if(!l)return w;if(o=l[w],!o)return w;if(a.length>1){for(t="",g=0,e=0;e<o.length;e++)i=o.charAt(e),"$"===i?(t+=o.substring(g,e),e++,u=o.charCodeAt(e)-48,t+=u<0||u>=a.length?"$"+o.charAt(e):a[u],g=e+1):"\\"===i&&(t+=o.substring(g,e),e++,t+=o.charAt(e),g=e+1);t+=o.substr(g),o=t}return o}});
//# sourceMappingURL=$.js.map