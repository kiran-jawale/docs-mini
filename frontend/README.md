# Frontend Services Documentation

## Overview

DocsMini frontend is a React application providing a user interface for document management, complaint tracking, and administrative functions. It communicates with the backend via service classes that handle all API interactions.

## Setup & Installation

### Requirements
- Node.js v16+
- npm or yarn

### Installation Steps

1. Install dependencies
```bash
cd frontend
npm install
```

2. Configure environment variables (.env.local)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

3. Start development server
```bash
npm run dev
```

---

## Architecture Overview

### Folder Structure

```
frontend/src/
├── services/         # API service classes
│   ├── auth.service.js
│   ├── document.service.js
│   ├── complaint.service.js
│   ├── finance.service.js
│   ├── notice.service.js
│   ├── admin.service.js
│   ├── analytics.service.js
│   └── mod.service.js
├── pages/            # Page components (route-level)
│   ├── home/
│   ├── auth/
│   ├── docs/
│   ├── finance/
│   ├── contact/
│   ├── analytics/
│   └── layout/
├── components/       # Reusable UI components
│   ├── Container.jsx
│   ├── ToastContainer.jsx
│   ├── ModalContainer.jsx
│   └── [other components]
├── constants/        # Static configuration
│   ├── api.js        # Axios instance with interceptors
│   ├── errors.js     # Error messages and handler
│   └── [other constants]
├── contexts/         # React context providers
│   ├── ThemeContext.jsx
│   ├── DomContext.jsx
│   └── [other contexts]
├── hooks/            # Custom React hooks
└── main.jsx         # Entry point
```

---

## Services Documentation

### Auth Service (`auth.service.js`)

Handles user authentication operations.

#### Methods

```javascript
register(userData: object): Promise
// Registers new user or employee
// Expects: { fullname, email, password, regionCode, secretCode? }
// Returns: Created user object

login(credentials: object): Promise
// Authenticates user and sets cookies
// Expects: { identifier, password }
// Returns: { user, type: 'user'|'employee' }

logout(): Promise
// Clears session on backend

getMyProfile(): Promise
// Fetches current user's profile

updateProfile(data: object): Promise
// Updates user profile information

updateEmail(data: object): Promise
// Changes email address

updateUserID(data: object): Promise
// Changes user ID

changePassword(data: object): Promise
// Changes password
```

#### Example Usage

```javascript
import authService from '@/services/auth.service';

const response = await authService.login({
  identifier: 'user@docs.com',
  password: 'password123'
});

console.log(response.data.user); // User object
console.log(response.data.type); // 'user' or 'employee'
```

---

### Document Service (`document.service.js`)

Manages document upload, retrieval, and operations.

#### Methods

```javascript
uploadDocument(formData: FormData): Promise
// Uploads document file
// FormData includes: title, description, isPublic, file

getMyDocuments(): Promise
// Gets user's uploaded documents

getPublicDocuments(): Promise
// Gets publicly available documents

updateDocument(id: string, data: object): Promise
// Updates document metadata

deleteDocument(id: string): Promise
// Deletes document
```

#### Example Usage

```javascript
import documentService from '@/services/document.service';

const formData = new FormData();
formData.append('title', 'My Document');
formData.append('file', fileInput.files[0]);

const response = await documentService.uploadDocument(formData);
console.log(response.data); // Uploaded document object
```

---

### Complaint Service (`complaint.service.js`)

Handles complaint/ticket management.

#### Methods

```javascript
createComplaint(complaintData: object, files?: File[]): Promise
// Creates support ticket
// Expects: { subject, description }, optional images

getMyComplaints(): Promise
// Gets user's complaints

getAllComplaints(status?: string): Promise
// Gets all complaints (admin/mod only)

updateComplaintStatus(id: string, status: string): Promise
// Updates complaint status

deleteComplaint(id: string): Promise
// Deletes complaint
```

#### Example Usage

```javascript
import complaintService from '@/services/complaint.service';

const response = await complaintService.createComplaint({
  subject: 'Issue with document upload',
  description: 'Cannot upload PDF files'
}, imageFiles);

console.log(response.data); // Created complaint object
```

---

### Finance Service (`finance.service.js`)

Manages financial transactions.

#### Methods

```javascript
createTransaction(transactionData: object): Promise
// Records transaction
// Expects: { amount, type: 'Income'|'Expense'|'Payroll', description, recipientEmployee? }

getAllTransactions(): Promise
// Gets all transactions (admin only)

getPayrollTransactions(): Promise
// Gets payroll transactions (HR only)
```

#### Example Usage

```javascript
import financeService from '@/services/finance.service';

const response = await financeService.createTransaction({
  amount: 5000,
  type: 'Expense',
  description: 'Office supplies purchase'
});

console.log(response.data); // Transaction object
```

---

### Notice Service (`notice.service.js`)

Manages notices/announcements.

#### Methods

```javascript
createNotice(noticeData: object): Promise
// Creates notice (admin only)
// Expects: { title, message, type }

getActiveNotices(): Promise
// Gets current notices

deleteNotice(id: string): Promise
// Deletes notice (admin only)
```

---

### Admin Service (`admin.service.js`)

Provides admin operations for user management.

#### Methods

```javascript
getAllUsers(filters?: object): Promise
// Gets all users

getUserById(id: string): Promise
// Gets user details

updateUserStatus(id: string, status: string): Promise
// Changes user status

deleteUser(id: string): Promise
// Deletes user account

createEmployee(employeeData: object): Promise
// Creates employee account

getAllEmployees(filters?: object): Promise
// Gets all employees

getEmployeeById(id: string): Promise
// Gets employee details

updateEmployee(id: string, data: object): Promise
// Updates employee information
```

---

### Analytics Service (`analytics.service.js`)

Retrieves analytics and metrics.

#### Methods

```javascript
getUserAnalytics(filters?: object): Promise
// Gets user metrics

getDocAnalytics(filters?: object): Promise
// Gets document metrics

getComplaintAnalytics(filters?: object): Promise
// Gets complaint metrics

getFinanceAnalytics(filters?: object): Promise
// Gets finance metrics
```

---

### Mod Service (`mod.service.js`)

Provides moderator operations.

#### Methods

```javascript
getAllUsers(filters?: object): Promise
// Gets all users (limited view)

getUserById(id: string): Promise
// Gets user details

updateUserStatus(id: string, status: string): Promise
// Updates user status

getPublicDocuments(): Promise
// Gets public documents for moderation

toggleDocumentVisibility(id: string): Promise
// Toggles document visibility
```

---

## API Configuration

### Axios Instance (`constants/api.js`)

```javascript
import axios from 'axios';
import { getErrorMessage } from './errors';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Sends cookies automatically
});

// Response interceptor handles errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = getErrorMessage(error);
    
    // Silences session expiry toasts (background checks)
    const silentMessages = [
      "Your session has expired or is invalid. Please log in again.",
      "no_session",
    ];
    
    if (!silentMessages.includes(error.response?.data?.message)) {
      // Show error toast to user
      const event = new CustomEvent("show-toast", {
        detail: { message, type: "error" }
      });
      window.dispatchEvent(event);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

## Error Handling

### Error Extraction (`constants/errors.js`)

Frontend extracts `message` from backend response:

```javascript
// Backend sends:
{
  "success": false,
  "statusCode": 400,
  "message": "The email address is already registered."
}

// Frontend extracts: "The email address is already registered."
// Displays in toast notification
```

### Error Messages

**Frontend constants** (`FE_ERRORS`):
- `AUTH.REQUIRED_FIELDS` - Form validation errors
- `AUTH.UNAUTHORIZED` - 401 responses
- `AUTH.FORBIDDEN` - 403 responses
- `NETWORK.TIMEOUT` - Network timeouts
- `NETWORK.SERVER_ERROR` - 500+ errors
- `FILE.TOO_LARGE` - Upload size exceeded

**Backend constants** (`UX_ERRORS`):
- Takes priority when available
- User-friendly business logic errors

---

## Authentication Flow

### Token Management

1. **Login** - Credentials sent, backend returns tokens
2. **Cookies** - Tokens stored in httpOnly cookies (auto-sent with requests)
3. **Expiry** - AccessToken expires after 7 days
4. **Refresh** - Axios interceptor uses refreshToken to get new accessToken
5. **Logout** - Cookies cleared, user redirected to login

### Session Persistence

- Tokens persist in cookies across page refreshes
- Backend validates tokens on each request
- Invalid/expired tokens return 401, triggering logout

---

## Components

### Container
Generic layout wrapper for pages

### ToastContainer
Displays error/success notifications via CustomEvent

### ModalContainer
Generic modal component for dialogs

### ErrorBoundary
Catches React component errors

### DocumentViewer
Displays/previews documents

### NotificationsPanel
Shows real-time notifications

---

## Context Providers

### ThemeContext
Manages light/dark mode theme

### DomContext
Provides DOM utilities and state

---

## Running Tests

1. Start frontend dev server: `npm run dev`
2. Open http://localhost:5173 in browser
3. Test user flows:
   - Register and login
   - Upload documents
   - Create complaints
   - Admin user management
4. Monitor Network tab for API responses
5. Check console for errors

---

## Build & Deployment

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Environment Variables
- Development: `.env.local`
- Production: Set `VITE_API_BASE_URL` to production backend URL
