require("tfw.pointer-events",function(e,t,o){function n(e){var t=this;this._slots={},this._eventListeners=[],Object.defineProperty(n.prototype,"element",{value:e,writable:!1,configurable:!0,enumerable:!0}),a.call(t,e,"touchstart",function(o){d.touchDevice||(d.touchDevice=!0,document.body.removeEventListener("mousedown",l,!0),document.body.removeEventListener("mousemove",p,!0),document.body.removeEventListener("mouseup",v,!0));var n=t._slots;1==o.touches.length&&(d.rect=e.getBoundingClientRect(),d.bodyMoveX=o.touches[0].clientX,d.bodyMoveY=o.touches[0].clientY,d.bodyDownX=o.touches[0].clientX,d.bodyDownY=o.touches[0].clientY,d.targetX=o.touches[0].clientX-d.rect.left,d.targetY=o.touches[0].clientY-d.rect.top,d.time=Date.now(),n.down&&n.down({action:"down",target:e,x:d.targetX,y:d.targetY,stopPropagation:o.stopPropagation.bind(o),preventDefault:o.preventDefault.bind(o)}))}),a.call(t,e,"touchmove",function(o){var n=d.bodyMoveX,a=d.bodyMoveY;d.bodyMoveX=o.touches[0].clientX,d.bodyMoveY=o.touches[0].clientY;var r=t._slots;r.drag&&r.drag({action:"drag",target:e,x0:d.targetX,y0:d.targetY,x:d.bodyMoveX-d.rect.left,y:d.bodyMoveY-d.rect.top,dx:d.bodyMoveX-d.bodyDownX,dy:d.bodyMoveY-d.bodyDownY,vx:d.bodyMoveX-n,vy:d.bodyMoveY-a,stopPropagation:o.stopPropagation.bind(o),preventDefault:o.preventDefault.bind(o)})}),a.call(t,e,"touchend",function(e){var o=t._slots,n=d.bodyMoveX-d.bodyDownX,a=d.bodyMoveY-d.bodyDownY;if(o.up&&o.up({action:"up",target:t.element,x:d.bodyMoveX-d.rect.left,y:d.bodyMoveY-d.rect.top,dx:n,dy:a,stopPropagation:e.stopPropagation.bind(e),preventDefault:e.preventDefault.bind(e)}),n*n+a*a<256){var r=Date.now();d.lastTapTime>0&&(o.doubletap&&r-d.lastTapTime<400?o.doubletap({action:"doubletap",target:t.element,x:d.bodyMoveX-d.rect.left,y:d.bodyMoveY-d.rect.top,stopPropagation:e.stopPropagation.bind(e),preventDefault:e.preventDefault.bind(e)}):d.lastTapTime=0),o.tap&&0==d.lastTapTime&&(e.stopPropagation(),e.preventDefault(),o.tap({action:"tap",target:t.element,x:d.bodyMoveX-d.rect.left,y:d.bodyMoveY-d.rect.top,stopPropagation:e.stopPropagation.bind(e),preventDefault:e.preventDefault.bind(e)})),d.lastTapTime=r}}),a.call(t,e,"mousedown",function(o){if(!d.touchDevice){var n=t._slots,a=e.getBoundingClientRect();d.target=t,d.targetX=o.clientX-a.left,d.targetY=o.clientY-a.top,n.down&&n.down({action:"down",target:e,x:d.targetX,y:d.targetY,stopPropagation:o.stopPropagation.bind(o),preventDefault:o.preventDefault.bind(o)})}}),a.call(t,e,"mousemove",function(o){var n=t._slots;if(n.move){var a=e.getBoundingClientRect(),r=o.target.getBoundingClientRect();n.move({target:e,action:"move",x:o.offsetX+r.left-a.left,y:o.offsetY+r.top-a.top})}}),Object.defineProperty(this,"element",{value:e,writable:!0,configurable:!0,enumerable:!0})}function a(e,t,o,n){e.addEventListener(t,o,n),this._eventListeners.push([e,t,o,n])}var r=function(){function t(){return n(o,arguments)}var o={en:{}},n=e("$").intl;return t.all=o,t}(),i="onwheel"in document.createElement("div")?"wheel":void 0!==document.onmousewheel?"mousewheel":"DOMMouseScroll",d={touchDevice:!1,target:null,targetX:0,targetY:0,bodyDownX:0,bodyDownY:0,bodyMoveX:-1,bodyMoveY:-1,bodyMoveLastX:-1,bodyMoveLastY:-1,onDrag:null,lastTapTime:0},l=function(e){d.touchDevice||(d.bodyDownX=e.pageX,d.bodyDownY=e.pageY,d.bodyMoveX=e.pageX,d.bodyMoveY=e.pageY,d.bodyMoveLastX=e.pageX,d.bodyMoveLastY=e.pageY)},p=function(e){if(!d.touchDevice&&d.target&&(e.stopPropagation(),e.preventDefault(),d.bodyMoveLastX=d.bodyMoveX,d.bodyMoveLastY=d.bodyMoveY,d.bodyMoveX=e.pageX,d.bodyMoveY=e.pageY,d.target)){var t=d.target._slots;"function"==typeof t.drag&&t.drag({action:"drag",target:d.target.element,x0:d.targetX,y0:d.targetY,x:d.targetX+d.bodyMoveX-d.bodyDownX,y:d.targetY+d.bodyMoveY-d.bodyDownY,dx:d.bodyMoveX-d.bodyDownX,dy:d.bodyMoveY-d.bodyDownY,vx:d.bodyMoveX-d.bodyMoveLastX,vy:d.bodyMoveY-d.bodyMoveLastY})}},v=function(e){if(!d.touchDevice&&d.target){e.stopPropagation(),e.preventDefault();var t=Date.now(),o=d.target._slots,n=e.pageX-d.bodyDownX,a=e.pageY-d.bodyDownY;o.up&&o.up({action:"up",target:d.target.element,x:d.targetX+n,y:d.targetY+a,dx:n,dy:a}),n*n+a*a<1024&&(d.lastTapTime>0&&(o.doubletap&&t-d.lastTapTime<400?o.doubletap({action:"doubletap",target:d.target.element,x:d.targetX+n,y:d.targetY+a}):d.lastTapTime=0),o.tap&&0==d.lastTapTime&&o.tap({action:"tap",target:d.target.element,x:d.targetX+n,y:d.targetY+a}),d.lastTapTime=t),delete d.target}};document.body.addEventListener("mousedown",l,!0),document.body.addEventListener("mousemove",p,!0),document.body.addEventListener("mouseup",v,!0),n.prototype.on=function(e,t){var o=this,n=this._slots;return"function"==typeof t&&(n[e]=t),"wheel"==e&&a.call(o,this.element,i,function(e){var t=o.element.getBoundingClientRect();n.wheel({target:o.element,action:"wheel",delta:e.deltaY,x:e.clientX-t.left,y:e.clientY-t.top,stopPropagation:e.stopPropagation.bind(e),preventDefault:e.preventDefault.bind(e)})}),this},n.prototype.off=function(){this._eventListeners.forEach(function(e){var t=e[0],o=e[1],n=e[2],a=e[3];t.removeEventListener(o,n,a)})},t.exports=n,t.exports._=r});
//# sourceMappingURL=tfw.pointer-events.js.map