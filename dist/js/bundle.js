(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _Banana = require("./modules/Banana");

(0, _Banana.banana)();
var box = document.querySelector("#box");
box.textContent = "I am coming from JS.";
var header = document.querySelector(".main-header");
var homeIntro = document.querySelector(".home-intro");
var sectionOneOptions = {
  rootMargin: "-50% 0% 0% 0%"
};
var sectionOneObserver = new IntersectionObserver(function (entries, sectionOneObserver) {
  entries.forEach(function (entry) {
    console.log(entry);

    if (!entry.isIntersecting) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}, sectionOneOptions);
sectionOneObserver.observe(homeIntro);

},{"./modules/Banana":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.banana = void 0;

var banana = function banana() {
  console.log('Banana!');
};

exports.banana = banana;

},{}]},{},[1])

//# sourceMappingURL=bundle.js.map
