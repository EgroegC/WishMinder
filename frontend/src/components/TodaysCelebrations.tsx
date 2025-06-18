import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleUserRound, MessageSquare, Phone } from "lucide-react";
import { parseISO } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";
import { useNavigate } from "react-router-dom";

type Celebration = {
    id: string;
    user_id: number;
    name: string;
    surname: string;
    phone: string;
    email?: string;
    birthdate?: string;
    type: "birthday" | "nameday";
};

interface Props {
    celebrations: Celebration[];
    type: "birthday" | "nameday";
}

export default function CelebrationList({ celebrations, type }: Props) {
    const navigate = useNavigate();
    const isBirthday = type === "birthday";

    const handleMessage =
        (type: "birthday" | "nameday") => (contact: Celebration) => {
            console.log("phone: ", contact.phone);
            navigate("/messages", {
                state: {
                    type,
                    phone: contact.phone,
                },
            });
        };

    if (!celebrations.length) {
        return (
            <p className="text-center text-muted-foreground">
                No {isBirthday ? "birthdays" : "namedays"} today.
            </p>
        );
    }

    return (
        <ScrollArea className="max-h-[150px] overflow-y-auto space-y-4 pr-1 rounded-sm border">
            <div className="space-y-4">
                {celebrations.map((c) => {
                    const today = new Date();
                    const date = c.birthdate ? parseISO(c.birthdate) : null;

                    let age: number | null = null;
                    if (isBirthday && date) {
                        age = today.getFullYear() - date.getFullYear();
                        const hasHadBirthday =
                            today.getMonth() > date.getMonth() ||
                            (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
                        if (!hasHadBirthday) age--;
                    }

                    return (
                        <div
                            key={c.id}
                            className="flex flex-col md:flex-row items-center md:items-center justify-between bg-white dark:bg-gray-900 border p-4 rounded-lg shadow-sm"
                        >
                            {/* Name + Icon */}
                            <div className="flex items-center gap-3 min-w-[200px]">
                                <CircleUserRound size={25} className="text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-gray-100 text-center md:text-left">
                                    {c.name} {c.surname}
                                </span>
                            </div>

                            {/* Age + Actions */}
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mt-4 md:mt-0 w-full md:w-auto">
                                {isBirthday && age !== null && (
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Turns</p>
                                        <Badge>{age} years</Badge>
                                    </div>
                                )}

                                <div className="flex flex-row gap-2 w-full max-w-xs mx-auto">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="flex-1 px-2 py-1 text-xs"
                                        onClick={() => window.open(`tel:${c.phone}`)}
                                    >
                                        <Phone size={14} className="mr-1" />
                                        Call
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex-1 px-2 py-1 text-xs"
                                        onClick={() => handleMessage(type)(c)}
                                    >
                                        <MessageSquare size={14} className="mr-1" />
                                        Message
                                    </Button>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
