import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { Authentication } from '@/components/Authentication';
import userEvent from '@testing-library/user-event';

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
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
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

  it("Renders Register text", () => {
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it("Switches to registration form when Register link is clicked", async () => {
    // Click the Register link
    await userEvent.click(screen.getByText(/register/i));

    // Assert registration UI is shown
    expect(screen.getByRole("heading", { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up with google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^register$/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it("Switches back to sign-in form when Login link is clicked", async () => {
    // First switch to registration form
    await userEvent.click(screen.getByText(/register/i));

    // Now click the Login link
    await userEvent.click(screen.getByText(/login/i));

    // Assert sign-in UI is shown again
    expect(screen.getByRole("heading", { name: /welcome back!/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in with google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /keep me logged in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });
});