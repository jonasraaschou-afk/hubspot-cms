(function () {
  // Polyfill for NodeList.prototype.forEach() in IE
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  /* Global javascript */
})();

/* Global javascript for the DND header */
window.addEventListener('load', ()=>{
  const __DND_HEADER = document.querySelector('.kl-dnd-header-area');
  if(__DND_HEADER){
    const __DND_HEADER_HEIGHT = __DND_HEADER.clientHeight;
    const __DND_HEADER_SPACER = document.querySelector(".kl-dnd-header-spacer")
    __DND_HEADER_SPACER.style.height = __DND_HEADER_HEIGHT + "px"
  }
})
