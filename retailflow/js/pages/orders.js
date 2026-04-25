// ============================================================
// Customer Orders
// ============================================================
function renderOrders() {
  Utils.render(`
    <div class="page-header"><h1>Customer Orders</h1><p>Receive and process incoming orders</p></div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order No.</th><th>Customer</th><th>Items</th><th>Amount</th><th>Type</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${DB.orders.map((o,i)=>`
              <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.customer}</td>
                <td>${o.items}</td>
                <td>${Utils.fmt(o.amount)}</td>
                <td>${o.type}</td>
                <td>${o.date}</td>
                <td>${Utils.badge(o.status)}</td>
                <td>
                  ${o.status==='new'
                    ? `<button class="btn btn-sm btn-primary" onclick="confirmOrder(${i})">Confirm</button>`
                    : o.status==='confirmed'
                    ? `<button class="btn btn-sm" onclick="createInvoiceFromOrder('${o.id}')">Invoice →</button>`
                    : `<button class="btn btn-sm">View</button>`}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

function confirmOrder(i) {
  DB.orders[i].status = 'confirmed';
  renderOrders();
  Utils.alert(`${DB.orders[i].id} confirmed.`);
}

function createInvoiceFromOrder(orderId) {
  navigate('invoicing');
  Utils.alert(`Invoice ready to generate for ${orderId}.`);
}

// ============================================================
// Invoicing
// ============================================================
function renderInvoicing(previewId=null) {
  if (previewId) {
    const inv = DB.invoices.find(i=>i.id===previewId);
    const lines = DB.invoiceLines[previewId] || [
      { desc:'Goods supplied', qty:1, unit: inv.amount }
    ];
    const subtotal = lines.reduce((s,l)=>s+(l.qty*l.unit),0);
    const vat = Math.round(subtotal * 0.16 / 1.16);
    const net = subtotal - vat;

    Utils.render(`
      <div class="page-header flex justify-between items-center no-print">
        <div><h1>Invoice Preview</h1><p>${inv.id} — ${inv.customer}</p></div>
        <div style="display:flex;gap:8px">
          <button class="btn no-print" onclick="renderInvoicing()">← Back</button>
          <button class="btn btn-primary no-print" onclick="window.print()">🖨 Print / Save PDF</button>
        </div>
      </div>
      <div class="invoice-doc" id="invoice-print">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px">
          <div>
            <div class="inv-company">RetailFlow Ltd.</div>
            <div style="font-size:12px;color:#6B7280;margin-top:6px;line-height:1.6">
              P.O Box 4421-00100, Nairobi<br>
              Tel: +254 700 123 456<br>
              Email: accounts@retailflow.co.ke<br>
              VAT No: P051234567X
            </div>
          </div>
          <div style="text-align:right">
            <div class="inv-number">INVOICE</div>
            <div style="font-size:12px;color:#6B7280;margin-top:8px;line-height:1.7">
              <strong>No:</strong> ${inv.id}<br>
              <strong>Date:</strong> ${inv.date}<br>
              <strong>Due:</strong> ${inv.due}
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:22px;padding:14px;background:#F9FAF8;border-radius:8px">
          <div style="font-size:13px">
            <div style="font-weight:600;margin-bottom:4px">Bill To</div>
            <div style="color:#374151">${inv.customer}</div>
            <div style="color:#6B7280">Nairobi, Kenya</div>
          </div>
          <div style="font-size:13px">
            <div style="font-weight:600;margin-bottom:4px">Reference</div>
            <div style="color:#374151">${inv.orderId||'—'}</div>
            <div style="color:#6B7280">Status: ${inv.status.charAt(0).toUpperCase()+inv.status.slice(1)}</div>
          </div>
        </div>
        <table class="inv-table" style="margin-bottom:16px">
          <thead><tr><th>#</th><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Unit (KES)</th><th style="text-align:right">Total (KES)</th></tr></thead>
          <tbody>
            ${lines.map((l,i)=>`
              <tr>
                <td style="color:#9CA3AF">${i+1}</td>
                <td>${l.desc}</td>
                <td style="text-align:right">${l.qty}</td>
                <td style="text-align:right">${l.unit.toLocaleString('en-KE')}</td>
                <td style="text-align:right">${(l.qty*l.unit).toLocaleString('en-KE')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
        <div style="display:flex;justify-content:flex-end">
          <table class="inv-totals" style="min-width:220px">
            <tr><td style="color:#6B7280;padding-right:20px">Subtotal (ex VAT)</td><td style="text-align:right">KES ${net.toLocaleString('en-KE')}</td></tr>
            <tr><td style="color:#6B7280">VAT (16%)</td><td style="text-align:right">KES ${vat.toLocaleString('en-KE')}</td></tr>
            <tr style="border-top:2px solid #E5E7EB">
              <td style="font-weight:700;padding-top:6px">Total Due</td>
              <td style="text-align:right;font-weight:700;color:#1D9E75;padding-top:6px">KES ${subtotal.toLocaleString('en-KE')}</td>
            </tr>
          </table>
        </div>
        <div style="margin-top:22px;padding-top:14px;border-top:1px solid #E5E7EB;font-size:12px;color:#6B7280">
          <strong>Payment Terms:</strong> 14 days from invoice date.<br>
          <strong>Bank:</strong> Equity Bank Kenya — Account: 0140285729201 — Branch: Westlands<br>
          Cheques payable to <em>RetailFlow Ltd.</em>
        </div>
      </div>
    `);
    return;
  }

  Utils.render(`
    <div class="page-header"><h1>Invoicing</h1><p>Generate, preview and print customer invoices</p></div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Invoice No.</th><th>Customer</th><th>Order Ref</th><th>Amount</th><th>Date</th><th>Due Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${DB.invoices.map(inv=>`
              <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.customer}</td>
                <td class="text-muted">${inv.orderId||'—'}</td>
                <td>${Utils.fmt(inv.amount)}</td>
                <td>${inv.date}</td>
                <td>${inv.due}</td>
                <td>${Utils.badge(inv.status)}</td>
                <td><button class="btn btn-sm" onclick="renderInvoicing('${inv.id}')">Preview / Print</button></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ============================================================
// Transfers
// ============================================================
function renderTransfers(showForm=false) {
  if (showForm) {
    Utils.render(`
      <div class="page-header"><h1>New Transfer Request</h1><p>Move stock between branches</p></div>
      <div class="card"><div class="card-body">
        <div class="form-grid">
          <div class="form-group"><label>From Branch</label>
            <select id="tr-from"><option>Westlands</option><option>CBD</option><option>Thika Rd</option><option>Ngong Rd</option></select>
          </div>
          <div class="form-group"><label>To Branch</label>
            <select id="tr-to"><option>Thika Rd</option><option>Westlands</option><option>CBD</option><option>Ngong Rd</option></select>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group"><label>Item / SKU</label>
            <select id="tr-item">
              ${DB.stock.map(s=>`<option value="${s.name}">${s.name} (${s.qty} in stock)</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Units to Transfer</label><input type="number" id="tr-units" value="20" min="1"/></div>
        </div>
        <div class="form-group"><label>Reason</label>
          <textarea id="tr-reason" placeholder="e.g. Stock balancing — branch running low"></textarea>
        </div>
        <div class="actions">
          <button class="btn" onclick="renderTransfers()">Cancel</button>
          <button class="btn btn-primary" onclick="submitTransfer()">Initiate Transfer</button>
        </div>
      </div></div>
    `);
    return;
  }

  Utils.render(`
    <div class="page-header flex justify-between items-center">
      <div><h1>Interbranch Transfers</h1><p>Stock movements between branches</p></div>
      <button class="btn btn-primary" onclick="renderTransfers(true)">+ New Transfer</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Ref</th><th>From</th><th>To</th><th>Items</th><th>Units</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${DB.transfers.map(t=>`
              <tr>
                <td><strong>${t.id}</strong></td>
                <td>${t.from}</td>
                <td>${t.to}</td>
                <td>${t.items}</td>
                <td>${t.units}</td>
                <td>${t.date}</td>
                <td>${Utils.badge(t.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

function submitTransfer() {
  const newId = 'TR-' + (205 + DB.transfers.length);
  DB.transfers.unshift({
    id: newId,
    from: document.getElementById('tr-from').value,
    to:   document.getElementById('tr-to').value,
    items: document.getElementById('tr-item').value,
    units: parseInt(document.getElementById('tr-units').value)||0,
    date:  '25 Apr 2026',
    status:'transit',
  });
  renderTransfers();
  Utils.alert(`${newId} initiated — stock is in transit.`);
}

// ============================================================
// Stock Levels
// ============================================================
function renderStock() {
  Utils.render(`
    <div class="page-header"><h1>Stock Levels</h1><p>Current inventory — Westlands Branch</p></div>
    <div class="metrics">
      <div class="metric-card">
        <div class="label">Total SKUs</div>
        <div class="value">${DB.stock.length}</div>
      </div>
      <div class="metric-card">
        <div class="label">Low Stock Items</div>
        <div class="value" style="color:#DC2626">${DB.stock.filter(s=>s.qty<=s.reorder).length}</div>
        <div class="sub danger">Reorder required</div>
      </div>
      <div class="metric-card">
        <div class="label">Total Units</div>
        <div class="value">${DB.stock.reduce((s,i)=>s+i.qty,0).toLocaleString()}</div>
      </div>
      <div class="metric-card">
        <div class="label">Categories</div>
        <div class="value">${[...new Set(DB.stock.map(s=>s.category))].length}</div>
      </div>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>SKU</th><th>Item Name</th><th>Category</th><th style="width:140px">Stock Level</th><th>Qty</th><th>Reorder at</th><th>Status</th></tr></thead>
          <tbody>
            ${DB.stock.map(s=>{
              const pct = Math.min(100, Math.round(s.qty/s.reorder*50));
              const cls = s.qty <= s.reorder ? 'low' : s.qty <= s.reorder*1.5 ? 'warn' : 'ok';
              return `
                <tr>
                  <td class="text-muted">${s.sku}</td>
                  <td><strong>${s.name}</strong></td>
                  <td>${s.category}</td>
                  <td>
                    <div class="stock-bar"><div class="stock-bar-fill ${cls}" style="width:${pct}%"></div></div>
                  </td>
                  <td><strong style="${cls==='low'?'color:#DC2626':''}">${s.qty}</strong></td>
                  <td class="text-muted">${s.reorder}</td>
                  <td>${Utils.badge(cls==='low'?'low':'ok')}</td>
                </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

// ============================================================
// Bank Payments
// ============================================================
function renderPayments() {
  Utils.render(`
    <div class="page-header"><h1>Bank Payment Allocation</h1><p>Match statement entries to outstanding invoices</p></div>

    <div class="metrics">
      <div class="metric-card">
        <div class="label">Total Received</div>
        <div class="value" style="font-size:18px">${Utils.fmt(DB.payments.reduce((s,p)=>s+p.amount,0))}</div>
      </div>
      <div class="metric-card">
        <div class="label">Matched</div>
        <div class="value" style="color:#065F46">${DB.payments.filter(p=>p.matched).length}</div>
        <div class="sub">${Utils.fmt(DB.payments.filter(p=>p.matched).reduce((s,p)=>s+p.amount,0))}</div>
      </div>
      <div class="metric-card">
        <div class="label">Unmatched</div>
        <div class="value" style="color:#DC2626">${DB.payments.filter(p=>!p.matched).length}</div>
        <div class="sub danger">${Utils.fmt(DB.payments.filter(p=>!p.matched).reduce((s,p)=>s+p.amount,0))}</div>
      </div>
      <div class="metric-card">
        <div class="label">Statement Date</div>
        <div class="value" style="font-size:16px">25 Apr 2026</div>
        <div class="sub">Equity Bank</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Statement Entries</div>
        <span class="text-muted text-sm">${DB.payments.length} entries</span>
      </div>
      <div style="padding:0 18px">
        <div style="display:grid;grid-template-columns:110px 1fr 200px 110px;padding:10px 0;border-bottom:2px solid #E5E7EB">
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Amount</div>
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Description / Ref</div>
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Match to Invoice</div>
          <div style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em">Status</div>
        </div>
        ${DB.payments.map((p,i)=>`
          <div class="alloc-row">
            <div class="alloc-amount">${Utils.fmt(p.amount)}</div>
            <div>
              <div class="alloc-desc">${p.description}</div>
              <div class="alloc-ref">${p.ref} · ${p.date}</div>
            </div>
            <div>
              <select style="width:100%;padding:5px 8px;border:1px solid #E5E7EB;border-radius:6px;font-size:12px;background:#fff;color:#374151"
                onchange="matchPayment(${i}, this.value)" ${p.matched?'disabled':''}>
                ${p.matched
                  ? `<option selected>${p.matched} — matched</option>`
                  : `<option value="">— select invoice —</option>
                     ${DB.invoices.filter(inv=>inv.status!=='paid').map(inv=>
                       `<option value="${inv.id}">${inv.id} · ${inv.customer} · ${Utils.fmt(inv.amount)}</option>`
                     ).join('')}
                     <option value="hold">Hold — query customer</option>`}
              </select>
            </div>
            <div id="pay-status-${i}">${Utils.badge(p.matched?'matched':'unmatched')}</div>
          </div>`).join('')}
      </div>
    </div>
  `);
}

function matchPayment(i, val) {
  if (!val) return;
  DB.payments[i].matched = val;
  const el = document.getElementById(`pay-status-${i}`);
  if (el) el.innerHTML = Utils.badge('matched');
  Utils.alert(`Payment matched to ${val}.`);
}
