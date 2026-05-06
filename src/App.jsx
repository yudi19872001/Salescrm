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

// rest of constants (roles, perms, inits) remain unchanged
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
// ... rest of file unchanged until QuoteItemsEditor
