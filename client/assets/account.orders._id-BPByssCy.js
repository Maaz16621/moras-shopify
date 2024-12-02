import{u as l,j as s}from"./components-D-TMCGGB.js";import{M as e}from"./Money-ByIxzvyb.js";import{I as o}from"./Image-BWEIRTaD.js";const u=({data:r})=>{var d;return[{title:`Order ${(d=r==null?void 0:r.order)==null?void 0:d.name}`}]};function f(){const{order:r,lineItems:d,discountValue:i,discountPercentage:t,fulfillmentStatus:c}=l();return s.jsxs("div",{className:"account-order",children:[s.jsxs("h2",{children:["Order ",r.name]}),s.jsxs("p",{children:["Placed on ",new Date(r.processedAt).toDateString()]}),s.jsx("br",{}),s.jsxs("div",{children:[s.jsxs("table",{children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{scope:"col",children:"Product"}),s.jsx("th",{scope:"col",children:"Price"}),s.jsx("th",{scope:"col",children:"Quantity"}),s.jsx("th",{scope:"col",children:"Total"})]})}),s.jsx("tbody",{children:d.map((n,h)=>s.jsx(x,{lineItem:n},h))}),s.jsxs("tfoot",{children:[(i&&i.amount||t)&&s.jsxs("tr",{children:[s.jsx("th",{scope:"row",colSpan:3,children:s.jsx("p",{children:"Discounts"})}),s.jsx("th",{scope:"row",children:s.jsx("p",{children:"Discounts"})}),s.jsx("td",{children:t?s.jsxs("span",{children:["-",t,"% OFF"]}):i&&s.jsx(e,{data:i})})]}),s.jsxs("tr",{children:[s.jsx("th",{scope:"row",colSpan:3,children:s.jsx("p",{children:"Subtotal"})}),s.jsx("th",{scope:"row",children:s.jsx("p",{children:"Subtotal"})}),s.jsx("td",{children:s.jsx(e,{data:r.subtotal})})]}),s.jsxs("tr",{children:[s.jsx("th",{scope:"row",colSpan:3,children:"Tax"}),s.jsx("th",{scope:"row",children:s.jsx("p",{children:"Tax"})}),s.jsx("td",{children:s.jsx(e,{data:r.totalTax})})]}),s.jsxs("tr",{children:[s.jsx("th",{scope:"row",colSpan:3,children:"Total"}),s.jsx("th",{scope:"row",children:s.jsx("p",{children:"Total"})}),s.jsx("td",{children:s.jsx(e,{data:r.totalPrice})})]})]})]}),s.jsxs("div",{children:[s.jsx("h3",{children:"Shipping Address"}),r!=null&&r.shippingAddress?s.jsxs("address",{children:[s.jsx("p",{children:r.shippingAddress.name}),r.shippingAddress.formatted?s.jsx("p",{children:r.shippingAddress.formatted}):"",r.shippingAddress.formattedArea?s.jsx("p",{children:r.shippingAddress.formattedArea}):""]}):s.jsx("p",{children:"No shipping address defined"}),s.jsx("h3",{children:"Status"}),s.jsx("div",{children:s.jsx("p",{children:c})})]})]}),s.jsx("br",{}),s.jsx("p",{children:s.jsx("a",{target:"_blank",href:r.statusPageUrl,rel:"noreferrer",children:"View Order Status →"})})]})}function x({lineItem:r}){return s.jsxs("tr",{children:[s.jsx("td",{children:s.jsxs("div",{children:[(r==null?void 0:r.image)&&s.jsx("div",{children:s.jsx(o,{data:r.image,width:96,height:96})}),s.jsxs("div",{children:[s.jsx("p",{children:r.title}),s.jsx("small",{children:r.variantTitle})]})]})}),s.jsx("td",{children:s.jsx(e,{data:r.price})}),s.jsx("td",{children:r.quantity}),s.jsx("td",{children:s.jsx(e,{data:r.totalDiscount})})]},r.id)}export{f as default,u as meta};
