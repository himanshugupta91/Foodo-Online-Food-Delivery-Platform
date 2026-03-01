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


<summary><h2>📖 About the Project</h2></summary>

Foodo is a multi-role, full-stack food delivery platform that enables **customers** to browse restaurants, order food, and pay online via Stripe, while **restaurant owners** manage menus, ingredients, orders, events, and coupons through a dedicated dashboard. A **super admin** panel provides platform-wide user and restaurant management. The backend follows a layered architecture (Controller → Service → Repository) with DTOs, MapStruct mappers, and JWT-based stateless authentication.



---

## ✨ Features

<details>
<summary><h3>👤 Customer</h3></summary>

| Feature | Description |
|---|---|
| Browse & Search | View restaurants, search by name/keyword, filter menu items (veg, seasonal, category) |
| Cart | Add/remove items, update quantities, clear cart, auto-total calculation |
| Orders & Payments | Place orders with Stripe Checkout, verify payments, view order history |
| Reviews & Ratings | Submit reviews, view restaurant reviews, average rating calculation |
| Favorites | Toggle restaurants as favorites |
| Notifications | Real-time notification feed |
| Profile | Manage profile information, add/manage delivery addresses |

</details>

<details>
<summary><h3>🛠 Restaurant Owner (Admin)</h3></summary>

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
</details>

<details>
<summary><h3>👑 Super Admin</h3></summary>

| Feature | Description |
|---|---|
| User Management | View all customers, pending restaurant owner requests, delete users |
| Restaurant Oversight | View all restaurants (paginated), delete restaurants, toggle status |

</details>

---

<details>
<summary><h2>🛠 Tech Stack</h2></summary>


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

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Redux + Redux Thunk** | State management |
| **Tailwind CSS 3** | Utility-first styling |
| **React Router DOM 6** | Client-side routing |
| **Axios** | HTTP client with interceptors & refresh token |
| **Formik + Yup** | Form handling & validation |
| **Lucide React** | Icon library |
| **React Slick** | Carousel/slider components |

</details>

---

### 🔐 Authentication (`/api/v1/auth`) — Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/signin` | Login and get JWT tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/reset-password-request` | Send password reset email |
| `POST` | `/auth/reset-password` | Reset password with token |

### 👤 User (`/api/v1/users`) — Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users/profile` | Get current user profile |
| `POST` | `/users/address` | Add delivery address |

### 🍽 Restaurants (`/api/v1/restaurants`) — Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/restaurants` | List all restaurants (paginated) |
| `GET` | `/restaurants/{id}` | Get restaurant by ID |
| `GET` | `/restaurants/search?keyword=` | Search restaurants |
| `PUT` | `/restaurants/{id}/add-favorites` | Toggle favorite (Auth required) |

### 🍽 Admin Restaurants (`/api/v1/admin/restaurants`) — Owner/Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/restaurants` | Create a restaurant |
| `PUT` | `/admin/restaurants/{id}` | Update restaurant details |
| `DELETE` | `/admin/restaurants/{id}` | Delete a restaurant |
| `PUT` | `/admin/restaurants/{id}/status` | Toggle open/closed |
| `PUT` | `/admin/restaurants/{id}/add-admin` | Add admin to restaurant |
| `GET` | `/admin/restaurants/user` | Get owner's restaurant |
| `GET` | `/admin/restaurants` | List all restaurants (paginated) |

### 🍔 Food / Menu Items (`/api/v1/food`) — Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/food/search?name=` | Search food items |
| `GET` | `/food/restaurant/{restaurantId}` | Get menu by restaurant (filters: vegetarian, seasonal, nonveg, food_category) |

### 🍔 Admin Food (`/api/v1/admin/food`) — Owner/Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/food` | Create food item |
| `DELETE` | `/admin/food/{id}` | Delete food item |
| `GET` | `/admin/food/search?name=` | Search food items |
| `PUT` | `/admin/food/{id}` | Toggle availability |

### 🛒 Cart (`/api/v1`) — Customer

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PUT` | `/cart/add` | Add item to cart |
| `PUT` | `/cart-item/update` | Update cart item quantity |
| `DELETE` | `/cart-item/{id}/remove` | Remove item from cart |
| `GET` | `/cart/` | Get user's cart |
| `GET` | `/cart/total?cartId=` | Get cart total |
| `PUT` | `/cart/clear` | Clear entire cart |
| `GET` | `/carts/{cartId}/items` | Get cart items |

### 📦 Orders (`/api/v1`) — Customer

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/order` | Create order (returns Stripe session URL) |
| `GET` | `/order/user` | Get user's order history |
| `GET` | `/payment/verify?session_id=` | Verify Stripe payment |

### 📦 Admin Orders (`/api/v1/admin`) — Owner/Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/admin/order/restaurant/{restaurantId}` | Get restaurant orders (filter: order_status) |
| `PUT` | `/admin/order/{orderId}/{orderStatus}` | Update order status |
| `DELETE` | `/admin/order/{orderId}` | Cancel/delete order |

### 📁 Categories (`/api/v1/admin`) — Owner/Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/category` | Create category |
| `GET` | `/admin/category/restaurant/{id}` | Get restaurant categories |
| `DELETE` | `/admin/category/{id}` | Delete category |

### 🧂 Ingredients (`/api/v1/admin/ingredients`) — Owner/Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/ingredients/category` | Create ingredient category |
| `POST` | `/admin/ingredients` | Create ingredient item |
| `PUT` | `/admin/ingredients/{id}/stock` | Toggle stock status |
| `GET` | `/admin/ingredients/restaurant/{id}` | Get restaurant ingredients |
| `GET` | `/admin/ingredients/restaurant/{id}/category` | Get ingredient categories |
| `DELETE` | `/admin/ingredients/{id}` | Delete ingredient |
| `DELETE` | `/admin/ingredients/category/{id}` | Delete ingredient category |

### 🎉 Events (`/api/v1`) — Public / Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/events` | Get all events (Public) |
| `POST` | `/admin/events/restaurant/{restaurantId}` | Create event (Admin) |
| `GET` | `/admin/events/restaurant/{restaurantId}` | Get restaurant events (Admin) |
| `DELETE` | `/admin/events/{id}` | Delete event (Admin) |

### ⭐ Reviews (`/api/v1`) — Public / Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/review` | Submit review (Auth required) |
| `DELETE` | `/review/{reviewId}` | Delete review |
| `GET` | `/review/restaurant/{restaurantId}` | Get restaurant reviews (Public) |
| `GET` | `/review/restaurant/{restaurantId}/average-rating` | Get average rating (Public) |

### 🔔 Notifications (`/api/v1`) — Authenticated

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications` | Get user notifications |

### 🎟 Coupons (`/api/v1/admin/coupons`) — Owner/Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/admin/coupons` | Create coupon |
| `GET` | `/admin/coupons` | List all coupons |
| `PUT` | `/admin/coupons/{id}` | Update coupon |
| `DELETE` | `/admin/coupons/{id}` | Delete coupon |

### 👑 Super Admin (`/api/v1/super-admin`) — Super Admin Only

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/super-admin/customers` | Get all customers |
| `GET` | `/super-admin/pending-customers` | Get pending owner requests |
| `DELETE` | `/super-admin/customers/{email}` | Delete user by email |
| `GET` | `/super-admin/restaurants` | Get all restaurants (paginated) |
| `DELETE` | `/super-admin/restaurants/{id}` | Delete restaurant |
| `PUT` | `/super-admin/restaurants/{id}/status` | Toggle restaurant status |

</details>

---

<details>
<summary><h2>📂 Project Structure</h2></summary>


```
Foodo/
├── backend-spring boot/                 # Spring Boot Backend
│   ├── src/main/java/com/himanshu/
│   │   ├── HimanshuFoodApplication.java # Main entry point
│   │   ├── config/                      # Security, CORS, Stripe, OpenAPI configs
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── StripeConfig.java
│   │   │   ├── OpenApiConfig.java
│   │   │   └── security/               # JWT filter, token provider, entry point
│   │   ├── controller/                  # 16 REST controllers
│   │   ├── service/                     # Service interfaces + 16 implementations
│   │   ├── repository/                  # 16 JPA repositories
│   │   ├── model/
│   │   │   ├── entity/                  # 19 JPA entities
│   │   │   └── enums/                   # UserRole, OrderStatus
│   │   ├── dto/
│   │   │   ├── request/                 # 18 request DTOs
│   │   │   ├── response/               # 18 response DTOs
│   │   │   └── ApiResponse.java        # Unified API response wrapper
│   │   ├── mapper/                      # 9 MapStruct mappers
│   │   ├── exception/                   # Custom exceptions + global handler
│   │   └── util/                        # Utility classes
│   └── pom.xml                          # Maven dependencies
│
├── src/                                 # React Frontend
│   ├── admin/                           # Admin dashboard components
│   ├── components/                      # Shared UI components (Navbar, etc.)
│   ├── config/                          # API base URL, Axios config
│   ├── customers/                       # Customer-facing pages
│   ├── data/                            # Static data/constants
│   ├── routers/                         # React Router configuration
│   ├── state/                           # Redux store
│   │   ├── authentication/              # Auth actions, reducers
│   │   ├── customers/                   # Cart, Menu, Orders, Restaurant, Review
│   │   ├── admin/                       # Coupon, Ingredients, Order, Restaurant
│   │   ├── superAdmin/                  # Super admin state
│   │   └── store/                       # Redux store setup
│   ├── superAdmin/                      # Super admin pages
│   └── theme/                           # Dark/Light theme config
│
├── package.json                         # Frontend dependencies
└── tailwind.config.js                   # Tailwind CSS configuration
```

</details>

---

<details>
<summary><h2>⚡ Getting Started</h2></summary>


### Prerequisites

- **Java 21** (JDK)
- **Maven 3.8+**
- **Node.js 18+** & npm
- **MySQL 8.0**
- **Stripe Account** (for payment testing)

### Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/himanshugupta91/Foodo-food-ordering-System.git
cd Foodo-food-ordering-System/backend-spring\ boot

# 2. Configure application.properties
#    Set your MySQL credentials, JWT secret, Stripe API keys, and SMTP config

# 3. Create the database
mysql -u root -p -e "CREATE DATABASE foodo_db;"

# 4. Build and run
./mvnw spring-boot:run
# Backend starts at http://localhost:5467
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd Foodo-food-ordering-System

# 2. Install dependencies
npm install

# 3. Start development server
npm start
# Frontend starts at http://localhost:3000
```

### Environment Variables (Backend — `application.properties`)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/foodo_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
app.jwt.secret=your_jwt_secret_key
app.jwt.expiration=86400000

# Stripe
stripe.api.key=sk_test_your_stripe_key

# Mail (for password reset)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email
spring.mail.password=your_app_password
```

</details>

---

---

<div align="center">
  <b>⭐ Star this repo if you found it useful! ⭐</b>
</div>
