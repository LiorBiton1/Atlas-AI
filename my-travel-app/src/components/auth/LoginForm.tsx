import { Anchor, Button, Checkbox, Group, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GoogleButton } from "./GoogleButton";
import { signIn } from "next-auth/react";
import { mapGoogleError } from "../../utils/auth";
import { useState } from "react";
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

    // Login Form
    const form = useForm({
        initialValues: {
            usernameOrEmail: "",
            password: "",
            rememberMe: false
        },
        validate: {
            usernameOrEmail: value => (value.trim() ? null : "Username or email is required"),
            password: value => (value.length >= 6 ? null : "Password must be at least 6 characters"),
        },
    });

    // Login form submission handler
    const handleLogin = async (values: typeof form.values) => {
        setLoading(true);

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
                onNotify?.("error", "Invalid username/email or password. Please try again.");
            }
            else if (result?.ok) {
                // Successful sign-in
                onNotify?.("success", "Signed in successfully!");
                setTimeout(() => {
                    onSuccess?.();
                    router.push("/"); // redirect after 1.5 seconds
                }, 1000);
            }
        }
        catch (error) {
            console.error("Sign-in error:", error);
            onNotify?.("error", "Sign-in failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    // Google Sign-In handler
    const handleGoogleSignIn = async () => {
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
                console.log("Google sign-in successful");
                router.push("/"); // redirect to home page or desired page
            }
        }
        catch (error) {
            console.error("Google sign-in error:", error);
            onNotify?.("error", "Unable to connect to Google. Please check your connection and try again.");
        }
        finally {
            setGoogleLoading(false);
        }
    };

    return (
        <>
            {/* Title */}
            <Title order={2} mb="md">Welcome back!</Title>

            {/* Google Sign-In Button */}
            <Group grow mb="md" mt="md">
                <GoogleButton radius="xl" onClick={handleGoogleSignIn} loading={googleLoading} disabled={googleLoading}>
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
                    {...form.getInputProps("usernameOrEmail")}
                />

                {/* Password Field */}
                <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    mt="md"
                    size="md"
                    radius="md"
                    {...form.getInputProps("password")}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Forgot Password Link */}
                <Text ta="right" mt="xs" mb="md">
                    <Anchor fw={500} onClick={onForgotPassword}>
                        Forgot password?
                    </Anchor>
                </Text>

                {/* Keep Me Logged In Checkbox */}
                <Checkbox
                    label="Keep me logged in"
                    mt="md"
                    size="md"
                    {...form.getInputProps("rememberMe", { type: "checkbox" })}
                />

                {/* Login Button */}
                <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={loading} disabled={loading}>
                    Login
                </Button>

                {/* Register Link */}
                <Text ta="center" mt="md">
                    Don&apos;t have an account?{" "}
                    <Anchor fw={500} onClick={onRegister}>Register</Anchor>
                </Text>
            </form>
        </>
    )
}