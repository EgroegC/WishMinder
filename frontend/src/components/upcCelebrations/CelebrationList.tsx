import { Badge } from "@/components/ui/badge";
import { CircleUserRound } from "lucide-react";
import { format, parseISO } from "date-fns";

type SharedContact = {
    id: string;
    name: string;
    surname: string;
    birthdate?: string;
    nameday_date?: string;
};

interface Props {
    contactsByMonth: Record<number, SharedContact[]>;
    isBirthday: boolean;
}

export default function BirthdayList({ contactsByMonth, isBirthday }: Props) {
    const months = Object.entries(contactsByMonth);

    if (!months.length) {
        return (
            <p className="text-center text-muted-foreground">
                No upcoming {isBirthday ? "birthdays" : "namedays"}.
            </p>
        );
    }

    return (
        <div className="space-y-10 pr-2">
            {months.map(([monthIdx, contacts]) => {
                const monthName = new Date(2023, parseInt(monthIdx)).toLocaleString("default", {
                    month: "long",
                });

                return (
                    <div key={monthIdx}>
                        <div className="bg-muted text-center py-1 rounded-md text-sm font-medium text-muted-foreground mb-3">
                            {monthName}
                        </div>

                        <div className="space-y-4">
                            {contacts.map((c) => {
                                const dateRaw = isBirthday ? c.birthdate! : c.nameday_date!;
                                const date = parseISO(dateRaw);
                                const today = new Date();

                                let age = null;
                                if (isBirthday) {
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
                                        {/* Left: Avatar + Name */}
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <CircleUserRound size={25} className="text-gray-400" />
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {c.name} {c.surname}
                                            </span>
                                        </div>

                                        {/* Center: Date & Turns */}
                                        <div className="flex items-center gap-10 mt-3 md:mt-0">
                                            <div className="text-center">
                                                <p className="text-xs text-muted-foreground">Date</p>
                                                <p className="text-sm">{format(date, "dd MMM yyyy")}</p>
                                            </div>

                                            {isBirthday && age !== null && (
                                                <div className="text-center">
                                                    <p className="text-xs text-muted-foreground">Turns</p>
                                                    <Badge>{age} years</Badge>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
