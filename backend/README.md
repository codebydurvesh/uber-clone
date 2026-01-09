# Backend API Documentation

## Endpoints

### User Registration

**Endpoint:** `POST /users/register`

**Description:** Register a new user account in the system. This endpoint creates a new user with the provided details, hashes the password, and returns an authentication token.

---

#### Request Body

| Field                | Type   | Required | Description                                         |
| -------------------- | ------ | -------- | --------------------------------------------------- |
| `fullName.firstname` | String | Yes      | User's first name (minimum 3 characters)            |
| `fullName.lastname`  | String | No       | User's last name (minimum 3 characters if provided) |
| `email`              | String | Yes      | User's email address (must be valid email format)   |
| `password`           | String | Yes      | User's password (minimum 6 characters)              |

#### Example Request

```json
{
  "fullName": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

#### Responses

##### Success Response

**Status Code:** `201 Created`

```json
{
  "user": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "fullName": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

---

#### Validation Rules

| Field      | Rule                         | Error Message                                  |
| ---------- | ---------------------------- | ---------------------------------------------- |
| `email`    | Must be a valid email format | "Invalid email address"                        |
| `fullName` | Minimum 3 characters         | "Full name must be at least 3 characters long" |
| `password` | Minimum 6 characters         | "Password must be at least 6 characters long"  |

---

#### Notes

- Password is automatically hashed before storing in the database
- A JWT token is generated and returned upon successful registration
- The password field is excluded from the user object in responses (`select: false`)

---

### User Login

**Endpoint:** `POST /users/login`

**Description:** Authenticate an existing user and receive an access token. This endpoint validates the user's credentials and returns a JWT token for subsequent authenticated requests.

---

#### Request Body

| Field      | Type   | Required | Description                                          |
| ---------- | ------ | -------- | ---------------------------------------------------- |
| `email`    | String | Yes      | User's registered email address (valid email format) |
| `password` | String | Yes      | User's password (minimum 6 characters)               |

#### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "user": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "fullName": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `401 Unauthorized`

Returned when email or password is incorrect.

```json
{
  "error": "Invalid email or password"
}
```

---

#### Validation Rules

| Field      | Rule                         | Error Message                                 |
| ---------- | ---------------------------- | --------------------------------------------- |
| `email`    | Must be a valid email format | "Invalid email address"                       |
| `password` | Minimum 6 characters         | "Password must be at least 6 characters long" |

---

#### Notes

- The same error message is returned for both invalid email and invalid password to prevent user enumeration attacks
- A JWT token is generated and returned upon successful authentication
- The password field is excluded from the user object in responses

---

### Get User Profile

**Endpoint:** `GET /users/profile`

**Description:** Retrieve the authenticated user's profile information. This is a protected route that requires a valid JWT token.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

#### Example Request

```
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "user": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "fullName": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  }
}
```

##### Error Responses

**Status Code:** `401 Unauthorized`

Returned when no token is provided.

```json
{
  "error": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized`

Returned when the token is invalid or expired.

```json
{
  "error": "Invalid token."
}
```

---

#### Notes

- Token can be provided via `Authorization` header or `token` cookie
- The password field is excluded from the user object in responses

---

### User Logout

**Endpoint:** `POST /users/logout`

**Description:** Log out the authenticated user by clearing the authentication cookie. This is a protected route that requires a valid JWT token.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

#### Example Request

```
POST /users/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

##### Error Responses

**Status Code:** `401 Unauthorized`

Returned when no token is provided.

```json
{
  "error": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized`

Returned when the token is invalid or expired.

```json
{
  "error": "Invalid token."
}
```

---

#### Notes

- Clears the `token` cookie with `httpOnly` and `secure` flags
- Token can be provided via `Authorization` header or `token` cookie
- Client should also remove the token from local storage if stored there

---

## Maps API (OpenStreetMap-based Services)

These endpoints use OpenStreetMap-based services (Nominatim for geocoding, OpenRouteService for routing) instead of Google Maps API.

### Environment Variables Required

Add the following to your `.env` file:

```env
OPENROUTESERVICE_API_KEY=your_api_key_here
```

Get your free API key from: https://openrouteservice.org/dev/#/signup

---

### Get Location Suggestions (Auto-complete)

**Endpoint:** `GET /maps/suggestions`

**Description:** Returns location suggestions based on search query. Uses Nominatim (OSM geocoding service) for auto-complete functionality with debouncing support on the frontend.

**Authentication:** Required (Bearer token)

---

#### Query Parameters

| Parameter | Type   | Required | Description                        |
| --------- | ------ | -------- | ---------------------------------- |
| `query`   | String | Yes      | Search text (minimum 2 characters) |

#### Example Request

```
GET /maps/suggestions?query=bandra station
Authorization: Bearer <token>
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "name": "Bandra Railway Station, Bandra West, Mumbai, Maharashtra, 400050, India",
      "lat": "19.0544137",
      "lng": "72.8402147",
      "placeId": 12345678,
      "type": "station"
    },
    {
      "name": "Bandra Terminus, Mumbai, Maharashtra, India",
      "lat": "19.0589",
      "lng": "72.8411",
      "placeId": 87654321,
      "type": "station"
    }
  ],
  "count": 2
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Query must be at least 2 characters",
      "path": "query",
      "location": "query"
    }
  ]
}
```

---

### Get Coordinates from Address (Forward Geocoding)

**Endpoint:** `GET /maps/coordinates`

**Description:** Converts an address/location name into latitude and longitude coordinates. Uses Nominatim forward geocoding.

**Authentication:** Required (Bearer token)

---

#### Query Parameters

| Parameter | Type   | Required | Description                                 |
| --------- | ------ | -------- | ------------------------------------------- |
| `address` | String | Yes      | Full address or location name (min 3 chars) |

#### Example Request

```
GET /maps/coordinates?address=Bandra Station, Mumbai
Authorization: Bearer <token>
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "name": "Bandra Railway Station, Bandra West, Mumbai, Maharashtra, 400050, India",
    "lat": "19.0544137",
    "lng": "72.8402147",
    "boundingBox": ["19.0534137", "19.0554137", "72.8392147", "72.8412147"]
  }
}
```

##### Error Responses

**Status Code:** `404 Not Found`

```json
{
  "success": false,
  "error": "Location not found"
}
```

---

### Calculate Distance & Estimated Time

**Endpoint:** `GET /maps/distance-time`

**Description:** Calculates driving distance and estimated travel time (ETA) between pickup and drop coordinates. Uses OpenRouteService Directions API.

**Authentication:** Required (Bearer token)

---

#### Query Parameters

| Parameter   | Type  | Required | Description                         |
| ----------- | ----- | -------- | ----------------------------------- |
| `pickupLat` | Float | Yes      | Pickup latitude (-90 to 90)         |
| `pickupLng` | Float | Yes      | Pickup longitude (-180 to 180)      |
| `dropLat`   | Float | Yes      | Destination latitude (-90 to 90)    |
| `dropLng`   | Float | Yes      | Destination longitude (-180 to 180) |

#### Example Request

```
GET /maps/distance-time?pickupLat=19.0544&pickupLng=72.8402&dropLat=19.0176&dropLng=72.8562
Authorization: Bearer <token>
```

This example calculates the route from Bandra Station to CST Station in Mumbai.

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "distance": 12.53,
    "duration": 35,
    "distanceText": "12.53 km",
    "durationText": "35 mins",
    "bounds": [72.8402, 19.0176, 72.8562, 19.0544]
  }
}
```

| Field          | Type   | Description                  |
| -------------- | ------ | ---------------------------- |
| `distance`     | Float  | Distance in kilometers       |
| `duration`     | Int    | Estimated time in minutes    |
| `distanceText` | String | Formatted distance with unit |
| `durationText` | String | Formatted duration with unit |
| `bounds`       | Array  | Bounding box for the route   |

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid pickup latitude",
      "path": "pickupLat",
      "location": "query"
    }
  ]
}
```

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "error": "OpenRouteService API key is not configured"
}
```

---

### Rate Limits & Best Practices

#### Nominatim (OSM Geocoding)

- **Rate limit:** Maximum 1 request per second
- **Usage policy:** https://operations.osmfoundation.org/policies/nominatim/
- Implement debouncing on frontend (500ms recommended)
- Include a valid User-Agent header

#### OpenRouteService

- **Free tier:** 2,000 requests/day
- **Rate limit:** 40 requests/minute
- Get API key: https://openrouteservice.org/dev/#/signup

---

### Frontend Integration Example

````javascript
// Using the useLocationServices hook
import { useLocationServices } from '../hooks/useLocationServices';

const MyComponent = () => {
  const {
    suggestions,
    searchLoading,
    searchLocations,
    calculateDistanceTime,
    distanceTime
  } = useLocationServices(500); // 500ms debounce

  // Search as user types
  const handleInputChange = (e) => {
    searchLocations(e.target.value, authToken);
  };

  // Calculate distance when both locations are selected
  const handleCalculateRoute = () => {
    calculateDistanceTime(
      { lat: 19.0544, lng: 72.8402 },
      { lat: 19.0176, lng: 72.8562 },
      authToken
    );
  };

  return (
    <div>
      {distanceTime && (
        <p>Distance: {distanceTime.distanceText}, ETA: {distanceTime.durationText}</p>
      )}
    </div>
  );
};
```---

## Captain Endpoints

### Captain Registration

**Endpoint:** `POST /captains/register`

**Description:** Register a new captain (driver) account in the system. This endpoint creates a new captain with personal details and vehicle information, hashes the password, and returns an authentication token via cookie.

---

#### Request Body

| Field                 | Type   | Required | Description                                             |
| --------------------- | ------ | -------- | ------------------------------------------------------- |
| `fullName.firstname`  | String | Yes      | Captain's first name (minimum 3 characters)             |
| `fullName.lastname`   | String | No       | Captain's last name (minimum 3 characters if provided)  |
| `email`               | String | Yes      | Captain's email address (must be valid email format)    |
| `password`            | String | Yes      | Captain's password (minimum 6 characters)               |
| `vehicle.color`       | String | Yes      | Vehicle color (minimum 3 characters)                    |
| `vehicle.plate`       | String | Yes      | Vehicle plate number (minimum 3 characters)             |
| `vehicle.capacity`    | Number | Yes      | Vehicle passenger capacity (minimum 1)                  |
| `vehicle.vehicleType` | String | Yes      | Type of vehicle: `car`, `motorcycle`, or `autorickshaw` |

#### Example Request

```json
{
  "fullName": {
    "firstname": "James",
    "lastname": "Smith"
  },
  "email": "james.smith@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Black",
    "plate": "ABC-1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
````

---

#### Responses

##### Success Response

**Status Code:** `201 Created`

```json
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "fullName": {
    "firstname": "James",
    "lastname": "Smith"
  },
  "email": "james.smith@example.com",
  "status": "inactive",
  "vehicle": {
    "color": "Black",
    "plate": "ABC-1234",
    "capacity": 4,
    "vehicleType": "car"
  },
  "createdAt": "2026-01-02T10:30:00.000Z",
  "updatedAt": "2026-01-02T10:30:00.000Z"
}
```

> **Note:** A `token` cookie is also set in the response with `httpOnly` and `secure` flags.

##### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

Returned when a captain with the same email already exists.

```json
{
  "error": "Captain with this email already exists"
}
```

---

#### Validation Rules

| Field                 | Rule                                           | Error Message                                      |
| --------------------- | ---------------------------------------------- | -------------------------------------------------- |
| `email`               | Must be a valid email format                   | "Invalid email address"                            |
| `fullName`            | Minimum 3 characters                           | "Full name must be at least 3 characters long"     |
| `password`            | Minimum 6 characters                           | "Password must be at least 6 characters long"      |
| `vehicle.color`       | Minimum 3 characters                           | "Vehicle color must be at least 3 characters long" |
| `vehicle.plate`       | Minimum 3 characters                           | "Vehicle plate must be at least 3 characters long" |
| `vehicle.capacity`    | Must be a positive integer (≥ 1)               | "Vehicle capacity must be a positive integer"      |
| `vehicle.vehicleType` | Must be `car`, `motorcycle`, or `autorickshaw` | "Invalid vehicle type"                             |

---

#### Notes

- Password is automatically hashed before storing in the database
- A JWT token is generated and set as an HTTP-only cookie upon successful registration
- Captain status is set to `inactive` by default
- Email is converted to lowercase and must be unique

---

### Captain Login

**Endpoint:** `POST /captains/login`

**Description:** Authenticate an existing captain and receive an access token. This endpoint validates the captain's credentials and returns a JWT token for subsequent authenticated requests.

---

#### Request Body

| Field      | Type   | Required | Description                                             |
| ---------- | ------ | -------- | ------------------------------------------------------- |
| `email`    | String | Yes      | Captain's registered email address (valid email format) |
| `password` | String | Yes      | Captain's password (minimum 6 characters)               |

#### Example Request

```json
{
  "email": "james.smith@example.com",
  "password": "password123"
}
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "captain": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "fullName": {
      "firstname": "James",
      "lastname": "Smith"
    },
    "email": "james.smith@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  }
}
```

> **Note:** A `token` cookie is also set in the response with `httpOnly` and `secure` flags.

##### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid email address",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Status Code:** `401 Unauthorized`

Returned when email or password is incorrect.

```json
{
  "error": "Invalid email or password"
}
```

---

#### Validation Rules

| Field      | Rule                         | Error Message                                 |
| ---------- | ---------------------------- | --------------------------------------------- |
| `email`    | Must be a valid email format | "Invalid email address"                       |
| `password` | Minimum 6 characters         | "Password must be at least 6 characters long" |

---

#### Notes

- The same error message is returned for both invalid email and invalid password to prevent user enumeration attacks
- A JWT token is generated and set as an HTTP-only cookie upon successful authentication

---

### Get Captain Profile

**Endpoint:** `GET /captains/profile`

**Description:** Retrieve the authenticated captain's profile information. This is a protected route that requires a valid JWT token.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

#### Example Request

```
GET /captains/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Captain profile fetched successfully",
  "captain": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "fullName": {
      "firstname": "James",
      "lastname": "Smith"
    },
    "email": "james.smith@example.com",
    "status": "inactive",
    "vehicle": {
      "color": "Black",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    },
    "createdAt": "2026-01-02T10:30:00.000Z",
    "updatedAt": "2026-01-02T10:30:00.000Z"
  }
}
```

##### Error Responses

**Status Code:** `401 Unauthorized`

Returned when no token is provided.

```json
{
  "error": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized`

Returned when the token is invalid or expired.

```json
{
  "error": "Invalid token."
}
```

---

#### Notes

- Token can be provided via `Authorization` header or `token` cookie
- The password field is excluded from the captain object in responses

---

### Captain Logout

**Endpoint:** `POST /captains/logout`

**Description:** Log out the authenticated captain by clearing the authentication cookie. This is a protected route that requires a valid JWT token.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

#### Example Request

```
POST /captains/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

##### Error Responses

**Status Code:** `401 Unauthorized`

Returned when no token is provided.

```json
{
  "error": "Access denied. No token provided."
}
```

**Status Code:** `401 Unauthorized`

Returned when the token is invalid or expired.

```json
{
  "error": "Invalid token."
}
```

---

#### Notes

- Clears the `token` cookie with `httpOnly` and `secure` flags
- Token can be provided via `Authorization` header or `token` cookie
- Client should also remove the token from local storage if stored there

---

## Rides API

### Ride Status Flow

```
pending → accepted → ongoing → completed
    ↓         ↓
cancelled  cancelled
```

| Status      | Description                                  |
| ----------- | -------------------------------------------- |
| `pending`   | Ride created, waiting for captain to accept  |
| `accepted`  | Captain accepted the ride, heading to pickup |
| `ongoing`   | Ride in progress (OTP verified)              |
| `completed` | Ride finished successfully                   |
| `cancelled` | Ride cancelled by captain or user            |

---

### Create Ride

**Endpoint:** `POST /rides/create`

**Description:** Create a new ride request. This endpoint calculates the fare based on pickup and destination locations, generates a 6-digit OTP for ride verification, and creates a ride record in the system. Requires user authentication.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

---

#### Request Body

| Field         | Type   | Required | Description                                             |
| ------------- | ------ | -------- | ------------------------------------------------------- |
| `pickup`      | String | Yes      | Pickup location name (minimum 3 characters)             |
| `destination` | String | Yes      | Destination location name (minimum 3 characters)        |
| `vehicleType` | String | Yes      | Type of vehicle: `car`, `autorickshaw`, or `motorcycle` |

#### Example Request

```json
{
  "pickup": "Bandra, Mumbai",
  "destination": "Panvel, Navi Mumbai",
  "vehicleType": "car"
}
```

---

#### Responses

##### Success Response

**Status Code:** `201 Created`

```json
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "user": "64a7b8c9d1e2f3a4b5c6d7e9",
  "pickup": "Bandra, Mumbai",
  "destination": "Panvel, Navi Mumbai",
  "vehicleType": "car",
  "fare": 270,
  "status": "pending",
  "otp": "482619",
  "createdAt": "2026-01-07T10:30:00.000Z",
  "updatedAt": "2026-01-07T10:30:00.000Z"
}
```

| Field         | Type   | Description                                             |
| ------------- | ------ | ------------------------------------------------------- |
| `_id`         | String | Unique identifier for the ride                          |
| `user`        | String | User ID who created the ride                            |
| `pickup`      | String | Pickup location name                                    |
| `destination` | String | Destination location name                               |
| `vehicleType` | String | Type of vehicle selected                                |
| `fare`        | Number | Calculated fare in INR                                  |
| `status`      | String | Current ride status (default: `pending`)                |
| `otp`         | String | 6-digit OTP for ride verification (shared with captain) |
| `createdAt`   | String | Timestamp of ride creation                              |
| `updatedAt`   | String | Timestamp of last update                                |

##### Error Responses

**Status Code:** `400 Bad Request`

Returned when validation fails.

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Pickup location is required",
      "path": "pickup",
      "location": "body"
    }
  ]
}
```

**Status Code:** `401 Unauthorized`

Returned when no token is provided or token is invalid.

```json
{
  "error": "Access denied. No token provided."
}
```

**Status Code:** `500 Internal Server Error`

Returned when ride creation fails (e.g., location not found).

```json
{
  "error": "Location not found"
}
```

---

#### Validation Rules

| Field                   | Rule                                                | Error Message                   |
| ----------------------- | --------------------------------------------------- | ------------------------------- |
| `pickup`                | Must be a string, minimum 3 characters              | "Pickup location is required"   |
| `destination`           | Must be a string, minimum 3 characters              | "Destination is required"       |
| `vehicleType`           | Must be one of: `car`, `autorickshaw`, `motorcycle` | "Invalid vehicle type"          |
| `pickupCoords.lat`      | Must be a float between -90 and 90                  | "Invalid pickup latitude"       |
| `pickupCoords.lng`      | Must be a float between -180 and 180                | "Invalid pickup longitude"      |
| `destinationCoords.lat` | Must be a float between -90 and 90                  | "Invalid destination latitude"  |
| `destinationCoords.lng` | Must be a float between -180 and 180                | "Invalid destination longitude" |

---

#### Fare Calculation

The fare is calculated based on distance and estimated travel time:

| Vehicle Type | Base Fare | Per Km Rate | Per Minute Rate |
| ------------ | --------- | ----------- | --------------- |
| Autorickshaw | ₹30       | ₹12         | ₹1              |
| Car          | ₹50       | ₹18         | ₹2              |
| Motorcycle   | ₹20       | ₹8          | ₹0.50           |

**Formula:** `Fare = Base Fare + (Per Km Rate × Distance) + (Per Minute Rate × Duration)`

---

#### Notes

- Requires user authentication via JWT token
- Location names are geocoded to coordinates using Nominatim API
- Distance and duration are calculated using OpenRouteService API
- The ride is created with `pending` status by default
- Token can be provided via `Authorization` header or `token` cookie
- A 6-digit OTP is generated using cryptographically secure random number generation
- The OTP is required for the captain to start the ride (ride verification)
- The OTP field is excluded from queries by default (`select: false`) but included in the create response
- The ride is broadcast to all active captains via WebSocket

---

### Accept Ride

**Endpoint:** `POST /rides/accept`

**Description:** Allows a captain to accept a pending ride request. Updates the ride status to "accepted" and notifies the user via WebSocket.

**Authentication:** Required (Captain Bearer token)

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

---

#### Request Body

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| `rideId` | String | Yes      | MongoDB ObjectId of the ride |

#### Example Request

```json
{
  "rideId": "64a7b8c9d1e2f3a4b5c6d7e8"
}
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "user": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "fullName": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "captain": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7f0",
    "fullName": {
      "firstname": "James",
      "lastname": "Smith"
    },
    "vehicle": {
      "color": "Black",
      "plate": "ABC-1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "pickup": "Bandra, Mumbai",
  "destination": "Panvel, Navi Mumbai",
  "pickupCoords": {
    "lat": 19.0544,
    "lng": 72.8402
  },
  "destinationCoords": {
    "lat": 19.0176,
    "lng": 72.8562
  },
  "fare": 270,
  "status": "accepted",
  "distance": "12.5 km",
  "duration": "35 min"
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "errors": [
    {
      "msg": "Invalid ride ID",
      "path": "rideId",
      "location": "body"
    }
  ]
}
```

**Status Code:** `400 Bad Request`

```json
{
  "error": "Ride is no longer available"
}
```

**Status Code:** `404 Not Found`

```json
{
  "error": "Ride not found"
}
```

---

#### Validation Rules

| Field    | Rule                  | Error Message     |
| -------- | --------------------- | ----------------- |
| `rideId` | Must be valid MongoId | "Invalid ride ID" |

---

#### Notes

- Only captains can accept rides
- The ride must be in `pending` status to be accepted
- User receives a `ride-accepted` WebSocket event with the ride data (including OTP)
- The captain response does NOT include the OTP (security measure)
- Ride status changes from `pending` to `accepted`

---

### Start Ride

**Endpoint:** `POST /rides/start`

**Description:** Allows a captain to start an accepted ride after verifying the OTP from the user. This confirms the user is present and ready for the ride.

**Authentication:** Required (Captain Bearer token)

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

---

#### Request Body

| Field    | Type   | Required | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| `rideId` | String | Yes      | MongoDB ObjectId of the ride     |
| `otp`    | String | Yes      | 6-digit OTP provided by the user |

#### Example Request

```json
{
  "rideId": "64a7b8c9d1e2f3a4b5c6d7e8",
  "otp": "482619"
}
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "user": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "fullName": {
      "firstname": "John",
      "lastname": "Doe"
    }
  },
  "captain": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7f0",
    "fullName": {
      "firstname": "James",
      "lastname": "Smith"
    }
  },
  "pickup": "Bandra, Mumbai",
  "destination": "Panvel, Navi Mumbai",
  "fare": 270,
  "status": "ongoing",
  "otp": "482619"
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "error": "Invalid OTP"
}
```

**Status Code:** `400 Bad Request`

```json
{
  "error": "Ride is not in accepted state"
}
```

**Status Code:** `404 Not Found`

```json
{
  "error": "Ride not found"
}
```

---

#### Validation Rules

| Field    | Rule                         | Error Message     |
| -------- | ---------------------------- | ----------------- |
| `rideId` | Must be valid MongoId        | "Invalid ride ID" |
| `otp`    | Must be exactly 6 characters | "Invalid OTP"     |

---

#### Notes

- Only the captain who accepted the ride can start it
- The ride must be in `accepted` status
- OTP verification ensures the correct user is picked up
- User receives a `ride-started` WebSocket event
- Ride status changes from `accepted` to `ongoing`

---

### End Ride

**Endpoint:** `POST /rides/end`

**Description:** Allows a captain to complete an ongoing ride. Updates captain's statistics (earnings, total rides, distance) and notifies the user.

**Authentication:** Required (Captain Bearer token)

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

---

#### Request Body

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| `rideId` | String | Yes      | MongoDB ObjectId of the ride |

#### Example Request

```json
{
  "rideId": "64a7b8c9d1e2f3a4b5c6d7e8"
}
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "ride": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "user": {
      "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
      "fullName": {
        "firstname": "John",
        "lastname": "Doe"
      }
    },
    "captain": {
      "_id": "64a7b8c9d1e2f3a4b5c6d7f0",
      "fullName": {
        "firstname": "James",
        "lastname": "Smith"
      }
    },
    "pickup": "Bandra, Mumbai",
    "destination": "Panvel, Navi Mumbai",
    "fare": 270,
    "status": "completed",
    "distance": "12.5 km",
    "duration": "35 min"
  },
  "captain": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7f0",
    "totalEarnings": 270,
    "totalRides": 1,
    "totalDistance": 12.5
  }
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "error": "Ride is not ongoing"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "error": "Unauthorized to end this ride"
}
```

**Status Code:** `404 Not Found`

```json
{
  "error": "Ride not found"
}
```

---

#### Validation Rules

| Field    | Rule                  | Error Message     |
| -------- | --------------------- | ----------------- |
| `rideId` | Must be valid MongoId | "Invalid ride ID" |

---

#### Notes

- Only the captain who is assigned to the ride can end it
- The ride must be in `ongoing` status
- Captain's statistics are automatically updated:
  - `totalEarnings` += fare amount
  - `totalRides` += 1
  - `totalDistance` += ride distance
- User receives a `ride-ended` WebSocket event
- Ride status changes from `ongoing` to `completed`

---

### Cancel Ride

**Endpoint:** `POST /rides/cancel`

**Description:** Allows a captain to cancel an accepted ride. A cancellation fine is deducted from the captain's earnings.

**Authentication:** Required (Captain Bearer token)

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

---

#### Request Body

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| `rideId` | String | Yes      | MongoDB ObjectId of the ride |

#### Example Request

```json
{
  "rideId": "64a7b8c9d1e2f3a4b5c6d7e8"
}
```

---

#### Responses

##### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Ride cancelled successfully",
  "fine": 20,
  "captain": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7f0",
    "totalEarnings": 250,
    "totalRides": 5
  }
}
```

##### Error Responses

**Status Code:** `400 Bad Request`

```json
{
  "error": "Ride cannot be cancelled at this stage"
}
```

**Status Code:** `403 Forbidden`

```json
{
  "error": "Unauthorized to cancel this ride"
}
```

**Status Code:** `404 Not Found`

```json
{
  "error": "Ride not found"
}
```

---

#### Validation Rules

| Field    | Rule                  | Error Message     |
| -------- | --------------------- | ----------------- |
| `rideId` | Must be valid MongoId | "Invalid ride ID" |

---

#### Notes

- Only the captain who accepted the ride can cancel it
- The ride must be in `accepted` status (cannot cancel ongoing rides)
- A cancellation fine of ₹20 is deducted from the captain's earnings
- The ride is reset: status becomes `cancelled` and captain is set to `null`
- User receives a `ride-cancelled` WebSocket event
- The ride becomes available for other captains again

---

## WebSocket Events

The application uses Socket.IO for real-time communication between users and captains.

### Connection Setup

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
```

### Client Events (Emit)

#### Join Room

Join a room to receive targeted events.

```javascript
socket.emit("join", {
  userId: "64a7b8c9d1e2f3a4b5c6d7e8",
  userType: "user", // or "captain"
});
```

| Field      | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `userId`   | String | User or Captain MongoDB ID     |
| `userType` | String | Either `"user"` or `"captain"` |

---

#### Update Captain Location

Captains send their location updates periodically.

```javascript
socket.emit("update-location-captain", {
  userId: "64a7b8c9d1e2f3a4b5c6d7f0",
  location: {
    lat: 19.0544,
    lng: 72.8402,
  },
});
```

---

#### Update Location (During Ride)

Send live location updates during an active ride.

```javascript
socket.emit("update-location", {
  rideId: "64a7b8c9d1e2f3a4b5c6d7e8",
  userType: "captain",
  location: {
    lat: 19.0544,
    lng: 72.8402,
  },
});
```

---

### Server Events (Listen)

#### new-ride (Captain Only)

Received when a new ride is created.

```javascript
socket.on("new-ride", (rideData) => {
  console.log("New ride request:", rideData);
});
```

**Payload:**

```json
{
  "_id": "64a7b8c9d1e2f3a4b5c6d7e8",
  "user": {
    "_id": "64a7b8c9d1e2f3a4b5c6d7e9",
    "fullName": {
      "firstname": "John",
      "lastname": "Doe"
    }
  },
  "pickup": "Bandra, Mumbai",
  "destination": "Panvel, Navi Mumbai",
  "vehicleType": "car",
  "fare": 270
}
```

---

#### ride-accepted (User Only)

Received when a captain accepts the user's ride request.

```javascript
socket.on("ride-accepted", (rideData) => {
  console.log("Ride accepted:", rideData);
  // rideData includes OTP for the user
});
```

---

#### ride-started (User Only)

Received when the captain starts the ride (OTP verified).

```javascript
socket.on("ride-started", (rideData) => {
  console.log("Ride started:", rideData);
});
```

---

#### ride-ended (User Only)

Received when the captain completes the ride.

```javascript
socket.on("ride-ended", (rideData) => {
  console.log("Ride completed:", rideData);
});
```

---

#### ride-cancelled (User Only)

Received when the captain cancels the ride.

```javascript
socket.on("ride-cancelled", (data) => {
  console.log("Ride cancelled:", data.message);
});
```

---

#### location-update (Both)

Received during an active ride with the other party's location.

```javascript
socket.on("location-update", (data) => {
  const { rideId, userType, location } = data;
  console.log(`${userType} location:`, location);
});
```

---

## Data Models

### User Model

```javascript
{
  fullName: {
    firstname: String (required, min 3 chars),
    lastname: String (optional, min 3 chars)
  },
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  socketId: String (optional)
}
```

---

### Captain Model

```javascript
{
  fullName: {
    firstname: String (required, min 3 chars),
    lastname: String (optional, min 3 chars)
  },
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  socketId: String (optional),
  status: String (enum: ["active", "inactive"], default: "inactive"),
  vehicle: {
    color: String (required, min 3 chars),
    plate: String (required, min 3 chars),
    capacity: Number (required, min 1),
    vehicleType: String (enum: ["car", "motorcycle", "autorickshaw"])
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  totalEarnings: Number (default: 0),
  totalRides: Number (default: 0),
  totalDistance: Number (default: 0),
  hoursOnline: Number (default: 0)
}
```

---

### Ride Model

```javascript
{
  user: ObjectId (ref: "User", required),
  captain: ObjectId (ref: "Captain", optional),
  pickup: String (required),
  destination: String (required),
  pickupCoords: {
    lat: Number,
    lng: Number
  },
  destinationCoords: {
    lat: Number,
    lng: Number
  },
  fare: Number (required),
  status: String (enum: ["pending", "accepted", "ongoing", "completed", "cancelled"]),
  duration: String (formatted as "X min"),
  distance: String (formatted as "X km"),
  otp: String (required, select: false),
  paymentId: String (optional),
  orderId: String (optional),
  signature: String (optional)
}
```

---

## Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/uber-clone

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# External APIs
OPENROUTESERVICE_API_KEY=your_openrouteservice_api_key
```

### Required Variables

| Variable                   | Description                            | Required |
| -------------------------- | -------------------------------------- | -------- |
| `PORT`                     | Server port number                     | Yes      |
| `MONGODB_URI`              | MongoDB connection string              | Yes      |
| `JWT_SECRET`               | Secret key for JWT signing             | Yes      |
| `OPENROUTESERVICE_API_KEY` | API key for OpenRouteService (routing) | Yes      |

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "Error message here"
}
```

### Validation Error Response Format

```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Error message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

### HTTP Status Codes

| Code | Description                          |
| ---- | ------------------------------------ |
| 200  | Success                              |
| 201  | Created                              |
| 400  | Bad Request (validation errors)      |
| 401  | Unauthorized (invalid/missing token) |
| 403  | Forbidden (insufficient permissions) |
| 404  | Not Found                            |
| 500  | Internal Server Error                |

---

## Running the Server

### Development Mode

```bash
npm run dev
```

Uses nodemon for auto-restart on file changes.

### Production Mode

```bash
npm start
```

---

## Project Structure

```
backend/
├── controllers/           # Request handlers
│   ├── captain.controller.js
│   ├── maps.controller.js
│   ├── ride.controller.js
│   └── user.controller.js
├── db/                    # Database configuration
│   └── db.js
├── middlewares/           # Custom middlewares
│   └── auth.middleware.js
├── models/                # Mongoose schemas
│   ├── captain.model.js
│   ├── ride.model.js
│   └── user.model.js
├── routes/                # API routes
│   ├── captain.route.js
│   ├── maps.route.js
│   ├── ride.route.js
│   └── user.route.js
├── services/              # Business logic
│   ├── maps.service.js
│   ├── ride.service.js
│   └── user.service.js
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── socket.js              # Socket.IO configuration
├── package.json           # Dependencies
└── README.md              # This file
```

---

## Dependencies

| Package           | Version | Purpose                 |
| ----------------- | ------- | ----------------------- |
| express           | ^5.2.1  | Web framework           |
| mongoose          | ^9.0.2  | MongoDB ODM             |
| socket.io         | ^4.8.3  | Real-time communication |
| jsonwebtoken      | ^9.0.3  | JWT authentication      |
| bcrypt            | ^6.0.0  | Password hashing        |
| express-validator | ^7.3.1  | Request validation      |
| cors              | ^2.8.5  | Cross-origin requests   |
| cookie-parser     | ^1.4.7  | Cookie parsing          |
| dotenv            | ^17.2.3 | Environment variables   |
| axios             | ^1.6.0  | HTTP client (for APIs)  |

---

## License

This project is licensed under the MIT License.
