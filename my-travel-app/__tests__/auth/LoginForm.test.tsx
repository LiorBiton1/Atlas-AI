/* eslint-disable sonarjs/no-hardcoded-passwords */
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { LoginForm } from '@/components/auth/LoginForm';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import userEvent from '@testing-library/user-event';
import "@testing-library/jest-dom";
import { LOGIN_MESSAGE } from '@/utils/auth';

// Mock next-auth
jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

const pendingPromise = () => new Promise(() => { });

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Test utilities
const renderLoginForm = (props = {}) => {
    return render(
        <MantineProvider>
            <LoginForm {...props} />
        </MantineProvider>
    );
};

describe("LoginForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Rendering Login Form", () => {
        beforeEach(() => {
            renderLoginForm();
        });

        it("Renders Welcome back", () => {
            expect(screen.getByRole("heading", { name: /Welcome back/i })).toBeInTheDocument();
        });
        it("Renders Sign in with Google button", () => {
            expect(screen.getByRole("button", { name: /Sign in with Google/i })).toBeInTheDocument();
        });
        it("Renders username or email input field", () => {
            expect(screen.getByLabelText(/Username or Email/i)).toBeInTheDocument();
        });
        it("Renders password input field", () => {
            expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
        });
        it("Renders forgot password link", () => {
            expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
        });
        it("Renders Keep me logged in checkbox", () => {
            expect(screen.getByRole("checkbox", { name: /Keep me logged in/i })).toBeInTheDocument();
        });
        it("Renders Login button", () => {
            expect(screen.getByRole("button", { name: /^Login$/i })).toBeInTheDocument();
        });
        it("Renders register link", () => {
            expect(screen.getByText(/Don't have an account\?/i)).toBeInTheDocument();
            expect(screen.getByText(/Register/i)).toBeInTheDocument();
        });
    });

    describe("Google Button Functionality", () => {
        let mockNotify: jest.Mock;
        const mockSignIn = signIn as jest.Mock;

        beforeEach(() => {
            mockNotify = jest.fn();
            mockSignIn.mockClear();
            mockPush.mockClear();
            renderLoginForm({ onNotify: mockNotify });
        });

        it("Calls signIn with google provider when clicked", async () => {
            // Find the Google Sign-In button
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // Click the Google Sign-In button
            await userEvent.click(googleButton);

            // Verify signIn was called with correct parameters
            expect(mockSignIn).toHaveBeenCalledWith("google", {
                redirect: false,
                callbackUrl: "/home"
            });
        });

        it("Shows loading state when Google button is clicked", async () => {
            // Mock signIn to return a promise
            mockSignIn.mockImplementation(pendingPromise);

            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // Click the Google Sign-In button
            await userEvent.click(googleButton)

            // Check for Mantine's loading data attributes
            expect(googleButton).toHaveAttribute("data-loading", "true");
            expect(googleButton).toHaveAttribute("data-disabled", "true");
            expect(googleButton).toBeDisabled();

            // Check that the label has loading attribute
            const buttonLabel = googleButton.querySelector(".mantine-Button-label");
            expect(buttonLabel).toHaveAttribute("data-loading", "true");
        });

        it("Navigates to home on successful Google sign-in", async () => {
            //Mock successful Google authentication
            mockSignIn.mockResolvedValueOnce({ ok: true });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // Click the Google Sign-In button
            await userEvent.click(googleButton);

            // Verify navigation to home page
            expect(mockPush).toHaveBeenCalledWith("/home");
        });

        it("Shows error notification on Google sign-in failure", async () => {
            // Mock failed Google authentication
            mockSignIn.mockResolvedValueOnce({ error: "OAuthAccountNotLinked" });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // Click the Google Sign-In button
            await userEvent.click(googleButton);

            // Verify error notification
            expect(mockNotify).toHaveBeenCalledWith("error", expect.any(String));
        });

        it("Disables all form elements during Google sign-in", async () => {
            // Mock pending Google authentication
            mockSignIn.mockImplementation(pendingPromise);
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks the Google Sign-In button
            await userEvent.click(googleButton);

            // Verify all form elements are disabled
            expect(screen.getByLabelText(/Username or Email/i)).toBeDisabled();
            expect(screen.getByLabelText(/^Password$/i)).toBeDisabled();
            expect(screen.getByRole("checkbox")).toBeDisabled();
            expect(screen.getByRole("button", { name: /^Login$/i })).toBeDisabled();
            expect(googleButton).toBeDisabled();
        });


        it("Shows correct error for cancelled Google sign-in", async () => {
            // Mock Google sign-in cancellation
            mockSignIn.mockResolvedValueOnce({ error: "Callback" });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks Google sign-in button
            await userEvent.click(googleButton);

            // Verify specific cancellation error message
            expect(mockNotify).toHaveBeenCalledWith("error", "Google sign‑in was cancelled or failed. Please try again.");
        });

        it("Shows correct error for OAuth account not linked", async () => {
            // Mock OAuth account not linked error
            mockSignIn.mockResolvedValueOnce({ error: "OAuthAccountNotLinked" });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks Google sign-in button
            await userEvent.click(googleButton);

            // Verify specific error message for unlinked account
            expect(mockNotify).toHaveBeenCalledWith("error", "This email is already registered with a different sign‑in method.");
        });

        it("Shows correct error for access denied", async () => {
            // Mock Google access denail
            mockSignIn.mockResolvedValueOnce({ error: "AccessDenied" });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks Google sign-in button
            await userEvent.click(googleButton);

            // Verify access denied error message
            expect(mockNotify).toHaveBeenCalledWith("error", "Access denied. Please grant permission to continue.");
        });

        it("Shows correct error for verification failure", async () => {
            // Mock Google verification failure
            mockSignIn.mockResolvedValueOnce({ error: "Verification" });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks Google sign-in button
            await userEvent.click(googleButton);

            // Verify verification failure error message
            expect(mockNotify).toHaveBeenCalledWith("error", "Unable to verify your Google account. Please try again.");
        });

        it("Handles network/exception errors during Google sign-in", async () => {
            // Mock network error or exception
            mockSignIn.mockRejectedValueOnce(new Error("Network Error"));
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks Google sign-in button
            await userEvent.click(googleButton);

            // Verify fallback error handling
            expect(mockNotify).toHaveBeenCalledWith("error", "Unable to connect to Google. Please check your connection and try again.");
        });

        it("Shows default error for unknown Google sign-in errors", async () => {
            // Mock unknown Google error code
            mockSignIn.mockResolvedValueOnce({ error: "UnknownError" });
            const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });

            // User clicks Google sign-in button
            await userEvent.click(googleButton);

            // Verify default error message from mapGoogleError
            expect(mockNotify).toHaveBeenCalledWith("error", "Google sign‑in failed. Please try again or use email registration.");
        });
    });

    describe("Login Form Functionality", () => {
        let mockNotify: jest.Mock;
        const mockSignIn = signIn as jest.Mock;

        beforeEach(() => {
            mockNotify = jest.fn();
            mockSignIn.mockClear();
            mockPush.mockClear();
            renderLoginForm({ onNotify: mockNotify });
        });

        describe("Form Validation", () => {
            it("Shows validation errors on empty form submission", async () => {
                // Find the Login button
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // User clicks the Login button
                await userEvent.click(loginButton);

                // Check for validation error messages
                expect(await screen.findByText(/Username or email is required/i)).toBeInTheDocument();
                expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
            });

            it("Shows error for username too short", async () => {
                // Tests with invalid username too short
                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Type username with only 2 characters
                await userEvent.type(usernameField, "ab");
                await userEvent.type(passwordField, "validPassword123");
                await userEvent.click(loginButton);

                // Check for username error message
                expect(await screen.findByText(/Username must be at least 3 characters/i)).toBeInTheDocument();
            });

            it("Shows error for password too short", async () => {
                // Find the username and password fields
                const usernameInput = screen.getByLabelText(/Username or Email/i);
                const passwordInput = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Fill in the form with invalid password
                await userEvent.type(usernameInput, "validUser");
                await userEvent.type(passwordInput, "12345"); // Invalid password
                await userEvent.click(loginButton);

                // Check for validation error message
                expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
            });

            it("Shows Error for invalid credentials", async () => {
                // Mock sign-in to return error
                mockSignIn.mockResolvedValueOnce({ error: "InvalidCredentials" });

                // Test with invalid username and password
                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Fill in the form with invalid credentials
                await userEvent.type(usernameField, "invalidUser");
                await userEvent.type(passwordField, "invalidPassword");
                await userEvent.click(loginButton);

                // Check that signIn was called
                expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                    redirect: false,
                    username: "invalidUser",
                    email: undefined,
                    password: "invalidPassword"
                });

                // Check for notification
                expect(mockNotify).toHaveBeenCalledWith("error", "Invalid username/email or password. Please try again.");
            });

            it("Accepts valid email and password", async () => {
                // Mock successful signIn
                mockSignIn.mockResolvedValueOnce({ ok: true });

                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Type valid email and password
                await userEvent.type(usernameField, "user@example.com");
                await userEvent.type(passwordField, "validPassword123");
                await userEvent.click(loginButton);

                // From should submit - signIn should be called with the email parameter
                expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                    redirect: false,
                    username: undefined,
                    email: "user@example.com",
                    password: "validPassword123"
                });
            });

            it("Accepts valid username and password", async () => {
                // Mock successful signIn
                mockSignIn.mockResolvedValueOnce({ ok: true });

                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Type valid username and password
                await userEvent.type(usernameField, "validUser");
                await userEvent.type(passwordField, "validPassword123");
                await userEvent.click(loginButton);

                // Form should submit - signIn should be called with the username parameter
                expect(mockSignIn).toHaveBeenCalledWith("credentials", {
                    redirect: false,
                    username: "validUser",
                    email: undefined,
                    password: "validPassword123"
                });
            });

            it("Handles network/exception errors during credential sign-in", async () => {
                // Mock network error or exception
                mockSignIn.mockRejectedValueOnce(new Error("Network Error"));

                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Fill in the form with valid credentials
                await userEvent.type(usernameField, "validUser");
                await userEvent.type(passwordField, "validPassword123");

                // Click the Login button
                await userEvent.click(loginButton);

                // Verify the catch block error handling
                expect(mockNotify).toHaveBeenCalledWith("error", LOGIN_MESSAGE.FAILURE);
            });
        });

        describe("Form Submission Behavior", () => {
            it("Shows loading state during form submission", async () => {
                // Mock signIn to return a pending promise
                mockSignIn.mockImplementation(pendingPromise);

                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Fill in the form with valid credentials
                await userEvent.type(usernameField, "validUser");
                await userEvent.type(passwordField, "validPassword123");

                // Click the Login button
                await userEvent.click(loginButton);

                // Check for loading state
                const buttonLabel = loginButton.querySelector(".mantine-Button-label");
                expect(buttonLabel).toHaveAttribute("data-loading", "true");
                expect(buttonLabel).toHaveAttribute("data-loading", "true");
                expect(loginButton).toBeDisabled();
            });

            it("Disables all form elements during submission", async () => {
                // Mock signIn to return a pending promise
                mockSignIn.mockImplementation(pendingPromise);

                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });
                const googleButton = screen.getByRole("button", { name: /Sign in with Google/i });
                const checkbox = screen.getByRole("checkbox");

                // Fill in the form with valid credentials
                await userEvent.type(usernameField, "validUser");
                await userEvent.type(passwordField, "validPassword123");

                // Click the Login button
                await userEvent.click(loginButton);

                // Check that all form elements are disabled
                expect(usernameField).toBeDisabled();
                expect(passwordField).toBeDisabled();
                expect(checkbox).toBeDisabled();
                expect(loginButton).toBeDisabled();
                expect(googleButton).toBeDisabled();
            });

            it("Shows success notification and navigates on successful login", async () => {
                // Mock successful signIn
                mockSignIn.mockResolvedValueOnce({ ok: true });

                const usernameField = screen.getByLabelText(/Username or Email/i);
                const passwordField = screen.getByLabelText(/^Password$/i);
                const loginButton = screen.getByRole("button", { name: /^Login$/i });

                // Fill in the form with valid credentials
                await userEvent.type(usernameField, "validUser");
                await userEvent.type(passwordField, "validPassword123");

                // Click the Login button
                await userEvent.click(loginButton);

                // Check success notification is called
                expect(mockNotify).toHaveBeenCalledWith("success", "Signed in successfully!");

                // Wait for the setTimeout and check callbacks
                await delay(1100);
                expect(mockPush).toHaveBeenCalledWith("/home");
            });
        });
    });

    describe("Callback Functions", () => {
        let mockNotify: jest.Mock;
        const mockSignIn = signIn as jest.Mock;

        beforeEach(() => {
            mockNotify = jest.fn();
            mockSignIn.mockClear();
            mockPush.mockClear();        
        });

        it("Calls onSuccess callback on successful login", async () => {
            // Mock onSuccess callback
            const mockOnSuccess = jest.fn();
            mockSignIn.mockResolvedValueOnce({ ok: true });

            // Render the LoginForm with onSuccess
            renderLoginForm({ onSuccess: mockOnSuccess, onNotify: mockNotify });

            const usernameField = screen.getByLabelText(/Username or Email/i);
            const passwordField = screen.getByLabelText(/^Password$/i);
            const loginButton = screen.getByRole("button", { name: /^Login$/i });

            // Fill in the form with valid credentials
            await userEvent.type(usernameField, "validUser");
            await userEvent.type(passwordField, "validPassword123");

            // Click the Login button
            await userEvent.click(loginButton);

            // Check that the success notification was called
            expect(mockNotify).toHaveBeenCalledWith("success", "Signed in successfully!");

            // Wait for the setTimeout and check callbacks
            await delay(1100);
            expect(mockOnSuccess).toHaveBeenCalled();

            // Verify navigation to home page
            expect(mockPush).toHaveBeenCalledWith("/home");
        });

        it("Calls onRegister callback when Register link is clicked", async () => {
            // Mock onRegister callback
            const mockOnRegister = jest.fn();

            // Render the LoginForm with onRegister
            renderLoginForm({ onRegister: mockOnRegister });

            // Find the Register link
            const registerLink = screen.getByText(/Register/i);

            // User clicks the Register link
            await userEvent.click(registerLink);

            // Verify onRegister callback was called
            expect(mockOnRegister).toHaveBeenCalled();
        });

        it("Calls onForgotPassword callback when Forgot Password link is clicked", async () => {
            // Mock onForgotPassword callback
            const mockOnForgotPassword = jest.fn();

            // Render the LoginForm with onForgotPassword
            renderLoginForm({ onForgotPassword: mockOnForgotPassword });

            // Find the Forgot Password link
            const forgotPasswordLink = screen.getByText(/Forgot password\?/i);

            // User clicks the Forgot Password link
            await userEvent.click(forgotPasswordLink);

            // Verify onForgotPassword callback was called
            expect(mockOnForgotPassword).toHaveBeenCalled();
        });
    });
});
