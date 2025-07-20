import React, { useState, useEffect } from 'react';
import { Alert, Paper } from '@mantine/core';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { mapGoogleError } from '../../utils/auth';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

import classes from './Authentication.module.css';

export function Authentication() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("reset_token");

    // Form Toggle States
    const [mode, setMode] = useState<"login" | "register" | "forgotPassword" | "resetPassword">("login");

    // Notification State
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Callback Error Handler
    useEffect(() => {
        const error = searchParams.get("error");
        if (pathname === "/auth" && error) {
            setNotification({ type: "error", message: mapGoogleError(error) });
            router.replace("/auth");
        }
    }, [pathname, searchParams, router]);

    // If there is a reset token, switch to reset mode
    useEffect(() => {
        if (resetToken) {
            setMode("resetPassword");
        }
    }, [resetToken]);

    // If a mode changes clear the notification
    useEffect(() => {
        setNotification(null);
    }, [mode]);

    const backToLogin = () => setMode("login");
    const toRegister = () => setMode("register");
    const toForgotPassword = () => setMode("forgotPassword");

    return (
        <div className={classes.wrapper}>
            <Paper className={classes.form}>
                {/* Notifications */}
                {notification && (
                    <Alert
                        icon={notification.type === "success" ? <IconCheck size="1rem" /> : <IconAlertCircle size="1rem" />}
                        title={notification.type === "success" ? "Success!" : "Error!"}
                        color={notification.type === "success" ? "green" : "red"}
                        mb="md"
                        onClose={() => setNotification(null)}
                        withCloseButton
                    >
                        {notification.message}
                    </Alert>
                )}

                {/* Login Form */}
                {mode === "login" && (
                    <LoginForm 
                        onSuccess={backToLogin} 
                        onRegister={toRegister} 
                        onForgotPassword={toForgotPassword} 
                        onNotify={(type, message) => setNotification({ type, message })} 
                    />
                )}

                {/* Register Form */}
                {mode === "register" && (
                    <RegisterForm 
                        onSuccess={backToLogin} 
                        onLogin={backToLogin} 
                        onNotify={(type, message) => setNotification({ type, message })} 
                    />
                )}

                {/* Forgot Password Form */}
                {mode === "forgotPassword" && (
                    <ForgotPasswordForm 
                        onBack={backToLogin}  
                        onNotify={(type, message) => setNotification({ type, message })} 
                    />
                )}

                {/* Reset Password Form */}
                {mode === "resetPassword" && (
                    <ResetPasswordForm 
                        onFinish={backToLogin} 
                        onNotify={(type, message) => setNotification({ type, message })} 
                    />
                )}
            </Paper>
        </div>
    );
}