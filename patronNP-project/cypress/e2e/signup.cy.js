// E2E coverage for the 3-step signup wizard (OnboardingContainer -> SignUpPhase1 ->
// AuthMethodChoice -> SignUpPhase2 -> VerifyOTPPage). All backend calls are stubbed with
// cy.intercept() — a real OTP is emailed via Gmail SMTP in production, which Cypress can't
// read, so these tests validate the frontend's own logic/state machine/localStorage writes
// against a fake-but-realistic backend contract instead of a live server.

describe('Signup', () => {
  beforeEach(() => {
    // SignUp.jsx redirects to /dashboard on mount if a token is already present.
    cy.clearLocalStorage();
  });

  function typeUsername(value) {
    cy.get('input[placeholder="yourname"]').clear().type(value);
  }

  it('shows a hint while the username is below the minimum length', () => {
    cy.visit('/signup');
    typeUsername('ab');
    cy.contains('Min 4 chars').should('be.visible');
    cy.contains('button', 'Continue').should('be.disabled');
  });

  it('flags a taken username and offers suggestions', () => {
    cy.intercept('GET', '/auth/check-username*', { available: false }).as('checkUsername');
    cy.visit('/signup');

    typeUsername('takenname');
    cy.wait('@checkUsername');

    cy.contains('Username Already Exists. Try these instead:').should('be.visible');
    cy.contains('button', 'Continue').should('be.disabled');
  });

  it('picking a suggestion makes the username available and unblocks Continue', () => {
    // First check (typed value) comes back taken; re-check after clicking a suggestion
    // comes back available — same intercept handles both since it always returns available:false
    // for the typed name and the suggestion click just swaps the input value locally.
    cy.intercept('GET', '/auth/check-username*', (req) => {
      const url = new URL(req.url);
      const username = url.searchParams.get('username');
      req.reply({ available: username !== 'takenname' });
    }).as('checkUsername');
    cy.visit('/signup');

    typeUsername('takenname');
    cy.wait('@checkUsername');
    cy.contains('button', 'its_takenname').click();
    cy.wait('@checkUsername');

    cy.contains('Username available!').should('be.visible');
    cy.contains('button', 'Continue').should('not.be.disabled');
  });

  it('completes the full flow: username -> email method -> password -> OTP -> account created', () => {
    cy.intercept('GET', '/auth/check-username*', { available: true }).as('checkUsername');
    cy.visit('/signup');

    typeUsername('newcreator123');
    cy.wait('@checkUsername');
    cy.contains('button', 'Continue').click();

    cy.contains('button', 'Email & Password').click();

    cy.get('input[type="email"]').type('newcreator@example.com');
    cy.get('input[placeholder="Password"]').type('StrongPass1!');
    cy.get('input[placeholder="Confirm Password"]').type('StrongPass1!');

    cy.intercept('POST', '/auth/send-otp', {}).as('sendOtp');
    cy.contains('button', 'Send OTP').click();
    cy.wait('@sendOtp');
    cy.location('pathname').should('eq', '/verify-otp');

    cy.intercept('POST', '/auth/verify-otp-register', {
      token: 'fake-jwt-token',
      id: 1,
      username: 'newcreator123',
      email: 'newcreator@example.com',
      role: 'CREATOR',
    }).as('verifyOtp');

    cy.get('input[placeholder="000000"]').type('123456');
    cy.contains('button', 'Create Account').click();
    cy.wait('@verifyOtp');

    cy.location('pathname').should('eq', '/onboarding');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('accessToken')).to.eq('fake-jwt-token');
      expect(win.localStorage.getItem('username')).to.eq('newcreator123');
    });
  });

  it('blocks submission on a weak password without calling the backend', () => {
    cy.intercept('GET', '/auth/check-username*', { available: true }).as('checkUsername');
    const sendOtpSpy = cy.spy().as('sendOtpSpy');
    cy.intercept('POST', '/auth/send-otp', sendOtpSpy);
    cy.visit('/signup');

    typeUsername('weakpassuser');
    cy.wait('@checkUsername');
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Email & Password').click();

    cy.get('input[type="email"]').type('weak@example.com');
    cy.get('input[placeholder="Password"]').type('weak');
    cy.get('input[placeholder="Confirm Password"]').type('weak');
    cy.contains('button', 'Send OTP').click();

    cy.contains('Password is too weak').should('be.visible');
    cy.get('@sendOtpSpy').should('not.have.been.called');
  });

  it('blocks submission when password and confirmation do not match', () => {
    cy.intercept('GET', '/auth/check-username*', { available: true }).as('checkUsername');
    cy.visit('/signup');

    typeUsername('mismatchuser');
    cy.wait('@checkUsername');
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Email & Password').click();

    cy.get('input[type="email"]').type('mismatch@example.com');
    cy.get('input[placeholder="Password"]').type('StrongPass1!');
    cy.get('input[placeholder="Confirm Password"]').type('StrongPass2!');
    cy.contains('button', 'Send OTP').click();

    cy.contains('Passwords do not match').should('be.visible');
  });

  it('shows a clear error when the email is already registered', () => {
    cy.intercept('GET', '/auth/check-username*', { available: true }).as('checkUsername');
    cy.visit('/signup');

    typeUsername('dupeuser');
    cy.wait('@checkUsername');
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Email & Password').click();

    cy.get('input[type="email"]').type('existing@example.com');
    cy.get('input[placeholder="Password"]').type('StrongPass1!');
    cy.get('input[placeholder="Confirm Password"]').type('StrongPass1!');

    cy.intercept('POST', '/auth/send-otp', { statusCode: 409 }).as('sendOtp');
    cy.contains('button', 'Send OTP').click();
    cy.wait('@sendOtp');

    cy.contains('This email is already registered').should('be.visible');
    cy.location('pathname').should('eq', '/signup');
  });

  it('shows an error and allows retry on an invalid OTP', () => {
    cy.intercept('GET', '/auth/check-username*', { available: true }).as('checkUsername');
    cy.visit('/signup');

    typeUsername('retryuser');
    cy.wait('@checkUsername');
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Email & Password').click();

    cy.get('input[type="email"]').type('retry@example.com');
    cy.get('input[placeholder="Password"]').type('StrongPass1!');
    cy.get('input[placeholder="Confirm Password"]').type('StrongPass1!');

    cy.intercept('POST', '/auth/send-otp', {}).as('sendOtp');
    cy.contains('button', 'Send OTP').click();
    cy.wait('@sendOtp');

    cy.intercept('POST', '/auth/verify-otp-register', {
      statusCode: 400,
      body: { message: 'Invalid or expired OTP' },
    }).as('verifyOtp');
    cy.get('input[placeholder="000000"]').type('000000');
    cy.contains('button', 'Create Account').click();
    cy.wait('@verifyOtp');

    cy.contains('Invalid or expired OTP').should('be.visible');
    cy.location('pathname').should('eq', '/verify-otp');
  });

  it('redirects straight to /signup if the OTP page is opened directly (no wizard state)', () => {
    cy.visit('/verify-otp');
    cy.location('pathname').should('eq', '/signup');
  });
});
