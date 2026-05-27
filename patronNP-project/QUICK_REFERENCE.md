# 🎯 QUICK REFERENCE CARD

## File Locations

| Feature | File Path | Lines |
|---------|-----------|-------|
| Main Router | `src/App.jsx` | 27 |
| Home (Search) | `src/pages/Home.jsx` | 49 |
| Sign In | `src/pages/SignIn.jsx` | 139 |
| Sign Up | `src/pages/SignUp.jsx` | 245 |
| Forgot Password | `src/pages/ForgotPassword.jsx` | 87 |
| OTP Verify | `src/pages/OTPVerification.jsx` | 91 |
| Reset Password | `src/pages/ResetPassword.jsx` | 174 |
| Search Results | `src/pages/SearchResults.jsx` | 72 |
| Auth Layout | `src/components/auth/AuthLayout.jsx` | 15 |
| Google OAuth | `src/components/auth/GoogleSignIn.jsx` | 44 |
| Search Modal | `src/components/search/SearchModal.jsx` | 122 |
| Results List | `src/components/search/SearchResultsList.jsx` | 34 |
| Auth Service | `src/services/authService.js` | 224 |
| Search Service | `src/services/searchService.js` | 130 |

## Routes Map

```
/                    → Home (Search Bar)
/signin              → Sign In Form
/signup              → Sign Up Form
/forgot-password     → Forgot Password
/verify-otp          → OTP Verification
/reset-password      → Reset Password
/results/:query      → Search Results
```

## Component Props

### SearchModal
```jsx
<SearchModal onClose={() => setIsSearchOpen(false)} />
```

### GoogleSignIn
```jsx
<GoogleSignIn onSuccess={handleGoogleSuccess} />
```

### SearchResultsList
```jsx
<SearchResultsList 
  results={results}
  isLoading={isSearching}
  onResultClick={(item) => { /* handle click */ }}
/>
```

## State Variables

### Form Inputs
```jsx
// Sign In
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// Sign Up
const [name, setName] = useState('');
const [agreeTerms, setAgreeTerms] = useState(false);

// Password
const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');

// OTP
const [otp, setOtp] = useState(['', '', '', '', '', '']);
```

## API Service Methods

### Auth Service (Mock)
```javascript
signInMock(email, password)
signUpMock(email, password, name)
forgotPasswordMock(email)
verifyOTPMock(email, otp)
resetPasswordMock(email, newPassword, token)
getCurrentUserMock(token)
logoutMock()
```

### Search Service (Mock)
```javascript
getTrendingItems()           // Returns array of strings
searchItems(query)           // Returns Promise<array>
```

## Validation Patterns

```javascript
// Email
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// OTP (6 digits)
/^\d+$/.test(otp) && otp.length === 6

// Password
password.length >= 8

// Passwords Match
password === confirmPassword
```

## Tailwind Classes Used

### Colors
```
blue-600      Primary button/link color
blue-100      Light blue background
blue-700      Hover state
gray-300      Border color
gray-600      Secondary text
gray-700      Primary text
gray-900      Heading text
red-600       Error text
green-600     Success text
```

### Spacing
```
px-4          Horizontal padding
py-2.5        Vertical padding
gap-3         Gap between items
mb-2          Margin bottom
mt-1          Margin top
```

### Components
```
rounded-lg    Border radius
shadow-xl     Box shadow
focus:ring-2  Focus state
hover:bg-*    Hover state
disabled:*    Disabled state
transition-*  Smooth transitions
```

## Common Tasks

### Navigate Between Pages
```jsx
const navigate = useNavigate();
navigate('/signin');
navigate(`/results/${query}`);
```

### Store User Data
```jsx
localStorage.setItem('user', JSON.stringify({ email, name }));
const user = JSON.parse(localStorage.getItem('user'));
```

### Show Loading State
```jsx
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>
```

### Display Error Message
```jsx
{error && (
  <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
    {error}
  </div>
)}
```

### Handle Form Submission
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  
  if (!validation) {
    setError('Error message');
    return;
  }
  
  setLoading(true);
  // API call
  setLoading(false);
};
```

## Environment Setup

### Development
```bash
npm run dev              # Start dev server
npm run lint            # Check code quality
npm run build           # Production build
```

### Install Packages
```bash
npm install                           # Install all
npm install @react-oauth/google       # Add Google OAuth
npm install axios                     # Add HTTP client
```

## Browser Storage

```javascript
// Save
localStorage.setItem('key', JSON.stringify(value));

// Get
const value = JSON.parse(localStorage.getItem('key'));

// Remove
localStorage.removeItem('key');

// Clear All
localStorage.clear();
```

## Useful Links

- React: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev
- Google OAuth: https://developers.google.com/identity/protocols/oauth2

---

**Print or bookmark this for quick reference!**
