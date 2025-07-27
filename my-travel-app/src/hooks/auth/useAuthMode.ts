import { useState, useCallback } from 'react';
import { useUrlValidation, ModeValidation } from './useUrlValidation';


export const useAuthMode = () => {
    // Form Toggle States
    const [mode, setMode] = useState<"login" | "register" | "forgotPassword" | "resetPassword">("login");
    const {
        formMode,
        resetToken,
        setUrlMode,
        handleInvalidParams,
        MODES
    } = useUrlValidation();

    const handleMultipleModes = useCallback(() => {
        const isResetMode = formMode === "resetPassword";

        // If the first mode is resetPassword and there is a reset token, set the mode to resetPassword
        if (isResetMode && resetToken) {
            setMode("resetPassword");
            setUrlMode("resetPassword");
        }
        else {
            // Otherwise, just remove the extra mode and preserve the first valid mode
            const firstValidMode = formMode || "login";

            // Set the mode to the first valid mode
            setMode(firstValidMode);
            setUrlMode(firstValidMode);
        }
    }, [formMode, resetToken, setUrlMode]);

    const handleModeBasedOnValidation = useCallback((validation: ModeValidation) => {
        const { isInvalidMode, isResetPasswordWithoutToken, hasResetTokenWithWrongMode, hasMultipleModes, isResetMode } = validation;

        // If there is an invalid mode or resetPassword without a token, switch to login mode
        if (isInvalidMode || isResetPasswordWithoutToken) {
            setMode("login");
            setUrlMode("login", true);
        }
        // If there is a reset token but the mode is valid, only remove the reset token
        else if (hasResetTokenWithWrongMode && MODES.includes(formMode!)) {
            setMode(formMode!);
            setUrlMode(formMode!, true);
        }
        // If there are multiple modes handle accordingly
        else if (hasMultipleModes) {
            handleMultipleModes();
        }
        // If the mode is resetPassword and there is a reset token, set the mode to resetPassword
        else if (isResetMode && resetToken) {
            setMode("resetPassword");
        }
        // Otherwise, set the mode to the provided mode or default to login
        else if (formMode) {
            setMode(formMode);
        }
    }, [handleMultipleModes, setUrlMode, formMode, resetToken, MODES]);

    return {
        mode,
        setMode,
        handleModeBasedOnValidation,
        handleMultipleModes,
        handleInvalidParams
    };
};

