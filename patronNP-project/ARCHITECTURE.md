# 📐 Architecture Overview

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    App.jsx (Router)                       │
│                                                           │
│  BrowserRouter → Routes → Route(path, element)          │
└─────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼─────┐  ┌────▼────┐  ┌───▼────────┐
        │   /         │  │ /signin  │  │ /signup    │
        │ Home.jsx    │  │          │  │            │
        └─────────────┘  └──────────┘  └────────────┘
                │
        ┌───────▼──────────────┐
        │  SearchModal         │
        │                      │
        │  - Search Input      │
        │  - Trending Items    │
        │  - Results List      │
        └──────────┬───────────┘
                   │
        ┌──────────▼──────────────┐
        │ /results/:query         │
        │ SearchResults.jsx       │
        └─────────────────────────┘


        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │ /signin      │   │ /forgot-pw   │   │ /verify-otp  │
        │ SignIn.jsx   │   │ ForgotPw.jsx │   │ OTP.jsx      │
        └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
               │                  │                   │
               └──────────────────┼───────────────────┘
                                  │
                          ┌────────▼──────────┐
                          │ /reset-password   │
                          │ ResetPassword.jsx │
                          └───────────────────┘
```

## Component Hierarchy

```
App.jsx
│
├─ Router
│  └─ Routes
│     ├─ Route(/)           → Home.jsx
│     │                       ├─ Navbar (existing)
│     │                       ├─ Hero (existing)
│     │                       ├─ SearchBar
│     │                       └─ SearchModal
│     │                           ├─ SearchInput
│     │                           ├─ TrendingItems
│     │                           └─ SearchResultsList
│     │
│     ├─ Route(/signin)     → SignIn.jsx
│     │                       ├─ AuthLayout
│     │                       ├─ Form
│     │                       │  ├─ EmailInput
│     │                       │  └─ PasswordInput
│     │                       └─ GoogleSignIn
│     │
│     ├─ Route(/signup)     → SignUp.jsx
│     │                       ├─ AuthLayout
│     │                       ├─ Form
│     │                       │  ├─ NameInput
│     │                       │  ├─ EmailInput
│     │                       │  ├─ PasswordInput
│     │                       │  ├─ ConfirmPasswordInput
│     │                       │  └─ TermsCheckbox
│     │                       └─ GoogleSignIn
│     │
│     ├─ Route(/forgot-password) → ForgotPassword.jsx
│     │                             ├─ AuthLayout
│     │                             └─ EmailForm
│     │
│     ├─ Route(/verify-otp) → OTPVerification.jsx
│     │                        ├─ AuthLayout
│     │                        └─ OTPForm (6 inputs)
│     │
│     ├─ Route(/reset-password) → ResetPassword.jsx
│     │                           ├─ AuthLayout
│     │                           └─ PasswordForm
│     │
│     └─ Route(/results/:query) → SearchResults.jsx
│                                 ├─ ResultsList
│                                 └─ ResultCard[]
```

## Data Flow

### Authentication Flow
```
User Input → Form Validation → authService → localStorage → Redirect
     ↓                              ↓
  Check fields            Mock/API call
  Format data             Returns user data
  Show errors             Stores token
```

### Search Flow
```
Click Search Bar → Modal Opens → User Types → searchService → Results Shown
                                         ↓
                                   Mock/API call
                                   Returns items
                                   Display list
                                        ↓
                                   User Clicks
                                   Navigate to
                                   Results Page
```

## State Management

### Component Level (useState)
```
Home.jsx
├─ isSearchOpen (boolean)

SignIn.jsx
├─ email (string)
├─ password (string)
├─ error (string)
├─ loading (boolean)

SignUp.jsx
├─ name, email, password, confirmPassword (string)
├─ showPassword, showConfirmPassword (boolean)
├─ agreeTerms (boolean)
├─ error (string)
├─ loading (boolean)

ForgotPassword.jsx
├─ email (string)
├─ success (boolean)
├─ loading (boolean)

OTPVerification.jsx
├─ otp[6] (array)
├─ error (string)
├─ loading (boolean)

ResetPassword.jsx
├─ newPassword, confirmPassword (string)
├─ success (boolean)
├─ loading (boolean)

SearchModal.jsx
├─ searchQuery (string)
├─ trending[] (array)
├─ results[] (array)
├─ isSearching (boolean)
├─ showResults (boolean)
```

## Service Architecture

```
Services/
│
├─ authService.js
│  ├─ signInMock(email, password)
│  ├─ signUpMock(email, password, name)
│  ├─ forgotPasswordMock(email)
│  ├─ verifyOTPMock(email, otp)
│  ├─ resetPasswordMock(email, newPassword, token)
│  └─ [API versions commented out - uncomment for production]
│
└─ searchService.js
   ├─ getTrendingItems()
   ├─ searchItems(query)
   └─ [API versions commented out - uncomment for production]
```

## Styling Architecture

```
Tailwind CSS Applied to:
├─ Layout
│  ├─ Flexbox (flex, gap, justify, items)
│  ├─ Grid (grid, grid-cols)
│  └─ Spacing (p, m, w, h)
│
├─ Typography
│  ├─ Font sizes (text-sm to text-3xl)
│  ├─ Font weights (font-medium to font-bold)
│  └─ Colors (text-gray-*, text-blue-*)
│
├─ Colors
│  ├─ Primary: Blue (blue-600, blue-700, blue-100)
│  ├─ Neutral: Gray (gray-300 to gray-900)
│  ├─ Status: Green (success), Red (error), Yellow (warning)
│  └─ Backgrounds (bg-white, bg-gray-50, bg-gradient-to-br)
│
├─ Interactions
│  ├─ Hover (hover:bg-*, hover:text-*)
│  ├─ Focus (focus:outline-none, focus:ring-2)
│  ├─ Disabled (disabled:opacity-50)
│  └─ Transitions (transition-colors)
│
└─ Components
   ├─ Buttons (py-2.5, px-4, rounded-lg, font-semibold)
   ├─ Inputs (border, rounded-lg, focus:ring-2)
   ├─ Modals (fixed, inset-0, bg-black bg-opacity-50)
   └─ Cards (bg-white, rounded-2xl, shadow-xl)
```

## API Integration Points

```
Current: Mock Data (localStorage)
↓
Production:

authService.js:
  POST /api/auth/signin          → signInAPI()
  POST /api/auth/signup          → signUpAPI()
  POST /api/auth/forgot-password → forgotPasswordAPI()
  POST /api/auth/verify-otp      → verifyOTPAPI()
  POST /api/auth/reset-password  → resetPasswordAPI()
  GET  /api/auth/current-user    → getCurrentUserAPI()

searchService.js:
  GET /api/search?q=query        → searchItemsAPI()
  GET /api/trending              → getTrendingItemsAPI()
```

## Browser Storage

```
localStorage
├─ user: { email, name }        → Set on sign in/up
├─ authToken: jwt_token         → Set on authentication
└─ [cleared on logout]

sessionStorage
├─ [optional: temporary state]

Cookies
├─ [optional: auth token]
```

---

**Architecture is modular, scalable, and ready for production!**
