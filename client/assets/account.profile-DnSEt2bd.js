import{a as r,b as i,c as n,j as e,F as m}from"./components-D-TMCGGB.js";const d=()=>[{title:"Profile"}];function c(){const a=r(),{state:s}=i(),t=n(),l=(t==null?void 0:t.customer)??(a==null?void 0:a.customer);return e.jsxs("div",{className:"account-profile",children:[e.jsx("h2",{children:"My profile"}),e.jsx("br",{}),e.jsxs(m,{method:"PUT",children:[e.jsx("legend",{children:"Personal information"}),e.jsxs("fieldset",{children:[e.jsx("label",{htmlFor:"firstName",children:"First name"}),e.jsx("input",{id:"firstName",name:"firstName",type:"text",autoComplete:"given-name",placeholder:"First name","aria-label":"First name",defaultValue:l.firstName??"",minLength:2}),e.jsx("label",{htmlFor:"lastName",children:"Last name"}),e.jsx("input",{id:"lastName",name:"lastName",type:"text",autoComplete:"family-name",placeholder:"Last name","aria-label":"Last name",defaultValue:l.lastName??"",minLength:2})]}),t!=null&&t.error?e.jsx("p",{children:e.jsx("mark",{children:e.jsx("small",{children:t.error})})}):e.jsx("br",{}),e.jsx("button",{type:"submit",disabled:s!=="idle",children:s!=="idle"?"Updating":"Update"})]})]})}export{c as default,d as meta};
