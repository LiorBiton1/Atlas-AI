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
}