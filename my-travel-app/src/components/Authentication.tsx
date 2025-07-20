import { Anchor, Button, Checkbox, Group, Paper, PasswordInput, Text, TextInput, Title, Alert } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GoogleButton } from './GoogleButton';
import { useForm } from '@mantine/form';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

import classes from './Authentication.module.css';

// Function to map Google sign-in errors to user-friendly messages
function mapGoogleError(code: string) {
  switch (code) {
    case "OAuthCallback":
      return "Google sign‑in was cancelled or failed. Please try again.";
    case "OAuthAccountNotLinked":
      return "This email is already registered with a different sign‑in method.";
    case "AccessDenied":
      return "Access denied. Please grant permission to continue.";
    case "Verification":
      return "Unable to verify your Google account. Please try again.";
    default:
      return "Google sign‑in failed. Please try again or use email registration.";
  }
}

export function Authentication() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("reset_token");

  // Login and Register states
  const [isLogin, setIsLogin] = useState(true);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot Password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  
  // Reset Password state
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);


  useEffect(() => {
    const error = searchParams.get("error");
    if (pathname === "/auth" && error) {
      setNotification({ type: "error", message: mapGoogleError(error) });
      router.replace("/auth");
    }

    // If the reset token is in the URL
    if(resetToken) {
      setShowResetPassword(true);
      setShowForgotPassword(false);
    }
  }, [pathname, searchParams, router, resetToken]);

  // Login and Register form
  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      usernameOrEmail: "",
      password: "",
      name: "",
      rememberMe: false,
    },
    validate: {
      email: (value) => {
        if (!isLogin) {
          if (value.trim().length === 0) return "Email is required";
          if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email";
        }
        return null;
      },
      username: (value) => !isLogin && value.trim().length < 3 ? "Username must be at least 3 characters" : null,
      usernameOrEmail: (value) => isLogin && value.trim().length < 1 ? "Username or email is required" : null,
      password: (value) => value.length >= 6 ? null : "Password must be at least 6 characters long",
      name: (value) => !isLogin && value.trim().length < 1 ? "Name is required" : null,
    },
  });

  // Reset Password Form
  const resetForm = useForm({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: {
      password: (value) => value.length >= 6 ? null : "Password must be at least 6 characters long",
      confirmPassword: (value, values) => value !== values.password ? "Passwords do not match" : null,
    },
  });

  // Login form submission handler
  const handleLogin = async (values: typeof form.values) => {
    setLoading(true);
    setNotification(null);

    try {
      // Determine if the user is using username or email
      const isEmail = /^\S+@\S+\.\S+$/.test(values.usernameOrEmail);

      const result = await signIn("credentials", {
        redirect: false,
        username: isEmail ? undefined : values.usernameOrEmail,
        email: isEmail ? values.usernameOrEmail : undefined,
        password: values.password
      });

      if (result?.error) {
        setNotification({ type: "error", message: "Invalid username/email or password. Please try again." });
      }
      else if (result?.ok) {
        // Successful sign-in
        setNotification({ type: "success", message: "Signed in successfully!" });
        setTimeout(() => {
          router.push("/"); // redirect after 1.5 seconds
          setNotification(null);   // clear success message
        }, 1000);
      }
    }
    catch (error) {
      console.error("Sign-in error:", error);
      setNotification({ type: "error", message: "Sign-in failed. Please try again." });
    }
    finally {
      setLoading(false);
    }
  };

  // Register form submission handler
  const handleRegister = async (values: typeof form.values) => {
    setLoading(true);
    setNotification(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          name: values.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: "success", message: "Account created successfully! Please sign in." });
        form.reset();
        setTimeout(() => setIsLogin(true), 2000); // Auto-switch to login after 2 seconds
        setIsLogin(true);
      }
      else if(data.field) {
        // Username taken, email exists errors
        form.setFieldError(data.field, data.error);
      }
      else {
        // General error
        setNotification({ type: "error", message: data.error || "Registration failed" });
      }
    }
    catch (error) {
      console.error("Registration error:", error);
      setNotification({ type: "error", message: "Registration failed" });
    }
    finally {
      setLoading(false);
    }
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setNotification(null);

      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/" // Change this to wherever I want to go to after I login via google
      });

      if (result?.error) {
        // Handle error from Google sign-in
        setNotification({ type: "error", message: mapGoogleError(result.error) });
      }
      else if (result?.ok) {
        // Successful sign-in
        console.log('Google sign-in successful');
        router.push("/"); // redirect to home page or desired page
      }
    }
    catch (error) {
      console.error("Google sign-in error:", error);
      setNotification({ type: "error", message: "Unable to connect to Google. Please check your connection and try again." });
    }
    finally {
      setGoogleLoading(false);
    }
  };

  // Forgot Password handler
  const handleForgotPassword = async () => {
    if(!forgotEmail) {
      setNotification({ type: "error", message: "Please enter your email address." });
      return;
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(forgotEmail)) {
      setNotification({ type: "error", message: "Invalid email format" });
      return;
    }

    setForgotPasswordLoading(true);
    setNotification(null);

    try {
      const response = await fetch("/api/auth/forgot_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: "success", message: data.message });
        setForgotEmail("");
      }
      else {
        setNotification({ type: "error", message: data.error || "Failed to send reset email" });
      }
    }
    catch(error) {
      console.error("Forgot password error:", error);
      setNotification({ type: "error", message: "Failed to send reset email. Please try again later." });
    }
    finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (values: typeof resetForm.values) => {
    const token = resetToken || searchParams.get("reset_token");

    if(!token) {
      setNotification({ type: "error", message: "Invalid reset token." });
      return;
    }

    setResetPasswordLoading(true);
    setNotification(null);

    try {
      const response = await fetch("/api/auth/reset_password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification({ type: "success", message: "Password reset successfully! Redirecting to login..." });
        resetForm.reset();
        setTimeout(() => {
          setShowResetPassword(false);
          setIsLogin(true);
          router.replace("/auth");
        }, 2000);
      } else {
        setNotification({ type: "error", message: data.error || "Failed to reset password" });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setNotification({ type: "error", message: "Failed to reset password. Please try again later." });
    } finally {
      setResetPasswordLoading(false);
    }
  };

  // Determine the form submission handler based on the current state
  let onSubmitHandler: React.FormEventHandler<HTMLFormElement>;
  if(showResetPassword) {
    onSubmitHandler = resetForm.onSubmit(handleResetPassword);
  }
  else if(isLogin) {
    onSubmitHandler = form.onSubmit(handleLogin);
  }
  else {
    onSubmitHandler = form.onSubmit(handleRegister);
  }

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        {notification && (
          <Alert
            icon={notification.type === "success" ? <IconCheck size="1rem" /> : <IconAlertCircle size="1rem" />}
            title={notification.type === "success" ? "Success!" : "Error!"}
            color={notification.type === "success" ? "green" : "red"}
            mb="md"
            onClose={() => setNotification(null)}
            withCloseButton
          >
            {notification.message}
          </Alert>
        )}

        <form onSubmit={onSubmitHandler}>
          {!showForgotPassword && !showResetPassword && (
            <Title order={2} className={classes.title}>
              {isLogin ? 'Welcome back!' : 'Create an account'}
            </Title>
          )}

          {/* Reset Password Form */}
          {showResetPassword ? (
            <Paper className={classes.form} mt="md" p="md">
              <Title order={3} mb="md">Set New Password</Title>
              <Text mb="md">
                Enter your new password below.
              </Text>

              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                size="md"
                radius="md"
                {...resetForm.getInputProps("password")}
                visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm your new password"
                mt="md"
                size="md"
                radius="md"
                {...resetForm.getInputProps("confirmPassword")}
                visibilityToggleButtonProps={{ "aria-label": "toggle confirm password visibility" }}
              />

              <Button fullWidth mt="md" size="md" radius="md" type="submit" disabled={resetPasswordLoading} loading={resetPasswordLoading}>
                Reset Password
              </Button>

              <Text ta="center" mt="md">
                <Anchor fw={500} onClick={() => {
                  setShowResetPassword(false);
                  setIsLogin(true);
                  router.replace('/auth');
                }}>
                  Back to login
                </Anchor>
              </Text>
            </Paper>
          ) : showForgotPassword ? (
            // Forgot Password Form
            <Paper className={classes.form} mt="md" p="md">
              <Title order={3} mb="md">Reset your password</Title>
              <Text mb="md">
                Enter your email address below, and we will send you a link to reset your password.
              </Text>
              
              <TextInput
                label="Email Address"
                placeholder="Enter your email"
                size="md"
                radius="md"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              <Button fullWidth mt="md" size="md" radius="md" onClick={handleForgotPassword} disabled={forgotPasswordLoading} loading={forgotPasswordLoading}>
                Reset Password
              </Button>

              <Text ta="center" mt="md">
                <Anchor fw={500} onClick={() => setShowForgotPassword(false)}>
                  Back to login
                </Anchor>
              </Text>
            </Paper>
          ) : (
            <>
              {/* Google Sign In Button */}

              <Group grow mb="md" mt="md">
                <GoogleButton radius="xl" onClick={handleGoogleSignIn} disabled={googleLoading} loading={googleLoading}>
                  {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
                </GoogleButton>
              </Group>

              {isLogin ? (
                // Login form - single field for username or email
                <TextInput
                  label="Username or Email"
                  placeholder="jsmith or john@example.com"
                  size="md"
                  radius="md"
                  {...form.getInputProps("usernameOrEmail")}
                />
              ) : (
                // Registration form - separate fields
                <>
                  {/* Name field */}
                  <TextInput
                    label="Full Name"
                    placeholder="John Smith"
                    size="md"
                    radius="md"
                    {...form.getInputProps("name")}
                  />

                  {/* Username and Email fields */}
                  <TextInput
                    label="Username"
                    placeholder="jsmith"
                    size="md"
                    radius="md"
                    mt="md"
                    {...form.getInputProps("username")}
                  />

                  <TextInput
                    label="Email Address"
                    placeholder="example@gmail.com"
                    size="md"
                    radius="md"
                    mt="md"
                    {...form.getInputProps("email")}
                  />

                </>
              )}

              <PasswordInput
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                radius="md"
                {...form.getInputProps("password")}
                visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
              />

              {isLogin && (
                <Text ta="right" mt="xs" mb="md">
                  <Anchor fw={500} onClick={() => setShowForgotPassword(true)}>
                    Forgot password?
                  </Anchor>
                </Text>
              )}

              {isLogin && (
                <Checkbox
                  label="Keep me logged in"
                  mt="xl"
                  size="md"
                  {...form.getInputProps("rememberMe", { type: "checkbox" })}
                />
              )}

              <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={loading} disabled={loading}>
                {isLogin ? 'Login' : 'Register'}
              </Button>

              <Text ta="center" mt="md">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{' '}
                    <Anchor fw={500} onClick={() => { setIsLogin(false); form.reset(); setNotification(null); }}>
                      Register
                    </Anchor>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <Anchor fw={500} onClick={() => { setIsLogin(true); form.reset(); setNotification(null); }}>
                      Login
                    </Anchor>
                  </>
                )}
              </Text>
            </>
          )}
        </form>
      </Paper>
    </div>
  );
}