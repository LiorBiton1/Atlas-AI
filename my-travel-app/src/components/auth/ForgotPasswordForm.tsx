import { Anchor, Button, Paper, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';

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
    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            onNotify?.("error", "Please enter your email address.");
            return;
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(forgotEmail)) {
            onNotify?.("error", "Invalid email format");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot_password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: forgotEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                onNotify?.("success", data.message);
                setForgotEmail("");
            }
            else {
                onNotify?.("error", data.error || "Failed to send reset email");
            }
        }
        catch (error) {
            console.error("Forgot password error:", error);
            onNotify?.("error", "Failed to send reset email. Please try again later.");
        }
        finally {
            setLoading(false);
        }
    };

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
                onChange={(e) => setForgotEmail(e.target.value)}
            />

            {/* Reset Password Button */}
            <Button fullWidth mt="md" size="md" radius="md" onClick={handleForgotPassword} disabled={loading} loading={loading}>
                Reset Password
            </Button>

            {/* Back to Login Button */}
            <Text ta="center" mt="md">
                <Anchor fw={500} onClick={onBack}>
                    Back to login
                </Anchor>
            </Text>
        </Paper>
    )
}