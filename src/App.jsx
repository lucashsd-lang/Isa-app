import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ─── SUPABASE ───────────────────────────────────────────────────────────── */
const supabase = createClient(
  "https://ukllplmvdqoxmawzuhrf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrbGxwbG12ZHFveG1hd3p1aHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NjI3NzMsImV4cCI6MjA5NTQzODc3M30.GJVCOAZTxSVwfFLE7fLJRMmnngQifjsWmglOxhxZmOA"
);

/* ─── GLOBAL MODAL STATE ─────────────────────────────────────────────────── */
let _modalOpen = false;
const _subs = new Set();
const _openModal  = () => { _modalOpen = true;  _subs.forEach(fn => fn(true)); };
const _closeModal = () => { _modalOpen = false; _subs.forEach(fn => fn(false)); };
function useAnyModalOpen(){
  const [v,setV] = useState(false);
  useEffect(()=>{ _subs.add(setV); return ()=>_subs.delete(setV); },[]);
  return v;
}

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const P={
  calendar:"M8 2v3M16 2v3M3 9.5h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  box:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  chart:"M18 20V10M12 20V4M6 20v-6",
  plus:"M12 5v14M5 12h14",
  minus:"M5 12h14",
  x:"M18 6 6 18M6 6l12 12",
  check:"M20 6 9 17l-5-5",
  chevR:"M9 18l6-6-6-6",
  chevL:"M15 18l-6-6 6-6",
  alert:"M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  scissors:"M6 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm12 0a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM20 21l-16-9M20 3 4 12",
  search:"M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z",
  arrowU:"M12 19V5M5 12l7-7 7 7",
  arrowD:"M12 5v14M5 12l7 7 7-7",
  clock:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1.07h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z",
  history:"M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8",
  tag:"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  info:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M12 12v4",
  dots:"M12 5h.01M12 12h.01M12 19h.01",
  service:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12v4M10 14h4",
};
function Ic({n,size=20,color=C.muted,w=1.75,style={}}){
  if(!P[n]) return null;
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
      style={{flexShrink:0,display:"block",...style}}>
      <path d={P[n]}/>
    </svg>
  );
}

/* ─── TOAST ──────────────────────────────────────────────────────────────── */
function useToast(){
  const [items,setItems]=useState([]);
  const show=useCallback((msg,type="success")=>{
    const id=Date.now();
    setItems(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setItems(p=>p.filter(t=>t.id!==id)),2800);
  },[]);
  return{items,show};
}
function ToastLayer({items}){
  if(!items.length) return null;
  return(
    <div style={{position:"absolute",bottom:72,left:"50%",transform:"translateX(-50%)",
      zIndex:950,display:"flex",flexDirection:"column",gap:8,
      width:"calc(100% - 32px)",maxWidth:480,pointerEvents:"none"}}>
      {items.map(t=>(
        <div key={t.id} style={{background:t.type==="error"?C.red:t.type==="warn"?C.accent:C.green,
          color:"#fff",borderRadius:10,padding:"12px 16px",fontSize:14,fontWeight:600,
          display:"flex",alignItems:"center",gap:10,
          animation:"slideUp .25s ease",boxShadow:"0 4px 16px rgba(0,0,0,.15)"}}>
          <Ic n={t.type==="error"?"x":t.type==="warn"?"alert":"check"} size={16} color="#fff" w={2.5}/>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── CONTEXT MENU ───────────────────────────────────────────────────────── */
function CtxMenu({items}){
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    if(!open) return;
    const fn=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",fn); document.addEventListener("touchstart",fn);
    return()=>{document.removeEventListener("mousedown",fn);document.removeEventListener("touchstart",fn);};
  },[open]);
  return(
    <div ref={ref} style={{position:"relative",flexShrink:0}}>
      <button onClick={e=>{e.stopPropagation();setOpen(v=>!v);}}
        style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,
          background:open?C.bgAlt:C.white,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <Ic n="dots" size={17} color={C.sub} w={2.5}/>
      </button>
      {open&&(
        <div onClick={e=>e.stopPropagation()}
          style={{position:"absolute",right:0,top:"calc(100% + 4px)",zIndex:500,
            background:C.white,border:`1px solid ${C.border}`,borderRadius:10,
            minWidth:160,overflow:"hidden",animation:"fadeIn .15s ease"}}>
          {items.map((item,i)=>(
            <button key={item.label}
              onClick={e=>{e.stopPropagation();item.onClick();setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",
                padding:"11px 14px",background:"none",
                borderBottom:i<items.length-1?`1px solid ${C.border}`:"none",
                fontSize:14,fontWeight:500,color:item.danger?C.red:C.ink,fontFamily:F}}>
              <Ic n={item.icon} size={15} color={item.danger?C.red:C.sub} w={2}/>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PRIMITIVES ─────────────────────────────────────────────────────────── */
/* Flat card — no shadow */
function Card({children,style={},onClick}){
  return(
    <div onClick={onClick} style={{background:C.white,border:`1px solid ${C.border}`,
      borderRadius:12,padding:16,cursor:onClick?"pointer":"default",...style}}>
      {children}
    </div>
  );
}

function FL({children,required}){
  return(
    <div style={{fontSize:11,fontWeight:700,letterSpacing:.6,color:C.sub,
      textTransform:"uppercase",marginBottom:6,fontFamily:F}}>
      {children}{required&&<span style={{color:C.red,marginLeft:3}}>*</span>}
    </div>
  );
}

/* White background inputs */
function Input({label,required,hint,...p}){
  const [foc,setFoc]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",width:"100%",minWidth:0}}>
      {label&&<FL required={required}>{label}</FL>}
      <input {...p}
        onFocus={e=>{setFoc(true);p.onFocus?.(e);}}
        onBlur={e=>{setFoc(false);p.onBlur?.(e);}}
        style={{background:C.white,border:`1.5px solid ${foc?C.accent:C.border}`,
          borderRadius:8,padding:"10px 12px",fontSize:15,color:C.ink,
          outline:"none",width:"100%",minWidth:0,transition:"border-color .15s",fontFamily:F,...p.style}}/>
      {hint&&<div style={{fontSize:12,color:C.muted,marginTop:4}}>{hint}</div>}
    </div>
  );
}

function Sel({label,children,...p}){
  const [foc,setFoc]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",width:"100%",minWidth:0}}>
      {label&&<FL>{label}</FL>}
      <select {...p}
        onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
        style={{background:C.white,border:`1.5px solid ${foc?C.accent:C.border}`,
          borderRadius:8,padding:"10px 12px",fontSize:15,color:C.ink,
          outline:"none",appearance:"none",WebkitAppearance:"none",
          width:"100%",minWidth:0,transition:"border-color .15s",fontFamily:F,...p.style}}>
        {children}
      </select>
    </div>
  );
}

/* Decimal quantity input with embedded unit */
function QtyInput({value,onChange,und,label}){
  const [foc,setFoc]=useState(false);
  return(
    <div style={{display:"flex",flexDirection:"column",width:"100%",minWidth:0}}>
      {label&&<FL>{label}</FL>}
      <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${foc?C.accent:C.border}`,
        borderRadius:8,overflow:"hidden",background:C.white,transition:"border-color .15s"}}>
        <input type="number" inputMode="decimal" step="0.1" min="0"
          value={value===0?"":value}
          onChange={e=>onChange(parseFloat(e.target.value)||0)}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          placeholder="0"
          style={{flex:1,border:"none",padding:"10px 12px",fontSize:15,color:C.ink,
            outline:"none",background:"transparent",fontFamily:F,minWidth:0}}/>
        <div style={{padding:"0 12px 0 0",fontSize:13,fontWeight:600,color:C.muted,
          whiteSpace:"nowrap",flexShrink:0}}>{und}</div>
      </div>
    </div>
  );
}

/* Integer stepper */
function Stepper({value,onChange,min=0,max=9999,und="un"}){
  return(
    <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${C.border}`,
      borderRadius:8,overflow:"hidden",background:C.white,width:"100%"}}>
      <button onClick={()=>onChange(Math.max(min,value-1))}
        style={{width:38,minWidth:38,height:44,background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Ic n="minus" size={15} color={value<=min?C.muted:C.ink}/>
      </button>
      <div style={{flex:1,minWidth:0,textAlign:"center",fontWeight:700,fontSize:15,color:C.ink,
        borderLeft:`1px solid ${C.border}`,borderRight:`1px solid ${C.border}`,padding:"8px 2px",lineHeight:1.4,overflow:"hidden"}}>
        {value}<br/><span style={{fontSize:10,fontWeight:500,color:C.muted}}>{und}</span>
      </div>
      <button onClick={()=>onChange(Math.min(max,value+1))}
        style={{width:38,minWidth:38,height:44,background:"none",border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Ic n="plus" size={15} color={C.ink}/>
      </button>
    </div>
  );
}

function Btn({children,variant="primary",onClick,full,disabled,style={},icon,size="md"}){
  const sz={sm:{p:"8px 12px",fs:13},md:{p:"10px 16px",fs:14},lg:{p:"12px 20px",fs:15}}[size];
  const V={
    primary:  {bg:C.accent,    color:"#fff",  bd:"none"},
    secondary:{bg:C.accentBg,  color:C.accent,bd:"none"},
    outline:  {bg:"transparent",color:C.accent,bd:`1.5px solid ${C.accent}`},
    ghost:    {bg:"transparent",color:C.sub,   bd:`1.5px solid ${C.border}`},
    danger:   {bg:C.redBg,     color:C.red,   bd:"none"},
    success:  {bg:C.greenBg,   color:C.green, bd:"none"},
    dark:     {bg:C.ink,       color:"#fff",  bd:"none"},
  };
  const {bg,color,bd}=V[variant]||V.primary;
  return(
    <button onClick={onClick} disabled={disabled} style={{
      display:"flex",alignItems:"center",justifyContent:"center",gap:6,
      background:bg,color,border:bd,borderRadius:8,padding:sz.p,
      fontSize:sz.fs,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
      opacity:disabled?.4:1,width:full?"100%":"auto",minHeight:44,
      whiteSpace:"nowrap",fontFamily:F,flexShrink:0,...style}}>
      {icon&&<Ic n={icon} size={sz.fs} color={color} w={2}/>}
      {children}
    </button>
  );
}

function Badge({children,color=C.accent,bg}){
  return(
    <span style={{background:bg||(color+"18"),color,fontSize:11,fontWeight:700,
      padding:"3px 8px",borderRadius:20,letterSpacing:.2,whiteSpace:"nowrap",flexShrink:0,fontFamily:F}}>
      {children}
    </span>
  );
}

/* Bottom drawer */
function Drawer({open,onClose,title,children}){
  useEffect(()=>{
    if(open){ _openModal(); document.body.style.overflow="hidden"; }
    return()=>{ _closeModal(); document.body.style.overflow=""; };
  },[open]);;
  if(!open) return null;
  return(
    <div style={{position:"absolute",inset:0,zIndex:800}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(15,23,42,.45)",backdropFilter:"blur(3px)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.white,
        borderRadius:"16px 16px 0 0",maxHeight:"92vh",overflowY:"auto",
        paddingBottom:"env(safe-area-inset-bottom)",animation:"slideUp .25s ease"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
          <div style={{width:36,height:4,borderRadius:4,background:C.border}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"12px 20px 14px",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:17,fontWeight:700,color:C.ink,fontFamily:F}}>{title}</span>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:8,background:C.bg,
            border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic n="x" size={16} color={C.sub}/>
          </button>
        </div>
        <div style={{padding:"18px 20px 24px",overflow:"hidden"}}>{children}</div>
      </div>
    </div>
  );
}

/* Full screen */
function Screen({open,onClose,title,children,action}){
  useEffect(()=>{
    if(open){ _openModal(); }
    return()=>{ _closeModal(); };
  },[open]);
  if(!open) return null;
  return(
    <div style={{position:"absolute",inset:0,background:C.bg,zIndex:700,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.white,borderBottom:`1px solid ${C.border}`,padding:"12px 16px",
        position:"sticky",top:0,zIndex:10,display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onClose} style={{width:40,height:40,borderRadius:8,background:C.bg,
          border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Ic n="chevL" size={18} color={C.ink} w={2}/>
        </button>
        <span style={{flex:1,fontSize:17,fontWeight:700,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:F}}>{title}</span>
        {action}
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 16px 96px"}}>{children}</div>
    </div>
  );
}

function InfoRow({icon,label,value,accent,last}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",
      borderBottom:last?"none":`1px solid ${C.border}`}}>
      <div style={{width:32,height:32,borderRadius:8,background:C.accentBg,
        display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Ic n={icon} size={15} color={C.accent} w={2}/>
      </div>
      <span style={{flex:1,color:C.sub,fontSize:14}}>{label}</span>
      <span style={{fontWeight:600,fontSize:14,color:accent||C.ink,textAlign:"right",maxWidth:"58%",wordBreak:"break-word"}}>{value}</span>
    </div>
  );
}

function PBar({pct,color=C.accent,h=5}){
  return(
    <div style={{height:h,borderRadius:h,background:C.bgAlt,overflow:"hidden",border:`1px solid ${C.border}`}}>
      <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:color,borderRadius:h}}/>
    </div>
  );
}

/* Confirmation dialog */
function Confirm({open,msg,onYes,onNo}){
  if(!open) return null;
  return(
    <div style={{position:"absolute",inset:0,zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div onClick={onNo} style={{position:"absolute",inset:0,background:"rgba(15,23,42,.4)",backdropFilter:"blur(3px)"}}/>
      <div style={{position:"relative",background:C.white,borderRadius:16,padding:"24px 20px",
        width:"100%",maxWidth:320,animation:"fadeIn .2s ease"}}>
        <div style={{fontSize:16,fontWeight:700,color:C.ink,marginBottom:8}}>Confirmar ação</div>
        <div style={{fontSize:14,color:C.sub,marginBottom:20,lineHeight:1.5}}>{msg}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10}}>
          <Btn variant="ghost" full onClick={onNo}>Cancelar</Btn>
          <Btn variant="danger" full onClick={onYes}>Confirmar</Btn>
        </div>
      </div>
    </div>
  );
}

/* Calendar grid */
function CalGrid({year,month,ags,sel,onSel}){
  const first=new Date(year,month,1).getDay();
  const days=new Date(year,month+1,0).getDate();
  const cells=Array(first).fill(null);
  for(let d=1;d<=days;d++) cells.push(d);
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:4}}>
        {DSEM.map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:C.muted,padding:"4px 0",letterSpacing:.3}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={`e${i}`}/>;
          const iso=makeISO(year,month,d),isSel=iso===sel,isT=iso===TODAY;
          const hC=ags.some(a=>a.data===iso&&a.status==="concluido");
          const hA=ags.some(a=>a.data===iso&&a.status==="agendado");
          return(
            <button key={d} onClick={()=>onSel(iso)} style={{padding:"6px 2px",borderRadius:8,border:"none",
              background:isSel?C.accent:isT?C.accentBg:"transparent",
              display:"flex",flexDirection:"column",alignItems:"center",gap:2,minHeight:44}}>
              <span style={{fontSize:14,fontWeight:isSel||isT?700:400,color:isSel?"#fff":isT?C.accent:C.ink}}>{d}</span>
              <div style={{display:"flex",gap:2,height:6,alignItems:"center"}}>
                {hC&&<div style={{width:4,height:4,borderRadius:"50%",background:isSel?"rgba(255,255,255,.7)":C.green}}/>}
                {hA&&<div style={{width:4,height:4,borderRadius:"50%",background:isSel?"rgba(255,255,255,.7)":C.accent}}/>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── FINALIZAR SCREEN ──────────────────────────────────────────────────── */
function FinalizarScreen({open,agFin,onClose,prodUsados,setProdUsados,servicosExtra,setServicosExtra,custoTotal,confirmarFinalizar,prods,servicos,addProd,addServOpen,setAddServOpen,addServForm,setAddServForm}){
  const [pagamento,setPagamento]=useState("pix");
  const [valorPrincipal,setValorPrincipal]=useState("");
  useEffect(()=>{ if(agFin) setValorPrincipal(String(parseFloat(agFin.valor)||0)); },[agFin?.id]);
  if(!open||!agFin) return null;
  const totalServicos=(parseFloat(valorPrincipal)||parseFloat(agFin.valor))+servicosExtra.reduce((s,x)=>s+parseFloat(x.valor||0),0);
  const lucroLiq=totalServicos-custoTotal;
  return(
    <Screen open={true} onClose={onClose} title="Finalizar Atendimento">
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {/* Cliente */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:C.accentLt,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:15,fontWeight:700,color:C.accent,flexShrink:0}}>
            {agFin.cliente.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}
          </div>
          <div>
            <div style={{fontWeight:700,fontSize:16,color:C.ink}}>{agFin.cliente}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:1}}>{fmtBR(agFin.data)} · {agFin.hora}</div>
          </div>
        </div>

        {/* SERVICOS */}
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:.6,color:C.muted,
            textTransform:"uppercase",marginBottom:10}}>Serviços</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
              background:C.white,border:`1px solid ${C.border}`,borderRadius:10}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14,color:C.ink}}>{agFin.servico}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:1}}>Serviço principal</div>
              </div>
              <input type="number" inputMode="decimal"
                value={valorPrincipal}
                onChange={e=>setValorPrincipal(e.target.value)}
                style={{width:88,textAlign:"right",border:`1.5px solid ${C.border}`,
                  borderRadius:6,padding:"5px 8px",fontSize:14,fontWeight:700,
                  color:C.accent,background:C.white,outline:"none",fontFamily:F,flexShrink:0}}/>
            </div>
            {servicosExtra.map((x,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
                background:C.white,border:`1px solid ${C.border}`,borderRadius:10}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,color:C.ink}}>{x.servico}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:1}}>Adicional</div>
                </div>
                <div style={{fontWeight:700,fontSize:15,color:C.accent,marginRight:8}}>{brl(x.valor)}</div>
                <button onClick={()=>setServicosExtra(p=>p.filter((_,j)=>j!==i))}
                  style={{width:26,height:26,borderRadius:6,background:C.redBg,border:"none",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic n="x" size={12} color={C.red} w={2.5}/>
                </button>
              </div>
            ))}
            <button onClick={()=>setAddServOpen(true)}
              style={{width:"100%",padding:"11px 14px",borderRadius:10,
                border:`1.5px dashed ${C.borderDk}`,background:"transparent",
                display:"flex",alignItems:"center",gap:8,
                color:C.accent,fontWeight:600,fontSize:13,fontFamily:F}}>
              <Ic n="plus" size={15} color={C.accent} w={2.5}/>
              Adicionar serviço
            </button>
          </div>
        </div>

        {/* PRODUTOS */}
        <div>
          <div style={{fontSize:11,fontWeight:700,letterSpacing:.6,color:C.muted,
            textTransform:"uppercase",marginBottom:10}}>
            Produtos utilizados&#32;
            <span style={{fontSize:10,fontWeight:400,textTransform:"none",letterSpacing:0}}>(opcional)</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {prodUsados.map(u=>(
              <div key={u.pid} style={{padding:"12px 14px",background:C.white,
                border:`1px solid ${C.border}`,borderRadius:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{flex:1,minWidth:0,paddingRight:8}}>
                    <div style={{fontWeight:600,fontSize:14,color:C.ink}}>{u.nome}</div>
                    <div style={{fontSize:12,color:C.muted}}>Custo: {brl(u.custo)}/un</div>
                  </div>
                  <button onClick={()=>setProdUsados(p=>p.filter(x=>x.pid!==u.pid))}
                    style={{width:26,height:26,borderRadius:6,background:C.redBg,border:"none",
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Ic n="x" size={12} color={C.red} w={2.5}/>
                  </button>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1}}>
                    <QtyInput value={u.qtd} und="g"
                      onChange={q=>setProdUsados(p=>p.map(x=>x.pid===u.pid?{...x,qtd:q}:x))}/>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:11,color:C.muted}}>custo</div>
                    <div style={{fontWeight:700,color:C.red,fontSize:14}}>{brl(u.qtd*u.custo)}</div>
                  </div>
                </div>
              </div>
            ))}
            <Card style={{padding:"12px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:.5,color:C.muted,
                textTransform:"uppercase",marginBottom:8}}>Adicionar produto</div>
              <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:180,overflowY:"auto"}}>
                {prods.filter(p=>!prodUsados.find(u=>u.pid===p.id)).map(p=>(
                  <button key={p.id} onClick={()=>addProd(p.id)}
                    style={{textAlign:"left",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,
                      padding:"9px 12px",display:"flex",justifyContent:"space-between",
                      alignItems:"center",fontFamily:F}}>
                    <div>
                      <div style={{fontSize:13.5,fontWeight:600,color:C.ink}}>{p.nome}</div>
                      <div style={{fontSize:12,color:C.muted}}>{p.qtd} {p.und} disponível</div>
                    </div>
                    <Ic n="plus" size={16} color={C.accent} w={2.5}/>
                  </button>
                ))}
                {prods.every(p=>prodUsados.find(u=>u.pid===p.id))&&(
                  <div style={{textAlign:"center",color:C.muted,fontSize:13,padding:"8px 0"}}>Todos adicionados</div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* COMANDA */}
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"12px 16px 10px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:.8,
              color:C.muted,textTransform:"uppercase"}}>Comanda</span>
            <span style={{fontSize:11,color:C.muted}}>{fmtBR(agFin.data)}</span>
          </div>
          <div style={{padding:"12px 16px 0"}}>
            {[{servico:agFin.servico,valor:agFin.valor},...servicosExtra].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:14,color:C.sub}}>{s.servico}</span>
                <span style={{fontSize:14,fontWeight:600,color:C.ink}}>{brl(s.valor)}</span>
              </div>
            ))}
            {prodUsados.length>0&&(
              <div>
                <div style={{height:1,background:C.border,margin:"8px 0"}}/>
                {prodUsados.map(u=>(
                  <div key={u.pid} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,color:C.muted}}>{u.nome} · {u.qtd}g</span>
                    <span style={{fontSize:13,color:C.red}}>-{brl(u.qtd*u.custo)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Forma de pagamento */}
          <div style={{padding:"12px 16px 0",borderTop:`1px solid ${C.border}`,margin:"8px 0 0"}}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:.6,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Forma de pagamento</div>
            <div style={{display:"flex",gap:8}}>
              {[{id:"pix",label:"Pix"},{id:"dinheiro",label:"Dinheiro"},{id:"cartao",label:"Cartão"}].map(p=>(
                <button key={p.id} onClick={()=>setPagamento(p.id)} style={{
                  flex:1,padding:"10px 8px",borderRadius:8,fontFamily:F,fontSize:13,fontWeight:600,
                  border:`1.5px solid ${pagamento===p.id?C.accent:C.border}`,
                  background:pagamento===p.id?C.accentBg:"transparent",
                  color:pagamento===p.id?C.accent:C.sub,transition:"all .15s"}}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{padding:"12px 16px 14px",borderTop:`2px solid ${C.border}`,
            margin:"8px 0 0",background:C.bgAlt}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:15,fontWeight:700,color:C.ink}}>Total cobrado</span>
              <span style={{fontSize:20,fontWeight:800,color:C.accent}}>{brl(totalServicos)}</span>
            </div>
            {prodUsados.length>0&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:C.muted}}>Lucro estimado</span>
                <span style={{fontSize:14,fontWeight:700,color:lucroLiq>=0?C.green:C.red}}>{brl(lucroLiq)}</span>
              </div>
            )}
          </div>
        </div>

        <Btn full icon="check" size="lg" onClick={()=>confirmarFinalizar(pagamento)}>Confirmar Atendimento</Btn>
      </div>

      <Drawer open={addServOpen} onClose={()=>setAddServOpen(false)} title="Adicionar Serviço">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Sel label="Serviço" value={addServForm.servico}
            onChange={e=>setAddServForm({...addServForm,servico:e.target.value})}>
            {servicos.map(s=><option key={s.id}>{s.nome}</option>)}
          </Sel>
          <Input label="Valor (R$)" required type="number" inputMode="decimal"
            value={addServForm.valor}
            onChange={e=>setAddServForm({...addServForm,valor:e.target.value})}
            placeholder="0,00"/>
          <Btn full icon="check" disabled={!addServForm.valor} onClick={()=>{
            setServicosExtra(p=>[...p,{...addServForm}]);
            setAddServOpen(false);
            setAddServForm({servico:servicos[0]?.nome||"",valor:""});
          }}>Adicionar</Btn>
        </div>
      </Drawer>
    </Screen>
  );
}

/* ─── AGENDA ─────────────────────────────────────────────────────────────── */
function Agenda({ags,setAgs,clis,prods,setProds,toast,servicos}){
  const [year,setYear]=useState(HOJE.getFullYear());
  const [month,setMonth]=useState(HOJE.getMonth());
  const [calOpen,setCalOpen]=useState(false);
  const [sel,setSel]=useState(TODAY);
  const [formOpen,setFormOpen]=useState(false);
  const [detail,setDetail]=useState(null);
  const [finId,setFinId]=useState(null);
  const [prodUsados,setProdUsados]=useState([]);
  const [confirmCancel,setConfirmCancel]=useState(null);
  const [servicosExtra,setServicosExtra]=useState([]);
  const [addServOpen,setAddServOpen]=useState(false);
  const [addServForm,setAddServForm]=useState({servico:"Corte",valor:""});
  const [form,setForm]=useState({cliente:"",servico:servicos[0]?.nome||"",hora:"09:00",valor:""});

  const dodia=useMemo(()=>ags.filter(a=>a.data===sel).sort((a,b)=>a.hora.localeCompare(b.hora)),[ags,sel]);
  const agSel=detail?ags.find(a=>a.id===detail):null;
  const agFin=finId?ags.find(a=>a.id===finId):null;
  const SC={agendado:C.accent,concluido:C.green,cancelado:C.red};
  const SBG={agendado:C.accentBg,concluido:C.greenBg,cancelado:C.redBg};
  const SL={agendado:"Agendado",concluido:"Concluído",cancelado:"Cancelado"};

  function navMonth(dir){let m=month+dir,y=year;if(m<0){m=11;y--;}if(m>11){m=0;y++;}setMonth(m);setYear(y);}
  function pickDate(iso){setSel(iso);const d=new Date(iso+"T00:00:00");setYear(d.getFullYear());setMonth(d.getMonth());}

  function salvar(){
    if(!form.cliente||!form.valor) return;
    setAgs(p=>[...p,{id:`ag-${Date.now()}`,data:sel,hora:form.hora,
      cliente:form.cliente,servico:form.servico,
      valor:parseFloat(form.valor).toFixed(2),status:"agendado",produtosUsados:[]}]);
    setFormOpen(false);
    setForm({cliente:"",servico:servicos[0]?.nome||"",hora:"09:00",valor:""});
    toast("Agendamento criado com sucesso");
  }

  function abrirFinalizar(id){setFinId(id);setProdUsados([]);setServicosExtra([]);setDetail(null);}

  function confirmarFinalizar(pagamento="pix"){
    const agora=`${pad(HOJE.getHours())}:${pad(HOJE.getMinutes())}`;
    const totalServ=agFin?parseFloat(agFin.valor)+servicosExtra.reduce((s,x)=>s+parseFloat(x.valor||0),0):0;
    setAgs(p=>p.map(a=>a.id===finId?{...a,status:"concluido",produtosUsados:prodUsados,valorFinal:totalServ.toFixed(2),servicosExtra,pagamento}:a));
    if(prodUsados.length>0){
      setProds(prev=>prev.map(pr=>{
        const uso=prodUsados.find(u=>u.pid===pr.id);
        if(!uso) return pr;
        const reg={tipo:"saida",qtd:uso.qtd,und:"g",obs:`${agFin?.servico} — ${agFin?.cliente}`,data:TODAY,hora:agora};
        return{...pr,qtd:Math.max(0,pr.qtd-uso.qtd),movs:[reg,...(pr.movs||[])]};
      }));
    }
    toast("Atendimento finalizado com sucesso");
    setFinId(null);setProdUsados([]);
  }

  function addProd(pid){
    if(prodUsados.find(u=>u.pid===pid)) return;
    const pr=prods.find(p=>p.id===pid);
    if(pr) setProdUsados(prev=>[...prev,{pid,nome:pr.nome,und:"g",custo:pr.custo,qtd:0}]);
  }

  function cancelarAg(id){
    setAgs(p=>p.map(a=>a.id===id?{...a,status:"cancelado"}:a));
    setDetail(null);setConfirmCancel(null);
    toast("Agendamento cancelado","warn");
  }

  const custoTotal=prodUsados.reduce((s,u)=>s+u.qtd*u.custo,0);
  const recDia=dodia.filter(a=>a.status==="concluido").reduce((s,a)=>s+parseFloat(a.valor),0);
  const selDt=new Date(sel+"T00:00:00");
  const strip=useMemo(()=>Array.from({length:14},(_,i)=>offsetDate(i-2)),[]);

  return(
    <div>
      {/* Page header — inline, no sticky global header */}
      <div style={{padding:"16px 16px 0",display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:22,fontWeight:800,color:C.ink,letterSpacing:-.5,lineHeight:1.1}}>
            {selDt.toLocaleDateString("pt-BR",{weekday:"long"})}
          </div>
          <div style={{fontSize:14,color:C.muted,marginTop:2}}>
            {selDt.toLocaleDateString("pt-BR",{day:"numeric",month:"long",year:"numeric"})}
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,paddingTop:2}}>
          <button onClick={()=>setCalOpen(v=>!v)} style={{width:40,height:40,borderRadius:8,
            border:`1.5px solid ${calOpen?C.accent:C.border}`,background:calOpen?C.accentBg:C.white,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Ic n="calendar" size={18} color={calOpen?C.accent:C.sub} w={2}/>
          </button>
          <button onClick={()=>setFormOpen(true)} style={{height:40,padding:"0 14px",borderRadius:8,
            border:"none",background:C.accent,color:"#fff",fontWeight:700,fontSize:13,
            display:"flex",alignItems:"center",gap:6,fontFamily:F}}>
            <Ic n="plus" size={15} color="#fff" w={2.5}/>Novo
          </button>
        </div>
      </div>

      {/* Calendar */}
      {calOpen&&(
        <div style={{padding:"12px 16px 0"}}>
          <Card style={{padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <button onClick={()=>navMonth(-1)} style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.white,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="chevL" size={16} color={C.ink} w={2}/></button>
              <span style={{fontWeight:700,fontSize:15,color:C.ink}}>{MESES[month]} {year}</span>
              <button onClick={()=>navMonth(1)} style={{width:36,height:36,borderRadius:8,border:`1px solid ${C.border}`,background:C.white,display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="chevR" size={16} color={C.ink} w={2}/></button>
            </div>
            <CalGrid year={year} month={month} ags={ags} sel={sel} onSel={d=>{pickDate(d);}}/>
            <div style={{display:"flex",gap:16,marginTop:10,paddingTop:10,borderTop:`1px solid ${C.border}`}}>
              {[{c:C.green,l:"Concluído"},{c:C.accent,l:"Agendado"}].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:x.c}}/>
                  <span style={{fontSize:11,color:C.muted}}>{x.l}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Day strip */}
      {!calOpen&&(
        <div style={{display:"flex",gap:4,overflowX:"auto",padding:"12px 16px 0",scrollbarWidth:"none"}}>
          {strip.map(d=>{
            const s=d===sel,isT=d===TODAY,cnt=ags.filter(a=>a.data===d).length;
            const dt=new Date(d+"T00:00:00");
            return(
              <button key={d} onClick={()=>pickDate(d)} style={{minWidth:48,padding:"8px 2px",borderRadius:8,
                border:"none",background:s?C.accent:isT?C.accentBg:"transparent",
                display:"flex",flexDirection:"column",alignItems:"center",gap:2,flexShrink:0}}>
                <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,color:s?"rgba(255,255,255,.8)":C.muted}}>
                  {dt.toLocaleDateString("pt-BR",{weekday:"short"})}
                </span>
                <span style={{fontSize:18,fontWeight:800,lineHeight:1,color:s?"#fff":isT?C.accent:C.ink}}>{dt.getDate()}</span>
                <div style={{width:5,height:5,borderRadius:"50%",background:cnt>0?(s?"rgba(255,255,255,.7)":C.accent):"transparent"}}/>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Stats linha acima dos cards ── */}
      <div style={{padding:"12px 16px 8px",display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
        <span style={{fontSize:13,color:C.sub,fontWeight:600}}>
          {dodia.length} agendamento{dodia.length!==1?"s":""}
        </span>
        {recDia>0&&(
          <>
            <span style={{fontSize:13,color:C.muted}}>·</span>
            <span style={{fontSize:13,color:C.green,fontWeight:700}}>{brl(recDia)}</span>
          </>
        )}
      </div>

      {/* Appointment list */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {dodia.length===0&&(
          <div style={{textAlign:"center",padding:"40px 20px",border:`1.5px dashed ${C.border}`,borderRadius:12,background:C.white}}>
            <Ic n="calendar" size={32} color={C.border} style={{margin:"0 auto 8px"}}/>
            <div style={{color:C.muted,fontSize:14}}>Nenhum agendamento neste dia</div>
          </div>
        )}
        {dodia.map(a=>(
          <Card key={a.id} onClick={()=>setDetail(a.id)} style={{cursor:"pointer",padding:"14px"}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700,color:C.ink,marginBottom:6}}>{a.cliente}</div>
                <Badge color={SC[a.status]} bg={SBG[a.status]}>{a.servico}</Badge>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:13,fontWeight:600,color:C.muted}}>{a.hora}</div>
                <div style={{fontSize:15,fontWeight:700,color:C.accent,marginTop:3}}>{brl(a.valor)}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* New appointment */}
      <Drawer open={formOpen} onClose={()=>setFormOpen(false)} title="Novo Agendamento">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Cliente" required list="clist-ag" value={form.cliente}
            onChange={e=>setForm({...form,cliente:e.target.value})} placeholder="Nome da cliente"/>
          <datalist id="clist-ag">{clis.map(c=><option key={c.id} value={c.nome}/>)}</datalist>
          <Sel label="Serviço" value={form.servico} onChange={e=>{
            const svc=servicos.find(s=>s.nome===e.target.value);
            setForm({...form,servico:e.target.value,valor:svc?.valorPadrao?String(svc.valorPadrao):form.valor});
          }}>
            {servicos.map(s=><option key={s.id}>{s.nome}</option>)}
          </Sel>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
            <Input label="Horário" type="time" value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})}/>
            <Input label="Valor (R$)" required type="number" inputMode="decimal" value={form.valor}
              onChange={e=>setForm({...form,valor:e.target.value})} placeholder="0,00"/>
          </div>
          <Btn full icon="check" onClick={salvar} disabled={!form.cliente||!form.valor}>Confirmar</Btn>
        </div>
      </Drawer>

      {/* Detail */}
      <Screen open={!!detail&&!finId} onClose={()=>setDetail(null)} title={agSel?.cliente||""}>
        {agSel&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <Card>
              <InfoRow icon="tag"   label="Serviço"   value={agSel.servico}/>
              <InfoRow icon="clock" label="Data / Hora" value={`${fmtBR(agSel.data)} · ${agSel.hora}`}/>
              <InfoRow icon="tag"   label="Valor"     value={brl(agSel.valor)} accent={C.accent}/>
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0 0"}}>
                <div style={{width:32,height:32,borderRadius:8,background:C.accentBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Ic n="info" size={15} color={C.accent} w={2}/>
                </div>
                <span style={{flex:1,color:C.sub,fontSize:14}}>Status</span>
                <Badge color={SC[agSel.status]} bg={SBG[agSel.status]}>{SL[agSel.status]}</Badge>
              </div>
              {agSel.produtosUsados?.length>0&&(
                <div style={{marginTop:10,borderTop:`1px solid ${C.border}`,paddingTop:10}}>
                  <div style={{fontSize:11,fontWeight:700,letterSpacing:.5,color:C.muted,textTransform:"uppercase",marginBottom:8}}>Produtos utilizados</div>
                  {agSel.produtosUsados.map((u,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.sub,padding:"3px 0"}}>
                      <span>{u.nome} · {u.qtd}{u.und}</span>
                      <span style={{fontWeight:600,color:C.ink}}>-{brl(u.qtd*u.custo)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            {agSel.status==="agendado"&&(
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:10,marginTop:4}}>
                <Btn variant="primary" full icon="check" onClick={()=>abrirFinalizar(agSel.id)}>Finalizar</Btn>
                <Btn variant="danger" full icon="x" onClick={()=>setConfirmCancel(agSel.id)}>Cancelar</Btn>
              </div>
            )}
          </div>
        )}
      </Screen>

      {/* Finalize — comanda */}
      <FinalizarScreen
        open={!!finId} agFin={agFin} onClose={()=>setFinId(null)}
        prodUsados={prodUsados} setProdUsados={setProdUsados}
        servicosExtra={servicosExtra} setServicosExtra={setServicosExtra}
        custoTotal={custoTotal} confirmarFinalizar={confirmarFinalizar}
        prods={prods} servicos={servicos}
        addProd={addProd} addServOpen={addServOpen} setAddServOpen={setAddServOpen}
        addServForm={addServForm} setAddServForm={setAddServForm}
      />

      <Confirm open={!!confirmCancel}
        msg="Deseja cancelar este agendamento?"
        onYes={()=>cancelarAg(confirmCancel)}
        onNo={()=>setConfirmCancel(null)}/>
    </div>
  );
}

/* ─── CLIENTES ───────────────────────────────────────────────────────────── */
function Clientes({clis,setClis,ags,setAgs,toast,servicos}){
  const [busca,setBusca]=useState("");
  const [formOpen,setFormOpen]=useState(false);
  const [servOpen,setServOpen]=useState(null); /* client id for new service */
  const [detail,setDetail]=useState(null);
  const [form,setForm]=useState({nome:"",tel:"",email:"",nasc:"",obs:""});
  const [servForm,setServForm]=useState({servico:servicos[0]?.nome||"",valor:"",data:TODAY,hora:"09:00"});
  const [confirm,setConfirm]=useState(null);

  const totalGasto=nome=>ags.filter(a=>a.cliente===nome&&a.status==="concluido").reduce((s,a)=>s+parseFloat(a.valor),0);
  const filtrados=clis.filter(c=>c.nome.toLowerCase().includes(busca.toLowerCase())||c.tel.includes(busca));
  const cliSel=detail?clis.find(c=>c.id===detail):null;
  const histSel=cliSel?ags.filter(a=>a.cliente===cliSel.nome).sort((a,b)=>b.data.localeCompare(a.data)):[];

  function salvar(){
    if(!form.nome) return;
    setClis(p=>[...p,{id:`c-${Date.now()}`,...form,visitas:0}]);
    setFormOpen(false); setForm({nome:"",tel:"",email:"",nasc:"",obs:""});
    toast("Cliente cadastrada com sucesso");
  }

  function excluir(id){
    setClis(p=>p.filter(c=>c.id!==id));
    setDetail(null); setConfirm(null);
    toast("Cliente removida","warn");
  }

  function lancarServico(){
    if(!servForm.valor) return;
    const cliNome=clis.find(c=>c.id===servOpen)?.nome||"";
    setAgs(p=>[...p,{id:`ag-${Date.now()}`,data:servForm.data,hora:servForm.hora,
      cliente:cliNome,servico:servForm.servico,
      valor:parseFloat(servForm.valor).toFixed(2),status:"concluido",produtosUsados:[]}]);
    setClis(p=>p.map(c=>c.id===servOpen?{...c,visitas:c.visitas+1}:c));
    setServOpen(null); setServForm({servico:servicos[0]?.nome||"",valor:"",data:TODAY,hora:"09:00"});
    toast("Serviço lançado com sucesso");
  }

  const SC={agendado:C.accent,concluido:C.green,cancelado:C.red};
  const SBG={agendado:C.accentBg,concluido:C.greenBg,cancelado:C.redBg};
  const SL={agendado:"Agendado",concluido:"Concluído",cancelado:"Cancelado"};

  return(
    <div>
      {/* Inline page header */}
      <div style={{padding:"16px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <span style={{fontSize:22,fontWeight:800,color:C.ink,letterSpacing:-.5}}>Clientes</span>
        <Btn icon="plus" size="sm" onClick={()=>setFormOpen(true)}>Cadastrar</Btn>
      </div>

      {/* Search */}
      <div style={{padding:"0 16px 14px"}}>
        <div style={{position:"relative"}}>
          <Ic n="search" size={16} color={C.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por nome ou telefone…"
            style={{width:"100%",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:8,
              padding:"10px 12px 10px 36px",color:C.ink,fontSize:14,outline:"none",fontFamily:F}}
            onFocus={e=>e.target.style.borderColor=C.accent}
            onBlur={e=>e.target.style.borderColor=C.border}/>
        </div>
      </div>

      <div style={{padding:"0 16px 8px"}}>
        <span style={{fontSize:13,color:C.muted,fontWeight:600}}>{filtrados.length} cliente{filtrados.length!==1?"s":""}</span>
      </div>

      {/* Client cards */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {filtrados.map(c=>{
          const gasto=totalGasto(c.nome);
          return(
            <Card key={c.id} onClick={()=>setDetail(c.id)} style={{cursor:"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:"50%",flexShrink:0,
                  background:C.accentLt,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:14,fontWeight:700,color:C.accent}}>
                  {inits(c.nome)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,color:C.ink,fontSize:14.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>
                    {c.nome}
                  </div>
                  <div style={{color:C.muted,fontSize:12.5}}>{c.tel} · {c.visitas} visitas</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{color:C.accent,fontWeight:700,fontSize:14}}>{brl(gasto)}</div>
                  <Ic n="chevR" size={14} color={C.border} w={2} style={{marginTop:3}}/>
                </div>
              </div>
            </Card>
          );
        })}
        {filtrados.length===0&&(
          <div style={{textAlign:"center",padding:"40px 20px",border:`1.5px dashed ${C.border}`,borderRadius:12,background:C.white}}>
            <Ic n="users" size={32} color={C.border} style={{margin:"0 auto 8px"}}/>
            <div style={{color:C.muted,fontSize:14}}>Nenhuma cliente encontrada</div>
          </div>
        )}
      </div>

      {/* New client */}
      <Drawer open={formOpen} onClose={()=>setFormOpen(false)} title="Nova Cliente">
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Nome completo" required value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Ex: Maria Silva"/>
          <Input label="Telefone" type="tel" value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="(11) 99999-9999"/>
          <Input label="E-mail" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@exemplo.com"/>
          <Input label="Data de nascimento" type="date" value={form.nasc} onChange={e=>setForm({...form,nasc:e.target.value})}/>
          <Input label="Observações" value={form.obs} onChange={e=>setForm({...form,obs:e.target.value})} placeholder="Alergias, preferências…"/>
          <Btn full icon="check" onClick={salvar} disabled={!form.nome}>Cadastrar</Btn>
        </div>
      </Drawer>

      {/* Lançar serviço */}
      <Drawer open={!!servOpen} onClose={()=>setServOpen(null)} title={`Lançar serviço — ${clis.find(c=>c.id===servOpen)?.nome||""}`}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:C.accentBg,border:`1px solid ${C.accentLt}`,borderRadius:8,padding:"10px 12px",fontSize:13,color:C.accent}}>
            O serviço será registrado como concluído no histórico da cliente.
          </div>
          <Sel label="Serviço" value={servForm.servico} onChange={e=>{
            const svc=servicos.find(s=>s.nome===e.target.value);
            setServForm({...servForm,servico:e.target.value,valor:svc?.valorPadrao?String(svc.valorPadrao):servForm.valor});
          }}>
            {servicos.map(s=><option key={s.id}>{s.nome}</option>)}
          </Sel>
          <Input label="Valor (R$)" required type="number" inputMode="decimal" value={servForm.valor}
            onChange={e=>setServForm({...servForm,valor:e.target.value})} placeholder="0,00"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
            <Input label="Data" type="date" value={servForm.data} onChange={e=>setServForm({...servForm,data:e.target.value})}/>
            <Input label="Horário" type="time" value={servForm.hora} onChange={e=>setServForm({...servForm,hora:e.target.value})}/>
          </div>
          <Btn full icon="check" variant="primary" onClick={lancarServico} disabled={!servForm.valor}>Lançar Serviço</Btn>
        </div>
      </Drawer>

      {/* Profile */}
      {cliSel&&(
        <Screen open={!!detail} onClose={()=>setDetail(null)} title={cliSel.nome}
          action={
            <button onClick={()=>setServOpen(cliSel.id)} style={{height:36,padding:"0 12px",borderRadius:8,
              border:`1.5px solid ${C.accent}`,background:C.accentBg,color:C.accent,
              fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,fontFamily:F}}>
              <Ic n="service" size={14} color={C.accent} w={2}/>+ Serviço
            </button>
          }>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:14,padding:"4px 0 8px"}}>
              <div style={{width:56,height:56,borderRadius:"50%",flexShrink:0,
                background:C.accentLt,display:"flex",alignItems:"center",
                justifyContent:"center",fontSize:20,fontWeight:700,color:C.accent}}>
                {inits(cliSel.nome)}
              </div>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:C.ink}}>{cliSel.nome}</div>
                <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap"}}>
                  <Badge color={C.green}>{cliSel.visitas} visitas</Badge>
                  <Badge color={C.accent}>{brl(totalGasto(cliSel.nome))}</Badge>
                </div>
              </div>
            </div>
            <Card>
              <InfoRow icon="phone" label="Telefone"    value={cliSel.tel}/>
              <InfoRow icon="mail"  label="E-mail"      value={cliSel.email||"—"}/>
              <InfoRow icon="star"  label="Aniversário" value={cliSel.nasc?fmtBR(cliSel.nasc):"—"}/>
              <InfoRow icon="tag"   label="Total investido" value={brl(totalGasto(cliSel.nome))} accent={C.accent} last/>
              {cliSel.obs&&<div style={{marginTop:12,background:C.accentBg,borderRadius:8,padding:"10px 12px",borderLeft:`3px solid ${C.accent}`,fontSize:13,color:C.sub,lineHeight:1.6}}>{cliSel.obs}</div>}
            </Card>

            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontWeight:700,fontSize:15,color:C.ink}}>Histórico de serviços</div>
              <button onClick={()=>{setDetail(null);setServOpen(cliSel.id);}}
                style={{fontSize:13,fontWeight:600,color:C.accent,background:"none",border:"none",display:"flex",alignItems:"center",gap:5,fontFamily:F}}>
                <Ic n="plus" size={13} color={C.accent} w={2.5}/>Lançar serviço
              </button>
            </div>
            {histSel.length===0&&<Card style={{textAlign:"center",padding:28}}><span style={{color:C.muted,fontSize:14}}>Nenhum serviço registrado</span></Card>}
            {histSel.map(a=>(
              <Card key={a.id} style={{padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:3}}>{a.servico}</div>
                    <div style={{color:C.muted,fontSize:12.5}}>{fmtBR(a.data)} · {a.hora}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{color:C.accent,fontWeight:700,fontSize:14,marginBottom:4}}>{brl(a.valor)}</div>
                    <Badge color={SC[a.status]} bg={SBG[a.status]}>{SL[a.status]}</Badge>
                  </div>
                </div>
              </Card>
            ))}

            <div style={{marginTop:8}}>
              <Btn variant="danger" full icon="trash" onClick={()=>setConfirm(cliSel.id)}>Remover cliente</Btn>
            </div>
          </div>
        </Screen>
      )}
      <Confirm open={!!confirm} msg="Deseja remover esta cliente permanentemente?"
        onYes={()=>excluir(confirm)} onNo={()=>setConfirm(null)}/>
    </div>
  );
}

/* ─── ESTOQUE ────────────────────────────────────────────────────────────── */
function Estoque({prods,setProds,toast}){
  const [cat,setCat]=useState("Todos");
  const [search,setSearch]=useState("");
  const [formOpen,setFormOpen]=useState(false);
  const [movOpen,setMovOpen]=useState(null);
  const [histOpen,setHistOpen]=useState(null);
  const [editId,setEditId]=useState(null);
  const [movQtd,setMovQtd]=useState(1);
  const [movUnd,setMovUnd]=useState("un");
  const [movObs,setMovObs]=useState("");
  const [form,setForm]=useState({nome:"",cat:"Cabelo",marca:"",qtd:0,min:0,custo:"",und:"un"});
  const [confirm,setConfirm]=useState(null);

  const cats=useMemo(()=>["Todos",...[...new Set(prods.map(p=>p.cat))].sort()],[prods]);
  const filtrados=prods.filter(p=>
    (cat==="Todos"||p.cat===cat)&&
    (!search||p.nome.toLowerCase().includes(search.toLowerCase())||p.marca.toLowerCase().includes(search.toLowerCase()))
  );
  const criticos=prods.filter(p=>p.qtd<=p.min);

  function openForm(p=null){
    if(p){setEditId(p.id);setForm({...p,custo:String(p.custo)});}
    else{setEditId(null);setForm({nome:"",cat:"Cabelo",marca:"",qtd:0,min:0,custo:"",und:"un"});}
    setFormOpen(true);
  }
  function salvar(){
    if(!form.nome) return;
    const d={...form,qtd:Number(form.qtd)||0,min:Number(form.min)||0,custo:parseFloat(form.custo)||0};
    if(editId){setProds(p=>p.map(x=>x.id===editId?{...x,...d}:x));toast("Produto atualizado");}
    else{setProds(p=>[...p,{id:`p-${Date.now()}`,...d,movs:[]}]);toast("Produto cadastrado");}
    setFormOpen(false);
  }
  function confirmarMov(){
    if(movQtd<=0) return;
    const agora=`${pad(HOJE.getHours())}:${pad(HOJE.getMinutes())}`;
    const reg={tipo:movOpen.tipo,qtd:movQtd,und:movUnd,obs:movObs,data:TODAY,hora:agora};
    setProds(p=>p.map(x=>x.id===movOpen.prod.id
      ?{...x,qtd:Math.max(0,x.qtd+(movOpen.tipo==="entrada"?movQtd:-movQtd)),movs:[reg,...(x.movs||[])]}
      :x));
    toast(movOpen.tipo==="entrada"?"Entrada registrada":"Saída registrada");
    setMovOpen(null);setMovQtd(1);setMovObs("");setMovUnd("un");
  }
  function excluir(id){
    setProds(p=>p.filter(x=>x.id!==id));
    setConfirm(null); toast("Produto removido","warn");
  }

  const histProd=histOpen?prods.find(p=>p.id===histOpen):null;

  return(
    <div>
      {/* Inline header */}
      <div style={{padding:"16px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <span style={{fontSize:22,fontWeight:800,color:C.ink,letterSpacing:-.5}}>Estoque</span>
        <Btn icon="plus" size="sm" onClick={()=>openForm()}>Adicionar</Btn>
      </div>



      {/* Search */}
      <div style={{padding:"0 16px 10px"}}>
        <div style={{position:"relative"}}>
          <Ic n="search" size={16} color={C.muted} style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produto ou marca…"
            style={{width:"100%",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:8,
              padding:"10px 12px 10px 36px",color:C.ink,fontSize:14,outline:"none",fontFamily:F}}
            onFocus={e=>e.target.style.borderColor=C.accent}
            onBlur={e=>e.target.style.borderColor=C.border}/>
        </div>
      </div>

      {/* Category chips — only from registered products */}
      <div style={{display:"flex",gap:6,overflowX:"auto",padding:"0 16px 12px",scrollbarWidth:"none"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:"7px 14px",borderRadius:20,flexShrink:0,
            border:`1.5px solid ${cat===c?C.accent:C.border}`,background:cat===c?C.accent:"transparent",
            color:cat===c?"#fff":C.sub,fontSize:12.5,fontWeight:600,fontFamily:F,whiteSpace:"nowrap"}}>
            {c}
          </button>
        ))}
      </div>

      <div style={{padding:"0 16px 8px"}}>
        <span style={{fontSize:13,color:C.muted,fontWeight:600}}>{filtrados.length} produto{filtrados.length!==1?"s":""}</span>
      </div>

      {/* Product list — flat cards, no border accent */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {filtrados.map(p=>{
          const crit=p.qtd<=p.min;
          const pct=p.min>0?Math.min((p.qtd/(p.min*2))*100,100):100;
          return(
            <Card key={p.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div style={{flex:1,minWidth:0,paddingRight:8}}>
                  <div style={{fontWeight:700,color:C.ink,fontSize:14,marginBottom:2}}>{p.nome}</div>
                  <div style={{color:C.muted,fontSize:12}}>{p.marca} · {p.cat} · {brl(p.custo)}/{p.und}</div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:crit?C.red:C.ink}}>{p.qtd} {p.und}</span>
                    {crit&&<Badge color={C.red} bg={C.redBg}>Abaixo do mínimo</Badge>}
                  </div>
                </div>
                <CtxMenu items={[
                  {label:"Entrada",  icon:"arrowU",onClick:()=>{setMovOpen({prod:p,tipo:"entrada"});setMovQtd(1);setMovUnd(p.und);setMovObs("");}},
                  {label:"Saída",    icon:"arrowD",onClick:()=>{setMovOpen({prod:p,tipo:"saida"});setMovQtd(1);setMovUnd(p.und);setMovObs("");}},
                  {label:"Histórico",icon:"history",onClick:()=>setHistOpen(p.id)},
                  {label:"Editar",   icon:"edit",   onClick:()=>openForm(p)},
                  {label:"Excluir",  icon:"trash",  danger:true,onClick:()=>setConfirm(p.id)},
                ]}/>
              </div>
              <div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:11,color:C.muted}}>Nível de estoque</span>
                  <span style={{fontSize:11,fontWeight:600,color:crit?C.red:C.muted}}>mín. {p.min} {p.und}</span>
                </div>
                <PBar pct={pct} color={crit?C.red:C.accent}/>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Movement drawer — with unit selector */}
      <Drawer open={!!movOpen} onClose={()=>setMovOpen(null)}
        title={movOpen?.tipo==="entrada"?`Entrada — ${movOpen?.prod.nome}`:`Saída — ${movOpen?.prod.nome}`}>
        {movOpen&&(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div style={{background:movOpen.tipo==="entrada"?C.greenBg:C.redBg,
              border:`1px solid ${movOpen.tipo==="entrada"?C.green:C.red}30`,
              borderRadius:8,padding:"10px 12px",fontSize:13,
              color:movOpen.tipo==="entrada"?C.green:C.red}}>
              {movOpen.tipo==="entrada"?"Reposição de estoque ao receber produtos.":"Registra o uso ou consumo do produto."}
            </div>
            {/* Qty + unit side by side */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
              <div style={{minWidth:0}}>
                <FL>Quantidade</FL>
                <Stepper value={movQtd} onChange={setMovQtd} min={1} und={movUnd}/>
              </div>
              <Sel label="Unidade" value={movUnd} onChange={e=>setMovUnd(e.target.value)}>
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </Sel>
            </div>
            <div style={{fontSize:12.5,color:C.muted}}>
              Estoque atual: <strong style={{color:C.ink}}>{movOpen.prod.qtd} {movOpen.prod.und}</strong>
            </div>
            <Input label="Observação (opcional)" value={movObs} onChange={e=>setMovObs(e.target.value)}
              placeholder={movOpen.tipo==="entrada"?"Ex: Compra no fornecedor":"Ex: Coloração — Diana"}/>
            <Btn full variant={movOpen.tipo==="entrada"?"success":"danger"}
              icon={movOpen.tipo==="entrada"?"arrowU":"arrowD"} onClick={confirmarMov}>
              Confirmar {movOpen.tipo==="entrada"?"Entrada":"Saída"}
            </Btn>
          </div>
        )}
      </Drawer>

      {/* History */}
      <Drawer open={!!histOpen} onClose={()=>setHistOpen(null)} title={histProd?.nome||"Histórico"}>
        {histProd&&(
          (!histProd.movs||histProd.movs.length===0)
            ?<div style={{textAlign:"center",padding:"32px 0",color:C.muted,fontSize:14}}>Nenhuma movimentação registrada</div>
            :<div>{histProd.movs.map((h,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:36,height:36,borderRadius:8,flexShrink:0,
                  background:h.tipo==="entrada"?C.greenBg:C.redBg,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Ic n={h.tipo==="entrada"?"arrowU":"arrowD"} size={16} color={h.tipo==="entrada"?C.green:C.red} w={2.5}/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13.5,color:C.ink}}>{h.tipo==="entrada"?"Entrada":"Saída"}: {h.qtd} {h.und||histProd.und}</div>
                  {h.obs&&<div style={{fontSize:12,color:C.muted}}>{h.obs}</div>}
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>{fmtBR(h.data)} {h.hora}</div>
                </div>
                <Badge color={h.tipo==="entrada"?C.green:C.red} bg={h.tipo==="entrada"?C.greenBg:C.redBg}>
                  {h.tipo==="entrada"?"+":"-"}{h.qtd}{h.und||histProd.und}
                </Badge>
              </div>
            ))}</div>
        )}
      </Drawer>

      {/* Product form */}
      <Drawer open={formOpen} onClose={()=>setFormOpen(false)} title={editId?"Editar Produto":"Novo Produto"}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Nome do produto" required value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
            <Sel label="Categoria" value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {["Cabelo","Coloração","Unhas","Estética","Pele","Outros"].map(c=><option key={c}>{c}</option>)}
            </Sel>
            <Input label="Marca" value={form.marca} onChange={e=>setForm({...form,marca:e.target.value})}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
            <div style={{minWidth:0}}>
              <FL>Quantidade inicial</FL>
              <Stepper value={Number(form.qtd)||0} onChange={v=>setForm({...form,qtd:v})} und={form.und}/>
            </div>
            <div style={{minWidth:0}}>
              <FL>Mínimo</FL>
              <Stepper value={Number(form.min)||0} onChange={v=>setForm({...form,min:v})} und={form.und}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,minmax(0,1fr))",gap:12}}>
            <Input label="Custo (R$)" required type="number" value={form.custo}
              onChange={e=>setForm({...form,custo:e.target.value})} placeholder="0,00"/>
            <Sel label="Unidade" value={form.und} onChange={e=>setForm({...form,und:e.target.value})}>
              {UNITS.map(u=><option key={u}>{u}</option>)}
            </Sel>
          </div>
          <Btn full icon="check" onClick={salvar} disabled={!form.nome}>{editId?"Salvar":"Cadastrar"}</Btn>
        </div>
      </Drawer>

      <Confirm open={!!confirm} msg="Deseja remover este produto permanentemente?"
        onYes={()=>excluir(confirm)} onNo={()=>setConfirm(null)}/>
    </div>
  );
}

/* ─── FINANCEIRO ─────────────────────────────────────────────────────────── */
function Financeiro({ags,prods}){
  const [view,setView]=useState("resumo");
  const [mes,setMes]=useState(HOJE.getMonth());

  const mesDados=useMemo(()=>{
    const dias={},servicos={};
    ags.forEach(a=>{
      const d=new Date(a.data+"T00:00:00");
      if(d.getMonth()!==mes||d.getFullYear()!==HOJE.getFullYear()||a.status!=="concluido") return;
      const k=d.getDate();
      if(!dias[k]) dias[k]={r:0,n:0};
      dias[k].r+=parseFloat(a.valor);dias[k].n++;
      if(!servicos[a.servico]) servicos[a.servico]={r:0,n:0};
      servicos[a.servico].r+=parseFloat(a.valor);servicos[a.servico].n++;
    });
    return{dias,servicos};
  },[ags,mes]);

  const anuais=useMemo(()=>FIN0.map((f,i)=>{
    const extra=ags.filter(a=>{
      const d=new Date(a.data+"T00:00:00");
      return d.getMonth()===i&&d.getFullYear()===HOJE.getFullYear()&&a.status==="concluido";
    }).reduce((s,a)=>s+parseFloat(a.valor),0);
    const custoProd=prods.reduce((s,p)=>{
      const sd=(p.movs||[]).filter(h=>{
        const d=new Date(h.data+"T00:00:00");
        return h.tipo==="saida"&&d.getMonth()===i&&d.getFullYear()===HOJE.getFullYear();
      });
      return s+sd.reduce((ss,h)=>ss+h.qtd*p.custo,0);
    },0);
    const r=f.r+extra*.07,c=f.c+custoProd;
    return{m:i,r,c,l:r-c};
  }),[ags,prods]);

  const totMes=Object.values(mesDados.dias).reduce((a,d)=>({r:a.r+d.r,n:a.n+d.n}),{r:0,n:0});
  const custoProdMes=prods.reduce((s,p)=>{
    const sd=(p.movs||[]).filter(h=>{
      const d=new Date(h.data+"T00:00:00");
      return h.tipo==="saida"&&d.getMonth()===mes&&d.getFullYear()===HOJE.getFullYear();
    });
    return s+sd.reduce((ss,h)=>ss+h.qtd*p.custo,0);
  },0);
  const lucroMes=totMes.r-custoProdMes;
  const totAno=anuais.reduce((a,m)=>({r:a.r+m.r,c:a.c+m.c,l:a.l+m.l}),{r:0,c:0,l:0});
  const agHoje=ags.filter(a=>a.data===TODAY&&a.status==="concluido");
  const recHoje=agHoje.reduce((s,a)=>s+parseFloat(a.valor),0);
  const topServicos=Object.entries(mesDados.servicos).sort((a,b)=>b[1].r-a[1].r).slice(0,5);
  const maxServ=topServicos[0]?.[1]?.r||1;

  function BarC({bars,height=80}){
    const mx=Math.max(...bars.map(b=>b.v),1);
    return(
      <div style={{display:"flex",alignItems:"flex-end",gap:2,height}}>
        {bars.map((b,i)=>(
          <div key={i} title={b.label||""} style={{flex:1,borderRadius:"3px 3px 0 0",minHeight:2,
            background:b.v>0?C.accent:C.bgAlt,height:`${Math.max((b.v/mx)*100,b.v>0?5:1)}%`}}/>
        ))}
      </div>
    );
  }

  const StatBox=({label,value,color=C.ink})=>(
    <div style={{flex:1,textAlign:"center",padding:"12px 8px",background:C.white,border:`1px solid ${C.border}`,borderRadius:10}}>
      <div style={{fontSize:18,fontWeight:800,color,letterSpacing:-.5,lineHeight:1.1}}>{value}</div>
      <div style={{fontSize:11,fontWeight:600,color:C.muted,marginTop:3,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>
    </div>
  );

  return(
    <div>
      <div style={{padding:"16px 16px 14px"}}>
        <span style={{fontSize:22,fontWeight:800,color:C.ink,letterSpacing:-.5}}>Relatórios</span>
      </div>

      <div style={{display:"flex",gap:6,padding:"0 16px 14px"}}>
        {[{id:"resumo",l:"Resumo"},{id:"mensal",l:"Por mês"},{id:"anual",l:"Anual"}].map(t=>(
          <button key={t.id} onClick={()=>setView(t.id)} style={{flex:1,padding:"10px",borderRadius:8,
            fontWeight:600,fontSize:13,border:`1.5px solid ${view===t.id?C.accent:C.border}`,
            background:view===t.id?C.accent:"transparent",color:view===t.id?"#fff":C.sub,
            fontFamily:F,minHeight:40}}>{t.l}</button>
        ))}
      </div>

      {/* KPI boxes */}
      <div style={{display:"flex",gap:8,padding:"0 16px 14px"}}>
        <StatBox label="Hoje" value={brlK(recHoje)} color={C.green}/>
        <StatBox label={MESES3[mes]} value={brlK(totMes.r)} color={C.accent}/>
        <StatBox label="Lucro" value={brlK(Math.max(lucroMes,0))} color={C.ink}/>
        <StatBox label="Margem" value={totMes.r>0?`${((lucroMes/totMes.r)*100).toFixed(0)}%`:"—"} color={C.ink}/>
      </div>

      {view==="resumo"&&(
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
          <Sel value={mes} onChange={e=>setMes(parseInt(e.target.value))}>
            {MESES.map((m,i)=><option key={i} value={i}>{m}</option>)}
          </Sel>
          <Card>
            <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12}}>Receita diária — {MESES[mes]}</div>
            <BarC bars={Array.from({length:28},(_,i)=>({v:mesDados.dias[i+1]?.r||0,label:`Dia ${i+1}`}))}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
              <span style={{fontSize:11,color:C.muted}}>1</span><span style={{fontSize:11,color:C.muted}}>28</span>
            </div>
          </Card>
          {topServicos.length>0&&(
            <Card>
              <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:14}}>Serviços mais rentáveis</div>
              {topServicos.map(([serv,data],i)=>(
                <div key={serv} style={{marginBottom:i<topServicos.length-1?12:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                      <span style={{width:20,height:20,borderRadius:5,background:i===0?C.accent:C.bgAlt,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:i===0?"#fff":C.muted,flexShrink:0}}>{i+1}</span>
                      <span style={{fontSize:13.5,color:C.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{serv}</span>
                    </div>
                    <div style={{flexShrink:0,marginLeft:8,textAlign:"right"}}>
                      <span style={{fontSize:13.5,fontWeight:700,color:C.accent}}>{brl(data.r)}</span>
                      <span style={{fontSize:11,color:C.muted,marginLeft:5}}>{data.n}×</span>
                    </div>
                  </div>
                  <div style={{height:5,borderRadius:5,background:C.bgAlt,overflow:"hidden"}}>
                    <div style={{width:`${(data.r/maxServ)*100}%`,height:"100%",background:i===0?C.ink:C.accent,borderRadius:5}}/>
                  </div>
                </div>
              ))}
            </Card>
          )}
          <Card>
            <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12}}>Custo de produtos</div>
            {custoProdMes===0
              ?<div style={{color:C.muted,fontSize:13.5,textAlign:"center",padding:"12px 0"}}>Nenhuma saída registrada neste mês</div>
              :prods.filter(p=>(p.movs||[]).some(h=>{const d=new Date(h.data+"T00:00:00");return h.tipo==="saida"&&d.getMonth()===mes&&d.getFullYear()===HOJE.getFullYear();}))
                .map(p=>{
                  const sd=(p.movs||[]).filter(h=>{const d=new Date(h.data+"T00:00:00");return h.tipo==="saida"&&d.getMonth()===mes&&d.getFullYear()===HOJE.getFullYear();});
                  const total=sd.reduce((s,h)=>s+h.qtd*p.custo,0),qtdT=sd.reduce((s,h)=>s+h.qtd,0);
                  return(
                    <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13.5,color:C.ink,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.nome}</div>
                        <div style={{fontSize:12,color:C.muted,marginTop:1}}>{qtdT} un</div>
                      </div>
                      <span style={{color:C.red,fontWeight:700,fontSize:14,flexShrink:0,marginLeft:8}}>-{brl(total)}</span>
                    </div>
                  );
                })
            }
            {custoProdMes>0&&(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,marginTop:2}}>
                <span style={{fontWeight:700,color:C.ink,fontSize:14}}>Total</span>
                <span style={{color:C.red,fontWeight:800,fontSize:15}}>-{brl(custoProdMes)}</span>
              </div>
            )}
          </Card>
        </div>
      )}

      {view==="mensal"&&(
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
          <Card style={{padding:0,overflow:"hidden"}}>
            <div style={{padding:"14px 16px 12px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12}}>Receita vs. custo</div>
              <div style={{display:"flex",alignItems:"flex-end",gap:2,height:88}}>
                {anuais.map((m,i)=>{
                  const maxR=Math.max(...anuais.map(x=>x.r),1);
                  return(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:"100%",display:"flex",alignItems:"flex-end",gap:1,height:72}}>
                        <div style={{flex:1,borderRadius:"2px 2px 0 0",background:i===mes?C.ink:C.accent,height:`${(m.r/maxR)*100}%`,minHeight:2}}/>
                        <div style={{flex:1,borderRadius:"2px 2px 0 0",background:C.red+"88",height:`${(m.c/maxR)*100}%`,minHeight:2}}/>
                      </div>
                      <div style={{fontSize:8,color:i===mes?C.ink:C.muted,fontWeight:i===mes?800:400,marginTop:4}}>{MESES3[i]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            {anuais.map((m,i)=>{
              const lucro=m.r-m.c,margem=m.r>0?((lucro/m.r)*100).toFixed(0):0;
              const isSel=i===mes,isFut=i>HOJE.getMonth();
              return(
                <div key={i} onClick={()=>setMes(i)} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",
                  cursor:"pointer",borderBottom:`1px solid ${C.border}`,background:isSel?C.accentBg:C.white,opacity:isFut?.55:1}}>
                  <div style={{minWidth:36}}>
                    <div style={{fontSize:13,fontWeight:isSel?800:500,color:isSel?C.accent:C.ink}}>{MESES3[i]}</div>
                    {isSel&&<div style={{fontSize:9,fontWeight:800,color:C.accent,letterSpacing:.5}}>ATUAL</div>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14,color:C.ink}}>{brlK(m.r)}</div>
                    <div style={{height:4,borderRadius:4,background:C.bgAlt,overflow:"hidden",marginTop:4}}>
                      <div style={{width:`${(m.r/Math.max(...anuais.map(x=>x.r),1))*100}%`,height:"100%",background:isSel?C.accent:C.border,borderRadius:4}}/>
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontWeight:700,fontSize:13.5,color:lucro>=0?C.green:C.red}}>{brlK(lucro)}</div>
                    <Badge color={parseFloat(margem)>=45?C.green:parseFloat(margem)>=20?C.accent:C.red}
                      bg={parseFloat(margem)>=45?C.greenBg:parseFloat(margem)>=20?C.accentBg:C.redBg}>{margem}%</Badge>
                  </div>
                </div>
              );
            })}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 16px",background:C.bg,borderTop:`2px solid ${C.border}`}}>
              <span style={{fontWeight:700,fontSize:13,color:C.sub}}>Ano total</span>
              <span style={{fontWeight:800,fontSize:14,color:C.ink}}>{brlK(totAno.r)}</span>
              <span style={{fontWeight:800,fontSize:14,color:totAno.l>=0?C.green:C.red}}>{brlK(totAno.l)}</span>
            </div>
          </Card>
        </div>
      )}

      {view==="anual"&&(
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",gap:8}}>
            {[{l:"Receita",v:brlK(totAno.r),c:C.green},{l:"Custos",v:brlK(totAno.c),c:C.red},{l:"Lucro",v:brlK(totAno.l),c:C.ink}].map(s=>(
              <div key={s.l} style={{flex:1,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
                <div style={{fontSize:16,fontWeight:800,color:s.c,letterSpacing:-.3}}>{s.v}</div>
                <div style={{fontSize:11,fontWeight:600,color:C.muted,marginTop:3,textTransform:"uppercase",letterSpacing:.5}}>{s.l}</div>
              </div>
            ))}
          </div>
          <Card>
            <div style={{fontWeight:700,fontSize:14,color:C.ink,marginBottom:12}}>Lucro por mês</div>
            <div style={{display:"flex",alignItems:"flex-end",gap:3,height:88}}>
              {anuais.map((m,i)=>{
                const maxL=Math.max(...anuais.map(x=>Math.abs(x.l)),1);
                return(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{flex:1,width:"100%",display:"flex",alignItems:"flex-end"}}>
                      <div style={{width:"100%",borderRadius:"3px 3px 0 0",
                        background:m.l>=0?(i===HOJE.getMonth()?C.ink:C.accent):C.red,
                        height:`${Math.max((Math.abs(m.l)/maxL)*100,2)}%`,minHeight:2}}/>
                    </div>
                    <div style={{fontSize:8,color:i===HOJE.getMonth()?C.ink:C.muted,fontWeight:i===HOJE.getMonth()?800:400,marginTop:4}}>{MESES3[i]}</div>
                  </div>
                );
              })}
            </div>
          </Card>
          {[...anuais].sort((a,b)=>b.l-a.l).map((m,rank)=>(
            <Card key={m.m} style={{padding:"12px 14px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:32,height:32,borderRadius:8,flexShrink:0,background:rank===0?C.ink:C.bgAlt,
                  display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:rank===0?"#fff":C.muted}}>{rank+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:14,color:C.ink,marginBottom:4}}>{MESES[m.m]}</div>
                  <div style={{height:5,borderRadius:5,background:C.bgAlt,overflow:"hidden"}}>
                    <div style={{width:`${Math.max((m.l/Math.max(...anuais.map(x=>x.l),1))*100,2)}%`,height:"100%",background:rank===0?C.ink:C.accent,borderRadius:5}}/>
                  </div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:m.l>=0?C.green:C.red}}>{brlK(m.l)}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:1}}>{brlK(m.r)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div style={{height:16}}/>
    </div>
  );
}

/* ─── SERVICOS ───────────────────────────────────────────────────────────── */
function Servicos({servicos,setServicos,toast}){
  const [formOpen,setFormOpen]=useState(false);
  const [editId,setEditId]=useState(null);
  const [form,setForm]=useState({nome:"",valorPadrao:""});
  const [confirm,setConfirm]=useState(null);

  function openForm(s=null){
    if(s){setEditId(s.id);setForm({nome:s.nome,valorPadrao:String(s.valorPadrao)});}
    else{setEditId(null);setForm({nome:"",valorPadrao:""});}
    setFormOpen(true);
  }
  function salvar(){
    if(!form.nome) return;
    const val=parseFloat(form.valorPadrao)||0;
    if(editId){
      setServicos(p=>p.map(s=>s.id===editId?{...s,nome:form.nome,valorPadrao:val}:s));
      toast("Serviço atualizado");
    } else {
      setServicos(p=>[...p,{id:`sv-${Date.now()}`,nome:form.nome,valorPadrao:val}]);
      toast("Serviço criado");
    }
    setFormOpen(false); setEditId(null);
    setForm({nome:"",valorPadrao:""});
  }
  function excluir(id){
    setServicos(p=>p.filter(s=>s.id!==id));
    setConfirm(null); toast("Serviço removido","warn");
  }

  return(
    <div>
      {/* Header */}
      <div style={{padding:"16px 16px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,color:C.ink,letterSpacing:-.5}}>Serviços</div>
          <div style={{fontSize:13,color:C.muted,marginTop:2}}>Gerencie os serviços do estúdio</div>
        </div>
        <Btn icon="plus" size="sm" onClick={()=>openForm()}>Novo</Btn>
      </div>

      {/* List */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:8}}>
        {servicos.length===0&&(
          <div style={{textAlign:"center",padding:"40px 20px",border:`1.5px dashed ${C.border}`,borderRadius:12,background:C.white}}>
            <Ic n="service" size={32} color={C.border} style={{margin:"0 auto 8px"}}/>
            <div style={{color:C.muted,fontSize:14}}>Nenhum serviço cadastrado</div>
          </div>
        )}
        {servicos.map(s=>(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:15,color:C.ink}}>{s.nome}</div>
                <div style={{fontSize:13,color:C.muted,marginTop:2}}>
                  Valor padrão: <span style={{color:C.accent,fontWeight:600}}>{s.valorPadrao>0?brl(s.valorPadrao):"Sem valor padrão"}</span>
                </div>
              </div>
              <CtxMenu items={[
                {label:"Editar",  icon:"edit",  onClick:()=>openForm(s)},
                {label:"Excluir", icon:"trash", danger:true, onClick:()=>setConfirm(s.id)},
              ]}/>
            </div>
          </Card>
        ))}
      </div>

      {/* Info tip */}
      <div style={{margin:"14px 16px 0",background:C.accentBg,borderRadius:10,padding:"10px 14px",
        borderLeft:`3px solid ${C.accent}`,fontSize:13,color:C.sub,lineHeight:1.5}}>
        O valor padrão é preenchido automaticamente ao criar ou lançar um atendimento, mas pode ser ajustado livremente.
      </div>

      {/* Form drawer */}
      <Drawer open={formOpen} onClose={()=>setFormOpen(false)} title={editId?"Editar Serviço":"Novo Serviço"}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Input label="Nome do serviço" required value={form.nome}
            onChange={e=>setForm({...form,nome:e.target.value})}
            placeholder="Ex: Corte, Coloração, Hidratação…"/>
          <Input label="Valor padrão (R$)" type="number" inputMode="decimal" value={form.valorPadrao}
            onChange={e=>setForm({...form,valorPadrao:e.target.value})}
            placeholder="0,00"
            hint="Será preenchido automaticamente no agendamento"/>
          <Btn full icon="check" onClick={salvar} disabled={!form.nome}>
            {editId?"Salvar alterações":"Cadastrar serviço"}
          </Btn>
        </div>
      </Drawer>

      <Confirm open={!!confirm} msg="Deseja remover este serviço?"
        onYes={()=>excluir(confirm)} onNo={()=>setConfirm(null)}/>
    </div>
  );
}


/* ─── APP ────────────────────────────────────────────────────────────────── */
const NAV=[
  {id:"agenda",    label:"Agenda",    icon:"calendar"},
  {id:"clientes",  label:"Clientes",  icon:"users"},
  {id:"estoque",   label:"Estoque",   icon:"box"},
  {id:"servicos",  label:"Serviços",  icon:"service"},
  {id:"relatorios",label:"Relatórios",icon:"chart"},
];

/* ─── LOADING SCREEN ─────────────────────────────────────────────────────── */
function Loading(){{
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      height:"100vh",background:C.bg,gap:12}}>
      <div style={{width:40,height:40,borderRadius:10,background:C.ink,display:"flex",
        alignItems:"center",justifyContent:"center"}}>
        <Ic n="scissors" size={20} color="#fff" w={2}/>
      </div>
      <div style={{fontSize:14,color:C.muted}}>Carregando…</div>
    </div>
  );
}}

export default function App(){
  const anyModal = useAnyModalOpen();
  const [aba,setAba]=useState("agenda");
  const [loading,setLoading]=useState(true);
  const [ags,setAgs]=useState([]);
  const [clis,setClis]=useState([]);
  const [prods,setProds]=useState([]);
  const [servicos,setServicos]=useState([]);
  const {items:toasts,show:toast}=useToast();
  const alertas=prods.filter(p=>p.qtd<=p.min).length;

  /* ── Load all data on mount ────────────────────────────────────────────── */
  useEffect(()=>{
    async function loadAll(){
      setLoading(true);
      const [agRes,cliRes,prodRes,svcRes] = await Promise.all([
        supabase.from("agendamentos").select("*").order("data",{ascending:false}).order("hora"),
        supabase.from("clientes").select("*").order("nome"),
        supabase.from("produtos").select("*,movimentacoes(*)").order("nome"),
        supabase.from("servicos").select("*").order("nome"),
      ]);
      if(agRes.data)  setAgs(agRes.data.map(mapAg));
      if(cliRes.data) setClis(cliRes.data.map(mapCli));
      if(prodRes.data)setProds(prodRes.data.map(mapProd));
      if(svcRes.data) setServicos(svcRes.data.map(mapSvc));
      setLoading(false);
    }
    loadAll();
  },[]);

  /* ── Mappers: DB → App format ──────────────────────────────────────────── */
  function mapAg(r){
    return{id:r.id,data:r.data,hora:r.hora,cliente:r.cliente,servico:r.servico,
      valor:String(r.valor),status:r.status||"agendado",pagamento:r.pagamento,
      servicosExtra:r.servicos_extra||[],produtosUsados:r.produtos_usados||[]};
  }
  function mapCli(r){
    return{id:r.id,nome:r.nome,tel:r.tel||"",email:r.email||"",
      nasc:r.nasc||"",obs:r.obs||"",visitas:r.visitas||0};
  }
  function mapProd(r){
    return{id:r.id,nome:r.nome,cat:r.cat||"",marca:r.marca||"",
      qtd:r.qtd||0,min:r.min||0,custo:r.custo||0,und:r.und||"un",
      movs:(r.movimentacoes||[]).map(m=>{return{tipo:m.tipo,qtd:m.qtd,und:m.und||r.und,
        obs:m.obs||"",data:m.data||"",hora:m.hora||""}})};
  }
  function mapSvc(r){
    return{id:r.id,nome:r.nome,valorPadrao:r.valor_padrao||0};
  }

  /* ── Wrapped setters that sync to Supabase ─────────────────────────────── */
  async function dbSetAgs(updater){
    const next = typeof updater==="function"?updater(ags):updater;
    setAgs(next);
    // Detect new items (no createdAt means local-only)
    const added = next.filter(a=>!ags.find(x=>x.id===a.id));
    for(const a of added){
      await supabase.from("agendamentos").upsert({
        id:a.id,data:a.data,hora:a.hora,cliente:a.cliente,servico:a.servico,
        valor:parseFloat(a.valor),status:a.status,pagamento:a.pagamento||null,
        servicos_extra:a.servicosExtra||[],produtos_usados:a.produtosUsados||[]
      });
    }
    // Detect updates
    const updated = next.filter(a=>{
      const old=ags.find(x=>x.id===a.id);
      return old&&JSON.stringify(old)!==JSON.stringify(a);
    });
    for(const a of updated){
      await supabase.from("agendamentos").update({
        status:a.status,pagamento:a.pagamento||null,valor:parseFloat(a.valor),
        servicos_extra:a.servicosExtra||[],produtos_usados:a.produtosUsados||[]
      }).eq("id",a.id);
    }
  }

  async function dbSetClis(updater){
    const next=typeof updater==="function"?updater(clis):updater;
    const prev=clis;
    setClis(next);
    const added=next.filter(a=>!prev.find(x=>x.id===a.id));
    for(const c of added){
      await supabase.from("clientes").insert({
        id:c.id,nome:c.nome,tel:c.tel,email:c.email,nasc:c.nasc||null,obs:c.obs,visitas:c.visitas
      });
    }
    const updated=next.filter(a=>{const o=prev.find(x=>x.id===a.id);return o&&JSON.stringify(o)!==JSON.stringify(a);});
    for(const c of updated){
      await supabase.from("clientes").update({
        nome:c.nome,tel:c.tel,email:c.email,nasc:c.nasc||null,obs:c.obs,visitas:c.visitas
      }).eq("id",c.id);
    }
    const removed=prev.filter(a=>!next.find(x=>x.id===a.id));
    for(const c of removed) await supabase.from("clientes").delete().eq("id",c.id);
  }

  async function dbSetProds(updater){
    const next=typeof updater==="function"?updater(prods):updater;
    const prev=prods;
    setProds(next);
    const added=next.filter(a=>!prev.find(x=>x.id===a.id));
    for(const p of added){
      await supabase.from("produtos").insert({
        id:p.id,nome:p.nome,cat:p.cat,marca:p.marca,qtd:p.qtd,min:p.min,custo:p.custo,und:p.und
      });
    }
    const updated=next.filter(a=>{const o=prev.find(x=>x.id===a.id);return o&&JSON.stringify(o)!==JSON.stringify(a);});
    for(const p of updated){
      const movs=p.movs||[];
      const prevMovs=prev.find(x=>x.id===p.id)?.movs||[];
      const newMovs=movs.filter((_,i)=>i<movs.length-prevMovs.length);
      await supabase.from("produtos").update({qtd:p.qtd,min:p.min,custo:p.custo,nome:p.nome,cat:p.cat,marca:p.marca,und:p.und}).eq("id",p.id);
      for(const m of newMovs){
        await supabase.from("movimentacoes").insert({
          produto_id:p.id,tipo:m.tipo,qtd:m.qtd,und:m.und||p.und,obs:m.obs,data:m.data,hora:m.hora
        });
      }
    }
    const removed=prev.filter(a=>!next.find(x=>x.id===a.id));
    for(const p of removed) await supabase.from("produtos").delete().eq("id",p.id);
  }

  async function dbSetServicos(updater){
    const next=typeof updater==="function"?updater(servicos):updater;
    const prev=servicos;
    setServicos(next);
    const added=next.filter(a=>!prev.find(x=>x.id===a.id));
    for(const s of added) await supabase.from("servicos").insert({id:s.id,nome:s.nome,valor_padrao:s.valorPadrao});
    const updated=next.filter(a=>{const o=prev.find(x=>x.id===a.id);return o&&JSON.stringify(o)!==JSON.stringify(a);});
    for(const s of updated) await supabase.from("servicos").update({nome:s.nome,valor_padrao:s.valorPadrao}).eq("id",s.id);
    const removed=prev.filter(a=>!next.find(x=>x.id===a.id));
    for(const s of removed) await supabase.from("servicos").delete().eq("id",s.id);
  }

  if(loading) return <><GS/><Loading/></>;

  return(
    <div style={{position:"fixed",top:0,bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:640,display:"flex",flexDirection:"column",background:C.bg,fontFamily:F,color:C.ink,overflow:"hidden"}}>
      <GS/>

      {/* No sticky global header — each tab has its own inline header */}

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
        {aba==="agenda"    &&<Agenda     ags={ags}   setAgs={dbSetAgs}   clis={clis} prods={prods} setProds={dbSetProds} toast={toast} servicos={servicos}/>}
        {aba==="clientes"  &&<Clientes   clis={clis} setClis={dbSetClis} ags={ags} setAgs={dbSetAgs} toast={toast} servicos={servicos}/>}
        {aba==="estoque"   &&<Estoque    prods={prods} setProds={dbSetProds} toast={toast}/>}
        {aba==="servicos"  &&<Servicos   servicos={servicos} setServicos={dbSetServicos} toast={toast}/>}
        {aba==="relatorios"&&<Financeiro ags={ags} prods={prods}/>}
      </div>

      {/* Bottom nav */}
      <div style={{background:C.white,borderTop:`1px solid ${C.border}`,display:anyModal?"none":"flex",flexShrink:0,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {NAV.map(t=>{
          const active=aba===t.id,badge=t.id==="estoque"&&alertas>0;
          return(
            <button key={t.id} onClick={()=>setAba(t.id)} style={{flex:1,background:"none",border:"none",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              gap:4,padding:"10px 4px 8px",position:"relative",fontFamily:F,minHeight:62}}>
              {active&&<div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",
                width:20,height:3,borderRadius:"0 0 3px 3px",background:C.accent}}/>}
              <div style={{position:"relative"}}>
                <Ic n={t.icon} size={22} color={active?C.accent:C.muted} w={active?2.2:1.7}/>
                {badge&&<div style={{position:"absolute",top:-3,right:-4,width:15,height:15,
                  borderRadius:"50%",background:C.red,border:`2px solid ${C.white}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:8,fontWeight:800,color:"#fff"}}>{alertas}</div>}
              </div>
              <span style={{fontSize:10,fontWeight:active?700:500,color:active?C.accent:C.muted}}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast layer */}
      <ToastLayer items={toasts}/>
    </div>
  );
}