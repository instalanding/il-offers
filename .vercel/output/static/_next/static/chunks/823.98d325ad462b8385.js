"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[823],{8823:function(e,t,s){s.r(t);var n=s(7437),r=s(2265),l=s(7449),o=s.n(l),a=s(1877);t.default=e=>{let{value:t,style:s}=e,l=(0,r.useRef)(null),[c,u]=(0,r.useState)([]),[i,f]=(0,r.useState)([]),[d,m]=(0,r.useState)([]),[h,w]=(0,r.useState)(t),[y,p]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let e=document.createElement("div");e.innerHTML=t,p(t.includes("font-awesome")||t.includes("fontawesome")||t.includes("fa-")||t.includes("fas ")||t.includes("fab ")||t.includes("far "));let s=[];e.querySelectorAll("script[src]").forEach(e=>{let t=e.getAttribute("src");t&&s.push(t)}),u(s);let n=[];e.querySelectorAll('link[rel="stylesheet"]').forEach(e=>{let t=e.getAttribute("href");t&&n.push(t)}),f(n);let r=[];e.querySelectorAll("style").forEach(e=>{r.push(e.innerHTML)}),m(r),w(t)},[t]),(0,r.useEffect)(()=>{if(l.current&&(l.current.querySelectorAll("script").forEach(e=>{var t;let s=document.createElement("script");Array.from(e.attributes).forEach(e=>{s.setAttribute(e.name,e.value)}),s.innerHTML=e.innerHTML,null===(t=e.parentNode)||void 0===t||t.replaceChild(s,e)}),y&&window.FontAwesome))try{window.FontAwesome.dom.i2svg()}catch(e){console.error("Error reinitializing FontAwesome:",e)}},[h,y]),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(o(),{children:[y&&!i.some(e=>e.includes("fontawesome"))&&(0,n.jsx)("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"},"fontawesome-css"),i.map((e,t)=>(0,n.jsx)("link",{rel:"stylesheet",href:e},"style-".concat(t))),d.map((e,t)=>(0,n.jsx)("style",{dangerouslySetInnerHTML:{__html:e}},"inline-style-".concat(t)))]}),c.map((e,t)=>(0,n.jsx)(a.default,{src:e,strategy:"afterInteractive"},"script-".concat(t))),y&&!c.some(e=>e.includes("fontawesome"))&&(0,n.jsx)(a.default,{src:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js",strategy:"afterInteractive",onLoad:()=>{if(window.FontAwesome)try{window.FontAwesome.dom.i2svg()}catch(e){console.error("Error initializing FontAwesome:",e)}}},"fontawesome-js"),(0,n.jsx)("div",{ref:l,style:s,className:"text-editor-css",dangerouslySetInnerHTML:{__html:h}})]})}},7449:function(e,t){function s(){return null}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s}}),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)}}]);