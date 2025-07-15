## 🛂 Seller & Buyer Marketplace

This project is a full-stack application for buying , selling and recycling  electronic items. It includes a **frontend** for users to browse and list products and a **backend** for handling authentication, product listings, and transactions.

---

## 📌 Features

- User authentication (Login/Signup)
- Listing electronic items for sale
- Buying items from sellers
- Secure payment processing
- Product filtering and sorting
- Responsive UI

---

## 📚 Project Structure

```
/seller-buyer-marketplace
  ├── backend/   # Node.js + Express + Database
  ├── frontend/  # React/Next.js + Tailwind CSS
  ├── README.md
```

---

## 🛠️ Tech Stack

### **Frontend**
- React.js / Next.js
- Tailwind CSS / Material UI
- Redux / Context API
- Axios for API calls

### **Backend**
- Node.js + Express.js
- MongoDB (Mongoose ORM) / PostgreSQL (Prisma ORM)
- JWT Authentication
- Cloudinary / Firebase for image uploads

---

## 🚀 Installation & Setup

### **1⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/seller-buyer-marketplace.git
cd seller-buyer-marketplace
```

---

### **2⃣ Backend Setup**
```sh
cd backend
npm install
```
#### **Set up environment variables**
Create a `.env` file in the `backend/` directory and add:
```sh
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
CLOUDINARY_API_KEY=your-cloudinary-key
```
#### **Run the Backend Server**
```sh
npm run dev 
```

---

### **3⃣ Frontend Setup**
```sh
cd ../frontend
npm install
```
#### **Run the Frontend**
```sh
npm run dev
```

---

## ⚡ Usage

1. Visit `http://localhost:3000/` for the frontend.
2. Use `h${import.meta.env.VITE_API_BASE_URL}/api/` for backend API routes.
3. Register or login to list and buy products.

---

## 🛠️ Environment Variables

Ensure you configure your `.env` files properly for both **frontend** and **backend**.

---






