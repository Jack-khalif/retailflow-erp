function renderDashboard() {
  const pending   = DB.lpos.filter(l=>l.status==='pending').length;
  const openOrds  = DB.orders.filter(o=>o.status==='new'||o.status==='confirmed').length;
  const inTransit = DB.transfers.filter(t=>t.status==='transit').length;
  const unalloc   = DB.payments.filter(p=>!p.matched).reduce((s,p)=>s+p.amount,0);

  const activity = [
    { time:'09:42', module:'LPO',      desc:'LPO-0089 raised — Bidco Africa',              user:'Jane M.',   status:'pending'   },
    { time:'09:15', module:'Invoice',  desc:'INV-1042 printed — Nairobi Mart',             user:'Brian K.',  status:'paid'      },
    { time:'08:55', module:'Transfer', desc:'TR-204: Westlands → Thika Rd (48 units)',     user:'System',    status:'transit'   },
    { time:'08:30', module:'Payment',  desc:'KES 122,000 matched — INV-1041',              user:'Cynthia O.',status:'matched'   },
    { time:'08:10', module:'Order',    desc:'ORD-0565 received — Quickmart Thika',         user:'Jane M.',   status:'new'       },
    { time:'07:50', module:'LPO',      desc:'LPO-0088 approved — Unilever Kenya',          user:'Admin',     status:'approved'  },
  ];

  Utils.render(`
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Overview — April 2026 &nbsp;·&nbsp; Westlands Branch</p>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="label">Pending LPOs</div>
        <div class="value">${pending}</div>
        <div class="sub warn">${pending} awaiting approval</div>
      </div>
      <div class="metric-card">
        <div class="label">Open Customer Orders</div>
        <div class="value">${openOrds}</div>
        <div class="sub">↑ 4 received today</div>
      </div>
      <div class="metric-card">
        <div class="label">Transfers In Transit</div>
        <div class="value">${inTransit}</div>
        <div class="sub">Across 2 branches</div>
      </div>
      <div class="metric-card">
        <div class="label">Unallocated Payments</div>
        <div class="value" style="font-size:18px">${Utils.fmt(unalloc)}</div>
        <div class="sub danger">${DB.payments.filter(p=>!p.matched).length} entries unmatched</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Recent Activity</div>
        <span class="text-muted text-sm">Last 24 hours</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Time</th><th>Module</th><th>Description</th><th>User</th><th>Status</th></tr></thead>
          <tbody>
            ${activity.map(a=>`
              <tr>
                <td class="text-muted">${a.time}</td>
                <td><strong>${a.module}</strong></td>
                <td>${a.desc}</td>
                <td>${a.user}</td>
                <td>${Utils.badge(a.status)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <div class="card">
        <div class="card-header"><div class="card-title">Low Stock Alerts</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Reorder at</th></tr></thead>
            <tbody>
              ${DB.stock.filter(s=>s.qty<=s.reorder).map(s=>`
                <tr>
                  <td>${s.name}</td>
                  <td style="color:#DC2626;font-weight:600">${s.qty}</td>
                  <td class="text-muted">${s.reorder}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Unpaid Invoices</div></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Due</th></tr></thead>
            <tbody>
              ${DB.invoices.filter(i=>i.status!=='paid').map(i=>`
                <tr>
                  <td>${i.id}</td>
                  <td>${i.customer}</td>
                  <td>${Utils.fmt(i.amount)}</td>
                  <td class="text-muted">${i.due}</td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);
}
