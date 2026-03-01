<div align="center">

# 🍔 Foodo — Food Ordering & Delivery System

**A production-grade, full-stack food ordering platform built with Spring Boot & React**

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-State-764ABC?style=for-the-badge&logo=redux&logoColor=white)

</div>

---

## 📖 About the Project

Foodo is a multi-role, full-stack food delivery platform that enables **customers** to browse restaurants, order food, and pay online via Stripe, while **restaurant owners** manage menus, ingredients, orders, events, and coupons through a dedicated dashboard. A **super admin** panel provides platform-wide user and restaurant management. The backend follows a layered architecture (Controller → Service → Repository) with DTOs, MapStruct mappers, and JWT-based stateless authentication.

---

## ✨ Features

### 👤 Customer

| Feature | Description |
|---|---|
| Browse & Search | View restaurants, search by name/keyword, filter menu items (veg, seasonal, category) |
| Cart | Add/remove items, update quantities, clear cart, auto-total calculation |
| Orders & Payments | Place orders with Stripe Checkout, verify payments, view order history |
| Reviews & Ratings | Submit reviews, view restaurant reviews, average rating calculation |
| Favorites | Toggle restaurants as favorites |
| Notifications | Real-time notification feed |
| Profile | Manage profile information, add/manage delivery addresses |

### 🛠 Restaurant Owner (Admin)

| Feature | Description |
|---|---|
| Restaurant CRUD | Create, update, delete restaurant; toggle open/closed status |
| Menu Management | Create/delete food items, update availability status |
| Category Management | Create/delete food categories per restaurant |
| Ingredient Management | Manage ingredient categories & items, toggle stock in/out |
| Order Management | View restaurant orders (filterable by status), update order status, cancel orders |
| Events | Create and manage restaurant promotional events |
| Coupons | Create, update, delete discount coupons |
| Admin Delegation | Add additional admins to a restaurant |

### 👑 Super Admin

| Feature | Description |
|---|---|
| User Management | View all customers, pending restaurant owner requests, delete users |
| Restaurant Oversight | View all restaurants (paginated), delete restaurants, toggle status |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Java 21** | Core language |
| **Spring Boot 3.3** | Application framework |
| **Spring Security** | Authentication & authorization (JWT + BCrypt) |
| **Spring Data JPA** | ORM & database access |
| **MySQL 8** | Relational database |
| **Stripe API** | Payment processing |
| **MapStruct 1.6** | DTO ↔ Entity mapping |
| **Lombok** | Boilerplate reduction |
| **Jakarta Validation** | Request validation |
| **SpringDoc OpenAPI** | API documentation (Swagger UI) |
| **Spring Mail** | Email notifications (password reset) |
| **Maven** | Build tool |

---

<div align="center">
  <b>⭐ Star this repo if you found it useful! ⭐</b>
</div>
