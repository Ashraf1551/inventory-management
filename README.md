# Inventory Management System

A web-based tool to track every item in stock across multiple storage locations — a digital ledger for your warehouse(s).

---

## Features

### 1. Manage Your Catalog

- **Products** — Add products with a unique SKU (like a barcode), name, description, and category.
- **Categories** — Group products for easier organization (e.g. "Electronics", "Raw Materials").
- Products and categories can be marked **active or inactive** (no permanent deletion — just hide them).

### 2. Manage Locations

- **Warehouses** — Set up physical or virtual storage locations with a code, name, and address.
- The system knows exactly how much of each product is in each warehouse.

### 3. Manage Suppliers

- Keep a directory of **suppliers** with contact details.
- Each purchase receipt (stock coming in) is linked to a supplier.

### 4. Track All Stock Movements

Three ways stock moves in or out:

| Movement | What it does |
|---|---|
| **Adjustment** | Manually increase or decrease stock at a specific warehouse (e.g. write off damaged goods, or add found units). |
| **Transfer** | Move stock from one warehouse to another (e.g. shift 50 units from main warehouse to a retail store). |
| **Purchase Receipt** *(coming soon)* | Record stock received from a supplier. |

Every movement is **permanently logged** — you can always look back at the full history.

### 5. Check Stock Levels & Reports

- **Inventory Dashboard** — See current stock quantities for every product at every warehouse.
- **Low Stock Report** — Automatically highlights products running low (based on a threshold you set per product), sorted with the most critical items first.
- **Movement History** — A full audit trail filterable by date range, movement type, product, or warehouse.

---

## Key Business Rules

- **Stock can never go negative** — the system won't let you adjust, transfer, or issue more stock than you actually have.
- **Every movement is recorded** — no way to change stock without leaving a trace.
- **No permanent deletions** — items are marked inactive, so historical data stays intact.
- **No login required** — designed for internal back-office use (user accounts not yet set up).

---

## What's Planned (Not Yet Built)

- Purchase receipts (recording goods received from suppliers)
- Sales issues (recording stock sold or shipped to customers)
- User accounts and permissions

---

## Tech Stack (for developers)

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Database | Neon Serverless PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
