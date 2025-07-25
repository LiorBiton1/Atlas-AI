/**
 * Sends a POST request to reset a user's password using a reset token and new password.
 * @param token - The password reset token.
 * @param password - The new password to set.
 * @returns An object with the result of the operation.
 */
export async function resetPassword(token: string, password: string) {
    const response = await fetch("/api/auth/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken: token, password }),
    });

    const data = await response.json();

    return { ok: response.ok, data };
};

/**
 * Registers a new user with the provided details.
 * @param values - An object containing name, username, email, and password.
 * @returns An object with the result of the registration.
 */
export async function registerUser(values: { name: string; username: string; email: string; password: string }) {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    const data = await response.json();

    return { ok: response.ok, data };
};

/**
 * Initiates the password reset process for the given email address.
 * @param email - The user's email address.
 * @returns An object with the result of the operation.
 */
export async function forgotPassword(email: string) {
    const response = await fetch("/api/auth/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();

    return { ok: response.ok, data };
};