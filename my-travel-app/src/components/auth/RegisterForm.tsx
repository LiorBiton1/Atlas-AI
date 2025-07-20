import { Anchor, Button, Group, PasswordInput, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GoogleButton } from "../GoogleButton";
import { signIn } from "next-auth/react";
import { mapGoogleError } from "../../utils/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
    onSuccess?: () => void;
    onLogin?: () => void;
    onNotify?: (type: "success" | "error", message: string) => void;
}

export function RegisterForm({ onSuccess, onLogin, onNotify }: Readonly<RegisterFormProps>) {
    const router = useRouter();

    // Loading States
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Register Form
    const form = useForm({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
        validate: {
            name: value => (value.trim() ? null : "Name is required"),
            username: value => (value.length >= 3 ? null : "Username must be at least 3 characters"),
            email: value => {
                if (value.trim().length === 0) {
                    return "Email is required";
                }
                if (!/^\S+@\S+\.\S+$/.test(value)) {
                    return "Invalid email format";
                }
                return null;
            },
            password: value => (value.length >= 6 ? null : "Password must be at least 6 characters"),
        },
    });

    // Register form submission handler
    const handleRegister = async (values: typeof form.values) => {
        setLoading(true);
        
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                onNotify?.("success", "Account created successfully! Please sign in.");
                form.reset();
                setTimeout(() => onSuccess?.(), 1500); // Auto-switch to login after 1.5 seconds
            }
            else if (data.field) {
                // Username taken, email exists errors
                form.setFieldError(data.field, data.error);
            }
            else {
                // General error
                onNotify?.("error", data.error || "Registration failed");
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            onNotify?.("error", "Registration failed");
        }
        finally {
            setLoading(false);
        }
    };

    // Google Sign-In handler
    const handleGoogleSignUp = async () => {
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
                // Successful sign-up
                console.log("Google sign-up successful");
                router.push("/"); // redirect to home page or desired page
            }
        }
        catch (error) {
            console.error("Google sign-up error:", error);
            onNotify?.("error", "Google sign-up failed. Please try again.");
        }
        finally {
            setGoogleLoading(false);
        }
    };

    return (
        <>
            {/* Google Sign-Up Button */}
            <Group grow mb="md" mt="md">
                <GoogleButton radius="xl" onClick={handleGoogleSignUp} loading={googleLoading} disabled={googleLoading}>
                    Sign up with Google
                </GoogleButton>
            </Group>

            {/* Register Form */}
            <form onSubmit={form.onSubmit(handleRegister)}>
                {/* Name Field */}
                <TextInput
                    label="Full Name"
                    placeholder="John Smith"
                    size="md"
                    radius="md"
                    {...form.getInputProps("name")}
                />
                
                {/* Username Field */}
                <TextInput
                    label="Username"
                    placeholder="johnsmith"
                    size="md"
                    radius="md"
                    mt="md"
                    {...form.getInputProps("username")}
                />

                {/* Email Field */}
                <TextInput
                    label="Email Address"
                    placeholder="example@gmail.com"
                    size="md"
                    radius="md"
                    mt="md"
                    {...form.getInputProps("email")}
                />

                {/* Password Field */}
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    size="md"
                    radius="md"
                    mt="md"
                    {...form.getInputProps("password")}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Register Button */}
                <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={loading} disabled={loading}>
                    Register
                </Button>

                {/* Back to Login Link */}
                <Text ta="center" mt="md">
                    Already have an account?{" "}
                    <Anchor fw={500} onClick={onLogin}>Login</Anchor>
                </Text>
            </form>
        </>
    );
}