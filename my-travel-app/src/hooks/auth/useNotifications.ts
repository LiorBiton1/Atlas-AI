import { useState, useCallback } from 'react';

type NotificationType = "success" | "error";
type Notification = { type: NotificationType; message: string };

export const useNotifications = () => {
    // Notification State
    const [notification, setNotification] = useState<Notification | null>(null);

    // Notification Handlers
    const handleNotification = useCallback((type: NotificationType, message: string) => {
        setNotification({ type, message });
    }, []);

    const clearNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return {
        notification,
        handleNotification,
        clearNotification
    };
};