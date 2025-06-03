// hooks/usePush.ts
import { useEffect, useState } from "react";
import { AxiosInstance } from "axios";
import {
  registerServiceWorker,
  subscribeUser,
} from "@/services/push/push-notification";

export const usePushNotifications = (axiosInstance: AxiosInstance) => {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        const registration = await registerServiceWorker();
        const existingSub = await registration.pushManager.getSubscription();

        if (existingSub) {
          await axiosInstance.post("/api/notification/subscribe", existingSub);
          console.log("✅ Subscription re-sent to backend.");
          setShouldShowPrompt(false);
          return;
        }

        if (Notification.permission === "default") {
          setShouldShowPrompt(true);
        } else if (Notification.permission === "granted") {
          const newSub = await subscribeUser(registration, axiosInstance);
          console.log("✅ Subscribed:", newSub);
          setShouldShowPrompt(false);
        }
      } catch (err) {
        console.error("❌ Push setup failed:", err);
      }
    }

    setup();
  }, [axiosInstance]);

  return { shouldShowPrompt };
};
