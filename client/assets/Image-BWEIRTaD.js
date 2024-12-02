import{r as x,j as H}from"./components-D-TMCGGB.js";const X=x.forwardRef(({alt:n,aspectRatio:e,crop:i="center",data:t,decoding:c="async",height:r="auto",loader:d=$,loading:u="lazy",sizes:w,src:h,srcSetOptions:v={intervals:15,startingWidth:200,incrementSize:200,placeholderWidth:100},width:s="100%",...o},l)=>{const f=x.useMemo(()=>{const b=t!=null&&t.width&&(t!=null&&t.height)?t==null?void 0:t.width:void 0,m=t!=null&&t.width&&(t!=null&&t.height)?t==null?void 0:t.height:void 0;return{width:b,height:m,unitsMatch:!!L(b,m)}},[t]),g=x.useMemo(()=>{const m=R((s||"100%").toString()),O=`${m.number}${m.unit}`,W=r==null,A=W?null:R(r.toString()),T=A?`${A.number}${A.unit}`:"",k=W?"auto":T,B=h||(t==null?void 0:t.url),C=t!=null&&t.altText&&!n?t==null?void 0:t.altText:n||"",V=e||(f.unitsMatch?[M(f.width),M(f.height)].join("/"):void 0);return{width:O,height:k,src:B,alt:C,aspectRatio:V}},[s,r,h,t,n,e,f,o==null?void 0:o.key]),{intervals:y,startingWidth:S,incrementSize:j,placeholderWidth:p}=v,I=x.useMemo(()=>J(s,y,S,j),[s,y,S,j]);return N(g.width)?H.jsx(q,{aspectRatio:e,crop:i,decoding:c,height:r,imageWidths:I,loader:d,loading:u,normalizedProps:g,passthroughProps:o,ref:l,width:s,data:t}):H.jsx(G,{aspectRatio:e,crop:i,decoding:c,imageWidths:I,loader:d,loading:u,normalizedProps:g,passthroughProps:o,placeholderWidth:p,ref:l,sizes:w,data:t})}),q=x.forwardRef(({aspectRatio:n,crop:e,decoding:i,height:t,imageWidths:c,loader:r=$,loading:d,normalizedProps:u,passthroughProps:w,width:h,data:v},s)=>{const o=x.useMemo(()=>{const l=M(h),f=M(t),g=n||(L(u.width,u.height)?[l,f].join("/"):u.aspectRatio?u.aspectRatio:void 0),y=c===void 0?void 0:_(c,g,e,{width:(v==null?void 0:v.width)??void 0,height:(v==null?void 0:v.height)??void 0}),S=f||(g&&l?l*(E(g)??1):void 0),j=U(u.src,y,r),p=r({src:u.src,width:l,height:S,crop:u.height==="auto"?void 0:e});return{width:l,aspectRatio:g,height:S,srcSet:j,src:p}},[n,e,v,t,c,r,u,h]);return H.jsx("img",{ref:s,alt:u.alt,decoding:i,height:o.height,loading:d,src:o.src,srcSet:o.srcSet,width:o.width,style:{aspectRatio:o.aspectRatio,...w.style},...w})}),G=x.forwardRef(({crop:n,decoding:e,imageWidths:i,loader:t=$,loading:c,normalizedProps:r,passthroughProps:d,placeholderWidth:u,sizes:w,data:h},v)=>{const s=x.useMemo(()=>{const o=i===void 0?void 0:_(i,r.aspectRatio,n,{width:(h==null?void 0:h.width)??void 0,height:(h==null?void 0:h.height)??void 0}),l=r.aspectRatio&&u?u*(E(r.aspectRatio)??1):void 0,f=U(r.src,o,t),g=t({src:r.src,width:u,height:l,crop:n});return{placeholderHeight:l,srcSet:f,src:g}},[n,h,i,t,r,u]);return H.jsx("img",{ref:v,alt:r.alt,decoding:e,height:s.placeholderHeight,loading:c,sizes:w,src:s.src,srcSet:s.srcSet,width:u,...d,style:{width:r.width,aspectRatio:r.aspectRatio,...d.style}})}),F="https://placeholder.shopify.com";function $({src:n,width:e,height:i,crop:t}){if(!n)return"";const c=new URL(n,F);return e&&c.searchParams.append("width",Math.round(e).toString()),i&&c.searchParams.append("height",Math.round(i).toString()),t&&c.searchParams.append("crop",t),c.href.replace(F,"")}function L(n="100%",e="auto"){return R(n.toString()).unit===R(e.toString()).unit}function R(n){const e=n.replace(/[0-9.]/g,""),i=parseFloat(n.replace(e,""));return{unit:e===""?i===void 0?"auto":"px":e,number:i}}function M(n){if(n===void 0)return;const{unit:e,number:i}=R(n.toString());switch(e){case"em":return i*16;case"rem":return i*16;case"px":return i;case"":return i;default:return}}function N(n){return typeof n=="number"||/\d(px|em|rem)$/.test(n)}function U(n,e,i=$){return n?(e==null?void 0:e.length)===0||!e?n:e.map((t,c)=>`${i({src:n,width:t.width,height:t.height,crop:t.crop})} ${e.length===3?`${c+1}x`:`${t.width??0}w`}`).join(", "):""}function J(n="100%",e,i,t){const c=Array.from({length:e},(d,u)=>u*t+i),r=Array.from({length:3},(d,u)=>(u+1)*(M(n)??0));return N(n)?r:c}function E(n){if(!n)return;const[e,i]=n.split("/");return 1/(Number(e)/Number(i))}function _(n,e,i="center",t){if(n)return n.map(c=>({width:c,height:e?c*(E(e)??1):void 0,crop:i})).filter(({width:c,height:r})=>!(t!=null&&t.width&&c>t.width||t!=null&&t.height&&r&&r>t.height))}export{X as I};
