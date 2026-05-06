import { useState, useMemo } from "react";

const CURRENCIES = [
  {code:"INR",symbol:"₹",name:"Indian Rupee"},{code:"USD",symbol:"$",name:"US Dollar"},
  {code:"EUR",symbol:"€",name:"Euro"},{code:"GBP",symbol:"£",name:"British Pound"},
  {code:"AED",symbol:"د.إ",name:"UAE Dirham"},{code:"SGD",symbol:"S$",name:"Singapore Dollar"},
  {code:"JPY",symbol:"¥",name:"Japanese Yen"},{code:"AUD",symbol:"A$",name:"Australian Dollar"},
];
const PRICEBOOK = [
  {sku:"SKU-001",name:"CRM Starter",    category:"Software",basePrice:25000},
  {sku:"SKU-002",name:"CRM Professional",category:"Software",basePrice:75000},
  {sku:"SKU-003",name:"CRM Enterprise",  category:"Software",basePrice:200000},
  {sku:"SKU-004",name:"Analytics Module",category:"Add-on",  basePrice:40000},
  {sku:"SKU-005",name:"AI Insights Pack",category:"Add-on",  basePrice:60000},
  {sku:"SKU-006",name:"Implementation",  category:"Service", basePrice:50000},
  {sku:"SKU-007",name:"Training (5 days)",category:"Service",basePrice:30000},
  {sku:"SKU-008",name:"Support Gold",    category:"Support", basePrice:18000},
  {sku:"SKU-009",name:"Support Platinum",category:"Support", basePrice:35000},
];
const STAGES = ["Prospecting","Qualification","Proposal","Negotiation","Closed Won","Closed Lost"];
const stageColors = {Prospecting:"#b5d4f4",Qualification:"#fac775",Proposal:"#9fe1cb",Negotiation:"#f4c0d1","Closed Won":"#c0dd97","Closed Lost":"#f7c1c1"};
const statusColors = {New:"#b5d4f4",Contacted:"#fac775",Qualified:"#c0dd97",Lost:"#f7c1c1"};
const taskTypeIcon  = {Call:"📞",Email:"✉️",Meeting:"📅",Task:"✅"};
const labelOptions  = ["Work","Personal","HQ","Support","Sales","Legal","Technical","Decision Maker","Sponsor","Procurement","Primary","Other"];
const COLORS = ["#b5d4f4","#9fe1cb","#fac775","#e0d9ff","#f4c0d1","#fde68a","#c0dd97","#f7c1c1","#afa9ec","#fbb6ce","#a7f3d0","#fed7aa"];
const QUOTE_STATUSES = ["Draft","Pending Approval","Approved","Rejected","Sent","Accepted","Expired"];
const qsColors = {Draft:"#e0e0e0","Pending Approval":"#fac775",Approved:"#c0dd97",Rejected:"#f7c1c1",Sent:"#b5d4f4",Accepted:"#9fe1cb",Expired:"#f4c0d1"};
const fmt = (n,sym="₹")=>sym+(n>=100000?(n/100000).toFixed(1)+"L":Number(n||0).toLocaleString());

const DEFAULT_ROLES = [
  {id:"ASM",label:"Area Sales Manager",    level:1,color:"#b5d4f4",canBeDeleted:false},
  {id:"RSM",label:"Regional Sales Manager",level:2,color:"#9fe1cb",canBeDeleted:false},
  {id:"NSM",label:"National Sales Manager",level:3,color:"#fac775",canBeDeleted:false},
  {id:"MM", label:"Marketing Manager",     level:4,color:"#e0d9ff",canBeDeleted:false},
  {id:"CEM",label:"Customer Excellence Mgr",level:4,color:"#f4c0d1",canBeDeleted:false},
  {id:"DIR",label:"Director",              level:5,color:"#fde68a",canBeDeleted:false},
];
const ALL_PERMS = [
  {key:"viewAllRecords", label:"View all records"},
  {key:"editRecords",    label:"Create & edit records"},
  {key:"deleteRecords",  label:"Delete records"},
  {key:"createLeads",    label:"Create leads"},
  {key:"viewReports",    label:"Access Reports"},
  {key:"viewPipeline",   label:"Access Pipeline/Opportunities"},
  {key:"viewAllUsers",   label:"View Team tab"},
  {key:"manageUsers",    label:"Manage users"},
  {key:"manageRoles",    label:"Manage roles (Role Builder)"},
  {key:"createQuotes",   label:"Create quotes"},
  {key:"approveQuotes",  label:"Approve / reject quotes"},
  {key:"finalApprove",   label:"Final approval (Director-level)"},
];
const DEFAULT_PERM_SETS = {
  ASM:{viewAllRecords:false,editRecords:true, deleteRecords:false,createLeads:true, viewReports:false,viewPipeline:true, viewAllUsers:false,manageUsers:false,manageRoles:false,createQuotes:true, approveQuotes:false,finalApprove:false},
  RSM:{viewAllRecords:true, editRecords:true, deleteRecords:false,createLeads:true, viewReports:true, viewPipeline:true, viewAllUsers:false,manageUsers:false,manageRoles:false,createQuotes:true, approveQuotes:true, finalApprove:false},
  NSM:{viewAllRecords:true, editRecords:true, deleteRecords:true, createLeads:true, viewReports:true, viewPipeline:true, viewAllUsers:true, manageUsers:false,manageRoles:false,createQuotes:true, approveQuotes:true, finalApprove:false},
  MM: {viewAllRecords:true, editRecords:true, deleteRecords:false,createLeads:false,viewReports:true, viewPipeline:false,viewAllUsers:true, manageUsers:false,manageRoles:false,createQuotes:false,approveQuotes:false,finalApprove:false},
  CEM:{viewAllRecords:true, editRecords:true, deleteRecords:false,createLeads:false,viewReports:true, viewPipeline:false,viewAllUsers:true, manageUsers:false,manageRoles:true, createQuotes:false,approveQuotes:true, finalApprove:false},
  DIR:{viewAllRecords:true, editRecords:true, deleteRecords:true, createLeads:false,viewReports:true, viewPipeline:true, viewAllUsers:true, manageUsers:true, manageRoles:true, createQuotes:true, approveQuotes:true, finalApprove:true},
};
const tabsFromPerms = p=>{
  const t=["dashboard","leads"];
  if(p.viewPipeline) t.push("opportunities");
  t.push("tasks");
  if(p.createQuotes||p.approveQuotes||p.finalApprove) t.push("quotes");
  if(p.viewReports)  t.push("reports");
  if(p.viewAllUsers) t.push("team");
  if(p.manageRoles)  t.push("roles");
  return t;
};
const TAB_LABELS={dashboard:"Dashboard",leads:"Leads",opportunities:"Opportunities",tasks:"Tasks",quotes:"Quotes",reports:"Reports",team:"Team",roles:"Role Builder"};

const INIT_USERS = [
  {id:1,name:"Amit Sharma",  roleId:"ASM",region:"Delhi", email:"amit@sf.in",   password:"amit123",  managerId:3},
  {id:2,name:"Sneha Kapoor", roleId:"ASM",region:"Mumbai",email:"sneha@sf.in",  password:"sneha123", managerId:4},
  {id:3,name:"Rajan Mehta",  roleId:"RSM",region:"North", email:"rajan@sf.in",  password:"rajan123", managerId:5},
  {id:4,name:"Divya Iyer",   roleId:"RSM",region:"West",  email:"divya@sf.in",  password:"divya123", managerId:5},
  {id:5,name:"Vikram Nair",  roleId:"NSM",region:"All",   email:"vikram@sf.in", password:"vikram123",managerId:8},
  {id:6,name:"Meera Das",    roleId:"MM", region:"All",   email:"meera@sf.in",  password:"meera123", managerId:8},
  {id:7,name:"Saurabh Joshi",roleId:"CEM",region:"All",   email:"saurabh@sf.in",password:"saurabh123",managerId:8},
  {id:8,name:"Priya Singh",  roleId:"DIR",region:"All",   email:"priya@sf.in",  password:"priya123", managerId:null},
];
const INIT_LEADS=[
  {id:1,name:"Priya Sharma", company:"TechNova",status:"New",      source:"Web",      owner:"Amit Sharma", region:"Delhi", created:"2026-04-10",contacts:[{email:"priya@technova.in",  phone:"+91 98201 11234",label:"Work"}]},
  {id:2,name:"Arjun Mehta",  company:"Growfast", status:"Contacted",source:"Referral", owner:"Sneha Kapoor",region:"Mumbai",created:"2026-04-14",contacts:[{email:"arjun@growfast.io",  phone:"+91 99301 22345",label:"Work"}]},
  {id:3,name:"Neha Kapoor",  company:"Cloudbase",status:"Qualified",source:"LinkedIn", owner:"Amit Sharma", region:"Delhi", created:"2026-04-18",contacts:[{email:"neha@cloudbase.com", phone:"+91 87201 33456",label:"Work"}]},
  {id:4,name:"Rahul Joshi",  company:"DataSync", status:"New",      source:"Email",    owner:"Sneha Kapoor",region:"Mumbai",created:"2026-04-22",contacts:[{email:"rahul@datasync.in",  phone:"+91 76201 44567",label:"Work"}]},
];
const INIT_OPPS=[
  {id:1,name:"TechNova CRM Deal",        account:"TechNova",value:450000,stage:"Proposal",     close:"2026-06-30",owner:"Amit Sharma", region:"Delhi", probability:60},
  {id:2,name:"Growfast Platform Upgrade", account:"Growfast", value:280000,stage:"Qualification",close:"2026-07-15",owner:"Sneha Kapoor",region:"Mumbai",probability:30},
  {id:3,name:"Cloudbase Enterprise",      account:"Cloudbase",value:900000,stage:"Negotiation",  close:"2026-05-31",owner:"Rajan Mehta", region:"North", probability:80},
  {id:4,name:"DataSync Analytics Suite",  account:"DataSync", value:175000,stage:"Prospecting",  close:"2026-08-01",owner:"Divya Iyer",  region:"West",  probability:15},
];
const INIT_TASKS=[
  {id:1,title:"Follow up with Priya Sharma",type:"Call",   due:"2026-05-05",status:"Open",owner:"Amit Sharma", related:"TechNova CRM Deal"},
  {id:2,title:"Send proposal to Cloudbase",  type:"Email",  due:"2026-05-04",status:"Open",owner:"Rajan Mehta", related:"Cloudbase Enterprise"},
  {id:3,title:"Demo for Growfast",           type:"Meeting",due:"2026-05-06",status:"Open",owner:"Sneha Kapoor",related:"Growfast Platform Upgrade"},
];
const INIT_QUOTES=[
  {id:1,quoteNo:"QT-0001",name:"TechNova CRM Q1",lead:"Priya Sharma",opportunity:"TechNova CRM Deal",channelPartner:"TechBridge Solutions",poNumber:"PO-2026-001",currency:"INR",status:"Approved",startDate:"2026-05-01",endDate:"2026-07-31",expiryDate:"2026-06-15",owner:"Amit Sharma",ownerId:1,region:"Delhi",
    approvals:[{userId:3,role:"RSM",user:"Rajan Mehta",status:"Approved",date:"2026-04-28",remark:"Good deal"},{userId:5,role:"NSM",user:"Vikram Nair",status:"Approved",date:"2026-04-29",remark:"Approved"},{userId:8,role:"DIR",user:"Priya Singh",status:"Approved",date:"2026-04-30",remark:""}],
    items:[{sku:"SKU-002",name:"CRM Professional",basePrice:75000,qty:3,discount:10,finalPrice:202500},{sku:"SKU-006",name:"Implementation",basePrice:50000,qty:1,discount:0,finalPrice:50000}]},
  {id:2,quoteNo:"QT-0002",name:"Cloudbase Enterprise Q1",lead:"Neha Kapoor",opportunity:"Cloudbase Enterprise",channelPartner:"CloudNet Partners",poNumber:"",currency:"USD",status:"Pending Approval",startDate:"2026-06-01",endDate:"2026-08-31",expiryDate:"2026-05-30",owner:"Amit Sharma",ownerId:1,region:"Delhi",
    approvals:[{userId:3,role:"RSM",user:"Rajan Mehta",status:"Approved",date:"2026-05-01",remark:"Looks good"},{userId:5,role:"NSM",user:"Vikram Nair",status:"Pending",date:"",remark:""},{userId:8,role:"DIR",user:"Priya Singh",status:"Pending",date:"",remark:""}],
    items:[{sku:"SKU-003",name:"CRM Enterprise",basePrice:200000,qty:1,discount:15,finalPrice:170000},{sku:"SKU-005",name:"AI Insights Pack",basePrice:60000,qty:1,discount:5,finalPrice:57000}]},
];

// ── UI Atoms ──────────────────────────────────────────────────────────────────
function Avatar({name,size=32}){
  const i=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const c=["#b5d4f4","#9fe1cb","#f4c0d1","#fac775","#afa9ec"][name.charCodeAt(0)%5];
  return <div style={{width:size,height:size,borderRadius:"50%",background:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.38,fontWeight:600,flexShrink:0,color:"#1a0a40"}}>{i}</div>;
}
function Badge({color="#e0e0e0",children}){
  return <span style={{background:color,color:"#333",fontSize:11,padding:"2px 9px",borderRadius:10,fontWeight:500,whiteSpace:"nowrap"}}>{children}</span>;
}
function Field({label,children}){
  return <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:600,color:"#3b1fa8",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.03em"}}>{label}</label>{children}</div>;
}
function Inp({value,onChange,placeholder,type="text",disabled=false}){
  return <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
    style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:disabled?"#f0f0f0":"rgba(245,242,255,0.8)",fontFamily:"inherit",outline:"none"}}/>;
}
function Sel({value,onChange,options,disabled=false}){
  return <select value={value||""} onChange={e=>onChange(e.target.value)} disabled={disabled}
    style={{width:"100%",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:disabled?"#f0f0f0":"rgba(245,242,255,0.8)",fontFamily:"inherit",outline:"none"}}>
    {options.map(o=><option key={Array.isArray(o)?o[0]:o} value={Array.isArray(o)?o[0]:o}>{Array.isArray(o)?o[1]:o}</option>)}
  </select>;
}
function Textarea({value,onChange,placeholder,rows=3}){
  return <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:"rgba(245,242,255,0.8)",fontFamily:"inherit",outline:"none",resize:"vertical"}}/>;
}
function SaveBar({onCancel,onSave,label,danger=false}){
  return <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:20,paddingTop:16,borderTop:"1.5px solid rgba(180,160,255,0.25)"}}>
    <button onClick={onCancel} style={{padding:"9px 20px",borderRadius:10,border:"1.5px solid rgba(120,90,220,0.35)",background:"rgba(245,242,255,0.7)",color:"#3b1fa8",fontWeight:600,cursor:"pointer",fontSize:14}}>Cancel</button>
    <button onClick={onSave} style={{padding:"9px 20px",borderRadius:10,border:"none",background:danger?"linear-gradient(135deg,#dc2626,#b91c1c)":"linear-gradient(135deg,#3b1fa8,#6c3fc7)",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>{label}</button>
  </div>;
}
function Modal({title,onClose,children,wide=false}){
  return <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"rgba(10,15,40,0.75)",backdropFilter:"blur(6px)",overflowY:"auto",padding:"2rem 1rem"}}>
    <div style={{width:wide?840:580,padding:"2rem",borderRadius:20,background:"linear-gradient(160deg,rgba(255,255,255,0.98),rgba(235,240,255,0.96))",border:"1.5px solid rgba(255,255,255,0.9)",boxShadow:"0 8px 48px rgba(80,60,180,0.22)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:"1.5px solid rgba(180,160,255,0.25)"}}>
        <h3 style={{margin:0,fontSize:18,fontWeight:700,background:"linear-gradient(90deg,#3b1fa8,#6c3fc7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(180,160,255,0.18)",border:"1px solid rgba(140,100,255,0.25)",fontSize:18,cursor:"pointer",color:"#5a3abf",width:34,height:34,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>×</button>
      </div>
      {children}
    </div>
  </div>;
}
function ContactsEditor({value=[],onChange}){
  const add=()=>onChange([...value,{email:"",phone:"",label:"Work"}]);
  const rm=i=>onChange(value.filter((_,j)=>j!==i));
  const upd=(i,f,v)=>onChange(value.map((c,j)=>j===i?{...c,[f]:v}:c));
  return <div>
    {value.map((c,i)=>(
      <div key={i} style={{border:"1px solid rgba(120,90,220,0.2)",borderRadius:10,padding:"10px 12px",marginBottom:10,background:"rgba(245,242,255,0.5)"}}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <select value={c.label} onChange={e=>upd(i,"label",e.target.value)} style={{flex:1,padding:"6px 10px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:8,fontSize:12,fontFamily:"inherit",background:"rgba(245,242,255,0.8)",color:"#1a0a40"}}>
            {labelOptions.map(l=><option key={l}>{l}</option>)}
          </select>
          {value.length>1&&<button onClick={()=>rm(i)} style={{background:"#fee2e2",border:"none",color:"#b91c1c",borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14}}>×</button>}
        </div>
        <input value={c.email} onChange={e=>upd(i,"email",e.target.value)} placeholder="Email" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8,fontSize:13,marginBottom:6,fontFamily:"inherit",background:"rgba(255,255,255,0.7)",color:"#1a0a40"}}/>
        <input value={c.phone} onChange={e=>upd(i,"phone",e.target.value)} placeholder="Phone" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8,fontSize:13,fontFamily:"inherit",background:"rgba(255,255,255,0.7)",color:"#1a0a40"}}/>
      </div>
    ))}
    <button onClick={add} style={{width:"100%",padding:"8px",border:"1.5px dashed rgba(120,90,220,0.4)",borderRadius:10,background:"transparent",color:"#5a3abf",fontSize:13,cursor:"pointer",fontWeight:500}}>+ Add contact detail</button>
  </div>;
}
function QuoteItemsEditor({items,onChange,currencySymbol}){
  const sym=currencySymbol||"₹";
  const calc=(base,qty,disc)=>Math.round((+base||0)*(+qty||1)*(1-(+disc||0)/100));
  const add=()=>onChange([...items,{sku:"",name:"",basePrice:0,qty:1,discount:0,finalPrice:0}]);
  const rm=i=>onChange(items.filter((_,j)=>j!==i));
  const pickSku=(i,skuCode)=>{
    const p=PRICEBOOK.find(p=>p.sku===skuCode);
    if(!p)return;
    onChange(items.map((it,j)=>j!==i?it:{...it,sku:p.sku,name:p.name,basePrice:p.basePrice,finalPrice:calc(p.basePrice,it.qty,it.discount)}));
  };
  const upd=(i,field,val)=>{
    onChange(items.map((it,j)=>{
      if(j!==i)return it;
      const n={...it,[field]:val};
      n.finalPrice=calc(n.basePrice,n.qty,n.discount);
      return n;
    }));
  };
  const total=items.reduce((s,it)=>s+(+it.finalPrice||0),0);
  return <div>
    {items.map((it,i)=>(
      <div key={i} style={{border:"1px solid rgba(120,90,220,0.2)",borderRadius:10,padding:"12px",marginBottom:10,background:"rgba(245,242,255,0.4)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>SKU</div>
            <select value={it.sku} onChange={e=>pickSku(i,e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:8,fontSize:13,fontFamily:"inherit",background:"rgba(245,242,255,0.8)",color:"#1a0a40"}}>
              <option value="">-- Select SKU --</option>
              {PRICEBOOK.map(p=><option key={p.sku} value={p.sku}>{p.sku} — {p.name}</option>)}
            </select>
          </div>
          <div><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>Product Name</div>
            <input value={it.name} onChange={e=>upd(i,"name",e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8,fontSize:13,fontFamily:"inherit",background:"rgba(255,255,255,0.7)",color:"#1a0a40"}}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:8,alignItems:"end"}}>
          {[["SKU Price",it.basePrice,"basePrice"],["Qty",it.qty,"qty"],["Disc %",it.discount,"discount"]].map(([lbl,val,key])=>(
            <div key={key}><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>{lbl}</div>
              <input type="number" value={val} onChange={e=>upd(i,key,e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8,fontSize:13,fontFamily:"inherit",background:"rgba(255,255,255,0.7)",color:"#1a0a40"}}/>
            </div>
          ))}
          <div><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>Final</div>
            <div style={{padding:"8px 10px",background:"rgba(200,240,210,0.6)",borderRadius:8,fontSize:13,fontWeight:600,color:"#1a5c30"}}>{sym}{Number(it.finalPrice||0).toLocaleString()}</div>
          </div>
          <button onClick={()=>rm(i)} style={{background:"#fee2e2",border:"none",color:"#b91c1c",borderRadius:8,width:32,height:32,cursor:"pointer",fontSize:16,marginBottom:1}}>×</button>
        </div>
      </div>
    ))}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <button onClick={add} style={{padding:"8px 16px",border:"1.5px dashed rgba(120,90,220,0.4)",borderRadius:10,background:"transparent",color:"#5a3abf",fontSize:13,cursor:"pointer",fontWeight:500}}>+ Add Line Item</button>
      <div style={{fontSize:15,fontWeight:700,color:"#1a5c30",background:"rgba(200,240,210,0.5)",padding:"6px 16px",borderRadius:10}}>Total: {sym}{total.toLocaleString()}</div>
    </div>
  </div>;
}

// ── Approval Trail Display ────────────────────────────────────────────────────
function ApprovalTrail({approvals,roles}){
  return <div style={{display:"flex",flexDirection:"column",gap:0}}>
    {approvals.map((a,i)=>{
      const r=roles.find(x=>x.id===a.role);
      const color=a.status==="Approved"?"#c0dd97":a.status==="Rejected"?"#f7c1c1":a.status==="Pending"?"#fac775":"#e0e0e0";
      const icon=a.status==="Approved"?"✓":a.status==="Rejected"?"✗":"⏳";
      return <div key={i} style={{display:"flex",alignItems:"flex-start",gap:0}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginRight:12,paddingTop:4}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,border:"2px solid rgba(0,0,0,0.1)",flexShrink:0}}>{icon}</div>
          {i<approvals.length-1&&<div style={{width:2,height:28,background:"rgba(120,90,220,0.2)"}}/>}
        </div>
        <div style={{flex:1,marginBottom:i<approvals.length-1?4:0,padding:"10px 14px",background:"var(--color-background-secondary)",borderRadius:8,border:"0.5px solid var(--color-border-tertiary)",marginTop:2}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:a.remark?6:0}}>
            <div><span style={{fontWeight:600,fontSize:13}}>{a.user}</span> <span style={{fontSize:11,color:"var(--color-text-secondary)"}}>({r?.label||a.role})</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {a.date&&<span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{a.date}</span>}
              <Badge color={color}>{a.status}</Badge>
            </div>
          </div>
          {a.remark&&<div style={{fontSize:12,color:"#555",background:"rgba(0,0,0,0.04)",padding:"4px 8px",borderRadius:6,fontStyle:"italic"}}>"{a.remark}"</div>}
        </div>
      </div>;
    })}
  </div>;
}

// ── Role Builder ──────────────────────────────────────────────────────────────
function RoleBuilder({roles,permSets,onSave,users,setUsers}){
  const [view,setView]=useState("list"); // list | editRole | editUser
  const [form,setForm]=useState({});
  const [editRoleId,setEditRoleId]=useState(null);
  const [editUserId,setEditUserId]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);

  const openNewRole=()=>{
    const maxLvl=Math.max(...roles.map(r=>r.level),0);
    setForm({label:"",level:maxLvl+1,color:COLORS[roles.length%COLORS.length],perms:Object.fromEntries(ALL_PERMS.map(p=>[p.key,false]))});
    setEditRoleId("new");setView("editRole");
  };
  const openEditRole=r=>{setForm({...r,perms:{...permSets[r.id]}});setEditRoleId(r.id);setView("editRole");};
  const saveRole=()=>{
    if(!form.label.trim())return;
    const id=editRoleId==="new"?"ROLE_"+Date.now():editRoleId;
    onSave(id,{id,label:form.label,level:+form.level,color:form.color,canBeDeleted:true},{...form.perms});
    setView("list");
  };
  const togglePerm=k=>setForm(f=>({...f,perms:{...f.perms,[k]:!f.perms[k]}}));

  const openEditUser=u=>{
    setForm({...u, managerId: u.managerId||""});
    setEditUserId(u.id); setView("editUser");
  };
  const saveUser=()=>{
    setUsers(prev=>prev.map(u=>u.id===editUserId?{...u,roleId:form.roleId,managerId:form.managerId?+form.managerId:null}:u));
    setView("list");
  };

  const sorted=[...roles].sort((a,b)=>a.level-b.level);
  const lvlGroups={};
  sorted.forEach(r=>{if(!lvlGroups[r.level])lvlGroups[r.level]=[];lvlGroups[r.level].push(r);});

  // ── Edit Role Form ──
  if(view==="editRole") return <div>
    <button onClick={()=>setView("list")} style={{marginBottom:16,fontSize:13}}>← Back to Role Builder</button>
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1.5rem"}}>
      <h3 style={{margin:"0 0 20px",fontSize:16,fontWeight:600}}>{editRoleId==="new"?"Create New Role":"Edit Role"}</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <Field label="Role name"><Inp value={form.label||""} onChange={v=>setForm(f=>({...f,label:v}))} placeholder="e.g. Zonal Manager"/></Field>
        <Field label="Hierarchy level">
          <Sel value={String(form.level||1)} onChange={v=>setForm(f=>({...f,level:+v}))} options={Array.from({length:10},(_,i)=>[(i+1).toString(),`Level ${i+1}`])}/>
        </Field>
      </div>
      <Field label="Badge colour">
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>{COLORS.map(c=><div key={c} onClick={()=>setForm(f=>({...f,color:c}))} style={{width:28,height:28,borderRadius:6,background:c,cursor:"pointer",border:form.color===c?"2.5px solid #3b1fa8":"2px solid transparent"}}/>)}</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:13,color:"var(--color-text-secondary)"}}>Preview:</span><Badge color={form.color||"#e0e0e0"}>{form.label||"Role Name"}</Badge></div>
      </Field>
      <Field label="Permissions">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {ALL_PERMS.map(p=>(
            <label key={p.key} onClick={()=>togglePerm(p.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`1.5px solid ${form.perms?.[p.key]?"#6c3fc7":"rgba(120,90,220,0.2)"}`,borderRadius:10,cursor:"pointer",background:form.perms?.[p.key]?"rgba(108,63,199,0.07)":"transparent"}}>
              <div style={{width:18,height:18,borderRadius:4,border:"1.5px solid",borderColor:form.perms?.[p.key]?"#6c3fc7":"rgba(120,90,220,0.4)",background:form.perms?.[p.key]?"#6c3fc7":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#fff",fontSize:11}}>
                {form.perms?.[p.key]?"✓":""}
              </div>
              <span style={{fontSize:13}}>{p.label}</span>
            </label>
          ))}
        </div>
      </Field>
      <SaveBar onCancel={()=>setView("list")} onSave={saveRole} label={editRoleId==="new"?"Create Role":"Save Changes"}/>
    </div>
  </div>;

  // ── Edit User Hierarchy Form ──
  if(view==="editUser"){
    const u=users.find(x=>x.id===editUserId);
    const currentRole=roles.find(r=>r.id===form.roleId);
    const currentLevel=currentRole?.level||0;
    // eligible managers = users whose role level > current user's role level (excluding self)
    const eligibleManagers=users.filter(x=>x.id!==editUserId&&(roles.find(r=>r.id===x.roleId)?.level||0)>currentLevel);
    return <div>
      <button onClick={()=>setView("list")} style={{marginBottom:16,fontSize:13}}>← Back to Role Builder</button>
      <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1.5rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingBottom:16,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
          <Avatar name={u?.name||"?"} size={44}/>
          <div><div style={{fontSize:18,fontWeight:600}}>{u?.name}</div><div style={{fontSize:13,color:"var(--color-text-secondary)"}}>{u?.email}</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Field label="Assigned Role">
            <Sel value={form.roleId||""} onChange={v=>setForm(f=>({...f,roleId:v,managerId:""}))}
              options={[...roles].sort((a,b)=>a.level-b.level).map(r=>[r.id,`${r.label} (Level ${r.level})`])}/>
            {currentRole&&<div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}><Badge color={currentRole.color}>{currentRole.label}</Badge><span style={{fontSize:11,color:"var(--color-text-secondary)"}}>Level {currentRole.level}</span></div>}
          </Field>
          <Field label="Reports To (Manager)">
            <Sel value={String(form.managerId||"")} onChange={v=>setForm(f=>({...f,managerId:v?+v:null}))}
              options={[["","-- None (Top level) --"],...eligibleManagers.map(x=>[x.id,`${x.name} (${roles.find(r=>r.id===x.roleId)?.label||x.roleId})`])]}/>
          </Field>
        </div>
        {/* Show reporting chain preview */}
        <div style={{marginTop:16,padding:"12px 16px",background:"rgba(245,242,255,0.7)",borderRadius:10,border:"1px solid rgba(120,90,220,0.15)"}}>
          <div style={{fontSize:12,fontWeight:600,color:"#3b1fa8",marginBottom:10}}>REPORTING CHAIN PREVIEW</div>
          {(()=>{
            const chain=[{...u,roleId:form.roleId,managerId:form.managerId?+form.managerId:null}];
            let cur=form.managerId?+form.managerId:null;
            let depth=0;
            while(cur&&depth<6){
              const mgr=users.find(x=>x.id===cur);
              if(!mgr)break;
              chain.push(mgr);
              cur=mgr.managerId;
              depth++;
            }
            return chain.map((x,i)=>{
              const r=roles.find(rr=>rr.id===(i===0?form.roleId:x.roleId));
              return <div key={x.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:i*16,flexShrink:0}}/>
                {i>0&&<div style={{fontSize:11,color:"var(--color-text-secondary)",marginRight:4}}>↑ reports to</div>}
                <Avatar name={x.name} size={24}/>
                <span style={{fontSize:13}}>{x.name}</span>
                {r&&<Badge color={r.color}>{r.label}</Badge>}
              </div>;
            });
          })()}
        </div>
        <SaveBar onCancel={()=>setView("list")} onSave={saveUser} label="Save User Hierarchy"/>
      </div>
    </div>;
  }

  // ── List View ──
  return <div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <h2 style={{margin:0,fontSize:18,fontWeight:500}}>Role Builder</h2>
      <button onClick={openNewRole}>+ Create Role</button>
    </div>

    {/* Hierarchy diagram */}
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem",marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Hierarchy Overview</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {Object.entries(lvlGroups).sort(([a],[b])=>+a-+b).map(([lvl,rs])=>(
          <div key={lvl} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{fontSize:11,color:"var(--color-text-secondary)",width:52,flexShrink:0}}>Level {lvl}</div>
            <div style={{width:2,alignSelf:"stretch",background:"rgba(120,90,220,0.15)",borderRadius:2,marginRight:4}}/>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {rs.map(r=><div key={r.id} style={{background:r.color,padding:"6px 14px",borderRadius:8,fontWeight:500,fontSize:12,display:"flex",alignItems:"center",gap:8}}>
                {r.label}<span style={{fontSize:10,background:"rgba(0,0,0,0.08)",padding:"1px 6px",borderRadius:6}}>{users.filter(u=>u.roleId===r.id).length} users</span>
              </div>)}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Role Cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14,marginBottom:24}}>
      {sorted.map(r=>{
        const p=permSets[r.id]||{};
        const active=ALL_PERMS.filter(x=>p[x.key]);
        const assigned=users.filter(u=>u.roleId===r.id);
        return <div key={r.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:12,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <div style={{width:10,height:10,borderRadius:3,background:r.color,flexShrink:0}}/>
            <div style={{flex:1}}><div style={{fontWeight:500,fontSize:14}}>{r.label}</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Level {r.level} · {assigned.length} user(s)</div></div>
            <button onClick={()=>openEditRole(r)} style={{fontSize:12,padding:"4px 12px",background:"rgba(108,63,199,0.1)",border:"1px solid rgba(108,63,199,0.3)",color:"#3b1fa8",borderRadius:7,cursor:"pointer"}}>Edit</button>
            {r.canBeDeleted&&assigned.length===0&&<button onClick={()=>setConfirmDel(r)} style={{fontSize:12,padding:"4px 10px",background:"#fee2e2",border:"1px solid #fca5a5",color:"#b91c1c",borderRadius:7,cursor:"pointer"}}>Del</button>}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:assigned.length?10:0}}>
            {active.length>0?active.map(x=><span key={x.key} style={{fontSize:11,background:"rgba(108,63,199,0.08)",color:"#3b1fa8",padding:"3px 8px",borderRadius:6,border:"1px solid rgba(108,63,199,0.2)"}}>{x.label}</span>):<span style={{fontSize:12,color:"var(--color-text-secondary)"}}>No permissions</span>}
          </div>
          {assigned.length>0&&<div style={{paddingTop:8,borderTop:"0.5px solid var(--color-border-tertiary)",display:"flex",gap:6,flexWrap:"wrap"}}>
            {assigned.map(u=><span key={u.id} style={{fontSize:11,color:"var(--color-text-secondary)",display:"flex",alignItems:"center",gap:4}}><Avatar name={u.name} size={16}/>{u.name}</span>)}
          </div>}
        </div>;
      })}
    </div>

    {/* User Hierarchy Management */}
    <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,overflow:"hidden"}}>
      <div style={{padding:"12px 16px",borderBottom:"0.5px solid var(--color-border-tertiary)",fontSize:13,fontWeight:600}}>User Role & Hierarchy Assignment</div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr style={{background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
          {["User","Current Role","Level","Reports To","Region","Actions"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontWeight:500,color:"var(--color-text-secondary)",fontSize:12}}>{h}</th>)}
        </tr></thead>
        <tbody>{users.map(u=>{
          const r=roles.find(x=>x.id===u.roleId);
          const mgr=users.find(x=>x.id===u.managerId);
          const mgrRole=mgr?roles.find(x=>x.id===mgr.roleId):null;
          return <tr key={u.id} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
            <td style={{padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={u.name} size={26}/>{u.name}</div></td>
            <td style={{padding:"10px 14px"}}>{r?<Badge color={r.color}>{r.label}</Badge>:"—"}</td>
            <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{r?`Level ${r.level}`:"—"}</td>
            <td style={{padding:"10px 14px"}}>
              {mgr?<div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={mgr.name} size={20}/><span>{mgr.name}</span>{mgrRole&&<Badge color={mgrRole.color}>{mgrRole.label}</Badge>}</div>:<span style={{color:"var(--color-text-secondary)",fontSize:12}}>— (Top level)</span>}
            </td>
            <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>📍 {u.region}</td>
            <td style={{padding:"10px 14px"}}>
              <button onClick={()=>openEditUser(u)} style={{fontSize:12,padding:"4px 12px",background:"rgba(108,63,199,0.1)",border:"1px solid rgba(108,63,199,0.3)",color:"#3b1fa8",borderRadius:7,cursor:"pointer"}}>Edit</button>
            </td>
          </tr>;
        })}
        </tbody>
      </table>
    </div>

    {confirmDel&&<Modal title="Delete Role" onClose={()=>setConfirmDel(null)}>
      <p>Delete role <strong>{confirmDel.label}</strong>? This cannot be undone.</p>
      <SaveBar onCancel={()=>setConfirmDel(null)} onSave={()=>{onSave(confirmDel.id,null,null);setConfirmDel(null);}} label="Delete" danger/>
    </Modal>}
  </div>;
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin,roles,users}){
  const [email,setEmail]=useState("");const [pwd,setPwd]=useState("");const [err,setErr]=useState("");
  const submit=()=>{const u=users.find(u=>u.email===email.trim()&&u.password===pwd);if(u)onLogin(u);else setErr("Invalid credentials.");};
  return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a2340 0%,#2e1a5c 100%)"}}>
    <div style={{width:400,background:"rgba(255,255,255,0.97)",borderRadius:20,padding:"2.5rem 2rem",boxShadow:"0 12px 60px rgba(0,0,0,0.3)"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:28,marginBottom:6}}>🚀</div>
        <div style={{fontSize:22,fontWeight:700,background:"linear-gradient(90deg,#3b1fa8,#6c3fc7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SalesFlow CRM</div>
        <div style={{fontSize:13,color:"#7a8bbf",marginTop:4}}>Sign in to your account</div>
      </div>
      <Field label="Email"><Inp value={email} onChange={setEmail} placeholder="amit@sf.in"/></Field>
      <Field label="Password"><Inp type="password" value={pwd} onChange={setPwd} placeholder="••••••••"/></Field>
      {err&&<div style={{color:"#b91c1c",fontSize:13,marginBottom:12,textAlign:"center"}}>{err}</div>}
      <button onClick={submit} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#3b1fa8,#6c3fc7)",color:"#fff",fontWeight:600,fontSize:15,cursor:"pointer",marginBottom:20}}>Sign In</button>
      <div style={{background:"#f5f3ff",borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontSize:11,fontWeight:600,color:"#3b1fa8",marginBottom:8}}>DEMO ACCOUNTS</div>
        {users.map(u=>{const r=roles.find(x=>x.id===u.roleId);return(
          <div key={u.id} onClick={()=>{setEmail(u.email);setPwd(u.password);setErr("");}} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 6px",borderRadius:8,cursor:"pointer",marginBottom:3}}
            onMouseEnter={e=>e.currentTarget.style.background="#ede9ff"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <Avatar name={u.name} size={22}/><span style={{fontSize:12,flex:1}}>{u.name}</span>
            {r&&<Badge color={r.color}>{r.label}</Badge>}
          </div>
        );})}
      </div>
    </div>
  </div>;
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [roles,setRoles]=useState(DEFAULT_ROLES);
  const [permSets,setPermSets]=useState(DEFAULT_PERM_SETS);
  const [users,setUsers]=useState(INIT_USERS);
  const [currentUser,setCurrentUser]=useState(null);
  const handleSaveRole=(id,roleDef,perms)=>{
    if(!roleDef){setRoles(p=>p.filter(r=>r.id!==id));setPermSets(p=>{const n={...p};delete n[id];return n;});}
    else{setRoles(p=>{const ex=p.find(r=>r.id===id);return ex?p.map(r=>r.id===id?roleDef:r):[...p,roleDef];});setPermSets(p=>({...p,[id]:perms}));}
  };
  if(!currentUser)return <LoginScreen onLogin={setCurrentUser} roles={roles} users={users}/>;
  return <CRM user={currentUser} onLogout={()=>setCurrentUser(null)} roles={roles} permSets={permSets} users={users} setUsers={setUsers} onSaveRole={handleSaveRole}/>;
}

// ── CRM ───────────────────────────────────────────────────────────────────────
function CRM({user,onLogout,roles,permSets,users,setUsers,onSaveRole}){
  const perm=permSets[user.roleId]||{};
  const role=roles.find(r=>r.id===user.roleId)||{label:"Unknown",color:"#e0e0e0",level:0};
  const tabs=tabsFromPerms(perm);
  const [tab,setTab]=useState("dashboard");
  const [leads,setLeads]=useState(INIT_LEADS);
  const [opps,setOpps]=useState(INIT_OPPS);
  const [tasks,setTasks]=useState(INIT_TASKS);
  const [quotes,setQuotes]=useState(INIT_QUOTES);
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [detail,setDetail]=useState(null);
  const [editTarget,setEditTarget]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  // For approval remark modal
  const [approvalModal,setApprovalModal]=useState(null); // {quoteId, decision}
  const [remarkText,setRemarkText]=useState("");

  const canSeeAll=perm.viewAllRecords;
  const mine=arr=>canSeeAll?arr:arr.filter(r=>r.owner===user.name);
  const sf=(arr,fields)=>arr.filter(r=>!search||fields.some(f=>String(r[f]||"").toLowerCase().includes(search.toLowerCase())));
  const currSym=code=>(CURRENCIES.find(c=>c.code===code)||{symbol:"₹"}).symbol;

  const openNew=(type,defs={})=>{setModal(type);setEditTarget(null);setForm({contacts:[{email:"",phone:"",label:"Work"}],owner:user.name,...defs});};
  const openEdit=(type,item)=>{setForm({...item});setModal(type);setEditTarget(item.id);};
  const closeModal=()=>{setModal(null);setForm({});setEditTarget(null);};
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  // Build approval chain walking up the managerId tree
  const buildApprovalChain=(ownerUserId)=>{
    const chain=[];
    const visited=new Set();
    let curId=ownerUserId;
    let depth=0;
    while(curId&&depth<10){
      const u=users.find(x=>x.id===curId);
      if(!u||visited.has(u.id))break;
      visited.add(u.id);
      // only add if this user's role has approveQuotes or finalApprove
      const p=permSets[u.roleId]||{};
      if(p.approveQuotes||p.finalApprove){
        const r=roles.find(x=>x.id===u.roleId);
        chain.push({userId:u.id,role:u.roleId,user:u.name,status:"Pending",date:"",remark:""});
      }
      curId=u.managerId;
      depth++;
    }
    return chain;
  };

  const saveItem=()=>{
    if(modal==="lead"){
      const c={...form,contacts:(form.contacts||[]).filter(x=>x.email||x.phone),region:user.region};
      if(editTarget)setLeads(p=>p.map(l=>l.id===editTarget?{...l,...c}:l));
      else setLeads(p=>[...p,{...c,id:Date.now(),created:new Date().toISOString().slice(0,10)}]);
    }
    if(modal==="opp"){const c={...form,region:user.region};if(editTarget)setOpps(p=>p.map(o=>o.id===editTarget?{...o,...c}:o));else setOpps(p=>[...p,{...c,id:Date.now(),value:+c.value||0,probability:+c.probability||0}]);}
    if(modal==="task"){if(editTarget)setTasks(p=>p.map(t=>t.id===editTarget?{...t,...form}:t));else setTasks(p=>[...p,{...form,id:Date.now(),status:"Open"}]);}
    if(modal==="quote"){
      const ownerUser=users.find(u=>u.name===(form.owner||user.name))||user;
      const chain=buildApprovalChain(ownerUser.id);
      const q={...form,id:Date.now(),quoteNo:"QT-"+String(quotes.length+1).padStart(4,"0"),status:chain.length>0?"Pending Approval":"Approved",approvals:chain,region:user.region,items:form.items||[],ownerId:ownerUser.id};
      setQuotes(p=>[...p,q]);
    }
    if(modal==="user")setUsers(p=>[...p,{...form,id:Date.now(),password:form.password||"pass123",managerId:form.managerId?+form.managerId:null}]);
    closeModal();
  };

  const deleteLead=id=>{setLeads(p=>p.filter(l=>l.id!==id));setConfirmDel(null);setDetail(null);};
  const toggleTask=id=>setTasks(p=>p.map(t=>t.id===id?{...t,status:t.status==="Done"?"Open":"Done"}:t));
  const moveStage=(id,dir)=>setOpps(p=>p.map(o=>{if(o.id!==id)return o;const idx=STAGES.indexOf(o.stage);return{...o,stage:STAGES[Math.max(0,Math.min(STAGES.length-1,idx+dir))]};}));

  const openApprovalModal=(quoteId,decision)=>{setApprovalModal({quoteId,decision});setRemarkText("");};

  const submitApproval=()=>{
    const {quoteId,decision}=approvalModal;
    const today=new Date().toISOString().slice(0,10);
    setQuotes(prev=>{
      const updated=prev.map(q=>{
        if(q.id!==quoteId)return q;
        const idx=q.approvals.findIndex(a=>a.status==="Pending"&&a.userId===user.id);
        if(idx===-1)return q;
        const newApprovals=q.approvals.map((a,i)=>
          i===idx?{...a,status:decision,date:today,remark:remarkText}:a
        );
        const anyRejected=newApprovals.some(a=>a.status==="Rejected");
        const pendingLeft=newApprovals.some(a=>a.status==="Pending");
        const newStatus=anyRejected?"Rejected":pendingLeft?"Pending Approval":"Approved";
        return{...q,approvals:newApprovals,status:newStatus};
      });
      // sync detail view inside same setState batch
      const freshQuote=updated.find(q=>q.id===quoteId);
      if(freshQuote&&detail?.type==="quote"){
        setTimeout(()=>setDetail({type:"quote",data:freshQuote}),0);
      }
      return updated;
    });
    setApprovalModal(null);
    setRemarkText("");
  };

  // Sync detail with latest quote data after approval
  const getLatestQuote=(id)=>quotes.find(q=>q.id===id);

  const mLeads=mine(leads);const mOpps=mine(opps);const mTasks=mine(tasks);
  const totalPipeline=mOpps.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).reduce((s,o)=>s+o.value,0);
  const won=mOpps.filter(o=>o.stage==="Closed Won").reduce((s,o)=>s+o.value,0);
  const stageData=STAGES.slice(0,4).map(s=>({stage:s,val:mOpps.filter(o=>o.stage===s).reduce((a,b)=>a+b.value,0)}));
  const maxVal=Math.max(...stageData.map(s=>s.val),1);
  const pendingApproval=quotes.filter(q=>q.status==="Pending Approval"&&q.approvals?.some(a=>a.status==="Pending"&&a.userId===user.id)).length;
  const safeTab=tabs.includes(tab)?tab:tabs[0];
  const repByUser=useMemo(()=>{const map={};opps.forEach(o=>{if(!map[o.owner])map[o.owner]={name:o.owner,total:0,won:0,count:0};map[o.owner].total+=o.value;map[o.owner].count++;if(o.stage==="Closed Won")map[o.owner].won+=o.value;});return Object.values(map).sort((a,b)=>b.total-a.total);},[opps]);
  const maxRep=Math.max(...repByUser.map(r=>r.total),1);

  // Always derive quote detail from live quotes state, never from stale detail.data
  const liveQuoteDetail=useMemo(()=>
    detail?.type==="quote"?quotes.find(q=>q.id===detail.data.id)||null:null
  ,[quotes,detail]);

  return <div style={{display:"flex",height:"100vh",fontFamily:"var(--font-sans)",fontSize:14,color:"var(--color-text-primary)"}}>
    {/* Sidebar */}
    <div style={{width:210,background:"#1a2340",color:"#c8d3f0",display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"1.25rem 1rem 1rem",borderBottom:"0.5px solid #2e3a5c"}}>
        <div style={{fontSize:15,fontWeight:600,color:"#fff"}}>SalesFlow CRM</div>
        <div style={{fontSize:11,color:"#7a8bbf",marginTop:2}}>Sales Intelligence</div>
      </div>
      <div style={{padding:"0.5rem",flex:1,overflowY:"auto"}}>
        {tabs.map(t=><div key={t} onClick={()=>{setTab(t);setDetail(null);setSearch("");}} style={{padding:"8px 12px",borderRadius:6,cursor:"pointer",marginBottom:2,background:safeTab===t?"#2e3a5c":"transparent",color:safeTab===t?"#fff":"#8a9bc5",fontSize:13,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          {TAB_LABELS[t]}
          {t==="quotes"&&pendingApproval>0&&<span style={{background:"#e24b4a",color:"#fff",fontSize:10,padding:"1px 6px",borderRadius:8,fontWeight:700}}>{pendingApproval}</span>}
        </div>)}
      </div>
      <div style={{padding:"1rem",borderTop:"0.5px solid #2e3a5c"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <Avatar name={user.name}/><div><div style={{color:"#c8d3f0",fontSize:12,fontWeight:500}}>{user.name}</div><div style={{marginTop:3}}><Badge color={role.color}>{role.label}</Badge></div></div>
        </div>
        <button onClick={onLogout} style={{width:"100%",padding:"7px",borderRadius:8,border:"1px solid #3a4a6a",background:"transparent",color:"#8a9bc5",fontSize:12,cursor:"pointer"}}>Sign Out</button>
      </div>
    </div>

    {/* Main */}
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"var(--color-background-tertiary)"}}>
      <div style={{background:"var(--color-background-primary)",borderBottom:"0.5px solid var(--color-border-tertiary)",padding:"0 1.25rem",height:52,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:200}}/>
        <div style={{flex:1}}/>
        {!canSeeAll&&<Badge color="#f4c0d1">My Records</Badge>}
        {canSeeAll&&<Badge color="#c0dd97">All Records</Badge>}
        {safeTab==="leads"&&perm.createLeads&&<button onClick={()=>openNew("lead",{status:"New",source:"Web"})}>+ New Lead</button>}
        {safeTab==="opportunities"&&perm.viewPipeline&&perm.editRecords&&<button onClick={()=>openNew("opp",{stage:"Prospecting",probability:10})}>+ New Opportunity</button>}
        {safeTab==="tasks"&&<button onClick={()=>openNew("task",{type:"Call"})}>+ New Task</button>}
        {safeTab==="quotes"&&perm.createQuotes&&<button onClick={()=>openNew("quote",{currency:"INR",items:[]})}>+ New Quote</button>}
        {safeTab==="team"&&perm.manageUsers&&<button onClick={()=>openNew("user",{roleId:roles[0]?.id,region:"Delhi"})}>+ Add User</button>}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"1.25rem"}}>

        {safeTab==="roles"&&<RoleBuilder roles={roles} permSets={permSets} onSave={onSaveRole} users={users} setUsers={setUsers}/>}

        {safeTab==="dashboard"&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h2 style={{margin:0,fontSize:18,fontWeight:500}}>Dashboard</h2>
            <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{canSeeAll?"All regions":`Region: ${user.region}`}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
            {[[fmt(totalPipeline),"Pipeline Value"],[fmt(won),"Revenue Won"],[mLeads.filter(l=>l.status==="New").length,"New Leads"],[pendingApproval,"Quotes to Approve"]].map(([v,l])=>(
              <div key={l} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem"}}>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:6}}>{l}</div>
                <div style={{fontSize:22,fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Pipeline by stage</div>
              {stageData.map(s=><div key={s.stage} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{color:"var(--color-text-secondary)"}}>{s.stage}</span><span style={{fontWeight:500}}>{fmt(s.val)}</span></div>
                <div style={{background:"var(--color-background-secondary)",borderRadius:4,height:8}}><div style={{width:`${(s.val/maxVal)*100}%`,background:stageColors[s.stage],height:8,borderRadius:4}}/></div>
              </div>)}
            </div>
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Recent quotes</div>
              {quotes.slice(0,5).map(q=><div key={q.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,paddingBottom:10,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{q.name}</div><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>{q.quoteNo} · {q.owner}</div></div>
                <Badge color={qsColors[q.status]}>{q.status}</Badge>
              </div>)}
            </div>
          </div>
        </div>}

        {/* LEADS */}
        {safeTab==="leads"&&!detail&&<div>
          <h2 style={{margin:"0 0 1rem",fontSize:18,fontWeight:500}}>Leads ({sf(mLeads,["name","company","status"]).length})</h2>
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                {["Name","Company","Primary Contact","Status","Source","Owner",""].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontWeight:500,color:"var(--color-text-secondary)",fontSize:12}}>{h}</th>)}
              </tr></thead>
              <tbody>{sf(mLeads,["name","company","status"]).map(l=>(
                <tr key={l.id} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <td style={{padding:"10px 14px",cursor:"pointer"}} onClick={()=>setDetail({type:"lead",data:l})}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={l.name}/>{l.name}</div></td>
                  <td style={{padding:"10px 14px"}}>{l.company}</td>
                  <td style={{padding:"10px 14px"}}><div style={{fontSize:12}}>{(l.contacts||[])[0]?.email||"—"}</div></td>
                  <td style={{padding:"10px 14px"}}><Badge color={statusColors[l.status]}>{l.status}</Badge></td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{l.source}</td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{l.owner}</td>
                  <td style={{padding:"10px 14px"}}>
                    <div style={{display:"flex",gap:6}}>
                      {perm.editRecords&&<button onClick={()=>openEdit("lead",l)} style={{fontSize:11,padding:"3px 10px",background:"rgba(108,63,199,0.1)",border:"1px solid rgba(108,63,199,0.3)",color:"#3b1fa8",borderRadius:6,cursor:"pointer"}}>Edit</button>}
                      {perm.deleteRecords&&<button onClick={()=>setConfirmDel(l)} style={{fontSize:11,padding:"3px 10px",background:"#fee2e2",border:"1px solid #fca5a5",color:"#b91c1c",borderRadius:6,cursor:"pointer"}}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}

        {safeTab==="leads"&&detail&&detail.type==="lead"&&<div>
          <button onClick={()=>setDetail(null)} style={{marginBottom:12,fontSize:13}}>← Back to Leads</button>
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,paddingBottom:16,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
              <Avatar name={detail.data.name} size={44}/>
              <div style={{flex:1}}><div style={{fontSize:20,fontWeight:500}}>{detail.data.name}</div><div style={{color:"var(--color-text-secondary)",fontSize:13}}>{detail.data.company}</div></div>
              <Badge color={statusColors[detail.data.status]}>{detail.data.status}</Badge>
              {perm.editRecords&&<button onClick={()=>{openEdit("lead",detail.data);setDetail(null);}} style={{fontSize:12,padding:"6px 14px",background:"rgba(108,63,199,0.1)",border:"1px solid rgba(108,63,199,0.3)",color:"#3b1fa8",borderRadius:8,cursor:"pointer"}}>Edit</button>}
              {perm.deleteRecords&&<button onClick={()=>setConfirmDel(detail.data)} style={{fontSize:12,padding:"6px 14px",background:"#fee2e2",border:"1px solid #fca5a5",color:"#b91c1c",borderRadius:8,cursor:"pointer"}}>Delete</button>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {[["Source",detail.data.source],["Owner",detail.data.owner],["Region",detail.data.region],["Created",detail.data.created]].map(([k,v])=>(
                <div key={k}><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>{k}</div><div>{v}</div></div>
              ))}
            </div>
          </div>
        </div>}

        {safeTab==="opportunities"&&<div>
          <h2 style={{margin:"0 0 1rem",fontSize:18,fontWeight:500}}>Pipeline</h2>
          <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
            {STAGES.map(stage=>{
              const cards=sf(mOpps,["name","account","stage"]).filter(o=>o.stage===stage);
              const total=cards.reduce((s,o)=>s+o.value,0);
              return <div key={stage} style={{minWidth:190,flexShrink:0}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                  <div style={{width:10,height:10,borderRadius:2,background:stageColors[stage]}}/><span style={{fontSize:12,fontWeight:500}}>{stage}</span><span style={{fontSize:11,color:"var(--color-text-secondary)",marginLeft:"auto"}}>{fmt(total)}</span>
                </div>
                {cards.map(o=><div key={o.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                  <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>{o.name}</div>
                  <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:6}}>{o.account}</div>
                  <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:500,fontSize:13}}>{fmt(o.value)}</span><span style={{fontSize:11,color:"var(--color-text-secondary)"}}>{o.probability}%</span></div>
                  {perm.editRecords&&<div style={{display:"flex",gap:4,marginTop:8}}>
                    <button onClick={()=>moveStage(o.id,-1)} style={{fontSize:11,padding:"2px 6px"}}>◀</button>
                    <button onClick={()=>moveStage(o.id,1)} style={{fontSize:11,padding:"2px 6px"}}>▶</button>
                  </div>}
                </div>)}
              </div>;
            })}
          </div>
        </div>}

        {safeTab==="tasks"&&<div>
          <h2 style={{margin:"0 0 1rem",fontSize:18,fontWeight:500}}>Tasks</h2>
          {sf(mine(tasks),["title","type","related","owner"]).map(t=>(
            <div key={t.id} style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8,opacity:t.status==="Done"?0.6:1}}>
              <div onClick={()=>toggleTask(t.id)} style={{width:20,height:20,borderRadius:4,border:"1.5px solid var(--color-border-secondary)",background:t.status==="Done"?"#c0dd97":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{t.status==="Done"?"✓":""}</div>
              <span>{taskTypeIcon[t.type]}</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,textDecoration:t.status==="Done"?"line-through":"none"}}>{t.title}</div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>{t.type} · {t.related}</div></div>
              <div style={{fontSize:12,color:new Date(t.due)<new Date()&&t.status!=="Done"?"#e24b4a":"var(--color-text-secondary)"}}>Due {t.due}</div>
              <Badge color={t.status==="Done"?"#c0dd97":"#b5d4f4"}>{t.status}</Badge>
            </div>
          ))}
        </div>}

        {/* QUOTES LIST */}
        {safeTab==="quotes"&&!detail&&<div>
          <h2 style={{margin:"0 0 1rem",fontSize:18,fontWeight:500}}>Quotes</h2>
          {pendingApproval>0&&<div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:"10px 16px",marginBottom:14,fontSize:13,display:"flex",alignItems:"center",gap:8}}>
            ⚠️ <strong>{pendingApproval} quote(s)</strong> awaiting your approval
          </div>}
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                {["Quote#","Name","Lead","Currency","Total","Status","Expiry","Owner"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontWeight:500,color:"var(--color-text-secondary)",fontSize:12}}>{h}</th>)}
              </tr></thead>
              <tbody>{(canSeeAll?quotes:quotes.filter(q=>q.ownerId===user.id||q.approvals?.some(a=>a.userId===user.id))).filter(q=>!search||q.name?.toLowerCase().includes(search.toLowerCase())||q.quoteNo?.toLowerCase().includes(search.toLowerCase())).map(q=>{
                const total=q.items?.reduce((s,i)=>s+(+i.finalPrice||0),0)||0;
                const sym=currSym(q.currency);
                const myTurn=q.approvals?.some(a=>a.status==="Pending"&&a.userId===user.id);
                return <tr key={q.id} onClick={()=>setDetail({type:"quote",data:q})} style={{borderBottom:"0.5px solid var(--color-border-tertiary)",cursor:"pointer",background:myTurn?"rgba(252,211,77,0.07)":"transparent"}}
                  onMouseEnter={e=>e.currentTarget.style.background=myTurn?"rgba(252,211,77,0.14)":"var(--color-background-secondary)"}
                  onMouseLeave={e=>e.currentTarget.style.background=myTurn?"rgba(252,211,77,0.07)":"transparent"}>
                  <td style={{padding:"10px 14px",fontWeight:500,color:"#3b1fa8"}}>{q.quoteNo}</td>
                  <td style={{padding:"10px 14px",fontWeight:500}}>{q.name}</td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{q.lead||"—"}</td>
                  <td style={{padding:"10px 14px"}}><Badge color="#e0d9ff">{q.currency}</Badge></td>
                  <td style={{padding:"10px 14px",fontWeight:600}}>{sym}{total.toLocaleString()}</td>
                  <td style={{padding:"10px 14px"}}><Badge color={qsColors[q.status]}>{q.status}</Badge>{myTurn&&<span style={{fontSize:10,marginLeft:4,color:"#b45309",fontWeight:700}}> ACTION REQ.</span>}</td>
                  <td style={{padding:"10px 14px",fontSize:12,color:"var(--color-text-secondary)"}}>{q.expiryDate||"—"}</td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{q.owner}</td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        </div>}

        {/* QUOTE DETAIL — always use live data */}
        {safeTab==="quotes"&&detail&&detail.type==="quote"&&liveQuoteDetail&&(()=>{
          const q=liveQuoteDetail;
          const sym=currSym(q.currency);
          const total=q.items?.reduce((s,i)=>s+(+i.finalPrice||0),0)||0;
          const myApprovalStep=q.approvals?.find(a=>a.status==="Pending"&&a.userId===user.id);
          const canAct=(perm.approveQuotes||perm.finalApprove)&&!!myApprovalStep&&q.status==="Pending Approval";
          return <div>
            <button onClick={()=>setDetail(null)} style={{marginBottom:12,fontSize:13}}>← Back to Quotes</button>
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:12,padding:"1.5rem"}}>
              {/* Header */}
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:20,paddingBottom:16,borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                <div><div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:4}}>{q.quoteNo}</div><div style={{fontSize:22,fontWeight:600,marginBottom:8}}>{q.name}</div><Badge color={qsColors[q.status]}>{q.status}</Badge></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"var(--color-text-secondary)"}}>Total Value</div><div style={{fontSize:28,fontWeight:700,color:"#1a5c30"}}>{sym}{total.toLocaleString()}</div><div style={{fontSize:12,color:"var(--color-text-secondary)"}}>{q.currency}</div></div>
              </div>
              {/* Meta */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
                {[["Lead",q.lead||"—"],["Channel Partner",q.channelPartner||"—"],["PO Number",q.poNumber||"—"],["Start Date",q.startDate||"—"],["End Date",q.endDate||"—"],["Quote Expiry",q.expiryDate||"—"],["Owner",q.owner],["Region",q.region||"—"]].map(([k,v])=>(
                  <div key={k} style={{padding:"10px 14px",background:"var(--color-background-secondary)",borderRadius:8}}>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",marginBottom:3}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:500}}>{v}</div>
                  </div>
                ))}
              </div>
              {/* Line items */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Line Items</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                  <thead><tr style={{background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                    {["SKU","Product","Unit Price","Qty","Disc %","Final Price"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:12,fontWeight:500,color:"var(--color-text-secondary)"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {(q.items||[]).map((it,i)=><tr key={i} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                      <td style={{padding:"8px 12px",color:"#3b1fa8",fontWeight:500}}>{it.sku}</td>
                      <td style={{padding:"8px 12px"}}>{it.name}</td>
                      <td style={{padding:"8px 12px",color:"var(--color-text-secondary)"}}>{sym}{Number(it.basePrice||0).toLocaleString()}</td>
                      <td style={{padding:"8px 12px"}}>{it.qty}</td>
                      <td style={{padding:"8px 12px"}}>{it.discount}%</td>
                      <td style={{padding:"8px 12px",fontWeight:600,color:"#1a5c30"}}>{sym}{Number(it.finalPrice||0).toLocaleString()}</td>
                    </tr>)}
                    <tr style={{borderTop:"2px solid var(--color-border-secondary)",background:"rgba(200,240,210,0.3)"}}>
                      <td colSpan={5} style={{padding:"10px 12px",fontWeight:700,fontSize:14}}>Total</td>
                      <td style={{padding:"10px 12px",fontWeight:700,fontSize:16,color:"#1a5c30"}}>{sym}{total.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Approval trail */}
              <div style={{marginBottom:canAct?20:0}}>
                <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Approval Trail</div>
                <ApprovalTrail approvals={q.approvals||[]} roles={roles}/>
              </div>
              {/* Action */}
              {canAct&&<div style={{paddingTop:16,borderTop:"0.5px solid var(--color-border-tertiary)",display:"flex",gap:12}}>
                <button onClick={()=>openApprovalModal(q.id,"Approved")} style={{padding:"10px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#16a34a,#15803d)",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>✓ Approve</button>
                <button onClick={()=>openApprovalModal(q.id,"Rejected")} style={{padding:"10px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#dc2626,#b91c1c)",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>✗ Reject</button>
              </div>}
              {!canAct&&q.status==="Pending Approval"&&<div style={{paddingTop:16,borderTop:"0.5px solid var(--color-border-tertiary)",fontSize:13,color:"var(--color-text-secondary)",fontStyle:"italic"}}>Waiting for other approvers in the chain.</div>}
            </div>
          </div>;
        })()}

        {/* REPORTS */}
        {safeTab==="reports"&&<div>
          <h2 style={{margin:"0 0 1rem",fontSize:18,fontWeight:500}}>Reports</h2>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Pipeline by Rep</div>
              {repByUser.map(r=><div key={r.name} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={r.name} size={20}/>{r.name}</span><span style={{fontWeight:500}}>{fmt(r.total)}</span></div>
                <div style={{background:"var(--color-background-secondary)",borderRadius:4,height:8}}><div style={{width:`${(r.total/maxRep)*100}%`,background:"#b5d4f4",height:8,borderRadius:4}}/></div>
              </div>)}
            </div>
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Quote Status Summary</div>
              {QUOTE_STATUSES.map(s=>{const cnt=quotes.filter(q=>q.status===s).length;return <div key={s} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <Badge color={qsColors[s]}>{s}</Badge>
                <div style={{flex:1,background:"var(--color-background-secondary)",borderRadius:4,height:8}}><div style={{width:`${(cnt/Math.max(quotes.length,1))*100}%`,background:qsColors[s],height:8,borderRadius:4}}/></div>
                <span style={{fontSize:13,fontWeight:500}}>{cnt}</span>
              </div>;})}
            </div>
            <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,padding:"1rem 1.25rem",gridColumn:"1/-1"}}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:14}}>Stage Conversion</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10}}>
                {STAGES.map(s=>{const cnt=opps.filter(o=>o.stage===s).length;const val=opps.filter(o=>o.stage===s).reduce((a,b)=>a+b.value,0);return(
                  <div key={s} style={{background:stageColors[s],borderRadius:8,padding:"10px 12px",textAlign:"center"}}>
                    <div style={{fontSize:11,fontWeight:500,marginBottom:4}}>{s}</div>
                    <div style={{fontSize:18,fontWeight:700}}>{cnt}</div>
                    <div style={{fontSize:11}}>{fmt(val)}</div>
                  </div>
                );})}
              </div>
            </div>
          </div>
        </div>}

        {safeTab==="team"&&<div>
          <h2 style={{margin:"0 0 1rem",fontSize:18,fontWeight:500}}>Team</h2>
          <div style={{background:"var(--color-background-primary)",border:"0.5px solid var(--color-border-tertiary)",borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:"var(--color-background-secondary)",borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                {["User","Role","Reports To","Region","Email"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 14px",fontWeight:500,color:"var(--color-text-secondary)",fontSize:12}}>{h}</th>)}
              </tr></thead>
              <tbody>{users.map(u=>{const r=roles.find(x=>x.id===u.roleId);const mgr=users.find(x=>x.id===u.managerId);return(
                <tr key={u.id} style={{borderBottom:"0.5px solid var(--color-border-tertiary)"}}>
                  <td style={{padding:"10px 14px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar name={u.name}/>{u.name}{u.id===user.id&&<Badge color="#fde68a">You</Badge>}</div></td>
                  <td style={{padding:"10px 14px"}}>{r?<Badge color={r.color}>{r.label}</Badge>:"—"}</td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{mgr?<div style={{display:"flex",alignItems:"center",gap:6}}><Avatar name={mgr.name} size={20}/>{mgr.name}</div>:"—"}</td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>📍 {u.region}</td>
                  <td style={{padding:"10px 14px",color:"var(--color-text-secondary)"}}>{u.email}</td>
                </tr>
              );})}
              </tbody>
            </table>
          </div>
        </div>}
      </div>
    </div>

    {/* ── MODALS ── */}
    {modal==="lead"&&<Modal title={editTarget?"Edit Lead":"New Lead"} onClose={closeModal}>
      <Field label="Full name"><Inp value={form.name||""} onChange={v=>setF("name",v)} placeholder="Priya Sharma"/></Field>
      <Field label="Company"><Inp value={form.company||""} onChange={v=>setF("company",v)} placeholder="Acme Corp"/></Field>
      <Field label="Status"><Sel value={form.status||"New"} onChange={v=>setF("status",v)} options={["New","Contacted","Qualified","Lost"]}/></Field>
      <Field label="Source"><Sel value={form.source||"Web"} onChange={v=>setF("source",v)} options={["Web","Referral","LinkedIn","Email","Cold Call"]}/></Field>
      <Field label="Owner"><Inp value={form.owner||""} onChange={v=>setF("owner",v)} placeholder={user.name}/></Field>
      <Field label="Contact Details"><ContactsEditor value={form.contacts||[]} onChange={v=>setF("contacts",v)}/></Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label={editTarget?"Save Changes":"Save Lead"}/>
    </Modal>}

    {modal==="opp"&&<Modal title="New Opportunity" onClose={closeModal}>
      <Field label="Name"><Inp value={form.name||""} onChange={v=>setF("name",v)} placeholder="Acme CRM Deal"/></Field>
      <Field label="Account"><Inp value={form.account||""} onChange={v=>setF("account",v)} placeholder="TechNova"/></Field>
      <Field label="Value (₹)"><Inp value={form.value||""} onChange={v=>setF("value",v)} placeholder="500000"/></Field>
      <Field label="Stage"><Sel value={form.stage||"Prospecting"} onChange={v=>setF("stage",v)} options={STAGES}/></Field>
      <Field label="Close date"><Inp type="date" value={form.close||""} onChange={v=>setF("close",v)}/></Field>
      <Field label="Probability (%)"><Inp value={form.probability||""} onChange={v=>setF("probability",v)} placeholder="50"/></Field>
      <Field label="Owner"><Inp value={form.owner||""} onChange={v=>setF("owner",v)} placeholder={user.name}/></Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label="Save Opportunity"/>
    </Modal>}

    {modal==="task"&&<Modal title="New Task" onClose={closeModal}>
      <Field label="Title"><Inp value={form.title||""} onChange={v=>setF("title",v)} placeholder="Follow up..."/></Field>
      <Field label="Type"><Sel value={form.type||"Call"} onChange={v=>setF("type",v)} options={["Call","Email","Meeting","Task"]}/></Field>
      <Field label="Due date"><Inp type="date" value={form.due||""} onChange={v=>setF("due",v)}/></Field>
      <Field label="Related to"><Inp value={form.related||""} onChange={v=>setF("related",v)} placeholder="TechNova CRM Deal"/></Field>
      <Field label="Owner"><Inp value={form.owner||""} onChange={v=>setF("owner",v)} placeholder={user.name}/></Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label="Save Task"/>
    </Modal>}

    {modal==="quote"&&<Modal title="New Quote" onClose={closeModal} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Quote Name"><Inp value={form.name||""} onChange={v=>setF("name",v)} placeholder="TechNova Q1 2026"/></Field>
        <Field label="Currency"><select value={form.currency||"INR"} onChange={e=>setF("currency",e.target.value)} style={{width:"100%",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:"rgba(245,242,255,0.8)",fontFamily:"inherit"}}>
          {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.symbol} {c.name}</option>)}
        </select></Field>
        <Field label="Lead"><Sel value={form.lead||""} onChange={v=>setF("lead",v)} options={[["","-- Select Lead --"],...leads.map(l=>[l.name,l.name])]}/></Field>
        <Field label="Linked Opportunity"><Sel value={form.opportunity||""} onChange={v=>setF("opportunity",v)} options={[["","-- None --"],...opps.map(o=>[o.name,o.name])]}/></Field>
        <Field label="Channel Partner"><Inp value={form.channelPartner||""} onChange={v=>setF("channelPartner",v)} placeholder="TechBridge Solutions"/></Field>
        <Field label="PO Number"><Inp value={form.poNumber||""} onChange={v=>setF("poNumber",v)} placeholder="PO-2026-001"/></Field>
        <Field label="Start Date"><Inp type="date" value={form.startDate||""} onChange={v=>setF("startDate",v)}/></Field>
        <Field label="End Date"><Inp type="date" value={form.endDate||""} onChange={v=>setF("endDate",v)}/></Field>
        <Field label="Quote Expiry Date"><Inp type="date" value={form.expiryDate||""} onChange={v=>setF("expiryDate",v)}/></Field>
        <Field label="Owner"><Inp value={form.owner||user.name} onChange={v=>setF("owner",v)} placeholder={user.name}/></Field>
      </div>
      <Field label="Line Items (from Pricebook)">
        <QuoteItemsEditor items={form.items||[]} onChange={v=>setF("items",v)} currencySymbol={CURRENCIES.find(c=>c.code===form.currency)?.symbol||"₹"}/>
      </Field>
      <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#166534",marginBottom:4}}>
        ℹ️ Quote will be routed through the approval chain based on the owner's reporting hierarchy.
      </div>
      <SaveBar onCancel={closeModal} onSave={saveItem} label="Submit for Approval"/>
    </Modal>}

    {modal==="user"&&<Modal title="Add Team Member" onClose={closeModal}>
      <Field label="Full name"><Inp value={form.name||""} onChange={v=>setF("name",v)} placeholder="John Doe"/></Field>
      <Field label="Email"><Inp value={form.email||""} onChange={v=>setF("email",v)} placeholder="john@sf.in"/></Field>
      <Field label="Role"><Sel value={form.roleId||roles[0]?.id} onChange={v=>setF("roleId",v)} options={[...roles].sort((a,b)=>a.level-b.level).map(r=>[r.id,r.label])}/></Field>
      <Field label="Reports To"><Sel value={String(form.managerId||"")} onChange={v=>setF("managerId",v?+v:null)} options={[["","-- None --"],...users.map(u=>[u.id,`${u.name} (${roles.find(r=>r.id===u.roleId)?.label||u.roleId})`])]}/></Field>
      <Field label="Region"><Sel value={form.region||"Delhi"} onChange={v=>setF("region",v)} options={["Delhi","Mumbai","North","South","East","West","All"]}/></Field>
      <Field label="Password"><Inp type="password" value={form.password||""} onChange={v=>setF("password",v)} placeholder="Set password"/></Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label="Add Member"/>
    </Modal>}

    {/* Approval Remark Modal */}
    {approvalModal&&<Modal title={approvalModal.decision==="Approved"?"Approve Quote":"Reject Quote"} onClose={()=>setApprovalModal(null)}>
      <div style={{marginBottom:16,padding:"12px 16px",background:approvalModal.decision==="Approved"?"rgba(200,240,210,0.4)":"rgba(254,226,226,0.4)",borderRadius:10,border:`1px solid ${approvalModal.decision==="Approved"?"#86efac":"#fca5a5"}`,fontSize:13}}>
        {approvalModal.decision==="Approved"?"✓ You are about to approve this quote.":"✗ You are about to reject this quote."}
      </div>
      <Field label="Remark (optional)">
        <Textarea value={remarkText} onChange={setRemarkText} placeholder="Add a comment or remark for this decision..." rows={4}/>
      </Field>
      <SaveBar onCancel={()=>setApprovalModal(null)} onSave={submitApproval} label={approvalModal.decision==="Approved"?"Confirm Approval":"Confirm Rejection"} danger={approvalModal.decision==="Rejected"}/>
    </Modal>}

    {confirmDel&&<Modal title="Delete Lead" onClose={()=>setConfirmDel(null)}>
      <p style={{fontSize:14}}>Delete lead <strong>{confirmDel.name}</strong> from <strong>{confirmDel.company}</strong>? This cannot be undone.</p>
      <SaveBar onCancel={()=>setConfirmDel(null)} onSave={()=>deleteLead(confirmDel.id)} label="Delete Lead" danger/>
    </Modal>}
  </div>;
}
