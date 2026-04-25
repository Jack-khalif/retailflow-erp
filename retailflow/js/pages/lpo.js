function renderLPO(showForm=false) {
  if (showForm) {
    Utils.render(`
      <div class="page-header">
        <h1>New Local Purchase Order</h1>
        <p>Submit a procurement request to a supplier</p>
      </div>
      <div class="card">
        <div class="card-body">
          <div class="form-grid">
            <div class="form-group"><label>Supplier</label>
              <select id="lpo-supplier">
                <option>Bidco Africa</option><option>Unilever Kenya</option>
                <option>EABL</option><option>Procter &amp; Gamble</option><option>Nestlé Kenya</option>
              </select>
            </div>
            <div class="form-group"><label>Delivery Branch</label>
              <select id="lpo-branch">
                <option>Westlands</option><option>CBD</option><option>Thika Rd</option><option>Ngong Rd</option>
              </select>
            </div>
          </div>
          <div class="form-grid">
            <div class="form-group"><label>Expected Delivery Date</label><input type="date" id="lpo-date" value="2026-05-05"/></div>
            <div class="form-group"><label>Priority</label>
              <select id="lpo-priority"><option>Normal</option><option>Urgent</option><option>Low</option></select>
            </div>
          </div>
          <div class="divider"></div>
          <div class="card-title" style="margin-bottom:12px">Line Items</div>
          <table id="lpo-items-table" style="margin-bottom:10px">
            <thead><tr><th>Item Description</th><th>Qty</th><th>Unit Price (KES)</th><th>Total</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td><input style="width:100%" value="Cooking Oil 2L (case)" class="lpo-item-desc"/></td>
                <td><input type="number" style="width:70px" value="50" class="lpo-item-qty" oninput="updateLpoTotal()"/></td>
                <td><input type="number" style="width:100px" value="1800" class="lpo-item-price" oninput="updateLpoTotal()"/></td>
                <td class="lpo-item-total">90,000</td>
                <td><button class="btn btn-sm btn-danger" onclick="removeLpoRow(this)">✕</button></td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-sm" onclick="addLpoRow()">+ Add line item</button>
          <div style="text-align:right;margin-top:14px;font-size:14px">
            Total: <strong id="lpo-grand-total">KES 90,000</strong>
          </div>
          <div class="form-group" style="margin-top:14px"><label>Notes</label>
            <textarea id="lpo-notes" placeholder="Optional notes for supplier or warehouse..."></textarea>
          </div>
          <div class="actions">
            <button class="btn" onclick="renderLPO()">Cancel</button>
            <button class="btn btn-primary" onclick="submitLPO()">Submit LPO</button>
          </div>
        </div>
      </div>
    `);
    return;
  }

  Utils.render(`
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between">
      <div><h1>Local Purchase Orders</h1><p>Manage procurement requests to suppliers</p></div>
      <button class="btn btn-primary" onclick="renderLPO(true)">+ New LPO</button>
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>LPO No.</th><th>Supplier</th><th>Items</th><th>Amount</th><th>Date</th><th>Branch</th><th>Status</th><th>Action</th></tr></thead>
          <tbody id="lpo-tbody">
            ${DB.lpos.map((l,i)=>`
              <tr>
                <td><strong>${l.id}</strong></td>
                <td>${l.supplier}</td>
                <td>${l.items}</td>
                <td>${Utils.fmt(l.amount)}</td>
                <td>${l.date}</td>
                <td>${l.branch}</td>
                <td>${Utils.badge(l.status)}</td>
                <td>
                  ${l.status==='pending'
                    ? `<button class="btn btn-sm btn-primary" onclick="approveLPO(${i})">Approve</button>`
                    : `<button class="btn btn-sm">View</button>`}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);
}

function approveLPO(i) {
  DB.lpos[i].status = 'approved';
  renderLPO();
  Utils.alert(`${DB.lpos[i].id} has been approved.`);
}

function addLpoRow() {
  const tbody = document.querySelector('#lpo-items-table tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input style="width:100%" value="Item description" class="lpo-item-desc"/></td>
    <td><input type="number" style="width:70px" value="1" class="lpo-item-qty" oninput="updateLpoTotal()"/></td>
    <td><input type="number" style="width:100px" value="0" class="lpo-item-price" oninput="updateLpoTotal()"/></td>
    <td class="lpo-item-total">0</td>
    <td><button class="btn btn-sm btn-danger" onclick="removeLpoRow(this)">✕</button></td>`;
  tbody.appendChild(row);
}

function removeLpoRow(btn) { btn.closest('tr').remove(); updateLpoTotal(); }

function updateLpoTotal() {
  let grand = 0;
  document.querySelectorAll('#lpo-items-table tbody tr').forEach(row => {
    const qty   = parseFloat(row.querySelector('.lpo-item-qty')?.value||0);
    const price = parseFloat(row.querySelector('.lpo-item-price')?.value||0);
    const total = qty * price;
    row.querySelector('.lpo-item-total').textContent = total.toLocaleString('en-KE');
    grand += total;
  });
  const el = document.getElementById('lpo-grand-total');
  if (el) el.textContent = 'KES ' + grand.toLocaleString('en-KE');
}

function submitLPO() {
  const newId = 'LPO-0' + (90 + DB.lpos.length);
  DB.lpos.unshift({
    id: newId,
    supplier: document.getElementById('lpo-supplier').value,
    items: document.querySelectorAll('#lpo-items-table tbody tr').length,
    amount: parseInt((document.getElementById('lpo-grand-total').textContent||'0').replace(/\D/g,'')),
    date: '25 Apr 2026',
    branch: document.getElementById('lpo-branch').value,
    status: 'pending',
  });
  renderLPO();
  Utils.alert(`${newId} submitted successfully.`);
}
