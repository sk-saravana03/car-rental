# 🚗 Car Rental Web App

A full-stack **Car Rental Booking** application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This app allows users to browse, book, and manage car rentals, while admins can manage inventory, users, and bookings.

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS / Bootstrap  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Authentication**: JWT-based Auth  
- **Payment Integration**: Stripe API  
- **Other Tools**: Cloudinary (for car images), dotenv, GitHub Actions (optional)

## ✨ Features

### 👤 User
- Register & login (JWT auth)  
- Browse available cars  
- Filter/search by location, type, brand, etc.  
- Book car with custom dates  
- Online payment via Stripe  
- Booking history  

### 🛠 Admin
- Add / Edit / Delete car listings  
- View all bookings  
- Manage users  
- Upload car images  

## 🚀 Getting Started

### Prerequisites

- Node.js  
- MongoDB  
- Git  

### Installation

1. Clone the repo:
```bash
   git clone https://github.com/sk-saravana03/car-rental.git
   cd car-rental
````

2. Install frontend and backend dependencies:

```bash
   cd client
   npm install

   cd ../server
   npm install
```

3. Create `.env` file in `server/` with:

```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_key
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
```

4. Run development server:

```bash
   # Terminal 1
   cd server
   npm run dev

   # Terminal 2
   cd client
   npm start
```

## 📦 Folder Structure

```
car-rental/
├── client/          # React Frontend
├── server/          # Express Backend
├── README.md
└── .gitignore
```
## 📃 License

This project is licensed under the MIT License.

```
