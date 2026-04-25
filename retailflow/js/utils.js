// ============================================================
// RetailFlow ERP — Utility Helpers
// ============================================================

const Utils = {

  fmt(n) {
    return 'KES ' + Number(n).toLocaleString('en-KE');
  },

  badge(status) {
    const map = {
      pending:'badge-pending', approved:'badge-approved', paid:'badge-paid',
      transit:'badge-transit', received:'badge-received', confirmed:'badge-approved',
      dispatched:'badge-paid', unpaid:'badge-unpaid', partial:'badge-partial',
      matched:'badge-matched', unmatched:'badge-unmatched', new:'badge-new',
      low:'badge-low', ok:'badge-ok',
    };
    const labels = {
      pending:'Pending', approved:'Approved', paid:'Paid', transit:'In Transit',
      received:'Received', confirmed:'Confirmed', dispatched:'Dispatched',
      unpaid:'Unpaid', partial:'Partial', matched:'Matched', unmatched:'Unmatched',
      new:'New', low:'Low Stock', ok:'In Stock',
    };
    return `<span class="badge ${map[status]||''}">${labels[status]||status}</span>`;
  },

  alert(msg, type='success') {
    const el = document.createElement('div');
    el.className = `alert alert-${type}`;
    el.textContent = msg;
    const root = document.getElementById('page-root');
    root.prepend(el);
    setTimeout(() => el.remove(), 3500);
  },

  render(html) {
    document.getElementById('page-root').innerHTML = html;
  },
};
