import { useState, useMemo, useEffect } from "react";

// ============================================================
// IMPORTANT: Your original code was TRUNCATED mid-component.
// The cut happened inside QuoteItemsEditor near the totals row.
// I have closed that component minimally so the project compiles.
// PASTE THE REMAINDER OF YOUR CODE BELOW the marker labelled
//   ▼▼▼  PASTE REMAINDER HERE  ▼▼▼
// and replace the placeholder App at the bottom of this file
// with your real App component (and `export default App;`).
// ============================================================

// -------------------- CONSTANTS --------------------
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

// -------------------- UI ATOMS --------------------
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
        {/* ⚠️ TRUNCATION POINT — your original code was cut off here, mid-style on the totals row.
            I closed it with a sensible default so the file compiles. Replace this block when you paste the full code. */}
        <div style={{fontSize:15,fontWeight:700,color:"#1a5c30",background:"rgba(200,240,210,0.6)",padding:"8px 16px",borderRadius:10}}>
          Total: {sym}{Number(total).toLocaleString()}
        </div>
      </div>
    </div>;
  }

// ============================================================
// ▼▼▼  PASTE REMAINDER OF YOUR CODE HERE  ▼▼▼
// (Any other helper components, the main App component, etc.)
// Then DELETE the placeholder App below and `export default`
// your real App component instead.
// ============================================================


// -------------------- PLACEHOLDER APP --------------------
// Remove this once you paste your real App component.
function App() {
  const [showModal, setShowModal] = useState(false);
  const [contacts, setContacts] = useState([{email:"",phone:"",label:"Work"}]);
  const [items, setItems] = useState([{sku:"",name:"",basePrice:0,qty:1,discount:0,finalPrice:0}]);

  return (
    <div style={{padding:"2rem",maxWidth:1100,margin:"0 auto"}}>
      <h1 style={{background:"linear-gradient(90deg,#3b1fa8,#6c3fc7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:32,marginBottom:8}}>
        Sales CRM — Project Skeleton
      </h1>
      <p style={{color:"#5a3abf",marginBottom:24}}>
        Project compiles ✅. Now paste the rest of your App code into <code>src/App.jsx</code>.
      </p>

      <div style={{background:"#fff8e1",border:"1.5px solid #f59e0b",padding:"16px 20px",borderRadius:12,marginBottom:24}}>
        <strong>⚠ Heads up:</strong> The code you sent was truncated mid-component (inside <code>QuoteItemsEditor</code>).
        I scaffolded the project with what you provided. Paste the remainder where marked in <code>App.jsx</code>,
        then replace this placeholder <code>App</code> with your real one.
      </div>

      <h2 style={{color:"#3b1fa8",marginTop:24}}>Provided components are working — quick demos:</h2>

      <div style={{display:"flex",gap:12,alignItems:"center",margin:"16px 0"}}>
        <Avatar name="Amit Sharma" size={48}/>
        <Avatar name="Priya Singh" size={48}/>
        <Avatar name="Rajan Mehta" size={48}/>
        <Badge color={stageColors.Proposal}>Proposal</Badge>
        <Badge color={statusColors.Qualified}>Qualified</Badge>
        <Badge color={qsColors.Approved}>Approved</Badge>
      </div>

      <button onClick={()=>setShowModal(true)} style={{padding:"10px 22px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#3b1fa8,#6c3fc7)",color:"#fff",fontWeight:600,cursor:"pointer",fontSize:14}}>
        Open demo modal
      </button>

      <div style={{marginTop:32,padding:20,background:"rgba(255,255,255,0.6)",borderRadius:12,border:"1px solid rgba(120,90,220,0.2)"}}>
        <h3 style={{color:"#3b1fa8",marginTop:0}}>Seed data loaded:</h3>
        <p>{INIT_USERS.length} users · {INIT_LEADS.length} leads · {INIT_OPPS.length} opportunities · {INIT_TASKS.length} tasks · {INIT_QUOTES.length} quotes</p>
      </div>

      {showModal && (
        <Modal title="Demo modal — ContactsEditor + QuoteItemsEditor" onClose={()=>setShowModal(false)} wide>
          <Field label="Contacts">
            <ContactsEditor value={contacts} onChange={setContacts}/>
          </Field>
          <Field label="Quote line items">
            <QuoteItemsEditor items={items} onChange={setItems} currencySymbol="₹"/>
          </Field>
          <SaveBar onCancel={()=>setShowModal(false)} onSave={()=>setShowModal(false)} label="Save"/>
        </Modal>
      )}
    </div>
  );
}

export default App;
