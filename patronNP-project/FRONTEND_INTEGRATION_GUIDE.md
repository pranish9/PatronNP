# PatronNP Frontend - Ready for Backend Integration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

### 3. Development Server
```bash
npm run dev
```
Visit http://localhost:5173

### 4. Build for Production
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Navbar.jsx
│   ├── Layout.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Card.jsx
│   └── Alert.jsx
├── pages/             # Page components
│   ├── Home.jsx
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── CreatorProfile.jsx
│   └── Explore.jsx
├── services/          # API integration
│   ├── apiClient.js   # Axios configuration with JWT interceptors
│   ├── authService.js
│   ├── userService.js
│   └── paymentService.js
├── stores/            # State management (Zustand)
│   ├── authStore.js
│   └── themeStore.js
├── hooks/             # Custom React hooks
│   ├── useAuth.js
│   └── useLanguage.js
├── i18n/              # Internationalization
│   ├── i18n.js
│   └── locales/
│       ├── en.json
│       ├── ne.json
│       └── hi.json
└── App.jsx            # Main app with routing
```

## Features Implemented

### ✅ Authentication
- Email signup with username availability check
- Email signin
- Google OAuth ready (placeholder)
- JWT token management
- Protected routes
- Auto logout on token expiry

### ✅ Onboarding
- 4-step wizard (Profile Setup, Social Links, Payment, Preview)
- Form validation
- Progress tracking

### ✅ Creator Public Profile
- Route: `/@username`
- Support button with amount options
- Social links display
- Recent supporters
- Profile analytics placeholder

### ✅ Dashboards
- Creator dashboard with stats (earnings, supporters, views)
- Supporter dashboard (ready)
- Recent activity
- Quick actions

### ✅ Explore/Discovery
- Creator search and filtering
- Creator cards with profile info
- Save/favorite functionality

### ✅ Multilingual Support
- English, Nepali, Hindi
- Language switcher in navbar
- Persistent language preference
- Complete UI translations

### ✅ UI/UX
- Dark mode toggle
- Responsive design (mobile-first)
- Smooth animations
- Form validation with error messages
- Toast notifications
- Skeleton loaders ready

### ✅ State Management
- Zustand for auth and theme
- localStorage persistence
- Async token refresh hooks ready

## API Integration Ready

All services are configured to connect to backend at `http://localhost:8080/api`:

### Authentication Endpoints
- `POST /auth/signup` - Register new user
- `GET /auth/check-username/{username}` - Check username availability
- `POST /auth/send-otp` - Send OTP email
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/signin` - Login
- `POST /auth/google` - Google authentication
- `POST /auth/refresh-token` - Refresh access token

### User Endpoints
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/onboarding/complete` - Complete onboarding
- `GET /users/onboarding/status` - Get onboarding status
- `POST /users/profile-picture` - Upload profile picture

### Creator Endpoints
- `GET /creators/profile/{username}` - Get creator profile
- `GET /creators/stats` - Get creator statistics
- `GET /creators/supporters` - List supporters
- `GET /creators/analytics` - Get analytics

### Payment Endpoints
- `GET /payments/methods` - Get saved payment methods
- `POST /payments/methods` - Add payment method
- `POST /payments/initiate` - Initiate payment
- `POST /payments/{id}/verify` - Verify payment

## Technology Stack

- **React 19** + **Vite** - Fast development & builds
- **Tailwind CSS 4** - Utility-first styling
- **React Router v7** - Client-side routing
- **React Hook Form** - Form management
- **Zustand** - State management
- **i18next** - Internationalization
- **Axios** - HTTP client with JWT interceptors
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icons

## Environment Variables

```
VITE_API_URL             # Backend API URL (default: http://localhost:8080/api)
VITE_GOOGLE_CLIENT_ID    # Google OAuth client ID
VITE_ESEWA_MERCHANT_CODE # eSewa merchant code
VITE_KHALTI_PUBLIC_KEY   # Khalti public key
```

## Next Steps for Backend Integration

1. **Update API URLs** in `.env.local`
2. **Implement actual authentication flow** in services (currently using mock data)
3. **Setup CORS** in backend for frontend domain
4. **Generate JWT tokens** with appropriate expiry (15min access, 7day refresh)
5. **Implement payment integrations** (eSewa, Khalti sandboxes)
6. **Setup email service** for OTP delivery
7. **Add proper error handling** in API interceptors

## Authentication Flow (Ready to Connect)

1. User signs up → username check → OTP sent → OTP verified → Account created → Login
2. User logs in → JWT token issued → Auto-redirect to onboarding/dashboard
3. Protected routes check token in localStorage
4. Token refresh automatically on API calls
5. Auto-logout on token expiry or 401 response

## Notes

- All components are fully styled with dark mode support
- Responsive design tested on mobile, tablet, desktop
- Form validation with helpful error messages
- Toast notifications for user feedback
- State persists on page reload
- Ready for RTL language support (structure in place)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

---

**Backend ready!** Update the API URLs in `.env.local` and connect your Spring Boot backend.
