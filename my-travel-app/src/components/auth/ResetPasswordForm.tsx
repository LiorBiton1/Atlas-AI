import { Anchor, Button, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ResetPasswordFormProps {
    onFinish: () => void;
    onNotify?: (type: "success" | "error", message: string) => void;
}

export function ResetPasswordForm({ onFinish, onNotify }: Readonly<ResetPasswordFormProps>) {
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("reset_token");

    // Loading State
    const [loading, setLoading] = useState(false);

    // Reset Password Form
    const resetForm = useForm({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: {
            password: value => (value.length >= 6 ? null : "Password must be at least 6 characters long"),
            confirmPassword: (value, values) => (value === values.password ? null : "Passwords do not match"),
        },
    });

    // Reset Password Handler
    const handleResetPassword = async (values: typeof resetForm.values) => {
        const token = resetToken || searchParams.get("reset_token");

        if (!token) {
            onNotify?.("error", "Invalid reset token.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/reset_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: values.password }),
            });

            const data = await response.json();

            if (response.ok) {
                onNotify?.("success", "Password reset successfully! Redirecting to login...");
                resetForm.reset();
                setTimeout(() => {
                    onFinish();
                }, 1500);
            } else {
                onNotify?.("error", data.error || "Failed to reset password");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            onNotify?.("error", "Failed to reset password. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper p="md">
            {/* Reset Password Form */}
            <Title order={3} mb="md">Set new password</Title>
            <Text mb="md">Enter your new password below.</Text>

            <form onSubmit={resetForm.onSubmit(handleResetPassword)}>
                {/* Password Field */}
                <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                    size="md"
                    radius="md"
                    {...resetForm.getInputProps('password')}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Confirm Password Field */}
                <PasswordInput
                    label="Confirm Password"
                    placeholder="Confirm new password"
                    mt="md"
                    size="md"
                    radius="md"
                    {...resetForm.getInputProps('confirmPassword')}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Reset Password Button */}
                <Button fullWidth mt="md" size="md" radius="md" type="submit" disabled={loading} loading={loading}>
                    Reset Password
                </Button>

                <Text ta="center" mt="md">
                    <Anchor fw={500} onClick={onFinish}>
                        Back to login
                    </Anchor>
                </Text>
            </form>
        </Paper>
    );
}