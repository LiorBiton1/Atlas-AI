import React, { useEffect } from 'react';
import { Alert, Paper } from '@mantine/core';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { mapGoogleError } from '../../utils/auth/google';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useNotifications } from '../../hooks/auth/useNotifications';
import { useAuthMode } from '../../hooks/auth/useAuthMode';
import { useUrlValidation } from '../../hooks/auth/useUrlValidation';

import classes from './Authentication.module.css';

// Registry of authentication forms based on mode
const FORM_REGISTRY = {
    login: LoginForm,
    register: RegisterForm,
    forgotPassword: ForgotPasswordForm,
    resetPassword: ResetPasswordForm,
} as const;

export function Authentication() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Custom hooks for notifications, auth mode, and URL validation
    const { notification, handleNotification, clearNotification } = useNotifications();
    const { mode, handleModeBasedOnValidation, handleInvalidParams } = useAuthMode();
    const { setUrlMode, createUrlParams, validateModeAndToken } = useUrlValidation();

    // Set the initial mode based on URL parameters
    useEffect(() => {
        const allowedParams = new Set(["mode", "reset_token"]);

        // Check for invalid parameters
        const currentparams = Array.from(searchParams.keys());
        const hasInvalidParams = currentparams.some(param => !allowedParams.has(param));

        if (hasInvalidParams) {
            // Remove invalid parameters from the URL
            handleInvalidParams();
            return;
        }

        // Validate the mode and token from the URL
        const modeValidation = validateModeAndToken();

        // Handle the mode based on validation results
        handleModeBasedOnValidation(modeValidation);
    }, [searchParams, handleInvalidParams, handleModeBasedOnValidation, validateModeAndToken]);

    // Handle Google OAuth errors and Callback URLs
    useEffect(() => {
        const error = searchParams.get("error");
        const callbackUrl = searchParams.get("callbackUrl");
        if (error || callbackUrl) {
            // If there is an error, display it
            if (error) {
                handleNotification("error", mapGoogleError(error));
            }
            // Remove only the error and callbackUrl parameter from the URL but keep the mode/token
            const noErrorOrCallbackParams = createUrlParams();
            noErrorOrCallbackParams.delete("error");
            noErrorOrCallbackParams.delete("callbackUrl");

            router.replace(`${pathname}?${noErrorOrCallbackParams.toString()}`);
        }
    }, [createUrlParams, searchParams, pathname, router, handleNotification]);

    // If a mode changes clear the notification
    useEffect(() => {
        clearNotification();
    }, [mode, clearNotification]);

    // Handlers for navigation between forms
    const navigationHandlers = {
        onNotify: handleNotification,
        onSuccess: () => setUrlMode("login", true),
        onLogin: () => setUrlMode("login", true),
        onBack: () => setUrlMode("login", true),
        onFinish: () => setUrlMode("login", true),
        onRegister: () => setUrlMode("register"),
        onForgotPassword: () => setUrlMode("forgotPassword"),
    };
    const FormComponent = FORM_REGISTRY[mode];

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
                        onClose={clearNotification}
                        withCloseButton
                    >
                        {notification.message}
                    </Alert>
                )}

                {/* Authentication Form */}
                <FormComponent {...navigationHandlers} />
            </Paper>
        </div>
    );
}