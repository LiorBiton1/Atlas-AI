import { Anchor, Button, Paper, Text, TextInput, Title } from '@mantine/core';
import { useState, useCallback} from 'react';
import { isValidEmail, forgotPassword, EMAIL_MESSAGE, FORGOT_PASSWORD_MESSAGE } from '@/utils/auth';

interface ForgotPasswordFormProps {
    onBack: () => void;
    onNotify?: (type: "success" | "error", message: string) => void;
}

export function ForgotPasswordForm({ onBack, onNotify }: Readonly<ForgotPasswordFormProps>) {
    // Email State
    const [forgotEmail, setForgotEmail] = useState('');

    // Loading State
    const [loading, setLoading] = useState(false);

    // Forgot Password Handler
    const handleForgotPassword = useCallback(async () => {
        if (!forgotEmail) {
            onNotify?.("error", EMAIL_MESSAGE.REQUIRED);
            return;
        }

        // Validate email format
        if (!isValidEmail(forgotEmail)) {
            onNotify?.("error", EMAIL_MESSAGE.INVALID_FORMAT);
            return;
        }

        setLoading(true);

        try {
            const { ok, data } = await forgotPassword(forgotEmail);

            if (ok) {
                onNotify?.("success", FORGOT_PASSWORD_MESSAGE.SUCCESS);
                setForgotEmail("");
            }
            else {
                onNotify?.("error", data.error || FORGOT_PASSWORD_MESSAGE.FAILURE);
            }
        }
        catch (error) {
            console.error("Forgot password error:", error);
            onNotify?.("error", FORGOT_PASSWORD_MESSAGE.FAILURE_LATER);
        }
        finally {
            setLoading(false);
        }
    }, [forgotEmail, onNotify]);

    return (
        <Paper p="md">
            {/* Forgot Password Form */}
            <Title order={3} mb="md">Reset your password</Title>
            <Text mb="md">Enter your email address below, and we will send you a link to reset your password.</Text>

            {/* Email Address Field */}
            <TextInput
                label="Email Address"
                placeholder="Enter your email"
                size="md"
                radius="md"
                value={forgotEmail}
                disabled={loading}
                onChange={(e) => setForgotEmail(e.target.value)}
            />

            {/* Reset Password Button */}
            <Button fullWidth mt="md" size="md" radius="md" onClick={handleForgotPassword} disabled={loading} loading={loading}>
                Reset Password
            </Button>

            {/* Back to Login Button */}
            <Text ta="center" mt="md">
                <Anchor fw={500} onClick={loading ? undefined : onBack} style={{ pointerEvents: loading ? "none" : "auto", opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                    Back to login
                </Anchor>
            </Text>
        </Paper>
    )
}