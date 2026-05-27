# 🧪 Testing Checklist

## Before You Start
- [ ] Run `npm run dev` in the project directory
- [ ] Open `http://localhost:5173` in your browser
- [ ] Check browser console for any errors (F12 → Console)

## 🔐 Authentication Tests

### Sign In Page (`/signin`)
- [ ] Navigate to `/signin`
- [ ] Empty form shows "Please fill in all fields" error
- [ ] Invalid email shows "Please enter a valid email" error
- [ ] Show/hide password toggle works
- [ ] Can click "Forgot Password?" to go to forgot password page
- [ ] Can click "Sign Up" link to go to sign up page
- [ ] Google Sign In button is visible
- [ ] Submit form (any email/password) shows loading state then redirects to home

### Sign Up Page (`/signup`)
- [ ] Navigate to `/signup`
- [ ] Name field accepts text
- [ ] Email validation works
- [ ] Password and confirm password show match indicator
- [ ] Password strength indicator shows (weak → medium → strong)
- [ ] Terms checkbox must be checked
- [ ] "Sign In" link works
- [ ] Google Sign In button visible
- [ ] Form validation prevents submission with errors

### Forgot Password (`/forgot-password`)
- [ ] Navigate to `/forgot-password`
- [ ] "Back to Sign In" button works
- [ ] Invalid email shows error
- [ ] Valid email submission shows success message
- [ ] Auto-redirects to OTP verification after 2 seconds

### OTP Verification (`/verify-otp`)
- [ ] Navigate to `/verify-otp`
- [ ] Each field accepts single digit
- [ ] Auto-focus moves to next field on input
- [ ] Backspace moves to previous field
- [ ] "Back" button works
- [ ] 6-digit code submission works
- [ ] Resend OTP link visible

### Password Reset (`/reset-password`)
- [ ] After OTP verification, should redirect here
- [ ] New password and confirm password fields work
- [ ] Password strength indicator shows
- [ ] Passwords must match
- [ ] Show/hide toggle works
- [ ] Success message appears
- [ ] Auto-redirects to sign in after 2 seconds

## 🔍 Search Tests

### Home Page (`/`)
- [ ] Landing page loads with all sections
- [ ] Search bar is visible
- [ ] Click search bar → Modal opens
- [ ] Modal closes when X is clicked

### Search Modal
- [ ] Trending items display (8 items minimum)
- [ ] Can click trending items → Redirects to results
- [ ] Type in search input → Shows results
- [ ] Search input auto-focuses when modal opens
- [ ] Click outside or X → Modal closes

### Search Results (`/results/:query`)
- [ ] Navigate to `/results/web%20design`
- [ ] Shows query in heading
- [ ] Displays search results
- [ ] No results shows appropriate message
- [ ] Results have title, description, category, rating

## 🎨 UI/UX Tests

### Responsive Design
- [ ] Test on mobile (375px) - check padding and layout
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1024px+)
- [ ] All buttons are clickable
- [ ] Text is readable

### Visual Consistency
- [ ] All pages use same color scheme (blue)
- [ ] All buttons have same style
- [ ] Auth pages have gradient background
- [ ] Modal has proper overlay
- [ ] Shadows and rounded corners consistent

### Interactions
- [ ] All hover states work
- [ ] Loading states show spinners
- [ ] Error messages display in red
- [ ] Success messages display in green
- [ ] Form inputs have focus states

## 🔗 Navigation Tests

### Route Navigation
- [ ] `/` → Home page
- [ ] `/signin` → Sign In page
- [ ] `/signup` → Sign Up page
- [ ] `/forgot-password` → Forgot Password page
- [ ] `/verify-otp` → OTP Verification page
- [ ] `/reset-password` → Password Reset page
- [ ] `/results/test` → Search Results page
- [ ] Invalid route → 404 (expected)

### Link Navigation
- [ ] Sign In → "Sign Up" link works
- [ ] Sign Up → "Sign In" link works
- [ ] Sign In → "Forgot Password?" link works
- [ ] Forgot Password → "Back to Sign In" works
- [ ] OTP → "Back" button works
- [ ] Reset Password → "Back" button works

## 🐛 Error Handling

### Validation Errors
- [ ] Email format validation shows error
- [ ] Password too short shows error
- [ ] Passwords don't match shows error
- [ ] Required fields empty shows error
- [ ] OTP incomplete shows error

### Edge Cases
- [ ] Copy-paste into password field works
- [ ] Very long email accepted
- [ ] Special characters in password work
- [ ] Leading/trailing spaces handled

## 📱 Browser Compatibility

- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

## ✅ Final Checklist

- [ ] No console errors
- [ ] No console warnings (except third-party)
- [ ] All pages render correctly
- [ ] All links work
- [ ] All forms validate
- [ ] All modals work
- [ ] Responsive design works
- [ ] Ready for API integration

---

**Tip:** If any test fails, check the browser console (F12) for error messages.
Common issues: Missing imports, typos in route paths, component props.

**To run tests automatically:** Add Jest and React Testing Library (optional)
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```
