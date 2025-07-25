import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Paper } from '@mantine/core';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { mapGoogleError } from '../../utils/auth/google';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';

import classes from './Authentication.module.css';

const MODES = ["login", "register", "forgotPassword", "resetPassword"] as const;
type Mode = (typeof MODES)[number];

export function Authentication() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Parameters
    const resetToken = searchParams.get("reset_token")?.trim();
    const formMode = searchParams.get("mode") as Mode | null;

    // Form Toggle States
    const [mode, setMode] = useState<Mode>("login");
    

    // Notification State
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

    // Set the initial mode based on URL parameters
    useEffect(() => {
        const allowedParams = new Set(["mode", "reset_token"]);

        // Check for invalid parameters
        const currentparams = Array.from(searchParams.keys());
        const hasInvalidParams = currentparams.some(param => !allowedParams.has(param));

        if(hasInvalidParams) {
            // Remove the invalid parameters from the URL
            const cleanedParams = new URLSearchParams();
            if(formMode) {
                cleanedParams.set("mode", formMode);
            }
            if(resetToken) {
                cleanedParams.set("reset_token", resetToken);
            }
            router.replace(`${pathname}?${cleanedParams.toString()}`);
            return;
        }

        // Check if mode parameter is missing or invalid
        const isInvalidMode = !formMode || !MODES.includes(formMode);

        // Check if the parameter reset_token is present but empty
        const hasEmptyResetToken = !searchParams.has("reset_token") && (!resetToken || resetToken === "");

        // Check if reset password mode is selected but no valid reset token
        const isResetPasswordWithoutToken = formMode === "resetPassword" && (!resetToken || resetToken === "");

        // check if the reset_token is present but is in the wrong mode
        const hasResetTokenWithWrongMode = resetToken && formMode !== "resetPassword";

        // If there is an invalid case default to login
        if(isInvalidMode || isResetPasswordWithoutToken || (formMode === "resetPassword" && hasEmptyResetToken) || hasResetTokenWithWrongMode) {
            setMode("login");
            const params = new URLSearchParams();
            params.set("mode", "login");
            router.replace(`${pathname}?${params.toString()}`);
            return;
        }

        // If there is a reset token, switch to reset mode
        if (formMode === "resetPassword" && resetToken && resetToken !== "") {
            setMode("resetPassword");
        }
        // If there is a mode in the URL, use that
        else if(formMode && MODES.includes(formMode)) {
            setMode(formMode);
        }
    }, [resetToken, formMode, searchParams, router, pathname]);

    // Handle Google OAuth errors and Callback URLs
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
    const setUrlMode = useCallback((newMode: Mode) => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("mode", newMode);
        router.replace(`${pathname}?${params.toString()}`);
    }, [searchParams, router, pathname]);

    const backToLogin = useCallback(() => {
        const noResetTokenParams = new URLSearchParams(Array.from(searchParams.entries()));
        noResetTokenParams.set("mode", "login");
        noResetTokenParams.delete("reset_token");
        router.replace(`${pathname}?${noResetTokenParams.toString()}`);
    }, [searchParams, router, pathname]);

    const toRegister = useCallback(() => setUrlMode("register"), [setUrlMode]);
    const toForgotPassword = useCallback(() => setUrlMode("forgotPassword"), [setUrlMode]);

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