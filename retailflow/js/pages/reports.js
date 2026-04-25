function renderReports() {
  Utils.render(`
    <div class="page-header"><h1>Reports & Analytics</h1><p>Sales performance and financial overview — Last 12 months</p></div>

    <div class="metrics">
      <div class="metric-card">
        <div class="label">Total Revenue (12m)</div>
        <div class="value" style="font-size:18px">KES ${(DB.monthlyRevenue.reduce((a,b)=>a+b,0)/1000000).toFixed(2)}M</div>
        <div class="sub">↑ 14% vs prior year</div>
      </div>
      <div class="metric-card">
        <div class="label">Total Orders (12m)</div>
        <div class="value">${DB.monthlyOrders.reduce((a,b)=>a+b,0)}</div>
        <div class="sub">↑ 11% vs prior year</div>
      </div>
      <div class="metric-card">
        <div class="label">Avg Order Value</div>
        <div class="value" style="font-size:18px">KES ${Math.round(DB.monthlyRevenue.reduce((a,b)=>a+b,0)/DB.monthlyOrders.reduce((a,b)=>a+b,0)/1000)}k</div>
      </div>
      <div class="metric-card">
        <div class="label">Outstanding Receivables</div>
        <div class="value" style="font-size:18px">KES ${(DB.invoices.filter(i=>i.status!=='paid').reduce((s,i)=>s+i.amount,0)/1000).toFixed(0)}k</div>
        <div class="sub warn">Across ${DB.invoices.filter(i=>i.status!=='paid').length} invoices</div>
      </div>
    </div>

    <div class="chart-grid">
      <div class="card">
        <div class="card-header"><div class="card-title">Monthly Revenue (KES)</div></div>
        <div class="card-body">
          <div class="chart-container"><canvas id="chart-revenue"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Orders per Month</div></div>
        <div class="card-body">
          <div class="chart-container"><canvas id="chart-orders"></canvas></div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
      <div class="card">
        <div class="card-header"><div class="card-title">Top Customers by Revenue</div></div>
        <div class="card-body">
          <div class="chart-container" style="height:200px"><canvas id="chart-customers"></canvas></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Invoice Status Breakdown</div></div>
        <div class="card-body">
          <div class="chart-container" style="height:200px"><canvas id="chart-inv-status"></canvas></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Top Customers</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Customer</th><th>Total Revenue</th><th>Orders</th><th>Avg Order Value</th></tr></thead>
          <tbody>
            ${DB.topCustomers.map(c=>`
              <tr>
                <td><strong>${c.name}</strong></td>
                <td>${Utils.fmt(c.revenue)}</td>
                <td>${c.orders}</td>
                <td>${Utils.fmt(Math.round(c.revenue/c.orders))}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `);

  // Draw charts after DOM is ready
  requestAnimationFrame(() => {
    const green = '#1D9E75';
    const greenLight = 'rgba(29,158,117,0.12)';
    const blue  = '#3B82F6';
    const opts  = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } } };

    // Revenue line chart
    new Chart(document.getElementById('chart-revenue'), {
      type:'line',
      data:{
        labels: DB.months,
        datasets:[{
          data: DB.monthlyRevenue,
          borderColor: green, backgroundColor: greenLight,
          borderWidth:2, fill:true, tension:.35, pointRadius:3, pointBackgroundColor:green,
        }]
      },
      options:{...opts, scales:{
        y:{ ticks:{ callback:v=>'KES '+(v/1000)+'k', font:{size:11} }, grid:{color:'#F3F4F6'} },
        x:{ ticks:{ font:{size:11} }, grid:{display:false} }
      }}
    });

    // Orders bar chart
    new Chart(document.getElementById('chart-orders'), {
      type:'bar',
      data:{
        labels: DB.months,
        datasets:[{
          data: DB.monthlyOrders,
          backgroundColor: greenLight, borderColor: green, borderWidth:1.5, borderRadius:4,
        }]
      },
      options:{...opts, scales:{
        y:{ ticks:{ font:{size:11} }, grid:{color:'#F3F4F6'} },
        x:{ ticks:{ font:{size:11} }, grid:{display:false} }
      }}
    });

    // Top customers horizontal bar
    new Chart(document.getElementById('chart-customers'), {
      type:'bar',
      data:{
        labels: DB.topCustomers.map(c=>c.name),
        datasets:[{ data: DB.topCustomers.map(c=>c.revenue), backgroundColor:green, borderRadius:4 }]
      },
      options:{...opts, indexAxis:'y', scales:{
        x:{ ticks:{ callback:v=>'KES '+(v/1000)+'k', font:{size:10} }, grid:{color:'#F3F4F6'} },
        y:{ ticks:{ font:{size:11} }, grid:{display:false} }
      }}
    });

    // Invoice donut
    const paid    = DB.invoices.filter(i=>i.status==='paid').length;
    const unpaid  = DB.invoices.filter(i=>i.status==='unpaid').length;
    const partial = DB.invoices.filter(i=>i.status==='partial').length;
    new Chart(document.getElementById('chart-inv-status'), {
      type:'doughnut',
      data:{
        labels:['Paid','Unpaid','Partial'],
        datasets:[{ data:[paid,unpaid,partial], backgroundColor:['#1D9E75','#EF4444','#F59E0B'], borderWidth:0 }]
      },
      options:{...opts, plugins:{ legend:{ display:true, position:'bottom', labels:{ font:{size:11} } } }, cutout:'65%' }
    });
  });
}
