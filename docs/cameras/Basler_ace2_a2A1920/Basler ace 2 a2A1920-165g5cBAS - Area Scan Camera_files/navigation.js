!function(){var e={433:function(){var e,t;const n=null!==(e=window.NAVIGATION_FLYOUT_TIMEOUT_IN_MS)&&void 0!==e?e:200,l=null!==(t=window.NAVIGATION_ACTIVE_TIMEOUT_IN_MS)&&void 0!==t?t:200;function o(e){const t=Array.from(e.querySelectorAll(".nav-level")),o=Array.from(e.querySelectorAll(".nav-flyout"));let r=null,i=!1;function a(e,t){r&&window.clearTimeout(r),r=window.setTimeout(e,t)}function c(e){const t=e.getAttribute("data-teaser");t?function(e){var t,n;_();const l=document.getElementById(e);if(!l)return;l.classList.add("visible");const o=null!==(t=null===(n=l.closest(".nav-flyout"))||void 0===n?void 0:n.querySelectorAll(".nav-level.open").length)&&void 0!==t?t:0,r=l.querySelectorAll("img"),i=r[0],a=null==i?void 0:i.getAttribute("data-src"),c=null==i?void 0:i.getAttribute("data-src-large");if(1!==r.length||!c||!a)return;const u=0===o;i.src=u?c:a}(t):_()}function u(e){const t=e.getAttribute("data-ref");!function(e,t){const n=t.closest(".nav-level"),l=Number(null==n?void 0:n.getAttribute("data-level"))||0;v(l+1),s(l),d(t),e&&(e.classList.add("open"),b(e))}(t?document.getElementById(t):null,e),c(e)}function s(e){t.filter((t=>Number(t.getAttribute("data-level"))>=e)).forEach((e=>e.querySelectorAll(".active").forEach(y)))}function v(e){t.filter(m).filter((t=>Number(t.getAttribute("data-level"))>=e)).forEach(f)}function d(e){e.classList.add("active")}function f(e){e.classList.remove("open")}function m(e){return e.classList.contains("open")}function y(e){e.classList.remove("active")}function _(){e.querySelectorAll(".nav-teaser.visible").forEach((e=>e.classList.remove("visible")))}function E(){_(),v(2),s(1),e.querySelectorAll(".nav-level").forEach(b)}function L(e){var t,n;return null!==(t=null===(n=e.querySelector(".nav-flyout"))||void 0===n?void 0:n.classList.contains("open"))&&void 0!==t&&t}function A(){o.filter(m).map(f)}function b(e){e.scrollTo(0,0)}function g(e){var t;null===(t=e.closest(".nav-level"))||void 0===t||t.querySelectorAll(".nav__item.active").forEach(y)}e.querySelectorAll(".nav .nav__item").forEach((e=>{e.addEventListener("mouseenter",(()=>{g(e),d(e),o.some(L)?u(e):a((()=>u(e)),l)}))})),e.querySelectorAll(".nav .nav-first-level-item-link").forEach((e=>{e.addEventListener("mouseenter",(()=>{E(),c(e)}))})),e.querySelectorAll(".nav .nav__first-level-item").forEach((e=>{e.addEventListener("mouseenter",(()=>a((()=>{var t;A(),null===(t=e.querySelector(".nav-flyout"))||void 0===t||t.classList.add("open")}),n))),e.addEventListener("mouseleave",(()=>{i||a((()=>{E(),A()}),n)}))})),e.querySelectorAll(".nav-level").forEach((e=>{e.addEventListener("mouseenter",(()=>{!function(e){if(!e)return;const t=document.getElementById(e);t&&(g(t),d(t))}(e.getAttribute("data-parent-menu-id"))}))})),e.querySelectorAll(".nav-item-more, .nav-item-less").forEach((e=>{const t=e.closest(".nav-level");t&&e.addEventListener("click",(()=>function(e){if(e.classList.contains("show-all"))return e.classList.remove("show-all"),void(i=!0);e.classList.add("show-all")}(t)))})),e.querySelectorAll(".nav-flyout").forEach((e=>{e.addEventListener("mouseenter",(()=>{i=!1}))}))}window.addEventListener("DOMContentLoaded",(()=>{document.querySelectorAll(".nav").forEach(o)}))},836:function(){window.addEventListener("DOMContentLoaded",(()=>{var e;document.querySelectorAll(".nav-mobile__item").forEach((e=>{const t=e.querySelector(".nav-mobile__level");if(t){const n=e.querySelector(".nav-mobile__link");e.addEventListener("click",(e=>{e.preventDefault(),function(e,t){e.classList.add("nav-mobile__level--open"),null==t||t.classList.add("nav-mobile__link--open")}(t,n)}),{once:!0})}}));const t=document.querySelector("header.header"),n=document.querySelector(".lang-selector");null===(e=document.querySelector(".mobile-toggle-button"))||void 0===e||e.addEventListener("click",(()=>{null==t||t.classList.toggle("nav-opened"),null==n||n.classList.toggle("hideMobile")})),document.querySelectorAll(".nav-mobile__link-arrow").forEach((e=>e.addEventListener("click",(t=>{t.preventDefault(),function(e){var t,n,l;null===(t=e.closest(".nav-mobile__link"))||void 0===t||t.classList.toggle("nav-mobile__link--open"),null===(n=e.closest(".nav-mobile__item"))||void 0===n||null===(l=n.querySelector(".nav-mobile__level"))||void 0===l||l.classList.toggle("nav-mobile__level--open")}(e)}))))}))}},t={};function n(l){var o=t[l];if(void 0!==o)return o.exports;var r=t[l]={exports:{}};return e[l](r,r.exports,n),r.exports}n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var l in t)n.o(t,l)&&!n.o(e,l)&&Object.defineProperty(e,l,{enumerable:!0,get:t[l]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){"use strict";n(433),n(836)}()}();