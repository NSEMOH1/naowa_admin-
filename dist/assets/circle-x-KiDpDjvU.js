import{x as C,r as n,f}from"./index-CRMG5bzS.js";function v(l={}){const{onClose:k,onOpen:h,isOpen:c,id:O}=l,a=C(h),r=C(k),[y,d]=n.useState(l.defaultIsOpen||!1),e=c!==void 0?c:y,o=c!==void 0,g=n.useId(),u=O??`disclosure-${g}`,t=n.useCallback(()=>{o||d(!1),r?.()},[o,r]),i=n.useCallback(()=>{o||d(!0),a?.()},[o,a]),p=n.useCallback(()=>{e?t():i()},[e,i,t]);function b(s={}){return{...s,"aria-expanded":e,"aria-controls":u,onClick(x){s.onClick?.(x),p()}}}function m(s={}){return{...s,hidden:!e,id:u}}return{isOpen:e,onOpen:i,onClose:t,onToggle:p,isControlled:o,getButtonProps:b,getDisclosureProps:m}}/**
 * @license lucide-react v0.540.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],z=f("circle-check-big",P);/**
 * @license lucide-react v0.540.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],B=f("circle-x",I);export{z as C,B as a,v as u};
