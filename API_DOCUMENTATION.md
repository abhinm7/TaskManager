## Sample API Documentation
Note: All incoming POST/PUT bodies and outgoing response bodies are AES-encrypted under the { payload: "encrypted_string" } structure over the network. The below represents the raw JSON structure before encryption/after decryption.

1. User Login
Endpoint: `POST /api/auth/login`

#### Request Body (Raw):

##### JSON
```
{
  "email": "user@test.com",
  "password": "securepassword123"
}
```
`Response (200 OK): Sets HttpOnly cookie.`

##### JSON
```
{
  "message": "Logged in successfully",
  "user": { "id": "60d5ec...", "email": "user@test.com" }
}
```
2. Get Tasks (Paginated & Filtered)
Endpoint: `GET /api/tasks?page=1&limit=10&status=PENDING&search=deploy`

Headers: Requires Cookie: token=...

`Response (200 OK):`

JSON
```
{
  "tasks": [
    {
      "_id": "60d5ec...",
      "title": "Deploy to Vercel",
      "description": "Ship the Next.js app",
      "status": "PENDING",
      "createdAt": "2026-03-17T12:00:00.000Z"
    }
  ],
  "pagination": { "total": 1, "page": 1, "pages": 1 }
}
```
