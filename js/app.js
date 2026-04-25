// ============================================================
// RetailFlow ERP — App Router
// ============================================================

const Pages = {
  dashboard: renderDashboard,
  lpo:       renderLPO,
  orders:    renderOrders,
  invoicing: renderInvoicing,
  transfers: renderTransfers,
  stock:     renderStock,
  payments:  renderPayments,
  reports:   renderReports,
};

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const target = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (target) target.classList.add('active');
  if (Pages[page]) Pages[page]();
}

// Wire up nav clicks
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => navigate(item.dataset.page));
});

// Boot
navigate('dashboard');
