export function mapGoogleError(code: string) {
  switch (code) {
    case 'OAuthCallback':
      return 'Google sign‑in was cancelled or failed. Please try again.';
    case 'OAuthAccountNotLinked':
      return 'This email is already registered with a different sign‑in method.';
    case 'AccessDenied':
      return 'Access denied. Please grant permission to continue.';
    case 'Verification':
      return 'Unable to verify your Google account. Please try again.';
    default:
      return 'Google sign‑in failed. Please try again or use email registration.';
  }
};

export const GOOGLE_MESSAGE = {
  SIGN_IN_SUCCESS: "Google sign-in successful!",
  SIGN_UP_SUCCESS: "Google sign-up successful!",
  SIGN_IN_FAILURE: "Unable to connect to Google. Please check your connection and try again.",
  SIGN_UP_FAILURE: "Google sign-up failed. Please try again.",
};