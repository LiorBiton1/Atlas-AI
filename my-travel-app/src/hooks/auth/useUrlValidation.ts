import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const MODES = ["login", "register", "forgotPassword", "resetPassword"] as const;
type Mode = (typeof MODES)[number];

export type ModeValidation = {
    isInvalidMode: boolean;
    isResetPasswordWithoutToken: boolean;
    hasResetTokenWithWrongMode: boolean;
    hasMultipleModes: boolean;
    isResetMode: boolean;
};

export const useUrlValidation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL Parameters
    const resetToken = searchParams.get("reset_token")?.trim();
    const formMode = searchParams.get("mode") as Mode | null;

    // URL Params Helper
    const createUrlParams = useCallback((entries?: [string, string][]) => {
        return new URLSearchParams(entries || Array.from(searchParams.entries()));
    }, [searchParams]);

    // Update the URL when changing modes
    const setUrlMode = useCallback((newMode: Mode, removeResetToken: boolean = false) => {
        const params = createUrlParams();
        params.set("mode", newMode);
        if (removeResetToken) {
            params.delete("reset_token");
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, [createUrlParams, router, pathname]);

    const validateModeAndToken = useCallback((): ModeValidation => {
        // Check if mode parameter is invalid or not present
        const isInvalidMode = !formMode || !MODES.includes(formMode);

        // Check if the parameter reset_token is present but empty
        const hasEmptyResetToken = !resetToken;
        const isResetMode = formMode === "resetPassword";

        // Check if reset password mode is selected but no valid reset token
        const isResetPasswordWithoutToken = isResetMode && hasEmptyResetToken;

        // check if the reset_token is present but is in the wrong mode
        const hasResetTokenWithWrongMode = Boolean(resetToken) && !isResetMode;

        // Check if there are multiple modes in the URL
        const hasMultipleModes = Array.from(searchParams.keys()).filter(key => key === "mode").length > 1;

        return {
            isInvalidMode, isResetPasswordWithoutToken, hasResetTokenWithWrongMode, hasMultipleModes, isResetMode
        };
    }, [formMode, resetToken, searchParams]);

    // Remove invalid parameters from the URL
    const handleInvalidParams = useCallback(() => {
        const cleanedParams = createUrlParams([]);

        if (formMode) {
            cleanedParams.set("mode", formMode);
        }
        if (resetToken) {
            cleanedParams.set("reset_token", resetToken);
        }
        router.replace(`${pathname}?${cleanedParams.toString()}`);
    }, [createUrlParams, formMode, resetToken, router, pathname]);

    return { 
        resetToken, 
        formMode, 
        setUrlMode, 
        validateModeAndToken, 
        handleInvalidParams, 
        createUrlParams, 
        MODES
    };
};