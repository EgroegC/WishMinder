import { useEffect } from "react";
import type { AxiosInstance } from "axios";
import {
    registerServiceWorker,
    subscribeUser,
} from "@/services/push/push-notification";

export const usePushNotifications = (axiosInstance: AxiosInstance) => {

    useEffect(() => {
        async function setup() {
            try {
                const registration = await registerServiceWorker();
                const existingSub = await registration.pushManager.getSubscription();

                if (existingSub) {
                    await axiosInstance.post("/api/notification/subscribe", existingSub);
                    console.log("✅ Subscription re-sent to backend.");
                    return;
                }

                if (Notification.permission === "granted") {
                    const newSub = await subscribeUser(registration, axiosInstance);
                    console.log("✅ Subscribed:", newSub);
                }
            } catch (err) {
                console.error("❌ Push setup failed:", err);
            }
        }

        setup();
    }, [axiosInstance]);

    return;
};
