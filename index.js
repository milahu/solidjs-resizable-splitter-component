const lt=function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))l(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&l(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerpolicy&&(s.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?s.credentials="include":i.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function l(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}};lt();const _={};function Te(e){_.context=e}function it(){return{..._.context,id:`${_.context.id}${_.context.count++}-`,count:0}}let ot=Ue;const ye={},K=1,Z=2,Be={owned:null,cleanups:null,context:null,owner:null};var E=null;let ae=null,B=null,G=null,A=null,O=null,Se=0;function st(e,n){const t=B,l=E,i=e.length===0,s=i?Be:{owned:null,cleanups:null,context:null,owner:n||l},r=i?e:()=>e(()=>Ee(s));E=s,B=null;try{return Ae(r,!0)}finally{B=t,E=l}}function me(e,n,t){const l=ct(e,n,!1,K);De(l)}function rt(e){if(G)return e();let n;const t=G=[];try{n=e()}finally{G=null}return Ae(()=>{for(let l=0;l<t.length;l+=1){const i=t[l];if(i.pending!==ye){const s=i.pending;i.pending=ye,Ie(i,s)}}},!1),n}function ve(e){let n,t=B;return B=null,n=e(),B=t,n}function Ie(e,n,t){if(G)return e.pending===ye&&G.push(e),e.pending=n,n;if(e.comparator&&e.comparator(e.value,n))return n;let l=!1;return e.value=n,e.observers&&e.observers.length&&Ae(()=>{for(let i=0;i<e.observers.length;i+=1){const s=e.observers[i];l&&ae.disposed.has(s),(l&&!s.tState||!l&&!s.state)&&(s.pure?A.push(s):O.push(s),s.observers&&Fe(s)),l||(s.state=K)}if(A.length>1e6)throw A=[],new Error},!1),n}function De(e){if(!e.fn)return;Ee(e);const n=E,t=B,l=Se;B=E=e,ft(e,e.value,l),B=t,E=n}function ft(e,n,t){let l;try{l=e.fn(n)}catch(i){He(i)}(!e.updatedAt||e.updatedAt<=t)&&(e.observers&&e.observers.length?Ie(e,l):e.value=l,e.updatedAt=t)}function ct(e,n,t,l=K,i){const s={fn:e,state:l,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:E,context:null,pure:t};return E===null||E!==Be&&(E.owned?E.owned.push(s):E.owned=[s]),s}function Ye(e){const n=ae;if(e.state===0||n)return;if(e.state===Z||n)return be(e);if(e.suspense&&ve(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<Se);)(e.state||n)&&t.push(e);for(let l=t.length-1;l>=0;l--)if(e=t[l],e.state===K||n)De(e);else if(e.state===Z||n){const i=A;A=null,be(e,t[0]),A=i}}function Ae(e,n){if(A)return e();let t=!1;n||(A=[]),O?t=!0:O=[],Se++;try{const l=e();return at(t),l}catch(l){A||(O=null),He(l)}}function at(e){A&&(Ue(A),A=null),!e&&(O.length?rt(()=>{ot(O),O=null}):O=null)}function Ue(e){for(let n=0;n<e.length;n++)Ye(e[n])}function be(e,n){const t=ae;e.state=0;for(let l=0;l<e.sources.length;l+=1){const i=e.sources[l];i.sources&&(i.state===K||t?i!==n&&Ye(i):(i.state===Z||t)&&be(i,n))}}function Fe(e){const n=ae;for(let t=0;t<e.observers.length;t+=1){const l=e.observers[t];(!l.state||n)&&(l.state=Z,l.pure?A.push(l):O.push(l),l.observers&&Fe(l))}}function Ee(e){let n;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),l=e.sourceSlots.pop(),i=t.observers;if(i&&i.length){const s=i.pop(),r=t.observerSlots.pop();l<i.length&&(s.sourceSlots[r]=l,i[l]=s,t.observerSlots[l]=r)}}if(e.owned){for(n=0;n<e.owned.length;n++)Ee(e.owned[n]);e.owned=null}if(e.cleanups){for(n=0;n<e.cleanups.length;n++)e.cleanups[n]();e.cleanups=null}e.state=0,e.context=null}function He(e){throw e}let ut=!1;function W(e,n){if(ut&&_.context){const t=_.context;Te(it());const l=ve(()=>e(n||{}));return Te(t),l}return ve(()=>e(n||{}))}function dt(e,n,t){let l=t.length,i=n.length,s=l,r=0,o=0,c=n[i-1].nextSibling,a=null;for(;r<i||o<s;){if(n[r]===t[o]){r++,o++;continue}for(;n[i-1]===t[s-1];)i--,s--;if(i===r){const f=s<l?o?t[o-1].nextSibling:t[s-o]:c;for(;o<s;)e.insertBefore(t[o++],f)}else if(s===o)for(;r<i;)(!a||!a.has(n[r]))&&n[r].remove(),r++;else if(n[r]===t[s-1]&&t[o]===n[i-1]){const f=n[--i].nextSibling;e.insertBefore(t[o++],n[r++].nextSibling),e.insertBefore(t[--s],f),n[i]=t[s]}else{if(!a){a=new Map;let p=o;for(;p<s;)a.set(t[p],p++)}const f=a.get(n[r]);if(f!=null)if(o<f&&f<s){let p=r,h=1,x;for(;++p<i&&p<s&&!((x=a.get(n[p]))==null||x!==f+h);)h++;if(h>f-o){const C=n[r];for(;o<f;)e.insertBefore(t[o++],C)}else e.replaceChild(t[o++],n[r++])}else r++;else n[r++].remove()}}}function ht(e,n,t){let l;return st(i=>{l=i,n===document?e():Xe(n,e(),n.firstChild?null:void 0,t)}),()=>{l(),n.textContent=""}}function ue(e,n,t){const l=document.createElement("template");l.innerHTML=e;let i=l.content.firstChild;return t&&(i=i.firstChild),i}function Xe(e,n,t,l){if(t!==void 0&&!l&&(l=[]),typeof n!="function")return ee(e,n,l,t);me(i=>ee(e,n(),i,t),l)}function ee(e,n,t,l,i){for(_.context&&!t&&(t=[...e.childNodes]);typeof t=="function";)t=t();if(n===t)return t;const s=typeof n,r=l!==void 0;if(e=r&&t[0]&&t[0].parentNode||e,s==="string"||s==="number"){if(_.context)return t;if(s==="number"&&(n=n.toString()),r){let o=t[0];o&&o.nodeType===3?o.data=n:o=document.createTextNode(n),t=X(e,t,l,o)}else t!==""&&typeof t=="string"?t=e.firstChild.data=n:t=e.textContent=n}else if(n==null||s==="boolean"){if(_.context)return t;t=X(e,t,l)}else{if(s==="function")return me(()=>{let o=n();for(;typeof o=="function";)o=o();t=ee(e,o,t,l)}),()=>t;if(Array.isArray(n)){const o=[],c=t&&Array.isArray(t);if(we(o,n,t,i))return me(()=>t=ee(e,o,t,l,!0)),()=>t;if(_.context){for(let a=0;a<o.length;a++)if(o[a].parentNode)return t=o}if(o.length===0){if(t=X(e,t,l),r)return t}else c?t.length===0?ze(e,o,l):dt(e,t,o):(t&&X(e),ze(e,o));t=o}else if(n instanceof Node){if(_.context&&n.parentNode)return t=r?[n]:n;if(Array.isArray(t)){if(r)return t=X(e,t,l,n);X(e,t,null,n)}else t==null||t===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);t=n}}return t}function we(e,n,t,l){let i=!1;for(let s=0,r=n.length;s<r;s++){let o=n[s],c=t&&t[s];if(o instanceof Node)e.push(o);else if(!(o==null||o===!0||o===!1))if(Array.isArray(o))i=we(e,o,c)||i;else if(typeof o=="function")if(l){for(;typeof o=="function";)o=o();i=we(e,Array.isArray(o)?o:[o],c)||i}else e.push(o),i=!0;else{const a=String(o);c&&c.nodeType===3&&c.data===a?e.push(c):e.push(document.createTextNode(a))}}return i}function ze(e,n,t){for(let l=0,i=n.length;l<i;l++)e.insertBefore(n[l],t)}function X(e,n,t,l){if(t===void 0)return e.textContent="";const i=l||document.createTextNode("");if(n.length){let s=!1;for(let r=n.length-1;r>=0;r--){const o=n[r];if(i!==o){const c=o.parentNode===e;!s&&!r?c?e.replaceChild(i,o):e.insertBefore(i,t):c&&o.remove()}else s=!0}}else e.insertBefore(i,t);return[i]}const z={};function pt(e){z.context=e}const gt=(e,n)=>e===n,yt=Symbol("solid-track"),te={equals:gt};let Re=Ke;const Y=1,ne=2,je={owned:null,cleanups:null,context:null,owner:null};var b=null;let H=null,m=null,w=null,I=null,Ce=0;function ge(e,n){const t=m,l=b,i=e.length===0,s=i?je:{owned:null,cleanups:null,context:null,owner:n||l},r=i?e:()=>e(()=>V(()=>Ne(s)));b=s,m=null;try{return J(r,!0)}finally{m=t,b=l}}function mt(e,n){n=n?Object.assign({},te,n):te;const t={value:e,observers:null,observerSlots:null,comparator:n.equals||void 0},l=i=>(typeof i=="function"&&(i=i(t.value)),Ge(t,i));return[We.bind(t),l]}function j(e,n,t){const l=Le(e,n,!1,Y);Q(l)}function vt(e,n,t){Re=St;const l=Le(e,n,!1,Y);l.user=!0,I?I.push(l):Q(l)}function le(e,n,t){t=t?Object.assign({},te,t):te;const l=Le(e,n,!0,0);return l.observers=null,l.observerSlots=null,l.comparator=t.equals||void 0,Q(l),We.bind(l)}function V(e){let n,t=m;return m=null,n=e(),m=t,n}function bt(e){vt(()=>V(e))}function qe(e){return b===null||(b.cleanups===null?b.cleanups=[e]:b.cleanups.push(e)),e}function wt(e){const n=le(e),t=le(()=>xe(n()));return t.toArray=()=>{const l=t();return Array.isArray(l)?l:l!=null?[l]:[]},t}function We(){const e=H;if(this.sources&&(this.state||e))if(this.state===Y||e)Q(this);else{const n=w;w=null,J(()=>oe(this),!1),w=n}if(m){const n=this.observers?this.observers.length:0;m.sources?(m.sources.push(this),m.sourceSlots.push(n)):(m.sources=[this],m.sourceSlots=[n]),this.observers?(this.observers.push(m),this.observerSlots.push(m.sources.length-1)):(this.observers=[m],this.observerSlots=[m.sources.length-1])}return this.value}function Ge(e,n,t){let l=e.value;return(!e.comparator||!e.comparator(l,n))&&(e.value=n,e.observers&&e.observers.length&&J(()=>{for(let i=0;i<e.observers.length;i+=1){const s=e.observers[i],r=H&&H.running;r&&H.disposed.has(s),(r&&!s.tState||!r&&!s.state)&&(s.pure?w.push(s):I.push(s),s.observers&&Ve(s)),r||(s.state=Y)}if(w.length>1e6)throw w=[],new Error},!1)),n}function Q(e){if(!e.fn)return;Ne(e);const n=b,t=m,l=Ce;m=b=e,xt(e,e.value,l),m=t,b=n}function xt(e,n,t){let l;try{l=e.fn(n)}catch(i){e.pure&&(e.state=Y),Qe(i)}(!e.updatedAt||e.updatedAt<=t)&&(e.updatedAt!=null&&"observers"in e?Ge(e,l):e.value=l,e.updatedAt=t)}function Le(e,n,t,l=Y,i){const s={fn:e,state:l,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:b,context:null,pure:t};return b===null||b!==je&&(b.owned?b.owned.push(s):b.owned=[s]),s}function ie(e){const n=H;if(e.state===0||n)return;if(e.state===ne||n)return oe(e);if(e.suspense&&V(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<Ce);)(e.state||n)&&t.push(e);for(let l=t.length-1;l>=0;l--)if(e=t[l],e.state===Y||n)Q(e);else if(e.state===ne||n){const i=w;w=null,J(()=>oe(e,t[0]),!1),w=i}}function J(e,n){if(w)return e();let t=!1;n||(w=[]),I?t=!0:I=[],Ce++;try{const l=e();return $t(t),l}catch(l){w||(I=null),Qe(l)}}function $t(e){if(w&&(Ke(w),w=null),e)return;const n=I;I=null,n.length&&J(()=>Re(n),!1)}function Ke(e){for(let n=0;n<e.length;n++)ie(e[n])}function St(e){let n,t=0;for(n=0;n<e.length;n++){const l=e[n];l.user?e[t++]=l:ie(l)}for(z.context&&pt(),n=0;n<t;n++)ie(e[n])}function oe(e,n){const t=H;e.state=0;for(let l=0;l<e.sources.length;l+=1){const i=e.sources[l];i.sources&&(i.state===Y||t?i!==n&&ie(i):(i.state===ne||t)&&oe(i,n))}}function Ve(e){const n=H;for(let t=0;t<e.observers.length;t+=1){const l=e.observers[t];(!l.state||n)&&(l.state=ne,l.pure?w.push(l):I.push(l),l.observers&&Ve(l))}}function Ne(e){let n;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),l=e.sourceSlots.pop(),i=t.observers;if(i&&i.length){const s=i.pop(),r=t.observerSlots.pop();l<i.length&&(s.sourceSlots[r]=l,i[l]=s,t.observerSlots[l]=r)}}if(e.owned){for(n=0;n<e.owned.length;n++)Ne(e.owned[n]);e.owned=null}if(e.cleanups){for(n=0;n<e.cleanups.length;n++)e.cleanups[n]();e.cleanups=null}e.state=0,e.context=null}function At(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function Qe(e){throw e=At(e),e}function xe(e){if(typeof e=="function"&&!e.length)return xe(e());if(Array.isArray(e)){const n=[];for(let t=0;t<e.length;t++){const l=xe(e[t]);Array.isArray(l)?n.push.apply(n,l):n.push(l)}return n}return e}const Et=Symbol("fallback");function Me(e){for(let n=0;n<e.length;n++)e[n]()}function Ct(e,n,t={}){let l=[],i=[],s=[],r=0,o=n.length>1?[]:null;return qe(()=>Me(s)),()=>{let c=e()||[],a,f;return c[yt],V(()=>{let h=c.length,x,C,U,u,d,g,y,$,S;if(h===0)r!==0&&(Me(s),s=[],l=[],i=[],r=0,o&&(o=[])),t.fallback&&(l=[Et],i[0]=ge(L=>(s[0]=L,t.fallback())),r=1);else if(r===0){for(i=new Array(h),f=0;f<h;f++)l[f]=c[f],i[f]=ge(p);r=h}else{for(U=new Array(h),u=new Array(h),o&&(d=new Array(h)),g=0,y=Math.min(r,h);g<y&&l[g]===c[g];g++);for(y=r-1,$=h-1;y>=g&&$>=g&&l[y]===c[$];y--,$--)U[$]=i[y],u[$]=s[y],o&&(d[$]=o[y]);for(x=new Map,C=new Array($+1),f=$;f>=g;f--)S=c[f],a=x.get(S),C[f]=a===void 0?-1:a,x.set(S,f);for(a=g;a<=y;a++)S=l[a],f=x.get(S),f!==void 0&&f!==-1?(U[f]=i[a],u[f]=s[a],o&&(d[f]=o[a]),f=C[f],x.set(S,f)):s[a]();for(f=g;f<h;f++)f in U?(i[f]=U[f],s[f]=u[f],o&&(o[f]=d[f],o[f](f))):i[f]=ge(p);i=i.slice(0,r=h),l=c.slice(0)}return i});function p(h){if(s[f]=h,o){const[x,C]=mt(f);return o[f]=C,n(c[f],x)}return n(c[f])}}}function se(e,n){return V(()=>e(n||{}))}function Je(e){const n="fallback"in e&&{fallback:()=>e.fallback};return le(Ct(()=>e.each,e.children,n||void 0))}function Lt(e,n,t){let l=t.length,i=n.length,s=l,r=0,o=0,c=n[i-1].nextSibling,a=null;for(;r<i||o<s;){if(n[r]===t[o]){r++,o++;continue}for(;n[i-1]===t[s-1];)i--,s--;if(i===r){const f=s<l?o?t[o-1].nextSibling:t[s-o]:c;for(;o<s;)e.insertBefore(t[o++],f)}else if(s===o)for(;r<i;)(!a||!a.has(n[r]))&&n[r].remove(),r++;else if(n[r]===t[s-1]&&t[o]===n[i-1]){const f=n[--i].nextSibling;e.insertBefore(t[o++],n[r++].nextSibling),e.insertBefore(t[--s],f),n[i]=t[s]}else{if(!a){a=new Map;let p=o;for(;p<s;)a.set(t[p],p++)}const f=a.get(n[r]);if(f!=null)if(o<f&&f<s){let p=r,h=1,x;for(;++p<i&&p<s&&!((x=a.get(n[p]))==null||x!==f+h);)h++;if(h>f-o){const C=n[r];for(;o<f;)e.insertBefore(t[o++],C)}else e.replaceChild(t[o++],n[r++])}else r++;else n[r++].remove()}}}const ke="_$DX_DELEGATE";function _e(e,n,t){const l=document.createElement("template");l.innerHTML=e;let i=l.content.firstChild;return t&&(i=i.firstChild),i}function Nt(e,n=window.document){const t=n[ke]||(n[ke]=new Set);for(let l=0,i=e.length;l<i;l++){const s=e[l];t.has(s)||(t.add(s),n.addEventListener(s,_t))}}function Ze(e,n){n==null?e.removeAttribute("class"):e.className=n}function re(e,n,t={}){const l=e.style,i=typeof t=="string";if(n==null&&i||typeof n=="string")return l.cssText=n;i&&(l.cssText=void 0,t={}),n||(n={});let s,r;for(r in t)n[r]==null&&l.removeProperty(r),delete t[r];for(r in n)s=n[r],s!==t[r]&&(l.setProperty(r,s),t[r]=s);return t}function de(e,n,t,l){if(t!==void 0&&!l&&(l=[]),typeof n!="function")return fe(e,n,l,t);j(i=>fe(e,n(),i,t),l)}function _t(e){const n=`$$${e.type}`;let t=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==t&&Object.defineProperty(e,"target",{configurable:!0,value:t}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),z.registry&&!z.done&&(z.done=!0,document.querySelectorAll("[id^=pl-]").forEach(l=>l.remove()));t!==null;){const l=t[n];if(l&&!t.disabled){const i=t[`${n}Data`];if(i!==void 0?l.call(t,i,e):l.call(t,e),e.cancelBubble)return}t=t.host&&t.host!==t&&t.host instanceof Node?t.host:t.parentNode}}function fe(e,n,t,l,i){for(z.context&&!t&&(t=[...e.childNodes]);typeof t=="function";)t=t();if(n===t)return t;const s=typeof n,r=l!==void 0;if(e=r&&t[0]&&t[0].parentNode||e,s==="string"||s==="number"){if(z.context)return t;if(s==="number"&&(n=n.toString()),r){let o=t[0];o&&o.nodeType===3?o.data=n:o=document.createTextNode(n),t=R(e,t,l,o)}else t!==""&&typeof t=="string"?t=e.firstChild.data=n:t=e.textContent=n}else if(n==null||s==="boolean"){if(z.context)return t;t=R(e,t,l)}else{if(s==="function")return j(()=>{let o=n();for(;typeof o=="function";)o=o();t=fe(e,o,t,l)}),()=>t;if(Array.isArray(n)){const o=[],c=t&&Array.isArray(t);if($e(o,n,t,i))return j(()=>t=fe(e,o,t,l,!0)),()=>t;if(z.context){if(!o.length)return t;for(let a=0;a<o.length;a++)if(o[a].parentNode)return t=o}if(o.length===0){if(t=R(e,t,l),r)return t}else c?t.length===0?Pe(e,o,l):Lt(e,t,o):(t&&R(e),Pe(e,o));t=o}else if(n instanceof Node){if(z.context&&n.parentNode)return t=r?[n]:n;if(Array.isArray(t)){if(r)return t=R(e,t,l,n);R(e,t,null,n)}else t==null||t===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);t=n}}return t}function $e(e,n,t,l){let i=!1;for(let s=0,r=n.length;s<r;s++){let o=n[s],c=t&&t[s];if(o instanceof Node)e.push(o);else if(!(o==null||o===!0||o===!1))if(Array.isArray(o))i=$e(e,o,c)||i;else if(typeof o=="function")if(l){for(;typeof o=="function";)o=o();i=$e(e,Array.isArray(o)?o:[o],Array.isArray(c)?c:[c])||i}else e.push(o),i=!0;else{const a=String(o);c&&c.nodeType===3&&c.data===a?e.push(c):e.push(document.createTextNode(a))}}return i}function Pe(e,n,t){for(let l=0,i=n.length;l<i;l++)e.insertBefore(n[l],t)}function R(e,n,t,l){if(t===void 0)return e.textContent="";const i=l||document.createTextNode("");if(n.length){let s=!1;for(let r=n.length-1;r>=0;r--){const o=n[r];if(i!==o){const c=o.parentNode===e;!s&&!r?c?e.replaceChild(i,o):e.insertBefore(i,t):c&&o.remove()}else s=!0}}else e.insertBefore(i,t);return[i]}const et=_e("<div></div>"),Tt=_e('<div class="layout-cell"><div class="top"><div class="frame left"></div><div class="frame center"></div><div class="frame right"></div></div><div class="middle"><div class="frame left"></div><div class="center"></div><div class="frame right"></div></div><div class="bottom"><div class="frame left"></div><div class="frame center"></div><div class="frame right"></div></div></div>'),zt=_e("<style></style>");function Oe(e){return(()=>{const n=et.cloneNode(!0);return de(n,se(Je,{get each(){return e.children},children:t=>t instanceof Function||t instanceof Element&&(t.classList.contains("split-vertical")||t.classList.contains("split-horizontal"))?t:se(ce,{children:t})})),j(t=>{const l=["split-vertical",e.reverse?"layout-reverse":""].join(" "),i={width:"100%",height:"100%",overflow:"auto",...e.style||{}};return l!==t._v$&&Ze(n,t._v$=l),t._v$2=re(n,i,t._v$2),t},{_v$:void 0,_v$2:void 0}),n})()}function Mt(e){return(()=>{const n=et.cloneNode(!0);return de(n,se(Je,{get each(){return e.children},children:t=>t instanceof Function||t instanceof Element&&(t.classList.contains("split-vertical")||t.classList.contains("split-horizontal"))?t:se(ce,{children:t})})),j(t=>{const l=["split-horizontal",e.reverse?"layout-reverse":""].join(" "),i={width:"100%",height:"100%",overflow:"auto",...e.style||{}};return l!==t._v$3&&Ze(n,t._v$3=l),t._v$4=re(n,i,t._v$4),t},{_v$3:void 0,_v$4:void 0}),n})()}function ce(e){bt(()=>{document.body.addEventListener("pointerup",p),document.body.addEventListener("pointerleave",p)}),qe(()=>{document.body.removeEventListener("pointerup",p),document.body.removeEventListener("pointerleave",p),document.removeEventListener("pointermove",t)});let n=null,t=null,l=null,i="",s=null,r=null,o=null,c=null,a="";function f(u){const d=u.target;s=d,o=d.parentNode.parentNode;const g=s.classList,y=s.parentNode.classList;c=o,l=o.parentNode;const $=g.contains("right"),S=g.contains("left"),L=y.contains("top");y.contains("bottom");const T=S||$?"split-horizontal":"split-vertical",M="offset";for(a=T=="split-vertical"?M+"Height":M+"Width";l&&c&&!l.classList.contains(T);)c=c.parentElement,l=l.parentElement;if(!l){console.log("error. activeMoveParent not found");return}if(!c){console.log("error. activeMoveCell_real not found");return}document.body.classList.add("--layout-is-moving"),n=d.cloneNode(!0);const v=n.style;v.position="absolute",v.zIndex=10,document.body.appendChild(n),i=l.style.overflow,l.style.overflow="hidden";const D=1;T=="split-vertical"?(r=!0,v.marginTop=d.offsetTop-(L?d.offsetHeight:0)+D/2-u.clientY+"px",v.left=l.offsetLeft+"px",v.top=u.clientY+"px",v.height=d.offsetHeight+"px",v.width=l.offsetWidth+"px",n.className="split-vertical-resizer",t=function(N){v.top=N.clientY+"px",h(N)}):(r=!1,n.className="split-horizontal-resizer",v.marginLeft=d.offsetLeft-(S?d.offsetWidth:0)+D/2-u.clientX+"px",v.top=l.offsetTop+"px",v.left=u.clientX+"px",v.height=l.offsetHeight+"px",v.width=d.offsetWidth+"px",t=function(N){v.left=N.clientX+"px",h(N)}),document.addEventListener("pointermove",t)}function p(u){!t||(document.body.classList.remove("--layout-is-moving"),document.body.removeChild(n),n=null,l.style.overflow=i,document.removeEventListener("pointermove",t),t=null,u.type!="pointerleave"&&h(u))}function h(u){const d=s.classList,g=s.parentNode.classList;l[a];const y=Array.from(l.children),$=y[0],S=y.slice(-1)[0];let L=y.map(P=>P[a]),T=L.reduce((P,F)=>P+F,0),M=y.indexOf(c);const v=d.contains("right"),D=d.contains("left"),N=g.contains("top"),he=g.contains("bottom"),k=r?u.movementY:u.movementX;if(c==$&&(D||N)||c==S&&(v||he))console.log("TODO resize from container start/end"),T+=k;else{let P=0,F=0;D||N?(P=M-1,F=M):(P=M,F=M+1),L[P]+=k,L[F]-=k;for(let[nt,q]of y.entries()){const pe=L[nt]/T*100+"%";q.style.flexBasis=pe,q.parentElement.classList.contains("split-horizontal")?q.style.width=pe:q.parentElement.classList.contains("split-vertical")&&(q.style.height=pe)}}}function x(u){const d={};for(const g of u)d[g]=u[g];return d}const C=le(()=>{const u=e.childComponent;let d=null;return(u instanceof HTMLElement||u instanceof SVGElement)&&(d=x(u.style),u.style=null),d}),U=wt(()=>e.children);return(()=>{const u=Tt.cloneNode(!0),d=u.firstChild,g=d.firstChild,y=g.nextSibling,$=y.nextSibling,S=d.nextSibling,L=S.firstChild,T=L.nextSibling,M=T.nextSibling,v=S.nextSibling,D=v.firstChild,N=D.nextSibling,he=N.nextSibling;return g.$$pointerdown=f,y.$$pointerdown=f,$.$$pointerdown=f,L.$$pointerdown=f,de(T,U),M.$$pointerdown=f,D.$$pointerdown=f,N.$$pointerdown=f,he.$$pointerdown=f,j(k=>{const P={"flex-grow":1,...C()},F=e.style;return k._v$5=re(u,P,k._v$5),k._v$6=re(T,F,k._v$6),k},{_v$5:void 0,_v$6:void 0}),u})()}function tt(e){const n=(()=>{const t=zt.cloneNode(!0);return de(t,e),t})();document.head.append(n)}tt(`
  body {
    /* css variables */
    --handleSize: 5px; /* visible handle size */
    --handlePadding: 10px; /* clickable size */
    --handleColor: gray; /* clickable size */
    --cellFrame: 4px;
    /* --handleMargin: 0px; */
  }
  /* resize handles */
  .split-vertical-resizer {
    height: var(--handleSize) !important;
    /* width: 99%; avoid overflow */
    background-color: var(--handleColor);
    flex-basis: var(--handleSize);
    flex-shrink: 0;
    flex-grow: 0;
    cursor: row-resize;
    margin: 0;
    background-clip: content-box; /* transparent padding */
    padding-top: var(--handlePadding);
    /*margin-top: var(--handleMargin);*/
		pointer-events: none;
		display: none;
  }
  .split-horizontal-resizer {
    width: var(--handleSize) !important;
    /* height: 99%; avoid overflow */
    background-color: var(--handleColor);
    flex-basis: var(--handleSize);
    flex-shrink: 0;
    flex-grow: 0;
    cursor: col-resize;
    margin: 0;
    background-clip: content-box; /* transparent padding */
    padding-left: var(--handlePadding);
    /*margin-left: var(--handleMargin);*/
		pointer-events: none;
		display: none;
  }
  body.--layout-is-moving,
  body.--layout-is-moving * {
    /* dont select text on resize/drag */
    user-select: none !important;
  }
  /* shortcuts for flex layout */
  .split-vertical {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    align-content: stretch;
  }
  .split-vertical.layout-reverse {
    flex-direction: column-reverse;
  }
  .split-horizontal {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    align-content: stretch;
  }
  .split-horizontal.layout-reverse {
    flex-direction: row-reverse;
  }
  .layout-cell {
    display: flex;
    flex-direction: column; /* frame container */
    align-items: stretch;
    align-content: stretch;
  }
  /* frame */
  .top, .bottom {
    flex-basis: var(--cellFrame);
    flex-shrink: 0;
    cursor: row-resize;
  }
  .left, .right {
    flex-basis: var(--cellFrame);
    flex-shrink: 0;
    cursor: col-resize;
  }
  /* debug frame */
  /*
  .left { background-color: yellow }
  .top > .left { background-color: lime }
  .top { background-color: green }
  .top > .right { background-color: turquoise }
  .right { background-color: blue }
  .bottom > .right { background-color: purple }
  .bottom { background-color: red }
  .bottom > .left { background-color: orange }
  */
  .top > .left { cursor: nw-resize }
  .top > .right { cursor: ne-resize }
  .bottom > .right { cursor: se-resize }
  .bottom > .left { cursor: sw-resize }
  .center, .middle { flex-grow: 1; }
  .top, .middle, .bottom {
    display: flex;
    align-items: stretch;
    align-content: stretch;
    flex-direction: row;
  }
  .layout-cell > .middle > .center {
    width: 100%;
    height: 100%;
    /*overflow: auto; auto scroll (default) */
  }
  .layout-cell > .middle {
    overflow: auto;
    /* keep layout size 100% (why overflow?) */
  }
  /* frame border */
  .layout-cell > * > .frame {
    /* border is inside */
    box-sizing: border-box;
  }
  .layout-cell > .middle > .left {
    border-top: none;
    border-right: none;
    border-bottom: none;
  }
  .layout-cell > .middle > .right {
    border-top: none;
    border-left: none;
    border-bottom: none;
  }
  .layout-cell > .top > .center {
    border-bottom: none;
    border-left: none;
    border-right: none;
  }
  .layout-cell > .bottom > .center {
    border-top: none;
    border-left: none;
    border-right: none;
  }
  .layout-cell > .bottom > .left {
    border-top: none;
    border-right: none;
  }
  .layout-cell > .bottom > .right {
    border-top: none;
    border-left: none;
  }
  .layout-cell > .top > .left {
    border-bottom: none;
    border-right: none;
  }
  .layout-cell > .top > .right {
    border-bottom: none;
    border-left: none;
  }

`);tt(`
  /* layout */
  body {
    /* use full window size */
    padding: 0;
  }
  .layout-cell>.middle>.center {
    /* content cell: add scrollbars when needed */
    overflow: auto;
  }
	.split-horizontal > .layout-cell {
    border-right: solid 1px #a8a8a8;
	}
	.split-horizontal > .layout-cell:last-child {
    border-right: none;
	}
	.split-vertical > .layout-cell {
    border-bottom: solid 1px #a8a8a8;
	}
	.split-vertical > .layout-cell:last-child {
    border-bottom: none;
	}
  .layout-cell>*, .layout-cell>*>.frame {
    /* frame size
       larger frames are better acccessible (touchscreen)
       but leave less room for content */
    flex-basis: 6px !important;
  }
  /* use css classes on cells like
     <L class="overflow-hidden">....</L> */
  .layout-cell>.middle>.center.overflow-hidden {
    overflow: hidden !important;
  }
  /* use css classes on containers like
     <L row class="custom-row-container">....</L> */
  .split-horizontal.custom-row-container {
    color: orange;
  }
`);Nt(["pointerdown"]);const kt=ue("<div>Y1 X2 Y2</div>"),Pt=ue("<div>Y1 X2 Y3</div>"),Ot=ue("<div>Y2</div>"),Bt=ue(`<div style="height: 100%"><style>
					.content {
						width: 100%;
						height: 100%;
						background: pink;
					}
				</style></div>`);function It(e){return(()=>{const n=Bt.cloneNode(!0),t=n.firstChild;return Xe(n,W(Oe,{get children(){return[W(Mt,{get children(){return[W(ce,{children:"Y1 X1"}),W(Oe,{get children(){return[W(ce,{children:"Y1 X2 Y1"}),kt.cloneNode(!0),Pt.cloneNode(!0)]}})]}}),Ot.cloneNode(!0)]}}),t),n})()}ht(It,document.querySelector("#root"));
