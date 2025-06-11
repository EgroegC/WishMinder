import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const Notifications = () => {
    const axiosPrivate = useAxiosPrivate();
    usePushNotifications(axiosPrivate);

    const handleEnableNotifications = () => {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                location.reload();
            }
        });
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-xs">
            <CardHeader className="flex flex-row items-center gap-4">
                <Bell className="text-primary" />
                <div>
                    <CardTitle>Enable Notifications</CardTitle>
                    <CardDescription>
                        Get notified when your contacts have a nameday or birthday.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <Button onClick={handleEnableNotifications} disabled={Notification.permission === "granted"}>
                    {Notification.permission === "granted" ? "Notifications Enabled" : "Enable Notifications"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default Notifications;
