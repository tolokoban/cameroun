require("app",function(e,t,n){var o=function(){function t(){return o(n,arguments)}var n={en:{"title-home":"Search / Register a patient"},fr:{"title-home":"Rechercher / Enregistrer un patient"}},o=e("$").intl;return t.all=n,t}();e("font.josefin");var a=(e("dom"),e("form"),e("structure")),i={loading:e("page.loading"),home:e("page.home"),patient:e("page.patient"),visit:e("page.visit")};n.start=function(){location.hash="#Loading",a.load().then(function(){location.hash="#Home"})},n.onPage=function(e){var t=i[e.toLowerCase()];"undefined"!=typeof t&&t.onPage()},t.exports._=o});
//# sourceMappingURL=app.js.map