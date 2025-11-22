# WarungFlow

Access it here [Warung Flow](https://warungflow-nh8g.vercel.app/)

A simple POS and inventory management system for small shops (UMKM), built with **Next.js Fullstack + PostgreSQL**, designed with a strong **problem-solving mindset** instead of just CRUD. This project demonstrates authentication security, inventory logic, transactional consistency, and clear user experience.
---

## Problem Background
Many small convenience stores still record:
- stock levels in notebooks,
- sales manually on paper or messaging apps,
- purchases only when shelves "look empty."

As a result:
- Owners struggle to answer simple questions:
  - “How much did I earn today?”
  - “Which product sells the most?”
  - “Which items are almost out of stock?”
- Stock runs out during peak hours.
- No system warns them before shortages happen.

**The core problem:**

> Small shops need a simple digital tool to record sales, track inventory, and warn them early when stock is low — without requiring technical knowledge.

---

## Proposed Solution: WarungFlow
WarungFlow focuses on clarity, ease of use, and business logic that reflects real workflow:

| Feature | Benefit |
|--------|---------|
| Product management | Keep stock and prices organized |
| Smart product alert | Automatic low-stock warnings |
| Point-of-sale (cart-based sale) | Record transactions quickly |
| Daily dashboard | See revenue, transactions, and critical stock |
| Role-based access | Secure separation between **admin** and **cashier** |
| Secure authentication | HttpOnly cookies, short-lived access token + refresh token |

This is not a basic CRUD — the system **automatically updates stock on sales**, validates quantities, and refreshes user sessions securely.

---

## 🧠 Problem Solving Approach 🧠

### 1. Understanding User Needs
User interviews & observation lead to key insights:
- Owners look for daily performance summary, not rows of raw data.
- Cashiers need minimal clicks to register a transaction.
- Stock alerts must be **simple and visible**.

### 2. Translating Needs Into Behavior
| Identified Issue | System Behavior |
|---|---|
| Owners forget stock monitoring | Warn them when stock ≤ safety threshold |
| Cashiers need fast checkout | Cart-based sale entry and instant validation |
| Different access levels | Separate permissions (admin vs cashier) |
| Token expiring causes logout frustration | Auto-refresh token strategy |

---

## Key Features

### Authentication & Role Control
- Register admin or cashier
- Login with JWT access + refresh token
- Secure HttpOnly cookies usage
- Automatic token refresh when expired
- Logout clears cookies and refresh token in database

### Product Management
- Create products with:
  - Name
  - Category
  - Price
  - Stock
  - Low-stock threshold
- Table highlighting:
  - **Low stock (warning badge)**
  - **Healthy inventory status**
- Search bar for quick filtering

### Point‑of‑Sale (Transactions)
- Select products, input quantity, add to cart
- Stock validation: cannot sell more than available
- Saving a sale automatically:
  - Records sale
  - Deducts stock
  - Stores individual sale items

### Dashboard Overview
- Filter by date
- See:
  - Total sales
  - Transaction count
  - Low-stock products
- Business-focused layout (not developer-focused)

---

## User Roles
| Role | Permissions |
|------|------------|
| Admin | Full access (products, dashboard, sales) |
| Cashier | Sales entry + product view only |

---

## Tech Stack & Architecture
- **Next.js (App Router, fullstack) + TypeScript**
- **PostgreSQL + Prisma ORM**
- **JWT (Access + Refresh tokens)**
- **HttpOnly Cookies** (secure session handling)
- **TailwindCSS** for modern UI styling
- **REST API endpoints** under `/api/*`

---

## Database Schema (Prisma Overview)
```prisma
model User {
  id                  Int      @id @default(autoincrement())
  name                String
  email               String   @unique
  passwordHash        String
  role                String   @default("admin")
  createdAt           DateTime @default(now())

  refreshToken        String?
  refreshTokenExpires DateTime?

  sales               Sale[]
}

model Product {
  id                Int      @id @default(autoincrement())
  name              String
  category          String?
  price             Int
  stock             Int
  lowStockThreshold Int      @default(0)
  createdAt         DateTime @default(now())

  saleItems         SaleItem[]
}

model Sale {
  id         Int        @id @default(autoincrement())
  userId     Int
  totalPrice Int
  createdAt  DateTime   @default(now())

  user       User       @relation(fields: [userId], references: [id])
  items      SaleItem[]
}

model SaleItem {
  id        Int     @id @default(autoincrement())
  saleId    Int
  productId Int
  quantity  Int
  price     Int

  sale      Sale    @relation(fields: [saleId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}

## 🌐 API Summary
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Create user account |
| `/api/auth/login` | POST | Login & set tokens |
| `/api/auth/logout` | POST | Clear session |
| `/api/auth/me` | GET | Return logged-in user |
| `/api/auth/refresh` | POST | Refresh access token |
| `/api/products` | GET/POST | View / Add product (role restricted) |
| `/api/sales` | GET/POST | View / create transactions |
| `/api/dashboard/today` | GET | Daily business insights |

---

## How to Run Locally
```bash
git clone <repo-url>
cd warungflow
npm install
```

Set environment variables:
```env
DATABASE_URL=postgresql://<user>:<pass>@localhost:5432/warungflow
JWT_ACCESS_SECRET=<random-string>
JWT_REFRESH_SECRET=<random-string>
```

Run database setup:
```bash
npx prisma db push
```

Start development server:
```bash
npm run dev
```

Open browser: `http://localhost:3000`

---

## Summary for Recruiters
This project demonstrates:
- Fullstack engineering skills
- Real business logic (not a generic CRUD)
- Authentication + authorization security
- Good UX decisions 
- Clean data modeling and workflow thinking

> If you'd like a walkthrough, I can explain the system architecture, decisions, and trade‑offs.

### If this project interests you, feel free to reach out or open an issue.

