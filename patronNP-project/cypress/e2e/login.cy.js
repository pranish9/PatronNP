// E2E coverage for SignIn.jsx's three-step state machine (email -> otp, or email -> password).
// Backend calls are stubbed with cy.intercept() so this suite runs standalone against just the
// Vite dev server -- no backend/DB/SMTP required, and no flakiness from real emailed OTPs.

describe('Login', () => {
  beforeEach(() => {
    // SignIn.jsx redirects away immediately on mount if a token already exists.
    cy.clearLocalStorage();
  });

  it('defaults to the email+OTP step and can switch to password login', () => {
    cy.visit('/signin');
    cy.contains('h2', 'Welcome Back').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('not.exist');

    cy.contains('button', 'Use password instead').click();
    cy.get('input[type="password"]').should('be.visible');
  });

  it('requires an email before an OTP can be requested', () => {
    cy.visit('/signin');
    cy.contains('button', 'Continue with Email').click();
    cy.contains('Email is required').should('be.visible');
  });

  it('logs in with email + password and lands on /onboarding when onboarding is incomplete', () => {
    cy.visit('/signin');
    cy.contains('button', 'Use password instead').click();

    cy.get('input[type="email"]').type('creator@example.com');
    cy.get('input[type="password"]').type('Passw0rd!');

    cy.intercept('POST', '/auth/login', {
      token: 'fake-jwt-token',
      id: 1,
      username: 'creator1',
      email: 'creator@example.com',
      role: 'CREATOR',
      onboardingCompleted: false,
    }).as('login');

    cy.contains('button', 'Login').click();
    cy.wait('@login');

    cy.location('pathname').should('eq', '/onboarding');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.eq('fake-jwt-token');
      expect(win.localStorage.getItem('onboardingCompleted')).to.eq('false');
    });
  });

  it('lands on /dashboard when onboarding is already complete', () => {
    cy.visit('/signin');
    cy.contains('button', 'Use password instead').click();

    cy.get('input[type="email"]').type('creator@example.com');
    cy.get('input[type="password"]').type('Passw0rd!');

    cy.intercept('POST', '/auth/login', {
      token: 'fake-jwt-token',
      id: 1,
      username: 'creator1',
      email: 'creator@example.com',
      role: 'CREATOR',
      onboardingCompleted: true,
    }).as('login');

    cy.contains('button', 'Login').click();
    cy.wait('@login');

    cy.location('pathname').should('eq', '/dashboard');
  });

  it('sends admins to /admin regardless of onboarding status', () => {
    cy.visit('/signin');
    cy.contains('button', 'Use password instead').click();

    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('Passw0rd!');

    cy.intercept('POST', '/auth/login', {
      token: 'fake-jwt-token',
      id: 1,
      username: 'admin1',
      email: 'admin@example.com',
      role: 'ADMIN',
      onboardingCompleted: false,
    }).as('login');

    cy.contains('button', 'Login').click();
    cy.wait('@login');

    cy.location('pathname').should('eq', '/admin');
  });

  it('shows an error on wrong password and stays on the login page', () => {
    cy.visit('/signin');
    cy.contains('button', 'Use password instead').click();

    cy.get('input[type="email"]').type('creator@example.com');
    cy.get('input[type="password"]').type('WrongPassword!');

    cy.intercept('POST', '/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid email or password' },
    }).as('login');

    cy.contains('button', 'Login').click();
    cy.wait('@login');

    cy.contains('Invalid email or password').should('be.visible');
    cy.location('pathname').should('eq', '/signin');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.be.null;
    });
  });

  it('logs in via the email OTP path', () => {
    cy.visit('/signin');

    cy.get('input[type="email"]').type('otpuser@example.com');
    cy.intercept('POST', '/auth/send-login-otp', {}).as('sendOtp');
    cy.contains('button', 'Continue with Email').click();
    cy.wait('@sendOtp');

    cy.get('input[placeholder="000000"]').should('be.visible');

    cy.intercept('POST', '/auth/verify-login-otp', {
      token: 'fake-jwt-token',
      id: 2,
      username: 'otpuser',
      email: 'otpuser@example.com',
      role: 'CREATOR',
      onboardingCompleted: true,
    }).as('verifyOtp');

    cy.get('input[placeholder="000000"]').type('123456');
    cy.contains('button', 'Login').click();
    cy.wait('@verifyOtp');

    cy.location('pathname').should('eq', '/dashboard');
  });

  it('shows an error on an invalid OTP and lets the user retry', () => {
    cy.visit('/signin');

    cy.get('input[type="email"]').type('otpuser@example.com');
    cy.intercept('POST', '/auth/send-login-otp', {}).as('sendOtp');
    cy.contains('button', 'Continue with Email').click();
    cy.wait('@sendOtp');

    cy.intercept('POST', '/auth/verify-login-otp', {
      statusCode: 400,
      body: { message: 'Invalid or expired OTP' },
    }).as('verifyOtp');

    cy.get('input[placeholder="000000"]').type('000000');
    cy.contains('button', 'Login').click();
    cy.wait('@verifyOtp');

    cy.contains('Invalid or expired OTP').should('be.visible');
    cy.get('input[placeholder="000000"]').should('have.value', '');
  });

  it('redirects an already-authenticated user straight to /dashboard', () => {
    cy.visit('/signin', {
      onBeforeLoad(win) {
        win.localStorage.setItem('accessToken', 'existing-token');
        win.localStorage.setItem('onboardingCompleted', 'true');
      },
    });

    cy.location('pathname').should('eq', '/dashboard');
  });
});
