// Authentication Service - Mock and API approaches

/**
 * Mock authentication data
 */
const mockUsers = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
  },
];

/**
 * Sign In with email and password - Mock approach
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 */
export const signInMock = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);

      if (!user || user.password !== password) {
        reject(new Error('Invalid email or password'));
      } else {
        const token = btoa(`${email}:${Date.now()}`); // Simple token generation
        resolve({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
          token,
        });
      }
    }, 1000);
  });
};

/**
 * Sign Up with email, password, and name - Mock approach
 *
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User name
 * @returns {Promise<Object>} User data and token
 */
export const signUpMock = async (email, password, name) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.find(u => u.email === email)) {
        reject(new Error('Email already exists'));
      } else {
        const newUser = {
          id: mockUsers.length + 1,
          email,
          password,
          name,
        };
        mockUsers.push(newUser);
        const token = btoa(`${email}:${Date.now()}`);
        resolve({
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          },
          token,
        });
      }
    }, 1000);
  });
};

/**
 * Forgot Password - Send reset link - Mock approach
 *
 * @param {string} email - User email
 * @returns {Promise<Object>} Success message
 */
export const forgotPasswordMock = async (email) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        // For security, we don't reveal if email exists or not
        resolve({
          success: true,
          message: 'If this email exists, you will receive a password reset link',
        });
      } else {
        resolve({
          success: true,
          message: 'Password reset link sent to your email',
        });
      }
    }, 1000);
  });
};

/**
 * Verify OTP - Mock approach
 *
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Verification result
 */
export const verifyOTPMock = async (email, otp) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock OTP verification - in production, verify with backend
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        resolve({
          success: true,
          message: 'OTP verified',
          resetToken: btoa(`${email}:reset:${Date.now()}`),
        });
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 500);
  });
};

/**
 * Reset Password - Mock approach
 *
 * @param {string} email - User email
 * @param {string} newPassword - New password
 * @param {string} resetToken - Reset token from OTP verification
 * @returns {Promise<Object>} Success message
 */
export const resetPasswordMock = async (email, newPassword, resetToken) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        reject(new Error('User not found'));
      } else {
        user.password = newPassword;
        resolve({
          success: true,
          message: 'Password reset successfully',
        });
      }
    }, 1000);
  });
};

/**
 * Get current user - Mock approach
 *
 * @param {string} token - Auth token
 * @returns {Promise<Object>} User data
 */
export const getCurrentUserMock = async (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In production, verify token with backend
      const user = mockUsers[0]; // Mock current user
      resolve({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }, 500);
  });
};

/**
 * Logout - Mock approach
 *
 * @returns {Promise<void>}
 */
export const logoutMock = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      resolve();
    }, 300);
  });
};

/**
 * API Integration approach (for production)
 * Uncomment and modify as needed
 */

/*
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const signInAPI = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) throw new Error('Sign in failed');
  return response.json();
};

export const signUpAPI = async (email, password, name) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  
  if (!response.ok) throw new Error('Sign up failed');
  return response.json();
};

export const forgotPasswordAPI = async (email) => {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) throw new Error('Request failed');
  return response.json();
};

export const verifyOTPAPI = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  
  if (!response.ok) throw new Error('OTP verification failed');
  return response.json();
};

export const resetPasswordAPI = async (email, newPassword, resetToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword, resetToken }),
  });
  
  if (!response.ok) throw new Error('Password reset failed');
  return response.json();
};
*/
