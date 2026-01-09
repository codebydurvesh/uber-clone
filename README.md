# 🚗 Uber Clone - Full Stack MERN Application

A comprehensive ride-hailing application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project replicates core Uber functionalities including real-time ride booking, live tracking, and driver-rider matching.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/React-19-blue)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

This Uber Clone is a full-featured ride-hailing platform that connects riders with drivers in real-time. The application supports two types of users:

- **Users (Riders)**: Can book rides, track their captain's location, and manage their trips
- **Captains (Drivers)**: Can accept ride requests, navigate to pickup/destination, and manage earnings

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based authentication for users and captains |
| 📍 **Location Search** | Autocomplete location search using Nominatim API |
| 🚕 **Ride Booking** | Book rides with multiple vehicle options |
| 💰 **Fare Estimation** | Dynamic fare calculation based on distance |
| 🗺️ **Live Tracking** | Real-time location tracking with Leaflet maps |
| 🔔 **Real-time Updates** | WebSocket-based notifications for ride status |
| 📱 **Responsive Design** | Mobile-first, works on all devices |

### User Features
- ✅ Register and login
- ✅ Search pickup and destination locations
- ✅ View fare estimates for different vehicle types
- ✅ Book rides and track captain in real-time
- ✅ View ride history

### Captain Features
- ✅ Register with vehicle details
- ✅ Receive ride requests in real-time
- ✅ Accept or decline ride requests
- ✅ Navigate to pickup and destination
- ✅ Complete rides and track earnings

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Navigation |
| Socket.IO Client | Real-time Communication |
| Leaflet | Interactive Maps |
| GSAP | Animations |
| Axios | HTTP Client |
| Remix Icons | Iconography |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js 5 | Web Framework |
| MongoDB | Database |
| Mongoose 9 | ODM |
| Socket.IO | WebSocket Server |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Express Validator | Input Validation |

### External APIs
| API | Purpose |
|-----|---------|
| Nominatim (OpenStreetMap) | Geocoding & Location Search |
| OSRM | Route Calculation |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React Frontend                         │    │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │    │
│  │  │ Pages   │  │Components│  │ Context │  │  Hooks   │  │    │
│  │  └─────────┘  └──────────┘  └─────────┘  └──────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP/REST │ WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Server Layer                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                  Express.js Backend                       │    │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐  │    │
│  │  │ Routes  │  │Controllers│  │Services │  │ Models   │  │    │
│  │  └─────────┘  └──────────┘  └─────────┘  └──────────┘  │    │
│  │                                                          │    │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐  │    │
│  │  │   Socket.IO     │  │      Middlewares            │  │    │
│  │  └─────────────────┘  └─────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Data Layer                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                      MongoDB                              │    │
│  │  ┌─────────┐  ┌──────────┐  ┌─────────────────────────┐ │    │
│  │  │  Users  │  │ Captains │  │         Rides           │ │    │
│  │  └─────────┘  └──────────┘  └─────────────────────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
uber-clone/
├── backend/                    # Express.js Backend
│   ├── controllers/            # Request handlers
│   │   ├── captain.controller.js
│   │   ├── maps.controller.js
│   │   ├── ride.controller.js
│   │   └── user.controller.js
│   ├── db/                     # Database configuration
│   │   └── db.js
│   ├── middlewares/            # Custom middlewares
│   │   └── auth.middleware.js
│   ├── models/                 # Mongoose schemas
│   │   ├── captain.model.js
│   │   ├── ride.model.js
│   │   └── user.model.js
│   ├── routes/                 # API routes
│   │   ├── captain.route.js
│   │   ├── maps.route.js
│   │   ├── ride.route.js
│   │   └── user.route.js
│   ├── services/               # Business logic
│   │   ├── maps.service.js
│   │   ├── ride.service.js
│   │   └── user.service.js
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── socket.js               # Socket.IO configuration
│   └── package.json
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   ├── assets/             # Static assets
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── public/                 # Public assets
│   ├── vite.config.js          # Vite configuration
│   └── package.json
│
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uber-clone.git
   cd uber-clone
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/uber-clone
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

   Create `.env` file in frontend directory:
   ```env
   VITE_BASE_URL=http://localhost:3000
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users/register` | Register new user |
| POST | `/users/login` | User login |
| GET | `/users/profile` | Get user profile |
| GET | `/users/logout` | User logout |
| POST | `/captains/register` | Register new captain |
| POST | `/captains/login` | Captain login |
| GET | `/captains/profile` | Get captain profile |
| GET | `/captains/logout` | Captain logout |

### Ride Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/rides/create` | Create new ride |
| GET | `/rides/get-fare` | Get fare estimate |
| POST | `/rides/confirm` | Confirm ride |
| POST | `/rides/start-ride` | Start ride (captain) |
| POST | `/rides/end-ride` | End ride (captain) |

### Maps Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/maps/suggestions` | Get location suggestions |
| GET | `/maps/distance-time` | Get distance and time |
| GET | `/maps/coordinates` | Get coordinates for address |

> 📖 For detailed API documentation, see [Backend README](./backend/README.md)

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_BASE_URL` | Backend API URL | Yes |

## 📱 Screenshots

> Add your application screenshots here

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🚧 Roadmap

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Push notifications
- [ ] Ride history and receipts
- [ ] Rating system for riders and captains
- [ ] Admin dashboard
- [ ] Multiple payment methods
- [ ] Ride scheduling
- [ ] Promo codes and discounts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgements

- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Nominatim](https://nominatim.org/) for geocoding
- [OSRM](http://project-osrm.org/) for routing
- [Leaflet](https://leafletjs.com/) for maps
- [Socket.IO](https://socket.io/) for real-time communication

---

