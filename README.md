
# 🍽️ QuickEats – Food Delivery App (MERN Stack)

**QuickEats** is a modern, full-featured online food ordering platform built with the **MERN stack (MongoDB, Express.js, React, Node.js)**. It delivers a seamless experience for both users and administrators—from browsing menus and placing orders to managing products and tracking deliveries.

---

## 🚀 Live Demo

- 👨‍🍳 **User Panel:** [LIVE LINK](https://food-delivery-frontend-onfe.onrender.com)  
- 🛠️ **Admin Panel:** [LIVE LINK](https://food-delivery-admin-yjw2.onrender.com)  

---

## ✨ Features

### 👥 User Panel
- 🔐 Secure Signup/Login with **JWT Authentication**
- 🍽️ Browse and filter food items
- 🛒 Add to Cart & Place Orders
- 💳 Stripe Payment Integration
- 📦 Order Tracking Dashboard
- 🔓 Logout Functionality
- 🌐 Fully responsive design with beautiful modals and alerts

### 🛠️ Admin Panel
- 🔐 Admin Authentication
- 📦 View and manage user orders
- 🍔 CRUD operations for food/products
- 🔍 Filter/Search food items
- 🎯 Role-Based Access Control (RBAC)
- 🎨 Responsive dashboard with intuitive controls

---

## 🔐 Authentication & Security

- **JWT** for secure session management
- **Bcrypt** for password hashing
- **RBAC** for user/admin separation
- **Stripe** for safe and smooth payments
- **Multer** for image uploads

---

## 🛠 Tech Stack

| Layer       | Technologies                  |
|-------------|-------------------------------|
| Frontend    | React, Vite, CSS              |
| Backend     | Node.js, Express.js           |
| Database    | MongoDB, Mongoose             |
| Auth/Security | JWT, Bcrypt, RBAC           |
| Payments    | Stripe                        |
| File Upload | Multer                        |

---

## ⚙️ Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/QuickEats.git
cd QuickEats
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Admin Panel
cd ../admin
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Set Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
JWT_SECRET=YOUR_SECRET_TEXT
SALT=YOUR_SALT_VALUE
MONGO_URL=YOUR_DATABASE_URL
STRIPE_SECRET_KEY=YOUR_STRIPE_KEY
```

### 4. Update URLs in the Following Files:

| File Path                               | Line to Edit                            |
|----------------------------------------|------------------------------------------|
| `admin/src/App.jsx`                    | `const url = YOUR_BACKEND_URL`          |
| `frontend/src/context/StoreContext.js` | `const url = YOUR_BACKEND_URL`          |
| `backend/controllers/orderController.js` | `const frontend_url = YOUR_FRONTEND_URL` |

---

## ▶️ Run the Application

```bash
# Backend
cd backend
npm start   # or nodemon server.js

# Admin Panel
cd ../admin
npm start

# Frontend
cd ../frontend
npm start
```

---

## 🚀 Deployment

- 🌍 Hosted on **Render**
- 🖥 Frontend and Admin built with **Vite**
- ☁️ Backend connected to **MongoDB Atlas**

---

## 🤝 Contributing

We welcome contributions!  
Please follow these steps:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/YourFeature

# 3. Commit your changes
git commit -m 'Add new feature'

# 4. Push the branch
git push origin feature/YourFeature

# 5. Open a Pull Request
```

---

## 📬 Feedback

If you have any feedback or issues, please [open an issue](https://github.com/YOUR_USERNAME/QuickEats/issues). We'd love to hear from you!

---

## 📌 Topics

`nodejs` `express` `mongodb` `reactjs` `mongoose` `jwt-authentication` `stripe-payments` `rest-api` `vite` `mern-stack` `food-delivery-app` `responsive-design`

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
