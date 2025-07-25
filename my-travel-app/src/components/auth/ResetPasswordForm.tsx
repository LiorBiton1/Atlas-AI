import { Anchor, Button, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '@/utils/auth/client';
import { isValidPassword } from '@/utils/auth/validation';
import { PASSWORD_MESSAGE, RESET_PASSWORD_MESSAGE } from '@/utils/auth/messages';

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
            password: value => (isValidPassword(value) ? null : PASSWORD_MESSAGE.MIN_LENGTH),
            confirmPassword: (value, values) => (value === values.password ? null : PASSWORD_MESSAGE.DO_NOT_MATCH),
        },
    });

    // Reset Password Handler
    const handleResetPassword = async (values: typeof resetForm.values) => {
        if (!resetToken) {
            onNotify?.("error", RESET_PASSWORD_MESSAGE.INVALID_TOKEN);
            return;
        }

        setLoading(true);

        try {
            const { ok, data } = await resetPassword(resetToken, values.password); 

            if (ok) {
                onNotify?.("success", RESET_PASSWORD_MESSAGE.SUCCESS);
                resetForm.reset();
                setTimeout(() => {
                    onFinish();
                }, 1500);
            } else {
                onNotify?.("error", data.error || RESET_PASSWORD_MESSAGE.FAILURE);
            }
        } catch (error) {
            console.error("Reset password error:", error);
            onNotify?.("error", RESET_PASSWORD_MESSAGE.FAILURE_LATER);
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
                    disabled={loading}
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
                    disabled={loading}
                    {...resetForm.getInputProps('confirmPassword')}
                    visibilityToggleButtonProps={{ "aria-label": "toggle password visibility" }}
                />

                {/* Reset Password Button */}
                <Button fullWidth mt="md" size="md" radius="md" type="submit" disabled={loading} loading={loading}>
                    Reset Password
                </Button>

                <Text ta="center" mt="md">
                    <Anchor fw={500} onClick={loading ? undefined : onFinish} style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                        Back to login
                    </Anchor>
                </Text>
            </form>
        </Paper>
    );
}