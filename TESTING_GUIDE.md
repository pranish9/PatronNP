# Multi-Step Onboarding Flow - Testing Guide

## Test Environment Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari)
- Mobile device for responsive testing

### Start Dev Server
```bash
npm install
npm run dev
# Server runs on http://localhost:5174
```

---

## Test Scenarios

### STEP 1: Identity & Username

#### Test Case 1.1: Valid Username Input
**Steps:**
1. Navigate to `/signup`
2. Enter "myartwork" in username field
3. Observe availability check completes

**Expected Result:**
- ✓ Username formatted to lowercase
- ✓ "Available" indicator shows (green checkmark)
- ✓ URL preview shows: `patronnp.com/myartwork`
- ✓ Continue button enabled

**Demo Code:**
```
Username: myartwork
Expected: Available ✓
```

---

#### Test Case 1.2: Reserved Username
**Steps:**
1. Enter "admin" username
2. Wait for availability check
3. Observe suggestions

**Expected Result:**
- ✗ Availability check shows "taken"
- ✓ 5 alternative suggestions appear (admin123, admin456, etc.)
- ✓ Suggestions are clickable
- ✓ Continue button disabled

**Demo Code:**
```
Username: admin
Suggestions: admin123, admin456, admin789, admin999, admin2024
```

---

#### Test Case 1.3: Invalid Username Characters
**Steps:**
1. Enter "my@artwork#2024"
2. Observe input cleaning

**Expected Result:**
- ✓ Special characters automatically removed
- ✓ Input becomes "myartwork2024"
- ✓ No error message (automatic cleanup)

---

#### Test Case 1.4: Username Length Validation
**Steps:**
1. Try entering "abc" (3 chars)
2. Observe error
3. Add 4th character "d"
4. Observe error clears

**Expected Result:**
- ✗ "abc" - Error: "must be at least 4 characters"
- ✓ "abcd" - Error clears, availability check starts
- ✓ Character counter shows: "4/25"

---

#### Test Case 1.5: Maximum Length Exceeded
**Steps:**
1. Try pasting very long username (50+ chars)
2. Observe input truncation

**Expected Result:**
- ✓ Input truncates at 25 characters
- ✓ Character counter shows: "25/25"
- ✓ No error message (automatic truncation)

---

#### Test Case 1.6: Progress to Step 2
**Steps:**
1. Enter available username "creatorname"
2. Click "Continue" button
3. Wait for page transition

**Expected Result:**
- ✓ Step 1 completion animation
- ✓ Page scrolls to top
- ✓ Step 2 loads: "Create Your Account"
- ✓ Form data preserved (can go back)

---

### STEP 2: Authentication

#### Test Case 2.1: Email Registration with Password
**Steps:**
1. Enter email: "user@example.com"
2. Enter password: "StrongPass123!"
3. Confirm password
4. Click "Continue with Email"

**Expected Result:**
- ✓ Email validation passes (format recognized)
- ✓ Password strength shows "Strong" (green)
- ✓ Password confirmation matches indicator
- ✓ Button shows "Verifying..." with spinner
- ✓ Advances to Step 3 after 1.5s delay

---

#### Test Case 2.2: Weak Password Rejection
**Steps:**
1. Enter password: "weak"
2. Observe strength indicator
3. Try to submit

**Expected Result:**
- ✗ Password strength shows "Very Weak" (red)
- ✗ Tooltip: "Use uppercase, lowercase, numbers, and symbols"
- ✗ Submit blocked with helpful message

---

#### Test Case 2.3: Password Mismatch
**Steps:**
1. Enter password: "StrongPass123!"
2. Enter confirm: "StrongPass123@"
3. Try to submit

**Expected Result:**
- ✗ Error: "Passwords do not match"
- ✓ Both fields remain visible for editing

---

#### Test Case 2.4: Invalid Email Format
**Steps:**
1. Enter email: "notanemail"
2. Try to submit

**Expected Result:**
- ✗ Error: "Please enter a valid email address"

---

#### Test Case 2.5: Show/Hide Password
**Steps:**
1. Enter password: "Secret123!"
2. Click eye icon to toggle visibility

**Expected Result:**
- ✓ Password displays as dots (default)
- ✓ Clicking eye shows password text
- ✓ Clicking eye again hides password

---

#### Test Case 2.6: Google OAuth (when configured)
**Steps:**
1. Click "Google Sign In" button
2. Complete Google authentication

**Expected Result:**
- ✓ Google popup/redirect occurs
- ✓ After auth, advances to Step 3
- ✓ Email auto-filled from Google account

---

#### Test Case 2.7: Back Button Navigation
**Steps:**
1. From Step 2, click "Back" button
2. Verify Step 1 state

**Expected Result:**
- ✓ Returns to Step 1
- ✓ Username still filled (data persisted)
- ✓ Page scrolls to top

---

### STEP 3: Profile Setup

#### Test Case 3.1: Profile Picture Upload
**Steps:**
1. Click "Add photo" button
2. Select a JPEG image (< 5MB)
3. Observe upload

**Expected Result:**
- ✓ File picker opens
- ✓ Image preview displays immediately
- ✓ Button changes to "Picture uploaded"
- ✓ Edit icon appears on hover

---

#### Test Case 3.2: Invalid Image File
**Steps:**
1. Try uploading a .gif or .webp file
2. Try uploading > 5MB file

**Expected Result:**
- ✗ GIF error: "Only JPEG, PNG, and WebP images are supported"
- ✗ Large file error: "Image size must be less than 5MB"

---

#### Test Case 3.3: Display Name Validation
**Steps:**
1. Leave display name empty
2. Click "Continue"

**Expected Result:**
- ✗ Error: "Display name is required"

---

#### Test Case 3.4: Display Name Length
**Steps:**
1. Enter "A" (1 character)
2. Try to submit

**Expected Result:**
- ✗ Error: "must be at least 2 characters"

---

#### Test Case 3.5: About Section Character Limit
**Steps:**
1. Try pasting 600+ characters of text

**Expected Result:**
- ✓ Text truncates at 500 characters
- ✓ Counter shows: "500/500"

---

#### Test Case 3.6: Social Links Validation
**Steps:**
1. Enter invalid URL: "not a url"
2. Click Continue

**Expected Result:**
- ✗ Error indicates invalid URL format

**Steps:**
2. Enter valid URL: "https://twitter.com/myhandle"
3. Click Continue

**Expected Result:**
- ✓ Checkmark shows next to field
- ✓ No error

---

#### Test Case 3.7: Profile Preview
**Steps:**
1. Fill in all fields:
   - Picture: upload image
   - Name: "John Creator"
   - About: "Digital artist & painter"
   - Twitter: "https://twitter.com/john"
2. Observe live preview

**Expected Result:**
- ✓ Preview card shows on right/bottom
- ✓ Picture displays in preview
- ✓ Name, about, and links visible
- ✓ All data updates in real-time

---

#### Test Case 3.8: Optional Fields
**Steps:**
1. Enter name and about only
2. Leave all social links empty
3. Click Continue

**Expected Result:**
- ✓ Form submits successfully
- ✓ No error for empty social links

---

### STEP 4: Payment Registration (MANDATORY)

#### Test Case 4.1: Payment Provider Selection
**Steps:**
1. See eSewa and Khalti options
2. Click eSewa card
3. Click Khalti card

**Expected Result:**
- ✓ eSewa selection highlights (emerald border)
- ✓ Khalti selection highlights (emerald border)
- ✓ Both can be selected together
- ✓ Checkmark appears on selected

---

#### Test Case 4.2: At Least One Provider Required
**Steps:**
1. Click "Continue" without selecting provider

**Expected Result:**
- ✗ Error: "Please select at least one payment provider"

---

#### Test Case 4.3: Phone Number Input
**Steps:**
1. Enter phone: "9812345678"
2. Click "Send OTP"

**Expected Result:**
- ✓ Input validates as 10 digits
- ✓ Button shows "Sending..." with spinner
- ✓ After 1.5s, OTP modal appears

---

#### Test Case 4.4: Phone Number Validation
**Steps:**
1. Enter invalid phone: "123" (too short)
2. Click "Send OTP"

**Expected Result:**
- ✗ Button disabled
- ✗ Error: "Phone number must be 10 digits"

---

#### Test Case 4.5: Phone Number Masking
**Steps:**
1. Enter phone: "9812345678"
2. Send OTP
3. Observe modal

**Expected Result:**
- ✓ Modal shows: "OTP sent to ****5678"
- ✓ Last 4 digits only visible
- ✓ First 6 digits masked

---

#### Test Case 4.6: OTP Verification (Demo)
**Steps:**
1. Enter OTP: "1234"
2. Click "Verify OTP"

**Expected Result:**
- ✓ Button shows "Verifying..." with spinner
- ✓ After 1.5s, modal closes
- ✓ Phone marked as verified (green checkmark)
- ✓ Success message: "Phone verified: ****5678"

---

#### Test Case 4.7: Invalid OTP
**Steps:**
1. Enter OTP: "0000"
2. Click "Verify OTP"

**Expected Result:**
- ✗ Error: "Invalid OTP. Please try again."
- ✓ Modal stays open for retry

---

#### Test Case 4.8: OTP Retry
**Steps:**
1. Click "Cancel" on OTP modal
2. Request OTP again

**Expected Result:**
- ✓ Modal closes
- ✓ "Send OTP" button still visible
- ✓ Can request new OTP

---

#### Test Case 4.9: Continue Without Verification
**Steps:**
1. Select payment provider
2. Try clicking "Continue" without verifying phone

**Expected Result:**
- ✗ Error: "Phone number verification is required"
- ✓ Continue disabled

---

#### Test Case 4.10: Continue After Verification
**Steps:**
1. Select payment provider (e.g., eSewa)
2. Send OTP and verify with "1234"
3. Click "Continue"

**Expected Result:**
- ✓ Modal closes, modal button disappears
- ✓ Page advances to Step 5
- ✓ Success animation plays

---

### STEP 5: Final Page

#### Test Case 5.1: Page Layout
**Steps:**
1. Observe final page after Step 4

**Expected Result:**
- ✓ Celebration animation (checkmark, emojis)
- ✓ Heading: "Your Creator Page is Ready!"
- ✓ Public URL displayed (patronnp.com/username)
- ✓ Preview of creator page
- ✓ Account summary sidebar

---

#### Test Case 5.2: Copy URL Button
**Steps:**
1. Click copy icon next to URL
2. Paste in text field

**Expected Result:**
- ✓ Icon changes to checkmark
- ✓ Toast: "Copied to clipboard!"
- ✓ URL in clipboard matches display

---

#### Test Case 5.3: Share Button
**Steps:**
1. Click "Share Page" button

**Expected Result:**
- ✓ Native share sheet appears (on mobile)
- ✓ On desktop, copies URL to clipboard

---

#### Test Case 5.4: View Public Page
**Steps:**
1. Click "View Public Page" button

**Expected Result:**
- ✓ Opens new tab/window
- ✓ URL: patronnp.com/username
- ✓ Shows profile with all collected data

---

#### Test Case 5.5: Account Summary
**Steps:**
1. Observe sidebar info

**Expected Result:**
- ✓ Email displayed
- ✓ Auth method shown (email/google)
- ✓ Payment methods listed (esewa, khalti, etc.)

---

#### Test Case 5.6: Next Steps Guide
**Steps:**
1. Read next steps section

**Expected Result:**
- ✓ 3 actionable steps listed
- ✓ Clear guidance for new users

---

#### Test Case 5.7: Go to Dashboard
**Steps:**
1. Click "Go to Dashboard" button

**Expected Result:**
- ✓ Navigates to /dashboard
- ✓ User is logged in and ready

---

#### Test Case 5.8: Create Another Account
**Steps:**
1. Click "Create Another Account →" link

**Expected Result:**
- ✓ Returns to Step 1
- ✓ All form data cleared
- ✓ Can start fresh flow

---

## Cross-Step Tests

### Test Case X.1: Session Storage Persistence
**Steps:**
1. Complete Step 1
2. Refresh page (F5)
3. Observe state

**Expected Result:**
- ✓ Returns to Step 1 with data preserved
- ✓ Username field still filled
- ✓ Can continue from where left off

---

### Test Case X.2: Back Navigation
**Steps:**
1. Progress to Step 4
2. Click "Back"
3. Verify all data

**Expected Result:**
- ✓ Returns to Step 3
- ✓ All form data intact
- ✓ Can edit previous steps

---

### Test Case X.3: Progress Bar Updates
**Steps:**
1. Start at Step 1
2. Advance through each step
3. Observe progress bar

**Expected Result:**
- ✓ Bar fills progressively (20%, 40%, 60%, 80%)
- ✓ Step indicator updates (1 of 5, 2 of 5, etc.)
- ✓ Correct step name displayed

---

### Test Case X.4: Form Data Consistency
**Steps:**
1. Fill Step 1 with "testuser"
2. Advance to Step 5
3. Check final page

**Expected Result:**
- ✓ Username matches: testuser
- ✓ All profile data present
- ✓ Payment methods shown

---

## Mobile Responsiveness Tests

### Test Case M.1: Mobile Layout
**Steps:**
1. Open on mobile device (320px width)
2. Navigate through all steps

**Expected Result:**
- ✓ All elements readable without zoom
- ✓ Buttons touch-sized (>44px)
- ✓ Form inputs fully visible
- ✓ No horizontal scroll needed

---

### Test Case M.2: Image Upload on Mobile
**Steps:**
1. On mobile, click "Add photo"
2. Take new photo or select from gallery

**Expected Result:**
- ✓ Camera/gallery picker opens
- ✓ Photo uploads correctly
- ✓ Preview visible

---

### Test Case M.3: OTP Input on Mobile
**Steps:**
1. On mobile, reach OTP modal
2. Try numeric input

**Expected Result:**
- ✓ Numeric keyboard appears
- ✓ Input accepts digits only
- ✓ Auto-focuses OTP field

---

## Browser Compatibility Tests

### Test Case B.1: Chrome
- ✓ Run through all 5 steps
- ✓ Test image upload
- ✓ Verify animations smooth

### Test Case B.2: Firefox
- ✓ Run through all 5 steps
- ✓ Test form validation
- ✓ Verify no console errors

### Test Case B.3: Safari (iOS)
- ✓ Test on iPhone
- ✓ Test camera upload
- ✓ Verify OTP input keyboard

---

## Performance Tests

### Test Case P.1: Page Load Time
**Steps:**
1. Clear cache
2. Load signup page
3. Measure load time

**Expected Result:**
- ✓ Initial load < 3 seconds
- ✓ Step transitions < 500ms
- ✓ No jank or stuttering

---

### Test Case P.2: Image Optimization
**Steps:**
1. Upload large image (5MB)
2. Monitor network tab

**Expected Result:**
- ✓ Image optimized before upload
- ✓ Visible improvement in performance

---

## Security Tests

### Test Case S.1: Password Visibility Toggle
**Steps:**
1. Enter password
2. Toggle visibility
3. Verify not logged

**Expected Result:**
- ✓ Password visible when toggled
- ✓ Hidden by default
- ✓ No security warnings in console

---

### Test Case S.2: Phone Masking
**Steps:**
1. Enter phone: "9812345678"
2. Observe mask in OTP modal

**Expected Result:**
- ✓ Phone displayed as: ****5678
- ✓ Only last 4 digits visible

---

### Test Case S.3: SessionStorage Cleanup
**Steps:**
1. Complete flow
2. Close browser window
3. Reopen browser
4. Go to signup

**Expected Result:**
- ✓ Form data cleared (session ended)
- ✓ Can start fresh

---

## Error Scenario Tests

### Test Case E.1: Network Error Recovery
**Steps:**
1. Disable network during username check
2. Observe error handling

**Expected Result:**
- ✓ Error displayed gracefully
- ✓ Retry option available
- ✓ No app crash

---

### Test Case E.2: API Timeout
**Steps:**
1. With network throttled, request OTP

**Expected Result:**
- ✓ Timeout detected
- ✓ User-friendly error message
- ✓ Retry possible

---

### Test Case E.3: Invalid Response Handling
**Steps:**
1. Trigger invalid API response

**Expected Result:**
- ✓ No console errors
- ✓ Graceful error display
- ✓ Recovery instructions

---

## Demo Test Flow (Quick 10 Minutes)

```
1. Go to http://localhost:5174/signup
2. Enter username: "demouser"
3. Accept suggestion or continue
4. Enter email: demo@example.com, password: DemoPass123!
5. Upload profile picture
6. Fill name: Demo Creator
7. Add about: "Testing PatronNP"
8. Add Twitter: https://twitter.com/demo
9. Select eSewa payment provider
10. Enter phone: 9812345678
11. Send OTP, enter 1234
12. Verify: See final page!
```

---

## Bug Report Template

```
Title: [Brief description]

Severity: Critical | High | Medium | Low

Steps to Reproduce:
1. 
2. 
3. 

Expected Result:


Actual Result:


Screenshots/Video:


Browser/Device:
- Browser: 
- OS: 
- Device: 

Additional Notes:

```
