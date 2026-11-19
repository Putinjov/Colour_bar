export function configureManagerPwa() {
 if (!/^\/admin(?:\/|-|$)/.test(location.pathname)) return;
 const addLink=(rel:string,href:string)=>{const el=document.createElement("link");el.rel=rel;el.href=href;document.head.appendChild(el);};
 addLink("manifest","/manager.webmanifest");
 addLink("apple-touch-icon","/branding/manager-180.png");
 for (const [name,content] of [["apple-mobile-web-app-capable","yes"],["apple-mobile-web-app-title","Colour Lab"],["apple-mobile-web-app-status-bar-style","default"]]) {
  const el=document.createElement("meta");el.name=name;el.content=content;document.head.appendChild(el);
 }
 if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/manager-sw.js",{scope:"/"}).catch(console.warn);
 }
}
export function isStandalone(){return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & {standalone?:boolean}).standalone===true;}
