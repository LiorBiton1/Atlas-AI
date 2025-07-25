/* eslint-disable sonarjs/no-hardcoded-passwords */
export const RESET_PASSWORD_MESSAGE = {
    SUCCESS: "Password reset successfully! Redirecting to login...",
    FAILURE: "Failed to reset password",
    FAILURE_LATER: "Failed to reset password. Please try again later.",
    INVALID_TOKEN: "Invalid password reset token",
    EXPIRED_TOKEN: "Password reset token has expired or is invalid",
    PASSWORD_AND_TOKEN_REQUIRED: "Both password and token are required",
};

export const FORGOT_PASSWORD_MESSAGE = {
    SUCCESS: "If your email is registered, a reset link has been sent.",
    FAILURE: "Failed to send reset email",
    FAILURE_LATER: "Failed to send reset email. Please try again later.",
    NO_PASSWORD: "This account does not have a password set. Please use Google sign-in.",
}

export const REGISTRATION_MESSAGE = {
    SUCCESS: "Account created successfully! Please sign in.",
    FAILURE: "Registration failed. Please try again.",
    USER_SUCCESS: "User registered successfully",
    MISSING_FIELDS: "Missing required fields",
};

export const LOGIN_MESSAGE = {
    INVALID_CREDENTIALS: "Invalid username/email or password. Please try again.",
    USERNAME_OR_EMAIL_REQUIRED: "Username or email is required",
    SUCCESS: "Signed in successfully!",
    FAILURE: "Sign-in failed. Please try again.",
};