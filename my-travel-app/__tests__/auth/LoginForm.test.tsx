import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { LoginForm } from "@/components/auth/LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// --- Mock signIn and router.push ---
jest.mock("next-auth/react", () => ({
  ...jest.requireActual("next-auth/react"),
  signIn: jest.fn(),
}));
const mockSignIn = signIn as jest.Mock;

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush });

describe("Log-in rendering", () => {
  beforeEach(() => {
    render(
      <MantineProvider>
        <LoginForm />
      </MantineProvider>,
    );
  });

  it("Renders Welcome Back", () => {
    expect(
      screen.getByRole("heading", { name: /welcome back!/i }),
    ).toBeInTheDocument();
  });

  it("Renders Sign in with Google", () => {
    expect(
      screen.getByRole("button", { name: /sign in with google/i }),
    ).toBeInTheDocument();
  });

  it("Renders Username or Email field", () => {
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
  });

  it("Renders Password field", () => {
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it("Renders Forgot Password link", () => {
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  it("Renders Keep me logged in checkbox", () => {
    expect(
      screen.getByRole("checkbox", { name: /keep me logged in/i }),
    ).toBeInTheDocument();
  });

  it("Renders Login Button", () => {
    expect(
      screen.getByRole("button", { name: /^login$/i }),
    ).toBeInTheDocument();
  });

  it("Renders Don't have an account? text", () => {
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it("Renders Register link", () => {
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });
});

describe("Login Form functionality", () => {
  let mockNotify: jest.Mock;
  beforeEach(() => {
    mockNotify = jest.fn(); // Create a new mock function for notifications
    mockSignIn.mockReset(); // Reset the mock for signIn to clear previous calls/results
    render(
      <MantineProvider>
        <LoginForm onNotify={mockNotify} />
      </MantineProvider>,
    );
    mockSignIn.mockReset();

    mockPush.mockReset();
  });

  it("Shows validation errors on empty form submission", async () => {
    // Click the Login button without typing anything
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    // Show both validation errors
    expect(
      await screen.findByText(/Username or email is required/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password must be at least 6 characters/i),
    ).toBeInTheDocument();
  });

  it("Calls onNotify with error when credentials are invalid", async () => {
    // Mock the signIn function to return an error
    mockSignIn.mockResolvedValueOnce({ error: "Invalid credentials" });

    // Fill in the form with invalid credentials
    await userEvent.type(
      screen.getByLabelText(/username or email/i),
      "invalidUser",
    );
    await userEvent.type(screen.getByLabelText(/^password$/i), "wrongPassword");

    // Click the Login button
    await userEvent.click(screen.getByRole("button", { name: /^login$/i }));

    // Expect onNotify to be called with an error message
    expect(mockNotify).toHaveBeenCalledWith(
      "error",
      "Invalid username/email or password. Please try again.",
    );
  });
});
