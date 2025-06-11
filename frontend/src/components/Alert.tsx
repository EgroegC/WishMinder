import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AlertMessage({
    status,
    title,
    message,
    onClose,
}: {
    status: "success" | "error";
    title?: string;
    message: string;
    onClose: () => void;
}) {
    return (
        <Alert
            variant={status === "error" ? "destructive" : undefined}
            className="relative pr-10"
        >
            <div className="absolute top-2 right-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-muted-foreground"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
            {status === "error" && <AlertCircleIcon className="h-5 w-5" />}
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
