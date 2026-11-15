/* OptiBean Kulesi: 3D sahne (Three.js r128) ve arayüz.
   Kat metinleri js/data.js dosyasında. Katların iç mekânı furnish() içinde. */
const TYPE_LABEL={real:["real","Gerçek vaka"],scen:["scen","Senaryo"],soon:["soon","Yapım aşamasında"]};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const L=(a,b,n)=>a+(b-a)*n;
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- kule düzeni: alttan üste ---------- */
const ORDER=["vitrin","satis","resepsiyon","depo","uretim","yazilim","muhasebe","toplanti","mudur"];
const FL=ORDER.map((id,i)=>{ const r=ROOMS.find(x=>x.id===id); r.lvl=i; return r; });
const OPEN=FL.filter(r=>r.type!=="soon");
const N=FL.length;
const ZONE=i=>i<3?"Müşteri":i<6?"Operasyon":"Yönetim";
const pad=n=>String(n).padStart(2,"0");

const S={mode:"overview",fl:0,p:0,pT:0,az:0,azT:0,el:0,elT:0,sway:0,night:0,nightT:0,lastWheel:0,wheelDir:1,hover:null,lblHover:null,drag:null,introDone:false,cardH:160,ptr:null};

(function(){ let n=null;
  try{ const v=localStorage.getItem("optibean-night"); if(v==="1"||v==="0") n=v==="1"; }catch(e){}
  if(n===null){ const a=document.documentElement.getAttribute("data-theme"); n=a? a==="dark" : matchMedia("(prefers-color-scheme: dark)").matches; }
  S.night=S.nightT=n?1:0; document.body.classList.toggle("night",n);
})();

/* ================= 3D ================= */
const FH=3.2, FW=5.2, T=.14, D2R=Math.PI/180, TW=10*D2R, BASE=-40*D2R, TAPER=.02;
const rot=i=>BASE+i*TW, AZ_MID=rot((N-1)/2);
const TOP=N*FH, HTOT=TOP+13, HEL_END=TOP+7;
const FOV=34, TANH=Math.tan(FOV/2*D2R);
let renderer,scene,camera,raycaster,tower,crown,helix,halo,curve,bead,beadGlow,beacon,skyMat,hemi,sun,plazaLight,stars,moon,moonGlow,cloudMat,helixCount=0,haloCount=0,ok3d=true;
let M=null,PEOPLE=[],BOOKS=[],TEX={},GLOW=null,envTex=null,HITM=null,tmp=null;
const meta=[],pick=[],clouds=[],lampGlows=[],lbl=[];
const SKY={},CL={};

const lin=h=>new THREE.Color(h).convertSRGBToLinear();
function mat(hex,o={}){ if(o.emissive!==undefined) o.emissive=lin(o.emissive); const m=new THREE.MeshStandardMaterial(Object.assign({roughness:.82,metalness:0},o)); m.color.copy(lin(hex)); return m; }
function box(w,h,d,m,x,y,z,parent,cast=true){ const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m); b.position.set(x,y,z); b.castShadow=cast; b.receiveShadow=true; parent.add(b); return b; }
function cyl(r,h,m,x,y,z,parent,seg=18){ const c=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg),m); c.position.set(x,y,z); c.castShadow=true; c.receiveShadow=true; parent.add(c); return c; }
function sph(r,m,x,y,z,parent){ const s=new THREE.Mesh(new THREE.SphereGeometry(r,18,14),m); s.position.set(x,y,z); s.castShadow=true; parent.add(s); return s; }
function cone(r,h,m,x,y,z,parent,seg=16){ const c=new THREE.Mesh(new THREE.ConeGeometry(r,h,seg),m); c.position.set(x,y,z); c.castShadow=true; parent.add(c); return c; }
function cvs(w,h){ const c=document.createElement("canvas"); c.width=w; c.height=h; return [c,c.getContext("2d")]; }
function tex(c){ const t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
function glow(color,scale,parent,x,y,z){ const m=new THREE.SpriteMaterial({map:GLOW,color:lin(color),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:0}); const s=new THREE.Sprite(m); s.scale.set(scale,scale,1); s.position.set(x,y,z); parent.add(s); return s; }

function makeMats(){
  M={ white:mat(0xf5f5f7), slab:mat(0xeeeef2), frame:mat(0x24262b,{roughness:.5,metalness:.25}), clad:mat(0xc5c8d0,{roughness:.6}),
      wood:mat(0xb3936b), dark:mat(0x2d3036,{roughness:.6}), soft:mat(0xd3d5dc), metal:mat(0x8c9099,{roughness:.35,metalness:.7}),
      green:mat(0x1f7a55), berry:mat(0x8b3d6e), rug:mat(0xc7bfb3,{roughness:1}), paving:mat(0xc9ced8,{roughness:.95}), ground:mat(0xd3d9e3,{roughness:1}),
      leaf:mat(0x4f8f69,{flatShading:true}), leaf2:mat(0x7fb086,{flatShading:true}), trunk:mat(0x7a644f), skin:mat(0xe3bf9f),
      screen:mat(0x0f3d2b,{emissive:0x35c88a,emissiveIntensity:.75,roughness:.3}),
      warm:mat(0xfff1dc,{emissive:0xffd9a0,emissiveIntensity:.9}), bulb:mat(0xfff1dc,{emissive:0xffd9a0,emissiveIntensity:.2}),
      win:mat(0x30343c,{emissive:0xffd9a0,emissiveIntensity:0,roughness:.3}),
      cone:mat(0xe8843a), crate:mat(0xc9a274), sheet:mat(0xdcdde2,{roughness:1}), cream:mat(0xf3ead7),
      red:mat(0xff5a4d,{emissive:0xff3b30,emissiveIntensity:1.2}), concrete:mat(0xcfd1d8,{roughness:1}),
      spire:mat(0x2a2e35,{roughness:.22,metalness:.75,flatShading:true}),
      helix:mat(0x1f7a55,{emissive:0x23a06b,emissiveIntensity:.55,roughness:.35,transparent:true}) };
  M.glass=new THREE.MeshStandardMaterial({color:lin(0xbfd8d0),roughness:.06,metalness:.35,transparent:true,opacity:.2,side:THREE.DoubleSide,depthWrite:false});
  PEOPLE=[0x3b4a6b,0x8b3d6e,0x1f7a55,0xc98b4b,0x5b5f66,0x2f6f9f].map(c=>mat(c,{roughness:.7}));
  BOOKS=[0x8b3d6e,0x1f7a55,0xd6b98f,0x3b4a6b,0xe8843a].map(c=>mat(c));
  HITM=new THREE.MeshBasicMaterial({visible:false});
}
function makeEnv(){
  try{
    const pm=new THREE.PMREMGenerator(renderer), es=new THREE.Scene();
    const [c,x]=cvs(16,256); const g=x.createLinearGradient(0,0,0,256);
    g.addColorStop(0,"#eaf2ff"); g.addColorStop(.45,"#ffffff"); g.addColorStop(.56,"#c9ccd4"); g.addColorStop(1,"#8d9098");
    x.fillStyle=g; x.fillRect(0,0,16,256);
    es.add(new THREE.Mesh(new THREE.SphereGeometry(40,24,16),new THREE.MeshBasicMaterial({map:tex(c),side:THREE.BackSide})));
    const lb=new THREE.Mesh(new THREE.BoxGeometry(14,10,1),new THREE.MeshBasicMaterial({color:0xffffff})); lb.position.set(18,16,22); lb.lookAt(0,0,0); es.add(lb);
    envTex=pm.fromScene(es,.03).texture; pm.dispose();
  }catch(e){ envTex=null; }
  const ms=[M.glass,M.frame,M.metal,M.spire];
  if(envTex) ms.forEach(m=>{ m.envMap=envTex; m.envMapIntensity=1.15; });
  else { M.metal.metalness=.2; M.spire.metalness=.2; M.glass.metalness=0; M.frame.metalness=0; }
}
function makeTextures(){
  { const [c,x]=cvs(128,128); const g=x.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(.22,"rgba(255,255,255,.55)"); g.addColorStop(.6,"rgba(255,255,255,.12)"); g.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle=g; x.fillRect(0,0,128,128); GLOW=new THREE.CanvasTexture(c); }
  { const [c,x]=cvs(64,64); const g=x.createRadialGradient(32,32,0,32,32,32); g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(.82,"rgba(255,255,255,1)"); g.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle=g; x.fillRect(0,0,64,64); TEX.moon=new THREE.CanvasTexture(c); }
  { const [c,x]=cvs(512,256); x.fillStyle="#12161c"; x.fillRect(0,0,512,256);
    x.strokeStyle="rgba(255,255,255,.09)"; x.lineWidth=1; for(let i=0;i<=10;i++){ x.beginPath(); x.moveTo(60+i*44,18); x.lineTo(60+i*44,238); x.stroke(); }
    [[1,2,1],[1,1,0],[3,1,1],[4,4,1],[4,2,0],[8,1,1],[9,2,1]].forEach(([s,d,cr],i)=>{ x.fillStyle="rgba(255,255,255,.4)"; x.fillRect(14,31+i*30,32,7); x.fillStyle=cr?"#d86fae":"#35c88a"; x.fillRect(60+(s-1)*44+3,24+i*30,d*44-6,20); });
    TEX.gantt=tex(c); }
  { const [c,x]=cvs(384,256); x.fillStyle="#12161c"; x.fillRect(0,0,384,256);
    [52,78,70,104,128,162].forEach((h,i)=>{ x.fillStyle=i===5?"#35c88a":"rgba(53,200,138,.45)"; x.fillRect(40+i*54,220-h,34,h); });
    x.strokeStyle="#d86fae"; x.lineWidth=5; x.beginPath(); [150,132,140,108,84,46].forEach((y,i)=>{ const px=57+i*54; if(i) x.lineTo(px,y); else x.moveTo(px,y); }); x.stroke();
    x.fillStyle="rgba(255,255,255,.4)"; x.fillRect(40,24,120,9); TEX.chart=tex(c); }
  { const [c,x]=cvs(512,200); x.fillStyle="#1d1d1f"; x.fillRect(0,0,512,200);
    x.font="800 38px Manrope, Segoe UI, sans-serif"; x.textBaseline="middle"; x.fillStyle="#fff"; x.fillText("Opti",26,40); const w=x.measureText("Opti").width; x.fillStyle="#4fd39d"; x.fillText("Bean",26+w,40);
    ["#6a4fb3","#8b3d6e","#9cc15b","#f2d27a","#6b4a35","#f4b6c2"].forEach((col,i)=>{ const cx=i%2?280:26, cy=84+Math.floor(i/2)*36; x.fillStyle=col; x.beginPath(); x.arc(cx+10,cy,10,0,7); x.fill(); x.fillStyle="rgba(255,255,255,.55)"; x.fillRect(cx+30,cy-5,120,9); x.fillStyle="rgba(255,255,255,.3)"; x.fillRect(cx+170,cy-5,40,9); });
    TEX.menu=tex(c); }
  const sign=(a,b)=>{ const [c,x]=cvs(1024,200); x.font="800 150px Manrope, Segoe UI, sans-serif"; x.textBaseline="middle"; const w1=x.measureText("Opti").width, w2=x.measureText("Bean").width, sx=(1024-w1-w2)/2;
    x.fillStyle=a; x.fillText("Opti",sx,104); x.fillStyle=b; x.fillText("Bean",sx+w1,104); return tex(c); };
  TEX.sign=sign("#ffffff","#4fd39d"); TEX.signW=sign("#ffffff","#ffffff");
  TEX.num=i=>{ const [c,x]=cvs(128,48); x.font="500 34px IBM Plex Mono, ui-monospace, monospace"; x.textAlign="center"; x.textBaseline="middle"; x.fillStyle="#ffffff"; x.fillText(pad(i),64,26); return tex(c); };
  { const [c,x]=cvs(256,32); x.fillStyle="#f2c230"; x.fillRect(0,0,256,32); x.fillStyle="#23252a"; for(let i=-2;i<18;i++){ x.beginPath(); x.moveTo(i*32,32); x.lineTo(i*32+16,0); x.lineTo(i*32+32,0); x.lineTo(i*32+16,32); x.fill(); }
    TEX.tape=tex(c); TEX.tape.wrapS=THREE.RepeatWrapping; TEX.tape.repeat.set(3,1); }
  { const [c,x]=cvs(128,32); for(let i=0;i<8;i++){ x.fillStyle=i%2?"#ffffff":"#1f7a55"; x.fillRect(i*16,0,16,32); } TEX.awning=tex(c); }
}

/* ---------- iç mekân ---------- */
function kit(g){
  const y0=T/2;
  const B=(w,h,d,m,x,y,z,cast=true)=>box(w,h,d,m,x,y0+y,z,g,cast);
  const C=(r,h,m,x,y,z)=>cyl(r,h,m,x,y0+y,z,g);
  const P=(r,m,x,y,z)=>sph(r,m,x,y0+y,z,g);
  const chair=(x,z,r=0,m=M.dark)=>{ const c=new THREE.Group(); box(.46,.07,.46,m,0,.46,0,c); box(.46,.5,.06,m,0,.74,-.2,c); cyl(.035,.46,M.metal,0,.23,0,c,10); cyl(.2,.03,M.metal,0,.02,0,c,14); c.position.set(x,y0,z); c.rotation.y=r; g.add(c); };
  const desk=(x,z,w=1.6,d=.8,m=M.wood)=>{ B(w,.06,d,m,x,.75,z); B(.06,.72,d-.1,M.dark,x-w/2+.1,.36,z); B(.06,.72,d-.1,M.dark,x+w/2-.1,.36,z); };
  const monitor=(x,z,r=0)=>{ const c=new THREE.Group(); box(.62,.38,.035,M.dark,0,1.13,0,c); box(.57,.33,.012,M.screen,0,1.13,.025,c,false); box(.05,.18,.05,M.dark,0,.87,0,c); box(.22,.02,.16,M.dark,0,.79,0,c); c.position.set(x,y0,z); c.rotation.y=r; g.add(c); };
  const plant=(x,z,s=1)=>{ C(.17*s,.36*s,M.soft,x,.18*s,z); const a=new THREE.Mesh(new THREE.IcosahedronGeometry(.34*s,0),M.leaf); a.position.set(x,y0+.62*s,z); a.castShadow=true; g.add(a); const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.24*s,0),M.leaf2); b.position.set(x+.12*s,y0+.9*s,z+.05); b.castShadow=true; g.add(b); };
  const pendant=(x,z,len=.7)=>{ const top=FH-T/2; cyl(.012,len,M.dark,x,top-len/2,z,g,6); const s=new THREE.Mesh(new THREE.SphereGeometry(.13,16,12),M.warm); s.position.set(x,top-len-.1,z); g.add(s); };
  const person=(x,z,ci=0,sit=false,r=0,s=1)=>{ const c=new THREE.Group(), h=sit?.5:.8, b0=sit?.5:0;
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,h,14),PEOPLE[ci%PEOPLE.length]); body.position.y=b0+h/2; body.castShadow=true; c.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.125,16,12),M.skin); head.position.y=b0+h+.13; head.castShadow=true; c.add(head);
    c.position.set(x,y0,z); c.rotation.y=r; c.scale.setScalar(s); g.add(c); };
  const wall=(t,w,hh,x,y,framed=true)=>{ const wz=-FW/2+T+.05; if(framed) B(w+.12,hh+.12,.05,M.dark,x,y,wz-.01); const p=new THREE.Mesh(new THREE.PlaneGeometry(w,hh),new THREE.MeshBasicMaterial({map:t,transparent:!framed})); p.position.set(x,y0+y,wz+.03); g.add(p); };
  return {B,C,P,chair,desk,monitor,plant,pendant,person,wall,y0};
}
const ACCENT={mudur:0x8fb39b,toplanti:0xd6b98f,yazilim:0x9fd3bb,resepsiyon:0x1f7a55,satis:0xdba3c2};
function construction(g,K){
  const {B,C,pendant,y0}=K, h=FW/2;
  B(1.8,.9,1,M.sheet,-.9,.45,-1.4); B(1,.6,.8,M.sheet,1.2,.3,-1.6);
  B(.6,.5,.6,M.crate,1.55,.25,.5); B(.5,.4,.5,M.crate,1.5,.7,.5); B(.55,.45,.55,M.crate,.8,.22,.9);
  [[.2,1.5],[-.5,.3]].forEach(([x,z])=>{ B(.34,.04,.34,M.cone,x,.02,z); cone(.15,.42,M.cone,x,y0+.25,z,g); });
  [[-2.05,.4],[-2.05,1.6],[-.95,.4],[-.95,1.6]].forEach(([x,z])=>C(.035,2.2,M.metal,x,1.1,z));
  B(1.3,.06,1.4,M.crate,-1.5,1.5,1); C(.14,.24,M.soft,-1.5,1.65,1);
  pendant(.3,-.4,.5);
  const tm=new THREE.MeshBasicMaterial({map:TEX.tape,side:THREE.DoubleSide});
  [[1.28,-.05],[.96,.06]].forEach(([y,rz])=>{ const t=new THREE.Mesh(new THREE.PlaneGeometry(FW-.1,.16),tm); t.position.set(0,y0+y,h-.04); t.rotation.z=rz; g.add(t); });
}
function furnish(id,g,soon){
  const K=kit(g), {B,C,P,chair,desk,monitor,plant,pendant,person,wall,y0}=K, wz=-FW/2+T+.05;
  if(soon){ construction(g,K); return; }
  if(id==="mudur"){
    B(2.9,.02,2.1,M.rug,0,.01,.1,false);
    desk(0,-.9,2.1,.9); monitor(.55,-.95,-2.45); B(.34,.02,.24,M.soft,-.45,.79,-.85);
    chair(0,-1.65); person(0,-1.65,0,true);
    chair(-.6,.15,Math.PI,M.soft); chair(.6,.15,Math.PI,M.soft); person(.6,.15,1,true,Math.PI);
    B(1.3,1.9,.34,M.wood,-1.75,.95,-2.2); for(let r=0;r<4;r++) for(let k=0;k<5;k++) B(.12,.3,.2,BOOKS[(r+k)%5],-2.2+k*.2,.3+r*.45,-2.08,false);
    plant(1.95,-2,1.15); C(.03,1.5,M.metal,-2.1,.75,1.2); P(.16,M.warm,-2.1,1.58,1.2);
    wall(TEX.chart,1.25,.82,1.2,1.85); pendant(0,-.9,.6);
  }
  if(id==="toplanti"){
    B(3.1,.02,2.3,M.rug,0,.01,-.2,false);
    B(2.8,.07,1.1,M.wood,0,.75,-.2); B(.12,.72,.5,M.dark,-1,.36,-.2); B(.12,.72,.5,M.dark,1,.36,-.2);
    [-.95,0,.95].forEach(x=>{ chair(x,-1.05); chair(x,.65,Math.PI); });
    person(-.95,-1.05,1,true); person(.95,-1.05,2,true); person(0,.65,3,true,Math.PI); person(-.95,.65,5,true,Math.PI);
    wall(TEX.gantt,2.3,1.15,0,1.9); person(1.95,-1.8,0);
    B(.5,.02,.35,M.soft,.2,.8,-.2); pendant(-.7,-.2,.75); pendant(.7,-.2,.75); plant(-2.05,-1.95);
  }
  if(id==="yazilim"){
    desk(-1.25,-1.35,1.8,.8); desk(1.2,-1.35,1.6,.8);
    monitor(-1.6,-1.55,.12); monitor(-.95,-1.55,-.12); monitor(1.2,-1.55);
    chair(-1.25,-.65,Math.PI); chair(1.2,-.65,Math.PI); person(-1.25,-.65,2,true,Math.PI); person(1.2,-.65,3,true,Math.PI);
    B(1.9,1,.04,M.white,0,2.0,wz);
    const notes=[0xf2c84b,0xe58bb5,0x6fcf97,0x7fb3e6].map(c=>mat(c));
    [[-.62,2.25,0],[-.62,1.98,1],[-.62,1.71,2],[0,2.25,3],[0,1.98,0],[.62,2.25,2],[.62,1.98,1],[.62,1.71,3]].forEach(([x,y,c])=>B(.26,.2,.02,notes[c],x,y,wz+.035,false));
    const bb=P(.42,M.berry,1.8,.26,1.3); bb.scale.y=.62;
    B(.55,1.6,.55,M.dark,2.15,.8,-2.1); for(let k=0;k<4;k++) B(.3,.03,.02,M.screen,2.15,.45+k*.3,-1.815,false);
    plant(-2.05,1.3); pendant(-1.25,-1.1,.7); pendant(1.2,-1.1,.7);
  }
  if(id==="resepsiyon"){
    wall(TEX.signW,2,.4,0,2.3,false);
    B(2.6,1,.6,M.white,0,.5,-1.15); B(2.7,.06,.7,M.wood,0,1.03,-1.15); B(2.6,.22,.02,M.green,0,.6,-.84,false);
    person(0,-1.8,2); B(.36,.02,.26,M.dark,-.6,1.07,-1.15); B(.36,.24,.02,M.screen,-.6,1.19,-1.28,false);
    B(.3,.22,.3,M.crate,.75,1.17,-1.15); B(.22,.16,.22,M.crate,1.05,1.14,-1.1);
    B(.75,.38,1.7,M.soft,-2.05,.19,.6); B(.16,.55,1.7,M.soft,-2.42,.6,.6); person(-2,.9,4,true,Math.PI/2); C(.32,.36,M.wood,-1.15,.18,.6);
    person(.35,-.25,0,false,Math.PI); person(1.6,.5,3,false,Math.PI*.8); B(.36,.3,.36,M.crate,1.98,.15,.85);
    plant(2.05,-1.95,1.1); pendant(-.8,-1.15,.9); pendant(0,-1.15,.9); pendant(.8,-1.15,.9);
  }
  if(id==="satis"){
    B(3.4,.9,.5,M.white,0,.45,-2.1); B(3.5,.05,.56,M.wood,0,.92,-2.1);
    [-1.35,-1.05,-.75].forEach(x=>C(.07,.3,M.soft,x,1.1,-2.1));
    [.8,1.1,1.4].forEach(x=>{ const c=cone(.07,.24,M.crate,x,y0+1.07,-2.1,g,12); c.rotation.x=Math.PI; });
    wall(TEX.menu,2.2,.86,0,2.15);
    B(2.7,.9,.85,M.white,0,.45,-.55); B(2.7,.45,.85,M.glass,0,1.13,-.55,false);
    [0x6a4fb3,0x8b3d6e,0x9cc15b,0xf2d27a,0x6b4a35,0xf4b6c2,0x2f7d5b,0xefe7da].forEach((c,i)=>B(.26,.12,.5,mat(c,{roughness:.5}),-1.05+i*.3,.97,-.55,false));
    B(.5,1,.5,M.wood,1.8,.5,-.55); B(.32,.2,.28,M.dark,1.8,1.1,-.55);
    person(-.3,-1.3,1); person(.15,.55,3,false,Math.PI); person(.72,.72,5,false,Math.PI,.66);
    C(.38,.05,M.wood,-1.7,.74,1.3); C(.04,.74,M.metal,-1.7,.37,1.3); C(.17,.45,M.soft,-2.15,.22,1.05); C(.17,.45,M.soft,-1.25,.22,1.7);
    const cn=cone(.2,.55,M.crate,1.95,y0+.85,1.35,g); cn.rotation.x=Math.PI; C(.05,.6,M.metal,1.95,.3,1.35); P(.24,mat(0x6a4fb3),1.95,1.25,1.35);
    pendant(-.9,-.55,.8); pendant(0,-.55,.8); pendant(.9,-.55,.8);
  }
}

/* ---------- kat kabuğu ---------- */
function fascia(g){ const h=FW/2;
  box(FW+.3,.26,.16,M.frame,0,0,h+.05,g); box(FW+.3,.26,.16,M.frame,0,0,-h-.05,g);
  box(.16,.26,FW+.3,M.frame,h+.05,0,0,g); box(.16,.26,FW+.3,M.frame,-h-.05,0,0,g); }
function buildFloor(r,i){
  const soon=r.type==="soon", h=FW/2;
  const g=new THREE.Group(); g.position.y=i*FH; g.rotation.y=rot(i); const s=1-i*TAPER; g.scale.set(s,1,s); tower.add(g);
  box(FW,T,FW,M.slab,0,0,0,g); fascia(g);
  box(FW,FH-T,T,M.white,0,FH/2,-h+T/2,g);
  box(FW-.5,FH-T-.6,.03,soon?M.concrete:mat(ACCENT[r.id]||0xd9dbe2,{roughness:.9}),0,FH/2,-h+T+.02,g,false);
  for(let k=0;k<7;k++) box(.07,FH-T,.07,M.frame,-h+.25+k*(FW-.5)/6,FH/2,-h-.04,g);
  box(1.1,1.3,.03,M.win,-1.2,FH/2+.1,-h-.02,g,false); box(1.1,1.3,.03,M.win,1.2,FH/2+.1,-h-.02,g,false);
  [-1,1].forEach(sx=>{
    const p=new THREE.Mesh(new THREE.PlaneGeometry(FW,FH-T),M.glass); p.rotation.y=Math.PI/2; p.position.set(sx*h,FH/2,0); g.add(p);
    [-h+.06,-.87,.87].forEach(z=>box(.06,FH-T,.06,M.frame,sx*h,FH/2,z,g));
    box(.11,FH-T,.11,M.frame,sx*(h-.03),FH/2,h-.06,g);
  });
  const tint=new THREE.Mesh(new THREE.PlaneGeometry(FW-.3,FW-.3),new THREE.MeshBasicMaterial({color:lin(0x35c88a),transparent:true,opacity:0,depthWrite:false}));
  tint.rotation.x=-Math.PI/2; tint.position.y=T/2+.006; g.add(tint);
  const fm=new THREE.MeshBasicMaterial({color:lin(0x2bb57c),transparent:true,opacity:0,depthWrite:false}), fz=h+.145;
  box(FW+.34,.07,.04,fm,0,FH-.17,fz,g,false); box(FW+.34,.07,.04,fm,0,.17,fz,g,false);
  box(.07,FH-.34,.04,fm,h+.135,FH/2,fz,g,false); box(.07,FH-.34,.04,fm,-h-.135,FH/2,fz,g,false);
  const np=new THREE.Mesh(new THREE.PlaneGeometry(.6,.225),new THREE.MeshBasicMaterial({map:TEX.num(i+1),transparent:true})); np.position.set(-h+.5,0,h+.136); g.add(np);
  const lamp=new THREE.PointLight(0xffffff,0,9,1.5); lamp.color.copy(lin(0xffe2b8)); lamp.position.set(Math.sin(rot(i))*.4*s,i*FH+FH-.9,Math.cos(rot(i))*.4*s); tower.add(lamp);
  const gl=glow(0xffd9a0,6,g,0,FH/2,.8);
  const hit=new THREE.Mesh(new THREE.BoxGeometry(FW,FH-.1,FW),HITM); hit.position.y=FH/2; hit.userData.lvl=i; g.add(hit); pick.push(hit);
  furnish(r.id,g,soon);
  meta[i]={g,lamp,gl,fm,tint:tint.material,soon,mid:new THREE.Vector3(0,FH*.5,0),corners:[[h,h],[h,-h],[-h,h],[-h,-h]].map(([x,z])=>new THREE.Vector3(x,FH*.5,z))};
}
function buildCrown(){
  const h=FW/2;
  crown=new THREE.Group(); crown.position.y=TOP; crown.rotation.y=rot(N); const cs=1-N*TAPER; crown.scale.set(cs,1,cs); tower.add(crown);
  box(FW,T,FW,M.slab,0,0,0,crown); fascia(crown);
  box(FW+.3,.46,.1,M.frame,0,.36,h+.08,crown); box(FW+.3,.46,.1,M.frame,0,.36,-h-.08,crown);
  box(.1,.46,FW+.3,M.frame,h+.08,.36,0,crown); box(.1,.46,FW+.3,M.frame,-h-.08,.36,0,crown);
  box(3.1,1.5,3.1,M.clad,0,.82,0,crown);
  box(2.9,.62,.06,M.dark,0,.95,1.58,crown);
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.5),new THREE.MeshBasicMaterial({map:TEX.sign,transparent:true})); sg.position.set(0,.95,1.62); crown.add(sg);
  [[-2,1.9],[2,1.9],[-2,-1.9],[2,-1.9]].forEach(([x,z])=>{ cyl(.2,.34,M.soft,x,.24,z,crown,12); const l=new THREE.Mesh(new THREE.IcosahedronGeometry(.36,0),M.leaf); l.position.set(x,.72,z); l.castShadow=true; crown.add(l); });
  const sp=new THREE.Mesh(new THREE.ConeGeometry(1.75,9,4,1),M.spire); sp.position.y=1.57+4.5; sp.rotation.y=Math.PI/4; sp.castShadow=true; crown.add(sp);
  cyl(.045,2.2,M.metal,0,1.57+9+1.1,0,crown,8);
  sph(.12,M.red,0,1.57+9+2.26,0,crown);
  beacon=glow(0xff4a3d,3.2,crown,0,1.57+9+2.26,0);
}
function buildHelix(){
  const pts=[], turns=1.7;
  for(let k=0;k<=260;k++){ const u=k/260, y=-.3+u*(HEL_END+.3); let r;
    if(y<=TOP) r=4.55-(Math.max(y,0)/TOP); else { const v=(y-TOP)/(HEL_END-TOP); r=3.55+(.75-3.55)*(v*v*(3-2*v)); }
    const a=BASE+1+u*turns*Math.PI*2; pts.push(new THREE.Vector3(Math.sin(a)*r,y,Math.cos(a)*r)); }
  curve=new THREE.CatmullRomCurve3(pts);
  helix=new THREE.Mesh(new THREE.TubeGeometry(curve,520,.11,8,false),M.helix); helix.castShadow=true; tower.add(helix);
  halo=new THREE.Mesh(new THREE.TubeGeometry(curve,300,.32,8,false),new THREE.MeshBasicMaterial({color:lin(0x35c88a),transparent:true,opacity:.06,blending:THREE.AdditiveBlending,depthWrite:false})); tower.add(halo);
  helixCount=helix.geometry.index.count; haloCount=halo.geometry.index.count;
  bead=sph(.2,mat(0xffffff,{emissive:0x7dffc4,emissiveIntensity:1.4}),0,0,0,tower); bead.castShadow=false;
  beadGlow=glow(0x5fffb5,2.6,tower,0,0,0);
}
function tree(x,z,s=1){ cyl(.1*s,1.2*s,M.trunk,x,-.5+.6*s,z,scene,8);
  const a=new THREE.Mesh(new THREE.IcosahedronGeometry(.95*s,0),M.leaf); a.position.set(x,-.5+1.75*s,z); a.castShadow=true; scene.add(a);
  const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.62*s,0),M.leaf2); b.position.set(x+.35*s,-.5+2.5*s,z+.1); b.castShadow=true; scene.add(b); }
function lampPost(x,z){ cyl(.05,2.7,M.frame,x,-.5+1.35,z,scene,10); sph(.17,M.bulb,x,-.5+2.8,z,scene); lampGlows.push(glow(0xffd9a0,3.6,scene,x,-.5+2.8,z)); }
function bench(x,z,ry){ const g=new THREE.Group(); g.position.set(x,-.5,z); g.rotation.y=ry; scene.add(g); box(1.6,.07,.45,M.wood,0,.45,0,g); box(.08,.45,.4,M.frame,-.6,.22,0,g); box(.08,.45,.4,M.frame,.6,.22,0,g); }
function plazaPerson(x,z,ci,s=1){ const c=new THREE.Group(); const b=new THREE.Mesh(new THREE.CylinderGeometry(.11,.16,.8,14),PEOPLE[ci%PEOPLE.length]); b.position.y=.4; b.castShadow=true; c.add(b);
  const hd=new THREE.Mesh(new THREE.SphereGeometry(.125,16,12),M.skin); hd.position.y=.93; hd.castShadow=true; c.add(hd); c.position.set(x,-.5,z); c.scale.setScalar(s); scene.add(c); }
function caravan(x,z,ry){
  const g=new THREE.Group(); g.position.set(x,-.5,z); g.rotation.y=ry; scene.add(g);
  box(2.5,1.25,1.35,M.cream,0,1.05,0,g); box(2.6,.09,1.45,M.green,0,1.72,0,g);
  box(1.45,.52,.04,M.dark,.15,1.2,.69,g,false); box(1.6,.05,.3,M.wood,.15,.9,.8,g);
  const aw=new THREE.Mesh(new THREE.BoxGeometry(1.7,.04,.7),new THREE.MeshStandardMaterial({map:TEX.awning,roughness:.9})); aw.position.set(.15,1.6,1); aw.rotation.x=.38; aw.castShadow=true; g.add(aw);
  [-.75,.75].forEach(wx=>[-.7,.7].forEach(wzz=>{ const w=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.16,20),M.dark); w.rotation.x=Math.PI/2; w.position.set(wx,.3,wzz); w.castShadow=true; g.add(w); }));
  box(.9,.07,.07,M.metal,-1.65,.5,0,g);
  const cn=cone(.16,.42,M.crate,.9,2,0,g); cn.rotation.x=Math.PI; sph(.19,mat(0xf4a6c0),.9,2.3,0,g);
  box(.5,.3,.03,M.berry,-.85,1.2,.69,g,false);
  lampGlows.push(glow(0xffd9a0,3,g,.15,1.3,1));
}

function init3D(){
  const host=$("#scene");
  renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputEncoding=THREE.sRGBEncoding; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.95;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(FOV,innerWidth/innerHeight,1,1400);
  raycaster=new THREE.Raycaster(); S.ptr=new THREE.Vector2(9,9); tmp=new THREE.Vector3();
  makeMats(); makeEnv(); makeTextures();

  SKY.dTop=new THREE.Color(0x9cc4f3); SKY.dBot=new THREE.Color(0xeef3fa); SKY.nTop=new THREE.Color(0x05070f); SKY.nBot=new THREE.Color(0x1c2644);
  CL.hd=lin(0xffffff); CL.hn=lin(0x9fb4e0); CL.gd=lin(0xc8ccd6); CL.gn=lin(0x1a2030); CL.sd=lin(0xfff3e0); CL.sn=lin(0xb7c8ff);
  skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{top:{value:new THREE.Color()},bot:{value:new THREE.Color()}},
    vertexShader:"varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader:"uniform vec3 top; uniform vec3 bot; varying vec3 vP; void main(){ float h=normalize(vP).y; gl_FragColor=vec4(mix(bot,top,smoothstep(0.0,0.42,h)),1.0); }"});
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(450,32,18),skyMat));
  { const sp=[]; for(let i=0;i<700;i++){ const u=Math.random()*Math.PI*2, v=Math.acos(Math.random()*.92+.04); sp.push(430*Math.sin(v)*Math.cos(u),430*Math.cos(v),430*Math.sin(v)*Math.sin(u)); }
    const sg=new THREE.BufferGeometry(); sg.setAttribute("position",new THREE.Float32BufferAttribute(sp,3));
    stars=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:1.7,sizeAttenuation:false,transparent:true,opacity:0,depthWrite:false,fog:false})); scene.add(stars); }
  moon=new THREE.Sprite(new THREE.SpriteMaterial({map:TEX.moon,color:0xf2f4ff,transparent:true,opacity:0,depthWrite:false,fog:false})); moon.scale.set(20,20,1); moon.position.set(65,100,-360); scene.add(moon);
  moonGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:GLOW,color:0xbfd0ff,transparent:true,opacity:0,depthWrite:false,fog:false,blending:THREE.AdditiveBlending})); moonGlow.scale.set(90,90,1); moonGlow.position.copy(moon.position); scene.add(moonGlow);
  cloudMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.95,depthWrite:false,toneMapped:false});
  [[-62,34,-70,1.3],[40,44,-90,1.7],[78,28,-50,1],[-25,52,-110,1.5],[10,30,-140,1.2]].forEach(([x,y,z,s])=>{ const g=new THREE.Group();
    [[0,0,0,5],[4.5,.6,.5,3.8],[-4.2,.3,-.4,3.4],[1.5,1.8,0,3]].forEach(([a,b,c,r])=>{ const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),cloudMat); m.position.set(a,b,c); g.add(m); });
    g.scale.set(s,s*.55,s); g.position.set(x,y,z); scene.add(g); clouds.push(g); });

  hemi=new THREE.HemisphereLight(0xffffff,0xc8ccd6,.42); scene.add(hemi);
  sun=new THREE.DirectionalLight(0xffffff,1.25); sun.position.set(34,62,44); sun.target.position.set(0,18,0); scene.add(sun); scene.add(sun.target);
  sun.castShadow=true; sun.shadow.mapSize.set(2048,2048);
  { const sc=sun.shadow.camera; sc.left=-30; sc.right=30; sc.top=34; sc.bottom=-34; sc.near=1; sc.far=190; sc.updateProjectionMatrix(); }
  sun.shadow.bias=-.0004; sun.shadow.normalBias=.03;
  plazaLight=new THREE.PointLight(0xffffff,0,18,1.5); plazaLight.color.copy(lin(0xffe2b8)); plazaLight.position.set(1.5,3.4,7.5); scene.add(plazaLight);

  { const [c,x]=cvs(256,256); const gr=x.createRadialGradient(128,128,0,128,128,128); gr.addColorStop(0,"#ffffff"); gr.addColorStop(.42,"#ffffff"); gr.addColorStop(.97,"#000000"); gr.addColorStop(1,"#000000");
    x.fillStyle=gr; x.fillRect(0,0,256,256); M.ground.alphaMap=new THREE.CanvasTexture(c); M.ground.transparent=true; M.ground.depthWrite=false; }
  const ground=new THREE.Mesh(new THREE.CircleGeometry(190,72),M.ground); ground.rotation.x=-Math.PI/2; ground.position.y=-.58; ground.receiveShadow=true; ground.renderOrder=-1; scene.add(ground);
  const plaza=new THREE.Mesh(new THREE.CylinderGeometry(13,13,.08,72),M.paving); plaza.position.y=-.54; plaza.receiveShadow=true; scene.add(plaza);
  const ring=new THREE.Mesh(new THREE.RingGeometry(9.6,9.75,72),new THREE.MeshBasicMaterial({color:lin(0xb4b8c2)})); ring.rotation.x=-Math.PI/2; ring.position.y=-.495; scene.add(ring);
  const step=new THREE.Mesh(new THREE.CylinderGeometry(5.7,5.7,.2,56),M.clad); step.position.y=-.4; step.receiveShadow=true; step.castShadow=true; scene.add(step);

  tower=new THREE.Group(); scene.add(tower);
  const plinth=new THREE.Mesh(new THREE.CylinderGeometry(4.7,5,.36,56),M.frame); plinth.position.y=-.25; plinth.castShadow=true; plinth.receiveShadow=true; tower.add(plinth);
  FL.forEach((r,i)=>buildFloor(r,i));
  buildCrown(); buildHelix();
  tower.updateMatrixWorld(true);
  meta.forEach(m=>{ m.g.localToWorld(m.mid); m.corners.forEach(c=>m.g.localToWorld(c)); });

  [[-8.5,5.5,1.2],[-10.5,1.5,1],[-9,-3,1.25],[9.6,2.4,1.15],[8.5,-3.5,1.3],[-4.5,-9,1.1],[4,-9.5,1.2],[0,-11,1.4],[-11.3,6.6,.85]].forEach(([x,z,s])=>tree(x,z,s));
  [[-5.6,7.6],[3.2,9],[-8.2,-1.5],[8.4,-.8]].forEach(([x,z])=>lampPost(x,z));
  bench(-6.6,6.3,.7); bench(-7.9,2.9,1.2);
  caravan(6.3,7.2,-.5); plazaPerson(5.5,8.9,1); plazaPerson(6.2,9.2,3,.66); plazaPerson(-6.4,6.9,4); plazaPerson(1.2,7.4,0);

  applyNight(S.night);
  try{ renderer.compile(scene,camera); }catch(e){}
  host.appendChild(renderer.domElement);
  bindPointer(renderer.domElement);
  addEventListener("resize",()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); S.cardH=$("#card").offsetHeight; });

  const g0=goal(); Object.assign(cur,g0);
  const direct=location.hash.length>1 && location.hash!=="#kule";
  if(reduce||direct) finishIntro(); else { cur.dist=g0.dist*.6; cur.ty=7; cur.az=AZ_MID-.8; cur.el=.2; meta.forEach(m=>m.g.visible=false); crown.visible=false; helix.geometry.setDrawRange(0,0); halo.geometry.setDrawRange(0,0); }
  requestAnimationFrame(animate);
}

function applyNight(n){
  skyMat.uniforms.top.value.copy(SKY.dTop).lerp(SKY.nTop,n); skyMat.uniforms.bot.value.copy(SKY.dBot).lerp(SKY.nBot,n);
  hemi.intensity=L(.42,.06,n); hemi.color.copy(CL.hd).lerp(CL.hn,n); hemi.groundColor.copy(CL.gd).lerp(CL.gn,n);
  sun.intensity=L(1.25,.08,n); sun.color.copy(CL.sd).lerp(CL.sn,n);
  renderer.toneMappingExposure=L(.95,1.12,n); plazaLight.intensity=L(0,1.1,n);
  M.warm.emissiveIntensity=L(.9,1.8,n); M.bulb.emissiveIntensity=L(.2,1.7,n); M.win.emissiveIntensity=L(0,1.3,n); M.helix.emissiveIntensity=L(.55,1.25,n);
  M.glass.opacity=L(.2,.13,n);
  [M.glass,M.frame,M.metal,M.spire].forEach(m=>m.envMapIntensity=L(1.15,.3,n));
  stars.material.opacity=n; moon.material.opacity=n; moonGlow.material.opacity=n*.35; cloudMat.opacity=(1-n)*.95;
  lampGlows.forEach(s=>s.material.opacity=n*.85);
}

/* ---------- kamera ---------- */
const cur={tx:0,ty:10,tz:0,az:0,el:.1,dist:60,xo:0,yo:0};
function goal(){
  const W=innerWidth,H=innerHeight,narrow=W<760,pw=Math.min(560,W-32);
  if(S.mode==="tour"||S.mode==="room"){
    const room=S.mode==="room", p=room?S.fl:S.p; let aw,ah,xo=0,yo=0;
    if(room){ if(narrow){ aw=W*.94; ah=H*.4-64; yo=H/2-(64+ah/2); } else { aw=W-pw-60; ah=H*.8; xo=(pw+16)/2; } }
    else if(narrow){ aw=W*.94; ah=Math.max(180,H-S.cardH-110); yo=H/2-(70+ah/2); }
    else { aw=W*.6; ah=H*.8; xo=-W*.1; }
    const ppu=Math.max(8,Math.min(aw/(room?7:8.4),ah/(room?4.6:9.5)));
    return {tx:0,ty:p*FH+FH*.46,tz:0,az:rot(p)-(room?.3:.22)+S.az*(room?.5:1),el:(room?.12:.15)+S.el,dist:Math.max(room?9.5:14,(H/2)/(ppu*TANH)),xo,yo};
  }
  const a=W<1100?74:18, b=narrow? H-S.cardH-30 : H-30, span=Math.max(200,b-a), ppu=span/(HTOT+1.5);
  const xo=S.mode==="map"? (narrow?0:(pw+16)/2) : -W*.2;
  return {tx:0,ty:HTOT/2-.6,tz:0,az:AZ_MID-.12+S.az+S.sway,el:.07+S.el,dist:(H/2)/(ppu*TANH),xo,yo:H/2-(a+b)/2};
}
function pickLvl(){ raycaster.setFromCamera(S.ptr,camera); const h=raycaster.intersectObjects(pick,false)[0]; return h? h.object.userData.lvl : null; }
function bindPointer(cv){
  const setPtr=e=>{ S.ptr.x=e.clientX/innerWidth*2-1; S.ptr.y=-(e.clientY/innerHeight)*2+1; };
  cv.addEventListener("pointerdown",e=>{ S.drag={x:e.clientX,y:e.clientY,moved:0,touch:e.pointerType==="touch"}; try{ cv.setPointerCapture(e.pointerId); }catch(_){} });
  cv.addEventListener("pointermove",e=>{ if(e.pointerType!=="touch") setPtr(e); const d=S.drag; if(!d) return;
    const dx=e.clientX-d.x, dy=e.clientY-d.y; d.x=e.clientX; d.y=e.clientY; d.moved+=Math.abs(dx)+Math.abs(dy);
    S.azT=clamp(S.azT-dx*.005,-1.15,1.15);
    if(d.touch && S.mode!=="room" && S.mode!=="map") climb(-dy*.012); else S.elT=clamp(S.elT+dy*.003,-.04,.5); });
  cv.addEventListener("pointerup",e=>{ const d=S.drag; S.drag=null; if(!d||d.moved>8||!S.introDone) return;
    setPtr(e); const lvl=pickLvl(); if(e.pointerType==="touch") S.ptr.x=9; if(lvl==null) return; const r=FL[lvl];
    if(S.mode==="room"){ if(lvl!==S.fl && r.type!=="soon") go(r.id); return; }
    if(r.type==="soon") toTour(lvl); else if(S.mode==="overview"||lvl===S.fl) go(r.id); else toTour(lvl); });
  cv.addEventListener("pointercancel",()=>{ S.drag=null; });
  cv.addEventListener("pointerleave",()=>{ S.ptr.x=9; });
  cv.addEventListener("wheel",e=>{ e.preventDefault(); if(S.mode==="room"||S.mode==="map") return; climb((e.deltaMode===1?e.deltaY*30:e.deltaY)*.004); },{passive:false});
}
function climb(d){
  if(!S.introDone||!d) return; S.lastWheel=performance.now(); S.wheelDir=d>0?1:-1;
  if(S.mode==="overview"){ if(d>.03) toTour(0); return; }
  S.pT=clamp(S.pT+d,-.7,N-1); if(S.pT<-.5) toOverview();
}
const easeOutBack=x=>{ const c1=1.70158,c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); };
function introStep(t){
  for(let i=0;i<N;i++){ const x=clamp((t-.3-i*.12)/.6,0,1), g=meta[i].g; g.visible=x>0; g.scale.y=Math.max(.001,easeOutBack(x)); }
  const xc=clamp((t-.3-N*.12)/.7,0,1); crown.visible=xc>0; crown.scale.y=Math.max(.001,easeOutBack(xc));
  const eh=clamp((t-.5)/2.1,0,1); helix.geometry.setDrawRange(0,Math.floor(helixCount*eh/3)*3); halo.geometry.setDrawRange(0,Math.floor(haloCount*eh/3)*3);
  if(t>3.1) finishIntro();
}
function finishIntro(){ S.introDone=true; meta.forEach(m=>{ m.g.visible=true; m.g.scale.y=1; }); crown.visible=true; crown.scale.y=1;
  helix.geometry.setDrawRange(0,helixCount); halo.geometry.setDrawRange(0,haloCount); document.body.classList.add("ready"); }

let last=0,t0=null,beadU=0,hk=1,qAcc=0,qN=0,qStep=0,qFrom=0;
function animate(now){
  requestAnimationFrame(animate);
  if(document.hidden){ last=now; return; }
  const dt=Math.max(0,Math.min(.05,(now-(last||now))/1000)); last=now; const time=now/1000, W=innerWidth, H=innerHeight;
  if(t0===null) t0=now;
  if(!S.introDone) introStep((now-t0)/1000);
  if(S.mode==="tour" && !S.drag && now-S.lastWheel>260){ const t=S.wheelDir>0?Math.ceil(S.pT-.15):Math.floor(S.pT+.15); if(t<0) toOverview(); else S.pT+=(clamp(t,0,N-1)-S.pT)*Math.min(1,dt*9); }
  S.p+=(S.pT-S.p)*(reduce?1:1-Math.exp(-dt*7));
  if(S.mode==="tour"){ const f=clamp(Math.round(S.pT),0,N-1); if(f!==S.fl){ S.fl=f; renderCard(); } }
  S.az+=(S.azT-S.az)*Math.min(1,dt*8); S.el+=(S.elT-S.el)*Math.min(1,dt*8);
  S.sway=(reduce||S.drag||S.mode!=="overview")? S.sway*(1-Math.min(1,dt*3)) : Math.sin(time*.25)*.14;
  const g=goal(), kf=reduce?1:1-Math.exp(-dt*(S.introDone?4.2:1.5));
  for(const k in g) cur[k]+=(g[k]-cur[k])*kf;
  camera.setViewOffset(W,H,cur.xo,cur.yo,W,H);
  const ce=Math.cos(cur.el);
  camera.position.set(cur.tx+cur.dist*Math.sin(cur.az)*ce,cur.ty+cur.dist*Math.sin(cur.el),cur.tz+cur.dist*Math.cos(cur.az)*ce);
  camera.lookAt(cur.tx,cur.ty,cur.tz); camera.updateMatrixWorld();
  if(Math.abs(S.nightT-S.night)>.0005){ S.night+=(S.nightT-S.night)*Math.min(1,dt*2.2); if(Math.abs(S.nightT-S.night)<.002) S.night=S.nightT; applyNight(S.night); }
  const n=S.night;
  const hT=S.mode==="room"?.16:S.mode==="tour"?.38:1; hk+=(hT-hk)*Math.min(1,dt*5); M.helix.opacity=hk; halo.material.opacity=L(.06,.24,n)*hk;
  let hv=null; if(S.introDone && S.ptr.x<5 && !S.drag && S.mode!=="map") hv=pickLvl();
  if(S.lblHover!=null) hv=S.lblHover;
  if(hv!==S.hover){ S.hover=hv; lbl.forEach((b,i)=>b.classList.toggle("hot",i===hv)); }
  renderer.domElement.style.cursor=S.drag?"grabbing":(hv!=null?"pointer":"grab");
  const focus=(S.mode==="tour"||S.mode==="room")?S.fl:-1;
  for(let i=0;i<N;i++){ const m=meta[i], on=i===hv||i===focus, base=m.soon?L(.06,.22,n):L(.42,1.45,n);
    m.lamp.intensity+=((m.g.visible?(on?base+.75:base):0)-m.lamp.intensity)*.12; m.fm.opacity+=((on?1:0)-m.fm.opacity)*.15; m.tint.opacity+=((on?.14:0)-m.tint.opacity)*.15;
    m.gl.material.opacity=(m.soon?.05:.26)*n; }
  if(focus>=0) beadU+=((S.p*FH+2)/(HEL_END+.3)-beadU)*Math.min(1,dt*4); else beadU=(beadU+dt*.035)%1;
  curve.getPoint(clamp(beadU,0,1),bead.position); beadGlow.position.copy(bead.position); beadGlow.material.opacity=L(.4,.95,n)*(.35+.65*hk);
  beacon.material.opacity=(.55+.45*Math.sin(time*3))*L(.5,1,n);
  if(n<.99) clouds.forEach(c=>{ c.position.x+=dt*.5; if(c.position.x>110) c.position.x=-110; });
  if(S.mode==="overview" && S.introDone){ for(let i=0;i<N;i++){ const m=meta[i]; let bx=-9; for(let k=0;k<4;k++){ tmp.copy(m.corners[k]).project(camera); if(tmp.x>bx) bx=tmp.x; }
      tmp.copy(m.mid).project(camera); lbl[i].style.transform="translate("+((bx+1)/2*W+12).toFixed(1)+"px,"+((1-tmp.y)/2*H).toFixed(1)+"px) translateY(-50%)"; } }
  renderer.render(scene,camera);
  if(S.introDone && qStep<3){ if(!qFrom) qFrom=now+1500; else if(now>qFrom){ qAcc+=dt; qN++; if(qN>=45){ const avg=qAcc/qN; qAcc=0; qN=0;
    if(avg>.034){ qStep++; if(qStep===1) renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.4)); else if(qStep===2) renderer.setPixelRatio(1); else { sun.castShadow=false; }
      qFrom=now+800; } } } }
}

/* ================= arayüz ================= */
function setMode(m){ S.mode=m; const b=document.body; ["m-overview","m-tour","m-room","m-map"].forEach(c=>b.classList.remove(c)); b.classList.add("m-"+m); }
function toOverview(){ setMode("overview"); S.azT=0; S.elT=0; renderCard(); }
function toTour(i){ const was=S.mode; setMode("tour"); S.pT=clamp(i,0,N-1); S.fl=S.pT; if(was==="overview"||was==="map") S.p=S.pT; S.wheelDir=1; S.azT=0; S.elT=0; renderCard(); }
function pipsHTML(){ const act=S.mode==="tour"; return '<div class="pips" role="group" aria-label="Katlar">'+FL.map(r=>`<button class="pip ${r.type}" data-l="${r.lvl}" title="${r.lvl+1}. kat: ${esc(r.name)}" aria-label="Kat ${r.lvl+1}: ${esc(r.name)}"${act&&r.lvl===S.fl?' aria-current="true"':''}></button>`).join("")+'</div>'; }
function renderCard(){
  const c=$("#card");
  if(S.mode==="tour"){
    const r=FL[S.fl], [cls,label]=TYPE_LABEL[r.type];
    c.innerHTML=`<div class="card-top"><span class="num">${pad(r.lvl+1)}</span><div class="ct"><div class="eyebrow">Kat ${r.lvl+1} · ${ZONE(r.lvl)}</div><div class="card-title">${r.name}</div></div><span class="tag ${cls}">${label}</span></div>
      <p class="card-sub">${r.dept} · ${esc(r.q)}</p>
      <div class="card-row"><button class="rnd" id="cDown" aria-label="${r.lvl===0?"Tüm kule":"Alt kat"}">↓</button><button class="rnd" id="cUp" aria-label="Üst kat"${r.lvl===N-1?" disabled":""}>↑</button>${pipsHTML()}${r.type==="soon"?'<button class="btn" disabled>Yakında</button>':'<button class="btn primary" id="cEnter">İçeri gir</button>'}</div>
      <button class="linkbtn" id="cAll">← Tüm kule</button>`;
    $("#cDown").onclick=()=> r.lvl===0? toOverview() : toTour(r.lvl-1);
    $("#cUp").onclick=()=>toTour(r.lvl+1);
    $("#cAll").onclick=toOverview;
    const en=$("#cEnter"); if(en) en.onclick=()=>go(r.id);
  } else {
    c.innerHTML=`<div class="eyebrow">${N} kat · ${N} departman</div><div class="card-title">Kuleyi gez</div>
      <p class="card-sub">${OPEN.length} kat açık, ${N-OPEN.length} kat yapım aşamasında. Kaydırarak katları çık ya da bir kata tıkla.</p>
      <div class="legend"><span><i class="dot real"></i>Gerçek vaka</span><span><i class="dot scen"></i>Senaryo: “5 şubeye büyürsek”</span><span><i class="dot soon"></i>Yapım aşamasında</span></div>
      <div class="card-row">${pipsHTML()}<button class="btn primary" id="cStart">Zemin kattan başla</button></div>`;
    $("#cStart").onclick=()=>toTour(0);
  }
  c.querySelectorAll(".pip").forEach(p=>p.onclick=()=>toTour(+p.dataset.l));
  S.cardH=c.offsetHeight||160;
  document.querySelectorAll("#fallback button").forEach(b=>b.setAttribute("aria-current",String(S.mode==="tour"&&+b.dataset.l===S.fl)));
}
function buildUI(){
  const labels=$("#labels"), fb=$("#fallback");
  FL.forEach(r=>{ const b=document.createElement("button"); b.className="lbl "+r.type; b.tabIndex=-1; b.innerHTML=`<span class="n">${r.lvl+1}</span>${esc(r.name)}`;
    b.onclick=()=> r.type==="soon"? toTour(r.lvl) : go(r.id); b.onmouseenter=()=>{ S.lblHover=r.lvl; }; b.onmouseleave=()=>{ S.lblHover=null; };
    labels.appendChild(b); lbl[r.lvl]=b; });
  FL.slice().reverse().forEach(r=>{ const b=document.createElement("button"); b.dataset.l=r.lvl; b.innerHTML=`<span class="dot ${r.type}"></span>${r.lvl+1}. ${esc(r.name)}`; b.style.transform="translateX("+((r.lvl-4)*5)+"px)";
    b.onclick=()=> r.type==="soon"? toTour(r.lvl) : go(r.id); fb.appendChild(b); });
  renderCard();
}

let stepIx=0;
function openRoom(id,ix=0){
  const r=FL.find(x=>x.id===id); if(!r||r.type==="soon") return go("");
  setMode("room"); S.fl=r.lvl; S.pT=S.p=r.lvl; S.azT=0; S.elT=0;
  stepIx=clamp(ix,0,r.steps.length-1);
  const [cls,label]=TYPE_LABEL[r.type], s=r.steps[stepIx], up=OPEN.find(o=>o.lvl>r.lvl), lastStep=stepIx===r.steps.length-1, p=$("#panel");
  p.innerHTML=`<div class="panel-head">
      <button class="back" id="backBtn">← Kuleye dön</button>
      <div class="ph"><span class="pnum">${pad(r.lvl+1)}</span><div><div class="eyebrow">Kat ${r.lvl+1} · ${ZONE(r.lvl)} · ${r.ch}</div><h2>${r.name}</h2><div class="sub"><span class="tag ${cls} htag">${label}</span>${r.dept} · ${esc(r.q)}</div></div></div>
      <dl class="rolecard"><dt>Tür</dt><dd><span class="tag ${cls}">${label}</span></dd><dt>Rolüm</dt><dd>${r.role}</dd><dt>Karşımdaki</dt><dd>${r.other}</dd></dl>
    </div>
    <div class="panel-body">
      <ol class="steps" aria-label="Adımlar">${r.steps.map((st,i)=>`<li><button data-i="${i}" ${i===stepIx?'aria-current="step"':''}>${i+1}. ${st.t}</button></li>`).join("")}</ol>
      ${stepIx===0?`<p class="roleline"><b>Rolüm:</b> ${r.role} · <b>Karşımdaki:</b> ${r.other}</p>`:""}
      <article class="slide"><div class="kicker">Adım ${stepIx+1} / ${r.steps.length}</div><h3>${s.h}</h3>${s.body}</article>
      <div class="nav"><button class="btn" id="prev" ${stepIx===0?"disabled":""}>← Önceki</button><button class="btn primary" id="next">${lastStep?(up?"Üst kata çık: "+up.name+" →":"Kuleye dön"):"Sonraki →"}</button></div>
      <section class="concepts"><h4>Bu katta kullandığım kavramlar</h4><div class="chips">${r.concepts.map(c=>`<button class="chip" type="button">${c}<span class="tip" role="tooltip">${esc(GLOSSARY[c]||"")}</span></button>`).join("")}</div></section>
    </div>`;
  p.classList.add("open");
  $("#backBtn").onclick=()=>go("");
  $("#prev").onclick=()=>openRoom(id,stepIx-1);
  $("#next").onclick=()=> !lastStep? openRoom(id,stepIx+1) : go(up?up.id:"");
  p.querySelectorAll(".steps button").forEach(b=>b.onclick=()=>openRoom(id,+b.dataset.i));
  p.querySelectorAll(".chip").forEach(c=>c.onclick=()=>{ p.querySelectorAll(".chip.open").forEach(o=>o!==c&&o.classList.remove("open")); c.classList.toggle("open"); });
  if(id==="toplanti" && s.t==="Gantt") drawGantt();
  const cu=p.querySelector('.steps [aria-current="step"]'); if(cu&&cu.scrollIntoView) cu.scrollIntoView({block:"nearest",inline:"nearest"});
  p.querySelector(".panel-body").scrollTop=0;
}
function openMap(){
  setMode("map");
  const used={}; FL.filter(r=>r.concepts).forEach(r=>r.concepts.forEach(c=>{ (used[c]=used[c]||[]).push(r); }));
  const p=$("#panel");
  p.innerHTML=`<div class="panel-head"><button class="back" id="backBtn">← Kuleye dön</button><h2>Kavram haritası</h2><div class="sub">Katlarda kullandığım ACM 213 (Systems Analysis &amp; Design) kavramları. Bir kata tıklayınca oraya gidersin.</div></div>
    <div class="panel-body map"><label for="filter" class="sub">Kavram ara</label><input id="filter" type="search" placeholder="DFD, TCO, critical path…"><div id="mapgrid"></div>
    <p class="note">Senaryo katlarındaki şube, ortak ve müşteri kurgusaldır; gerçek vakalar kendi deneyimimdir.</p></div>`;
  p.classList.add("open"); $("#backBtn").onclick=()=>go("");
  const render=(f="")=>{ const q=f.toLowerCase();
    $("#mapgrid").innerHTML=Object.keys(used).sort().filter(c=>!q||c.toLowerCase().includes(q)||(GLOSSARY[c]||"").toLowerCase().includes(q)).map(c=>`<div class="mapcard"><b>${c}</b><p>${esc(GLOSSARY[c]||"")}</p><div class="rooms">${used[c].map(r=>`<button data-r="${r.id}">${r.lvl+1}. ${r.name}</button>`).join("")}</div></div>`).join("")||'<p class="sub">Eşleşen kavram yok.</p>';
    p.querySelectorAll(".mapcard .rooms button").forEach(b=>b.onclick=()=>go(b.dataset.r)); };
  render(); $("#filter").addEventListener("input",e=>render(e.target.value));
}
let after=null;
function closePanel(){ $("#panel").classList.remove("open"); const a=after; after=null;
  if(S.mode==="room"){ a==="overview"? toOverview() : toTour(S.fl); } else if(S.mode==="map") toOverview(); }
function home(){ if(location.hash.length>1 && location.hash!=="#kule"){ after="overview"; go(""); } else toOverview(); }
function drawGantt(){
  const g=$("#gantt"); if(!g) return;
  const tasks=[["A. Görüşme ve gözlem",1,2,0,true],["B. Rakip araştırması",1,1,1,false],["C. İhtiyaç listesi",3,1,0,true],["D. Prototip geliştirme",4,4,0,true],["E. Tablet temini",4,2,2,false],["F. Çalışan eğitimi",8,1,0,true],["G. 1 şubede deneme",9,2,0,true]];
  let html='<div class="h" style="text-align:left">Görev / hafta</div>'+Array.from({length:10},(_,i)=>`<div class="h">${i+1}</div>`).join("");
  tasks.forEach(([nm,s,d,sl,crit])=>{ html+=`<div>${nm}</div>`; for(let w=1;w<=10;w++){ if(w>=s&&w<s+d) html+=`<div class="b${crit?" crit":""}"></div>`; else if(w>=s+d&&w<s+d+sl) html+='<div class="s"></div>'; else html+="<div></div>"; } });
  g.innerHTML=html;
}
function go(id){ location.hash=id?id:"kule"; }
function route(){
  const h=location.hash.replace("#",""), r=FL.find(x=>x.id===h&&x.type!=="soon");
  const onMap=h==="kavramlar", a=$("#navMap"), b=$("#navHome");
  if(onMap){ a.setAttribute("aria-current","page"); b.removeAttribute("aria-current"); } else { b.setAttribute("aria-current","page"); a.removeAttribute("aria-current"); }
  if(r) openRoom(r.id,0); else if(h==="kavramlar") openMap(); else closePanel();
}
document.addEventListener("keydown",e=>{
  if(e.target.matches("input,textarea")) return;
  const open=$("#panel").classList.contains("open");
  if(e.key==="Escape" && open) return go("");
  if(S.mode==="room"){ const r=FL[S.fl]; if(e.key==="ArrowRight"&&stepIx<r.steps.length-1) openRoom(r.id,stepIx+1); if(e.key==="ArrowLeft"&&stepIx>0) openRoom(r.id,stepIx-1); return; }
  if(open) return;
  if(e.key==="ArrowUp"){ e.preventDefault(); S.mode==="overview"? toTour(0) : toTour(S.fl+1); }
  if(e.key==="ArrowDown"){ e.preventDefault(); if(S.mode==="tour"){ S.fl===0? toOverview() : toTour(S.fl-1); } }
  if(e.key==="Enter" && S.mode==="tour" && e.target===document.body && FL[S.fl].type!=="soon") go(FL[S.fl].id);
});
$("#homeBtn").onclick=home;
$("#navHome").onclick=home;
$("#navMap").onclick=()=>{ location.hash="kavramlar"; };
$("#themeBtn").onclick=()=>{ const n=S.nightT<.5; S.nightT=n?1:0; document.body.classList.toggle("night",n);
  const b=$("#themeBtn"); b.setAttribute("aria-pressed",String(n)); b.setAttribute("aria-label",n?"Gündüz görünümüne geç":"Gece görünümüne geç");
  try{ localStorage.setItem("optibean-night",n?"1":"0"); }catch(e){}
  if(!ok3d) S.night=S.nightT; };
(function(){ const n=S.nightT>.5, b=$("#themeBtn"); b.setAttribute("aria-pressed",String(n)); b.setAttribute("aria-label",n?"Gündüz görünümüne geç":"Gece görünümüne geç"); })();

function fail3D(e){ ok3d=false; if(e&&window.console) console.error(e); document.body.classList.add("no3d","ready"); S.introDone=true; const c=$("#scene canvas"); if(c) c.remove(); }
buildUI();
addEventListener("hashchange",route); route();
(function(){
  if(!window.THREE) return fail3D();
  const start=()=>{ try{ init3D(); }catch(e){ fail3D(e); } };
  let done=false; const once=()=>{ if(!done){ done=true; start(); } };
  if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(once); setTimeout(once,1200); } else once();
})();
