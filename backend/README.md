# Backend API Documentation

## Endpoints

### User Registration

**Endpoint:** `POST /user/register`

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

**Endpoint:** `POST /user/login`

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

**Endpoint:** `GET /user/profile`

**Description:** Retrieve the authenticated user's profile information. This is a protected route that requires a valid JWT token.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

#### Example Request

```
GET /user/profile
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

**Endpoint:** `POST /user/logout`

**Description:** Log out the authenticated user by clearing the authentication cookie. This is a protected route that requires a valid JWT token.

---

#### Headers

| Header          | Type   | Required | Description                           |
| --------------- | ------ | -------- | ------------------------------------- |
| `Authorization` | String | Yes\*    | Bearer token (e.g., `Bearer <token>`) |

\*Token can also be sent via cookies.

#### Example Request

```
POST /user/logout
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
