# Backend API Documentation

## Overview

DocsMini backend is a Node.js Express server providing comprehensive REST APIs for document management, finance tracking, complaint handling, and user administration across multiple roles (User, Moderator, HR, Admin).

## Setup & Installation

### Requirements
- Node.js v16+
- MongoDB
- npm or yarn

### Installation Steps

1. Install dependencies
```bash
cd backend
npm install
```

2. Configure environment variables (.env)
```
PORT=5000
DB_NAME=docsmini_db
MONGODB_URI=mongodb://localhost:27017
NODE_ENV=development

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Role Registration Secrets
ADMIN_SECRET_CODE=admin_secret_code
MOD_SECRET_CODE=mod_secret_code
HR_SECRET_CODE=hr_secret_code

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Start the server
```bash
npm start
```

---

## Architecture Overview

### Folder Structure

```
backend/src/
├── models/           # MongoDB schemas
│   ├── user.model.js
│   ├── employee.model.js
│   ├── document.model.js
│   ├── complaint.model.js
│   ├── notice.model.js
│   └── transaction.model.js
├── services/         # Business logic layer
│   ├── auth.service.js
│   ├── document.service.js
│   ├── admin.service.js
│   └── [other services]
├── controllers/      # Request handlers
│   ├── auth.controller.js
│   ├── document.controller.js
│   └── [other controllers]
├── middlewares/      # Custom middlewares
│   ├── auth.middleware.js       # JWT verification
│   ├── role.middleware.js       # Role-based access control
│   ├── error.middleware.js      # Centralized error handling
│   ├── multer.middleware.js     # File upload handling
│   └── rateLimiter.middleware.js
├── routes/           # API endpoint definitions
├── utils/            # Helper utilities
│   ├── ApiError.js   # Error class (system errors only)
│   ├── ApiResponse.js # Response class (all responses)
│   ├── asyncHandler.js
│   └── validation.util.js
├── constants/        # Static configuration
│   ├── uxErrors.js   # User-facing error messages
│   ├── systemErros.js # Backend system error codes
│   ├── roles.js      # User roles definition
│   └── index.js
└── index.js         # Entry point
```

### Data Flow

**Request → Middleware → Controller → Service → Model → Database**

1. **Middleware Layer**: Authentication, role validation, error catching
2. **Controller Layer**: Request validation, parameter extraction
3. **Service Layer**: Business logic, database operations
4. **Model Layer**: Schema definition, data validation

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ❌ | Register new user or employee |
| POST | `/login` | ❌ | Login and get tokens |
| POST | `/logout` | ✅ | Logout (clear refresh token) |
| GET | `/me` | ✅ | Get current user profile |
| PATCH | `/update-profile` | ✅ | Update profile information |
| PATCH | `/update-email` | ✅ | Change email address |
| PATCH | `/update-userid` | ✅ | Change user ID |
| POST | `/change-password` | ✅ | Change password |

### Document Routes (`/api/documents`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/upload` | ✅ | User+ | Upload new document |
| GET | `/my-docs` | ✅ | User+ | Get user's documents |
| GET | `/public` | ✅ | User+ | Get public documents |
| PATCH | `/:id` | ✅ | Owner/Admin/Mod | Update document |
| DELETE | `/:id` | ✅ | Owner/Admin/Mod | Delete document |
| GET | `/:id/download` | ✅ | Owner/Public | Download document |

### Finance Routes (`/api/finance`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/transaction` | ✅ | Admin | Create transaction |
| GET | `/transactions` | ✅ | Admin | Get all transactions |
| GET | `/payroll` | ✅ | HR | Get payroll transactions |

### Complaint Routes (`/api/complaints`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create complaint ticket |
| GET | `/my-complaints` | ✅ | Get user's complaints |
| GET | `/` | ✅ | Get all complaints (staff only) |
| PATCH | `/:id/status` | ✅ | Update complaint status (staff only) |
| DELETE | `/:id` | ✅ | Delete complaint (owner/admin/mod) |

### Notice Routes (`/api/notices`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | ✅ | Admin | Create notice |
| GET | `/` | ✅ | User+ | Get active notices |
| DELETE | `/:id` | ✅ | Admin | Delete notice |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users` | ✅ | Admin | List all users |
| GET | `/users/:id` | ✅ | Admin | Get user details |
| PATCH | `/users/:id/status` | ✅ | Admin | Update user status |
| DELETE | `/users/:id` | ✅ | Admin | Delete user |
| POST | `/employees` | ✅ | Admin | Create employee |
| GET | `/employees` | ✅ | Admin | List employees |
| GET | `/employees/:id` | ✅ | Admin | Get employee details |
| PATCH | `/employees/:id` | ✅ | Admin | Update employee |

### Analytics Routes (`/api/analytics`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users` | ✅ | Admin | User analytics |
| GET | `/documents` | ✅ | Admin | Document analytics |
| GET | `/complaints` | ✅ | Admin | Complaint analytics |

### Moderator Routes (`/api/mod`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users` | ✅ | List all users |
| GET | `/users/:id` | ✅ | Get user details |
| PATCH | `/users/:id/status` | ✅ | Update user status |
| GET | `/documents/public` | ✅ | Get public documents |
| PATCH | `/documents/:id/toggle-visibility` | ✅ | Toggle document visibility |

---

## Error Handling

### Response Structure

**Success Response** (2xx):
```json
{
  "success": true,
  "statusCode": 200,
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Error Response** (4xx/5xx):
```json
{
  "success": false,
  "statusCode": 400,
  "data": null,
  "message": "User-friendly error message"
}
```

### Error Types

**ApiError** - Backend system errors (logged to console)
- Database connection failures
- JWT generation errors
- Cloudinary upload failures
- Unhandled exceptions (500 errors)

**ApiResponse** - User-facing responses (all endpoints)
- Validation errors (400)
- Authorization errors (403)
- Not found errors (404)
- Success responses (200, 201)

### Common Error Messages

See `backend/src/constants/uxErrors.js` for complete list. Examples:
- `AUTH.INVALID_CREDS` - Invalid email/password
- `AUTH.FORBIDDEN` - Insufficient permissions
- `FILE.REQ_DOC` - Document file required
- `FINANCE.REQ_FIELDS` - Required fields missing
- `COMPLAINT.REQ_FIELDS` - Subject and description required

---

## Middlewares

### Authentication Middleware (`auth.middleware.js`)
- Verifies JWT from cookies
- Sets `req.user` and `req.userType` for downstream handlers
- Returns 401 if token invalid/expired

### Role Middleware (`role.middleware.js`)
- Provides role-based access control
- Exported functions: `isAdmin`, `isMod`, `isHR`, `isStaff`, `isAdminOrMod`, `isAdminOrHR`
- Returns 403 if user lacks required role

### Error Middleware (`error.middleware.js`)
- Catches all thrown errors and exceptions
- Transforms `ApiError` to `ApiResponse` for consistent frontend responses
- Logs system errors to console
- Always returns `ApiResponse` to client

### Multer Middleware (`multer.middleware.js`)
- Handles file upload to disk before Cloudinary sync
- Supports PDF, DOC, DOCX, JPG, PNG
- Max file size: 16MB

### Rate Limiter Middleware (`rateLimiter.middleware.js`)
- Prevents abuse by limiting requests
- Window: 15 minutes, Max: 100 requests per IP

---

## Authentication & Authorization

### Token Flow

1. **Registration** - User registers with email/password
2. **Login** - Backend verifies credentials and issues:
   - `accessToken` (7 days, stored in httpOnly cookie)
   - `refreshToken` (30 days, stored in httpOnly cookie)
3. **Request** - Frontend sends cookies with each request
4. **Verification** - Auth middleware validates accessToken
5. **Refresh** - On expiry, frontend uses refreshToken to get new accessToken

### User Roles

- **User** - Regular citizen, can upload/manage own documents
- **Moderator** - Can moderate public documents, manage user status
- **HR** - Can manage payroll transactions, employee records
- **Admin** - Full system access

---

## Database Models

<img here>

### User Model
- Stores citizen/user accounts
- Fields: fullname, email, password, userID, status, contact, address

### Employee Model
- Stores staff/employee accounts
- Fields: fullname, email, password, empCode, role, dept, status

### Document Model
- Stores uploaded documents
- Fields: title, description, cloudUrl, fileType, isPublic, owner

### Complaint Model
- Stores support tickets
- Fields: subject, description, status, raisedBy, assignedTo, images

### Notice Model
- Stores announcements
- Fields: title, message, type, createdBy, createdAt

### Transaction Model
- Stores financial records
- Fields: amount, type (Income/Expense/Payroll), description, processedBy, recipientEmployee

---

## Running Tests with Postman

After starting the server (mongodb and npm start), import the Postman collection and test:

1. Register a new user
2. Login and verify token storage
3. Upload a document
4. Create a complaint
5. Admin operations (user management)
6. Error responses for invalid requests

See `.gitignore` for files excluded from version control.
