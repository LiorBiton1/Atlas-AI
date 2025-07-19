import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Authentication } from '@/components/Authentication';
import { signIn } from 'next-auth/react';
import userEvent from '@testing-library/user-event';

// Mock the signIn function from next-auth
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  signIn: jest.fn(),
}));

describe("Authentication Sign-in rendering", () => {
  beforeEach(() => {
    // Reset the Authentication components state before each test
      render(<MantineProvider><Authentication /></MantineProvider>);
  });

  it("Renders Welcome Back", () => {
    expect(screen.getByRole("heading", { name: /welcome back!/i })).toBeInTheDocument();
  });

  it("Renders Username or Email input", () => {
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
  });

  it("Renders Password input", () => {
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("Renders Sign in with Google button", () => {
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
  });

  it("Renders Keep me logged in checkbox", () => {
    expect(screen.getByRole("checkbox", { name: /keep me logged in/i })).toBeInTheDocument();
  });

  it("Renders Sign in Button", () => {
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
  });

  it("Renders Don't have an account? text", () => {
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it("Renders Register link", () => {
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});

describe("Register and Login button functionality", () => {
  beforeEach(() => {
    // Reset the Authentication components state before each test
      render(<MantineProvider><Authentication /></MantineProvider>);
  });

  it("Switches to registration form when Register is clicked", async () => {
    // Click the Register link
    await userEvent.click(screen.getByText(/register/i));

    // Assert registration UI is shown
    expect(screen.getByRole("heading", { name: /create an account/i })).toBeInTheDocument();
  });

  it("Switches back to sign-in form when Login is clicked", async () => {
    // First switch to registration form
    await userEvent.click(screen.getByText(/register/i));

    // Now click the Login link
    await userEvent.click(screen.getByText(/login/i));

    // Assert sign-in UI is shown again
    expect(screen.getByRole("heading", { name: /welcome back!/i })).toBeInTheDocument();
  });
});

describe("Authentication Register rendering", () => {
  beforeEach(async () => {
    // Reset the Authentication components state before each test
      render(<MantineProvider><Authentication /></MantineProvider>);
      
      // Click the Register link to switch to registration form
      await userEvent.click(screen.getByText(/register/i));
  });

  it("Renders Create an Account heading", () => {
    expect(screen.getByRole("heading", { name: /create an account/i })).toBeInTheDocument();
  });

  it("Renders Full Name input", () => {
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });

  it("Renders Username input", () => {
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it("Renders Email Address input", () => {
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
  });

  it("Renders Password input", () => {
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("Renders Sign up with Google button", () => {
    expect(screen.getByRole("button", { name: /sign up with google/i })).toBeInTheDocument();
  });

  it("Renders Register Button", () => {
    expect(screen.getByRole("button", { name: /^register$/i })).toBeInTheDocument();
  });

  it("Renders Already have an account text", () => {
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  it("Renders Login link", () => {
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});

describe("Authentication Sign in Functionality", () => {
  beforeEach(() => {
    // Reset the Authentication components state before each test
      jest.resetAllMocks();
      render(<MantineProvider><Authentication /></MantineProvider>);
  })

  it("Pressing the sign in button with empty fields shows error", async () => {
    // Click the Sign in button without filling any fields
    await userEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    //Empty Username or Email
    expect(screen.getByText(/Username or email is required/i)).toBeInTheDocument();

    //Empty Password
    expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeInTheDocument();
  });

  it("Pressing the eye icon toggles password visibility", async () => {
    const passwordInput = screen.getByLabelText(/^password$/i);
    const eyeIcon = screen.getByRole("button", { name: /toggle password visibility/i});

    // Initially, the password should be of type 'password'
    expect(passwordInput).toHaveAttribute("type", "password");
    // Click the eye icon to toggle visibility
    await userEvent.click(eyeIcon);
    // Now the password input should be of type 'text'
    expect(passwordInput).toHaveAttribute("type", "text");
    // Click the eye icon again to toggle visibility back
    await userEvent.click(eyeIcon);
    // The password input should be back to type 'password'
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("Pressing the sign in button with valid credentials shows success", async () => {
    // Mock the signIn function to simulate a successful response
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    // Fill in valid credentials
    await userEvent.type(screen.getByLabelText(/username or email/i), "testuser");
    await userEvent.type(screen.getByLabelText(/^password$/i), "validpassword");

    // Click the Sign in button
    await userEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    // Show success message
    expect(screen.getByText(/Signed in successfully!/i)).toBeInTheDocument();
  });

  it("Pressing the sign in button with invalid credentials shows error", async () => {
    // Overwrite the signIn mock to simulate an error response
    (signIn as jest.Mock).mockResolvedValueOnce({ error: "Invalid credentials", ok: false });
    
    // Fill in invalid credentials
    await userEvent.type(screen.getByLabelText(/username or email/i), "invaliduser");
    await userEvent.type(screen.getByLabelText(/^password$/i), "wrongpassword");

    // Click the Sign in button
    await userEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    // Show error message
    expect(screen.getByText(/Invalid username\/email or password. Please try again./i)).toBeInTheDocument();
  });

  it("Pressing the Sign in with Google button calls signIn with correct parameters", async () => {
    // Mock the signIn function
    (signIn as jest.Mock).mockResolvedValueOnce({ ok: true });

    // Click the Sign in with Google button
    await userEvent.click(screen.getByRole("button", { name: /sign in with google/i }));

    // Check if signIn was called with 'google' provider
    expect(signIn).toHaveBeenCalledWith("google", { redirect: false, callbackUrl: "/" });
  });

  const googleErrors = [
    { error: "OAuthCallback", message: "Google sign‑in was cancelled or failed. Please try again." },
    { error: "OAuthAccountNotLinked", message: "This email is already registered with a different sign‑in method." },
    { error: "AccessDenied", message: "Access denied. Please grant permission to continue." },
    { error: "Verification", message: "Unable to verify your Google account. Please try again." },
    { error: "OtherError", message: "Google sign‑in failed. Please try again or use email registration." },
  ];

  it.each(googleErrors)("Pressing the Sign in with Google button handles $error error", async ({ error, message }) => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error, ok: false });
    
    // Click the Sign in with Google button
    await userEvent.click(screen.getByRole("button", { name: /sign in with google/i }));

    // Check if the error message is displayed
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  // Test for the "Keep me logged in" checkbox @TODO

});