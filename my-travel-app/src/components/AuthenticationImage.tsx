import { Anchor, Button, Checkbox, em, Group, Paper, PasswordInput, rem, Text, TextInput, Title } from '@mantine/core';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GoogleButton } from './GoogleButton';
import { useForm } from '@mantine/form';

import classes from './AuthenticationImage.module.css';


export function AuthenticationImage() {
  // Login and Register states
  const [isLogin, setIsLogin] = useState(true);

  // Form object
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: {
      email: (value) => /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email',
      password: (value) => value.length >= 6 ? null : 'Password must be at least 6 characters long',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    // Sign in
    if (isLogin) {
      await signIn("credentials", { redirect: false, email: values.email, password: values.password });
    }
    else {
      // Register
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={2} className={classes.title}>
            {isLogin ? 'Welcome back!' : 'Create an account'}
          </Title>

          {/* Google Sign In Button */}
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</GoogleButton>
          </Group>

          <TextInput
            label="Email Adress"
            placeholder="example@gmail.com"
            size="md"
            radius="md"
            {...form.getInputProps("email")}
          />

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
              {...form.getInputProps("rememberMe", { type: 'checkbox' })}
            />
          )}

          <Button fullWidth mt="xl" size="md" radius="md" type="submit">
            {isLogin ? 'Sign in' : 'Register'}
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