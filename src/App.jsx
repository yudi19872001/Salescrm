// Full App (overwrites previous src/App.jsx). Includes PricebookManager, dynamic
// pricebook support, AND all the tab/modal/detail rendering that was previously
// stubbed out. Also includes the missing LoginScreen component.

import { useState, useMemo, useRef } from "react";

const CURRENCIES = [
  {code:"AED",symbol:"د.إ",name:"UAE Dirham"},{code:"AFN",symbol:"؋",name:"Afghan Afghani"},{code:"ALL",symbol:"L",name:"Albanian Lek"},{code:"AMD",symbol:"֏",name:"Armenian Dram"},
  {code:"ANG",symbol:"ƒ",name:"Netherlands Antillean Guilder"},{code:"AOA",symbol:"Kz",name:"Angolan Kwanza"},{code:"ARS",symbol:"$",name:"Argentine Peso"},{code:"AUD",symbol:"A$",name:"Australian Dollar"},
  {code:"AWG",symbol:"ƒ",name:"Aruban Florin"},{code:"AZN",symbol:"₼",name:"Azerbaijani Manat"},{code:"BAM",symbol:"KM",name:"Bosnia-Herzegovina Convertible Mark"},{code:"BBD",symbol:"$",name:"Barbadian Dollar"},
  {code:"BDT",symbol:"৳",name:"Bangladeshi Taka"},{code:"BGN",symbol:"лв",name:"Bulgarian Lev"},{code:"BHD",symbol:"ب.د",name:"Bahraini Dinar"},{code:"BIF",symbol:"FBu",name:"Burundian Franc"},
  {code:"BMD",symbol:"$",name:"Bermudian Dollar"},{code:"BND",symbol:"B$",name:"Brunei Dollar"},{code:"BOB",symbol:"Bs.",name:"Bolivian Boliviano"},{code:"BRL",symbol:"R$",name:"Brazilian Real"},
  {code:"BSD",symbol:"$",name:"Bahamian Dollar"},{code:"BTN",symbol:"Nu.",name:"Bhutanese Ngultrum"},{code:"BWP",symbol:"P",name:"Botswana Pula"},{code:"BYN",symbol:"Br",name:"Belarusian Ruble"},
  {code:"BZD",symbol:"BZ$",name:"Belize Dollar"},{code:"CAD",symbol:"CA$",name:"Canadian Dollar"},{code:"CDF",symbol:"FC",name:"Congolese Franc"},{code:"CHF",symbol:"CHF",name:"Swiss Franc"},
  {code:"CLP",symbol:"$",name:"Chilean Peso"},{code:"CNY",symbol:"¥",name:"Chinese Yuan"},{code:"COP",symbol:"$",name:"Colombian Peso"},{code:"CRC",symbol:"₡",name:"Costa Rican Colón"},
  {code:"CUP",symbol:"$",name:"Cuban Peso"},{code:"CVE",symbol:"Esc",name:"Cape Verdean Escudo"},{code:"CZK",symbol:"Kč",name:"Czech Koruna"},{code:"DJF",symbol:"Fdj",name:"Djiboutian Franc"},
  {code:"DKK",symbol:"kr",name:"Danish Krone"},{code:"DOP",symbol:"RD$",name:"Dominican Peso"},{code:"DZD",symbol:"د.ج",name:"Algerian Dinar"},{code:"EGP",symbol:"£",name:"Egyptian Pound"},
  {code:"ERN",symbol:"Nfk",name:"Eritrean Nakfa"},{code:"ETB",symbol:"Br",name:"Ethiopian Birr"},{code:"EUR",symbol:"€",name:"Euro"},{code:"FJD",symbol:"FJ$",name:"Fijian Dollar"},
  {code:"FKP",symbol:"£",name:"Falkland Islands Pound"},{code:"GBP",symbol:"£",name:"British Pound"},{code:"GEL",symbol:"₾",name:"Georgian Lari"},{code:"GHS",symbol:"₵",name:"Ghanaian Cedi"},
  {code:"GIP",symbol:"£",name:"Gibraltar Pound"},{code:"GMD",symbol:"D",name:"Gambian Dalasi"},{code:"GNF",symbol:"FG",name:"Guinean Franc"},{code:"GTQ",symbol:"Q",name:"Guatemalan Quetzal"},
  {code:"GYD",symbol:"$",name:"Guyanese Dollar"},{code:"HKD",symbol:"HK$",name:"Hong Kong Dollar"},{code:"HNL",symbol:"L",name:"Honduran Lempira"},{code:"HRK",symbol:"kn",name:"Croatian Kuna"},
  {code:"HTG",symbol:"G",name:"Haitian Gourde"},{code:"HUF",symbol:"Ft",name:"Hungarian Forint"},{code:"IDR",symbol:"Rp",name:"Indonesian Rupiah"},{code:"ILS",symbol:"₪",name:"Israeli New Shekel"},
  {code:"INR",symbol:"₹",name:"Indian Rupee"},{code:"IQD",symbol:"ع.د",name:"Iraqi Dinar"},{code:"IRR",symbol:"﷼",name:"Iranian Rial"},{code:"ISK",symbol:"kr",name:"Icelandic Króna"},
  {code:"JMD",symbol:"J$",name:"Jamaican Dollar"},{code:"JOD",symbol:"د.ا",name:"Jordanian Dinar"},{code:"JPY",symbol:"¥",name:"Japanese Yen"},{code:"KES",symbol:"KSh",name:"Kenyan Shilling"},
  {code:"KGS",symbol:"лв",name:"Kyrgyzstani Som"},{code:"KHR",symbol:"៛",name:"Cambodian Riel"},{code:"KMF",symbol:"CF",name:"Comorian Franc"},{code:"KRW",symbol:"₩",name:"South Korean Won"},
  {code:"KWD",symbol:"د.ك",name:"Kuwaiti Dinar"},{code:"KYD",symbol:"$",name:"Cayman Islands Dollar"},{code:"KZT",symbol:"₸",name:"Kazakhstani Tenge"},{code:"LAK",symbol:"₭",name:"Lao Kip"},
  {code:"LBP",symbol:"ل.ل",name:"Lebanese Pound"},{code:"LKR",symbol:"Rs",name:"Sri Lankan Rupee"},{code:"LRD",symbol:"$",name:"Liberian Dollar"},{code:"LSL",symbol:"L",name:"Lesotho Loti"},
  {code:"LYD",symbol:"ل.د",name:"Libyan Dinar"},{code:"MAD",symbol:"د.م.",name:"Moroccan Dirham"},{code:"MDL",symbol:"L",name:"Moldovan Leu"},{code:"MGA",symbol:"Ar",name:"Malagasy Ariary"},
  {code:"MKD",symbol:"ден",name:"Macedonian Denar"},{code:"MMK",symbol:"K",name:"Myanmar Kyat"},{code:"MNT",symbol:"₮",name:"Mongolian Tögrög"},{code:"MOP",symbol:"MOP$",name:"Macanese Pataca"},
  {code:"MRU",symbol:"UM",name:"Mauritanian Ouguiya"},{code:"MUR",symbol:"₨",name:"Mauritian Rupee"},{code:"MVR",symbol:"Rf",name:"Maldivian Rufiyaa"},{code:"MWK",symbol:"MK",name:"Malawian Kwacha"},
  {code:"MXN",symbol:"$",name:"Mexican Peso"},{code:"MYR",symbol:"RM",name:"Malaysian Ringgit"},{code:"MZN",symbol:"MT",name:"Mozambican Metical"},{code:"NAD",symbol:"$",name:"Namibian Dollar"},
  {code:"NGN",symbol:"₦",name:"Nigerian Naira"},{code:"NIO",symbol:"C$",name:"Nicaraguan Córdoba"},{code:"NOK",symbol:"kr",name:"Norwegian Krone"},{code:"NPR",symbol:"Rs",name:"Nepalese Rupee"},
  {code:"NZD",symbol:"NZ$",name:"New Zealand Dollar"},{code:"OMR",symbol:"ر.ع.",name:"Omani Rial"},{code:"PAB",symbol:"B/.",name:"Panamanian Balboa"},{code:"PEN",symbol:"S/.",name:"Peruvian Sol"},
  {code:"PGK",symbol:"K",name:"Papua New Guinean Kina"},{code:"PHP",symbol:"₱",name:"Philippine Peso"},{code:"PKR",symbol:"₨",name:"Pakistani Rupee"},{code:"PLN",symbol:"zł",name:"Polish Złoty"},
  {code:"PYG",symbol:"Gs",name:"Paraguayan Guaraní"},{code:"QAR",symbol:"ر.ق",name:"Qatari Riyal"},{code:"RON",symbol:"lei",name:"Romanian Leu"},{code:"RSD",symbol:"дин",name:"Serbian Dinar"},
  {code:"RUB",symbol:"₽",name:"Russian Ruble"},{code:"RWF",symbol:"FRw",name:"Rwandan Franc"},{code:"SAR",symbol:"﷼",name:"Saudi Riyal"},{code:"SBD",symbol:"SI$",name:"Solomon Islands Dollar"},
  {code:"SCR",symbol:"₨",name:"Seychellois Rupee"},{code:"SDG",symbol:"ج.س.",name:"Sudanese Pound"},{code:"SEK",symbol:"kr",name:"Swedish Krona"},{code:"SGD",symbol:"S$",name:"Singapore Dollar"},
  {code:"SHP",symbol:"£",name:"Saint Helena Pound"},{code:"SLL",symbol:"Le",name:"Sierra Leonean Leone"},{code:"SOS",symbol:"S",name:"Somali Shilling"},{code:"SRD",symbol:"$",name:"Surinamese Dollar"},
  {code:"SSP",symbol:"£",name:"South Sudanese Pound"},{code:"STN",symbol:"Db",name:"São Tomé and Príncipe Dobra"},{code:"SVC",symbol:"₡",name:"Salvadoran Colón"},{code:"SYP",symbol:"£",name:"Syrian Pound"},
  {code:"SZL",symbol:"L",name:"Swazi Lilangeni"},{code:"THB",symbol:"฿",name:"Thai Baht"},{code:"TJS",symbol:"SM",name:"Tajikistani Somoni"},{code:"TMT",symbol:"T",name:"Turkmenistani Manat"},
  {code:"TND",symbol:"د.ت",name:"Tunisian Dinar"},{code:"TOP",symbol:"T$",name:"Tongan Paʻanga"},{code:"TRY",symbol:"₺",name:"Turkish Lira"},{code:"TTD",symbol:"TT$",name:"Trinidad and Tobago Dollar"},
  {code:"TWD",symbol:"NT$",name:"New Taiwan Dollar"},{code:"TZS",symbol:"TSh",name:"Tanzanian Shilling"},{code:"UAH",symbol:"₴",name:"Ukrainian Hryvnia"},{code:"UGX",symbol:"USh",name:"Ugandan Shilling"},
  {code:"USD",symbol:"$",name:"US Dollar"},{code:"UYU",symbol:"$U",name:"Uruguayan Peso"},{code:"UZS",symbol:"so'm",name:"Uzbekistani Soʻm"},{code:"VES",symbol:"Bs.S",name:"Venezuelan Bolívar Soberano"},
  {code:"VND",symbol:"₫",name:"Vietnamese Dong"},{code:"VUV",symbol:"VT",name:"Vanuatu Vatu"},{code:"WST",symbol:"WS$",name:"Samoan Tala"},{code:"XAF",symbol:"FCFA",name:"CFA Franc BEAC"},
  {code:"XCD",symbol:"EC$",name:"East Caribbean Dollar"},{code:"XOF",symbol:"CFA",name:"CFA Franc BCEAO"},{code:"XPF",symbol:"CFPF",name:"CFP Franc"},{code:"YER",symbol:"﷼",name:"Yemeni Rial"},
  {code:"ZAR",symbol:"R",name:"South African Rand"},{code:"ZMW",symbol:"ZK",name:"Zambian Kwacha"},{code:"ZWL",symbol:"ZWL$",name:"Zimbabwean Dollar"}
];

const DEFAULT_PRICEBOOK = [
  {sku:"SKU-001",name:"CRM Starter",    category:"Software",basePrice:25000},
  {sku:"SKU-002",name:"CRM Professional",category:"Software",basePrice:75000},
  {sku:"SKU-003",name:"CRM Enterprise",  category:"Software",basePrice:200000},
  {sku:"SKU-004",name:"Analytics Module",category:"Add-on",  basePrice:40000},
  {sku:"SKU-005",name:"AI Insights Pack",category:"Add-on",  basePrice:60000},
  {sku:"SKU-006",name:"Implementation",  category:"Service", basePrice:50000},
  {sku:"SKU-007",name:"Training (5 days)",category:"Service", basePrice:30000},
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

// ---------- Pricebook helpers ----------
function parseCSV(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l);
  if (!lines.length) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g,''));
  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g,''));
    const obj = {};
    headers.forEach((h,i) => obj[h] = cols[i] ?? '');
    return {
      sku: (obj.sku || obj.SKU || '').trim(),
      name: (obj.name || obj.Name || '').trim(),
      category: (obj.category || obj.Category || '').trim(),
      basePrice: Number(obj.basePrice || obj.base_price || obj.price || 0)
    };
  }).filter(r => r.sku);
}

function PricebookManager({ pricebook, setPricebook }) {
  const fileInputRef = useRef(null);
  const openPicker = () => fileInputRef.current?.click();
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        if (f.name.toLowerCase().endsWith('.json')) {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            const normalized = data.map(d => ({
              sku: String(d.sku||d.SKU||'').trim(),
              name: d.name||d.Name||'',
              category: d.category||'',
              basePrice: Number(d.basePrice||d.price||0)
            })).filter(r => r.sku);
            setPricebook(prev => {
              const map = Object.fromEntries(prev.map(p => [p.sku, p]));
              normalized.forEach(n => map[n.sku] = n);
              return Object.values(map);
            });
            return;
          }
        }
        const csv = parseCSV(text);
        if (csv.length) {
          setPricebook(prev => {
            const map = Object.fromEntries(prev.map(p => [p.sku, p]));
            csv.forEach(n => map[n.sku] = n);
            return Object.values(map);
          });
          return;
        }
        alert('Uploaded file parsed no SKUs. Ensure file is a JSON array or CSV with headers sku,name,category,basePrice.');
      } catch (err) {
        alert('Error parsing file: ' + err.message);
      }
    };
    reader.readAsText(f);
    e.target.value = '';
  };
  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(pricebook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'pricebook.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const resetDefault = () => {
    if (confirm('Reset pricebook to default bundled items?')) setPricebook(DEFAULT_PRICEBOOK);
  };

  const btnStyle = {padding:"7px 12px",borderRadius:8,border:"1.5px solid rgba(120,90,220,.35)",background:"rgba(245,242,255,.7)",color:"#3b1fa8",fontWeight:600,fontSize:12,cursor:"pointer"};

  return (
    <div style={{display:'flex',gap:8,alignItems:'center'}}>
      <input ref={fileInputRef} type="file" accept=".csv,.json" style={{display:'none'}} onChange={onFile} />
      <button onClick={openPicker} style={btnStyle} title="Upload CSV/JSON pricebook">⬆ Upload</button>
      <button onClick={downloadJson} style={btnStyle} title="Download current pricebook">⬇ Export</button>
      <button onClick={resetDefault} style={btnStyle} title="Reset to default">↻ Reset</button>
    </div>
  );
}

// ---------- Roles & Permissions ----------
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
  ASM:{viewAllRecords:false,editRecords:true, deleteRecords:false,createLeads:true, viewReports:false,viewPipeline:true, viewAllUsers:false,manageUsers:false,manageRoles:false,createQuotes:true, approveQuotes:false, finalApprove:false},
  RSM:{viewAllRecords:true, editRecords:true, deleteRecords:false,createLeads:true, viewReports:true, viewPipeline:true, viewAllUsers:false,manageUsers:false,manageRoles:false,createQuotes:true, approveQuotes:true, finalApprove:false},
  NSM:{viewAllRecords:true, editRecords:true, deleteRecords:true, createLeads:true, viewReports:true, viewPipeline:true, viewAllUsers:true, manageUsers:false,manageRoles:false,createQuotes:true, approveQuotes:true, finalApprove:false},
  MM: {viewAllRecords:true, editRecords:true, deleteRecords:false,createLeads:false,viewReports:true, viewPipeline:false,viewAllUsers:true, manageUsers:false,manageRoles:false,createQuotes:false, approveQuotes:false, finalApprove:false},
  CEM:{viewAllRecords:true, editRecords:true, deleteRecords:false,createLeads:false,viewReports:true, viewPipeline:false,viewAllUsers:true, manageUsers:false,manageRoles:true, createQuotes:false, approveQuotes:false, finalApprove:false},
  DIR:{viewAllRecords:true, editRecords:true, deleteRecords:true, createLeads:false,viewReports:true, viewPipeline:true, viewAllUsers:true, manageUsers:true, manageRoles:true, createQuotes:true, approveQuotes:true, finalApprove:true},
};

// ---------- UI atoms ----------
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
    style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:disabled?"#f0f0f0":"rgba(245,242,255,0.8)"}}/>;
}
function Sel({value,onChange,options,disabled=false}){
  return <select value={value||""} onChange={e=>onChange(e.target.value)} disabled={disabled}
    style={{width:"100%",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:disabled?"#f0f0f0":"rgba(245,242,255,0.8)"}}>
    {options.map(o=><option key={Array.isArray(o)?o[0]:o} value={Array.isArray(o)?o[0]:o}>{Array.isArray(o)?o[1]:o}</option>)}
  </select>;
}
function Textarea({value,onChange,placeholder,rows=3}){
  return <textarea value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,color:"#1a0a40",background:"rgba(245,242,255,0.8)"}}/>;
}
function SaveBar({onCancel,onSave,label,danger=false}){
  return <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:20,paddingTop:16,borderTop:"1.5px solid rgba(180,160,255,0.25)"}}>
    <button onClick={onCancel} style={{padding:"9px 20px",borderRadius:10,border:"1.5px solid rgba(120,90,220,0.35)",background:"rgba(245,242,255,0.7)",color:"#3b1fa8",fontWeight:600,cursor:"pointer"}}>Cancel</button>
    <button onClick={onSave} style={{padding:"9px 20px",borderRadius:10,border:"none",background:danger?"linear-gradient(135deg,#dc2626,#b91c1c)":"linear-gradient(135deg,#3b1fa8,#6c3fc7)",color:"#fff",fontWeight:700,cursor:"pointer"}}>{label}</button>
  </div>;
}
function Modal({title,onClose,children,wide=false}){
  return <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"rgba(10,15,40,0.75)",backdropFilter:"blur(6px)",overflowY:"auto",padding:"40px 20px"}}>
    <div style={{width:"100%",maxWidth:wide?840:580,padding:"2rem",borderRadius:20,background:"linear-gradient(160deg,rgba(255,255,255,0.98),rgba(235,240,255,0.96))",border:"1.5px solid rgba(255,255,255,0.9)",boxShadow:"0 10px 40px rgba(10,10,30,0.45)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,paddingBottom:16,borderBottom:"1.5px solid rgba(180,160,255,0.25)"}}>
        <h3 style={{margin:0,fontSize:18,fontWeight:700,background:"linear-gradient(90deg,#3b1fa8,#6c3fc7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(180,160,255,0.18)",border:"1px solid rgba(140,100,255,0.25)",fontSize:18,cursor:"pointer",color:"#5a3abf",width:34,height:34,borderRadius:8}}>×</button>
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
          <select value={c.label} onChange={e=>upd(i,"label",e.target.value)} style={{flex:1,padding:"6px 10px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:8,fontSize:12}}>
            {labelOptions.map(l=><option key={l}>{l}</option>)}
          </select>
          {value.length>1&&<button onClick={()=>rm(i)} style={{background:"#fee2e2",border:"none",color:"#b91c1c",borderRadius:6,width:26,height:26,cursor:"pointer",fontSize:14}}>×</button>}
        </div>
        <input value={c.email} onChange={e=>upd(i,"email",e.target.value)} placeholder="Email" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8,marginBottom:8}}/>
        <input value={c.phone} onChange={e=>upd(i,"phone",e.target.value)} placeholder="Phone" style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8}}/>
      </div>
    ))}
    <button onClick={add} style={{width:"100%",padding:"8px",border:"1.5px dashed rgba(120,90,220,0.4)",borderRadius:10,background:"transparent",color:"#5a3abf",fontSize:13,cursor:"pointer",fontWeight:600}}>+ Add contact</button>
  </div>;
}

// ---------- QuoteItemsEditor (uses dynamic pricebook) ----------
function QuoteItemsEditor({ items, onChange, currencySymbol, pricebook }) {
  const sym = currencySymbol || "₹";
  const calc = (base, qty, disc) => Math.round((+base||0)*(+qty||1)*(1-(+disc||0)/100));
  const add = () => onChange([...items, { sku: "", name: "", basePrice: 0, qty: 1, discount: 0, finalPrice: 0 }]);
  const rm = i => onChange(items.filter((_, j) => j !== i));
  const pickSku = (i, skuCode) => {
    const p = (pricebook || DEFAULT_PRICEBOOK).find(p => p.sku === skuCode);
    if (!p) return;
    onChange(items.map((it, j) => j !== i ? it : { ...it, sku: p.sku, name: p.name, basePrice: p.basePrice, finalPrice: calc(p.basePrice, it.qty, it.discount) }));
  };
  const upd = (i, field, val) => {
    onChange(items.map((it, j) => {
      if (j !== i) return it;
      const n = { ...it, [field]: val };
      n.finalPrice = calc(n.basePrice, n.qty, n.discount);
      return n;
    }));
  };
  const total = items.reduce((s, it) => s + (+it.finalPrice || 0), 0);
  return <div>
    {items.map((it, i) => (
      <div key={i} style={{border:"1px solid rgba(120,90,220,0.2)",borderRadius:10,padding:"12px",marginBottom:10,background:"rgba(245,242,255,0.4)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>SKU</div>
            <select value={it.sku} onChange={e=>pickSku(i,e.target.value)} style={{width:"100%",padding:"8px 10px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:8,fontSize:13}}>
              <option value="">-- Select SKU --</option>
              {(pricebook || DEFAULT_PRICEBOOK).map(p=> <option key={p.sku} value={p.sku}>{p.sku} — {p.name}</option>)}
            </select>
          </div>
          <div><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>Product Name</div>
            <input value={it.name} onChange={e=>upd(i,"name",e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8}}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:8,alignItems:"end"}}>
          {[["SKU Price",it.basePrice,"basePrice"],["Qty",it.qty,"qty"],["Disc %",it.discount,"discount"]].map(([lbl,val,key])=>(
            <div key={key}><div style={{fontSize:11,color:"#3b1fa8",fontWeight:600,marginBottom:4}}>{lbl}</div>
              <input type="number" value={val} onChange={e=>upd(i,key,e.target.value)} style={{width:"100%",boxSizing:"border-box",padding:"8px 10px",border:"1.5px solid rgba(120,90,220,0.25)",borderRadius:8}}/>
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
      <button onClick={add} style={{padding:"8px 16px",border:"1.5px dashed rgba(120,90,220,0.4)",borderRadius:10,background:"transparent",color:"#5a3abf",fontSize:13,cursor:"pointer",fontWeight:600}}>+ Add Item</button>
      <div style={{fontSize:15,fontWeight:700,color:"#1a5c30",background:"rgba(200,240,210,0.5)",padding:"6px 16px",borderRadius:10}}>Total: {sym}{total.toLocaleString()}</div>
    </div>
  </div>;
}

// ---------- LoginScreen (was missing — added) ----------
function LoginScreen({ onLogin, roles, users }) {
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [err,setErr]=useState("");
  const submit=()=>{
    const u=users.find(x=>x.email.toLowerCase()===email.trim().toLowerCase()&&x.password===pwd);
    if(!u){setErr("Invalid email or password");return;}
    onLogin(u);
  };
  const onKey=e=>{ if(e.key==="Enter") submit(); };
  return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg,#1a0a40 0%,#3b1fa8 50%,#6c3fc7 100%)",padding:20,fontFamily:"sans-serif"}}>
    <div style={{width:"100%",maxWidth:440,padding:"2.5rem",borderRadius:24,background:"linear-gradient(160deg,rgba(255,255,255,0.98),rgba(235,240,255,0.96))",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:28,fontWeight:800,background:"linear-gradient(90deg,#3b1fa8,#6c3fc7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SalesFlow CRM</div>
        <div style={{fontSize:13,color:"#5a3abf",marginTop:4}}>Sales Intelligence Platform</div>
      </div>
      <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={onKey} placeholder="amit@sf.in" style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,background:"rgba(245,242,255,0.8)"}}/></Field>
      <Field label="Password"><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} onKeyDown={onKey} placeholder="••••••" style={{width:"100%",boxSizing:"border-box",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10,fontSize:14,background:"rgba(245,242,255,0.8)"}}/></Field>
      {err&&<div style={{background:"#fee2e2",color:"#b91c1c",padding:"8px 12px",borderRadius:8,fontSize:13,marginBottom:14}}>{err}</div>}
      <button onClick={submit} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#3b1fa8,#6c3fc7)",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",marginTop:6}}>Sign In</button>
      <div style={{marginTop:20,padding:"12px 14px",background:"rgba(120,90,220,0.08)",borderRadius:10,fontSize:11,color:"#5a3abf"}}>
        <div style={{fontWeight:700,marginBottom:6}}>Demo accounts</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"4px 12px",fontFamily:"monospace"}}>
          <div>amit@sf.in / amit123</div><div>ASM</div>
          <div>rajan@sf.in / rajan123</div><div>RSM</div>
          <div>vikram@sf.in / vikram123</div><div>NSM</div>
          <div>priya@sf.in / priya123</div><div>Director</div>
        </div>
      </div>
    </div>
  </div>;
}

// ---------- Root App ----------
export default function App(){
  const [roles,setRoles]=useState(DEFAULT_ROLES);
  const [permSets,setPermSets]=useState(DEFAULT_PERM_SETS);
  const [users,setUsers]=useState([
    {id:1,name:"Amit Sharma",  roleId:"ASM",region:"Delhi", email:"amit@sf.in",   password:"amit123",  managerId:3},
    {id:2,name:"Sneha Kapoor", roleId:"ASM",region:"Mumbai",email:"sneha@sf.in",  password:"sneha123", managerId:4},
    {id:3,name:"Rajan Mehta",  roleId:"RSM",region:"North", email:"rajan@sf.in",  password:"rajan123", managerId:5},
    {id:4,name:"Divya Iyer",   roleId:"RSM",region:"West",  email:"divya@sf.in",  password:"divya123", managerId:5},
    {id:5,name:"Vikram Nair",  roleId:"NSM",region:"All",   email:"vikram@sf.in", password:"vikram123",managerId:8},
    {id:6,name:"Meera Das",    roleId:"MM", region:"All",   email:"meera@sf.in",  password:"meera123", managerId:8},
    {id:7,name:"Saurabh Joshi",roleId:"CEM",region:"All",   email:"saurabh@sf.in",password:"saurabh123",managerId:8},
    {id:8,name:"Priya Singh",  roleId:"DIR",region:"All",   email:"priya@sf.in",  password:"priya123", managerId:null},
  ]);
  const [currentUser,setCurrentUser]=useState(null);

  const [pricebook, setPricebook] = useState(DEFAULT_PRICEBOOK);

  const handleSaveRole=(id,roleDef,perms)=>{
    if(!roleDef){setRoles(p=>p.filter(r=>r.id!==id));setPermSets(p=>{const n={...p};delete n[id];return n;});}
    else{setRoles(p=>{const ex=p.find(r=>r.id===id);return ex?p.map(r=>r.id===id?roleDef:r):[...p,roleDef];});setPermSets(p=>({...p,[id]:perms}));}
  };
  if(!currentUser) return <LoginScreen onLogin={setCurrentUser} roles={roles} users={users}/>;
  return <CRM user={currentUser} onLogout={()=>setCurrentUser(null)} roles={roles} permSets={permSets} setPermSets={setPermSets} users={users} setUsers={setUsers} onSaveRole={handleSaveRole} pricebook={pricebook} setPricebook={setPricebook}/>;
}

// ---------- CRM ----------
function CRM({user,onLogout,roles,permSets,setPermSets,users,setUsers,onSaveRole,pricebook,setPricebook}){
  const perm=permSets[user.roleId]||{};
  const role=roles.find(r=>r.id===user.roleId)||{label:"Unknown",color:"#e0e0e0",level:0};
  const tabs=tabsFromPerms(perm);
  const [tab,setTab]=useState("dashboard");
  const [leads,setLeads]=useState([
    {id:1,name:"Priya Sharma", company:"TechNova",status:"New",      source:"Web",      owner:"Amit Sharma", region:"Delhi", created:"2026-04-10",contacts:[{email:"priya@technova.in",  phone:"+91 9812345678",label:"Work"}]},
    {id:2,name:"Arjun Mehta",  company:"Growfast", status:"Contacted",source:"Referral", owner:"Sneha Kapoor",region:"Mumbai",created:"2026-04-14",contacts:[{email:"arjun@growfast.io",  phone:"+91 9823456789",label:"Work"}]},
    {id:3,name:"Neha Kapoor",  company:"Cloudbase",status:"Qualified",source:"LinkedIn", owner:"Amit Sharma", region:"Delhi", created:"2026-04-18",contacts:[{email:"neha@cloudbase.com", phone:"+91 9876543210",label:"Work"}]},
    {id:4,name:"Rahul Joshi",  company:"DataSync", status:"New",      source:"Email",    owner:"Sneha Kapoor",region:"Mumbai",created:"2026-04-22",contacts:[{email:"rahul@datasync.in",  phone:"+91 9765432109",label:"Work"}]},
  ]);
  const [opps,setOpps]=useState([
    {id:1,name:"TechNova CRM Deal",        account:"TechNova",value:450000,stage:"Proposal",     close:"2026-06-30",owner:"Amit Sharma", region:"Delhi", probability:60},
    {id:2,name:"Growfast Platform Upgrade", account:"Growfast", value:280000,stage:"Qualification",close:"2026-07-15",owner:"Sneha Kapoor",region:"Mumbai",probability:30},
    {id:3,name:"Cloudbase Enterprise",      account:"Cloudbase",value:900000,stage:"Negotiation",  close:"2026-05-31",owner:"Rajan Mehta", region:"North", probability:80},
    {id:4,name:"DataSync Analytics Suite",  account:"DataSync", value:175000,stage:"Prospecting",  close:"2026-08-01",owner:"Divya Iyer",  region:"West",  probability:15},
  ]);
  const [tasks,setTasks]=useState([
    {id:1,title:"Follow up with Priya Sharma",type:"Call",   due:"2026-05-05",status:"Open",owner:"Amit Sharma", related:"TechNova CRM Deal"},
    {id:2,title:"Send proposal to Cloudbase",  type:"Email",  due:"2026-05-04",status:"Open",owner:"Rajan Mehta", related:"Cloudbase Enterprise"},
    {id:3,title:"Demo for Growfast",           type:"Meeting",due:"2026-05-06",status:"Open",owner:"Sneha Kapoor",related:"Growfast Platform Upgrade"},
  ]);
  const [quotes,setQuotes]=useState([
    {id:1,quoteNo:"QT-0001",name:"TechNova CRM Q1",lead:"Priya Sharma",opportunity:"TechNova CRM Deal",channelPartner:"TechBridge Solutions",poNumber:"PO-2026-001",currency:"INR",status:"Approved",owner:"Amit Sharma",
      approvals:[{userId:3,role:"RSM",user:"Rajan Mehta",status:"Approved",date:"2026-04-28",remark:"Good deal"},{userId:5,role:"NSM",user:"Vikram Nair",status:"Approved",date:"2026-04-29",remark:"Looks fine"}],
      items:[{sku:"SKU-002",name:"CRM Professional",basePrice:75000,qty:3,discount:10,finalPrice:202500},{sku:"SKU-006",name:"Implementation",basePrice:50000,qty:1,discount:0,finalPrice:50000}]},
    {id:2,quoteNo:"QT-0002",name:"Cloudbase Enterprise Q1",lead:"Neha Kapoor",opportunity:"Cloudbase Enterprise",channelPartner:"CloudNet Partners",poNumber:"",currency:"USD",status:"Pending Approval",owner:"Amit Sharma",
      approvals:[{userId:3,role:"RSM",user:"Rajan Mehta",status:"Approved",date:"2026-05-01",remark:"Looks good"},{userId:5,role:"NSM",user:"Vikram Nair",status:"Pending",date:"",remark:""}],
      items:[{sku:"SKU-003",name:"CRM Enterprise",basePrice:200000,qty:1,discount:15,finalPrice:170000},{sku:"SKU-005",name:"AI Insights Pack",basePrice:60000,qty:1,discount:5,finalPrice:57000}]},
  ]);
  const [search,setSearch]=useState("");
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const [detail,setDetail]=useState(null);
  const [editTarget,setEditTarget]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [approvalModal,setApprovalModal]=useState(null);
  const [remarkText,setRemarkText]=useState("");

  const canSeeAll=perm.viewAllRecords;
  const mine=arr=>canSeeAll?arr:arr.filter(r=>r.owner===user.name);
  const sf=(arr,fields)=>arr.filter(r=>!search||fields.some(f=>String(r[f]||"").toLowerCase().includes(search.toLowerCase())));
  const currSym=code=>(CURRENCIES.find(c=>c.code===code)||{symbol:"₹"}).symbol;

  const openNew=(type,defs={})=>{setModal(type);setEditTarget(null);setForm({contacts:[{email:"",phone:"",label:"Work"}],owner:user.name,...defs});};
  const openEdit=(type,item)=>{setForm({...item});setModal(type);setEditTarget(item.id);};
  const closeModal=()=>{setModal(null);setForm({});setEditTarget(null);};
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));

  const buildApprovalChain=(ownerUserId)=>{
    const chain=[];
    const visited=new Set();
    let curId=ownerUserId;
    let depth=0;
    while(curId&&depth<10){
      const u=users.find(x=>x.id===curId);
      if(!u||visited.has(u.id))break;
      visited.add(u.id);
      const p=permSets[u.roleId]||{};
      if(p.approveQuotes||p.finalApprove){
        chain.push({userId:u.id,role:u.roleId,user:u.name,status:"Pending",date:"",remark:""});
      }
      curId=u.managerId;
      depth++;
    }
    return chain;
  };

  const saveItem=()=>{
    if(modal==="lead"){
      const c={...form,contacts:(form.contacts||[]).filter(x=>x.email||x.phone),region:form.region||user.region};
      if(editTarget)setLeads(p=>p.map(l=>l.id===editTarget?{...l,...c}:l));
      else setLeads(p=>[...p,{...c,id:Date.now(),created:new Date().toISOString().slice(0,10)}]);
    }
    if(modal==="opp"){const c={...form,region:form.region||user.region};if(editTarget)setOpps(p=>p.map(o=>o.id===editTarget?{...o,...c,value:+c.value||0,probability:+c.probability||0}:o));else setOpps(p=>[...p,{...c,id:Date.now(),value:+c.value||0,probability:+c.probability||0}]);}
    if(modal==="task"){if(editTarget)setTasks(p=>p.map(t=>t.id===editTarget?{...t,...form}:t));else setTasks(p=>[...p,{...form,id:Date.now(),status:form.status||"Open"}]);}
    if(modal==="quote"){
      const ownerUser=users.find(u=>u.name===(form.owner||user.name))||user;
      const chain=buildApprovalChain(ownerUser.id);
      const newId = Date.now();
      const q={...form,id:newId,quoteNo:"QT-"+String(quotes.length+1).padStart(4,"0"),status:chain.length>0?"Pending Approval":"Approved",approvals:chain,region:user.region,items:form.items||[]};
      setQuotes(p=>[...p,q]);
    }
    if(modal==="user"){
      if(editTarget)setUsers(p=>p.map(u=>u.id===editTarget?{...u,...form,managerId:form.managerId?+form.managerId:null}:u));
      else setUsers(p=>[...p,{...form,id:Date.now(),password:form.password||"pass123",managerId:form.managerId?+form.managerId:null}]);
    }
    if(modal==="role"){
      const id=(form.id||"").trim().toUpperCase();
      if(!id){alert("Role ID required");return;}
      const roleDef={id,label:form.label||id,level:+form.level||1,color:form.color||"#e0e0e0",canBeDeleted:form.canBeDeleted!==false};
      const perms={};
      ALL_PERMS.forEach(p=>perms[p.key]=!!form["perm_"+p.key]);
      onSaveRole(id,roleDef,perms);
    }
    closeModal();
  };

  const deleteLead=id=>{setLeads(p=>p.filter(l=>l.id!==id));setConfirmDel(null);setDetail(null);};
  const deleteOpp=id=>{setOpps(p=>p.filter(o=>o.id!==id));setConfirmDel(null);setDetail(null);};
  const deleteUser=id=>{setUsers(p=>p.filter(u=>u.id!==id));setConfirmDel(null);};
  const deleteRole=id=>{onSaveRole(id,null,null);setConfirmDel(null);};
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
      const freshQuote=updated.find(q=>q.id===quoteId);
      if(freshQuote&&detail?.type==="quote"){
        setTimeout(()=>setDetail({type:"quote",data:freshQuote}),0);
      }
      return updated;
    });
    setApprovalModal(null);
    setRemarkText("");
  };

  const mLeads=mine(leads);const mOpps=mine(opps);const mTasks=mine(tasks);const mQuotes=mine(quotes);
  const totalPipeline=mOpps.filter(o=>!["Closed Won","Closed Lost"].includes(o.stage)).reduce((s,o)=>s+o.value,0);
  const won=mOpps.filter(o=>o.stage==="Closed Won").reduce((s,o)=>s+o.value,0);
  const stageData=STAGES.slice(0,4).map(s=>({stage:s,val:mOpps.filter(o=>o.stage===s).reduce((a,b)=>a+b.value,0)}));
  const maxVal=Math.max(...stageData.map(s=>s.val),1);
  const pendingApproval=quotes.filter(q=>q.status==="Pending Approval"&&q.approvals?.some(a=>a.status==="Pending"&&a.userId===user.id)).length;
  const safeTab=tabs.includes(tab)?tab:tabs[0];

  const repByUser=useMemo(()=>{const map={};opps.forEach(o=>{if(!map[o.owner])map[o.owner]={name:o.owner,total:0,won:0,count:0};map[o.owner].total+=o.value;map[o.owner].count++;if(o.stage==="Closed Won")map[o.owner].won+=o.value;});return Object.values(map);},[opps]);

  const liveQuoteDetail=useMemo(()=> detail?.type==="quote"?quotes.find(q=>q.id===detail.data.id)||null:null ,[quotes,detail]);

  // ---- common button styles ----
  const btnPrimary={padding:"7px 14px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#3b1fa8,#6c3fc7)",color:"#fff",fontWeight:600,fontSize:13,cursor:"pointer"};
  const btnGhost={padding:"6px 12px",borderRadius:8,border:"1.5px solid rgba(120,90,220,.35)",background:"rgba(245,242,255,.7)",color:"#3b1fa8",fontWeight:600,fontSize:12,cursor:"pointer"};
  const card={background:"#fff",border:"1px solid #e7e2f4",borderRadius:12,padding:"14px 16px",marginBottom:10,cursor:"pointer",transition:"box-shadow .15s"};

  return <div style={{display:"flex",height:"100vh",fontFamily:"sans-serif",fontSize:14,color:"#1a0a40"}}>
    {/* Sidebar */}
    <div style={{width:210,background:"#1a2340",color:"#c8d3f0",display:"flex",flexDirection:"column",flexShrink:0}}>
      <div style={{padding:"1.25rem 1rem 1rem",borderBottom:"0.5px solid #2e3a5c"}}>
        <div style={{fontSize:15,fontWeight:600,color:"#fff"}}>SalesFlow CRM</div>
        <div style={{fontSize:11,color:"#7a8bbf",marginTop:2}}>Sales Intelligence</div>
      </div>
      <div style={{padding:"0.5rem",flex:1,overflowY:"auto"}}>
        {tabs.map(t=><div key={t} onClick={()=>{setTab(t);setDetail(null);setSearch("");}} style={{padding:"8px 12px",borderRadius:6,cursor:"pointer",marginBottom:2,background:safeTab===t?"#2e3a5c":"transparent",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>{TAB_LABELS[t]}</span>
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
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:"#eef0fb"}}>
      <div style={{background:"#fff",borderBottom:"0.5px solid #e7e2f4",padding:"0 1.25rem",height:52,display:"flex",alignItems:"center",gap:12}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{padding:"7px 12px",border:"1.5px solid rgba(120,90,220,.3)",borderRadius:8,fontSize:13,background:"rgba(245,242,255,.8)",width:220}}/>
        <div style={{flex:1}}/>
        {!canSeeAll&&<Badge color="#f4c0d1">My Records</Badge>}
        {canSeeAll&&<Badge color="#c0dd97">All Records</Badge>}
        {safeTab==="leads"&&perm.createLeads&&<button onClick={()=>openNew("lead",{status:"New",source:"Web"})} style={btnPrimary}>+ New Lead</button>}
        {safeTab==="opportunities"&&perm.viewPipeline&&perm.editRecords&&<button onClick={()=>openNew("opp",{stage:"Prospecting",probability:10})} style={btnPrimary}>+ New Opportunity</button>}
        {safeTab==="tasks"&&<button onClick={()=>openNew("task",{type:"Call",status:"Open"})} style={btnPrimary}>+ New Task</button>}
        {safeTab==="quotes"&&perm.createQuotes&&<button onClick={()=>openNew("quote",{currency:"INR",items:[]})} style={btnPrimary}>+ New Quote</button>}
        {safeTab==="team"&&perm.manageUsers&&<button onClick={()=>openNew("user",{roleId:roles[0]?.id,region:"Delhi"})} style={btnPrimary}>+ Add User</button>}
        {safeTab==="roles"&&perm.manageRoles&&<button onClick={()=>openNew("role",{id:"",label:"",level:1,color:"#b5d4f4",canBeDeleted:true})} style={btnPrimary}>+ New Role</button>}
        <div style={{marginLeft:8}}><PricebookManager pricebook={pricebook} setPricebook={setPricebook} /></div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"1.25rem",display:"flex",gap:16}}>
        {/* MAIN CONTENT AREA */}
        <div style={{flex:1,minWidth:0}}>

          {/* DASHBOARD */}
          {safeTab==="dashboard"&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:22,fontWeight:700}}>Welcome back, {user.name.split(" ")[0]} 👋</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:18}}>
              {[
                {label:"My Leads",val:mLeads.length,color:"#b5d4f4"},
                {label:"Active Pipeline",val:fmt(totalPipeline),color:"#9fe1cb"},
                {label:"Closed Won",val:fmt(won),color:"#c0dd97"},
                {label:"Open Tasks",val:mTasks.filter(t=>t.status!=="Done").length,color:"#fac775"},
              ].map(k=><div key={k.label} style={{background:"#fff",border:"1px solid #e7e2f4",borderRadius:12,padding:"14px 16px"}}>
                <div style={{fontSize:11,color:"#7a6db5",textTransform:"uppercase",letterSpacing:".05em",fontWeight:700,marginBottom:6}}>{k.label}</div>
                <div style={{fontSize:24,fontWeight:800,color:"#1a0a40"}}>{k.val}</div>
                <div style={{height:4,background:k.color,borderRadius:2,marginTop:10}}/>
              </div>)}
            </div>

            <div style={{background:"#fff",border:"1px solid #e7e2f4",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:14,color:"#3b1fa8"}}>Pipeline by Stage</div>
              {stageData.map(s=><div key={s.stage} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                  <span style={{fontWeight:600}}>{s.stage}</span>
                  <span>{fmt(s.val)}</span>
                </div>
                <div style={{height:10,background:"#f0ecfc",borderRadius:5,overflow:"hidden"}}>
                  <div style={{width:(s.val/maxVal*100)+"%",height:"100%",background:stageColors[s.stage]}}/>
                </div>
              </div>)}
            </div>

            <div style={{background:"#fff",border:"1px solid #e7e2f4",borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:10,color:"#3b1fa8"}}>Recent Tasks</div>
              {mTasks.slice(0,5).map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:"1px solid #f0ecfc"}}>
                <span style={{fontSize:18}}>{taskTypeIcon[t.type]}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,textDecoration:t.status==="Done"?"line-through":"none",color:t.status==="Done"?"#999":"#1a0a40"}}>{t.title}</div>
                  <div style={{fontSize:11,color:"#7a6db5"}}>{t.related} · Due {t.due}</div>
                </div>
                <Badge color={t.status==="Done"?"#c0dd97":"#fac775"}>{t.status}</Badge>
              </div>)}
              {mTasks.length===0&&<div style={{color:"#7a6db5",fontSize:13,padding:"8px 0"}}>No tasks.</div>}
            </div>
          </div>}

          {/* LEADS */}
          {safeTab==="leads"&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Leads ({sf(mLeads,["name","company"]).length})</h2>
            {sf(mLeads,["name","company"]).map(l=><div key={l.id} style={card} onClick={()=>setDetail({type:"lead",data:l})}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Avatar name={l.name}/>
                  <div>
                    <div style={{fontWeight:700,fontSize:14}}>{l.name}</div>
                    <div style={{fontSize:12,color:"#7a6db5"}}>{l.company} · {l.region}</div>
                  </div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <Badge color={statusColors[l.status]||"#e0e0e0"}>{l.status}</Badge>
                  <Badge color="#e0d9ff">{l.source}</Badge>
                </div>
              </div>
            </div>)}
            {sf(mLeads,["name","company"]).length===0&&<div style={{color:"#7a6db5",padding:20,textAlign:"center"}}>No leads to show.</div>}
          </div>}

          {/* OPPORTUNITIES */}
          {safeTab==="opportunities"&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Opportunities</h2>
            <div style={{display:"grid",gridTemplateColumns:`repeat(${STAGES.length},minmax(180px,1fr))`,gap:10,minWidth:0,overflowX:"auto"}}>
              {STAGES.map(s=>{
                const inStage=sf(mOpps,["name","account"]).filter(o=>o.stage===s);
                const sum=inStage.reduce((a,b)=>a+b.value,0);
                return <div key={s} style={{background:"#fff",borderRadius:12,padding:10,border:"1px solid #e7e2f4",minHeight:200}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <Badge color={stageColors[s]}>{s}</Badge>
                    <span style={{fontSize:11,color:"#7a6db5",fontWeight:600}}>{inStage.length}</span>
                  </div>
                  <div style={{fontSize:11,color:"#7a6db5",marginBottom:10}}>{fmt(sum)}</div>
                  {inStage.map(o=><div key={o.id} onClick={()=>setDetail({type:"opp",data:o})} style={{background:"#f8f6ff",border:"1px solid #ece6fc",borderRadius:8,padding:10,marginBottom:8,cursor:"pointer"}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{o.name}</div>
                    <div style={{fontSize:11,color:"#7a6db5",marginBottom:6}}>{o.account}</div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:12,fontWeight:700,color:"#1a5c30"}}>{fmt(o.value)}</span>
                      <span style={{fontSize:10,color:"#7a6db5"}}>{o.probability}%</span>
                    </div>
                    {perm.editRecords&&<div style={{display:"flex",gap:4,marginTop:8}} onClick={e=>e.stopPropagation()}>
                      <button onClick={()=>moveStage(o.id,-1)} disabled={STAGES.indexOf(o.stage)===0} style={{flex:1,padding:"3px",fontSize:10,border:"1px solid #d6cdf3",borderRadius:4,background:"#fff",cursor:"pointer"}}>← Back</button>
                      <button onClick={()=>moveStage(o.id,1)} disabled={STAGES.indexOf(o.stage)===STAGES.length-1} style={{flex:1,padding:"3px",fontSize:10,border:"1px solid #d6cdf3",borderRadius:4,background:"#fff",cursor:"pointer"}}>Fwd →</button>
                    </div>}
                  </div>)}
                </div>;
              })}
            </div>
          </div>}

          {/* TASKS */}
          {safeTab==="tasks"&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Tasks ({sf(mTasks,["title","related"]).length})</h2>
            {sf(mTasks,["title","related"]).map(t=><div key={t.id} style={{...card,display:"flex",alignItems:"center",gap:12}} onClick={()=>openEdit("task",t)}>
              <input type="checkbox" checked={t.status==="Done"} onClick={e=>e.stopPropagation()} onChange={()=>toggleTask(t.id)} style={{width:18,height:18,cursor:"pointer"}}/>
              <span style={{fontSize:18}}>{taskTypeIcon[t.type]}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,textDecoration:t.status==="Done"?"line-through":"none",color:t.status==="Done"?"#999":"#1a0a40"}}>{t.title}</div>
                <div style={{fontSize:12,color:"#7a6db5"}}>{t.related} · Due {t.due} · {t.owner}</div>
              </div>
              <Badge color={t.status==="Done"?"#c0dd97":"#fac775"}>{t.status}</Badge>
            </div>)}
            {sf(mTasks,["title","related"]).length===0&&<div style={{color:"#7a6db5",padding:20,textAlign:"center"}}>No tasks to show.</div>}
          </div>}

          {/* QUOTES */}
          {safeTab==="quotes"&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Quotes ({sf(mQuotes,["name","quoteNo","lead","opportunity"]).length})</h2>
            {sf(mQuotes,["name","quoteNo","lead","opportunity"]).map(q=>{
              const sym=currSym(q.currency);
              const total=q.items.reduce((s,it)=>s+(+it.finalPrice||0),0);
              const myPending=q.approvals?.some(a=>a.status==="Pending"&&a.userId===user.id);
              return <div key={q.id} style={card} onClick={()=>setDetail({type:"quote",data:q})}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:8}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontFamily:"monospace",fontSize:11,color:"#7a6db5",fontWeight:700}}>{q.quoteNo}</span>
                      <Badge color={qsColors[q.status]}>{q.status}</Badge>
                      {myPending&&<Badge color="#f87171">Action Required</Badge>}
                    </div>
                    <div style={{fontWeight:700,fontSize:14}}>{q.name}</div>
                    <div style={{fontSize:12,color:"#7a6db5"}}>{q.lead} · {q.opportunity||"—"}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:800,color:"#1a5c30"}}>{sym}{total.toLocaleString()}</div>
                    <div style={{fontSize:10,color:"#7a6db5",marginTop:2}}>{q.items.length} item{q.items.length!==1?"s":""}</div>
                  </div>
                </div>
              </div>;
            })}
            {sf(mQuotes,["name","quoteNo"]).length===0&&<div style={{color:"#7a6db5",padding:20,textAlign:"center"}}>No quotes to show.</div>}
          </div>}

          {/* REPORTS */}
          {safeTab==="reports"&&perm.viewReports&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Reports</h2>
            <div style={{background:"#fff",border:"1px solid #e7e2f4",borderRadius:12,padding:"16px 18px",marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:700,color:"#3b1fa8",marginBottom:12}}>Rep Performance</div>
              {repByUser.map((r,i)=><div key={r.name} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<repByUser.length-1?"1px solid #f0ecfc":"none"}}>
                <Avatar name={r.name} size={36}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{r.name}</div>
                  <div style={{fontSize:11,color:"#7a6db5"}}>{r.count} opportunities</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#1a5c30"}}>Won: {fmt(r.won)}</div>
                  <div style={{fontSize:11,color:"#7a6db5"}}>Total: {fmt(r.total)}</div>
                </div>
              </div>)}
            </div>
          </div>}

          {/* TEAM */}
          {safeTab==="team"&&perm.viewAllUsers&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Team ({users.length})</h2>
            {users.map(u=>{
              const r=roles.find(x=>x.id===u.roleId)||{label:u.roleId,color:"#e0e0e0"};
              const mgr=users.find(x=>x.id===u.managerId);
              return <div key={u.id} style={{...card,display:"flex",alignItems:"center",gap:12}}>
                <Avatar name={u.name}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{u.name}</div>
                  <div style={{fontSize:12,color:"#7a6db5"}}>{u.email} · {u.region}{mgr?` · reports to ${mgr.name}`:""}</div>
                </div>
                <Badge color={r.color}>{r.label}</Badge>
                {perm.manageUsers&&<>
                  <button onClick={()=>openEdit("user",u)} style={btnGhost}>Edit</button>
                  {u.id!==user.id&&<button onClick={()=>setConfirmDel({type:"user",id:u.id,name:u.name})} style={{...btnGhost,color:"#b91c1c",borderColor:"#fecaca"}}>×</button>}
                </>}
              </div>;
            })}
          </div>}

          {/* ROLE BUILDER */}
          {safeTab==="roles"&&perm.manageRoles&&<div>
            <h2 style={{margin:"0 0 16px",fontSize:20,fontWeight:700}}>Role Builder</h2>
            <div style={{fontSize:13,color:"#7a6db5",marginBottom:16}}>Define roles and what each one can do. Permissions cascade down through the reporting hierarchy.</div>
            {roles.map(r=>{
              const perms=permSets[r.id]||{};
              const granted=ALL_PERMS.filter(p=>perms[p.key]);
              return <div key={r.id} style={{...card,cursor:"default"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:10}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                      <Badge color={r.color}>{r.id}</Badge>
                      <span style={{fontWeight:700,fontSize:15}}>{r.label}</span>
                      <span style={{fontSize:11,color:"#7a6db5"}}>Level {r.level}</span>
                    </div>
                    <div style={{fontSize:12,color:"#7a6db5"}}>{granted.length} permissions granted</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>{
                      const fp={};
                      ALL_PERMS.forEach(p=>fp["perm_"+p.key]=!!perms[p.key]);
                      setForm({id:r.id,label:r.label,level:r.level,color:r.color,canBeDeleted:r.canBeDeleted,...fp});
                      setEditTarget(r.id);
                      setModal("role");
                    }} style={btnGhost}>Edit</button>
                    {r.canBeDeleted&&<button onClick={()=>setConfirmDel({type:"role",id:r.id,name:r.label})} style={{...btnGhost,color:"#b91c1c",borderColor:"#fecaca"}}>×</button>}
                  </div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {granted.map(p=><Badge key={p.key} color="#e0d9ff">{p.label}</Badge>)}
                  {granted.length===0&&<span style={{fontSize:12,color:"#7a6db5"}}>No permissions granted</span>}
                </div>
              </div>;
            })}
          </div>}
        </div>

        {/* DETAIL PANEL */}
        {detail&&<div style={{width:380,background:"#fff",border:"1px solid #e7e2f4",borderRadius:12,padding:18,height:"fit-content",position:"sticky",top:0,flexShrink:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,paddingBottom:12,borderBottom:"1px solid #f0ecfc"}}>
            <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:".05em",color:"#7a6db5",fontWeight:700}}>{detail.type==="lead"?"Lead":detail.type==="opp"?"Opportunity":"Quote"}</div>
            <button onClick={()=>setDetail(null)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#7a6db5"}}>×</button>
          </div>

          {detail.type==="lead"&&<div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <Avatar name={detail.data.name} size={48}/>
              <div>
                <div style={{fontSize:17,fontWeight:700}}>{detail.data.name}</div>
                <div style={{fontSize:12,color:"#7a6db5"}}>{detail.data.company}</div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Status</div><div style={{marginTop:4}}><Badge color={statusColors[detail.data.status]}>{detail.data.status}</Badge></div></div>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Source</div><div style={{marginTop:4,fontSize:13}}>{detail.data.source}</div></div>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Region</div><div style={{marginTop:4,fontSize:13}}>{detail.data.region}</div></div>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Created</div><div style={{marginTop:4,fontSize:13}}>{detail.data.created}</div></div>
              <div style={{gridColumn:"span 2"}}><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Owner</div><div style={{marginTop:4,fontSize:13}}>{detail.data.owner}</div></div>
            </div>
            <div style={{fontSize:11,color:"#7a6db5",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Contacts</div>
            {(detail.data.contacts||[]).map((c,i)=><div key={i} style={{padding:"8px 10px",background:"#f8f6ff",borderRadius:8,marginBottom:6,fontSize:12}}>
              <div style={{marginBottom:2}}><Badge color="#e0d9ff">{c.label}</Badge></div>
              <div>{c.email}</div>
              <div>{c.phone}</div>
            </div>)}
            <div style={{display:"flex",gap:6,marginTop:14}}>
              {perm.editRecords&&<button onClick={()=>openEdit("lead",detail.data)} style={{...btnGhost,flex:1}}>Edit</button>}
              {perm.deleteRecords&&<button onClick={()=>setConfirmDel({type:"lead",id:detail.data.id,name:detail.data.name})} style={{...btnGhost,color:"#b91c1c",borderColor:"#fecaca",flex:1}}>Delete</button>}
            </div>
          </div>}

          {detail.type==="opp"&&<div>
            <div style={{fontSize:17,fontWeight:700,marginBottom:4}}>{detail.data.name}</div>
            <div style={{fontSize:12,color:"#7a6db5",marginBottom:14}}>{detail.data.account}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Stage</div><div style={{marginTop:4}}><Badge color={stageColors[detail.data.stage]}>{detail.data.stage}</Badge></div></div>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Probability</div><div style={{marginTop:4,fontSize:13}}>{detail.data.probability}%</div></div>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Value</div><div style={{marginTop:4,fontSize:14,fontWeight:700,color:"#1a5c30"}}>{fmt(detail.data.value)}</div></div>
              <div><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Close</div><div style={{marginTop:4,fontSize:13}}>{detail.data.close}</div></div>
              <div style={{gridColumn:"span 2"}}><div style={{fontSize:10,color:"#7a6db5",fontWeight:700,textTransform:"uppercase"}}>Owner</div><div style={{marginTop:4,fontSize:13}}>{detail.data.owner} · {detail.data.region}</div></div>
            </div>
            <div style={{display:"flex",gap:6}}>
              {perm.editRecords&&<button onClick={()=>openEdit("opp",detail.data)} style={{...btnGhost,flex:1}}>Edit</button>}
              {perm.deleteRecords&&<button onClick={()=>setConfirmDel({type:"opp",id:detail.data.id,name:detail.data.name})} style={{...btnGhost,color:"#b91c1c",borderColor:"#fecaca",flex:1}}>Delete</button>}
            </div>
          </div>}

          {detail.type==="quote"&&liveQuoteDetail&&<div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontFamily:"monospace",fontSize:11,color:"#7a6db5",fontWeight:700}}>{liveQuoteDetail.quoteNo}</span>
              <Badge color={qsColors[liveQuoteDetail.status]}>{liveQuoteDetail.status}</Badge>
            </div>
            <div style={{fontSize:17,fontWeight:700,marginBottom:4}}>{liveQuoteDetail.name}</div>
            <div style={{fontSize:12,color:"#7a6db5",marginBottom:14}}>{liveQuoteDetail.lead} · {liveQuoteDetail.opportunity||"—"}</div>

            <div style={{fontSize:11,color:"#7a6db5",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Items</div>
            {liveQuoteDetail.items.map((it,i)=><div key={i} style={{padding:"8px 10px",background:"#f8f6ff",borderRadius:8,marginBottom:6,fontSize:12,display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:600}}>{it.name}</div>
                <div style={{fontSize:11,color:"#7a6db5"}}>{it.sku} · Qty {it.qty} · {it.discount}% off</div>
              </div>
              <div style={{fontWeight:700,color:"#1a5c30"}}>{currSym(liveQuoteDetail.currency)}{Number(it.finalPrice).toLocaleString()}</div>
            </div>)}
            <div style={{padding:"8px 10px",background:"rgba(200,240,210,.5)",borderRadius:8,marginTop:6,marginBottom:14,display:"flex",justifyContent:"space-between",fontWeight:700}}>
              <span>Total</span>
              <span style={{color:"#1a5c30"}}>{currSym(liveQuoteDetail.currency)}{liveQuoteDetail.items.reduce((s,it)=>s+(+it.finalPrice||0),0).toLocaleString()}</span>
            </div>

            <div style={{fontSize:11,color:"#7a6db5",fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Approval Chain</div>
            {(liveQuoteDetail.approvals||[]).map((a,i)=><div key={i} style={{padding:"8px 10px",background:"#fafafa",borderRadius:8,marginBottom:6,fontSize:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span style={{fontWeight:600}}>{a.user}</span>
                  <span style={{fontSize:10,color:"#7a6db5",marginLeft:6}}>({a.role})</span>
                </div>
                <Badge color={a.status==="Approved"?"#c0dd97":a.status==="Rejected"?"#f7c1c1":"#fac775"}>{a.status}</Badge>
              </div>
              {a.date&&<div style={{fontSize:10,color:"#7a6db5",marginTop:2}}>{a.date}</div>}
              {a.remark&&<div style={{fontSize:11,marginTop:4,fontStyle:"italic",color:"#5a3abf"}}>"{a.remark}"</div>}
            </div>)}

            {liveQuoteDetail.approvals?.some(a=>a.status==="Pending"&&a.userId===user.id)&&<div style={{display:"flex",gap:6,marginTop:14}}>
              <button onClick={()=>openApprovalModal(liveQuoteDetail.id,"Approved")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"#c0dd97",color:"#1a5c30",fontWeight:700,cursor:"pointer"}}>Approve</button>
              <button onClick={()=>openApprovalModal(liveQuoteDetail.id,"Rejected")} style={{flex:1,padding:"8px",borderRadius:8,border:"none",background:"#f7c1c1",color:"#b91c1c",fontWeight:700,cursor:"pointer"}}>Reject</button>
            </div>}
          </div>}
        </div>}
      </div>
    </div>

    {/* ========== MODALS ========== */}

    {modal==="lead"&&<Modal title={editTarget?"Edit Lead":"New Lead"} onClose={closeModal}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Name"><Inp value={form.name} onChange={v=>setF("name",v)} placeholder="Priya Sharma"/></Field>
        <Field label="Company"><Inp value={form.company} onChange={v=>setF("company",v)} placeholder="TechNova"/></Field>
        <Field label="Status"><Sel value={form.status} onChange={v=>setF("status",v)} options={["New","Contacted","Qualified","Lost"]}/></Field>
        <Field label="Source"><Sel value={form.source} onChange={v=>setF("source",v)} options={["Web","Referral","LinkedIn","Email","Cold Call","Event","Other"]}/></Field>
        <Field label="Region"><Inp value={form.region||user.region} onChange={v=>setF("region",v)}/></Field>
        <Field label="Owner"><Inp value={form.owner||user.name} onChange={v=>setF("owner",v)}/></Field>
      </div>
      <Field label="Contacts"><ContactsEditor value={form.contacts||[]} onChange={v=>setF("contacts",v)}/></Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label={editTarget?"Save Changes":"Create Lead"}/>
    </Modal>}

    {modal==="opp"&&<Modal title={editTarget?"Edit Opportunity":"New Opportunity"} onClose={closeModal}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Deal Name"><Inp value={form.name} onChange={v=>setF("name",v)} placeholder="TechNova CRM Deal"/></Field>
        <Field label="Account"><Inp value={form.account} onChange={v=>setF("account",v)} placeholder="TechNova"/></Field>
        <Field label="Stage"><Sel value={form.stage} onChange={v=>setF("stage",v)} options={STAGES}/></Field>
        <Field label="Probability (%)"><Inp type="number" value={form.probability} onChange={v=>setF("probability",v)}/></Field>
        <Field label="Value (₹)"><Inp type="number" value={form.value} onChange={v=>setF("value",v)} placeholder="450000"/></Field>
        <Field label="Close Date"><Inp type="date" value={form.close} onChange={v=>setF("close",v)}/></Field>
        <Field label="Owner"><Inp value={form.owner||user.name} onChange={v=>setF("owner",v)}/></Field>
        <Field label="Region"><Inp value={form.region||user.region} onChange={v=>setF("region",v)}/></Field>
      </div>
      <SaveBar onCancel={closeModal} onSave={saveItem} label={editTarget?"Save Changes":"Create Opportunity"}/>
    </Modal>}

    {modal==="task"&&<Modal title={editTarget?"Edit Task":"New Task"} onClose={closeModal}>
      <Field label="Title"><Inp value={form.title} onChange={v=>setF("title",v)} placeholder="Follow up with..."/></Field>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Type"><Sel value={form.type} onChange={v=>setF("type",v)} options={["Call","Email","Meeting","Task"]}/></Field>
        <Field label="Status"><Sel value={form.status||"Open"} onChange={v=>setF("status",v)} options={["Open","Done"]}/></Field>
        <Field label="Due Date"><Inp type="date" value={form.due} onChange={v=>setF("due",v)}/></Field>
        <Field label="Owner"><Inp value={form.owner||user.name} onChange={v=>setF("owner",v)}/></Field>
      </div>
      <Field label="Related To"><Inp value={form.related} onChange={v=>setF("related",v)} placeholder="Opportunity or Lead name"/></Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label={editTarget?"Save Changes":"Create Task"}/>
    </Modal>}

    {modal==="quote"&&<Modal title={editTarget?"Edit Quote":"New Quote"} onClose={closeModal} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Quote Name"><Inp value={form.name} onChange={v=>setF("name",v)} placeholder="TechNova Q1 2026"/></Field>
        <Field label="Currency"><select value={form.currency||"INR"} onChange={e=>setF("currency",e.target.value)} style={{width:"100%",padding:"10px 14px",border:"1.5px solid rgba(120,90,220,0.3)",borderRadius:10}}>{CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.code} — {c.symbol} {c.name}</option>)}</select></Field>
        <Field label="Lead"><Sel value={form.lead||""} onChange={v=>setF("lead",v)} options={[["","-- Select Lead --"],...leads.map(l=>[l.name,l.name])]}/></Field>
        <Field label="Linked Opportunity"><Sel value={form.opportunity||""} onChange={v=>setF("opportunity",v)} options={[["","-- None --"],...opps.map(o=>[o.name,o.name])]}/></Field>
        <Field label="Channel Partner"><Inp value={form.channelPartner} onChange={v=>setF("channelPartner",v)} placeholder="TechBridge Solutions"/></Field>
        <Field label="PO Number"><Inp value={form.poNumber} onChange={v=>setF("poNumber",v)} placeholder="PO-2026-001"/></Field>
        <Field label="Start Date"><Inp type="date" value={form.startDate} onChange={v=>setF("startDate",v)}/></Field>
        <Field label="End Date"><Inp type="date" value={form.endDate} onChange={v=>setF("endDate",v)}/></Field>
        <Field label="Quote Expiry Date"><Inp type="date" value={form.expiryDate} onChange={v=>setF("expiryDate",v)}/></Field>
        <Field label="Owner"><Inp value={form.owner||user.name} onChange={v=>setF("owner",v)} placeholder={user.name}/></Field>
      </div>
      <Field label="Line Items (from Pricebook)">
        <QuoteItemsEditor items={form.items||[]} onChange={v=>setF("items",v)} currencySymbol={CURRENCIES.find(c=>c.code===form.currency)?.symbol||"₹"} pricebook={pricebook}/>
      </Field>
      <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#166534",marginBottom:4}}>
        ℹ️ Quote will be routed through the approval chain based on the owner's reporting hierarchy.
      </div>
      <SaveBar onCancel={closeModal} onSave={saveItem} label="Submit for Approval"/>
    </Modal>}

    {modal==="user"&&<Modal title={editTarget?"Edit User":"Add User"} onClose={closeModal}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Field label="Name"><Inp value={form.name} onChange={v=>setF("name",v)} placeholder="Full name"/></Field>
        <Field label="Email"><Inp value={form.email} onChange={v=>setF("email",v)} placeholder="user@sf.in"/></Field>
        <Field label="Password"><Inp value={form.password} onChange={v=>setF("password",v)} placeholder="Initial password"/></Field>
        <Field label="Role"><Sel value={form.roleId} onChange={v=>setF("roleId",v)} options={roles.map(r=>[r.id,r.label])}/></Field>
        <Field label="Region"><Inp value={form.region} onChange={v=>setF("region",v)} placeholder="Delhi"/></Field>
        <Field label="Manager"><Sel value={form.managerId||""} onChange={v=>setF("managerId",v)} options={[["","-- None --"],...users.filter(u=>u.id!==editTarget).map(u=>[String(u.id),u.name+" ("+u.roleId+")"])]}/></Field>
      </div>
      <SaveBar onCancel={closeModal} onSave={saveItem} label={editTarget?"Save Changes":"Add User"}/>
    </Modal>}

    {modal==="role"&&<Modal title={editTarget?"Edit Role":"New Role"} onClose={closeModal} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <Field label="Role ID"><Inp value={form.id} onChange={v=>setF("id",v.toUpperCase())} placeholder="e.g. SALESLEAD" disabled={!!editTarget}/></Field>
        <Field label="Display Label"><Inp value={form.label} onChange={v=>setF("label",v)} placeholder="Sales Lead"/></Field>
        <Field label="Level"><Inp type="number" value={form.level} onChange={v=>setF("level",v)}/></Field>
      </div>
      <Field label="Color">
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {COLORS.map(c=><div key={c} onClick={()=>setF("color",c)} style={{width:32,height:32,background:c,borderRadius:8,cursor:"pointer",border:form.color===c?"3px solid #3b1fa8":"3px solid transparent"}}/>)}
        </div>
      </Field>
      <Field label="Permissions">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {ALL_PERMS.map(p=><label key={p.key} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"rgba(245,242,255,.5)",borderRadius:8,cursor:"pointer",fontSize:13}}>
            <input type="checkbox" checked={!!form["perm_"+p.key]} onChange={e=>setF("perm_"+p.key,e.target.checked)}/>
            <span>{p.label}</span>
          </label>)}
        </div>
      </Field>
      <SaveBar onCancel={closeModal} onSave={saveItem} label={editTarget?"Save Changes":"Create Role"}/>
    </Modal>}

    {/* APPROVAL MODAL */}
    {approvalModal&&<Modal title={`${approvalModal.decision==="Approved"?"Approve":"Reject"} Quote`} onClose={()=>setApprovalModal(null)}>
      <Field label="Remarks"><Textarea value={remarkText} onChange={setRemarkText} placeholder={approvalModal.decision==="Approved"?"Optional approval notes...":"Reason for rejection..."} rows={4}/></Field>
      <SaveBar onCancel={()=>setApprovalModal(null)} onSave={submitApproval} label={`Confirm ${approvalModal.decision}`} danger={approvalModal.decision==="Rejected"}/>
    </Modal>}

    {/* CONFIRM DELETE */}
    {confirmDel&&<Modal title="Confirm Delete" onClose={()=>setConfirmDel(null)}>
      <div style={{padding:"14px 16px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,marginBottom:8}}>
        <div style={{fontWeight:700,color:"#b91c1c",marginBottom:4}}>Are you sure?</div>
        <div style={{fontSize:13,color:"#7f1d1d"}}>This will permanently delete <strong>{confirmDel.name}</strong>. This action cannot be undone.</div>
      </div>
      <SaveBar onCancel={()=>setConfirmDel(null)} onSave={()=>{
        if(confirmDel.type==="lead")deleteLead(confirmDel.id);
        else if(confirmDel.type==="opp")deleteOpp(confirmDel.id);
        else if(confirmDel.type==="user")deleteUser(confirmDel.id);
        else if(confirmDel.type==="role")deleteRole(confirmDel.id);
      }} label="Delete" danger/>
    </Modal>}
  </div>;
}

// ---------- helpers ----------
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
