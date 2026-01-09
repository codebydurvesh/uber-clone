# Uber Clone - Frontend

A modern, feature-rich ride-hailing application frontend built with React, Vite, and Tailwind CSS. This application provides a seamless experience for both users (riders) and captains (drivers).

## 🚀 Features

### User Features

- **User Authentication** - Secure login and signup functionality
- **Location Search** - Debounced location search with autocomplete suggestions
- **Ride Booking** - Book rides with pickup and destination selection
- **Vehicle Selection** - Choose from different vehicle types with fare estimates
- **Real-time Tracking** - Live tracking of captain's location during rides
- **Ride Status Updates** - Real-time updates via WebSocket connection

### Captain Features

- **Captain Authentication** - Separate login and signup for drivers
- **Ride Requests** - Receive and accept ride requests in real-time
- **Live Navigation** - Real-time route display with distance and duration
- **Ride Management** - Start, track, and complete rides

### Technical Features

- **Real-time Communication** - Socket.IO integration for live updates
- **Interactive Maps** - Leaflet maps with custom markers and route polylines
- **Smooth Animations** - GSAP-powered animations for enhanced UX
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Protected Routes** - Authentication wrappers for secure access

## 🛠️ Tech Stack

| Category        | Technology              |
| --------------- | ----------------------- |
| **Framework**   | React 19.2              |
| **Build Tool**  | Vite (Rolldown)         |
| **Styling**     | Tailwind CSS 4.1        |
| **Routing**     | React Router DOM 7.11   |
| **HTTP Client** | Axios 1.13              |
| **Maps**        | Leaflet & React-Leaflet |
| **Animations**  | GSAP 3.14               |
| **Real-time**   | Socket.IO Client 4.8    |
| **Icons**       | Remix Icons             |

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, fonts, etc.
│   ├── components/             # Reusable UI components
│   │   ├── CaptainDetails.jsx      # Captain profile and stats
│   │   ├── ConfirmRide.jsx         # Ride confirmation panel
│   │   ├── ConfirmRidePopUp.jsx    # Ride confirmation popup for captains
│   │   ├── FinishRide.jsx          # Complete ride component
│   │   ├── LiveTracking.jsx        # Real-time map tracking
│   │   ├── LocationSearchPanel.jsx # Location autocomplete panel
│   │   ├── LookingForDriver.jsx    # Driver search animation
│   │   ├── RidePopUp.jsx           # Ride request popup for captains
│   │   └── WaitingForDriver.jsx    # Waiting status component
│   ├── context/                # React Context providers
│   │   ├── CaptainContext.jsx      # Captain state management
│   │   ├── SocketContext.jsx       # WebSocket connection
│   │   └── UserContext.jsx         # User state management
│   ├── hooks/                  # Custom React hooks
│   │   └── useLocationServices.js  # Location search & distance calculation
│   ├── pages/                  # Page components
│   │   ├── CaptainHome.jsx         # Captain dashboard
│   │   ├── CaptainLogin.jsx        # Captain login page
│   │   ├── CaptainLogout.jsx       # Captain logout handler
│   │   ├── CaptainProtectWrapper.jsx # Captain route protection
│   │   ├── CaptainRiding.jsx       # Captain's active ride view
│   │   ├── CaptainSignup.jsx       # Captain registration
│   │   ├── Home.jsx                # User home/booking page
│   │   ├── NotFoundPage.jsx        # 404 error page
│   │   ├── Riding.jsx              # User's active ride view
│   │   ├── Start.jsx               # Landing page
│   │   ├── UserLogin.jsx           # User login page
│   │   ├── UserLogout.jsx          # User logout handler
│   │   ├── UserProtectWrapper.jsx  # User route protection
│   │   └── UserSignup.jsx          # User registration
│   ├── App.jsx                 # Main app with routes
│   ├── App.css                 # Global app styles
│   ├── index.css               # Base styles
│   └── main.jsx                # App entry point
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── package.json                # Dependencies and scripts
```

## 🚦 Routes

| Path              | Component     | Access              | Description                |
| ----------------- | ------------- | ------------------- | -------------------------- |
| `/`               | Start         | Public              | Landing page               |
| `/login`          | UserLogin     | Public              | User login                 |
| `/signup`         | UserSignup    | Public              | User registration          |
| `/home`           | Home          | Protected (User)    | User dashboard & booking   |
| `/riding`         | Riding        | Protected (User)    | Active ride view           |
| `/user/logout`    | UserLogout    | Protected (User)    | User logout                |
| `/captain-login`  | CaptainLogin  | Public              | Captain login              |
| `/captain-signup` | CaptainSignup | Public              | Captain registration       |
| `/captain-home`   | CaptainHome   | Protected (Captain) | Captain dashboard          |
| `/captain-riding` | CaptainRiding | Protected (Captain) | Active ride (captain view) |
| `/captain/logout` | CaptainLogout | Protected (Captain) | Captain logout             |
| `*`               | NotFoundPage  | Public              | 404 page                   |

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Backend server running (see backend README)

### Steps

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the frontend root:

   ```env
   VITE_BASE_URL=http://localhost:3000
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📜 Available Scripts

| Script    | Command           | Description              |
| --------- | ----------------- | ------------------------ |
| `dev`     | `npm run dev`     | Start development server |
| `build`   | `npm run build`   | Build for production     |
| `preview` | `npm run preview` | Preview production build |
| `lint`    | `npm run lint`    | Run ESLint               |

## 🔌 Context Providers

### UserContext

Manages user authentication state and user data.

```jsx
const { user, setUser } = useContext(UserDataContext);
```

### CaptainContext

Manages captain authentication state, loading, and error states.

```jsx
const { captain, setCaptain, isLoading, error } =
  useContext(CaptainDataContext);
```

### SocketContext

Provides WebSocket connection for real-time features.

```jsx
const { socket } = useContext(SocketContext);
```

## 🪝 Custom Hooks

### useLocationServices

Provides location search and distance/time calculation functionality.

**Features:**

- Debounced API calls (configurable delay)
- Response caching
- Automatic request cancellation
- Loading and error states

**Usage:**

```jsx
const {
  suggestions, // Array of location suggestions
  searchLoading, // Boolean loading state
  searchError, // Error message if any
  searchLocations, // Function to search locations
  clearSuggestions, // Function to clear suggestions
  distanceTime, // Distance and time data
  distanceTimeLoading, // Boolean loading state
  calculateDistanceTime, // Function to calculate distance/time
  clearDistanceTime, // Function to clear distance/time
} = useLocationServices(500); // 500ms debounce delay
```

## 🗺️ Maps Integration

The application uses **Leaflet** with **React-Leaflet** for interactive maps:

- **Live location tracking** with real-time position updates
- **Custom markers** for user, captain, pickup, and destination
- **Route polylines** from OSRM (Open Source Routing Machine)
- **Auto-zoom** to fit all markers and routes
- **Distance and duration** calculations

## 🔐 Authentication Flow

1. **User/Captain registers** → Token stored in localStorage
2. **Protected routes** check for valid token
3. **Token sent** with API requests via Authorization header
4. **Socket connection** joins room with user/captain ID
5. **Logout** clears token and redirects to login

## 📡 WebSocket Events

### User Events

| Event           | Direction       | Description               |
| --------------- | --------------- | ------------------------- |
| `join`          | Client → Server | Join room with userId     |
| `ride-accepted` | Server → Client | Captain accepted the ride |
| `ride-started`  | Server → Client | Ride has started          |
| `ride-ended`    | Server → Client | Ride completed            |

### Captain Events

| Event             | Direction       | Description               |
| ----------------- | --------------- | ------------------------- |
| `join`            | Client → Server | Join room with captainId  |
| `new-ride`        | Server → Client | New ride request received |
| `location-update` | Client → Server | Send location updates     |

## 🎨 Styling

- **Tailwind CSS 4.1** for utility-first styling
- **Remix Icons** for iconography
- **GSAP animations** for smooth transitions
- **Mobile-first** responsive design

## 🧩 Key Components

### LiveTracking

Real-time map component with:

- Current location tracking
- Other party's location (user sees captain, captain sees user)
- Route display with polylines
- Distance and ETA updates

### LocationSearchPanel

Autocomplete search with:

- Debounced API calls
- Click to select location
- Coordinate extraction

### ConfirmRide

Ride confirmation panel showing:

- Vehicle type and image
- Pickup and destination
- Estimated fare
- Confirm/Cancel actions

## 🐛 Troubleshooting

### Common Issues

1. **Map not loading**

   - Check if Leaflet CSS is imported
   - Verify marker icon URLs are accessible

2. **Socket not connecting**

   - Ensure `VITE_BASE_URL` is correct
   - Check if backend server is running
   - Verify CORS settings on backend

3. **Location search not working**

   - Check authentication token in localStorage
   - Verify backend maps routes are working

4. **Routes not protected**
   - Ensure token is stored as `token` in localStorage
   - Check UserProtectWrapper/CaptainProtectWrapper components

## 📝 Environment Variables

| Variable        | Description     | Default                 |
| --------------- | --------------- | ----------------------- |
| `VITE_BASE_URL` | Backend API URL | `http://localhost:3000` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
