import { Anchor, Button, Group, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { GoogleButton } from "./GoogleButton";
import { signIn } from "next-auth/react";
import { isValidEmail, isValidUsername, isValidPassword, isValidName, registerUser, GOOGLE_MESSAGE, mapGoogleError, EMAIL_MESSAGE, NAME_MESSAGE, USERNAME_MESSAGE, PASSWORD_MESSAGE, REGISTRATION_MESSAGE } from "@/utils/auth";
import { useState, useCallback } from "react";
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
    const isSubmitting = loading || googleLoading;

    // Register Form
    const form = useForm({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
        validate: {
            name: value => (isValidName(value) ? null : NAME_MESSAGE.REQUIRED),
            username: value => (isValidUsername(value) ? null : USERNAME_MESSAGE.MIN_LENGTH),
            email: value => {
                if (value.trim().length === 0) {
                    return EMAIL_MESSAGE.REQUIRED;
                }
                if (!isValidEmail(value)) {
                    return EMAIL_MESSAGE.INVALID_FORMAT;
                }
                return null;
            },
            password: value => (isValidPassword(value) ? null : PASSWORD_MESSAGE.MIN_LENGTH),
        },
    });

    // Register form submission handler
    const handleRegister = useCallback(async (values: typeof form.values) => {
        setLoading(true);
        
        try {
            const { ok, data } = await registerUser(values);

            if (ok) {
                onNotify?.("success", REGISTRATION_MESSAGE.SUCCESS);
                form.reset();
                setTimeout(() => onSuccess?.(), 1500); // Auto-switch to login after 1.5 seconds
            }
            else if (data.field) {
                // Username taken, email exists errors
                form.setFieldError(data.field, data.error);
            }
            else {
                // General error
                onNotify?.("error", data.error || REGISTRATION_MESSAGE.FAILURE);
            }
        }
        catch (error) {
            console.error("Registration error:", error);
            onNotify?.("error", REGISTRATION_MESSAGE.FAILURE);
        }
        finally {
            setLoading(false);
        }
    }, [form, onNotify, onSuccess]);

    // Google Sign-In handler
    const handleGoogleSignUp = useCallback(async () => {
        setGoogleLoading(true);

        try {
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
                console.log(GOOGLE_MESSAGE.SIGN_UP_SUCCESS);
                router.push("/"); // redirect to home page or desired page
            }
        }
        catch (error) {
            console.error("Google sign-up error:", error);
            onNotify?.("error", GOOGLE_MESSAGE.SIGN_UP_FAILURE);
        }
        finally {
            setGoogleLoading(false);
        }
    }, [onNotify, router]);

    return (
        <>
            {/* Title */}
            <Title order={2} mb="md">Create an Account</Title>
            
            {/* Google Sign-Up Button */}
            <Group grow mb="md" mt="md">
                <GoogleButton radius="xl" onClick={handleGoogleSignUp} loading={googleLoading} disabled={isSubmitting}>
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
                    disabled={isSubmitting}
                    {...form.getInputProps("name")}
                />
                
                {/* Username Field */}
                <TextInput
                    label="Username"
                    placeholder="johnsmith"
                    size="md"
                    radius="md"
                    mt="md"
                    disabled={isSubmitting}
                    {...form.getInputProps("username")}
                />

                {/* Email Field */}
                <TextInput
                    label="Email Address"
                    placeholder="example@gmail.com"
                    size="md"
                    radius="md"
                    mt="md"
                    disabled={isSubmitting}
                    {...form.getInputProps("email")}
                />

                {/* Password Field */}
                <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    size="md"
                    radius="md"
                    mt="md"
                    disabled={isSubmitting}
                    {...form.getInputProps("password")}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Register Button */}
                <Button fullWidth mt="xl" size="md" radius="md" type="submit" loading={loading} disabled={isSubmitting}>
                    Register
                </Button>

                {/* Back to Login Link */}
                <Text ta="center" mt="md">
                    Already have an account?{" "}
                    <Anchor fw={500} onClick={isSubmitting ? undefined : onLogin} style={{ pointerEvents: isSubmitting ? "none" : "auto", opacity: isSubmitting ? 0.5 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                        Login
                    </Anchor>
                </Text>
            </form>
        </>
    );
}