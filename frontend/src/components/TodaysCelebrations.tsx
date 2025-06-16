import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleUserRound, MessageSquare, Phone } from "lucide-react";
import { parseISO } from "date-fns";
import { ScrollArea } from "./ui/scroll-area";

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

import { useNavigate } from "react-router-dom";

export default function CelebrationList({ celebrations, type }: Props) {
    const navigate = useNavigate();
    const isBirthday = type === "birthday";

    const handleMessage =
        (type: "birthday" | "nameday") => (contact: Celebration) => {
            console.log("phone: ", contact.phone);
            navigate("/messages", {
                state: {
                    type: type,
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
        <ScrollArea className="max-h-[150px] overflow-y-auto space-y-4 pr-1 rounded-sm border ">
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
                            className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-gray-900 border p-4 rounded-lg shadow-sm"
                        >
                            <div className="flex items-center gap-3 min-w-[200px]">
                                <CircleUserRound size={25} className="text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {c.name} {c.surname}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 mt-3 md:mt-0">
                                {isBirthday && age !== null && (
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">Turns</p>
                                        <Badge>{age} years</Badge>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => window.open(`tel:${c.phone}`)}
                                    >
                                        <Phone size={16} className="mr-1" />
                                        Call
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleMessage(type)(c)}
                                    >
                                        <MessageSquare size={16} className="mr-1" />
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
