require("x-widget",function(e,t,n){function r(t,n,r){try{var i=e(n),a=new i(r),u="function"==typeof a.element?a.element():a.element;u.setAttribute("id",t);var d=document.getElementById(t);return d&&d.parentNode.replaceChild(u,d),o(t,a),a}catch(e){throw console.error("[x-widget] Unable to create widget `"+n+"`!"),console.error("[x-widget] id = ",t,", args = ",r),Error(e)}}function i(e){var t,n=u.tag(e.elem);e.attr&&(u.att(n,e.attr),t=e.attr.id),Array.isArray(e.children)&&e.children.forEach(function(e){u.add(n,e)});var r,i,a={};if(e.prop)for(r in e.prop)i=e.prop[r],Object.defineProperty(a,r,{value:i,writable:!1,configurable:!1,enumerable:!0});return Object.defineProperty(a,"element",{value:n,writable:!1,configurable:!1,enumerable:!0}),void 0!==t&&o(t,a),a}function o(e,t){f[e]=t;var n=c[e];return void 0!==n&&window.setTimeout(function(){n.forEach(function(e){e(t)}),delete c[e]}),"function"==typeof t.element?t.element:t.element||t}var a=function(){function t(){return r(n,arguments)}var n={en:{}},r=e("$").intl;return t.all=n,t}(),u=e("dom"),d=e("tfw.data-binding"),f={},c={},l=function(e,t,n){return"string"==typeof e?r.call(this,e,t,n):i.call(this,e)};l.template=function(t){var n,r,i,a="",u={};for(n in t)r=t[n],"name"==n?a=r:"id"==n?i=r:"$"==n.charAt(0)&&(u[n.substr(1)]=r);var d=e(a),f=new d(u);return i&&o(i,f),"function"==typeof f.element?f.element():f.element||f},l.getById=function(e){if(!f[e])throw Error("[x-widget.getById()] ID not found: "+e+"!");return f[e]},l.onWidgetCreation=function(e,t){void 0===f[e]?void 0===c[e]?c[e]=[t]:c[e].push(t):window.setTimeout(function(){t(f[e])})},l.bind=function(t,n){var r,i,o,a,u,c=f[t];for(r in n)a=n[r].B,Array.isArray(a)&&a.forEach(function(e){if(i=f[e[0]],void 0===i)return void console.error('[x-widget:bind] Trying to bind attribute "'+r+'" of widget "'+t+'" to the unexisting widget "'+e[0]+'"!');if(o=e[1],2==e.length)d.bind(i,o,c,r);else{var n=e[2];d.bind(i,o,function(){c[r]=n})}}),u=n[r].S,Array.isArray(u)&&u.forEach(function(t){var n=APP,i=t;Array.isArray(t)&&(n=e(t[0]),i=t[1]),i=n[i],"function"!=typeof i?console.error("[x-widget:bind] slot not found: ",t):d.bind(c,r,i)})},t.exports=l,t.exports._=a});
//# sourceMappingURL=x-widget.js.map