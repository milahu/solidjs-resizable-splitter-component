const k={};function ce(e){k.context=e}function Ae(){return{...k.context,id:`${k.context.id}${k.context.count++}.`,count:0}}const ke=(e,n)=>e===n,R={equals:ke};let ae=de;const j={},N=1,Z=2,fe={owned:null,cleanups:null,context:null,owner:null};var S=null;let D=null,v=null,I=null,$=null,E=null,J=0;function W(e,n){n&&(S=n);const t=v,l=S,o=e.length===0?fe:{owned:null,cleanups:null,context:null,owner:l};S=o,v=null;let r;try{ne(()=>r=e(()=>oe(o)),!0)}finally{v=t,S=l}return r}function Ne(e,n){n=n?Object.assign({},R,n):R;const t={value:e,observers:null,observerSlots:null,pending:j,comparator:n.equals||void 0};return[ue.bind(t),l=>(typeof l=="function"&&(l=l(t.pending!==j?t.pending:t.value)),ee(t,l))]}function O(e,n,t){G(te(e,n,!1,N))}function Te(e,n,t){ae=Ie;const l=te(e,n,!1,N);l.user=!0,E&&E.push(l)}function Me(e,n,t){t=t?Object.assign({},R,t):R;const l=te(e,n,!0,0);return l.pending=j,l.observers=null,l.observerSlots=null,l.comparator=t.equals||void 0,G(l),ue.bind(l)}function Pe(e){if(I)return e();let n;const t=I=[];try{n=e()}finally{I=null}return ne(()=>{for(let l=0;l<t.length;l+=1){const o=t[l];if(o.pending!==j){const r=o.pending;o.pending=j,ee(o,r)}}},!1),n}function F(e){let n,t=v;return v=null,n=e(),v=t,n}function je(e){Te(()=>F(e))}function Oe(e){return S===null||(S.cleanups===null?S.cleanups=[e]:S.cleanups.push(e)),e}function ue(){const e=D;if(this.sources&&(this.state||e)){const n=$;$=null,this.state===N||e?G(this):le(this),$=n}if(v){const n=this.observers?this.observers.length:0;v.sources?(v.sources.push(this),v.sourceSlots.push(n)):(v.sources=[this],v.sourceSlots=[n]),this.observers?(this.observers.push(v),this.observerSlots.push(v.sources.length-1)):(this.observers=[v],this.observerSlots=[v.sources.length-1])}return this.value}function ee(e,n,t){if(e.comparator&&e.comparator(e.value,n))return n;if(I)return e.pending===j&&I.push(e),e.pending=n,n;let l=!1;return e.value=n,e.observers&&e.observers.length&&ne(()=>{for(let o=0;o<e.observers.length;o+=1){const r=e.observers[o];l&&D.disposed.has(r),r.pure?$.push(r):E.push(r),r.observers&&(l&&!r.tState||!l&&!r.state)&&he(r),l||(r.state=N)}if($.length>1e6)throw $=[],new Error},!1),n}function G(e){if(!e.fn)return;oe(e);const n=S,t=v,l=J;v=S=e,Be(e,e.value,l),v=t,S=n}function Be(e,n,t){let l;try{l=e.fn(n)}catch(o){ge(o)}(!e.updatedAt||e.updatedAt<=t)&&(e.observers&&e.observers.length?ee(e,l):e.value=l,e.updatedAt=t)}function te(e,n,t,l=N,o){const r={fn:e,state:l,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:S,context:null,pure:t};return S===null||S!==fe&&(S.owned?S.owned.push(r):S.owned=[r]),r}function H(e){const n=D;if(e.state!==N)return e.state=0;if(e.suspense&&F(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<J);)(e.state||n)&&t.push(e);for(let l=t.length-1;l>=0;l--)if(e=t[l],e.state===N||n)G(e);else if(e.state===Z||n){const o=$;$=null,le(e),$=o}}function ne(e,n){if($)return e();let t=!1;n||($=[]),E?t=!0:E=[],J++;try{e()}catch(l){ge(l)}finally{De(t)}}function De(e){$&&(de($),$=null),!e&&(E.length?Pe(()=>{ae(E),E=null}):E=null)}function de(e){for(let n=0;n<e.length;n++)H(e[n])}function Ie(e){let n,t=0;for(n=0;n<e.length;n++){const o=e[n];o.user?e[t++]=o:H(o)}const l=e.length;for(n=0;n<t;n++)H(e[n]);for(n=l;n<e.length;n++)H(e[n])}function le(e){e.state=0;const n=D;for(let t=0;t<e.sources.length;t+=1){const l=e.sources[t];l.sources&&(l.state===N||n?H(l):(l.state===Z||n)&&le(l))}}function he(e){const n=D;for(let t=0;t<e.observers.length;t+=1){const l=e.observers[t];(!l.state||n)&&(l.state=Z,l.pure?$.push(l):E.push(l),l.observers&&he(l))}}function oe(e){let n;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),l=e.sourceSlots.pop(),o=t.observers;if(o&&o.length){const r=o.pop(),s=t.observerSlots.pop();l<o.length&&(r.sourceSlots[s]=l,o[l]=r,t.observerSlots[l]=s)}}if(e.owned){for(n=0;n<e.owned.length;n++)oe(e.owned[n]);e.owned=null}if(e.cleanups){for(n=0;n<e.cleanups.length;n++)e.cleanups[n]();e.cleanups=null}e.state=0,e.context=null}function ge(e){throw e}const Fe=Symbol("fallback");function pe(e){for(let n=0;n<e.length;n++)e[n]()}function He(e,n,t={}){let l=[],o=[],r=[],s=0,i=n.length>1?[]:null;return Oe(()=>pe(r)),()=>{let f=e()||[],a,c;return F(()=>{let u=f.length,b,L,d,m,C,g,w,y,x;if(u===0)s!==0&&(pe(r),r=[],l=[],o=[],s=0,i&&(i=[])),t.fallback&&(l=[Fe],o[0]=W(z=>(r[0]=z,t.fallback())),s=1);else if(s===0){for(o=new Array(u),c=0;c<u;c++)l[c]=f[c],o[c]=W(p);s=u}else{for(d=new Array(u),m=new Array(u),i&&(C=new Array(u)),g=0,w=Math.min(s,u);g<w&&l[g]===f[g];g++);for(w=s-1,y=u-1;w>=g&&y>=g&&l[w]===f[y];w--,y--)d[y]=o[w],m[y]=r[w],i&&(C[y]=i[w]);for(b=new Map,L=new Array(y+1),c=y;c>=g;c--)x=f[c],a=b.get(x),L[c]=a===void 0?-1:a,b.set(x,c);for(a=g;a<=w;a++)x=l[a],c=b.get(x),c!==void 0&&c!==-1?(d[c]=o[a],m[c]=r[a],i&&(C[c]=i[a]),c=L[c],b.set(x,c)):r[a]();for(c=g;c<u;c++)c in d?(o[c]=d[c],r[c]=m[c],i&&(i[c]=C[c],i[c](c))):o[c]=W(p);o=o.slice(0,s=u),l=f.slice(0)}return o});function p(u){if(r[c]=u,i){const[b,L]=Ne(c);return i[c]=L,n(f[c],b)}return n(f[c])}}}function K(e,n){if(k.context){const t=k.context;ce(Ae());const l=F(()=>e(n));return ce(t),l}return F(()=>e(n))}function be(e){const n="fallback"in e&&{fallback:()=>e.fallback};return Me(He(()=>e.each,e.children,n||void 0))}function me(e,n,t){let l=t.length,o=n.length,r=l,s=0,i=0,f=n[o-1].nextSibling,a=null;for(;s<o||i<r;){if(n[s]===t[i]){s++,i++;continue}for(;n[o-1]===t[r-1];)o--,r--;if(o===s){const c=r<l?i?t[i-1].nextSibling:t[r-i]:f;for(;i<r;)e.insertBefore(t[i++],c)}else if(r===i)for(;s<o;)(!a||!a.has(n[s]))&&e.removeChild(n[s]),s++;else if(n[s]===t[r-1]&&t[i]===n[o-1]){const c=n[--o].nextSibling;e.insertBefore(t[i++],n[s++].nextSibling),e.insertBefore(t[--r],c),n[o]=t[r]}else{if(!a){a=new Map;let p=i;for(;p<r;)a.set(t[p],p++)}const c=a.get(n[s]);if(c!=null)if(i<c&&c<r){let p=s,u=1,b;for(;++p<o&&p<r&&!((b=a.get(n[p]))==null||b!==c+u);)u++;if(u>c-i){const L=n[s];for(;i<c;)e.insertBefore(t[i++],L)}else e.replaceChild(t[i++],n[s++])}else s++;else e.removeChild(n[s++])}}}const ve="_$DX_DELEGATE";function Qe(e,n,t){let l;return W(o=>{l=o,V(n,e(),n.firstChild?null:void 0,t)}),()=>{l(),n.textContent=""}}function ye(e,n,t){const l=document.createElement("template");l.innerHTML=e;let o=l.content.firstChild;return t&&(o=o.firstChild),o}function Xe(e,n=window.document){const t=n[ve]||(n[ve]=new Set);for(let l=0,o=e.length;l<o;l++){const r=e[l];t.has(r)||(t.add(r),n.addEventListener(r,Ye))}}function ie(e,n,t={}){const l=e.style;if(n==null||typeof n=="string")return l.cssText=n;typeof t=="string"&&(t={});let o,r;for(r in t)n[r]==null&&l.removeProperty(r),delete t[r];for(r in n)o=n[r],o!==t[r]&&(l.setProperty(r,o),t[r]=o);return t}function V(e,n,t,l){if(t!==void 0&&!l&&(l=[]),typeof n!="function")return q(e,n,l,t);O(o=>q(e,n(),o,t),l)}function Ye(e){const n=`$$${e.type}`;let t=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==t&&Object.defineProperty(e,"target",{configurable:!0,value:t}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t}});t!==null;){const l=t[n];if(l&&!t.disabled){const o=t[`${n}Data`];if(o!==void 0?l(o,e):l(e),e.cancelBubble)return}t=t.host&&t.host!==t&&t.host instanceof Node?t.host:t.parentNode}}function q(e,n,t,l,o){for(;typeof t=="function";)t=t();if(n===t)return t;const r=typeof n,s=l!==void 0;if(e=s&&t[0]&&t[0].parentNode||e,r==="string"||r==="number")if(r==="number"&&(n=n.toString()),s){let i=t[0];i&&i.nodeType===3?i.data=n:i=document.createTextNode(n),t=X(e,t,l,i)}else t!==""&&typeof t=="string"?t=e.firstChild.data=n:t=e.textContent=n;else if(n==null||r==="boolean"){if(k.context)return t;t=X(e,t,l)}else{if(r==="function")return O(()=>{let i=n();for(;typeof i=="function";)i=i();t=q(e,i,t,l)}),()=>t;if(Array.isArray(n)){const i=[];if(se(i,n,o))return O(()=>t=q(e,i,t,l,!0)),()=>t;if(k.context&&t&&t.length)return t;if(i.length===0){if(t=X(e,t,l),s)return t}else Array.isArray(t)?t.length===0?we(e,i,l):me(e,t,i):t==null||t===""?we(e,i):me(e,s&&t||[e.firstChild],i);t=i}else if(n instanceof Node){if(Array.isArray(t)){if(s)return t=X(e,t,l,n);X(e,t,null,n)}else t==null||t===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);t=n}}return t}function se(e,n,t){let l=!1;for(let o=0,r=n.length;o<r;o++){let s=n[o],i;if(s instanceof Node)e.push(s);else if(!(s==null||s===!0||s===!1))if(Array.isArray(s))l=se(e,s)||l;else if((i=typeof s)==="string")e.push(document.createTextNode(s));else if(i==="function")if(t){for(;typeof s=="function";)s=s();l=se(e,Array.isArray(s)?s:[s])||l}else e.push(s),l=!0;else e.push(document.createTextNode(s.toString()))}return l}function we(e,n,t){for(let l=0,o=n.length;l<o;l++)e.insertBefore(n[l],t)}function X(e,n,t,l){if(t===void 0)return e.textContent="";const o=l||document.createTextNode("");if(n.length){let r=!1;for(let s=n.length-1;s>=0;s--){const i=n[s];if(o!==i){const f=i.parentNode===e;!r&&!s?f?e.replaceChild(o,i):e.insertBefore(o,t):f&&e.removeChild(i)}else r=!0}}else e.insertBefore(o,t);return[o]}let Ue={data:""},Re=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||Ue,We=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/g,Ge=/\/\*[^]*?\*\/|\s\s+|\n/g,M=(e,n)=>{let t,l="",o="",r="";for(let s in e){let i=e[s];typeof i=="object"?(t=n?n.replace(/([^,])+/g,f=>s.replace(/([^,])+/g,a=>/&/.test(a)?a.replace(/&/g,f):f?f+" "+a:a)):s,o+=s[0]=="@"?s[1]=="f"?M(i,s):s+"{"+M(i,s[1]=="k"?"":n)+"}":M(i,t)):s[0]=="@"&&s[1]=="i"?l=s+" "+i+";":(s=s.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=M.p?M.p(s,i):s+":"+i+";")}return r[0]?(t=n?n+"{"+r+"}":r,l+t+o):l+o},Y={},xe=e=>{let n="";for(let t in e)n+=t+(typeof e[t]=="object"?xe(e[t]):e[t]);return n},Ke=(e,n,t,l,o)=>{let r=typeof e=="object"?xe(e):e,s=Y[r]||(Y[r]=(i=>{let f=0,a=11;for(;f<i.length;)a=101*a+i.charCodeAt(f++)>>>0;return"go"+a})(r));if(!Y[s]){let i=typeof e=="object"?e:(f=>{let a,c=[{}];for(;a=We.exec(f.replace(Ge,""));)a[4]&&c.shift(),a[3]?c.unshift(c[0][a[3]]=c[0][a[3]]||{}):a[4]||(c[0][a[1]]=a[2]);return c[0]})(e);Y[s]=M(o?{["@keyframes "+s]:i}:i,t?"":"."+s)}return((i,f,a)=>{f.data.indexOf(i)==-1&&(f.data=a?i+f.data:f.data+i)})(Y[s],n,l),s},Ve=(e,n,t)=>e.reduce((l,o,r)=>{let s=n[r];if(s&&s.call){let i=s(t),f=i&&i.props&&i.props.className||/^go/.test(i)&&i;s=f?"."+f:i&&typeof i=="object"?i.props?"":M(i,""):i===!1?"":i}return l+o+(s??"")},"");function Se(e){let n=this||{},t=e.call?e(n.p):e;return Ke(t.unshift?t.raw?Ve(t,[].slice.call(arguments,1),n.p):t.reduce((l,o)=>o?Object.assign(l,o.call?o(n.p):o):l,{}):t,Re(n.target),n.g,n.o,n.k)}let $e=Se.bind({g:1});Se.bind({k:1});const Ce=ye("<div></div>"),qe=ye('<div class="layout-cell" style="flex-basis: 50%; flex-grow: 1;"><div class="top"><div class="frame left"></div><div class="frame center"></div><div class="frame right"></div></div><div class="middle"><div class="frame left"></div><div class="center"></div><div class="frame right"></div></div><div class="bottom"><div class="frame left"></div><div class="frame center"></div><div class="frame right"></div></div></div>');function Ze(e){return(()=>{const n=Ce.cloneNode(!0);return V(n,K(be,{get each(){return e.children},children:t=>t.classList.contains("split-vertical")||t.classList.contains("split-horizontal")?t:K(Le,{childComponent:t})})),O(t=>{const l=["split-vertical",e.reverse?"layout-reverse":""].join(" "),o={width:"100%",height:"100%",overflow:"auto",...e.style||{}};return l!==t._v$&&(n.className=t._v$=l),t._v$2=ie(n,o,t._v$2),t},{_v$:void 0,_v$2:void 0}),n})()}function Je(e){return(()=>{const n=Ce.cloneNode(!0);return V(n,K(be,{get each(){return e.children},children:t=>t.classList.contains("split-vertical")||t.classList.contains("split-horizontal")?t:K(Le,{childComponent:t})})),O(t=>{const l=["split-horizontal",e.reverse?"layout-reverse":""].join(" "),o={width:"100%",height:"100%",overflow:"auto",...e.style||{}};return l!==t._v$3&&(n.className=t._v$3=l),t._v$4=ie(n,o,t._v$4),t},{_v$3:void 0,_v$4:void 0}),n})()}function Le(e){je(()=>{document.body.addEventListener("mouseup",L),document.body.addEventListener("mouseleave",L),document.body.addEventListener("touchend",L)});let n=null,t=null,l=null,o=null,r="",s=0,i=0,f=null,a=null,c=null,p=null,u="";function b(d){const m=d.target;s=d.clientX,i=d.clientY,f=m,c=m.parentNode.parentNode;const C=f.classList,g=f.parentNode.classList;p=c,o=c.parentNode;const w=C.contains("right"),y=C.contains("left"),x=g.contains("top");g.contains("bottom");const z=y||w?"split-horizontal":"split-vertical",P="offset";for(u=z=="split-vertical"?P+"Height":P+"Width";o&&p&&!o.classList.contains(z);)p=p.parentElement,o=o.parentElement;if(!o){console.log("error. activeMoveParent not found");return}if(!p){console.log("error. activeMoveCell_real not found");return}document.body.classList.add("--layout-is-moving"),n=d.type[0]=="m"?"mousemove":"touchmove",t=m.cloneNode(!0);const h=t.style;h.position="absolute",h.zIndex=10,document.body.appendChild(t),r=o.style.overflow,o.style.overflow="hidden";const A=1;z=="split-vertical"?(a=!0,h.marginTop=m.offsetTop-(x?m.offsetHeight:0)+A/2-d.clientY+"px",h.left=o.offsetLeft+"px",h.top=d.clientY+"px",h.height=m.offsetHeight+"px",h.width=o.offsetWidth+"px",t.className="split-vertical-resizer",l=function(_){h.top=_.clientY+"px"}):(a=!1,t.className="split-horizontal-resizer",h.marginLeft=m.offsetLeft-(y?m.offsetWidth:0)+A/2-d.clientX+"px",h.top=o.offsetTop+"px",h.left=d.clientX+"px",h.height=o.offsetHeight+"px",h.width=m.offsetWidth+"px",l=function(_){h.left=_.clientX+"px"}),document.addEventListener(n,l)}function L(d){if(!l)return;document.body.classList.remove("--layout-is-moving");const m=d.clientX-s,C=d.clientY-i,g=a?C:m;if(document.body.removeChild(t),t=null,o.style.overflow=r,document.removeEventListener(n,l),l=null,d.type=="mouseleave")return;const w=f.classList,y=f.parentNode.classList;o[u];const x=Array.from(o.children),z=x[0],P=x.slice(-1)[0];let h=x.map(T=>T[u]),A=h.reduce((T,B)=>T+B,0),_=x.indexOf(p);const Q=w.contains("right"),U=w.contains("left"),re=y.contains("top"),ze=y.contains("bottom");if(p==z&&(U||re)||p==P&&(Q||ze))console.log("TODO resize from container start/end"),A+=g;else{let T=0,B=0;U||re?(T=_-1,B=_):(T=_,B=_+1),h[T]+=g,h[B]-=g;for(let[_e,Ee]of x.entries())Ee.style.flexBasis=Math.round(h[_e]/A*100)+"%"}}return(()=>{const d=qe.cloneNode(!0),m=d.firstChild,C=m.firstChild,g=C.nextSibling,w=g.nextSibling,y=m.nextSibling,x=y.firstChild,z=x.nextSibling,P=z.nextSibling,h=y.nextSibling,A=h.firstChild,_=A.nextSibling,Q=_.nextSibling;return C.$$mousedown=b,g.$$mousedown=b,w.$$mousedown=b,x.$$mousedown=b,V(z,()=>e.childComponent),P.$$mousedown=b,A.$$mousedown=b,_.$$mousedown=b,Q.$$mousedown=b,O(U=>ie(z,e.style,U)),d})()}$e(`
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

`);$e(`
  /* layout */
  body {
    /* use full window size */
    padding: 0;
  }
  .layout-cell>.middle>.center {
    /* content cell: add scrollbars when needed */
    overflow: auto;
  }
  .layout-cell>*>.frame {
    /* frame color and border */
    /*background-color: #f4f4f4;*/
    border: solid 1px #a8a8a8;
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
`);Xe(["mousedown"]);export{Je as S,Ze as a,K as c,V as i,Qe as r,ye as t};
