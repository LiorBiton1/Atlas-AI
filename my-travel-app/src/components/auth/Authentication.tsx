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

const MODES = ["login", "register", "forgotPassword", "resetPassword"] as const;
type Mode = (typeof MODES)[number];

export function Authentication() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Parameters
    const resetToken = searchParams.get("reset_token");
    const formMode = searchParams.get("mode") as Mode | null;

    // Form Toggle States
    const [mode, setMode] = useState<Mode>("login");
    

    // Notification State
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Callback Error Handler
    // If there is a reset token, switch to reset mode
    useEffect(() => {
        if (resetToken) {
            setMode("resetPassword");
        }
        else if(formMode && MODES.includes(formMode)) {
            setMode(formMode);
        }
        else {
            setMode("login");
        }
    }, [resetToken, formMode]);

    // Handle Google OAuth errors
    useEffect(() => {
        const error = searchParams.get("error");
        const callbackUrl = searchParams.get("callbackUrl");
        if (pathname === "/auth" && (error || callbackUrl)) {
            // If there is an error, display it
            if(error) {
                setNotification({ type: "error", message: mapGoogleError(error) });
            }
            // Remove only the error and callbackUrl parameter from the URL but keep the mode/token
            const noErrorOrCallbackParams = new URLSearchParams(Array.from(searchParams.entries()));
            noErrorOrCallbackParams.delete("error");
            noErrorOrCallbackParams.delete("callbackUrl");
            router.replace(`${pathname}?${noErrorOrCallbackParams.toString()}`);
        }
    }, [pathname, searchParams, router]);

    // If a mode changes clear the notification
    useEffect(() => {
        setNotification(null);
    }, [mode]);

    // Update the URL when changing modes
    const setUrlMode = (newMode: Mode) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("mode", newMode);
        router.replace(`${pathname}?${params.toString()}`);
    };

    const backToLogin = () => {
        const noResetTokenParams = new URLSearchParams(Array.from(searchParams.entries()));
        noResetTokenParams.set("mode", "login");
        noResetTokenParams.delete("reset_token");
        router.replace(`${pathname}?${noResetTokenParams.toString()}`);
    }
    const toRegister = () => setUrlMode("register");
    const toForgotPassword = () => setUrlMode("forgotPassword");

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