import { Anchor, Button, Checkbox, Group, Paper, PasswordInput, Text, TextInput, Title, Alert } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GoogleButton } from './GoogleButton';
import { useForm } from '@mantine/form';
import { IconCheck, IconAlertCircle } from '@tabler/icons-react';

import classes from './AuthenticationImage.module.css';

export function AuthenticationImage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If there are errors or callback params, clean the URL
    if(pathname === "/auth" && (searchParams.has("error") || searchParams.has("callbackUrl"))) {
      router.replace("/auth");
    }
  }, [pathname, searchParams, router]);

  // Login and Register states
  const [isLogin, setIsLogin] = useState(true);

  // Loading and Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form object
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
      email: (value) => !isLogin && value.trim().length > 0 && !/^\S+@\S+\.\S+$/.test(value) ? "Invalid email" : null,
      username: (value) => !isLogin && value.trim().length < 3 ? "Username must be at least 3 characters" : null,
      usernameOrEmail: (value) => isLogin && value.trim().length < 1 ? "Username or email is required" : null,
      password: (value) => value.length >= 6 ? null : "Password must be at least 6 characters long",
      name: (value) => !isLogin && value.trim().length < 1 ? "Name is required" : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    // Sign in
    if (isLogin) {
      setLoading(true);
      setError("");

      try {
        // Determine if the user is using username or email
        const isEmail = /^\S+@\S+\.\S+$/.test(values.usernameOrEmail);

        const result = await signIn("credentials", { 
          redirect: false, 
          username: isEmail ? undefined : values.usernameOrEmail,
          email: isEmail ? values.usernameOrEmail : undefined,
          password: values.password 
        });

        if(result?.error) {
          setError("Invalid username/email or password. Please try again.");
        }
        else if(result?.ok) {
          // Successful sign-in
          router.push("/"); // redirect to home page or desired page
        }
      }
      catch(error) {
        console.error("Sign-in error:", error);
        setError("Sign-in failed. Please try again.");
      }
      finally {
        setLoading(false);
      }
    }
    else {
      // Register
      setLoading(true);
      setError("");
      setSuccess("");

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

        if(response.ok) {
          setSuccess("Account created successfully! Please sign in.");
          setError("");
          form.reset();
          setTimeout(() => setIsLogin(true), 2000); // Auto-switch to login after 2 seconds
          setIsLogin(true);
        }
        else {
          if(data.field) {
            // Username taken, email exists errors
            form.setFieldError(data.field, data.error);
          }
          else {
            // General error
            setError(data.error || "Registration failed");
          }
        }
      } 
      catch (error) {
        console.error("Registration error:", error);
        setError("Registration failed");
      } 
      finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={2} className={classes.title}>
            {isLogin ? 'Welcome back!' : 'Create an account'}
          </Title>

          {/* Success Message */}
          {success && (
            <Alert 
              icon={<IconCheck size="1rem" />} 
              title="Success!" 
              color="green" 
              mb="md"
              onClose={() => setSuccess('')}
              withCloseButton
            >
              {success}
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert 
              icon={<IconAlertCircle size="1rem" />} 
              title="Error!" 
              color="red" 
              mb="md"
              onClose={() => setError('')}
              withCloseButton
            >
              {error}
            </Alert>
          )}

          {/* Google Sign In Button */}

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl" 
              onClick={async () => {
                try {
                  setError("");

                  const result = await signIn("google", { 
                    redirect: false,
                    callbackUrl: "/" // Change this to wherever I want to go to after I login via google
                  });

                  if(result?.error) {
                    // Handle error from Google sign-in
                    switch(result.error) {
                      case "OAuthCallback":
                        setError("Google sign-in was cancelled or failed. Please try again.");
                        break;
                      case "OAuthAccountNotLinked":
                        setError("This email is already registered with a different sign-in method.");
                        break;
                      case "AccessDenied":
                        setError("Access denied. Please grant permission to continue.");
                        break;
                      case "Verification":
                        setError("Unable to verify your Google account. Please try again.");
                        break;
                      default:
                        setError("Google sign-in failed. Please try again or use email registration.");
                    }
                  }
                  else if(result?.ok) {
                    // Successful sign-in
                    console.log('Google sign-in successful');
                    router.push("/"); // redirect to home page or desired page
                  }
                }
                catch (error) {
                  console.error("Google sign-in error:", error);
                  setError("Unable to connect to Google. Please check your connection and try again.");
                }
              }}
            >
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
          />

          {isLogin && (
            <Checkbox
              label="Keep me logged in"
              mt="xl"
              size="md"
              {...form.getInputProps("rememberMe", { type: "checkbox" })}
            />
          )}

          <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={loading} disabled={loading}>
            {loading ? 
              (isLogin ? "Signing in..." : "Creating account...") : 
              (isLogin ? "Sign in" : "Register")
            }
          </Button>

          <Text ta="center" mt="md">
            {isLogin ? (
              <>
                Don&apos;t have an account?{' '}
                <Anchor fw={500} onClick={() => setIsLogin(false)}>
                  Register
                </Anchor>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Anchor fw={500} onClick={() => setIsLogin(true)}>
                  Login
                </Anchor>
              </>
            )}
          </Text>
        </form>
      </Paper>
    </div>
  );
}