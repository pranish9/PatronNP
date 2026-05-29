# Integration Guide - Payment & OTP APIs

## Quick Start for API Integration

### 1. Step1Identity - Username Availability Check

**Current Implementation (Mock):**
```javascript
const checkUsernameAvailability = async (value) => {
  // Mock reserved usernames
  const reserved = ['admin', 'api', 'www', 'mail', 'support', 'help', 'patronnp', 'admin123'];
  const available = !reserved.includes(value.toLowerCase());
  return available;
};
```

**Replace With (Real API):**
```javascript
const checkUsernameAvailability = async (value) => {
  try {
    const response = await fetch('https://api.patronnp.com/auth/check-username', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: value })
    });
    const data = await response.json();
    return data.available;
  } catch (error) {
    console.error('Username check failed:', error);
    return null;
  }
};
```

**Location:** Step1Identity.jsx, line ~45

---

### 2. Step2Authentication - Email Registration

**Current Implementation (Mock):**
```javascript
const handleEmailSubmit = (e) => {
  // ... validation ...
  // Simulates 1500ms delay
  setTimeout(() => {
    setFormData({ authMethod: 'email', email, password });
    onNext();
  }, 1500);
};
```

**Replace With (Real API):**
```javascript
const handleEmailSubmit = async (e) => {
  e.preventDefault();
  setError('');
  // ... validation ...

  setValidating(true);
  try {
    const response = await fetch('https://api.patronnp.com/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        authMethod: 'email'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    setFormData({
      authMethod: 'email',
      email,
      password,
      userId: data.userId // Store for later use
    });
    onNext();
  } catch (error) {
    setError(error.message || 'Registration failed');
  } finally {
    setValidating(false);
  }
};
```

**Location:** Step2Authentication.jsx, line ~56

---

### 3. Step4Payment - OTP Request & Verification

**Current Implementation (Mock):**
```javascript
const handleRequestOtp = async () => {
  setOtpLoading(true);
  setTimeout(() => {
    setOtpSent(true);
    setShowOtpModal(true);
    setOtpLoading(false);
  }, 1500);
};

const handleVerifyOtp = async () => {
  setVerifying(true);
  setTimeout(() => {
    if (['1234', '123456', '9999'].includes(otp)) {
      setPhoneVerified(true);
      // ...
    } else {
      setError('Invalid OTP');
    }
    setVerifying(false);
  }, 1500);
};
```

**Replace With (Real API):**
```javascript
const handleRequestOtp = async () => {
  if (!phoneNumber || paymentMethods.length === 0) return;

  setOtpLoading(true);
  try {
    const response = await fetch('https://api.patronnp.com/payment/request-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${formData.userId}` // Use stored userId
      },
      body: JSON.stringify({
        phoneNumber: formatPhoneNumber(phoneNumber),
        paymentProviders: paymentMethods
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    setOtpSent(true);
    setShowOtpModal(true);
  } catch (error) {
    setError(error.message || 'Failed to send OTP');
  } finally {
    setOtpLoading(false);
  }
};

const handleVerifyOtp = async () => {
  setVerifying(true);
  try {
    const response = await fetch('https://api.patronnp.com/payment/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${formData.userId}`
      },
      body: JSON.stringify({
        phoneNumber: formatPhoneNumber(phoneNumber),
        otp,
        paymentProviders: paymentMethods
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    setPhoneVerified(true);
    setShowOtpModal(false);
    setOtp('');
  } catch (error) {
    setError(error.message || 'OTP verification failed');
  } finally {
    setVerifying(false);
  }
};
```

**Location:** Step4Payment.jsx, lines ~51 and ~85

---

### 4. Step3Profile - Image Upload

**Current Implementation (Mock):**
```javascript
const handleImageUpload = (e) => {
  const file = e.target.files?.[0];
  // Validates and creates local preview
  const reader = new FileReader();
  reader.onload = (event) => {
    setProfilePictureUrl(event.target?.result);
  };
  reader.readAsDataURL(file);
};
```

**Replace With (Real API):**
```javascript
const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size must be less than 5MB');
    return;
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    setError('Only JPEG, PNG, and WebP images are supported');
    return;
  }

  setError('');
  setUploading(true);

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'profile-picture');

    const response = await fetch('https://api.patronnp.com/users/upload-picture', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${formData.userId}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    setProfilePictureUrl(data.url); // URL from server instead of data URI
  } catch (error) {
    setError(error.message || 'Upload failed');
  } finally {
    setUploading(false);
  }
};
```

**Location:** Step3Profile.jsx, line ~26

---

### 5. Final Step - Create User Page

**Add to OnboardingContainer.jsx or Step5FinalPage:**
```javascript
useEffect(() => {
  const createUserPage = async () => {
    try {
      const response = await fetch('https://api.patronnp.com/users/create-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${formData.userId}`
        },
        body: JSON.stringify({
          username: formData.username,
          displayName: formData.displayName,
          about: formData.about,
          profilePictureUrl: formData.profilePictureUrl,
          socialLinks: formData.socialLinks,
          paymentMethods: formData.paymentMethods,
          phoneNumber: formData.phoneNumber
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user page');
      }

      // Success - user page created
      setFormData(prev => ({ ...prev, publicPageCreated: true }));
    } catch (error) {
      console.error('Page creation failed:', error);
    }
  };

  if (currentStep === 5) {
    createUserPage();
  }
}, [currentStep]);
```

---

## Authentication & Security

### JWT Token Management
```javascript
// Store token after registration
const registerUser = async (credentials) => {
  const response = await fetch('https://api.patronnp.com/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });

  const data = await response.json();
  
  // Store token
  localStorage.setItem('authToken', data.token);
  
  // Use in subsequent requests
  const options = {
    headers: {
      'Authorization': `Bearer ${data.token}`
    }
  };
};
```

### CSRF Protection
```javascript
// Add CSRF token to payment requests
const getCsrfToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.content;
};

// Use in fetch
fetch('https://api.patronnp.com/payment/verify-otp', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': getCsrfToken(),
    'Content-Type': 'application/json'
  }
});
```

---

## Error Handling

### Retry Logic
```javascript
const retryFetch = async (url, options, maxRetries = 3) => {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  throw lastError;
};
```

### User-Friendly Error Messages
```javascript
const getErrorMessage = (error) => {
  if (error.message.includes('Network')) {
    return 'Network connection failed. Please check your internet.';
  }
  if (error.message.includes('Unauthorized')) {
    return 'Your session has expired. Please start again.';
  }
  if (error.message.includes('Conflict')) {
    return 'This username is already taken.';
  }
  return error.message || 'Something went wrong. Please try again.';
};
```

---

## Testing Integration

### Mock API Setup (for development)
```javascript
// Use this during development before real API is ready
const mockApiCall = async (endpoint, options) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock responses
  const mocks = {
    'auth/check-username': { available: true },
    'auth/register': { userId: 'user123', token: 'jwt_token' },
    'payment/request-otp': { success: true },
    'payment/verify-otp': { verified: true }
  };

  return mocks[endpoint] || { success: true };
};
```

---

## Environment Variables

**Create .env file:**
```
VITE_API_BASE_URL=https://api.patronnp.com
VITE_OTP_RESEND_TIMEOUT=60
VITE_MAX_IMAGE_SIZE=5242880
VITE_PAYMENT_PROVIDERS=esewa,khalti
```

**Use in code:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const OTP_TIMEOUT = import.meta.env.VITE_OTP_RESEND_TIMEOUT;
```

---

## Deployment Checklist

- [ ] Update API endpoints for production
- [ ] Remove mock API implementations
- [ ] Add proper error logging (Sentry/LogRocket)
- [ ] Implement rate limiting on frontend
- [ ] Add CSP headers for security
- [ ] Test with real payment gateways
- [ ] Verify HTTPS everywhere
- [ ] Test on real mobile devices
- [ ] Load test with concurrent users
- [ ] Backup user data regularly
- [ ] Monitor API performance
- [ ] Setup automated backups
