# DocsMini - Document & Operations Management System

## Project Overview

DocsMini is a comprehensive full-stack web application designed for enterprise-grade document management, operational tracking, and administrative oversight. It supports multiple user roles with granular permissions, enabling secure collaboration across organizations.

### Key Features

- **Multi-Role Access Control**: User, Moderator, HR, Admin
- **Document Management**: Upload, organize, share, and track documents
- **Complaint Management**: Support ticketing system with status tracking
- **Financial Tracking**: Income, expense, and payroll management
- **Announcements**: System-wide notice board
- **Analytics**: User, document, complaint, and financial metrics
- **Real-time Notifications**: Toast notifications for user actions
- **Responsive Design**: Works on desktop and mobile devices

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **State Management**: React Context
- **Styling**: CSS3 with theme support

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT with httpOnly cookies
- **File Storage**: Cloudinary
- **Middleware**: Multer, CORS, Rate Limiter

---

## Data Flow Architecture

<img here>

```
User Request
    ↓
Browser (React) → Frontend Services (Axios)
    ↓
HTTP Request → Backend (Express) → Middleware Chain
    ↓
Controller → Service → Model
    ↓
MongoDB (Data Layer)
    ↓
Response: ApiResponse (always)
    ↓
Frontend: Axios Interceptor
    ↓
Toast Notification / UI Update
```

---

## User Roles & Permissions

### User (Citizen)
- Register account
- Upload documents (public/private)
- View public documents
- Create support complaints
- Update profile
- Change password

### Moderator
- View all users
- Modify user status
- Manage document visibility
- Assign complaint status

### HR (Human Resources)
- View all users and employees
- Manage payroll transactions
- View employee records
- Update employee information

### Admin (Administrator)
- Full system access
- User account management
- Employee account management
- Create announcements
- View all transactions
- Access all analytics

---

## Project Structure

```
docsMini/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── services/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── constants/
│   │   ├── hooks/
│   │   └── main.jsx
│   ├── .env.local
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB
- Cloudinary account

### Quick Start

1. **Backend Setup**
```bash
cd backend
npm install
# Configure .env
npm start
# Runs on http://localhost:5000
```

2. **Frontend Setup**
```bash
cd frontend
npm install
# Configure .env.local
npm run dev
# Runs on http://localhost:5173
```

3. **Access Application**
   - Open http://localhost:5173
   - Register or login

---

## Core Concepts

### Error Handling Strategy

**Backend → ApiResponse (always)**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "User-friendly error message",
  "data": null
}
```

**Frontend extracts message** → Shows in toast notification

### Authentication Flow

1. User logs in with credentials
2. Backend returns JWT tokens (access + refresh)
3. Frontend stores tokens in httpOnly cookies
4. Cookies auto-sent with each request
5. Backend validates token
6. Invalid token = 401 → logout

### API Response Format

All responses use `ApiResponse` class:
- `success`: boolean (statusCode < 400)
- `statusCode`: HTTP status
- `message`: User-friendly message
- `data`: Response payload

---

## API Endpoints

### Authentication (`/auth`)
- `POST /register` - Register user
- `POST /login` - Login
- `POST /logout` - Logout
- `GET /me` - Get profile
- `PATCH /update-profile` - Update profile
- `PATCH /update-email` - Change email
- `PATCH /update-userid` - Change user ID
- `POST /change-password` - Change password

### Documents (`/documents`)
- `POST /upload` - Upload document
- `GET /my-docs` - User's documents
- `GET /public` - Public documents
- `PATCH /:id` - Update document
- `DELETE /:id` - Delete document
- `GET /:id/download` - Download document

### Complaints (`/complaints`)
- `POST /` - Create complaint
- `GET /my-complaints` - User's complaints
- `GET /` - All complaints
- `PATCH /:id/status` - Update status
- `DELETE /:id` - Delete complaint

### Finance (`/finance`)
- `POST /transaction` - Create transaction
- `GET /transactions` - All transactions
- `GET /payroll` - Payroll records

### Notices (`/notices`)
- `POST /` - Create notice
- `GET /` - Get notices
- `DELETE /:id` - Delete notice

### Admin (`/admin`)
- `GET /users` - List users
- `GET /users/:id` - User details
- `PATCH /users/:id/status` - Update status
- `DELETE /users/:id` - Delete user
- `POST /employees` - Create employee
- `GET /employees` - List employees
- `GET /employees/:id` - Employee details
- `PATCH /employees/:id` - Update employee

### Analytics (`/analytics`)
- `GET /users` - User metrics
- `GET /documents` - Document metrics
- `GET /complaints` - Complaint metrics

### Moderator (`/mod`)
- `GET /users` - List users
- `GET /users/:id` - User details
- `PATCH /users/:id/status` - Update status
- `GET /documents/public` - Public documents
- `PATCH /documents/:id/toggle-visibility` - Toggle visibility

---

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_NAME=docsmini_db
MONGODB_URI=mongodb://localhost:27017
NODE_ENV=development
ACCESS_TOKEN_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
ADMIN_SECRET_CODE=admin123
MOD_SECRET_CODE=mod123
HR_SECRET_CODE=hr123
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Frontend (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Development

### Running Tests with Postman

After starting backend and frontend:

1. Test authentication flow
2. Test document upload/download
3. Test complaint creation
4. Test admin operations
5. Test error handling
6. Verify status codes

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string

**Port Already in Use**
- Change PORT in .env or kill process

**CORS Error**
- Verify frontend URL in CORS config
- Check withCredentials: true

**File Upload Fails**
- Verify Cloudinary credentials
- Check file size (max 16MB)
- Check file format

---

## Documentation

- **Backend API**: See `/backend/README.md`
- **Frontend Services**: See `/frontend/README.md`
- **Architecture Diagrams**: Add images in `<img here>` tags

---

## Refactoring Summary

### Phase 1: Role Middleware ✅
- Fixed duplicate `isMod` export
- Standardized all role checks to use `checkRole(['role'])`
- Unified error messages using UX_ERRORS

### Phase 2: Services ✅
- Verified error handling patterns
- Ensured consistent UX_ERRORS usage
- All services properly throw ApiError for business logic errors

### Phase 3: Controllers ✅
- Replaced ApiError with ApiResponse for user-facing messages
- Changed `throw new ApiError()` to `return res.status().json(new ApiResponse())`
- Maintains separation: validation errors return ApiResponse, system errors throw ApiError

### Phase 4: Error Middleware ✅
- Updated to transform ApiError to ApiResponse
- All responses sent as ApiResponse to frontend
- System crashes still logged to console

### Phase 5: Constants Organization ✅
- Created `/constants/roles.js` for ROLES constant
- Removed ROLES from main constants.js
- Centralized error constants in `/constants/uxErrors.js` and `/constants/systemErros.js`

### Phase 6: Documentation ✅
- Created `/backend/README.md` - API endpoints, architecture, setup
- Created `/frontend/README.md` - Services, error handling, components
- Created `/README.md` - Project overview, data flow, getting started

### Phase 7: .gitignore ✅
- Verified both `/backend/.gitignore` and `/frontend/.gitignore` exist
- Both contain proper exclusions

---

## Testing & Deployment

### Frontend
```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
```

### Backend
```bash
npm start        # Start server
npm test         # Run tests (if available)
```

---

## Security

✅ JWT authentication with httpOnly cookies
✅ Role-based access control
✅ Input validation
✅ Rate limiting
✅ CORS protection
✅ Password hashing

---

## Performance

- Lazy loading in React
- Database indexing
- Response caching
- Async file processing
- Connection pooling

---

## Support

For documentation:
- Backend: `/backend/README.md`
- Frontend: `/frontend/README.md`
- API: Full endpoint list in backend README

---

**Version**: 2.0  
**Status**: Refactoring Complete  
**Last Updated**: 2025-05-28
