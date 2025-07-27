import { Anchor, Button, Checkbox, Group, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GoogleButton } from "./GoogleButton";
import { signIn } from "next-auth/react";
import { isValidEmail, isValidUsername, isValidPassword, GOOGLE_MESSAGE, mapGoogleError, LOGIN_MESSAGE } from "@/utils/auth";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface LoginFormProps {
    onSuccess?: () => void;
    onRegister?: () => void;
    onForgotPassword?: () => void;
    onNotify?: (type: "success" | "error", message: string) => void;
}

export function LoginForm({ onSuccess, onRegister, onForgotPassword, onNotify }: Readonly<LoginFormProps>) {
    const router = useRouter();

    // Loading States
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const isSubmitting = loading || googleLoading;

    // Login Form
    const form = useForm({
        initialValues: {
            usernameOrEmail: "",
            password: "",
            rememberMe: false
        },
        validate: {
            usernameOrEmail: value => ((isValidEmail(value) || isValidUsername(value)) ? null : LOGIN_MESSAGE.USERNAME_OR_EMAIL_REQUIRED),
            password: value => (isValidPassword(value) ? null : LOGIN_MESSAGE.INVALID_CREDENTIALS),
        },
    });

    // Login form submission handler
    const handleLogin = useCallback(async (values: typeof form.values) => {
        setLoading(true);

        try {
            // Determine if the user is using username or email
            const isEmail = isValidEmail(values.usernameOrEmail);

            const result = await signIn("credentials", {
                redirect: false,
                username: isEmail ? undefined : values.usernameOrEmail,
                email: isEmail ? values.usernameOrEmail : undefined,
                password: values.password
            });

            if (result?.error) {
                onNotify?.("error", LOGIN_MESSAGE.INVALID_CREDENTIALS);
            }
            else if (result?.ok) {
                // Successful sign-in
                onNotify?.("success", LOGIN_MESSAGE.SUCCESS);
                setTimeout(() => {
                    onSuccess?.();
                    router.push("/"); // redirect after 1.5 seconds
                }, 1000);
            }
        }
        catch (error) {
            console.error("Sign-in error:", error);
            onNotify?.("error", LOGIN_MESSAGE.FAILURE);
        }
        finally {
            setLoading(false);
        }
    }, [form, onNotify, onSuccess, router]);

    // Google Sign-In handler
    const handleGoogleSignIn = useCallback(async () => {
        try {
            setGoogleLoading(true);

            const result = await signIn("google", {
                redirect: false,
                callbackUrl: "/" // Change this to wherever I want to go to after I login via google
            });

            if (result?.error) {
                // Handle error from Google sign-in
                onNotify?.("error", mapGoogleError(result.error));
            }
            else if (result?.ok) {
                // Successful sign-in
                console.log(GOOGLE_MESSAGE.SIGN_IN_SUCCESS);
                router.push("/"); // redirect to home page or desired page
            }
        }
        catch (error) {
            console.error("Google sign-in error:", error);
            onNotify?.("error", GOOGLE_MESSAGE.SIGN_IN_FAILURE);
        }
        finally {
            setGoogleLoading(false);
        }
    }, [onNotify, router]);

    return (
        <>
            {/* Title */}
            <Title order={2} mb="md">Welcome back!</Title>

            {/* Google Sign-In Button */}
            <Group grow mb="md" mt="md">
                <GoogleButton radius="xl" onClick={handleGoogleSignIn} loading={googleLoading} disabled={isSubmitting}>
                    Sign in with Google
                </GoogleButton>
            </Group>

            {/* Login Form */}
            <form onSubmit={form.onSubmit(handleLogin)}>
                {/* Username or Email Field */}
                <TextInput
                    label="Username or Email"
                    placeholder="jsmith or john@example.com"
                    size="md"
                    radius="md"
                    disabled={isSubmitting}
                    {...form.getInputProps("usernameOrEmail")}
                />

                {/* Password Field */}
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    mt="md"
                    size="md"
                    radius="md"
                    disabled={isSubmitting}
                    {...form.getInputProps("password")}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Forgot Password Link */}
                <Text ta="right" mt="xs" mb="md">
                    <Anchor fw={500} onClick={isSubmitting ? undefined : onForgotPassword} style={{ pointerEvents: isSubmitting ? "none" : "auto", opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                        Forgot password?
                    </Anchor>
                </Text>

                {/* Keep Me Logged In Checkbox */}
                <Checkbox
                    label="Keep me logged in"
                    mt="md"
                    size="md"
                    disabled={isSubmitting}
                    {...form.getInputProps("rememberMe", { type: "checkbox" })}
                />

                {/* Login Button */}
                <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={loading} disabled={isSubmitting}>
                    Login
                </Button>

                {/* Register Link */}
                <Text ta="center" mt="md">
                    Don&apos;t have an account?{" "}
                    <Anchor fw={500} onClick={isSubmitting ? undefined : onRegister} style={{ pointerEvents: isSubmitting ? "none" : "auto", opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>Register</Anchor>
                </Text>
            </form>
        </>
    )
}