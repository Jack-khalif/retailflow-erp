// ============================================================
// RetailFlow ERP — Mock Data Store
// In a real system this would come from a REST API / database
// ============================================================

const DB = {

  lpos: [
    { id:'LPO-0089', supplier:'Bidco Africa',       items:6,  amount:128400, date:'25 Apr 2026', branch:'Westlands',  status:'pending'  },
    { id:'LPO-0088', supplier:'Unilever Kenya',     items:12, amount:342000, date:'24 Apr 2026', branch:'CBD',         status:'approved' },
    { id:'LPO-0087', supplier:'Procter & Gamble',   items:4,  amount:89500,  date:'23 Apr 2026', branch:'Thika Rd',   status:'pending'  },
    { id:'LPO-0086', supplier:'EABL',               items:8,  amount:215000, date:'22 Apr 2026', branch:'Westlands',  status:'approved' },
    { id:'LPO-0085', supplier:'Nestlé Kenya',       items:10, amount:176000, date:'21 Apr 2026', branch:'Ngong Rd',   status:'approved' },
  ],

  orders: [
    { id:'ORD-0565', customer:'Quickmart Thika',   items:18, amount:184000, type:'Wholesale', date:'25 Apr 2026', status:'new'        },
    { id:'ORD-0564', customer:'Naivas Westlands',  items:9,  amount:97500,  type:'Retail',    date:'25 Apr 2026', status:'confirmed'  },
    { id:'ORD-0563', customer:'Carrefour CBD',     items:24, amount:426000, type:'Wholesale', date:'25 Apr 2026', status:'confirmed'  },
    { id:'ORD-0562', customer:'Tuskys Ngong',      items:6,  amount:53200,  type:'Retail',    date:'24 Apr 2026', status:'new'        },
    { id:'ORD-0561', customer:'Quickmart CBD',     items:11, amount:122000, type:'Wholesale', date:'23 Apr 2026', status:'dispatched' },
    { id:'ORD-0560', customer:'Nairobi Mart',      items:5,  amount:68200,  type:'Retail',    date:'23 Apr 2026', status:'dispatched' },
  ],

  invoices: [
    { id:'INV-1044', customer:'Naivas Westlands', amount:97500,  date:'25 Apr 2026', due:'09 May 2026', orderId:'ORD-0564', status:'unpaid'  },
    { id:'INV-1043', customer:'Carrefour CBD',    amount:426000, date:'25 Apr 2026', due:'09 May 2026', orderId:'ORD-0563', status:'unpaid'  },
    { id:'INV-1042', customer:'Nairobi Mart',     amount:68200,  date:'24 Apr 2026', due:'08 May 2026', orderId:'ORD-0560', status:'partial' },
    { id:'INV-1041', customer:'Quickmart CBD',    amount:122000, date:'23 Apr 2026', due:'07 May 2026', orderId:'ORD-0561', status:'paid'    },
    { id:'INV-1040', customer:'Tuskys Karen',     amount:78000,  date:'22 Apr 2026', due:'06 May 2026', orderId:'ORD-0558', status:'paid'    },
  ],

  invoiceLines: {
    'INV-1044': [
      { desc:'Cooking Oil 2L (case)',   qty:20, unit:1800 },
      { desc:'Sugar 2kg (bag)',         qty:50, unit:620  },
      { desc:'Wheat Flour 2kg',         qty:30, unit:480  },
      { desc:'Laundry Detergent 1kg',   qty:20, unit:520  },
    ],
    'INV-1043': [
      { desc:'Cooking Oil 5L (case)',   qty:40, unit:3200 },
      { desc:'Rice 5kg',                qty:60, unit:980  },
      { desc:'Sugar 50kg (sack)',       qty:20, unit:4500 },
      { desc:'Flour 50kg (sack)',       qty:18, unit:3800 },
      { desc:'Beverages mixed (case)',  qty:30, unit:1800 },
    ],
  },

  transfers: [
    { id:'TR-204', from:'Westlands', to:'Thika Rd', items:'Cooking Oil, Sugar',  units:48,  date:'25 Apr 2026', status:'transit'  },
    { id:'TR-203', from:'CBD',       to:'Westlands', items:'Detergent bulk',     units:120, date:'24 Apr 2026', status:'received' },
    { id:'TR-202', from:'Thika Rd',  to:'CBD',       items:'Flour 2kg bags',    units:60,  date:'23 Apr 2026', status:'received' },
    { id:'TR-201', from:'Westlands', to:'Ngong Rd',  items:'Beverages mixed',   units:30,  date:'22 Apr 2026', status:'transit'  },
    { id:'TR-200', from:'CBD',       to:'Thika Rd',  items:'Sugar, Rice',       units:80,  date:'21 Apr 2026', status:'received' },
  ],

  stock: [
    { sku:'SKU-001', name:'Cooking Oil 2L',      category:'Edible Oils',  qty:320,  reorder:100, branch:'Westlands' },
    { sku:'SKU-002', name:'Sugar 2kg',            category:'Grocery',      qty:45,   reorder:80,  branch:'Westlands' },
    { sku:'SKU-003', name:'Wheat Flour 2kg',      category:'Baking',       qty:190,  reorder:60,  branch:'Westlands' },
    { sku:'SKU-004', name:'Laundry Detergent 1kg',category:'FMCG',         qty:12,   reorder:50,  branch:'Westlands' },
    { sku:'SKU-005', name:'Rice 5kg',             category:'Grocery',      qty:210,  reorder:70,  branch:'Westlands' },
    { sku:'SKU-006', name:'Beverages 500ml (case)',category:'Beverages',   qty:88,   reorder:40,  branch:'Westlands' },
    { sku:'SKU-007', name:'Cooking Oil 5L',       category:'Edible Oils',  qty:28,   reorder:50,  branch:'Westlands' },
    { sku:'SKU-008', name:'Maize Flour 2kg',      category:'Baking',       qty:340,  reorder:100, branch:'Westlands' },
    { sku:'SKU-009', name:'Milk 500ml (crate)',   category:'Dairy',        qty:60,   reorder:40,  branch:'Westlands' },
    { sku:'SKU-010', name:'Eggs tray (30)',       category:'Dairy',        qty:22,   reorder:30,  branch:'Westlands' },
  ],

  payments: [
    { id:'PAY-001', amount:97500,  description:'NAIVAS WESTLANDS',  ref:'EFT REF #AE2041', date:'25 Apr 2026', matched: null },
    { id:'PAY-002', amount:42500,  description:'QUICKMART CBD',      ref:'RTGS REF #QM1882',date:'25 Apr 2026', matched: null },
    { id:'PAY-003', amount:14000,  description:'NAIROBI MART',       ref:'CHQ #00042',      date:'25 Apr 2026', matched: null },
    { id:'PAY-004', amount:30000,  description:'UNKNOWN SENDER',     ref:'EFT REF #ZZ9901', date:'25 Apr 2026', matched: null },
    { id:'PAY-005', amount:122000, description:'QUICKMART CBD',      ref:'EFT REF #QM1101', date:'24 Apr 2026', matched:'INV-1041' },
  ],

  // Monthly revenue data for reports
  monthlyRevenue: [285000, 312000, 298000, 340000, 378000, 321000, 405000, 390000, 445000, 412000, 467000, 490000],
  monthlyOrders:  [42, 48, 45, 52, 58, 49, 63, 60, 68, 64, 71, 75],
  months: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'],

  // Top customers
  topCustomers: [
    { name:'Carrefour CBD',    revenue:1820000, orders:48 },
    { name:'Quickmart Thika', revenue:1340000, orders:62 },
    { name:'Naivas Westlands',revenue:1120000, orders:55 },
    { name:'Nairobi Mart',    revenue:780000,  orders:38 },
    { name:'Tuskys Ngong',    revenue:540000,  orders:29 },
  ],
};
