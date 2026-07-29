<div align="center">

# 🚀 BidSync

### A Real-Time Online Auction Platform Built with the MERN Stack

Live bidding • Secure Authentication • Cloud Image Uploads • Responsive UI

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens)

</div>

---

# 📖 Overview

**BidSync** is a full-stack MERN application that enables users to create, participate in, and manage online auctions with **real-time bid synchronization**.

Unlike traditional marketplace applications, BidSync uses **Socket.IO** to instantly broadcast new bids to every connected bidder, ensuring everyone sees the latest highest bid without refreshing the page.

Whether you're selling collectibles, electronics, vehicles, or luxury items, BidSync delivers a seamless live auction experience.

---

# ✨ Features

## 👤 Authentication
- Secure JWT Authentication
- User Registration & Login
- Protected Routes

## 🏷️ Auction Management
- Create Auctions
- Edit/Delete Auctions
- Upload Multiple Images
- Category-wise Listings
- Automatic Auction Status

## ⚡ Real-Time Bidding
- Live Bid Updates
- Instant Highest Bid Synchronization
- Real-Time Notifications
- Socket.IO Event Broadcasting

## 📊 Dashboard
- Seller Dashboard
- Won Auctions
- Bid History
- User Profile

## ☁️ Media Storage
- Cloudinary Image Upload
- Multiple Product Images
- Optimized Cloud Storage

---

# 🛠 Tech Stack

| Frontend | Backend | Database | Real-Time | Cloud |
|-----------|----------|-----------|-----------|--------|
| React | Node.js | MongoDB Atlas | Socket.IO | Cloudinary |
| Vite | Express | Mongoose | WebSockets | Render |
| Axios | JWT | | | |

---

# 🧩 Architecture

```
React Frontend
       │
       ▼
Express REST API
       │
       ├──────── MongoDB Atlas
       │
       ├──────── Cloudinary
       │
       └──────── Socket.IO
                     │
          Real-Time Bid Updates
```

---

# 📸 Screenshots

- Home Page
- <img width="1911" height="901" alt="image" src="https://github.com/user-attachments/assets/3762137a-af20-4045-9eab-81b59136ccb3" />
<img width="1893" height="891" alt="image" src="https://github.com/user-attachments/assets/d69f4191-19c3-4eda-b984-2390a76635ae" />


- Auction Details
- <img width="1911" height="907" alt="image" src="https://github.com/user-attachments/assets/c31122e8-6e2b-4fa8-8cf2-697edc49ab94" />
<img width="1906" height="887" alt="image" src="https://github.com/user-attachments/assets/ed6c4b71-a522-45fe-b667-0f284af7e3a5" />


- Create Auction
- <img width="1898" height="892" alt="image" src="https://github.com/user-attachments/assets/ea7d8c80-7472-4b1e-898e-10aea65d653a" />
<img width="1917" height="706" alt="image" src="https://github.com/user-attachments/assets/aa8c66b4-248c-40b4-a282-7585112eaf2f" />


- Dashboard
- <img width="1896" height="908" alt="image" src="https://github.com/user-attachments/assets/d46f2ba2-f8e2-4d1b-bd2d-406cfcb89ce9" />

- Live Bidding
- <img width="1911" height="903" alt="image" src="https://github.com/user-attachments/assets/f74f0e77-47a1-4e52-8b96-b3272eeefabb" />

- Won Auctions
<img width="1912" height="915" alt="image" src="https://github.com/user-attachments/assets/e7671a30-d0bd-48cf-9049-81bd74f6dfc8" />

---

# 🚀 Live Demo

### Frontend

https://bid-sync-six.vercel.app

### Backend API

https://bidsync-ntz3.onrender.com

---

# ⚙️ Getting Started

## Clone Repository

```bash
git clone https://github.com/yourusername/BidSync.git
```

## Install Dependencies

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

# 🔐 Environment Variables

### Client

```env
VITE_API_URL=
VITE_SOCKET_URL=
```

### Server

```env
MONGO_URI=
JWT_SECRET=
CLIENT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# ⚡ Socket.IO Workflow

```
User Places Bid
        │
        ▼
Backend Validates Bid
        │
        ▼
Save Bid to MongoDB
        │
        ▼
Socket.IO emits event
        │
        ▼
Every connected bidder
receives updated highest bid
instantly
```

---

# 📁 Folder Structure

```
BidSync
│
├── client
│   ├── components
│   ├── pages
│   ├── services
│   ├── assets
│   └── hooks
│
└── server
    ├── controllers
    ├── routes
    ├── middleware
    ├── services
    ├── sockets
    ├── models
    └── utils
```

---

# 🎯 Future Enhancements

- Email Notifications
- Razorpay Integration
- Watchlist
- AI Price Prediction
- Auction Recommendations
- Redis Caching
- Admin Dashboard
- Analytics

---

# 📚 What I Learned

Building BidSync strengthened my understanding of:

- Full-Stack MERN Development
- REST API Design
- JWT Authentication
- Real-Time Communication using Socket.IO
- Event-Driven Architecture
- Cloudinary Image Management
- MongoDB Data Modeling
- Production Deployment on Render & Vercel
- Debugging Production Issues

---

# 🤝 Contributing

Contributions, suggestions, and feature requests are always welcome.

Feel free to fork the repository and submit a Pull Request.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
