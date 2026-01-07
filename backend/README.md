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

| Field         | Rule                                                | Error Message                 |
| ------------- | --------------------------------------------------- | ----------------------------- |
| `pickup`      | Must be a string, minimum 3 characters              | "Pickup location is required" |
| `destination` | Must be a string, minimum 3 characters              | "Destination is required"     |
| `vehicleType` | Must be one of: `car`, `autorickshaw`, `motorcycle` | "Invalid vehicle type"        |

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
