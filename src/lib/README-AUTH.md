# JWT Authentication Integration

This project now uses JWT authentication with your NestJS backend.

## Configuration

Update the API base URL in `src/lib/auth.ts`:
```typescript
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL
```

## Backend Endpoints Expected

Your NestJS backend should have these endpoints:

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_string",
  "user": {
    "id": "string",
    "email": "string", 
    "name": "string",
    "role": "coach" | "client" | "admin"
  }
}
```

### POST `/api/auth/signup`
**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "coach" | "client" | "admin"
}
```

**Response:**
```json
{
  "access_token": "jwt_token_string",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string", 
    "role": "coach" | "client" | "admin"
  }
}
```

### GET `/api/auth/profile`
**Headers:**
```
Authorization: Bearer jwt_token_string
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "coach" | "client" | "admin"
}
```

## Features Implemented

- ✅ JWT token storage (localStorage for "Remember Me", sessionStorage otherwise)
- ✅ Automatic token validation on app startup
- ✅ Token expiration checking
- ✅ Protected route authentication
- ✅ Inactivity-based logout (24 hours)
- ✅ Proper cleanup on logout

## CORS Configuration

Make sure your NestJS backend has CORS enabled for your frontend domain:

```typescript
// In your main.ts or app configuration
app.enableCors({
  origin: 'http://localhost:5173', // Your Vite dev server URL
  credentials: true,
});
```