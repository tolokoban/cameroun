require("tfw.storage",function(t,n,e){function r(){return u(s,arguments)}function o(t){return function(n,e){var r=t.getItem(n);if(null===r)return e;try{r=JSON.parse(r)}catch(t){}return r}}function i(t){return function(n,e){t.setItem(n,JSON.stringify(e))}}var s={en:{}},u=t("$").intl;e.local={get:o(window.localStorage),set:i(window.localStorage)},e.session={get:o(window.sessionStorage),set:i(window.sessionStorage)},n.exports._=r});
//# sourceMappingURL=tfw.storage.js.map