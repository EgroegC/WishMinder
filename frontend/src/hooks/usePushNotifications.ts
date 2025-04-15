// hooks/usePush.ts
import { useEffect } from "react";
import { AxiosInstance } from "axios";
import {
    registerServiceWorker,
    subscribeUser,
  } from "@/services/push/push-notification";

export const usePushNotifications = (axiosInstance: AxiosInstance) => {
  useEffect(() => {
    async function setup() {
      try {
        const registration = await registerServiceWorker();
        const sub = await registration.pushManager.getSubscription();

        if (!sub) {
          const newSub = await subscribeUser(registration, axiosInstance);
          console.log("✅ Subscribed and sent to server:", newSub);
        } else {
          await axiosInstance.post("/api/subscribe", sub);
          console.log("✅ Existing subscription updated.");
        }
      } catch (err) {
        console.error("❌ Push setup failed:", err);
      }
    }

    setup();
  }, [axiosInstance]);
};
