"use strict";var c=Object.create;var a=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var b=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty;var x=(e,o)=>{for(var n in o)a(e,n,{get:o[n],enumerable:!0})},f=(e,o,n,t)=>{if(o&&typeof o=="object"||typeof o=="function")for(let i of b(o))!k.call(e,i)&&i!==n&&a(e,i,{get:()=>o[i],enumerable:!(t=d(o,i))||t.enumerable});return e};var l=(e,o,n)=>(n=e!=null?c(m(e)):{},f(o||!e||!e.__esModule?a(n,"default",{value:e,enumerable:!0}):n,e)),K=e=>f(a({},"__esModule",{value:!0}),e);var w={};x(w,{default:()=>I});module.exports=K(w);var y=l(require("path")),u=require("fs");var r=(e,o)=>{let n=Object.assign({},e,o);for(let t in o)o[t]!==null&&o[t]!==void 0&&(typeof o[t]=="object"?n[t]=r(e[t],o[t]):n[t]=o[t]);return n};var P=l(require("path")),C=require("fs/promises");var s={blog:{basePath:"/blog"},docs:{basePath:"/docs"},wiki:{basePath:"/wiki"},extra:{basePath:"/extra"}},T=e=>typeof e=="function"?r(s,e(s)):r(s,e),h=e=>["kyubi.config.ts","kyubi.config.js","kyubi.config.json"].map(o=>y.default.join(e,o)).find(u.existsSync),j=e=>{let o=h(e);return T(o?require(o):{})};var g=j;var p=(e={},o={})=>{let n=r(g(process.cwd()),o);return{...e,pageExtensions:[...new Set([...e.pageExtensions||[],"js","jsx","ts","tsx","md","mdx"])],webpack(t,i){return t.module===void 0?t.module={rules:[]}:t.module.rules===void 0&&(t.module.rules=[]),t.module.rules.push({test:/\.mdx?$/,use:[i.defaultLoaders.babel,{loader:"kyubi-js/loader",options:{config:n}}]}),t}}},I=p;module.exports=p;
//# sourceMappingURL=index.js.map