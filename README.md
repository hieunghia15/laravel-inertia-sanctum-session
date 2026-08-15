# Laravel 13 + ReactJS + Inertia.js + TypeScript

## 📋 Giới thiệu

Project được xây dựng với kiến trúc:

- **Backend:** Laravel 13
- **Frontend:** ReactJS
- **Routing / SPA:** Inertia.js
- **Language:** TypeScript
- **Authentication:** Laravel Sanctum
- **Authentication mechanism:** Session Cookie
- **Database:** MYSQL

Frontend ReactJS sẽ gọi các API được cung cấp bởi Laravel.

Authentication sử dụng **Laravel Sanctum với session-based authentication thông qua HTTP Cookie**.

Laravel chịu trách nhiệm quản lý session và authentication cookie.

---

# 🛠️ Tech Stack

| Công nghệ | Phiên bản |
|---|---|
| PHP | >= 8.5.9 |
| Laravel | 13.17 |
| ReactJS | 19.2.0 |
| TypeScript | 5.7.2 |
| Inertia.js | 3.0.0 |
| Laravel Sanctum | Latest compatible |
| Node.js | >= 26 |
| npm / pnpm | Latest |
| Database | MySQL / PostgreSQL |

---

# 🏗️ Kiến trúc hệ thống

Project sử dụng mô hình:

```text
┌───────────────────────────────┐
│           ReactJS             │
│          TypeScript           │
│                               │
│  Login / Register / Logout    │
│  Get User Info                │
└───────────────┬───────────────┘
                │
                │ HTTP Request
                │ Cookie
                ▼
┌───────────────────────────────┐
│          Laravel 13           │
│                               │
│       API Controllers         │
│       Request Validation      │
│       Authentication          │
│       Business Logic          │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│      Laravel Sanctum          │
│                               │
│    Session-based Auth         │
│       HTTP Cookie             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           Database            │
│                               │
│            users              │
│           sessions            │
└───────────────────────────────┘
