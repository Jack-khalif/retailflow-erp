# RetailFlow ERP — Portfolio Demo

A fully interactive front-end prototype of a retail ERP system built as a portfolio project.  
Demonstrates core workflows for a retail/distribution business.

## Modules Covered

| Module | Description |
|---|---|
| **Dashboard** | Live activity feed, low-stock alerts, unpaid invoice summary |
| **Local Purchase Orders (LPOs)** | Raise, approve and track supplier procurement requests |
| **Customer Orders** | Receive, confirm and dispatch customer orders |
| **Invoicing** | Generate, preview and print VAT invoices (browser print / PDF) |
| **Interbranch Transfers** | Initiate and track stock movements between branches |
| **Stock Levels** | Visual inventory tracker with reorder indicators |
| **Bank Payment Allocation** | Match bank statement entries to outstanding invoices |
| **Reports & Analytics** | Revenue charts, order trends, top customers, invoice breakdown |

## Tech Stack

- **Pure HTML / CSS / Vanilla JS** — no build tools, no frameworks, runs directly in browser
- **Chart.js 4** — for analytics charts
- All data is mock/in-memory (see `js/data.js`)

## How to Run

```bash
# Option 1 — just open the file
open index.html

# Option 2 — serve locally (avoids any CORS issues)
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

## Project Structure

```
retailflow/
├── index.html              # Entry point + sidebar layout
├── css/
│   └── style.css           # All styles
└── js/
    ├── data.js             # Mock data store (replaces database)
    ├── utils.js            # Shared helpers (formatting, badges, alerts)
    ├── app.js              # Router / navigation
    └── pages/
        ├── dashboard.js
        ├── lpo.js
        ├── orders.js       # Also contains invoicing, transfers, stock, payments
        └── reports.js      # Chart.js analytics
```

## Extending to a Real System

To productionise this prototype:

1. **Backend** — Replace `js/data.js` with REST API calls (Node.js/Express or Django)
2. **Database** — PostgreSQL (recommended for this domain)
3. **Auth** — Add user roles: Admin, Branch Manager, Accounts
4. **PDF generation** — Use a server-side library (Puppeteer or WeasyPrint) for proper invoice PDFs
5. **Bank integration** — Parse `.csv` / `.xls` bank statement exports for auto-allocation

---

*Built as a portfolio demonstration. All data is fictional.*
